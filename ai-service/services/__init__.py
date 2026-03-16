from .claude_service import claude_service
from .openai_service import openai_service
from .ollama_service import ollama_service
from config import get_settings

def get_ai_service():
    settings = get_settings()
    
    # Prioritize Claude, then OpenAI, then Ollama
    if settings.anthropic_api_key:
        return claude_service
    elif settings.openai_api_key:
        return openai_service
    elif settings.ollama_base_url:
        return ollama_service
    else:
        # Default fallback
        return claude_service

ai_service = get_ai_service()
