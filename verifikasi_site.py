#!/usr/bin/env python3
"""Verifikasi halaman profil + landing (Fondasi s4-l3/l4).
Cek: struktur semantik, alt, label<->id, link internal, dan isi CSS.
Gagal = exit bukan 0 + pesan yang jelas.
"""
import os
import re
import sys
from html.parser import HTMLParser

SITE = os.path.dirname(os.path.abspath(__file__))
ERRORS = []


class Checker(HTMLParser):
    def __init__(self, name):
        super().__init__()
        self.name = name
        self.tags = []
        self.h1 = 0
        self.main = 0
        self.ids = set()
        self.labels_for = []
        self.inputs = []  # (tag, id)
        self.imgs = []
        self.links = []

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        self.tags.append(tag)
        if tag == "h1":
            self.h1 += 1
        if tag == "main":
            self.main += 1
        if "id" in d:
            self.ids.add(d["id"])
        if tag == "label" and "for" in d:
            self.labels_for.append(d["for"])
        if tag in ("input", "select", "textarea"):
            self.inputs.append((tag, d.get("id")))
        if tag == "img":
            self.imgs.append(d.get("alt"))
        if tag == "a" and "href" in d:
            self.links.append(d["href"])


def check_html(fname):
    with open(os.path.join(SITE, fname), encoding="utf-8") as f:
        src = f.read()
    c = Checker(fname)
    c.feed(src)
    if c.h1 != 1:
        ERRORS.append(f"{fname}: h1 harus 1, ketemu {c.h1}")
    if c.main != 1:
        ERRORS.append(f"{fname}: main harus 1, ketemu {c.main}")
    for need in ("header", "nav", "footer"):
        if need not in c.tags:
            ERRORS.append(f"{fname}: tidak ada <{need}>")
    for alt in c.imgs:
        if not alt:
            ERRORS.append(f"{fname}: img tanpa alt yang berisi")
    for tag, iid in c.inputs:
        if not iid:
            ERRORS.append(f"{fname}: <{tag}> tanpa id (tidak bisa dilabeli)")
        elif iid not in c.labels_for:
            ERRORS.append(f"{fname}: <{tag} id={iid}> tidak punya <label for>")
    for target in c.labels_for:
        if target not in c.ids:
            ERRORS.append(f"{fname}: label for={target} tidak ada elemennya")
    for href in c.links:
        if href.startswith("#"):
            if href[1:] and href[1:] not in c.ids:
                ERRORS.append(f"{fname}: link #{href[1:]} tidak ada targetnya")
        elif href.endswith(".html"):
            if not os.path.exists(os.path.join(SITE, href)):
                ERRORS.append(f"{fname}: link ke {href} — file tidak ada")
    print(f"OK {fname}: h1={c.h1} main={c.main} img={len(c.imgs)} "
          f"input={len(c.inputs)} label={len(c.labels_for)} link={len(c.links)}")


def check_css(fname):
    with open(os.path.join(SITE, fname), encoding="utf-8") as f:
        css = f.read()
    if css.count("{") != css.count("}"):
        ERRORS.append(f"{fname}: kurung kurawal tidak seimbang")
    for need in ("box-sizing: border-box", "display: flex",
                 "display: grid", "grid-template-columns",
                 "@media (max-width: 640px)"):
        if need not in css:
            ERRORS.append(f"{fname}: tidak ada '{need}'")
    m = re.search(r"@media \(max-width: 640px\) \{(.*)\}\s*$", css, re.S)
    if not m or "grid-template-columns: 1fr" not in m.group(1):
        ERRORS.append(f"{fname}: media query tidak mengubah grid jadi 1 kolom")
    if "flex-direction: column" not in css:
        ERRORS.append(f"{fname}: tidak ada flex-direction: column (hero/nav mobile)")
    print(f"OK {fname}: {len(css)} byte, kurung seimbang, flex+grid+media query ada")


check_html("index.html")
check_html("landing.html")
check_css("style.css")

if ERRORS:
    print("\nGAGAL:")
    for e in ERRORS:
        print(" -", e)
    sys.exit(1)
print("\nSemua cek lolos.")
