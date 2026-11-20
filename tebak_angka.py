# Proyek Hari 2: game tebak angka (CLI)
# Jalankan: python3 tebak_angka.py — ketik tebakan sampai benar, atau 'q' untuk keluar
import random

def main():
    rahasia = random.randint(1, 20)
    percobaan = 0
    print("Tebak angka 1-20 (ketik 'q' untuk keluar).")
    while True:
        jawaban = input("Tebakanmu: ").strip()
        if jawaban.lower() == "q":
            print(f"Keluar. Angkanya adalah {rahasia}.")
            return
        try:
            tebak = int(jawaban)
        except ValueError:
            print("Itu bukan angka, coba lagi.")
            continue
        percobaan += 1
        if tebak == rahasia:
            print(f"Benar! Angkanya {rahasia}, ketemu dalam {percobaan} percobaan.")
            return
        elif tebak < rahasia:
            print("Terlalu kecil.")
        else:
            print("Terlalu besar.")

if __name__ == "__main__":
    main()
