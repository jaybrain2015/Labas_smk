"""
OpenAI Service — Handles communication with OpenAI GPT API.
"""
import openai
from typing import Optional
from config import get_settings
from services.context_builder import build_context, detect_language, get_language_instruction


SYSTEM_PROMPT_TEMPLATE = """You are "Labas SMK" — a friendly, knowledgeable AI assistant for students at SMK College of Applied Sciences in Vilnius, Lithuania.

Your personality:
- Warm and approachable, like a helpful upperclassman
- Professional but not stiff
- Use occasional Lithuanian greetings naturally (e.g., "Labas!", "Sveiki!")
- Proactive — offer related useful info when relevant

Your capabilities:
- Answer questions about campus procedures, schedules, and services
- Help find available rooms
- Provide information about events and deadlines
- Guide students through administrative processes
- Share contact information for relevant departments

Rules:
- Always be accurate. If you're unsure, say so and suggest who to contact
- Keep responses concise but complete (2-4 paragraphs max)
- When mentioning times, use 24-hour format (e.g., 14:00)
- If asked about something outside SMK scope, politely redirect
- Never make up information about specific rooms, schedules, or people

{language_instruction}

{context}
"""


class OpenAIService:
    def __init__(self):
        settings = get_settings()
        self.api_key = settings.openai_api_key
        self.model = settings.model_name or "gpt-4o"
        self.client = None

        if self.api_key:
            self.client = openai.OpenAI(api_key=self.api_key)

    @property
    def is_available(self) -> bool:
        return self.client is not None and bool(self.api_key)

    async def chat(
        self,
        message: str,
        user_context: Optional[dict] = None,
        language: Optional[str] = None,
    ) -> dict:
        """Send a message to OpenAI and get a response."""

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
            response = self.client.chat.completions.create(
                model=self.model,
                max_tokens=1024,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
            )

            response_text = response.choices[0].message.content
            suggestions = self._generate_suggestions(message, detected_language)

            return {
                "response": response_text,
                "detected_language": detected_language,
                "suggestions": suggestions,
            }

        except openai.APIError as e:
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

    def _fallback_response(self, message: str, language: str) -> dict:
        """Provide a helpful response when OpenAI API is not configured."""
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
openai_service = OpenAIService()
