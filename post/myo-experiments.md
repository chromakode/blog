# Fun with the Myo gesture controller

The [Myo](http://myo.com) is a wireless armband that uses [electromyography](http://en.wikipedia.org/wiki/Electromyography) to detect and recognize hand gestures. When paired with a computer or smartphone, gestures can be used to trigger various application-specific functions.

<video autoplay loop poster="/post/myo-experiments/myo-play.jpg">
  <source id="webmsource" src="/post/myo-experiments/myo-play.webm" type="video/webm">
  <source id="mp4source" src="/post/myo-experiments/myo-play.mp4" type="video/mp4">
</video>

When their marketing video made the rounds in 2013, I remember one specific demo made my jaw drop: touch-free video control. The video shows a man watching a cooking instructional video while cutting some raw meat. Being able to [pause and rewind the video simply by raising his hand](https://www.youtube.com/watch?v=oWu9TFJjHaM#t=34) was a solution to an interaction problem I've had countless times, such as listening to podcasts while doing chores, or watching videos while eating a sandwich.

I ordered a Myo back in March 2013 and deferred shipment until their consumer design was ready. It was a nice surprise to return home from holiday travels to find a Myo waiting for me. :)

Unfortunately there is no official Linux support yet (though there's a [proof of concept](https://github.com/f825f5242ed81a32cd04e5269665f40a/libmyolinux) from a hackathon). On Windows and OSX, there's a pretty elegant [Lua scripting environment](https://developer.thalmic.com/docs/api_reference/platform/script-tutorial.html) in the SDK which is used to write "connector" integrations. Lua scripts are selected based on the currently active app to trigger mouse/keyboard actions from gestures. This is a neat approach. It enables developers and tinkerers to do a bunch of the legwork writing and designing integrations, while wrapping the complex parts (gesture recognition / mouse control / keyboard automation) in a cross-platform manner.

I was happy to see some [web browser integration](https://market.myo.com/app/5485b06be4b0639d1780a915/web-browser-navigation) already built, but upon further inspection there were a few different behaviors which would be more to my liking. I was delighted to discover that I could simply open up the web browser connector and hack the high-level Lua code into the controls I wanted. I added a gesture to take control of the mouse, as well as some special cases for controlling video playback.

While the gesture recognition doesn't always work perfectly (probably a matter of training both myself and the armband better), when everything works properly, the results are pretty sublime:

<video autoplay loop poster="/post/myo-experiments/myo-seek.jpg">
  <source id="webmsource" src="/post/myo-experiments/myo-seek.webm" type="video/webm">
  <source id="mp4source" src="/post/myo-experiments/myo-seek.mp4" type="video/mp4">
</video>

I'll be posting my scripts and future tinkerings in a [myo-scripts](https://github.com/chromakode/myo-scripts) repo on GitHub.
