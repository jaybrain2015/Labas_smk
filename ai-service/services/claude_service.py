"""
Claude AI Service — Handles communication with Anthropic Claude API.
"""
import anthropic
from anthropic import AsyncAnthropic

from typing import Optional
from config import get_settings
from services.context_builder import build_context, detect_language, get_language_instruction


SYSTEM_PROMPT_TEMPLATE = """You are Mia, a friendly and warm student advisor at SMK College of Applied Sciences. 

PERSONALITY:
- Warm, casual, and helpful — like a knowledgeable senior student.
- You speak naturally, like texting a friend, not reading from a website.
- You are always encouraging and patient.

RESPONSE RULES (follow these strictly):
1. Message Length: Your replies MUST be under 2-3 sentences maximum. Short and sweet.
2. No Formatting: NEVER use bullet points, numbered lists, or bold text (**). Use only plain text.
3. Gradual Info: Never dump all information at once. Provide just the most immediate part of the answer.
4. One Question: Always end every message with exactly one question to understand what the student actually needs or to guide them further.
5. Human Tone: Avoid generic "As an AI..." or formal robotic language. Speak like a friend.
6. One Topic: Never answer more than one topic per message.
7. Personalization: ALWAYS check the "Active User Profile" section in the context.
   - If the role is "ADMIN", greet them as an administrator (e.g., "Hello, Admin!") and acknowledge that they don't have a class schedule. Offer help with campus management tasks like checking rooms or upcoming events.
   - If the role is "STUDENT" (or not specified), use their name naturally (e.g., "Hi Jonas!"). If they ask about their class, use the provided "User's Today Schedule" immediately.
   - Never ask for info (name, campus, ID) that is already in the context.

CONVERSATION RULES:
- Remember what the student said earlier and build on your answers.
- Go deeper only when the student asks for more.
- If a student seems confused, slow down and simplify. Never repeat yourself.

KNOWLEDGE:
- Campuses: Vilnius (Kalvarijų g. 137E), Kaunas (Vilties g. 2), Klaipėda (Liepų g. 83B).
- Programs: Web Technologies, Economics, 3D Modeling, Lithuanian Language, and more.
- Detailed Info: For schedules/enrollment, direct them to smk.classter.com or the student office.
- Vilnius Office: +370 604 73 280 / vilnius@smk.lt
- Kaunas Office: +370 604 73 638 / milita.gradicke@smk.lt
- Klaipėda Office: +370 601 74 830 / alina.minceviciene@smk.lt

WHAT YOU NEVER DO:
- Never paste long lists of info unprompted.
- Never say "I don't have that information" without offering an alternative.
- Never use bold, bullets, or complex formatting.

SMK Knowledge Base (for facts):
{context}

{language_instruction}
"""


