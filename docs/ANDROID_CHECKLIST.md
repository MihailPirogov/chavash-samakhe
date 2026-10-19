# Чӑваш сӑмахӗ — Android build (1.0.1)

- APK (signed, v2 scheme): `release/chavash-samakhe.apk` (27 137 233 bytes, SHA-256 `91c5a19fb431eb2dd587c938272cbcf7fabae40a9b7c299f55b6b9ef6b33f0bc`). The same file is `release/chavash-samakhe-rustore.apk` for RuStore; it is also published for direct install at https://pirogovlab.ru/chavash-samakhe/chavash-samakhe.apk.
- AAB (signed): `release/chavash-samakhe.aab` (26 933 130 bytes, SHA-256 `d661fc36e78ad5fcf8c5053885de52290c8b000fe8b6a7e7e6e8d8020d8ee476`), for Google Play (Play App Signing; this key becomes the upload key).
- Package `ru.pirogovlab.chavashsamakhe` · **versionCode 2 · versionName 1.0.1** (1.0.0 with demo ad units kept in `release/prev_1.0.0/`) · minSdk 24 (Android 7.0) · targetSdk/compileSdk 36.
- Rebuild with `tools/build_android.sh`. Bump `versionCode`/`versionName` in `android/app/build.gradle` for every store update. The script prints the `R-M-` ad unit IDs it finds in `ads.xml`.
- Signing key: `release/keys/chavash-samakhe-release.p12` + `keystore.properties` (passwords, chmod 600) + `README_KEYS.txt`.
  - Alias `chavashsamakhe`, PKCS12, RSA 4096, valid until 06.03.2054.
  - Cert SHA-256 `78:46:54:96:23:2E:88:5D:61:8D:96:F5:AA:73:C6:8D:7B:1E:39:EC:CA:1D:05:C0:A1:A9:2D:27:92:E8:86:C5`
  - Cert SHA-1 `F5:B0:37:67:10:24:E4:A5:13:0D:74:24:07:AF:19:F2:7E:C8:AA:C7`
  - **NEW key, separate from Мут тӱня and Сүз дөньясы.** Backup: `/cursor/stores/store-d8ae9b6a-…/chuvash-keys-backup/`. Also keep an offline copy (password manager / encrypted drive). Without it you can't ship updates on RuStore or to existing APK installs.
- `release/keys/` must never go to git (it is in .gitignore).

## What the app does
- Java WebView shell plus **Yandex Mobile Ads SDK 8.6.0** (`com.yandex.android:mobileads`, pulls in AppMetrica and play-services-appset). The game is bundled offline in `assets/www` (no noindex, no test badge) and served from `https://appassets.androidplatform.net/`. It works fully offline; only ads need the network.
- UI is Russian; game words are Chuvash with Russian clues. Interactive tutorial on first launch (replay: Настройки → «Как играть»).
- Back button: closes the tutorial, card or dialog, then goes home, then exits. No music; WebAudio sounds are muted during ads.
- Share: the word-card PNG goes through the Android share sheet (ContentProvider `ru.pirogovlab.chavashsamakhe.share`).
- Permissions: INTERNET, ACCESS_NETWORK_STATE, VIBRATE, `com.google.android.gms.permission.AD_ID`, install referrer (from the SDK).

## Ads (Yandex Mobile Ads): real IDs set (1.0.1)
- **Config file:** `android/app/src/main/res/values/ads.xml`.
  - App in partner.yandex.ru: **20244782**. It stays in **test mode** until a store link is added.
  - Banner `R-M-20244782-1` · interstitial `R-M-20244782-2` · rewarded `R-M-20244782-3` (partner reward «Подсказка» ×1; the app grants its own reward per placement).
  - Demo units `demo-*-yandex` stay as the debug fallback.
- **To activate real ads:** publish in RuStore / Google Play → partner.yandex.ru → app 20244782 → add the store link (moderation up to ~2 days). `https://pirogovlab.ru/app-ads.txt` (`yandex.com, 1969132, DIRECT`) is account-wide and live; keep `https://pirogovlab.ru` as the developer website in the listing. No code change is needed after activation.
- Placements (same as Сүз дөньясы / Мут тӱня): sticky banner below the WebView, only after the tutorial; interstitial every 3rd level, at least 150 s apart; rewarded: hint letter (1 hint), ×2 coins, extra wheel spin (up to 3 per day). No ads before the tutorial is finished.
- Debug builds always use demo units; `gradle assembleRelease -PadsDemo=true` forces them in release. Logcat tag `ChavashSamakheAds`.
- Children: `ads_age_restricted=false` (0+, not directed at children). In Play Console → Target audience, choose 13+.
- Verified in the 1.0.1 APK: `bool/ads_demo=false`, `ad_banner_id=R-M-20244782-1`, `ad_interstitial_id=R-M-20244782-2`, `ad_rewarded_id=R-M-20244782-3`.
- Site APK (1.0.1): https://pirogovlab.ru/chavash-samakhe/chavash-samakhe.apk, live SHA-256 equals the build (19.10.2026).

## Tests
- `cd test && node test_android_www.js`: ALL PASS (bundled html without noindex, Android adapter, native banner after tutorial, rewarded hint, no music).
- Not run on a real device. **Check on a phone** before release: game, banner, interstitial, rewarded.
