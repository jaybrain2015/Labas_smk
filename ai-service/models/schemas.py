from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ChatMessage(BaseModel):
    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, description="User message")
    history: list[ChatMessage] = Field(default_factory=list, description="Prior conversation messages")
    user_context: Optional[dict] = Field(default=None, description="User context data")
    language: Optional[str] = Field(default=None, description="Preferred language code (en, lt, ru)")


class ChatResponse(BaseModel):
    response: str = Field(..., description="AI assistant response")
    detected_language: str = Field(default="en", description="Detected language of user message")
    suggestions: list[str] = Field(default_factory=list, description="Follow-up question suggestions")


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "smk-ai-service"
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    ai_available: bool = False
