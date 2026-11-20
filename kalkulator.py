# Proyek Hari 2: kalkulator CLI
# Jalankan: python3 kalkulator.py — ketik "5 + 3", "10 / 4", dst. Ketik 'q' untuk keluar.
def hitung(a, op, b):
    if op == "+":
        return a + b
    if op == "-":
        return a - b
    if op == "*":
        return a * b
    if op == "/":
        if b == 0:
            raise ZeroDivisionError("tidak bisa dibagi nol")
        return a / b
    raise ValueError(f"operator tidak dikenal: {op}")

def main():
    print("Kalkulator: ketik 'angka operator angka', contoh: 5 + 3. 'q' untuk keluar.")
    while True:
        baris = input("> ").strip()
        if baris.lower() == "q":
            print("Selesai.")
            return
        bagian = baris.split()
        if len(bagian) != 3:
            print("Format salah. Contoh: 5 + 3")
            continue
        try:
            a = float(bagian[0])
            b = float(bagian[2])
            hasil = hitung(a, bagian[1], b)
        except ValueError as e:
            print(f"Input tidak valid: {e}")
            continue
        except ZeroDivisionError as e:
            print(f"Error: {e}")
            continue
        print(f"= {hasil}")

if __name__ == "__main__":
    main()
