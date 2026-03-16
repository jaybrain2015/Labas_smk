from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    anthropic_api_key: str = ""
    openai_api_key: str = ""
    ollama_base_url: str = "http://host.docker.internal:11434"
    ollama_model: str = "llama3"
    backend_url: str = "http://backend:8000"
    model_name: str = ""  # Will be set based on available provider
    max_context_tokens: int = 2000
    debug: bool = False

    model_config = SettingsConfigDict(
        protected_namespaces=("settings_",),
        env_file=".env",
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
