---
title: Synthesizing what my Pulsatile Tinnitus sounds like
description: In February 2022, I began to hear my heartbeat and other phantom sounds, symptoms of a rare circulatory problem. Using synthesizers, I've recreated what they sound like.
pubDate: Sep 27, 2022
image: ./images/pulsatile-tinnitus-sounds/whistle.png
contentImage:
---

In February 2022, I began to hear my heartbeat pulsing in my right ear.

I was sitting at the same desk where I'm typing this post today. At first, I thought heard something faintly brushing in the room behind me, barely at the edge of perception.

Here's what it sounded like: (🎧 headphones recommended!)

<video loop controls preload="metadata" src="/post/pulsatile-tinnitus-sounds/initial.mp4" style="aspect-ratio: 1440 / 800"></video>

Later that night, I put in earplugs and noted that the sound was still there. After curious [googling](https://www.google.com/search?q=hearing+heartbeat+in+ear), I learned this is called [Pulsatile Tinnitus](https://en.wikipedia.org/wiki/Tinnitus#Pulsatile_tinnitus), and found the delightfully named [whooshers.com](http://www.whooshers.com).

<aside><b>Note: what follows is my personal story, not medical advice.</b> Keep in mind there's a wide variety of kinds and causes of Pulsatile Tinnitus. If you or someone you know is hearing unexpected noises, consult a doctor (I started with my GP).</aside>

Many months later, I met an [amazing team who specialize in Pulsatile Tinnitus at UCSF](https://www.ucsfhealth.org/clinics/pulsatile-tinnitus-clinic), where I was diagnosed with a likely [DAVF](http://neuroangio.org/patient-information/patient-information-brain-dural-fistula). If you look closely, you might be able to spot it in these [holographic explorations of my MRI scans](/post/brain-holograms-with-blender). I'm very lucky that these sounds have been my only symptom, and I'm scheduled for an operation which could fix the underlying cause.

Since my situation is relatively rare, I wanted to take this opportunity to preserve my qualitative experience of these phantom sounds before they're (hopefully!) gone. I hope this can provide a data point for the kinds of sounds one can experience.

<aside><b>Update:</b> My operation was a success and confirmed my DAVF diagnosis. I no longer hear my Pulsatile Tinnitus, and hopefully never will again.</aside>

## What does my Pulsatile Tinnitus sound like?

There's a broad variety of descriptions I've read online, ranging from hissing, gurgling, beeping, whooshing, to whining and whistling. What does a whistle sound like in this context? It's all very subjective, so having audio to listen to makes a huge difference. Some folks have been able to create [recordings of their Pulsatile Tinnitus sounds](http://www.whooshers.com/whooshersounds.html). Mine were not detectable via stethoscope.

I wanted to have my own basis for expessing what I'm hearing, because it's... really quite odd.

What follows is an attempt to portray my subjective experience of Pulsatile Tinnitus using [Bespoke](https://www.bespokesynth.com), a marvelous synthesizer created by [Ryan Challinor](https://twitter.com/awwbees). Bespoke's node-based approach to synths is perfect for exploratory sound design. Coincidentally, I first learned of Bespoke while taking part in [Synthruary](https://twitter.com/search?q=%23synthruary), mere days before my onset.

## Playing an unseen instrument

What really got my attention was when I was lying in bed, and I began to hear a whining sound:

<video loop controls preload="metadata" src="/post/pulsatile-tinnitus-sounds/whistle.mp4" style="aspect-ratio: 16 / 9"></video>

I KNOW. Wild right?

Thankfully, it's not very loud. Most background noise can drown it out. If you're wearing headphones, adjust the volume so that the bassy whooshing noise is barely audible.

Getting this going in Bespoke for the first time was quite an emotional moment for me. After nearly 8 months hearing such a weird, ineffable phenomenon, I finally had something I could point to and say: this is it!

I'd say this is about 90% similar to what I experience. It can be tricky to pin down all of the details, because I'm working from memory, but: qualitatively, this is very close. Initially, I was steeling myself for the frustration of spending hours fumbling around not hitting the mark, but I was shocked how quickly this came together. It's kinda interesting how everything can be reflected by such elemental synths: just 2 shaped noise generators and an oscillator.

## Variations on whooshes

In practice, what I hear has many modalities. The core sound is always a whoosh, and it presents in a few ways.

Often, the whoosh is longer (less staccato). This one I could actually effectively A/B because it's what I was hearing at the time I was tweaking the synth. At the correct volume it's _very_ close.

<video loop controls preload="metadata" src="/post/pulsatile-tinnitus-sounds/current.mp4" style="aspect-ratio: 1440 / 800"></video>

Another common motif is a whoosh with descending pitch:

<video loop controls preload="metadata" src="/post/pulsatile-tinnitus-sounds/descending.mp4" style="aspect-ratio: 16 / 9"></video>

Notice how you can kind of hear the whistling in there? I think that this is what becomes the louder, more resonant whistle. Occasionally I hear it abruptly change from a whistle to just whooshes, typically with one or two clicks when it happens.

## Oscillations

Here's a few variations on the whistles and whines. Sometimes the whoosh is more fuzzy and bubbly. The pitch range of the whine seems to vary quite a bit too, for instance, lower:

<video loop controls preload="metadata" src="/post/pulsatile-tinnitus-sounds/whine.mp4" style="aspect-ratio: 16 / 9"></video>

It can also be higher pitched. One thing I tried to represent here is how the pitch of the whine can be wobbly (courtesy of the pink "unstablepitch" node Bespoke provides):

<video loop controls preload="metadata" src="/post/pulsatile-tinnitus-sounds/whine-high.mp4" style="aspect-ratio: 16 / 9"></video>

Perhaps the biggest flaw in these examples is they don't capture how dynamic the sound is. It doesn't remain exactly in one pitch or timbre for as long as these samples. I did include some organic variation in them (e.g. by varying the tempo / my "heart rate"), but in practice, this is a weird, varying, chaotic system. I've thought about building a bigger synth which transitions between these sounds, but feel that would veer further into the realm of artistic interpretation, since it'll be harder for me to compare with the real thing.

## Bespoke save files

Here are the synth files, which can be opened in [Bespoke](https://www.bespokesynth.com).

In the order which they appear above:  
<a href="/post/pulsatile-tinnitus-sounds/initial.bsk">initial.bsk</a>,
<a href="/post/pulsatile-tinnitus-sounds/whistle.bsk">whistle.bsk</a>,
<a href="/post/pulsatile-tinnitus-sounds/whistle.bsk">current.bsk</a>,
<a href="/post/pulsatile-tinnitus-sounds/whistle.bsk">descending.bsk</a>,
<a href="/post/pulsatile-tinnitus-sounds/whistle.bsk">whine.bsk</a>,
<a href="/post/pulsatile-tinnitus-sounds/whine-high.bsk">whine-high.bsk</a>

Like most other content on this blog, these synths are licensed [Creative Commons BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/).
