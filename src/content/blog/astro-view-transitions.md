---
title: Astro View Transitions
description: Notes from kicking the tires of new View Transitions APIs
pubDate: Sep 10, 2023
---

[Astro 3.0](https://astro.build/blog/astro-3) has been released! 

When reading through the changelog, I'll admit to getting a bit [nerd-sniped](https://xkcd.com/356) by the new [View Transition](https://docs.astro.build/en/guides/view-transitions) system, and spent some time tonight figuring it out instead of hacking on [Coalesce](https://github.com/chromakode/coalesce).

<div class="outline-1 wide">

<video muted playsinline autoplay loop>
  <source type="video/webm" src="/post/astro-view-transitions/view-transition.webm">
  <source type="video/mp4"  src="/post/astro-view-transitions/view-transition.mp4">
</video>

</div>

A few notes from implementing it here:

## Transitions feel really novel on the web

It's amazing what a big difference a smooth crossfade can make. After using the web for almost 25 years, I've become accustomed to the flashy, stuttery transitions between pages. It's what makes UIs feel like the web. I can still imagine the IE 6 "click" sound when pages flashed to white on transition.

I love how [page transitions can be declared with just a little CSS](https://developer.chrome.com/docs/web-platform/view-transitions/#custom-entry-and-exit-transitions). This is a really clever API. Tons of creative possibilities here.

View transitions will change the way I think about designing page layouts. For example, on my site, the color bars at the top have `position: sticky` so that they shrink out of the way when you scroll. This is also a cue that you're at the top of the page. With a crossfade transition, though, it's not always visually clear that you've warped to the start of a different scrollable space.

## Chrome is leading with great DX

The Chrome Devtools for [debugging view transitions](https://developer.chrome.com/docs/web-platform/view-transitions/#debugging-transitions) is brilliant. I love how the `::view-transition` pseudo-elements appear in the element inspector. As with many Devtools things, my only lament is it's so buried that many developers won't know it exists.

## Image loading is a source of jank

Transitioning between images has some pitfalls: if the image displayed on the destination page isn't cached, it won't be loaded in the transition, causing jank. The departing image fades into a white rectangle, and the image pops in afterward.
  
This is a bit awkward with thumbnail galleries, since the thumbnail needs to be the same image as the destination (ideally you'd want a small quick to download thumbnail). I experimented with using a `<picture>` element in hopes that a high res version would be swapped in after transition, but there was still a white flash.

The best solution for now was to settle on a medium sized image used in both the thumbnails and destination pages.

## Sometimes transitions themselves are jank

I haven't figured out the best way to "key" transition targets selectively: I'm finding widespread use of `view-transition-name` creates undesired transitions in some cases.

For example, the thumbnail transitions in the video look great if both the start and destination positions are onscreen, but in many cases that's not the case. For instance, my front page shows a fullscreen splash, which causes the thumbnail to zip offscreen. It'd be useful if there was a way to bail out of a transition based on distance or if the destination is out of viewport bounds.

Another case where I get undesired transitions is clicking links in the post index at the bottom of the front page. Because there exists a thumbnail with matching `view-transition-name` way up at the top of the page, there's an extraneous animation when landing on the post.

I tried using both CSS and JS to control `view-transition-name`, restricting its use to when thumbnails were clicked. The problem was that this broke back button transitions since the front page doesn't have a matching `view-transition-name` on initial load. It feels like making this more stateful or requiring more JS is a step in the wrong direction, so hopefully a viewport bounds restriction will be viable in the future.