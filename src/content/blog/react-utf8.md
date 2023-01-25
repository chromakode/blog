---
title: A character encoding gotcha with React
pubDate: January 12, 2015
---

# A character encoding gotcha with React

Tonight I noticed that in a React 0.12 codebase of mine, `&nbsp;` entities were rendering as `"Â "` in Mobile Safari. After a quick search I came across this [StackOverflow answer](http://stackoverflow.com/a/1462039) which identifies the `"Â "` output as a [UTF-8](http://en.wikipedia.org/wiki/UTF-8) formatted [non-breaking space](http://en.wikipedia.org/wiki/Non-breaking_space#Encodings) character being interpreted as [ISO-8859-1](http://en.wikipedia.org/wiki/ISO/IEC_8859-1).

To resolve this problem, putting...

    <meta charset="utf-8">

...after my `<head>` element did the trick. While explicitly marking your webpages as UTF-8 encoded has been a best practice for a while now, I learned the hard way today that it's a requirement when working with React.

Interestingly, this problem was apparent in Mobile Safari on OSX but not Chrome on Linux. This made it present much later in QA. Another good reason not to leave the choice up to the browser!
