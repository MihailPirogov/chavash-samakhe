#!/bin/bash
# Signed release APK + AAB of Чӑваш сӑмахӗ -> release/chavash-samakhe.apk/.aab.
set -euo pipefail
cd "$(dirname "$0")/.."
python3 tools/build_release.py android
export ANDROID_HOME=/opt/android-sdk
(cd android && /opt/gradle-8.13/bin/gradle --no-daemon -q clean assembleRelease bundleRelease)
cp android/app/build/outputs/apk/release/app-release.apk release/chavash-samakhe.apk
cp android/app/build/outputs/bundle/release/app-release.aab release/chavash-samakhe.aab
BT=/opt/android-sdk/build-tools/36.0.0
$BT/apksigner verify release/chavash-samakhe.apk && echo "apk signature OK"
$BT/aapt2 dump badging release/chavash-samakhe.apk | grep -E "^package|minSdk|targetSdk|application-label:"
$BT/aapt2 dump permissions release/chavash-samakhe.apk | grep -o "name='[^']*'" | tr '\n' ' '; echo
# ad units: real IDs unless built with -PadsDemo=true (see android/app/src/main/res/values/ads.xml)
if grep -q 'R-M-[0-9]' android/app/src/main/res/values/ads.xml; then grep -o 'R-M-[0-9]*-[0-9]*' android/app/src/main/res/values/ads.xml | tr '\n' ' '; echo "(real Yandex Mobile Ads units)"; else echo "WARNING: ads.xml still has PLACEHOLDER demo units (demo-*-yandex): test ads only, no revenue"; fi
ls -la release/chavash-samakhe.apk release/chavash-samakhe.aab
