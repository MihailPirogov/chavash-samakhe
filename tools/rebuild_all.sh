#!/bin/bash
# Rebuild game data (levels, chapters, daily puzzles, word of the day, card chunks) + religion/profanity scan + headless tests.
# Sources must be in src/ (see SOURCES.md; tools/fetch_sources.sh). Override: LEVELS=600 CHAPTER=12 tools/rebuild_all.sh
# USE_HUNSPELL=0 disables extra bonus words validated by hunspell-cv.
# NO deploy step: this project is not published anywhere yet.
set -e
cd "$(dirname "$0")/.."
[ -f src/cvwiki_freq.json ] || python3 tools/cvwiki_freq.py
PYTHONHASHSEED=0 python3 tools/build_game.py "${LEVELS:-700}" "${CHAPTER:-14}"
python3 tools/scan_religion.py
(cd test && SHOTS=../screens node test.js && SHOTS=../screens/tutorial node test_tutorial.js)
