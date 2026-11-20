# Tebak Angka + Kalkulator CLI

Dua program Python kecil dari latihan Fondasi Tahap 2 (Space Coder).
Dibangun dari file kosong — repo GitHub pertamaku yang rapi.

## Isi

- `tebak_angka.py` — game tebak angka 1–20. Komputer simpan satu angka
  rahasia, kamu tebak sampai benar. Tiap tebakan dibalas petunjuk
  "terlalu kecil" atau "terlalu besar". Ketik `q` untuk keluar.
- `kalkulator.py` — kalkulator baris perintah. Ketik `5 + 3` lalu Enter.
  Operator: `+ - * /`. Bagi nol dan operator asing ditangani tanpa crash.
  Ketik `q` untuk keluar.

## Cara jalanin

Butuh Python 3 saja, tanpa library tambahan.

```bash
python3 tebak_angka.py
python3 kalkulator.py
```

## Struktur

```
.
├── README.md
├── tebak_angka.py
└── kalkulator.py
```

## Catatan belajar

- Logika hitung dipisah dari baca/tulis layar (`hitung()` di kalkulator,
  `main()` membungkus loop) supaya gampang dites.
- Input yang bukan angka tidak dihitung sebagai percobaan dan tidak
  membuat program crash (`try/except ValueError`).
- Riwayat commit repo ini sengaja kecil-kecil dan bisa dibaca:
  satu commit = satu perubahan yang jelas.
