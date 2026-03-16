"""
SMK Knowledge Base and Context Builder.
Builds the context that gets injected into Claude's system prompt.
"""
from typing import Optional


SMK_KNOWLEDGE_BASE = """
# SMK College of Applied Sciences — Knowledge Base

## Campus Layout
- **Building A** (Main Building): 4 floors
  - Floor 1: Reception, Administration offices, Student Services
  - Floor 2: Lecture halls (A201-A210), Faculty offices
  - Floor 3: Computer labs (A301-A308), IT department
  - Floor 4: Seminar rooms (A401-A406), Conference room
- **Building B**: 3 floors
  - Floor 1: Cafeteria, Student lounge, Bookstore
  - Floor 2: Library, Reading rooms, Study spaces
  - Floor 3: Media labs, Art studios

## Office Hours
- **Administration**: Mon-Fri, 8:30-17:00
- **Student Services**: Mon-Fri, 9:00-16:30
- **IT Support**: Mon-Fri, 8:30-17:00
- **Library**: Mon-Fri 8:00-20:00, Sat 10:00-16:00
- **Cafeteria**: Mon-Fri 7:30-18:00

## Academic Procedures

### Exam Registration
1. Log in to the Student Portal (portal.smk.lt)
2. Navigate to "Examinations" → "Register for Exams"
3. Select the exam session and desired subjects
4. Confirm registration at least 5 working days before the exam
5. You will receive a confirmation email

### Grade Appeals
1. Submit a written appeal within 3 working days after grade publication
2. Address the appeal to the Head of Department
3. Include: student name, ID, course name, exam date, and reason for appeal
4. Submit via Student Services office or email: appeals@smk.lt
5. Decision will be communicated within 5 working days

### Course Enrollment
1. Enrollment opens 2 weeks before each semester
2. Check prerequisites in the course catalog
3. Register through the Student Portal → "Course Registration"
4. Maximum 30 ECTS per semester for full-time students
5. Late enrollment requires department head approval

### Academic Calendar 2025-2026
- **Autumn Semester**: September 1 - December 20
- **Winter Exam Session**: January 6 - January 24
- **Spring Semester**: February 3 - May 16
- **Summer Exam Session**: May 19 - June 6
- **Holidays**: Dec 21 - Jan 5 (Winter), Jun 23-24 (Joninės)

## Contact Information
- **General Inquiries**: info@smk.lt, +370 5 213 5426
- **Admissions**: admissions@smk.lt
- **IT Helpdesk**: ithelpdesk@smk.lt, ext. 1234
- **Student Counseling**: counseling@smk.lt

## Student FAQs
- **WiFi**: Network "SMK-Student", credentials provided at enrollment
- **Printing**: Print stations on Floor 2 (Building A), use student card
- **Parking**: Free parking available behind Building B, first-come basis
- **Student Card**: Issued by Student Services, required for building access
- **Lost & Found**: Report to reception desk, Building A Floor 1
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

        if user_context.get("user_name"):
            parts.append(f"\n## Current User: {user_context['user_name']}")

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
