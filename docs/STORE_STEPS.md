# Чӑваш сӑмахӗ 1.0.0 — browser steps (RuStore, Google Play, Yandex Games, Yandex Mobile Ads)

Nothing here was submitted from the box. No payments are needed anywhere (all accounts already exist).
Common values:

| | |
|---|---|
| Name | **Чӑваш сӑмахӗ** (fallback if taken: «Чӑваш сӑмахӗ — чувашские слова») |
| Package | `ru.pirogovlab.chavashsamakhe` |
| Version | 1.0.0 (versionCode 1) |
| Developer | PirogovLab / Михаил Пирогов · site https://pirogovlab.ru · email mihail.pirogov@gmail.com |
| Privacy policy | https://pirogovlab.ru/chavash-samakhe/privacy/ (ads edition, 19.10.2026, live) |
| Texts | `release/store/TEXTS_ru.md` (short/full descriptions, keywords, what's new) |
| Category | Игры → Слова / Головоломки |
| Age | 0+ (PEGI 3); Google Play target audience 13+ |
| Signing cert SHA-256 | `78:46:54:96:23:2E:88:5D:61:8D:96:F5:AA:73:C6:8D:7B:1E:39:EC:CA:1D:05:C0:A1:A9:2D:27:92:E8:86:C5` |

Recommended order: **§4 Yandex Mobile Ads app (test mode) → put real IDs in ads.xml, rebuild 1.0.1 (I can do it) → §1 RuStore / §2 Google Play → §4.3 store link in partner.yandex.ru**. You can also publish 1.0.0 as is (demo ad units: ads show, no revenue) and ship 1.0.1 with real IDs afterwards.

## 1. RuStore — https://console.rustore.ru
1. Приложения → «Создать приложение» → тип **Игра**, имя **Чӑваш сӑмахӗ**, пакет `ru.pirogovlab.chavashsamakhe`.
2. Upload APK: `release/chavash-samakhe-rustore.apk` (27.1 MB, signed with the new key).
3. Карточка:
   - Краткое описание: «Словесная головоломка на чувашском: буквы, кроссворды и перевод слов.»
   - Полное описание: «Полное описание» from TEXTS_ru.md · Что нового: «Первая версия.»
   - Категория: Головоломки (or Слова) · Возраст: 0+
   - Иконка: `release/rustore_assets/icon_512.png`
   - Скриншоты (portrait 1080×1920): `release/rustore_assets/mobile_1_game … mobile_6_home.png`
   - Баннер/обложка 1920×1080 (if asked): `release/rustore_assets/banner_1920x1080.png`
   - Политика конфиденциальности: https://pirogovlab.ru/chavash-samakhe/privacy/ · Сайт: https://pirogovlab.ru · email: mihail.pirogov@gmail.com
   - Реклама в приложении: **Да** (Yandex Mobile Ads). Платный контент: нет.
4. Send to moderation. After it's live, copy the RuStore link for §4.3.

## 2. Google Play Console — https://play.google.com/console/u/0/developers/8084969663799476138/app-list
1. «Создать приложение»: name **Чӑваш сӑмахӗ**, default language **Русский (ru-RU)**, **Игра**, **Бесплатное**; tick the declarations.
2. Release → Testing → **Закрытое тестирование** (new personal account: 12+ testers for 14 days before production) → create release → enrol in **Play App Signing** (Google-generated key; our key = upload key) → upload `release/chavash-samakhe.aab` (26.9 MB). Release name `1.0.0 (1)`, notes «Первая версия.»
3. Store listing (Основная страница):
   - Краткое описание (≤80): «Соединяйте буквы, собирайте чувашские слова. 700 уровней кроссвордов!»
   - Полное описание: from TEXTS_ru.md
   - Значок 512×512: `release/play_assets/play_icon_512.png`
   - Баннер 1024×500: `release/play_assets/feature_graphic_1024x500.png`
   - Скриншоты телефона: `release/play_assets/screenshots/phone_1_tutorial … phone_7_home.png` (1080×1920)
   - Категория: Игры → **Слова**; теги: Word, Puzzle, Crossword; email mihail.pirogov@gmail.com, site https://pirogovlab.ru
4. App content (Содержание приложения):
   - Политика конфиденциальности: https://pirogovlab.ru/chavash-samakhe/privacy/
   - Реклама: **Да, в приложении есть реклама**
   - Доступ к приложению: всё доступно без входа
   - Целевая аудитория: **13–15, 16–17, 18+** (not under 13); app is not directed at children; «может привлекать детей» → нет
   - Рекламный идентификатор: **Да**, используется для **Реклама или маркетинг** (permission AD_ID comes from the Yandex SDK)
   - Data safety (Безопасность данных):
     - Collects data: **Yes**; shares data: **Yes** (with Yandex, the ad SDK provider); encrypted in transit: **Yes**; users can request deletion: **No** (the developer stores nothing; ad data is with Yandex; progress is local and removed with the app).
     - **Device or other IDs** (advertising ID): collected + shared · purpose **Advertising or marketing**, **Fraud prevention, security** · not optional.
     - **App activity → App interactions** (ad impressions/clicks): collected + shared · Advertising, Analytics.
     - **App info and performance → Diagnostics / Crash logs** (SDK): collected · Analytics.
     - **Approximate location** (derived from IP by the ad SDK): collected + shared · Advertising. Compare with Yandex's own Data safety guide for Mobile Ads SDK 8 and adjust if it lists more/less.
     - No personal info, contacts, photos, files, messages, financial info, precise location.
   - Возрастной рейтинг (IARC): email mihail.pirogov@gmail.com, category **Игра / Головоломка**; violence, fear, sexuality, profanity, drugs/alcohol/tobacco, gambling with real money: **No**; simulated gambling: **No** (the «колесо удачи» is a free daily bonus spin for in-game coins, no betting, no purchases); user interaction / chat: **No**; shares user location: **No**; digital purchases: **No**; ads: **Yes**. Expected result: 3+ / PEGI 3.
   - Новости: нет · COVID: нет · Госприложение: нет · Финансовые функции: нет · Здоровье: нет
   - Data deletion URL (if asked): https://pirogovlab.ru/chavash-samakhe/privacy/ (section «Хранение и удаление данных»)
5. Countries: all (or Россия + СНГ). Then send the closed test for review; after 14 days with 12+ testers apply for production.

## 3. Yandex Games — https://games.yandex.ru/console
Everything is in `release/YANDEX_CHECKLIST.md` (archive `release/chavash-samakhe-yandex.zip`, version 1.0.0, ru only, cloud saves ON, sticky banner via API ON, leaderboard `levels`, icon/cover/screenshots in `release/yandex_assets/`, privacy URL above). No video (optional).

## 4. Yandex Mobile Ads (Рекламная сеть Яндекса) — https://partner.yandex.ru
Same account as Мут тӱня (app 20239729) and Сүз дөньясы (app 20243911); `https://pirogovlab.ru/app-ads.txt` (`yandex.com, 1969132, DIRECT`) is account-wide and already live.
1. **Реклама в приложениях → Приложения → «Добавить приложение» → «Моё приложение ещё не опубликовано»** → Платформа **Android**, название **Чӑваш сӑмахӗ** → «Добавить приложение». It gets an ID (8 digits, e.g. 2024xxxx) and status **Тестовый режим**.
   (If RuStore/Play is already live: «Приложение опубликовано в другом магазине» → Магазин RuStore, Название «Чӑваш сӑмахӗ», Пакет `ru.pirogovlab.chavashsamakhe`, Ссылка на RuStore, Разработчик «PirogovLab» — or search Google Play by package.)
2. Open the app → **«Добавить блок»**, three units, in this order so the numbers match:
   1. **Баннер** — name «Чӑваш сӑмахӗ — sticky banner»; CPM strategy «Максимальный доход»; sizes: adaptive/sticky (the app uses `BannerAdSize.sticky`), video allowed. → `R-M-<ID>-1`
   2. **Межстраничный (Interstitial)** — name «Чӑваш сӑмахӗ — interstitial»; «Максимальный доход». → `R-M-<ID>-2`
   3. **С вознаграждением (Rewarded)** — name «Чӑваш сӑмахӗ — rewarded»; «Максимальный доход»; валюта **«Подсказка»**, сумма **1**. → `R-M-<ID>-3`
3. Send me the app ID and the three `R-M-…` IDs. I put them into `android/app/src/main/res/values/ads.xml` (ad_banner_id / ad_interstitial_id / ad_rewarded_id), bump to versionCode 2 / 1.0.1, rebuild APK/AAB and re-upload the site APK. No other code changes.
4. After RuStore/Play publication: partner.yandex.ru → app → add the **store link** (RuStore and/or Google Play) → moderation up to ~2 days → status **Активно**. Access is confirmed via app-ads.txt: keep **https://pirogovlab.ru** as the developer website in the store listing (Yandex crawls it about once a day). Check Настройки → Общие → app-ads.txt still shows 1969132.
5. Age: the app sends `setAgeRestricted(false)` (0+, general audience). If you ever mark the app for children under 13, set `ads_age_restricted=true` in ads.xml.

## 5. After publishing
- Add store badges/links to the GitHub README (placeholder comment there) and, if you want, a landing page like `/suz-donyasy-igra/` (not created: it would change shared site pages — blog, sitemap, home).
