// To-do list vanilla JS + localStorage (Fondasi s5-l4).
// Logika murni (array) tanpa DOM supaya bisa dites dengan node;
// storage dilempar sebagai parameter supaya tes bisa pakai storage palsu.

const STORAGE_KEY = "todo-pocong";

function tambahTodo(list, teks, id) {
  const bersih = teks.trim();
  if (!bersih) return list;
  return [...list, { id, teks: bersih, selesai: false }];
}

function toggleTodo(list, id) {
  return list.map((t) => (t.id === id ? { ...t, selesai: !t.selesai } : t));
}

function hapusTodo(list, id) {
  return list.filter((t) => t.id !== id);
}

function filterTodo(list, mode) {
  if (mode === "aktif") return list.filter((t) => !t.selesai);
  if (mode === "selesai") return list.filter((t) => t.selesai);
  return list;
}

function hitungSisa(list) {
  return list.filter((t) => !t.selesai).length;
}

function simpan(storage, list) {
  storage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function muat(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

// --- Wiring DOM (browser saja) ---
if (typeof document !== "undefined") {
  let daftar = muat(window.localStorage);
  let mode = "semua";
  let idBerikut = daftar.reduce((m, t) => Math.max(m, t.id), 0) + 1;

  const elDaftar = document.querySelector("#daftar");
  const elSisa = document.querySelector("#sisa");
  const elInput = document.querySelector("#input-todo");

  function render() {
    elDaftar.textContent = "";
    for (const t of filterTodo(daftar, mode)) {
      const li = document.createElement("li");
      li.dataset.id = t.id;
      if (t.selesai) li.classList.add("selesai");

      const span = document.createElement("span");
      span.className = "teks";
      span.textContent = t.teks;

      const btnToggle = document.createElement("button");
      btnToggle.type = "button";
      btnToggle.dataset.aksi = "toggle";
      btnToggle.textContent = t.selesai ? "Batalkan" : "Selesai";

      const btnHapus = document.createElement("button");
      btnHapus.type = "button";
      btnHapus.dataset.aksi = "hapus";
      btnHapus.textContent = "Hapus";

      li.append(span, btnToggle, btnHapus);
      elDaftar.appendChild(li);
    }
    elSisa.textContent = `${hitungSisa(daftar)} tugas tersisa dari ${daftar.length}.`;
    document.querySelectorAll("[data-filter]").forEach((b) => {
      b.classList.toggle("aktif", b.dataset.filter === mode);
    });
  }

  document.querySelector("#form-todo").addEventListener("submit", (e) => {
    e.preventDefault();
    const sebelum = daftar.length;
    daftar = tambahTodo(daftar, elInput.value, idBerikut);
    if (daftar.length > sebelum) idBerikut += 1;
    elInput.value = "";
    simpan(window.localStorage, daftar);
    render();
  });

  // Delegasi event: satu listener di <ul>, aksi dibaca dari tombol yang diklik.
  elDaftar.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-aksi]");
    if (!btn) return;
    const li = e.target.closest("li");
    const id = Number(li.dataset.id);
    if (btn.dataset.aksi === "toggle") daftar = toggleTodo(daftar, id);
    if (btn.dataset.aksi === "hapus") daftar = hapusTodo(daftar, id);
    simpan(window.localStorage, daftar);
    render();
  });

  document.querySelectorAll("[data-filter]").forEach((b) => {
    b.addEventListener("click", () => {
      mode = b.dataset.filter;
      render();
    });
  });

  render();
}

if (typeof module !== "undefined") {
  module.exports = { tambahTodo, toggleTodo, hapusTodo, filterTodo, hitungSisa, simpan, muat, STORAGE_KEY };
}
