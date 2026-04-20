<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        Event::truncate();

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
