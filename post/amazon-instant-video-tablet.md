# Running Amazon Instant Video on Android tablets

In September, Amazon finally [released an official Instant Video app for Android](http://www.androidpolice.com/2014/09/09/breaking-amazon-updates-its-app-to-5-0-with-access-to-entire-digital-catalog-instant-video-app/). Unfortunately, this app is not downloadable on tablets via their app store -- only phones. Yet, Amazon Instant video has been supported for years on Amazon's own "Fire" Android-based tablets. It really bums me out that Amazon Instant Video continues to snub their competitors' products, but if you're like me and have a lot of purchases locked up in their store, there is a way:

I'd read in a [couple places](http://www.teleread.com/amazon/amazon-finally-launches-instant-video-android-app/#comment-1373400) that if you install the [APK](http://en.wikipedia.org/wiki/Android_application_package) manually, it works fine on tablets -- as long as the phone version of Amazon's store app is installed as well.

I used `adb` (`apt-get install android-tools-adb`) to transfer both apps from my Nexus 4 to my Nexus 7:

First, [Enable USB debugging](http://developer.android.com/tools/device.html#device-developer-options) on both devices.

## On the phone:

Find the app ids:

    $ adb shell pm list packages | grep amazon
    package:com.amazon.avod.thirdpartyclient
    package:com.amazon.kindle
    package:com.amazon.mShop.android

Locate the relevant APK files (your paths may vary):

    $ adb shell pm path com.amazon.mShop.android
    package:/data/app/com.amazon.mShop.android-1/base.apk

    $ adb shell pm path com.amazon.avod.thirdpartyclient
    package:/data/app/com.amazon.avod.thirdpartyclient-1/base.apk

Fetch the APKs (using the paths we got):

    $ adb pull /data/app/com.amazon.mShop.android-1/base.apk mshop.apk
    5364 KB/s (29897881 bytes in 5.442s)

    $ adb pull /data/app/com.amazon.avod.thirdpartyclient-1/base.apk avod.apk
    3134 KB/s (1960268 bytes in 0.610s)

## On the tablet:

    $ adb install mshop.apk
    5139 KB/s (29897881 bytes in 5.681s)
        pkg: /data/local/tmp/mshop.apk
    Success

    $ adb install avod.apk
    3166 KB/s (1960268 bytes in 0.604s)
        pkg: /data/local/tmp/avod.apk
    Success

Now you should be able to launch Amazon Instant Video on your tablet, watch some Star Trek TNG, and dream of a world where tech companies don't play silly games about which kind of [PADD](http://en.memory-alpha.org/wiki/PADD) you use.
