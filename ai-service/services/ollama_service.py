"""
Ollama Service — Handles communication with local Ollama API.
"""
import httpx
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


class OllamaService:
    def __init__(self):
        settings = get_settings()
        self.base_url = settings.ollama_base_url
        self.model = settings.ollama_model or "llama3"

    @property
    def is_available(self) -> bool:
        # We check availability by trying to reach the Ollama tags endpoint
        try:
            # Note: This is a synchronous check for initialization purposes or health check
            # In a real async environment, we might want to cache this status
            return True # Assume available if configured for now, health check will verify
        except:
            return False

    async def chat(
        self,
        message: str,
        user_context: Optional[dict] = None,
        language: Optional[str] = None,
    ) -> dict:
        """Send a message to Ollama and get a response."""

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

        try:
            async with httpx.AsyncClient(timeout=300.0) as client:
                response = await client.post(
                    f"{self.base_url}/api/chat",
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": message}
                        ],
                        "stream": False
                    }
                )
                response.raise_for_status()
                data = response.json()
                
                response_text = data.get("message", {}).get("content", "")
                suggestions = self._generate_suggestions(message, detected_language)

                return {
                    "response": response_text,
                    "detected_language": detected_language,
                    "suggestions": suggestions,
                }

        except Exception as e:
            return {
                "response": f"I'm having trouble connecting to your local Ollama AI. Make sure Ollama is running at {self.base_url}. (Error: {str(e)[:100]})",
                "detected_language": detected_language,
                "suggestions": [],
            }

    def _generate_suggestions(self, message: str, language: str) -> list[str]:
        """Generate contextual follow-up suggestions."""
        suggestions_map = {
            "en": [
                "What are the library hours?",
                "How do I appeal a grade?",
                "Where can I find free rooms?",
            ],
            "lt": [
                "Kokios bibliotekos darbo valandos?",
                "Kaip apskųsti pažymį?",
                "Kur rasti laisvas auditorijas?",
            ],
            "ru": [
                "Какие часы работы библиотеки?",
                "Как обжаловать оценку?",
                "Где найти свободные аудитории?",
            ],
        }
        return suggestions_map.get(language, suggestions_map["en"])[:3]


# Singleton instance
ollama_service = OllamaService()
