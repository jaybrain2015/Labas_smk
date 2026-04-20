"""
SMK Knowledge Base and Context Builder.
Builds the context that gets injected into Claude's system prompt.
"""
from typing import Optional


SMK_KNOWLEDGE_BASE = """
# SMK Aukštoji Mokykla — Student Knowledge Base (2025–2026)

## Academic Calendar
- **Introductory Lectures (Full-time)**: September 2–5, 2025.
- **Introductory Lectures (Part-time/Online)**: September 16–18, 2025 (held online).
- **Semester Start (Full-time)**: September 8, 2025.
- **Semester Start (Part-time/Online)**: September 22, 2025.

## Study Modes
- **Full-time (Dieninis)**: Contact studies in college (some online lectures possible).
- **Part-time (Sesijinis/Nuotolinis)**: Online studies, held one week per month (except Aesthetic Cosmetology, which is hybrid).

## Electronic Resources
- **Classter (https://smk.classter.com/)**: Main academic system for schedules, grades, financial info, and semester plans. Access starts Sept 1st.
- **Moodle**: E-learning environment for course materials, study schedules, and certificate requests.
- **Student Email**: Official communication channel. Created by Sept 1st. Information sent only to @smk.lt addresses.

## Financial Information
- **Payment Deadlines**: Fall semester by September 1st; Spring semester by February 1st.
- **Payment Method**: Recommended via Classter account for faster processing.

## Campus Contacts
- **SMK Klaipėda**: Liepų g. 83B. Tel: +370 601 74 830, +370 615 30 899. Email: alina.minceviciene@smk.lt
- **SMK Kaunas**: Vilties g. 2. Tel: +370 604 73 638, +370 601 78 253. Email: milita.gradicke@smk.lt
- **SMK Vilnius**: Kalvarijų g. 137E. Tel: +370 604 73 280, +370 602 28 237. Email: vilnius@smk.lt
- **Technical Support**: indre.jonusaite@smk.lt, +370 602 28 237 (for IT login issues).

## General Info
- **Student ID**: LSP (www.lsp.lt) or ISIC (www.isic.lt).
- **Certificates**: Order via Moodle ("Pažymų užsakymas").
- **Special Needs**: Contact the Student Office for support.
"""


def build_context(
    user_context: Optional[dict] = None,
    language: Optional[str] = None,
) -> str:
    """Build a context string for the AI from user data."""
    parts = [SMK_KNOWLEDGE_BASE]

    if user_context:
        if user_context.get("schedule"):
            parts.append("\n## User's Today Schedule")
            for item in user_context["schedule"][:8]:
                parts.append(
                    f"- {item.get('start_time', '?')} - {item.get('end_time', '?')}: "
                    f"{item.get('subject', 'Unknown')} (Room {item.get('room_number', '?')}, "
                    f"Lecturer: {item.get('lecturer', '?')})"
                )

        if user_context.get("rooms"):
            parts.append("\n## Current Room Availability")
            for room in user_context["rooms"][:15]:
                status = room.get("status", "unknown")
                emoji = "🟢" if status == "free" else "🟡" if status == "soon" else "🔴"
                parts.append(f"- {emoji} Room {room.get('number', '?')}: {status.upper()}")

        if user_context.get("events"):
            parts.append("\n## Upcoming Events")
            for event in user_context["events"][:5]:
                parts.append(
                    f"- {event.get('title', '?')} — {event.get('starts_at', '?')} "
                    f"at {event.get('location', 'TBD')}"
                )

        if user_context.get("faqs"):
            parts.append("\n## Frequently Asked Questions (Knowledge Base)")
            for faq in user_context["faqs"]:
                parts.append(f"Q: {faq.get('question', '?')}\nA: {faq.get('answer', '?')}\n")

        if user_context.get("programs"):
            parts.append("\n## Available Study Programs")
            for prog in user_context["programs"][:10]:
                parts.append(f"- {prog.get('title', '?')} ({prog.get('degree', 'Bakalauras')}) — {prog.get('language', 'lt').upper()}")

        if user_context.get("lecturers"):
            parts.append("\n## SMK Faculty & Lecturers")
            for lec in user_context["lecturers"][:8]:
                programs_str = ", ".join(lec.get("programs", []))
                parts.append(f"- {lec.get('name', '?')}: Expert in {lec.get('bio', 'Academic fields')}. Teaches: {programs_str}")

        if user_context.get("news"):
            parts.append("\n## Recent Campus News")
            for news in user_context["news"][:5]:
                parts.append(f"- {news.get('title', '?')} ({news.get('published_date', '?')})")

        if user_context.get("user_name"):
            parts.append("\n## Active User Profile")
            parts.append(f"- **Name**: {user_context['user_name']}")
            if user_context.get("student_id"):
                parts.append(f"- **Student ID**: {user_context['student_id']}")
            if user_context.get("course"):
                parts.append(f"- **Study Program**: {user_context['course']}")
            if user_context.get("year"):
                parts.append(f"- **Year**: {user_context['year']}")
            if user_context.get("semester_level"):
                parts.append(f"- **Semester Level**: {user_context['semester_level']}")
            if user_context.get("role"):
                parts.append(f"- **Role**: {user_context['role'].upper()}")

            parts.append("\n> [!IMPORTANT]\n> You are currently interacting with the student described above. Use this information to personalize your responses and avoid asking them for these details.")

    context = "\n".join(parts)

    # Truncate to max tokens (rough estimate: 1 token ≈ 4 chars)
    max_chars = 2000 * 4
    if len(context) > max_chars:
        context = context[:max_chars] + "\n... (context truncated)"

    return context


def detect_language(text: str) -> str:
    """Simple heuristic language detection."""
    lt_indicators = [
        "ą", "č", "ę", "ė", "į", "š", "ų", "ū", "ž",
        "labas", "kaip", "kur", "kada", "kokia", "noriu",
        "galite", "prašau", "ačiū", "dėkui",
    ]
    ru_indicators = [
        "а", "б", "в", "г", "д", "е", "ж", "з", "и",
        "к", "л", "м", "н", "о", "п", "р", "с", "т",
        "у", "ф", "х", "ц", "ч", "ш", "щ", "ъ", "ы",
        "ь", "э", "ю", "я",
    ]

    text_lower = text.lower()

    # Check for Cyrillic characters → Russian
    if any(c in text_lower for c in ru_indicators):
        return "ru"

    # Check for Lithuanian-specific characters
    if any(c in text_lower for c in lt_indicators):
        return "lt"

    return "en"


def get_language_instruction(language: str) -> str:
    """Get language instruction for the system prompt."""
    instructions = {
        "lt": "Respond in Lithuanian (lietuvių kalba). Be natural and fluent.",
        "ru": "Respond in Russian (на русском языке). Be natural and fluent.",
        "en": "Respond in English.",
    }
    return instructions.get(language, instructions["en"])
