---
title: "Coalesce dev diary: first post"
pubDate: Jan 28, 2024
description: A first attempt at dogfooding my podcast editor by talking about it.
---

<div class="audio-header">

Listen to the spoken version of this post:

<audio controls src="/post/coalesce-dev-diary-first-post/audio.mp3"></audio>

</div>

So, I'm going to try something new here.

For a long time I've had an intention to write more about what I create, but never seemed to really find the time. And I don't think I'm particularly unique in this regard.

I've been working for the past six months on an audio editor called Coalesce that transcribes your audio and lets you edit it as text. This is the first of what I hope to be a series of development diaries where I just sit down and talk about what I've been working on lately.

So as an experiment, I wanted to see if speaking extemporaneously would help me to get these ideas out and avoid the perfectionism creeping in. Why not dogfood my own project and share what I've been working on by talking about it? I can have Coalesce generate the transcriptions and then it should be pretty easy to post that.

So, here goes!

## Why build a podcast editor?

Coalesce is a transcription-based podcast editor. You put your audio files into it, it turns those into text, and then you can edit the text like any other text document. Move words around, delete words, edit it more as an outline. Coalesce, the audio editor, will chop up the audio to match the edits that you make to the text.

One of the reasons why I decided to build a podcast editor is because I really love podcasts. I love listening to people speak. I think that there's a lot of really interesting nuance that comes from the spoken word.

And it's also, frankly, something that is multitaskable: I really like that I can have a headset on, I can be doing something with my hands and be learning something or consuming information at the same time.

I also really like improvisation and that leads to an interesting conflict because it takes time least for me, to get to the core of the ideas I want to talk about. As a listener, I just want to cut through all of that. I want to hear the author's thoughts in a clear and concise way. I want economy of my time as a listener.

But as a creator, I like meandering. I like exploring. I like seeing what comes up when I'm speaking or thinking extemporaneously.

One of the things that really excites me about what we can now do with transcription tools is there's this best of both worlds opportunity where I can see what I said as a document and edit it and cut out all the stuff that I don't think makes sense, move things around so that perhaps the ideas connect together better, and produce something that hopefully respects your time as a listener or as a reader.

## Project goals

There's a couple things I'm trying to do with Coalesce.

### Transcription-based

First of all, it's transcription-based.

I think it's a really interesting time to be working on transcription because a lot of organizations like OpenAI and Meta are releasing research projects around voice transcription and generation. Many of them are open-source and unencumbered for me to build upon. I hope that over the next couple of years, even more will be released.

Voice generation seems more morally and ethically complex to work in. I understand why these models aren't more widespread, but I'm hoping in a couple years' time, there will be even more tools to work with here. It's very exciting to me because as a non-expert, I can integrate close-to-state-of-the-art techniques. The quality is amazing, frankly, and I only expect it to get better. So that's cool.

### Collaborative

Another core aspect of Coalesce is that it's collaborative. Making the editor collaborative actually accomplishes two things. First, it makes it possible for everyone to pitch in, but it also blurs the line more between creator and editor. And where that's exciting to me, is making podcasts with groups.

So in my own personal experience recording a podcast with my friends, I took on the brunt of the editing process and as I was editing things, making choices about whose narrative would lead and making tweaks to the ordering and structure of the conversation, I could feel my subjectivity creeping in there.

These are the things that sounded good to me, and I should lean into the things that sound good to me. But I recognize that sometimes those might come at the expense of what would sound good to my collaborators.

So I think it could be interesting to give more creative control across all the speakers in a podcast. Because now it's just a shared text document that we can all edit together. I'm not sure if this is going to resonate with people. It's something that could end up being a solution in search of a problem. But from my own experience, it was what I wanted.

### Open-source

When I was about 10 or 11, I had the idea to search the web for a tool that would let me create 3D art. And naturally, I stumbled upon Blender. Its creator, Ton Rosendaal, is a major inspiration of mine. What's cool about Blender is it was always offered as freeware. Even in the early 2000s, while it was being developed as a for-profit tool, you could download and have access to a ton of really interesting features. 

Maybe not as good as some of the professional tools at the time, but for a kid like me, it was mind-blowing. I have to have spent hundreds of hours making pictures in Blender, and it inspired me to pursue digital art.

Another piece of software I used a lot as a teenager was Ardour, a digital audio workstation by Paul Davis, which was open source and available on the Linux distros I used at the time. It was my gateway into amateur audio production.

When you get a new tool, it defines the possibility space as a creator. Having a rich and full-featured audio editor for free in my bedroom accelerated my path towards making music. Ardour's an especially fun example because I'm sitting here 20 years later using Ardour 7 to record this.

So I'm really grateful to projects like Blender, Inkscape, and Ardour for giving me creative tools. My hope is to contribute a tool that can help save creators time and help them make better podcasts. Especially for folks for whom the professional tools might be less accessible.

## Balancing quality vs. speed

I've been working on Coalesce for about six months now.

There's a bunch of topics I'd love to do a deep dive on, like Coalesce's audio scheduler, like how building a collaborative editor has changed the way I needed to think about the backend. To the infrastructure complexities I've had from how these different decisions stack together.

But like many projects of mine, now it's at that uncomfortable middle point where it's probably not good enough or polished enough to stand on its own as a tool for other people to use. But at the same time, it's past the prototype phase.

I have some confidence in it, and I want to evolve it to the point where people are editing real podcasts using this thing. So I've been working on taking this prototype to production over the last couple months.

I think that the best way to introduce this tool to people is to give them a place right away where they can try it out. And not everyone has a GPU or a fast CPU available to process the transcriptions.

So for its initial incarnation, I'm building it as a web app. That's led me towards this path of building something that is reasonably scalable out the gate. Because I think this thing is really cool, and when I put it out there into the world, I don't want it to immediately fall over. 

If this never finishes because I spent too much time on scaling, and too much time thinking ahead to building a durable platform, that's not good either. I'm trying to find a happy medium between rapid prototyping and putting something out there that I can stand behind and say, if you start making a podcast with this, it's going to keep working.

## To be continued

I've thought a lot about these trade-offs, and I think that by writing them down or by talking them out, it's not just a useful reflection for me, but it's a good way to capture a history of what I was weighing when I made technical decisions, and maybe can serve as food for thought if you're building things too. It's all been a lot of fun to think through and put together.

But for now I'm going to leave it at that.

This is an experiment. I hope you've enjoyed reading or listening to this and I'm looking forward to coming back and making some more.

Thanks for listening!