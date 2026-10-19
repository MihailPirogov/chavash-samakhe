#!/bin/bash
# Download the open sources into src/ (licences: SOURCES.md)
set -e
cd "$(dirname "$0")/../src"
B="https://kaikki.org/ruwiktionary/%D0%A7%D1%83%D0%B2%D0%B0%D1%88%D1%81%D0%BA%D0%B8%D0%B9"
curl -fsS -o ru_cv.jsonl "$B/kaikki.org-dictionary-%D0%A7%D1%83%D0%B2%D0%B0%D1%88%D1%81%D0%BA%D0%B8%D0%B9.jsonl"
curl -fsS -o en_cv.jsonl "https://kaikki.org/dictionary/Chuvash/kaikki.org-dictionary-Chuvash.jsonl"
curl -fsS -o cvwiki.xml.bz2 "https://dumps.wikimedia.org/cvwiki/latest/cvwiki-latest-pages-articles.xml.bz2"
# hunspell-cv (Chuvash.Org, hunspell.chv.su; GPL-3.0+ / LGPL-3.0+ / MPL-1.1) — Fedora package mirror (the upstream site is slow); unpack cv_RU.dic/.aff into src/hunspell/
curl -fsSL -o hunspell-cv.rpm "https://dl.fedoraproject.org/pub/fedora/linux/development/rawhide/Everything/x86_64/os/Packages/h/hunspell-cv-1.06-21.fc45.noarch.rpm"
echo "unpack hunspell-cv.rpm (zstd cpio) into src/hunspell/ — see SOURCES.md"
python3 ../tools/cvwiki_freq.py
