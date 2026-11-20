// Kalkulator vanilla JS (Fondasi s5-l3).
// Logika murni tanpa DOM supaya bisa dites dengan node;
// wiring DOM hanya jalan kalau `document` ada (di browser).

function hitung(a, op, b) {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") {
    if (b === 0) throw new Error("tidak bisa dibagi nol");
    return a / b;
  }
  throw new Error("operator tidak dikenal: " + op);
}

function buatKalkulator() {
  return {
    tampilan: "0",
    nilaiSebelumnya: null,
    operator: null,
    tungguOperandBaru: false,
  };
}

function inputDigit(k, digit) {
  if (k.tungguOperandBaru) {
    k.tampilan = digit === "." ? "0." : digit;
    k.tungguOperandBaru = false;
    return;
  }
  if (digit === "." && k.tampilan.includes(".")) return;
  k.tampilan = k.tampilan === "0" && digit !== "." ? digit : k.tampilan + digit;
}

function inputOperator(k, op) {
  if (k.operator && !k.tungguOperandBaru) {
    samaDengan(k);
  }
  k.nilaiSebelumnya = parseFloat(k.tampilan);
  k.operator = op;
  k.tungguOperandBaru = true;
}

function samaDengan(k) {
  if (k.operator === null || k.nilaiSebelumnya === null) return;
  const hasil = hitung(k.nilaiSebelumnya, k.operator, parseFloat(k.tampilan));
  k.tampilan = String(hasil);
  k.nilaiSebelumnya = null;
  k.operator = null;
  k.tungguOperandBaru = true;
}

function bersihkan(k) {
  k.tampilan = "0";
  k.nilaiSebelumnya = null;
  k.operator = null;
  k.tungguOperandBaru = false;
}

function hapusDigit(k) {
  if (k.tungguOperandBaru) return;
  k.tampilan = k.tampilan.length > 1 ? k.tampilan.slice(0, -1) : "0";
}

// --- Wiring DOM (browser saja) ---
if (typeof document !== "undefined") {
  const k = buatKalkulator();
  const layar = document.querySelector("#layar");

  function tampilkan() {
    layar.textContent = k.tampilan;
  }

  function aman(fn) {
    try {
      fn();
    } catch (e) {
      k.tampilan = "Error";
      k.nilaiSebelumnya = null;
      k.operator = null;
      k.tungguOperandBaru = true;
    }
    tampilkan();
  }

  document.querySelectorAll("[data-digit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      inputDigit(k, btn.dataset.digit);
      tampilkan();
    });
  });
  document.querySelectorAll("[data-op]").forEach((btn) => {
    btn.addEventListener("click", () => aman(() => inputOperator(k, btn.dataset.op)));
  });
  document.querySelector("#btn-sama").addEventListener("click", () => aman(() => samaDengan(k)));
  document.querySelector("#btn-bersih").addEventListener("click", () => {
    bersihkan(k);
    tampilkan();
  });
  document.querySelector("#btn-hapus").addEventListener("click", () => {
    hapusDigit(k);
    tampilkan();
  });
  document.addEventListener("keydown", (e) => {
    if (/^[0-9.]$/.test(e.key)) {
      inputDigit(k, e.key);
      tampilkan();
    } else if (["+", "-", "*", "/"].includes(e.key)) {
      aman(() => inputOperator(k, e.key));
    } else if (e.key === "Enter" || e.key === "=") {
      e.preventDefault();
      aman(() => samaDengan(k));
    } else if (e.key === "Escape") {
      bersihkan(k);
      tampilkan();
    } else if (e.key === "Backspace") {
      hapusDigit(k);
      tampilkan();
    }
  });
  tampilkan();
}

if (typeof module !== "undefined") {
  module.exports = { hitung, buatKalkulator, inputDigit, inputOperator, samaDengan, bersihkan, hapusDigit };
}
