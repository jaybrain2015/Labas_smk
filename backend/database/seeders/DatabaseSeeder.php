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
            'password' => 'password',
            'student_id' => null,
            'role' => 'admin',
            'language_preference' => 'en',
        ]);


        $jonas = User::create([
            'name' => 'Jonas Kazlauskas',
            'email' => 'jonas@student.smk.lt',
            'password' => 'password',
            'student_id' => 'SMK-2024-001',
            'role' => 'student',
            'language_preference' => 'lt',
        ]);


        User::create([
            'name' => 'Elena Petrova',
            'email' => 'elena@student.smk.lt',
            'password' => 'password',
            'student_id' => 'SMK-2024-002',
            'role' => 'student',
            'language_preference' => 'ru',
        ]);


        User::create([
            'name' => 'Lukas Jonaitis',
            'email' => 'lukas@student.smk.lt',
            'password' => 'password',
            'student_id' => 'SMK-2024-003',
            'role' => 'student',
            'language_preference' => 'en',
        ]);


        User::create([
            'name' => 'Gabija Navickaitė',
            'email' => 'gabija@student.smk.lt',
            'password' => 'password',
            'student_id' => 'SMK-2024-004',
            'role' => 'student',
            'language_preference' => 'lt',
        ]);


        User::create([
            'name' => 'Deborah Okafor',
            'email' => 'deborah.tosin@stud.smk.lt',
            'password' => 'password',
            'student_id' => 'SMK-2024-005',
            'role' => 'student',
            'language_preference' => 'en',
            'course' => 'Bendrosios praktikos slauga',
            'year' => 1,
            'semester_level' => 1,
        ]);


        User::create([
            'name' => 'John Samuel Jonah',
            'email' => 'johnsamuel.jonah@stud.smk.lt',
            'password' => 'password',
            'student_id' => 'SMK-2024-006',
            'role' => 'student',
            'language_preference' => 'en',
            'course' => 'Programavimas ir multimedija',
            'year' => 1,
            'semester_level' => 1,
        ]);


        // ── Rooms ──────────────────────────────────────────
        $rooms = [];
        $roomData = [
            ['number' => '105', 'name' => 'Šokio studija', 'floor' => 1, 'building' => 'Vilnius Campus', 'capacity' => 45, 'type' => 'lecture'],
            ['number' => '108', 'name' => 'Auditorija', 'floor' => 1, 'building' => 'Vilnius Campus', 'capacity' => 30, 'type' => 'lecture'],
            ['number' => '109', 'name' => 'Slaugos laboratorija', 'floor' => 1, 'building' => 'Vilnius Campus', 'capacity' => 25, 'type' => 'lab'],
            ['number' => '110', 'name' => 'Slaugos laboratorija', 'floor' => 1, 'building' => 'Vilnius Campus', 'capacity' => 25, 'type' => 'lab'],
            ['number' => '111', 'name' => 'Didžioji salė', 'floor' => 1, 'building' => 'Vilnius Campus', 'capacity' => 150, 'type' => 'lecture'],
            ['number' => '201', 'name' => 'Auditorija', 'floor' => 2, 'building' => 'Vilnius Campus', 'capacity' => 40, 'type' => 'lecture'],
            ['number' => '202', 'name' => 'Estetinės kosmetologijos laboratorija', 'floor' => 2, 'building' => 'Vilnius Campus', 'capacity' => 28, 'type' => 'lab'],
            ['number' => '203', 'name' => 'Amfiteatrinė auditorija', 'floor' => 2, 'building' => 'Vilnius Campus', 'capacity' => 65, 'type' => 'lecture'],
            ['number' => '206', 'name' => 'Auditorija', 'floor' => 2, 'building' => 'Vilnius Campus', 'capacity' => 35, 'type' => 'lecture'],
            ['number' => '207', 'name' => 'Persirengimo kambarys', 'floor' => 2, 'building' => 'Vilnius Campus', 'capacity' => 10, 'type' => 'seminar'],
            ['number' => '208', 'name' => 'Auditorija', 'floor' => 2, 'building' => 'Vilnius Campus', 'capacity' => 35, 'type' => 'lecture'],
            ['number' => '210', 'name' => 'IT auditorija', 'floor' => 2, 'building' => 'Vilnius Campus', 'capacity' => 28, 'type' => 'lab'],
            ['number' => '218', 'name' => 'Auditorija', 'floor' => 2, 'building' => 'Vilnius Campus', 'capacity' => 30, 'type' => 'lecture'],
            ['number' => '219', 'name' => 'Auditorija', 'floor' => 2, 'building' => 'Vilnius Campus', 'capacity' => 30, 'type' => 'lecture'],
            ['number' => '220', 'name' => 'Auditorija', 'floor' => 2, 'building' => 'Vilnius Campus', 'capacity' => 30, 'type' => 'lecture'],
            ['number' => '221', 'name' => 'Auditorija', 'floor' => 2, 'building' => 'Vilnius Campus', 'capacity' => 30, 'type' => 'lecture'],
            ['number' => '222', 'name' => 'Estetinės kosmetologijos laboratorija', 'floor' => 2, 'building' => 'Vilnius Campus', 'capacity' => 25, 'type' => 'lab'],
            ['number' => '223', 'name' => 'IT auditorija', 'floor' => 2, 'building' => 'Vilnius Campus', 'capacity' => 28, 'type' => 'lab'],
            ['number' => '224', 'name' => 'IT auditorija', 'floor' => 2, 'building' => 'Vilnius Campus', 'capacity' => 28, 'type' => 'lab'],
            ['number' => '301', 'name' => 'Oranžinė auditorija', 'floor' => 3, 'building' => 'Vilnius Campus', 'capacity' => 45, 'type' => 'lecture'],
            ['number' => '303', 'name' => 'Junior Researchers\' Hub', 'floor' => 3, 'building' => 'Vilnius Campus', 'capacity' => 22, 'type' => 'seminar'],
            ['number' => '304', 'name' => 'Auditorija', 'floor' => 3, 'building' => 'Vilnius Campus', 'capacity' => 30, 'type' => 'lecture'],
            ['number' => '305', 'name' => 'Auditorija', 'floor' => 3, 'building' => 'Vilnius Campus', 'capacity' => 30, 'type' => 'lecture'],
            ['number' => '306', 'name' => 'Jo Mobile / Pakyra', 'floor' => 3, 'building' => 'Vilnius Campus', 'capacity' => 15, 'type' => 'seminar'],
            ['number' => '308', 'name' => 'Verslo pagrindas', 'floor' => 3, 'building' => 'Vilnius Campus', 'capacity' => 30, 'type' => 'lecture'],
            ['number' => '309', 'name' => 'Auditorija', 'floor' => 3, 'building' => 'Vilnius Campus', 'capacity' => 30, 'type' => 'lecture'],
            ['number' => '310', 'name' => 'Smart Tech Academy', 'floor' => 3, 'building' => 'Vilnius Campus', 'capacity' => 35, 'type' => 'lab'],
            ['number' => '311', 'name' => 'Administracija', 'floor' => 3, 'building' => 'Vilnius Campus', 'capacity' => 50, 'type' => 'lecture'],
            ['number' => '313', 'name' => 'Žalioji auditorija', 'floor' => 3, 'building' => 'Vilnius Campus', 'capacity' => 40, 'type' => 'lecture'],
            ['number' => '314', 'name' => 'Science Hub', 'floor' => 3, 'building' => 'Vilnius Campus', 'capacity' => 20, 'type' => 'seminar'],
            ['number' => '315', 'name' => 'Fiberta', 'floor' => 3, 'building' => 'Vilnius Campus', 'capacity' => 20, 'type' => 'seminar'],
            ['number' => '316', 'name' => 'Auditorija', 'floor' => 3, 'building' => 'Vilnius Campus', 'capacity' => 30, 'type' => 'lecture'],
            ['number' => '317', 'name' => 'Auditorija', 'floor' => 3, 'building' => 'Vilnius Campus', 'capacity' => 30, 'type' => 'lecture'],
            ['number' => '318', 'name' => 'Auditorija', 'floor' => 3, 'building' => 'Vilnius Campus', 'capacity' => 30, 'type' => 'lecture'],
            ['number' => '319', 'name' => 'Auditorija', 'floor' => 3, 'building' => 'Vilnius Campus', 'capacity' => 30, 'type' => 'lecture'],
            ['number' => '320', 'name' => 'Algorithmics LT', 'floor' => 3, 'building' => 'Vilnius Campus', 'capacity' => 25, 'type' => 'lab'],
            ['number' => '321', 'name' => 'Auditorija', 'floor' => 3, 'building' => 'Vilnius Campus', 'capacity' => 30, 'type' => 'lecture'],
        ];

        foreach ($roomData as $rd) {
            $rooms[$rd['number']] = Room::create($rd);
        }

        // ── Schedules ──────────────────────────────────────
        $scheduleData = [
            // Monday
            ['subject' => 'Web Technologies', 'lecturer' => 'Dr. Rimas Balčiūnas', 'room' => '301', 'day' => 'Monday', 'start' => '09:00', 'end' => '10:30', 'group' => 'SMK-2024-001'],
            ['subject' => 'Database Systems', 'lecturer' => 'Prof. Aida Verikaite', 'room' => '210', 'day' => 'Monday', 'start' => '10:45', 'end' => '12:15', 'group' => 'SMK-2024-001'],
            ['subject' => 'Business Communication', 'lecturer' => 'Lect. Dalia Martinkienė', 'room' => '108', 'day' => 'Monday', 'start' => '13:00', 'end' => '14:30', 'group' => 'SMK-2024-001'],
            ['subject' => 'Digital Marketing', 'lecturer' => 'Dr. Tomas Gudas', 'room' => '201', 'day' => 'Monday', 'start' => '09:00', 'end' => '10:30', 'group' => 'SMK-2024-002'],
            ['subject' => 'Statistics', 'lecturer' => 'Prof. Marius Stankevičius', 'room' => '203', 'day' => 'Monday', 'start' => '14:45', 'end' => '16:15', 'group' => 'SMK-2024-002'],

            // Tuesday
            ['subject' => 'Software Engineering', 'lecturer' => 'Dr. Andrius Vilkas', 'room' => '223', 'day' => 'Tuesday', 'start' => '09:00', 'end' => '10:30', 'group' => 'SMK-2024-001'],
            ['subject' => 'UX/UI Design', 'lecturer' => 'Lect. Justina Rimaitė', 'room' => '310', 'day' => 'Tuesday', 'start' => '10:45', 'end' => '12:15', 'group' => 'SMK-2024-001'],
            ['subject' => 'Project Management', 'lecturer' => 'Dr. Inga Šimkuvienė', 'room' => '303', 'day' => 'Tuesday', 'start' => '13:00', 'end' => '14:30', 'group' => 'SMK-2024-001'],
            ['subject' => 'Mobile App Development', 'lecturer' => 'Dr. Rimas Balčiūnas', 'room' => '301', 'day' => 'Tuesday', 'start' => '10:45', 'end' => '12:15', 'group' => 'SMK-2024-003'],

            // Wednesday
            ['subject' => 'Artificial Intelligence', 'lecturer' => 'Prof. Aida Verikaite', 'room' => '301', 'day' => 'Wednesday', 'start' => '09:00', 'end' => '10:30', 'group' => 'SMK-2024-001'],
            ['subject' => 'Cloud Computing', 'lecturer' => 'Dr. Karolis Petravičius', 'room' => '210', 'day' => 'Wednesday', 'start' => '10:45', 'end' => '12:15', 'group' => 'SMK-2024-001'],
            ['subject' => 'Data Visualization', 'lecturer' => 'Lect. Justina Rimaitė', 'room' => '320', 'day' => 'Wednesday', 'start' => '13:00', 'end' => '14:30', 'group' => 'SMK-2024-001'],
            ['subject' => 'Cybersecurity', 'lecturer' => 'Dr. Andrius Vilkas', 'room' => '223', 'day' => 'Wednesday', 'start' => '14:45', 'end' => '16:15', 'group' => 'SMK-2024-002'],

            // Thursday
            ['subject' => 'Web Technologies Lab', 'lecturer' => 'Dr. Rimas Balčiūnas', 'room' => '301', 'day' => 'Thursday', 'start' => '09:00', 'end' => '10:30', 'group' => 'SMK-2024-001'],
            ['subject' => 'Thesis Seminar', 'lecturer' => 'Prof. Marius Stankevičius', 'room' => '303', 'day' => 'Thursday', 'start' => '10:45', 'end' => '12:15', 'group' => 'SMK-2024-001'],
            ['subject' => 'Economics', 'lecturer' => 'Dr. Tomas Gudas', 'room' => '201', 'day' => 'Thursday', 'start' => '13:00', 'end' => '14:30', 'group' => 'SMK-2024-003'],
            ['subject' => '3D Modeling', 'lecturer' => 'Lect. Justina Rimaitė', 'room' => '105', 'day' => 'Thursday', 'start' => '14:45', 'end' => '16:15', 'group' => 'SMK-2024-004'],

            // Friday
            ['subject' => 'Database Systems Lab', 'lecturer' => 'Prof. Aida Verikaite', 'room' => '210', 'day' => 'Friday', 'start' => '09:00', 'end' => '10:30', 'group' => 'SMK-2024-001'],
            ['subject' => 'Entrepreneurship', 'lecturer' => 'Dr. Inga Šimkuvienė', 'room' => '111', 'day' => 'Friday', 'start' => '10:45', 'end' => '12:15', 'group' => 'SMK-2024-001'],
            ['subject' => 'Media Production', 'lecturer' => 'Lect. Dalia Martinkienė', 'room' => '310', 'day' => 'Friday', 'start' => '09:00', 'end' => '10:30', 'group' => 'SMK-2024-004'],

            // Extra classes for variety
            ['subject' => 'English for IT', 'lecturer' => 'Lect. Sarah Johnson', 'room' => '201', 'day' => 'Monday', 'start' => '14:45', 'end' => '16:15', 'group' => 'SMK-2024-001'],
            ['subject' => 'Computer Networks', 'lecturer' => 'Dr. Karolis Petravičius', 'room' => '223', 'day' => 'Wednesday', 'start' => '09:00', 'end' => '10:30', 'group' => 'SMK-2024-003'],
            ['subject' => 'Lithuanian Language', 'lecturer' => 'Lect. Ona Ramanauskaitė', 'room' => '108', 'day' => 'Thursday', 'start' => '09:00', 'end' => '10:30', 'group' => 'SMK-2024-002'],
            ['subject' => 'Video Editing', 'lecturer' => 'Lect. Justina Rimaitė', 'room' => '310', 'day' => 'Friday', 'start' => '13:00', 'end' => '14:30', 'group' => 'SMK-2024-004'],

            // ─── MARKETING (Marketingas ir reklamos kūrimas) ─────────────────
            // Monday
            ['subject' => 'Marketingo pagrindai',    'lecturer' => 'Dr. Tomas Gudas',         'room' => '203', 'day' => 'Monday',    'start' => '09:00', 'end' => '10:30', 'group' => 'MKT-2024-001'],
            ['subject' => 'Vartotojo elgsena',        'lecturer' => 'Lect. Simona Kasparavičiūtė', 'room' => '206', 'day' => 'Monday', 'start' => '10:45', 'end' => '12:15', 'group' => 'MKT-2024-001'],
            ['subject' => 'Vizualioji komunikacija',  'lecturer' => 'Lect. Dalia Martinkienė', 'room' => '313', 'day' => 'Monday',    'start' => '13:00', 'end' => '14:30', 'group' => 'MKT-2024-001'],
            ['subject' => 'Ekonomikos pagrindai',     'lecturer' => 'Prof. Marius Stankevičius','room' => '308', 'day' => 'Monday',   'start' => '14:45', 'end' => '16:15', 'group' => 'MKT-2024-001'],
            // Tuesday
            ['subject' => 'Kūrybinis rašymas',       'lecturer' => 'Lect. Simona Kasparavičiūtė', 'room' => '316', 'day' => 'Tuesday', 'start' => '09:00', 'end' => '10:30', 'group' => 'MKT-2024-001'],
            ['subject' => 'Vadybos pagrindai',        'lecturer' => 'Dr. Inga Šimkuvienė',     'room' => '304', 'day' => 'Tuesday',   'start' => '10:45', 'end' => '12:15', 'group' => 'MKT-2024-001'],
            ['subject' => 'Skaitmeninis marketingas', 'lecturer' => 'Dr. Tomas Gudas',         'room' => '203', 'day' => 'Tuesday',   'start' => '13:00', 'end' => '14:30', 'group' => 'MKT-2024-001'],
            // Wednesday
            ['subject' => 'Reklamos psichologija',    'lecturer' => 'Lect. Dalia Martinkienė', 'room' => '317', 'day' => 'Wednesday', 'start' => '09:00', 'end' => '10:30', 'group' => 'MKT-2024-001'],
            ['subject' => 'Rinkodaros tyrimai',       'lecturer' => 'Prof. Marius Stankevičius','room' => '306', 'day' => 'Wednesday', 'start' => '10:45', 'end' => '12:15', 'group' => 'MKT-2024-001'],
            ['subject' => 'Prekės ženklo valdymas',   'lecturer' => 'Dr. Tomas Gudas',         'room' => '203', 'day' => 'Wednesday', 'start' => '13:00', 'end' => '14:30', 'group' => 'MKT-2024-001'],
            // Thursday
            ['subject' => 'Ryšiai su visuomene',      'lecturer' => 'Lect. Simona Kasparavičiūtė', 'room' => '313', 'day' => 'Thursday', 'start' => '09:00', 'end' => '10:30', 'group' => 'MKT-2024-001'],
            ['subject' => 'Pardavimų valdymas',       'lecturer' => 'Dr. Inga Šimkuvienė',     'room' => '308', 'day' => 'Thursday',  'start' => '10:45', 'end' => '12:15', 'group' => 'MKT-2024-001'],
            ['subject' => 'Marketingo strategija',    'lecturer' => 'Dr. Tomas Gudas',         'room' => '203', 'day' => 'Thursday',  'start' => '13:00', 'end' => '14:30', 'group' => 'MKT-2024-001'],
            // Friday
            ['subject' => 'Medijų planavimas',        'lecturer' => 'Lect. Dalia Martinkienė', 'room' => '316', 'day' => 'Friday',    'start' => '09:00', 'end' => '10:30', 'group' => 'MKT-2024-001'],
            ['subject' => 'Integruota marketingo komunikacija', 'lecturer' => 'Prof. Marius Stankevičius', 'room' => '304', 'day' => 'Friday', 'start' => '10:45', 'end' => '12:15', 'group' => 'MKT-2024-001'],

            // ─── LOGISTICS (Transporto ir logistikos verslas) ─────────────────
            // Monday
            ['subject' => 'Logistikos pagrindai',       'lecturer' => 'Dr. Giedrius Vaičiūnas',   'room' => '305', 'day' => 'Monday',    'start' => '09:00', 'end' => '10:30', 'group' => 'LOG-2024-001'],
            ['subject' => 'Verslo ekonomika',            'lecturer' => 'Prof. Marius Stankevičius','room' => '318', 'day' => 'Monday',    'start' => '10:45', 'end' => '12:15', 'group' => 'LOG-2024-001'],
            ['subject' => 'Transporto sistemų apžvalga','lecturer' => 'Dr. Giedrius Vaičiūnas',   'room' => '309', 'day' => 'Monday',    'start' => '13:00', 'end' => '14:30', 'group' => 'LOG-2024-001'],
            // Tuesday
            ['subject' => 'Matematika verslo skaičiavimams', 'lecturer' => 'Prof. Jonas Jonauskas', 'room' => '319', 'day' => 'Tuesday', 'start' => '09:00', 'end' => '10:30', 'group' => 'LOG-2024-001'],
            ['subject' => 'Vadyba',                      'lecturer' => 'Dr. Inga Šimkuvienė',      'room' => '305', 'day' => 'Tuesday',  'start' => '10:45', 'end' => '12:15', 'group' => 'LOG-2024-001'],
            ['subject' => 'Sandėlių valdymas',           'lecturer' => 'Dr. Giedrius Vaičiūnas',   'room' => '309', 'day' => 'Tuesday',  'start' => '13:00', 'end' => '14:30', 'group' => 'LOG-2024-001'],
            // Wednesday
            ['subject' => 'Tiekimo grandinės valdymas',  'lecturer' => 'Dr. Giedrius Vaičiūnas',   'room' => '318', 'day' => 'Wednesday','start' => '09:00', 'end' => '10:30', 'group' => 'LOG-2024-001'],
            ['subject' => 'Tarptautinė prekyba',         'lecturer' => 'Prof. Marius Stankevičius','room' => '305', 'day' => 'Wednesday','start' => '10:45', 'end' => '12:15', 'group' => 'LOG-2024-001'],
            ['subject' => 'Muitinės procedūros',         'lecturer' => 'Lect. Rūta Norvilienė',    'room' => '309', 'day' => 'Wednesday','start' => '13:00', 'end' => '14:30', 'group' => 'LOG-2024-001'],
            // Thursday
            ['subject' => 'Logistikos pagrindai',        'lecturer' => 'Dr. Giedrius Vaičiūnas',   'room' => '319', 'day' => 'Thursday', 'start' => '09:00', 'end' => '10:30', 'group' => 'LOG-2024-001'],
            ['subject' => 'Transporto teisė',            'lecturer' => 'Lect. Rūta Norvilienė',    'room' => '305', 'day' => 'Thursday', 'start' => '10:45', 'end' => '12:15', 'group' => 'LOG-2024-001'],
            ['subject' => 'Verslo komunikacija',         'lecturer' => 'Dr. Inga Šimkuvienė',      'room' => '318', 'day' => 'Thursday', 'start' => '13:00', 'end' => '14:30', 'group' => 'LOG-2024-001'],
            // Friday
            ['subject' => 'Projektų vadyba',             'lecturer' => 'Dr. Inga Šimkuvienė',      'room' => '305', 'day' => 'Friday',   'start' => '09:00', 'end' => '10:30', 'group' => 'LOG-2024-001'],
            ['subject' => 'Transporto sistemų apžvalga', 'lecturer' => 'Dr. Giedrius Vaičiūnas',   'room' => '309', 'day' => 'Friday',   'start' => '10:45', 'end' => '12:15', 'group' => 'LOG-2024-001'],

            // ─── COSMETICS (Estetinė kosmetologija) ──────────────────────────
            // Monday
            ['subject' => 'Anatomija, fiziologija ir patologija', 'lecturer' => 'Dr. Rūta Janavičienė', 'room' => '202', 'day' => 'Monday', 'start' => '09:00', 'end' => '10:30', 'group' => 'KOS-2024-001'],
            ['subject' => 'Bendroji ir estetinė chemija',         'lecturer' => 'Prof. Algirdas Račas',  'room' => '202', 'day' => 'Monday', 'start' => '10:45', 'end' => '12:15', 'group' => 'KOS-2024-001'],
            ['subject' => 'Makiažo menas',                        'lecturer' => 'Lect. Vaida Adomavičienė','room' => '222', 'day' => 'Monday', 'start' => '13:00', 'end' => '14:30', 'group' => 'KOS-2024-001'],
            // Tuesday
            ['subject' => 'Mikrobiologija ir higiena',            'lecturer' => 'Dr. Rūta Janavičienė', 'room' => '202', 'day' => 'Tuesday','start' => '09:00', 'end' => '10:30', 'group' => 'KOS-2024-001'],
            ['subject' => 'Veido priežiūros pagrindai',           'lecturer' => 'Lect. Vaida Adomavičienė','room' => '222', 'day' => 'Tuesday','start' => '10:45', 'end' => '12:15', 'group' => 'KOS-2024-001'],
            ['subject' => 'Psichologija',                         'lecturer' => 'Prof. Algirdas Račas',  'room' => '207', 'day' => 'Tuesday','start' => '13:00', 'end' => '14:30', 'group' => 'KOS-2024-001'],
            // Wednesday
            ['subject' => 'Dermatologija',                        'lecturer' => 'Dr. Rūta Janavičienė', 'room' => '202', 'day' => 'Wednesday','start' => '09:00', 'end' => '10:30', 'group' => 'KOS-2024-001'],
            ['subject' => 'Rankų ir pėdų priežiūra',              'lecturer' => 'Lect. Vaida Adomavičienė','room' => '222', 'day' => 'Wednesday','start' => '10:45', 'end' => '12:15', 'group' => 'KOS-2024-001'],
            ['subject' => 'Sveika mityba ir sveika gyvensena',    'lecturer' => 'Lect. Jolanta Kazlauskienė','room' => '207', 'day' => 'Wednesday','start' => '13:00', 'end' => '14:30', 'group' => 'KOS-2024-001'],
            // Thursday
            ['subject' => 'Kosmetinė technologija ir aparatiniai metodai','lecturer' => 'Lect. Vaida Adomavičienė','room' => '202', 'day' => 'Thursday','start' => '09:00', 'end' => '10:30', 'group' => 'KOS-2024-001'],
            ['subject' => 'Kūno priežiūros metodikos',            'lecturer' => 'Lect. Vaida Adomavičienė','room' => '222', 'day' => 'Thursday','start' => '10:45', 'end' => '12:15', 'group' => 'KOS-2024-001'],
            ['subject' => 'Aromaterapija ir SPA procedūros',      'lecturer' => 'Lect. Jolanta Kazlauskienė','room' => '207', 'day' => 'Thursday','start' => '13:00', 'end' => '14:30', 'group' => 'KOS-2024-001'],
            // Friday
            ['subject' => 'Specializuotos kosmetinės procedūros', 'lecturer' => 'Lect. Vaida Adomavičienė','room' => '202', 'day' => 'Friday',   'start' => '09:00', 'end' => '10:30', 'group' => 'KOS-2024-001'],
            ['subject' => 'Gydomojo makiažo pagrindai',           'lecturer' => 'Dr. Rūta Janavičienė', 'room' => '222', 'day' => 'Friday',   'start' => '10:45', 'end' => '12:15', 'group' => 'KOS-2024-001'],
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

        // ── Nursing Year 1 Schedules (for Deborah) ─────────────
        $nursingSchedules = [
            // Monday — 3 subjects
            ['subject' => 'Anatomija ir histologija',     'lecturer' => 'Dr. Rūta Janavičienė',       'room' => '109', 'day' => 'Monday',    'start' => '09:00', 'end' => '10:30'],
            ['subject' => 'Fiziologija',                  'lecturer' => 'Dr. Rūta Janavičienė',       'room' => '109', 'day' => 'Monday',    'start' => '10:45', 'end' => '12:15'],
            ['subject' => 'Slaugos teorija ir pagrindai', 'lecturer' => 'Lect. Jolanta Kazlauskienė', 'room' => '110', 'day' => 'Monday',    'start' => '13:00', 'end' => '14:30'],

            // Tuesday — 3 subjects
            ['subject' => 'Bioetika',                     'lecturer' => 'Prof. Algirdas Račas',       'room' => '108', 'day' => 'Tuesday',   'start' => '09:00', 'end' => '10:30'],
            ['subject' => 'Mitybos pagrindai',            'lecturer' => 'Lect. Jolanta Kazlauskienė', 'room' => '110', 'day' => 'Tuesday',   'start' => '10:45', 'end' => '12:15'],
            ['subject' => 'Pirmoji medicinos pagalba',    'lecturer' => 'Dr. Rūta Janavičienė',       'room' => '109', 'day' => 'Tuesday',   'start' => '13:00', 'end' => '14:30'],

            // Wednesday — 2 subjects
            ['subject' => 'Anatomija ir histologija',     'lecturer' => 'Dr. Rūta Janavičienė',       'room' => '109', 'day' => 'Wednesday', 'start' => '09:00', 'end' => '10:30'],
            ['subject' => 'Užsienio kalba profesinei veiklai', 'lecturer' => 'Lect. Sarah Johnson',   'room' => '108', 'day' => 'Wednesday', 'start' => '10:45', 'end' => '12:15'],

            // Thursday — 3 subjects
            ['subject' => 'Slaugos teorija ir pagrindai', 'lecturer' => 'Lect. Jolanta Kazlauskienė', 'room' => '110', 'day' => 'Thursday',  'start' => '09:00', 'end' => '10:30'],
            ['subject' => 'Fiziologija',                  'lecturer' => 'Dr. Rūta Janavičienė',       'room' => '109', 'day' => 'Thursday',  'start' => '10:45', 'end' => '12:15'],
            ['subject' => 'Psichologija',                 'lecturer' => 'Prof. Algirdas Račas',       'room' => '108', 'day' => 'Thursday',  'start' => '13:00', 'end' => '14:30'],

            // Friday — 2 subjects
            ['subject' => 'Pirmoji medicinos pagalba',    'lecturer' => 'Dr. Rūta Janavičienė',       'room' => '109', 'day' => 'Friday',    'start' => '09:00', 'end' => '10:30'],
            ['subject' => 'Mitybos pagrindai',            'lecturer' => 'Lect. Jolanta Kazlauskienė', 'room' => '110', 'day' => 'Friday',    'start' => '10:45', 'end' => '12:15'],
        ];

        foreach ($nursingSchedules as $ns) {
            Schedule::create([
                'subject'        => $ns['subject'],
                'lecturer'       => $ns['lecturer'],
                'room_id'        => $rooms[$ns['room']]->id,
                'day_of_week'    => $ns['day'],
                'start_time'     => $ns['start'],
                'end_time'       => $ns['end'],
                'group_name'     => 'SMK-2024-005',
                'course'         => 'Bendrosios praktikos slauga',
                'year'           => 1,
                'semester_level' => 1,
                'semester'       => 'Spring 2026',
            ]);
        }

        // Programming and Multimedia Schedule (All Courses)
        $progSchedules = [
            // Monday
            ['subject' => 'Programavimo pagrindai (C#, Java)',           'lecturer' => 'Dr. Mindaugas Kurmis',       'room' => '210', 'day' => 'Monday',    'start' => '09:00', 'end' => '10:30'],
            ['subject' => 'Diskretioji matematika',                      'lecturer' => 'Prof. Jonas Jonauskas',      'room' => '201', 'day' => 'Monday',    'start' => '10:45', 'end' => '12:15'],
            ['subject' => 'Kompiuterių architektūra ir operacinės...','lecturer' => 'Dr. Tomas Ramanauskas',      'room' => '210', 'day' => 'Monday',    'start' => '13:00', 'end' => '14:30'],
            ['subject' => 'Duomenų struktūros ir algoritmai',          'lecturer' => 'Dr. Mindaugas Kurmis',       'room' => '210', 'day' => 'Monday',    'start' => '14:45', 'end' => '16:15'],
            // Tuesday
            ['subject' => 'Grafinis dizainas',                           'lecturer' => 'Lect. Vaida Adomavičienė',   'room' => '223', 'day' => 'Tuesday',   'start' => '09:00', 'end' => '10:30'],
            ['subject' => 'Užsienio kalba (anglų k.)',                 'lecturer' => 'Lect. Anna Smith',           'room' => '218', 'day' => 'Tuesday',   'start' => '10:45', 'end' => '12:15'],
            ['subject' => 'Objektinis programavimas',                    'lecturer' => 'Dr. Mindaugas Kurmis',       'room' => '210', 'day' => 'Tuesday',   'start' => '13:00', 'end' => '14:30'],
            ['subject' => 'Duomenų bazės',                               'lecturer' => 'Prof. Linas Petraitis',      'room' => '210', 'day' => 'Tuesday',   'start' => '14:45', 'end' => '16:15'],
            // Wednesday
            ['subject' => 'Tinklo technologijos',                        'lecturer' => 'Dr. Tomas Ramanauskas',      'room' => '210', 'day' => 'Wednesday', 'start' => '09:00', 'end' => '10:30'],
            ['subject' => 'Internetinių technologijų kūrimas',       'lecturer' => 'Lect. Eimantas Sabaliauskas','room' => '224', 'day' => 'Wednesday', 'start' => '10:45', 'end' => '12:15'],
            ['subject' => 'Multimedijos technologijos',                  'lecturer' => 'Lect. Vaida Adomavičienė',   'room' => '223', 'day' => 'Wednesday', 'start' => '13:00', 'end' => '14:30'],
            ['subject' => 'Vartotojo sąsajos dizainas (UI/UX)',      'lecturer' => 'Lect. Karolis Butkus',       'room' => '223', 'day' => 'Wednesday', 'start' => '14:45', 'end' => '16:15'],
            // Thursday
            ['subject' => 'Profesinė praktika',                          'lecturer' => 'Dr. Rūta Maciulevičienė',    'room' => '111', 'day' => 'Thursday',  'start' => '09:00', 'end' => '10:30'],
            ['subject' => 'Mobiliųjų aplikacijų kūrimas',                'lecturer' => 'Lect. Eimantas Sabaliauskas','room' => '224', 'day' => 'Thursday',  'start' => '10:45', 'end' => '12:15'],
            ['subject' => 'Debesų kompiuterija',                         'lecturer' => 'Prof. Linas Petraitis',      'room' => '210', 'day' => 'Thursday',  'start' => '13:00', 'end' => '14:30'],
            // Friday
            ['subject' => 'Programinės įrangos inžinerija',              'lecturer' => 'Dr. Mindaugas Kurmis',       'room' => '210', 'day' => 'Friday',    'start' => '09:00', 'end' => '10:30'],
            ['subject' => 'Baigiamoji praktika',                         'lecturer' => 'Dr. Rūta Maciulevičienė',    'room' => '111', 'day' => 'Friday',    'start' => '10:45', 'end' => '12:15'],
            ['subject' => 'Profesinio bakalauro baigiamasis darbas',     'lecturer' => 'Prof. Jonas Jonauskas',      'room' => '111', 'day' => 'Friday',    'start' => '13:00', 'end' => '14:30'],
        ];

        foreach ($progSchedules as $ps) {
            Schedule::create([
                'subject'        => $ps['subject'],
                'lecturer'       => $ps['lecturer'],
                'room_id'        => $rooms[$ps['room']]->id,
                'day_of_week'    => $ps['day'],
                'start_time'     => $ps['start'],
                'end_time'       => $ps['end'],
                'group_name'     => 'SMK-2024-006',
                'course'         => 'Programavimas ir multimedija',
                'year'           => 1,
                'semester_level' => 1,
                'semester'       => 'Spring 2026',
            ]);
        }

        // ── Events ──────────────────────────────────────────
        $this->call(EventSeeder::class);


        // ── FAQ Entries ──────────────────────────────────────
        $faqs = [
            // English
            ['question' => 'How do I connect to the campus WiFi?', 'answer' => 'Connect to "SMK-Student" network. Use your student portal credentials (email and password) to authenticate.', 'category' => 'it', 'language' => 'en'],
            ['question' => 'Where can I print documents?', 'answer' => 'Print stations are located on Floor 2 of Vilnius Campus, near rooms A205-A206. Use your student card to pay. B/W: €0.05/page, Color: €0.15/page.', 'category' => 'facilities', 'language' => 'en'],
            ['question' => 'How do I register for exams?', 'answer' => 'Log in to portal.smk.lt → Examinations → Register for Exams. Registration must be completed at least 5 working days before the exam date.', 'category' => 'academic', 'language' => 'en'],
            ['question' => 'What are the library hours?', 'answer' => 'Library (Building B, Floor 2): Mon-Fri 8:00-20:00, Saturday 10:00-16:00. Closed on Sundays and public holidays.', 'category' => 'facilities', 'language' => 'en'],
            ['question' => 'How do I appeal a grade?', 'answer' => 'Submit a written appeal to the Head of Department within 3 working days of grade publication. Include your name, student ID, course, exam date, and reason. Email: appeals@smk.lt', 'category' => 'academic', 'language' => 'en'],
            ['question' => 'Where is the IT support office?', 'answer' => 'IT Support is on Floor 3, Vilnius Campus, Room A305. Hours: Mon-Fri 8:30-17:00. Email: ithelpdesk@smk.lt, Phone ext: 1234.', 'category' => 'it', 'language' => 'en'],
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
