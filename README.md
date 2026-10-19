<p align="center"><img src="store/icon_512.png" width="128" alt="Чӑваш сӑмахӗ"></p>

<h1 align="center">Чӑваш сӑмахӗ — чувашское слово</h1>

<p align="center">
<img src="https://img.shields.io/badge/Android-7.0%2B-3ddc84?logo=android&logoColor=white" alt="Android 7.0+">
<img src="https://img.shields.io/badge/HTML5-offline-e34f26?logo=html5&logoColor=white" alt="HTML5">
<a href="LICENSE"><img src="https://img.shields.io/badge/code-MIT-informational" alt="MIT"></a>
<img src="https://img.shields.io/badge/data-CC%20BY--SA%204.0-lightgrey" alt="CC BY-SA 4.0">
<a href="https://pirogovlab.ru/chavash-samakhe/"><img src="https://img.shields.io/badge/site-pirogovlab.ru-b8202f" alt="site"></a>
</p>

<p align="center"><img src="store/feature_graphic_1024x500.png" width="720" alt="Чӑваш сӑмахӗ — игра в слова на чувашском языке"></p>

**RU** · [EN](#english)

Словесная головоломка на чувашском языке: соединяйте буквы на круге, составляйте чувашские слова и заполняйте кроссворд. 700 уровней в 50 главах, карточка с переводом на русский для каждого слова. Работает без интернета.

<!-- PLACEHOLDER store badges: add RuStore / Google Play / Yandex Games links when the listings are live -->
**Играть в браузере:** https://pirogovlab.ru/chavash-samakhe/ · **Скачать APK:** https://pirogovlab.ru/chavash-samakhe/chavash-samakhe.apk

## Возможности
- **700 уровней в 50 главах** (Ҫаран, Вӑрман, Атӑл, Сӑр, Шупашкар, Акатуй, Тӗрӗ, Шӑпӑр…), у каждой главы свой фон.
- Буквы **Ӑ Ӗ Ҫ Ӳ** прямо на колесе.
- Чувашский орнамент: красно-чёрная вышивка, ступенчатые ромбы, розетки, древо жизни (SVG, `js/art.js`).
- **Карточки слов**: перевод, значения и примеры; «Мой словарь» с выученными словами.
- Задача дня, слово дня, ежедневная награда, задания, колесо удачи, достижения, бонусные слова и копилка.
- Интерактивное обучение; подсказки (буква, слово, перемешать).
- Платформы: веб, Android (WebView + Yandex Mobile Ads), Яндекс Игры (SDK v2).

## Скриншоты
<p>
<img src="store/screenshots/phone_2_game.png" width="180"> <img src="store/screenshots/phone_3_card.png" width="180"> <img src="store/screenshots/phone_4_map.png" width="180"> <img src="store/screenshots/phone_7_home.png" width="180">
</p>

## Данные
- Слова, переводы и примеры: чувашские статьи русского и английского Викисловаря (ru/en.wiktionary.org) через Wiktextract / kaikki.org. Лицензия **CC BY-SA 4.0**, поэтому `data/` и `data_src/` распространяются под той же лицензией.
- Частоты слов: чувашская Википедия (используются только счётчики). Бонусные слова дополнительно проверяются по hunspell-cv (Chuvash.Org; словарь не распространяется).
- Религиозная и ненормативная лексика исключена (`tools/religion_filter.py`, проверка `tools/scan_religion.py`).
- Подробнее: [SOURCES.md](SOURCES.md). Исходные дампы в репозиторий не входят; их скачивает `tools/fetch_sources.sh`.

## Сборка
```bash
python3 tools/build_game.py 700 14       # data/levels.js + data/cards/  (нужны дампы в src/)
cd test && npm i && node test.js && node test_tutorial.js && node dup_swipe.js
python3 tools/build_release.py yandex    # архив для Яндекс Игр
tools/build_android.sh                   # подписанные APK/AAB (JDK 17, Android SDK 36, Gradle 8.13)
```
Ключи подписи хранятся **вне репозитория**: `release/keys/keystore.properties` (в .gitignore), с полями `storeFile`, `storePassword`, `keyAlias`, `keyPassword`. Без них соберётся неподписанный APK.
Рекламные блоки задаются в `android/app/src/main/res/values/ads.xml`.

Структура: `index.html`, `css/`, `js/` — игра; `data/` — уровни и карточки; `img/bg/` — фоны глав; `android/` — оболочка; `tools/` — сборка данных, фонов и релизов; `test/` — Playwright-тесты; `design/` — иконка и промо-графика; `store/` — тексты и скриншоты для магазинов; `docs/` — чек-листы релиза.

## Лицензии
- Код: MIT ([LICENSE](LICENSE)).
- Словарные данные в `data/`, `data_src/`: CC BY-SA 4.0 (© авторы Викисловаря).
- Фоны глав (`img/bg/`) — изображения, сгенерированные ИИ. Иконка, орнамент и графика © PirogovLab.

## Автор
Проект [PirogovLab](https://pirogovlab.ru) — Михаил Пирогов.

---

## English

**Chăvash sămakhĕ** (“Chuvash word”) is a word puzzle in the Chuvash language: connect letters on the wheel, build Chuvash words and fill the crossword. It has 700 levels in 50 chapters and a word card with a Russian translation for every word. Works offline. Web, Android (WebView) and Yandex Games builds. Code: MIT; dictionary data: CC BY-SA 4.0 (Wiktionary).
