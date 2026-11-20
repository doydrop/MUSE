// Tes logika JS (Fondasi s5-l3/l4/project) — dijalankan: node uji-js.cjs
// Gagal = assert melempar + exit bukan 0.
const assert = require("node:assert");

const kal = require("./kalkulator.js");
const todo = require("./todo.js");
const app = require("./mini-app.js");

// ---------- Kalkulator ----------
assert.strictEqual(kal.hitung(5, "+", 3), 8);
assert.strictEqual(kal.hitung(10, "-", 4), 6);
assert.strictEqual(kal.hitung(7, "*", 6), 42);
assert.strictEqual(kal.hitung(10, "/", 4), 2.5);
assert.throws(() => kal.hitung(10, "/", 0), /tidak bisa dibagi nol/);
assert.throws(() => kal.hitung(5, "x", 3), /operator tidak dikenal/);

let k = kal.buatKalkulator();
for (const d of "5") kal.inputDigit(k, d);
kal.inputOperator(k, "+");
for (const d of "3") kal.inputDigit(k, d);
kal.samaDengan(k);
assert.strictEqual(k.tampilan, "8", "5+3 harus 8");

// chaining: 5 + 3 + 2 = 10
k = kal.buatKalkulator();
kal.inputDigit(k, "5");
kal.inputOperator(k, "+");
kal.inputDigit(k, "3");
kal.inputOperator(k, "+"); // hitung 5+3 dulu, lanjut +
kal.inputDigit(k, "2");
kal.samaDengan(k);
assert.strictEqual(k.tampilan, "10");

// koma desimal: 0.5 + 0.25 = 0.75; titik kedua diabaikan
k = kal.buatKalkulator();
kal.inputDigit(k, "0");
kal.inputDigit(k, ".");
kal.inputDigit(k, "."); // diabaikan
kal.inputDigit(k, "5");
assert.strictEqual(k.tampilan, "0.5");
kal.inputOperator(k, "+");
kal.inputDigit(k, "0");
kal.inputDigit(k, ".");
kal.inputDigit(k, "2");
kal.inputDigit(k, "5");
kal.samaDengan(k);
assert.strictEqual(k.tampilan, "0.75");

// bagi nol lewat tombol = : lempar, wiring DOM yang menangkap jadi "Error"
k = kal.buatKalkulator();
kal.inputDigit(k, "1");
kal.inputDigit(k, "0");
kal.inputOperator(k, "/");
kal.inputDigit(k, "0");
assert.throws(() => kal.samaDengan(k), /tidak bisa dibagi nol/);

// C dan hapus digit
k = kal.buatKalkulator();
kal.inputDigit(k, "1");
kal.inputDigit(k, "2");
kal.inputDigit(k, "3");
kal.hapusDigit(k);
assert.strictEqual(k.tampilan, "12");
kal.bersihkan(k);
assert.strictEqual(k.tampilan, "0");
console.log("kalkulator: OK");

// ---------- To-do ----------
let list = [];
list = todo.tambahTodo(list, "  belajar JS  ", 1);
assert.strictEqual(list.length, 1);
assert.strictEqual(list[0].teks, "belajar JS");
assert.strictEqual(list[0].selesai, false);
list = todo.tambahTodo(list, "   ", 2); // kosong diabaikan
assert.strictEqual(list.length, 1);
list = todo.tambahTodo(list, "push ke GitHub", 2);
list = todo.toggleTodo(list, 1);
assert.strictEqual(list[0].selesai, true);
assert.strictEqual(todo.hitungSisa(list), 1);
assert.strictEqual(todo.filterTodo(list, "aktif").length, 1);
assert.strictEqual(todo.filterTodo(list, "selesai").length, 1);
assert.strictEqual(todo.filterTodo(list, "semua").length, 2);
list = todo.hapusTodo(list, 2);
assert.strictEqual(list.length, 1);

// storage palsu: simpan + muat bolak-balik
const fakeStorage = {
  data: {},
  setItem(k, v) { this.data[k] = v; },
  getItem(k) { return this.data[k] ?? null; },
};
todo.simpan(fakeStorage, list);
assert.deepStrictEqual(todo.muat(fakeStorage), list);
fakeStorage.setItem(todo.STORAGE_KEY, "bukan json {{");
assert.deepStrictEqual(todo.muat(fakeStorage), []);
console.log("todo: OK");

// ---------- Mini-app pengeluaran ----------
let keluar = [];
keluar = app.tambahPengeluaran(keluar, { nama: "Kopi", jumlah: 15000, kategori: "Makan" }, 1);
keluar = app.tambahPengeluaran(keluar, { nama: "Ojek", jumlah: 20000, kategori: "Transport" }, 2);
keluar = app.tambahPengeluaran(keluar, { nama: "Nasi padang", jumlah: 25000, kategori: "Makan" }, 3);
assert.strictEqual(app.totalPengeluaran(keluar), 60000);
assert.deepStrictEqual(app.totalPerKategori(keluar), { Makan: 40000, Transport: 20000 });
assert.strictEqual(app.filterKategori(keluar, "Makan").length, 2);
assert.strictEqual(app.filterKategori(keluar, "semua").length, 3);
assert.strictEqual(app.formatRupiah(15000), "Rp 15.000");
assert.throws(() => app.tambahPengeluaran(keluar, { nama: "", jumlah: 1000 }, 4), /nama/);
assert.throws(() => app.tambahPengeluaran(keluar, { nama: "X", jumlah: 0 }, 4), /jumlah/);
assert.throws(() => app.tambahPengeluaran(keluar, { nama: "X", jumlah: -5 }, 4), /jumlah/);
keluar = app.hapusPengeluaran(keluar, 2);
assert.strictEqual(app.totalPengeluaran(keluar), 40000);
app.simpan(fakeStorage, keluar);
assert.deepStrictEqual(app.muat(fakeStorage), keluar);
console.log("mini-app: OK");

console.log("Semua tes JS lolos.");
