<?php
 
use App\Models\FaqEntry;
 
$faqs = [
    [
        'question' => 'Kada vyks dieninių studijų įvadinės paskaitos?',
        'answer' => 'Rugsėjo 2–5 d. Nuolatinių studijų (dieninio tvarkaraščio būdo) studentams. Grafiką rasite Moodle ir SMK socialiniuose tinkluose.',
        'category' => 'Schedules',
        'language' => 'lt',
    ],
    [
        'question' => 'Kada prasideda dieninių studijų paskaitos?',
        'answer' => 'Dieninių studijų paskaitos prasideda rugsėjo 8 d. Tvarkaraščius rasite Classter sistemoje.',
        'category' => 'Schedules',
        'language' => 'lt',
    ],
    [
        'question' => 'Kada vyks nuotolinių/sesijinių studijų įvadinės paskaitos?',
        'answer' => 'Rugsėjo 16–18 d., nuotoliniu būdu. Grafikas bus Moodle ir SMK socialiniuose tinkluose.',
        'category' => 'Schedules',
        'language' => 'lt',
    ],
    [
        'question' => 'Kada prasideda nuotolinių/sesijinių studijų paskaitos?',
        'answer' => 'Paskaitų pradžia — rugsėjo 22 d. Paskaitos vykdomos vieną savaitę per mėnesį.',
        'category' => 'Schedules',
        'language' => 'lt',
    ],
    [
        'question' => 'Kur rasti paskaitų tvarkaraštį?',
        'answer' => 'Paskaitų tvarkaraščius rasite Classter akademinėje studijų sistemoje (https://smk.classter.com/). Prisijungti galima nuo rugsėjo 1 d.',
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
        'answer' => 'Prisijungimai bus sukurti iki rugsėjo 1 d. Pranešimas apie tai bus atsiųstas į Jūsų asmeninį el. paštą.',
        'category' => 'Systems',
        'language' => 'lt',
    ],
    [
        'question' => 'Kaip gauti pažymą apie studijas?',
        'answer' => 'Pažymos užsakomos elektroniniu būdu per Moodle skiltį „Pažymų užsakymas“.',
        'category' => 'Admin',
        'language' => 'lt',
    ],
    [
        'question' => 'Kur kreiptis dėl techninių problemų (el. pašto, Classter)?',
        'answer' => 'Jei nepavyksta prisijungti iki rugsėjo 2 d., kreipkitės į Indrę Jonušaitę el. paštu indre.jonusaite@smk.lt arba tel. +370 602 28 237.',
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
        'answer' => 'Adresas: Kalvarijų g. 137E, Vilnius. Tel.: +370 604 73 280, +370 602 28 237. El. p.: vilnius@smk.lt',
        'category' => 'Contacts',
        'language' => 'lt',
    ],
];
 
foreach ($faqs as $faq) {
    FaqEntry::updateOrCreate(
        ['question' => $faq['question'], 'language' => $faq['language']],
        $faq
    );
}
 
echo "Knowledge Base seeded with " . count($faqs) . " entries.\n";
