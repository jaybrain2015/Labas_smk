"""
Labas SMK — AI Service
FastAPI microservice for AI-powered campus assistant.
"""
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from models.schemas import ChatRequest, ChatResponse, HealthResponse
from services import ai_service
from config import get_settings

app = FastAPI(
    title="Labas SMK AI Service",
    description="AI-powered campus assistant for SMK College",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="ok",
        ai_available=ai_service.is_available,
    )


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process a chat message and return an AI-powered response.

    The service:
    1. Detects the user's language (if not specified)
    2. Builds context from user data (schedule, rooms, events)
    3. Sends the message to Claude with SMK knowledge base
    4. Returns the response with language info and suggestions
    """
    result = await ai_service.chat(
        message=request.message,
        user_context=request.user_context,
        language=request.language,
    )

    return ChatResponse(
        response=result["response"],
        detected_language=result.get("detected_language", "en"),
        suggestions=result.get("suggestions", []),
    )


@app.post("/translate")
async def translate(request: dict):
    """
    Translate text or object to target language.
    Expects: {"text": "...", "target_language": "..."} or {"data": {...}, "target_language": "..."}
    """
    text = request.get("text")
    data = request.get("data")
    items = request.get("items")
    target_lang = request.get("target_language", "en")

    result = await ai_service.translate(
        text=text,
        data=data,
        items=items,
        target_language=target_lang,
    )

    return result


@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """
    Process a chat message and return an AI-powered streaming response.
    """
    async def generate():
        async for chunk in ai_service.chat_stream(
            message=request.message,
            user_context=request.user_context,
            language=request.language,
        ):
            yield chunk

    return StreamingResponse(generate(), media_type="text/plain")



@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "Labas SMK AI Service",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
    }
