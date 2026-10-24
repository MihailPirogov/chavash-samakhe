# WebView JS bridge
-keepattributes JavascriptInterface,*Annotation*,Signature,InnerClasses,EnclosingMethod
-keepclassmembers class * { @android.webkit.JavascriptInterface <methods>; }
-keep class ru.pirogovlab.chavashsamakhe.MainActivity$* { *; }
# Yandex Mobile Ads (SDK ships consumer rules; keep explicitly to be safe)
-keep class com.yandex.mobile.ads.** { *; }
-keep interface com.yandex.mobile.ads.** { *; }
-dontwarn com.yandex.**
-dontwarn com.google.android.gms.**
