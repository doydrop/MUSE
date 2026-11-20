// Catatan Pengeluaran — mini-app vanilla JS (Fondasi s5-project).
// Logika murni (array) tanpa DOM supaya bisa dites dengan node.

const STORAGE_KEY = "pengeluaran-pocong";

function tambahPengeluaran(list, item, id) {
  const nama = String(item.nama || "").trim();
  const jumlah = Number(item.jumlah);
  if (!nama) throw new Error("nama tidak boleh kosong");
  if (!Number.isFinite(jumlah) || jumlah <= 0) {
    throw new Error("jumlah harus angka lebih dari 0");
  }
  return [...list, { id, nama, jumlah, kategori: item.kategori || "Lainnya" }];
}

function hapusPengeluaran(list, id) {
  return list.filter((p) => p.id !== id);
}

function totalPengeluaran(list) {
  return list.reduce((s, p) => s + p.jumlah, 0);
}

function totalPerKategori(list) {
  const hasil = {};
  for (const p of list) {
    hasil[p.kategori] = (hasil[p.kategori] || 0) + p.jumlah;
  }
  return hasil;
}

function filterKategori(list, kategori) {
  if (!kategori || kategori === "semua") return list;
  return list.filter((p) => p.kategori === kategori);
}

function formatRupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
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
  let filter = "semua";
  let idBerikut = daftar.reduce((m, p) => Math.max(m, p.id), 0) + 1;

  const elDaftar = document.querySelector("#daftar-pengeluaran");
  const elTotal = document.querySelector("#total");
  const elPerKategori = document.querySelector("#per-kategori");
  const elError = document.querySelector("#pesan-error");

  function render() {
    elDaftar.textContent = "";
    for (const p of filterKategori(daftar, filter)) {
      const li = document.createElement("li");
      li.dataset.id = p.id;

      const span = document.createElement("span");
      span.className = "teks";
      span.textContent = `${p.nama} — ${formatRupiah(p.jumlah)} (${p.kategori})`;

      const btnHapus = document.createElement("button");
      btnHapus.type = "button";
      btnHapus.dataset.aksi = "hapus";
      btnHapus.textContent = "Hapus";

      li.append(span, btnHapus);
      elDaftar.appendChild(li);
    }

    const tampil = filterKategori(daftar, filter);
    elTotal.textContent = `Total${filter === "semua" ? "" : " (" + filter + ")"}: ${formatRupiah(totalPengeluaran(tampil))} dari ${tampil.length} item.`;

    elPerKategori.textContent = "";
    const perKat = totalPerKategori(daftar);
    for (const [kat, total] of Object.entries(perKat)) {
      const p = document.createElement("p");
      p.textContent = `${kat}: ${formatRupiah(total)}`;
      elPerKategori.appendChild(p);
    }
  }

  document.querySelector("#form-pengeluaran").addEventListener("submit", (e) => {
    e.preventDefault();
    elError.textContent = "";
    try {
      daftar = tambahPengeluaran(
        daftar,
        {
          nama: document.querySelector("#nama").value,
          jumlah: document.querySelector("#jumlah").value,
          kategori: document.querySelector("#kategori").value,
        },
        idBerikut,
      );
    } catch (err) {
      elError.textContent = err.message;
      return;
    }
    idBerikut += 1;
    document.querySelector("#nama").value = "";
    document.querySelector("#jumlah").value = "";
    simpan(window.localStorage, daftar);
    render();
  });

  elDaftar.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-aksi='hapus']");
    if (!btn) return;
    const id = Number(e.target.closest("li").dataset.id);
    daftar = hapusPengeluaran(daftar, id);
    simpan(window.localStorage, daftar);
    render();
  });

  document.querySelector("#filter-kategori").addEventListener("change", (e) => {
    filter = e.target.value;
    render();
  });

  render();
}

if (typeof module !== "undefined") {
  module.exports = {
    tambahPengeluaran,
    hapusPengeluaran,
    totalPengeluaran,
    totalPerKategori,
    filterKategori,
    formatRupiah,
    simpan,
    muat,
    STORAGE_KEY,
  };
}
