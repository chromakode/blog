# Checkbox

Hi xkcd visitors! Today we released ["Checkbox"](https://xkcd.com/2445), our 2021 April Fool's project. I proposed the original concept for this one and built the frontend. The backend and editor tooling was made by davean and [Kevin Cotrone](https://twitter.com/cotrone), with content written by a collection of amazing folks credited in the header of [the comic](https://xkcd.com/2445/) and the one and only Randall Munroe.

This year was a doozy. We specced and scrapped several different ideas in the months leading up to today. We finally settled on today's concept just 3 days ago. The need to do something simple was a really useful constraint, and we leaned into the idea of making something primitive but deep. I'm really proud of how it turned out!

Here's a few stories from development.

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


## A UI challenge disguised as a statistics problem

A major design challenge from the outset of this project was accurately interpreting users' morse code input. Morse code is based on tapping out a rhythm with a base tempo for dots, multiplied by 3 for dashes, and 7 for spaces. Humans are not great timekeepers, especially unpracticed ones -- and our assumption was the majority of our users would be tapping out morse for the first time. Given a sequence of checkbox presses, how do we determine the tempo they intended to be morsing at? This is a pretty interesting and hard to solve problem!

My initial prototype of the checkbox interaction was in the form of an [Observable notebook](https://observablehq.com/@chromakode/xkcd-morse-code-experiments). I wanted to get something put together quickly to make sure the experience of tapping out a conversation with a checkbox was compelling, and most importantly, actually usable! The experience would be ruined if it wasn't possible for a new user to learn how to communicate with it.

This initial prototype uses the average time period between presses and releases to determine the base tempo. With a little tuning, it worked, but it had two significant issues: firstly, it has no way of knowing whether the initial presses it's seeing are dots or dashes. If the input skews towards dashes, the threshold will be off, and dashes will be interpreted as dots. The second problem is that as more dots and dashes are observed and the threshold is adjusted, the morse decoding changes over time (you can see this in the Observable prototype).

The first thing I tried to increase input accuracy was tune the prototype with really lenient thresholds. I increased the pause time allowed between characters because in my own testing, I found myself looking back and forth between a morse chart and the screen, and I was feeling rushed. I later discovered this is called [Farnsworth Timing](http://www.justlearnmorsecode.com/farnsworth.html), and it was invented in the 1950s! Even so, the prototype was undeniably unreliable and a little frustrating to use, even though I could watch tne debug data as I tapped.

Originally, I didn't envision anything in the comic besides the checkbox -- the utter minimalism was a part of the gag. However, actually using the checkbox convinced me we'd need to somehow show users their input. Otherwise, it'd be too easy to typo a letter unknowingly and get a wrong response from the right intent -- a super frustrating experience. I didn't want users to have to reach outside the confines of the comic (e.g. looking at the console, or a user script) to use it. Whatever we did, it had to be ergonomic. The fact that we might not be able to interpret a morse input until more characters had been entered made giving users feedback on their typos much more difficult.

In the final day as I prepped the JS code, this problem remained unresolved. I asked davean for his algorithm wisdom on a quick and adequate way to calculate the time period. He suggested using [k-means clustering](https://en.wikipedia.org/wiki/K-means_clustering) to find the dot, 3x dot, and 7x dot clusters in the input data. He had also considered implementing fuzzy matching on the server side to allow for input errors, but there simply wasn't enough time to do that justice in a couple days.

It was a couple hours before midnight on Mar 31, and I was finally ready to start on a k-means implementation. I felt that the prototype algorithm would be good enough for the first few hours of the comic being up, and I could follow up with a better recognizer when it was ready. And yet, the issue of indicating typoes still daunted me. Even with a better way of analyzing the timings, until the user had input at least a dot and a dash, the best we could do is apply a default tempo and guess. If we couldn't reliably show users the impact of their actions, we couldn't effectively teach them morse code.

With an hour or so left I decided to focus on adding some kind of "HUD" that would indicate to users if they had just input a dot or a dash. To do that, I needed a deterministic recognizer. So in the end, I just set a fixed tempo. These two choices together were a breakthrough! The problem all along was that users might not have a consistent timing in their input -- but the UI could show exactly when a dot became a dash, or when a pause between presses formed a space. Even the animations could help reinforce the rhythm, by making them multiples or divisions of the dot period. The characters slide to the left in sync with the ideal tempo, so it feels very natural to tap in sync with that.

<video autoplay muted loop src="/post/checkbox/checkbox.mp4" width="826" height="116" style="display: block; margin: 0 auto"></video>

I'm really proud of how this final interaction turned out. The HUD takes an incomplete sequence of presses, extrapolates the effect of the user pressing at the current time, and encodes as morse. A crucial win is this not only makes it crystal clear when your dot becomes a dash, but also when a gap between presses becomes a space, which we can indicate before the user touches the UI again. This works great for users composing their messages using a code table or pencil and paper, because they can see the screen fill in with their intended patterns.

Another cool outcome: the comic is far more lenient than traditional morse code. A user merely needs to wait until the preview displays what they want. It's not necessary to have consistent timing: you can input consecutive dots much faster than equal timing, and dashes can be any length as long as they reach the minimum threshold. This flips the task from keeping time to a WYSIWYG model, of sorts.

I think it's really interesting how this initially appeared to be a statistics and data analysis problem but turned out to be solved in a much better way by UI. This is particularly exciting to me as a generalist, because I often have an internal dialogue running like:

> "What if I was better at this specific discipline? Does knowing a little about a lot of things _really_ make a difference when the complexity I can tackle in any particular field is limited?"

This is an example where working different angles of the same problem helped me to understand which problem was really necessary to solve, which resulted in a better solution.


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
