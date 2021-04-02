# Checkbox

Hi xkcd visitors! Today we released ["Checkbox"](https://xkcd.com/2445), our 2021 April Fool's project. I proposed the original concept for this one and built the frontend. The backend and editor tooling was made by davean and [Kevin Cotrone](https://twitter.com/cotrone), with content written by a collection of amazing folks credited in the header of [the comic](https://xkcd.com/2445/) and the one and only Randall Munroe.

This year was a doozy. We specced and scrapped several different ideas in the months leading up to today. We finally settled on today's concept just 3 days ago. The need to do something simple was a really useful constraint, and we leaned into the idea of making something primitive but deep. I'm really proud of how it turned out!

Here's two funny anecdotes from development.

---



## Morse all the way down


If you take a peek at the JS code, [`comic.js`](https://xkcd.com/2445/morse/static/comic.js), you'll find that it's written in morse code!


```
".---- -.-. -.. - .. ... ...-..- -.-.-- ..--- . ---.. ..- -.-- -. ----- -----
----- ---.. ---.. ..-. ..--.- -.... .---- --... ---.. .--- -..- ..-. ....-
-..-. -....- .-.-.- --- ... ..--- --. -.-.-. .---- .-.-. -..- -. .--.-. -----
.-. ...-- -.--. -.- -.-. --.- ..- -....- .--. ...-..- .... --.. .---- ..-.
-.-.-. ---.. . -.-. -... --. ----- --- ...- .. ...- .-... ..--.- ---... -.-.--
.. ..... .-- -.--. ----. -.-- -. .--. .---- .--- -...- ... -..-. ---.. -..
<snip>
-.-.-- .... -... -. ..... -..-. . - .-..-. --..--".split(";D").map(morse.run);
```

When you paste the code into a morse translator, unfortunately the result is not very helpful:

```
1CDTIS#!2E8UYN00088F#6178JXF4/-.OS2G#1+XN@0R3(KCQU-P#HZ1F#8ECBG0OVIV&#:!I5W(9YNP1J=S/8...
```

What's going on here?

Initially, I'd hoped to faithfully translate the JS code to morse and back. When I started implementing this, I noticed that my character table did not contain curly brace characters. Hmm, this was going to be a problem.

I considered adding new characters to the morse table, but this seemed like it could become tedious, and ran the risk of overlapping with other more obscure morse sequences I wasn't aware of. My next idea was to interpret sequences of 8 dots and dashes as binary bytes, which seemed like a pretty good solution, though a bit verbose. I took a break from thinking about this, and then had an idea: it's pretty common to encode arbitrary data into letters and numbers, so would something like [base-36](https://en.wikipedia.org/wiki/Base36) work?

Now we were getting somewhere! As a slight enhancement over base-36, I pulled in the excellent [base-x](https://www.npmjs.com/package/base-x) library, which accepts an arbitrary list of characters to encode/decode binary data into. I threw our 56 character morse code table into it, and we were in business!

So, the JS code is actually encoded _twice_: once in base-56, and then in morse code. If you count UTF-8 -- which actually came into play when I needed to add an emoji to the source! -- it's running through three layers of encoding. :)


## Unable to send the letter "E"?

Shortly before launching, we discovered a really strange bug: if you tried to send just the letter "E", you wouldn't see the intended response. The server did not recognize the input, even though we specifically handled "E". Also, two "E"s, or any other combination of letters, was working normally.

So we started digging into both the client and the backend to see what was going on. We took great pains to make the API for this project use morse code in the transport. If you take a look at the network inspector, you'll notice that the URLs requested have morse code in them:

```
chromakode@atavist:~$ curl 'https://xkcd.com/2445/morse/.../...._..' -v
> GET /2445/morse/.../...._.. HTTP/1.1
>
< HTTP/1.1 200 OK
< Content-Type: text/x-morse;charset=utf-8
-.. -... ...-- ...-- ....- .- .- -... -....- ----. ..--- .- .---- -....- .---- .---- . -... -....- ---.. ----- ----- .---- -....- ---.. -.-. .---- -.... ....- ..... ....- ..-. -... ----- ..--- .- / .... . .-.. .-.. --- -.-.-- / .- -. -.-- -... --- -.. -.-- / --- ..- - / - .... . .-. . ..--..
```
The letter "E", as it happens, is the simplest character to enter in morse code: it's a single "." -- hence how we discovered this relatively obscure bug so quickly.

Back to the problem at hand. We noticed that the client wasn't sending the morse for the letter "E" along. Instead, the comic would request as if nothing had been entered at all: an empty path. Investigating a step further, I verified that the client was generating and requesting the right URL with the morse letter "E" in it! What was going on?

Then, an _even stranger thing happened_. I copied and pasted the correct URL into my browser and pressed enter, and right before my eyes, it deleted the "." from the end of the URL and returned a different result. This immediately set off alarm bells in my mind, thinking that this period at the end somehow made it a malformed URL. Could it be a quality-of-life feature to correct typos when a URL is at the end of a sentence? No, that didn't add up, because it had originally failed when requested by JavaScript, a context in which URLs are not human input.

Ok, next idea. Was there a spec somewhere that described URLs ending in a period? My googling eventually led me to [this StackOverflow post by user "speedplane"](https://stackoverflow.com/a/63124092) (which at the time of writing has one vote):

>"As other answers have noted, periods are allowed in URLs, however you need to be careful. If a single or double period is used in part of a URL's path, the browser will treat it as a change in the path, and you may not get the behavior you want."

Evidently, a bare `.` or `..` in a URL will be interpreted by browsers similar to UNIX filesystem paths: as referring to the current and parent directory respectively. This appears to be particularly relevant for [relative URLs](https://denmchenry.com/posts/relative-urls/). So in addition to "E", the letter "I" (morse: "..") would also be affected.

We fixed this issue by adding an extra separator character before the period, making the urls `/_.` and `/_..`.

---

If you're interested in learning more about how this was made, we'll be releasing the code on [https://github.com/xkcd](https://github.com/xkcd) when it's ready. You can also "check" out the comics from previous years there. I'm partial to [Alto](https://github.com/xkcd/alto), our infinite menu system. You can find more of my work on [github.com/chromakode](https://github.com/chromakode) and [@chromakode](https://twitter.com/chromakode).