class ClaudeService:
    def __init__(self):
        settings = get_settings()
        self.api_key = settings.anthropic_api_key
        self.model = settings.model_name or "claude-sonnet-4-20250514"
        self.client = None

        if self.api_key:
            self.client = AsyncAnthropic(api_key=self.api_key)


    @property
    def is_available(self) -> bool:
        return self.client is not None and bool(self.api_key)

    async def chat(
        self,
        message: str,
        user_context: Optional[dict] = None,
        language: Optional[str] = None,
    ) -> dict:
        """Send a message to Claude and get a response."""

        # Detect language if not provided
        detected_language = language or detect_language(message)
        language_instruction = get_language_instruction(detected_language)

        # Build context
        context = build_context(user_context, detected_language)

        # Build system prompt
        system_prompt = SYSTEM_PROMPT_TEMPLATE.format(
            language_instruction=language_instruction,
            context=context,
        )

        if not self.is_available:
            return self._fallback_response(message, detected_language)

        try:
            response = await self.client.messages.create(
                model=self.model,
                max_tokens=1024,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": message}
                ],
            )

            response_text = response.content[0].text
            suggestions = self._generate_suggestions(message, detected_language)

            return {
                "response": response_text,
                "detected_language": detected_language,
                "suggestions": suggestions,
            }

        except anthropic.APIError as e:
            return {
                "response": f"I'm having trouble connecting to my AI backend right now. Please try again in a moment. (Error: {str(e)[:100]})",
                "detected_language": detected_language,
                "suggestions": [],
            }
        except Exception as e:
            return {
                "response": "Sorry, an unexpected error occurred. Please try again or contact IT support at ithelpdesk@smk.lt.",
                "detected_language": detected_language,
                "suggestions": [],
            }

    async def chat_stream(
        self,
        message: str,
        user_context: Optional[dict] = None,
        language: Optional[str] = None,
    ):
        """Stream a response from Claude."""
        detected_language = language or detect_language(message)
        language_instruction = get_language_instruction(detected_language)
        context = build_context(user_context, detected_language)

        system_prompt = SYSTEM_PROMPT_TEMPLATE.format(
            language_instruction=language_instruction,
            context=context,
        )

        if not self.is_available:
            # Yield the fallback response in a single chunk for simplicity
            fallback = self._fallback_response(message, detected_language)
            yield fallback["response"]
            return

        try:
            async with self.client.messages.stream(
                model=self.model,
                max_tokens=1024,
                system=system_prompt,
                messages=[{"role": "user", "content": message}],
            ) as stream:
                async for text in stream.text_stream:
                    yield text
        except Exception as e:
            yield f"\n\n[Error: {str(e)[:100]}]"

    async def translate(
        self,
        text: Optional[str] = None,
        data: Optional[dict] = None,
        items: Optional[list] = None,
        target_language: str = "en",
    ) -> dict:
        """Translate text, data, or multiple items to target language."""
        if not self.is_available:
            return {"error": "AI service not available", "translated": text or data or items}

        prompt = f"Translate the following to {target_language}. "
        if items:
            prompt += "Return ONLY a JSON object with a key 'translated_items' containing the list of translated objects. Keep the same keys. Do not add any explanation.\n\n"
            prompt += str(items)
        elif data:
            prompt += "Return ONLY the translated JSON object with the same keys. Do not add any explanation.\n\n"
            prompt += str(data)
        else:
            prompt += "Return ONLY the translated text.\n\n"
            prompt += text

        try:
            response = await self.client.messages.create(
                model=self.model,
                max_tokens=4096, # Increased for batch
                system="You are a professional translator for SMK College. Translate accurately while maintaining the original tone and format.",
                messages=[{"role": "user", "content": prompt}],
            )
            
            result = response.content[0].text
            import json
            import re
            
            if items or data:
                # Extract JSON block
                json_match = re.search(r'(\{.*\}|\[.*\])', result, re.DOTALL)
                if json_match:
                    try:
                        return {"translated": json.loads(json_match.group())}
                    except:
                        pass
                return {"translated": result}
            else:
                return {"translated": result}

        except Exception as e:
            return {"error": str(e), "translated": text or data or items}


    def _fallback_response(self, message: str, language: str) -> dict:
        """Provide a helpful response when Claude API is not configured."""
        responses = {
            "en": (
                "Hello! I'm the SMK Campus Assistant. The AI service is currently being configured. "
                "In the meantime, here are some helpful resources:\n\n"
                "📋 **Student Portal**: portal.smk.lt\n"
                "📧 **General Inquiries**: info@smk.lt\n"
                "🖥️ **IT Support**: ithelpdesk@smk.lt\n"
                "📞 **Phone**: +370 5 213 5426\n\n"
                "Administration hours: Mon-Fri 8:30-17:00"
            ),
            "lt": (
                "Labas! Aš esu SMK Kampuso Asistentas. AI paslauga šiuo metu yra konfigūruojama. "
                "Tuo tarpu štai keletas naudingų išteklių:\n\n"
                "📋 **Studentų portalas**: portal.smk.lt\n"
                "📧 **Bendri klausimai**: info@smk.lt\n"
                "🖥️ **IT pagalba**: ithelpdesk@smk.lt\n"
                "📞 **Telefonas**: +370 5 213 5426\n\n"
                "Administracijos darbo laikas: Pr-Pn 8:30-17:00"
            ),
            "ru": (
                "Здравствуйте! Я ассистент кампуса SMK. AI сервис в настоящее время настраивается. "
                "А пока вот несколько полезных ресурсов:\n\n"
                "📋 **Студенческий портал**: portal.smk.lt\n"
                "📧 **Общие вопросы**: info@smk.lt\n"
                "🖥️ **IT поддержка**: ithelpdesk@smk.lt\n"
                "📞 **Телефон**: +370 5 213 5426\n\n"
                "Часы работы администрации: Пн-Пт 8:30-17:00"
            ),
        }

        return {
            "response": responses.get(language, responses["en"]),
            "detected_language": language,
            "suggestions": [
                "What are the library hours?",
                "How do I register for exams?",
                "Where is the IT support office?",
            ],
        }

    def _generate_suggestions(self, message: str, language: str) -> list[str]:
        """Generate contextual follow-up suggestions."""
        suggestions_map = {
            "en": [
                "What are the library hours?",
                "How do I appeal a grade?",
                "Where can I find free rooms?",
                "When is the next exam session?",
            ],
            "lt": [
                "Kokios bibliotekos darbo valandos?",
                "Kaip apskųsti pažymį?",
                "Kur rasti laisvas auditorijas?",
                "Kada kita egzaminų sesija?",
            ],
            "ru": [
                "Какие часы работы библиотеки?",
                "Как обжаловать оценку?",
                "Где найти свободные аудитории?",
                "Когда следующая экзаменационная сессия?",
            ],
        }
        return suggestions_map.get(language, suggestions_map["en"])[:3]


# Singleton instance
claude_service = ClaudeService()
