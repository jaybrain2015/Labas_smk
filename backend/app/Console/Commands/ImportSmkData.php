<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\StudyProgram;
use App\Models\Lecturer;
use App\Models\News;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Carbon;

class ImportSmkData extends Command
{
    protected $signature = 'smk:import {--clear : Clear existing data before import}';
    protected $description = 'Import scraped SMK data from JSON files';

    public function handle()
    {
        if ($this->option('clear')) {
            $this->info('Clearing existing data...');
            StudyProgram::truncate();
            Lecturer::truncate();
            News::truncate();
        }

        $importPath = storage_path('imports/smk_data');
        if (!File::exists($importPath)) {
            $this->error("Import path not found: {$importPath}");
            return 1;
        }

        $this->importPrograms($importPath);
        $this->importLecturers($importPath);
        $this->importNews($importPath);

        $this->info('Import completed successfully!');
    }

    protected function importPrograms($path)
    {
        $file = "{$path}/programs.json";
        if (!File::exists($file)) {
            $this->warn("Programs file not found: {$file}");
            return;
        }

        $data = json_decode(File::get($file), true);
        $this->info('Importing programs...');
        $bar = $this->output->createProgressBar(count($data));

        foreach ($data as $item) {
            StudyProgram::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'title' => $item['title'],
                    'language' => $item['language'],
                    'degree' => $item['degree'] ?? null,
                    'field' => $item['field'] ?? null,
                    'study_modes' => isset($item['mode']) ? (is_array($item['mode']) ? $item['mode'] : [$item['mode']]) : [],
                    'languages_of_instruction' => isset($item['language_of_instruction']) ? (is_array($item['language_of_instruction']) ? $item['language_of_instruction'] : [$item['language_of_instruction']]) : [],
                    'locations' => isset($item['location']) ? (is_array($item['location']) ? $item['location'] : [$item['location']]) : [],
                    'cost_semester_eur' => $item['cost']['per_semester_eur'] ?? null,
                    'cost_year_eur' => $item['cost']['per_year_eur'] ?? null,
                    'competencies' => $item['competencies'] ?? $item['modules'] ?? [],
                    'knowledge_areas' => $item['knowledge_areas'] ?? [],
                    'career_paths' => $item['career_paths'] ?? [$item['career_opportunities'] ?? ''],
                    'contact_email' => $item['contacts']['email'] ?? null,
                    'contact_phone' => $item['contacts']['phone'] ?? null,
                    'url' => $item['url'],
                    'scraped_at' => isset($item['scraped_at']) ? Carbon::parse($item['scraped_at']) : now(),
                ]
            );
            $bar->advance();
        }
        $bar->finish();
        $this->line('');
    }

    protected function importLecturers($path)
    {
        $file = "{$path}/lecturers.json";
        if (!File::exists($file)) {
            $this->warn("Lecturers file not found: {$file}");
            return;
        }

        $data = json_decode(File::get($file), true);
        $this->info('Importing lecturers...');
        $bar = $this->output->createProgressBar(count($data));

        foreach ($data as $item) {
            Lecturer::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'name' => $item['name'],
                    'language' => $item['language'] ?? 'lt',
                    'photo_url' => $item['photo_url'] ?? null,
                    'bio' => $item['bio'] ?? null,
                    'associated_programs' => $item['associated_programs'] ?? [],
                    'email' => $item['email'] ?? null,
                    'url' => $item['url'] ?? null,
                    'scraped_at' => isset($item['scraped_at']) ? Carbon::parse($item['scraped_at']) : now(),
                ]
            );
            $bar->advance();
        }
        $bar->finish();
        $this->line('');
    }

    protected function importNews($path)
    {
        $file = "{$path}/newss.json";
        if (!File::exists($file)) {
            $this->warn("News file not found: {$file}");
            return;
        }

        $data = json_decode(File::get($file), true);
        $this->info('Importing news...');
        $bar = $this->output->createProgressBar(count($data));

        foreach ($data as $item) {
            News::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'title' => $item['title'],
                    'language' => $item['language'] ?? 'lt',
                    'published_date' => $item['published_date'] ?? now()->toDateString(),
                    'body' => $item['body'] ?? '',
                    'dates' => $item['extracted_mentions']['dates'] ?? [],
                    'times' => $item['extracted_mentions']['times'] ?? [],
                    'rooms' => $item['extracted_mentions']['rooms'] ?? [],
                    'url' => $item['url'] ?? null,
                    'scraped_at' => isset($item['scraped_at']) ? Carbon::parse($item['scraped_at']) : now(),
                ]
            );
            $bar->advance();
        }
        $bar->finish();
        $this->line('');
    }
}
