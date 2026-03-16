<?php

namespace Database\Seeders;

use App\Models\ChatSession;
use App\Models\Event;
use App\Models\FaqEntry;
use App\Models\Room;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Users ──────────────────────────────────────────
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@smk.lt',
            'password' => Hash::make('password'),
            'student_id' => null,
            'role' => 'admin',
            'language_preference' => 'en',
        ]);

        $jonas = User::create([
            'name' => 'Jonas Kazlauskas',
            'email' => 'jonas@student.smk.lt',
            'password' => Hash::make('password'),
            'student_id' => 'SMK-2024-001',
            'role' => 'student',
            'language_preference' => 'lt',
        ]);

        User::create([
            'name' => 'Elena Petrova',
            'email' => 'elena@student.smk.lt',
            'password' => Hash::make('password'),
            'student_id' => 'SMK-2024-002',
            'role' => 'student',
            'language_preference' => 'ru',
        ]);

        User::create([
            'name' => 'Lukas Jonaitis',
            'email' => 'lukas@student.smk.lt',
            'password' => Hash::make('password'),
            'student_id' => 'SMK-2024-003',
            'role' => 'student',
            'language_preference' => 'en',
        ]);

        User::create([
            'name' => 'Gabija Navickaitė',
            'email' => 'gabija@student.smk.lt',
            'password' => Hash::make('password'),
            'student_id' => 'SMK-2024-004',
            'role' => 'student',
            'language_preference' => 'lt',
        ]);

        // ── Rooms ──────────────────────────────────────────
        $rooms = [];
        $roomData = [
            ['number' => 'A201', 'floor' => 2, 'building' => 'Building A', 'capacity' => 60, 'type' => 'lecture', 'equipment' => ['Projector', 'Whiteboard', 'Sound System']],
            ['number' => 'A202', 'floor' => 2, 'building' => 'Building A', 'capacity' => 45, 'type' => 'lecture', 'equipment' => ['Projector', 'Whiteboard']],
            ['number' => 'A203', 'floor' => 2, 'building' => 'Building A', 'capacity' => 40, 'type' => 'lecture', 'equipment' => ['Projector', 'Whiteboard']],
            ['number' => 'A204', 'floor' => 2, 'building' => 'Building A', 'capacity' => 35, 'type' => 'seminar', 'equipment' => ['Projector', 'Whiteboard', 'Round Tables']],
            ['number' => 'A301', 'floor' => 3, 'building' => 'Building A', 'capacity' => 30, 'type' => 'lab', 'equipment' => ['Computers', 'Projector', 'Printer']],
            ['number' => 'A302', 'floor' => 3, 'building' => 'Building A', 'capacity' => 28, 'type' => 'lab', 'equipment' => ['Computers', 'Projector']],
            ['number' => 'A303', 'floor' => 3, 'building' => 'Building A', 'capacity' => 25, 'type' => 'lab', 'equipment' => ['Computers', 'Dual Monitors']],
            ['number' => 'A304', 'floor' => 3, 'building' => 'Building A', 'capacity' => 25, 'type' => 'lab', 'equipment' => ['Computers', 'Graphics Tablets']],
            ['number' => 'A401', 'floor' => 4, 'building' => 'Building A', 'capacity' => 20, 'type' => 'seminar', 'equipment' => ['Projector', 'Whiteboard']],
            ['number' => 'A402', 'floor' => 4, 'building' => 'Building A', 'capacity' => 20, 'type' => 'seminar', 'equipment' => ['Projector', 'Smart TV']],
            ['number' => 'A403', 'floor' => 4, 'building' => 'Building A', 'capacity' => 15, 'type' => 'seminar', 'equipment' => ['Whiteboard', 'Flip Chart']],
            ['number' => 'B201', 'floor' => 2, 'building' => 'Building B', 'capacity' => 50, 'type' => 'lecture', 'equipment' => ['Projector', 'Whiteboard', 'Recording System']],
            ['number' => 'B301', 'floor' => 3, 'building' => 'Building B', 'capacity' => 22, 'type' => 'lab', 'equipment' => ['Computers', 'Media Software', 'Green Screen']],
            ['number' => 'B302', 'floor' => 3, 'building' => 'Building B', 'capacity' => 20, 'type' => 'lab', 'equipment' => ['Drawing Tablets', 'Projector']],
            ['number' => 'B303', 'floor' => 3, 'building' => 'Building B', 'capacity' => 18, 'type' => 'lab', 'equipment' => ['3D Printers', 'Computers']],
        ];

        foreach ($roomData as $rd) {
            $rooms[$rd['number']] = Room::create($rd);
        }

        // ── Schedules ──────────────────────────────────────
        $scheduleData = [
            // Monday
            ['subject' => 'Web Technologies', 'lecturer' => 'Dr. Rimas Balčiūnas', 'room' => 'A301', 'day' => 'Monday', 'start' => '09:00', 'end' => '10:30', 'group' => 'SMK-2024-001'],
            ['subject' => 'Database Systems', 'lecturer' => 'Prof. Aida Verikaite', 'room' => 'A302', 'day' => 'Monday', 'start' => '10:45', 'end' => '12:15', 'group' => 'SMK-2024-001'],
            ['subject' => 'Business Communication', 'lecturer' => 'Lect. Dalia Martinkienė', 'room' => 'A204', 'day' => 'Monday', 'start' => '13:00', 'end' => '14:30', 'group' => 'SMK-2024-001'],
            ['subject' => 'Digital Marketing', 'lecturer' => 'Dr. Tomas Gudas', 'room' => 'A201', 'day' => 'Monday', 'start' => '09:00', 'end' => '10:30', 'group' => 'SMK-2024-002'],
            ['subject' => 'Statistics', 'lecturer' => 'Prof. Marius Stankevičius', 'room' => 'A202', 'day' => 'Monday', 'start' => '14:45', 'end' => '16:15', 'group' => 'SMK-2024-002'],

            // Tuesday
            ['subject' => 'Software Engineering', 'lecturer' => 'Dr. Andrius Vilkas', 'room' => 'A303', 'day' => 'Tuesday', 'start' => '09:00', 'end' => '10:30', 'group' => 'SMK-2024-001'],
            ['subject' => 'UX/UI Design', 'lecturer' => 'Lect. Justina Rimaitė', 'room' => 'A304', 'day' => 'Tuesday', 'start' => '10:45', 'end' => '12:15', 'group' => 'SMK-2024-001'],
            ['subject' => 'Project Management', 'lecturer' => 'Dr. Inga Šimkuvienė', 'room' => 'A401', 'day' => 'Tuesday', 'start' => '13:00', 'end' => '14:30', 'group' => 'SMK-2024-001'],
            ['subject' => 'Mobile App Development', 'lecturer' => 'Dr. Rimas Balčiūnas', 'room' => 'A301', 'day' => 'Tuesday', 'start' => '10:45', 'end' => '12:15', 'group' => 'SMK-2024-003'],

            // Wednesday
            ['subject' => 'Artificial Intelligence', 'lecturer' => 'Prof. Aida Verikaite', 'room' => 'A301', 'day' => 'Wednesday', 'start' => '09:00', 'end' => '10:30', 'group' => 'SMK-2024-001'],
            ['subject' => 'Cloud Computing', 'lecturer' => 'Dr. Karolis Petravičius', 'room' => 'A302', 'day' => 'Wednesday', 'start' => '10:45', 'end' => '12:15', 'group' => 'SMK-2024-001'],
            ['subject' => 'Data Visualization', 'lecturer' => 'Lect. Justina Rimaitė', 'room' => 'B301', 'day' => 'Wednesday', 'start' => '13:00', 'end' => '14:30', 'group' => 'SMK-2024-001'],
            ['subject' => 'Cybersecurity', 'lecturer' => 'Dr. Andrius Vilkas', 'room' => 'A303', 'day' => 'Wednesday', 'start' => '14:45', 'end' => '16:15', 'group' => 'SMK-2024-002'],

            // Thursday
            ['subject' => 'Web Technologies Lab', 'lecturer' => 'Dr. Rimas Balčiūnas', 'room' => 'A301', 'day' => 'Thursday', 'start' => '09:00', 'end' => '10:30', 'group' => 'SMK-2024-001'],
            ['subject' => 'Thesis Seminar', 'lecturer' => 'Prof. Marius Stankevičius', 'room' => 'A402', 'day' => 'Thursday', 'start' => '10:45', 'end' => '12:15', 'group' => 'SMK-2024-001'],
            ['subject' => 'Economics', 'lecturer' => 'Dr. Tomas Gudas', 'room' => 'A201', 'day' => 'Thursday', 'start' => '13:00', 'end' => '14:30', 'group' => 'SMK-2024-003'],
            ['subject' => '3D Modeling', 'lecturer' => 'Lect. Justina Rimaitė', 'room' => 'B303', 'day' => 'Thursday', 'start' => '14:45', 'end' => '16:15', 'group' => 'SMK-2024-004'],

            // Friday
            ['subject' => 'Database Systems Lab', 'lecturer' => 'Prof. Aida Verikaite', 'room' => 'A302', 'day' => 'Friday', 'start' => '09:00', 'end' => '10:30', 'group' => 'SMK-2024-001'],
            ['subject' => 'Entrepreneurship', 'lecturer' => 'Dr. Inga Šimkuvienė', 'room' => 'B201', 'day' => 'Friday', 'start' => '10:45', 'end' => '12:15', 'group' => 'SMK-2024-001'],
            ['subject' => 'Media Production', 'lecturer' => 'Lect. Dalia Martinkienė', 'room' => 'B301', 'day' => 'Friday', 'start' => '09:00', 'end' => '10:30', 'group' => 'SMK-2024-004'],

            // Extra classes for variety
            ['subject' => 'English for IT', 'lecturer' => 'Lect. Sarah Johnson', 'room' => 'A403', 'day' => 'Monday', 'start' => '14:45', 'end' => '16:15', 'group' => 'SMK-2024-001'],
            ['subject' => 'Computer Networks', 'lecturer' => 'Dr. Karolis Petravičius', 'room' => 'A303', 'day' => 'Wednesday', 'start' => '09:00', 'end' => '10:30', 'group' => 'SMK-2024-003'],
            ['subject' => 'Lithuanian Language', 'lecturer' => 'Lect. Ona Ramanauskaitė', 'room' => 'A204', 'day' => 'Thursday', 'start' => '09:00', 'end' => '10:30', 'group' => 'SMK-2024-002'],
            ['subject' => 'Video Editing', 'lecturer' => 'Lect. Justina Rimaitė', 'room' => 'B302', 'day' => 'Friday', 'start' => '13:00', 'end' => '14:30', 'group' => 'SMK-2024-004'],
        ];

        foreach ($scheduleData as $sd) {
            Schedule::create([
                'subject' => $sd['subject'],
                'lecturer' => $sd['lecturer'],
                'room_id' => $rooms[$sd['room']]->id,
                'day_of_week' => $sd['day'],
                'start_time' => $sd['start'],
                'end_time' => $sd['end'],
                'group_name' => $sd['group'],
                'semester' => 'Spring 2026',
            ]);
        }

        // ── Events ──────────────────────────────────────────
        $events = [
            ['title' => 'Spring Semester Opening Ceremony', 'description' => 'Official opening of the Spring 2026 semester with welcome speeches from the rector and faculty deans.', 'location' => 'Main Hall, Building A', 'starts_at' => '2026-02-03 10:00:00', 'ends_at' => '2026-02-03 12:00:00', 'category' => 'academic'],
            ['title' => 'Career Day 2026', 'description' => 'Meet top employers from the IT and business sectors. Bring your CV!', 'location' => 'Building B, All Floors', 'starts_at' => '2026-03-15 09:00:00', 'ends_at' => '2026-03-15 17:00:00', 'category' => 'social'],
            ['title' => 'Thesis Proposal Deadline', 'description' => 'Final deadline to submit your thesis proposal to your supervisor.', 'location' => 'Online (Student Portal)', 'starts_at' => '2026-03-01 23:59:00', 'ends_at' => null, 'category' => 'deadline'],
            ['title' => 'AI Workshop: Prompt Engineering', 'description' => 'Hands-on workshop on effective prompt engineering with Claude and GPT models.', 'location' => 'Lab A301', 'starts_at' => '2026-03-10 14:00:00', 'ends_at' => '2026-03-10 17:00:00', 'category' => 'academic'],
            ['title' => 'Student Basketball Tournament', 'description' => 'Inter-department basketball tournament. Sign up with your team of 5!', 'location' => 'Sports Hall', 'starts_at' => '2026-03-20 15:00:00', 'ends_at' => '2026-03-20 19:00:00', 'category' => 'social'],
            ['title' => 'Midterm Exam Period Starts', 'description' => 'Midterm examination period begins. Check your schedule for exact dates.', 'location' => 'Various Rooms', 'starts_at' => '2026-03-25 08:00:00', 'ends_at' => '2026-04-05 18:00:00', 'category' => 'academic'],
            ['title' => 'Course Registration Deadline', 'description' => 'Last day to register for elective courses next semester.', 'location' => 'Student Portal', 'starts_at' => '2026-04-15 23:59:00', 'ends_at' => null, 'category' => 'deadline'],
            ['title' => 'Hackathon: Smart Campus', 'description' => '24-hour hackathon to build solutions for campus improvement. Pizza included! 🍕', 'location' => 'Building A, Floor 3', 'starts_at' => '2026-04-10 18:00:00', 'ends_at' => '2026-04-11 18:00:00', 'category' => 'social'],
            ['title' => 'Guest Lecture: Tech Industry Trends', 'description' => 'Guest speaker from a leading tech company discusses current and future industry trends.', 'location' => 'Lecture Hall A201', 'starts_at' => '2026-04-20 13:00:00', 'ends_at' => '2026-04-20 15:00:00', 'category' => 'academic'],
            ['title' => 'Final Project Submission', 'description' => 'Deadline for ALL final year project submissions.', 'location' => 'Online (Student Portal)', 'starts_at' => '2026-05-10 23:59:00', 'ends_at' => null, 'category' => 'deadline'],
        ];

        foreach ($events as $e) {
            Event::create($e);
        }

        // ── FAQ Entries ──────────────────────────────────────
        $faqs = [
            // English
            ['question' => 'How do I connect to the campus WiFi?', 'answer' => 'Connect to "SMK-Student" network. Use your student portal credentials (email and password) to authenticate.', 'category' => 'it', 'language' => 'en'],
            ['question' => 'Where can I print documents?', 'answer' => 'Print stations are located on Floor 2 of Building A, near rooms A205-A206. Use your student card to pay. B/W: €0.05/page, Color: €0.15/page.', 'category' => 'facilities', 'language' => 'en'],
            ['question' => 'How do I register for exams?', 'answer' => 'Log in to portal.smk.lt → Examinations → Register for Exams. Registration must be completed at least 5 working days before the exam date.', 'category' => 'academic', 'language' => 'en'],
            ['question' => 'What are the library hours?', 'answer' => 'Library (Building B, Floor 2): Mon-Fri 8:00-20:00, Saturday 10:00-16:00. Closed on Sundays and public holidays.', 'category' => 'facilities', 'language' => 'en'],
            ['question' => 'How do I appeal a grade?', 'answer' => 'Submit a written appeal to the Head of Department within 3 working days of grade publication. Include your name, student ID, course, exam date, and reason. Email: appeals@smk.lt', 'category' => 'academic', 'language' => 'en'],
            ['question' => 'Where is the IT support office?', 'answer' => 'IT Support is on Floor 3, Building A, Room A305. Hours: Mon-Fri 8:30-17:00. Email: ithelpdesk@smk.lt, Phone ext: 1234.', 'category' => 'it', 'language' => 'en'],
            ['question' => 'Is there parking available?', 'answer' => 'Free parking is available behind Building B, on a first-come, first-served basis. Student card required to enter the barrier. No reserved spots.', 'category' => 'facilities', 'language' => 'en'],

            // Lithuanian
            ['question' => 'Kaip prisijungti prie WiFi?', 'answer' => 'Prisijunkite prie "SMK-Student" tinklo. Naudokite savo studentų portalo prisijungimo duomenis (el. paštą ir slaptažodį).', 'category' => 'it', 'language' => 'lt'],
            ['question' => 'Kur galiu spausdinti dokumentus?', 'answer' => 'Spausdinimo stotys yra A pastato 2-ame aukšte, šalia A205-A206 kabinetų. Mokėjimui naudokite studento pažymėjimą. Nespalvotas: 0,05 €/psl., Spalvotas: 0,15 €/psl.', 'category' => 'facilities', 'language' => 'lt'],
            ['question' => 'Kaip registruotis egzaminams?', 'answer' => 'Prisijunkite portal.smk.lt → Egzaminai → Registracija egzaminams. Registracija turi būti atlikta ne vėliau kaip 5 darbo dienos prieš egzamino datą.', 'category' => 'academic', 'language' => 'lt'],

            // Russian
            ['question' => 'Как подключиться к WiFi кампуса?', 'answer' => 'Подключитесь к сети "SMK-Student". Используйте учетные данные студенческого портала (email и пароль) для аутентификации.', 'category' => 'it', 'language' => 'ru'],
            ['question' => 'Где можно распечатать документы?', 'answer' => 'Станции печати расположены на 2 этаже здания A, рядом с кабинетами A205-A206. Используйте студенческую карту для оплаты. Ч/Б: €0.05/стр., Цветная: €0.15/стр.', 'category' => 'facilities', 'language' => 'ru'],
            ['question' => 'Как зарегистрироваться на экзамены?', 'answer' => 'Войдите на portal.smk.lt → Экзамены → Регистрация на экзамены. Регистрация должна быть завершена не менее чем за 5 рабочих дней до даты экзамена.', 'category' => 'academic', 'language' => 'ru'],
        ];

        foreach ($faqs as $f) {
            FaqEntry::create($f);
        }

        // ── Chat Session (demo) ──────────────────────────
        ChatSession::create([
            'user_id' => $jonas->id,
            'messages' => [
                ['role' => 'user', 'content' => 'Labas! What rooms are free right now?', 'timestamp' => now()->subHours(2)->toISOString()],
                ['role' => 'assistant', 'content' => 'Labas, Jonas! 👋 Let me check the current room availability for you. Based on the schedule, here are the currently free rooms: A203, A204, A401, A403, B302, and B303. Would you like details about any specific room?', 'timestamp' => now()->subHours(2)->addSeconds(3)->toISOString()],
            ],
        ]);
    }
}
