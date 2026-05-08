<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        Event::create([
            'title' => 'Tarptautinis mokslinis simpoziumas: prasminga navigacija kintančiame pasaulyje',
            'description' => '2026 m. lapkričio 12 d. Vilniuje vyks tarptautinė mokslinė konferencija-simpoziumas, suvienysianti mokslininkus ir verslo lyderius iš Lietuvos bei užsienio.',
            'location' => 'Vilnius',
            'category' => 'academic',
            'starts_at' => Carbon::parse('2026-11-12 09:00:00'),
            'ends_at' => Carbon::parse('2026-11-12 17:00:00'),
            'image_path' => 'events/symposium.png',
            'is_editorial' => true,
            'editorial_category' => 'Akademinis',
        ]);

        Event::create([
            'title' => 'SMK kviečia sveikatos specialistus į tobulinimo kursus',
            'description' => 'SMK Aukštoji mokykla kviečia sveikatos priežiūros specialistus dalyvauti kvalifikacijos tobulinimo programose slaugytojams ir kitiems medikams.',
            'location' => 'Nuotoliu / SMK',
            'category' => 'academic',
            'starts_at' => Carbon::parse('2026-04-20 09:00:00'),
            'ends_at' => Carbon::parse('2026-06-12 17:00:00'),
            'image_path' => 'events/nursing_courses.png',
            'is_editorial' => true,
            'editorial_category' => 'Qualifications',
        ]);

        Event::create([
            'title' => '6-oji studentų mokslinė konferencija „FUTURE CREATORS"',
            'description' => 'Kviečiame moksleivius ir studentus dalyvauti tarptautinėje praktinėje konferencijoje, kuri vyks 2026 m. gegužės 14 d. nuotoliniu būdu.',
            'location' => 'Nuotoliu',
            'category' => 'academic',
            'starts_at' => Carbon::parse('2026-05-14 09:00:00'),
            'ends_at' => Carbon::parse('2026-05-14 17:00:00'),
            'image_path' => 'events/future_creators.png',
            'is_editorial' => true,
            'editorial_category' => 'Conference',
        ]);

        Event::create([
            'title' => 'Kviečiame jaunimą į stovyklas SMK Vilniuje, Kaune ir Klaipėdoje',
            'description' => 'SMK kviečia 10-17 metų moksleivius dalyvauti vasaros dienos stovyklose. Išbandyk save kūrybinėse veiklose ir susirask naujų draugų.',
            'location' => 'Vilnius, Kaunas, Klaipėda',
            'category' => 'social',
            'starts_at' => Carbon::parse('2026-06-29 09:00:00'),
            'ends_at' => Carbon::parse('2026-07-31 17:00:00'),
            'image_path' => 'events/summer_camps.png',
            'is_editorial' => true,
            'editorial_category' => 'Summer Camps',
        ]);

        Event::create([
            'title' => 'SMK study: work-life balance is the key to meaningful work and well-being',
            'description' => 'The SMK survey conducted in the spring of 2025 revealed important trends in the modern labor market - employee well-being and a meaningful work experience are becoming not only a personal goal, but also a strategic priority for organizations. The survey was conducted by Aleksandra Batuchina, Inga Medžiūnienė and Rron Lecaj, and 1,171 employees from various sectors in Lithuania participated in it.' . "\n\n" .
                'The results of the study show that employee well-being is closely linked to productivity, motivation and employee retention. However, Lithuania still lacks comprehensive research that would combine work design, factors of meaningful work and the importance of work-life balance.' . "\n\n" .
                'One of the key insights is that well-being is not just an individual responsibility. It is shaped by organizational culture, leadership, work organization, and social environment. The study revealed that employees most often experience meaning not through individual tasks, but through relationships, collaboration, and engagement.' . "\n\n" .
                'It has also been found that clearly defined tasks and the opportunity to apply various competencies enhance a sense of meaning and overall well-being. The positive relationship between knowledge requirements, professional development opportunities and social context confirms that job content is one of the most important factors in creating a quality work experience.' . "\n\n" .
                'Work-life balance is an important part of the research. Sufficient leisure time and vacations reduce the risk of burnout and strengthen psychological resources such as optimism and self-esteem.' . "\n\n" .
                'The final conclusion of the study is clear: organizations that systematically care about employee well-being achieve greater engagement, job satisfaction, better employee health, and stronger competitiveness in the marketplace.' . "\n\n" .
                'The study authors emphasize a simple but significant principle – "less and clearer is better." Investing in employee well-being is not just a moral choice – it is a strategically beneficial decision that creates value not only for organizations, but also for society as a whole.',
            'location' => 'SMK',
            'category' => 'academic',
            'starts_at' => Carbon::parse('2026-04-29 09:00:00'),
            'ends_at' => Carbon::parse('2026-04-29 17:00:00'),
            'image_path' => 'events/study_wellbeing.png',
            'is_editorial' => true,
            'editorial_category' => 'Science news',
        ]);

        Event::create([
            'title' => 'SMK Kompetencijų akademija: praktiniai mokymai verslui',
            'description' => 'Stiprink profesinius įgūdžius ir prisijunk prie naujo SMK Kompetencijų akademijos mokymų ciklo kuriantiems verslą.',
            'location' => 'SMK / Nuotoliu',
            'category' => 'academic',
            'starts_at' => Carbon::parse('2026-04-22 09:00:00'),
            'ends_at' => Carbon::parse('2026-12-09 17:00:00'),
            'image_path' => 'events/competencies.png',
            'is_editorial' => true,
            'editorial_category' => 'Competencies',
        ]);
    }
}
