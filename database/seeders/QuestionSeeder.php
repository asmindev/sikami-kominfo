<?php

namespace Database\Seeders;

use App\Models\Question;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            // Tata Kelola
            ['domain' => 'governance', 'indicator' => 'Kebijakan Keamanan', 'question_text' => 'Apakah instansi memiliki kebijakan keamanan informasi yang disahkan oleh pimpinan?', 'order' => 1],
            ['domain' => 'governance', 'indicator' => 'Struktur Organisasi', 'question_text' => 'Apakah terdapat forum atau tim khusus yang menangani keamanan informasi?', 'order' => 2],
            
            // Risiko
            ['domain' => 'risk_management', 'indicator' => 'Identifikasi Risiko', 'question_text' => 'Apakah instansi melakukan identifikasi risiko keamanan informasi secara berkala?', 'order' => 3],
            ['domain' => 'risk_management', 'indicator' => 'Mitigasi Risiko', 'question_text' => 'Apakah ada rencana mitigasi untuk setiap risiko keamanan yang teridentifikasi?', 'order' => 4],
            
            // Kerangka Kerja
            ['domain' => 'framework', 'indicator' => 'Standar Operasional', 'question_text' => 'Apakah prosedur operasional standar (SOP) keamanan informasi telah didokumentasikan?', 'order' => 5],
            ['domain' => 'framework', 'indicator' => 'Kepatuhan', 'question_text' => 'Apakah dilakukan audit kepatuhan terhadap penerapan keamanan informasi?', 'order' => 6],
            
            // Aset
            ['domain' => 'asset_management', 'indicator' => 'Inventarisasi Aset', 'question_text' => 'Apakah instansi mendaftar dan mengklasifikasikan semua aset informasi?', 'order' => 7],
            ['domain' => 'asset_management', 'indicator' => 'Perlindungan Aset', 'question_text' => 'Apakah ada mekanisme perlindungan khusus untuk aset informasi kritikal/rahasia?', 'order' => 8],
            
            // Teknologi
            ['domain' => 'technology', 'indicator' => 'Kendali Akses', 'question_text' => 'Apakah mekanisme autentikasi dan kendali akses jaringan telah diterapkan secara ketat?', 'order' => 9],
            ['domain' => 'technology', 'indicator' => 'Pemantauan Keamanan', 'question_text' => 'Apakah sistem log dan pemantauan keamanan jaringan aktif secara terus-menerus?', 'order' => 10],
        ];

        foreach ($questions as $item) {
            Question::firstOrCreate(
                ['domain' => $item['domain'], 'order' => $item['order']],
                $item
            );
        }
    }
}
