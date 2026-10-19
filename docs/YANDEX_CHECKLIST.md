# Чӑваш сӑмахӗ — Yandex Games: what to fill in the console

Archive: `release/chavash-samakhe-yandex.zip`: index.html in the root, 140 files, 19.8 MB zipped / 20.5 MB unpacked (limit 100 MB).
Rebuild with `python3 tools/build_release.py yandex` (adds `/sdk.js`, the Yandex adapter and `window.RELEASE`; strips test hooks, badge, noindex and every external link/domain; no Mobile Ads, only Yandex Games SDK ads).
Test: `cd test && node test_release.js` (mock SDK): ALL PASS (19.10.2026, 1.0.1). SHA-256 `c0ab77daa02625d886dfa60328ab40954a0cc4d73281c4bddad6b5be528f7474`.

Console: https://games.yandex.ru/console → «Добавить приложение».

## 1. General (Общее)
| Field | What to enter |
|---|---|
| Языки | Only Russian (ru). UI Russian; game words Chuvash with Russian clues. |
| Архив | `chavash-samakhe-yandex.zip` |
| Версия | 1.0.1 |
| Категории | Головоломки / Словесные (optionally Образовательные) |
| Платформы | Мобильные + Десктоп |
| Ориентация (mobile) | Портретная |
| Возрастной рейтинг | 0+ |
| Облачные сохранения | **ON** (progress saved in player data) |
| Реклама | Fullscreen (every 3rd level, ≥150 s) + Rewarded (🎬 hint, ×2 coins, extra spin) + **Sticky banner**: enable *Sticky-баннеры* and tick **«Использовать API для показа sticky-баннера»**. No ads before the tutorial ends. |
| Инап-покупки | none |
| Лидерборд | technical name **`levels`**, numeric, descending, «Пройдено уровней» |
| Политика конфиденциальности | https://pirogovlab.ru/chavash-samakhe/privacy/ (ads edition, live) |
| Email | mihail.pirogov@gmail.com |

## 2. Description and promo (ru)
- **Название:** Чӑваш сӑмахӗ (if taken: «Чӑваш сӑмахӗ — чувашские слова», then change `<title>` too).
- **Об игре / Как играть / SEO / теги:** `release/store/TEXTS_ru.md`.
- **Иконка 512×512:** `yandex_assets/icon_512x512.png` · **Обложка 800×470:** `yandex_assets/cover_800x470.png`
- **Скриншоты (no ads):** `yandex_assets/screenshot_mobile_{1_tutorial,2_game,3_card,4_map,5_daily,6_spin,7_home}.png` (1080×1920) and `screenshot_desktop_*.png` (1920×1080).
- **Видео:** not made (optional field). The Tatar trailer pipeline (`make_trailer.py`) was not ported.

## 3. Check before you submit
1. Religion: `tools/scan_religion.py` → 0 hits; neutral chapter names; backgrounds without churches, crosses, domes.
2. AI content: 50 generated chapter backgrounds (allowed). No music.
3. Links: the Yandex build has no external links or domains (build_release.py check).
4. Run from the draft with `?debug-mode=16`: tutorial first, sticky banner only after it, fullscreen and rewarded work, sound stops on tab switch.
5. Dictionary licence CC BY-SA 4.0 (Wiktionary): attribution in the in-game credits.
