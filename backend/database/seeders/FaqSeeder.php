<?php
 
namespace Database\Seeders;
 
use Illuminate\Database\Seeder;
use App\Models\FaqEntry;
 
class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'Kada vyks dieninių studijų įvadinės paskaitos?',
                'answer' => 'Rugsėjo 2–5 d. Nuolatinių studijų (dieninio tvarkaraščio būdo) studentams susitikimai vyks kolegijoje. Tikslų grafiką rasite Moodle ir SMK socialiniuose tinkluose.',
                'category' => 'Schedule',
                'language' => 'lt',
            ],
            [
                'question' => 'Kada prasideda dieninių studijų paskaitos?',
                'answer' => 'Studijų dalykų paskaitos prasideda rugsėjo 8 d. Paskaitų tvarkaraščius rasite Classter akademinėje studijų sistemoje.',
                'category' => 'Schedule',
                'language' => 'lt',
            ],
            [
                'question' => 'Kada vyks nuotolinių/sesijinių studijų įvadinės paskaitos?',
                'answer' => 'I kurso nuolatinių studijų (sesijinio/nuotolinio tvarkaraščio būdo) studentams įvadinės paskaitos vyks rugsėjo 16–18 d., nuotoliniu būdu.',
                'category' => 'Schedule',
                'language' => 'lt',
            ],
            [
                'question' => 'Kada prasideda nuotolinių/sesijinių studijų paskaitos?',
                'answer' => 'Paskaitų pradžia sesijinių studijų studentams — rugsėjo 22 d. Paskaitos vykdomos vieną savaitę per mėnesį.',
                'category' => 'Schedule',
                'language' => 'lt',
            ],
            [
                'question' => 'Kur rasti paskaitų tvarkaraštį?',
                'answer' => 'Paskaitų tvarkaraščius rasite Classter akademinėje studijų sistemoje (https://smk.classter.com/). Prisijungti prie sistemos bus galima nuo rugsėjo 1 d.',
                'category' => 'Systems',
                'language' => 'lt',
            ],
            [
                'question' => 'Iki kada reikia sumokėti už studijas?',
                'answer' => 'Už rudens semestrą reikia sumokėti iki rugsėjo 1 d., už pavasario semestrą — iki vasario 1 d. Rekomenduojama mokėti per Classter paskyrą.',
                'category' => 'Finance',
                'language' => 'lt',
            ],
            [
                'question' => 'Kada bus sukurti studento el. pašto prisijungimai?',
                'answer' => 'Prisijungimai prie SMK studento el. pašto dėžutės bus sukurti iki rugsėjo 1 d. Informacija bus siunčiama į Jūsų asmeninį el. paštą.',
                'category' => 'Systems',
                'language' => 'lt',
            ],
            [
                'question' => 'Kaip gauti pažymą apie studijas?',
                'answer' => 'Pažymos užsakomos elektroniniu būdu per Moodle skiltį „Pažymų užsakymas“.',
                'category' => 'Administration',
                'language' => 'lt',
            ],
            [
                'question' => 'Kur kreiptis dėl techninių problemų (el. pašto, Classter, Moodle)?',
                'answer' => 'Jei iki rugsėjo 2 d. nepavyksta prisijungti, kreipkitės į Indrę Jonušaitę el. paštu indre.jonusaite@smk.lt arba tel. +370 602 28 237.',
                'category' => 'Support',
                'language' => 'lt',
            ],
            [
                'question' => 'Kokie yra SMK Klaipėdos studijų skyriaus kontaktai?',
                'answer' => 'Adresas: Liepų g. 83B, Klaipėda. Tel.: +370 601 74 830, +370 615 30 899. El. p.: alina.minceviciene@smk.lt',
                'category' => 'Contacts',
                'language' => 'lt',
            ],
            [
                'question' => 'Kokie yra SMK Kauno studijų skyriaus kontaktai?',
                'answer' => 'Adresas: Vilties g. 2, Kaunas. Tel.: +370 604 73 638, +370 601 78 253. El. p.: milita.gradicke@smk.lt',
                'category' => 'Contacts',
                'language' => 'lt',
            ],
            [
                'question' => 'Kokie yra SMK Vilniaus studijų skyriaus kontaktai?',
                'answer' => 'Adresas: Kalvarijų g. 137E, Vilnius. Tel.: +370 604 73 280, +370 602 28 237, +370 601 78 186, +370 604 02 143. El. p.: vilnius@smk.lt',
                'category' => 'Contacts',
                'language' => 'lt',
            ],
            [
                'question' => 'Koks yra SMK vykdymo būdas 2025–2026 m. m.?',
                'answer' => 'Dieninio tvarkaraščio būdas — kontaktinis (fiziškai kolegijoje). Sesijinio/nuotolinio tvarkaraščio būdas — nuotolinis (išskyrus Estetinę kosmetologiją, kuri vyksta hibridiniu būdu).',
                'category' => 'General',
                'language' => 'lt',
            ],
            [
                'question' => 'Ar SMK suteikia studento pažymėjimą?',
                'answer' => 'Taip, studentai gali išsiimti Lietuvos studento pažymėjimą (LSP) arba tarptautinį (ISIC). Daugiau informacijos: www.lsp.lt arba www.isic.lt.',
                'category' => 'General',
                'language' => 'lt',
            ],
            // English FAQs
            [
                'question' => 'When are the introductory lectures for on-campus students?',
                'answer' => 'September 2–5. For first-year full-time (on-campus) students. The schedule will be published on Moodle and SMK social media.',
                'category' => 'Schedules',
                'language' => 'en',
            ],
            [
                'question' => 'When do on-campus lectures start?',
                'answer' => 'Subject lectures start on September 8. Timetables are available in the Classter system.',
                'category' => 'Schedules',
                'language' => 'en',
            ],
            [
                'question' => 'When are the introductory lectures for remote/session-based students?',
                'answer' => 'September 16–18, held online. The schedule will be on Moodle and SMK social media.',
                'category' => 'Schedules',
                'language' => 'en',
            ],
            [
                'question' => 'When do remote/session-based lectures start?',
                'answer' => 'September 22. Lectures for session-based students are held one week per month.',
                'category' => 'Schedules',
                'language' => 'en',
            ],
            [
                'question' => 'Where can I find the lecture timetable?',
                'answer' => 'Lecture timetables are available in the Classter academic system (https://smk.classter.com/). Access starts on September 1.',
                'category' => 'Systems',
                'language' => 'en',
            ],
            [
                'question' => 'What is the tuition fee deadline?',
                'answer' => 'For the autumn semester by September 1; for the spring semester by February 1. Payment via Classter is recommended.',
                'category' => 'Finance',
                'language' => 'en',
            ],
            [
                'question' => 'When will my student email be created?',
                'answer' => 'Email accounts will be created by September 1. Notification is sent to your personal email.',
                'category' => 'Systems',
                'language' => 'en',
            ],
            [
                'question' => 'How can I get a study certificate?',
                'answer' => 'Certificates are ordered electronically through the "Certificate Ordering" section in Moodle.',
                'category' => 'Admin',
                'language' => 'en',
            ],
            [
                'question' => 'Who to contact for technical issues (email, Classter, Moodle)?',
                'answer' => 'If you cannot log in by September 2, contact Indrė Jonušaitė at indre.jonusaite@smk.lt or +370 602 28 237.',
                'category' => 'Support',
                'language' => 'en',
            ],
            [
                'question' => 'What are the SMK Klaipeda contact details?',
                'answer' => 'Address: Liepų g. 83B, Klaipėda. Tel: +370 601 74 830, +370 615 30 899. Email: alina.minceviciene@smk.lt',
                'category' => 'Contacts',
                'language' => 'en',
            ],
            [
                'question' => 'What are the SMK Kaunas contact details?',
                'answer' => 'Address: Vilties g. 2, Kaunas. Tel: +370 604 73 638, +370 601 78 253. Email: milita.gradicke@smk.lt',
                'category' => 'Contacts',
                'language' => 'en',
            ],
            [
                'question' => 'What are the SMK Vilnius contact details?',
                'answer' => 'Address: Kalvarijų g. 137E, Vilnius. Tel: +370 604 73 280, +370 602 28 237. Email: vilnius@smk.lt',
                'category' => 'Contacts',
                'language' => 'en',
            ],
        ];
 
        foreach ($faqs as $faq) {
            FaqEntry::updateOrCreate(
                ['question' => $faq['question'], 'language' => $faq['language']],
                $faq
            );
        }
    }
}
