<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Laporan Indeks KAMI - {{ $kamiIndex->user->name }}</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f4f4f4;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .total-score {
            font-size: 24px;
            font-weight: bold;
            margin-top: 20px;
            text-align: center;
        }

        .category {
            text-align: center;
            margin-top: 10px;
            font-size: 16px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h2>Laporan Hasil Penilaian Indeks KAMI</h2>
        <p>Berdasarkan KAMI 5.0 dan Bobot AHP</p>
    </div>

    <div>
        <strong>Profil Pimpinan</strong><br>
        Nama: {{ $kamiIndex->user->name }}<br>
        Jabatan: {{ $kamiIndex->user->position->name ?? '-' }}<br>
        NIP: {{ $kamiIndex->user->nip ?? '-' }}<br>
        Tanggal Penilaian: {{ \Carbon\Carbon::parse($kamiIndex->calculated_at)->translatedFormat('d F Y') }}<br>
    </div>

    <div class="total-score">
        Total Indeks KAMI: {{ number_format($kamiIndex->total_score, 2) }}
    </div>
    <div class="category">
        <strong>Status Kesiapan:</strong>
        @if($kamiIndex->category === 'not_eligible')
        Tidak Layak
        @elseif($kamiIndex->category === 'basic_framework')
        Pemenuhan Kerangka Kerja Dasar
        @elseif($kamiIndex->category === 'good_enough')
        Cukup Baik
        @else
        Baik
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th>Domain</th>
                <th>Skor Mentah</th>
                <th>Bobot AHP</th>
                <th>Skor Akhir</th>
            </tr>
        </thead>
        <tbody>
            @foreach($kamiIndex->domainScores as $score)
            <tr>
                <td>{{ $score->domain_name }}</td>
                <td>{{ number_format($score->domain_score, 2) }}</td>
                <td>{{ number_format($score->ahp_weight, 4) }}</td>
                <td>{{ number_format($score->final_score, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
