---
title: aptitude why
pubDate: July 23, 2014
---

The `aptitude why` command is awesome. At a glance, it tells you the whole dependency tree that led a package being installed, starting with the user's action:

    chromakode@ardent:~$ aptitude why liboxideqtcore0
    i   unity-webapps-service Depends webapp-container
    i A webapp-container      Depends webbrowser-app (= 0.23+14.04.20140428-0ubuntu1)
    i A webbrowser-app        Depends liboxideqt-qmlplugin (>= 1.0.0~bzr490)
    i A liboxideqt-qmlplugin  Depends liboxideqtcore0 (= 1.0.4-0ubuntu0.14.04.1)

Every package manager should be able to answer that question so simply.
