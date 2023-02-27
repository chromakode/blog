---
title: The rise of self-hosted apps
description: "Here's a sleeper prediction: a new crop of killer consumer apps are coming: self-hosted PWAs, and they will replace cloud services for many uses."
pubDate: Feb 27, 2023
---

# The rise of self-hosted apps

Here's a sleeper prediction: a new crop of killer consumer apps are coming: [self-hosted](https://www.reddit.com/r/selfhosted) [PWAs](https://web.dev/progressive-web-apps), and they will replace cloud services for [many uses](https://github.com/Haxxnet/Compose-Examples).

To name a few:

- **[Home Assistant](https://www.home-assistant.io)** is a universal personal automation system, combining every smart device and data source available into dashboards, plots, and [IFTTT](https://ifttt.com)-like automations.

- **[Frigate](https://frigate.video)** monitors security cameras with private realtime AI object recognition.

- **[Paperless](https://docs.paperless-ngx.com)** indexes scanned documents with OCR and neural net based categorization.

- **[PhotoPrism](https://www.photoprism.app)** is an AI-powered private photo organizer with auto labeling and face recognition.

- **[code-server](https://github.com/coder/code-server)** is [VSCode](https://code.visualstudio.com), the [most popular code editor](https://survey.stackoverflow.co/2022/#section-most-popular-technologies-integrated-development-environment), with self-hosted remote access.

There's a _buzz_ building around apps like [Home Assistant](https://www.home-assistant.io), which casts a large shadow over the smart home industry. You may not have heard of most of these apps before -- that's not unexpected. The technical knowledge required to set them up mostly relegates them to nerds running [homelabs](https://www.reddit.com/r/homelab).

Thanks to favorable market conditions, home turf advantages of open source software, and a raft of enabling technologies from the past few years, there's never been a better time for a few leading self-hosted apps to explode in popularity. Let's dive into this phenomenon.

## Users want to own their data

In a [survey by Cisco in June 2022](https://www.cisco.com/c/dam/en_us/about/doing_business/trust-center/docs/cisco-consumer-privacy-survey-2022.pdf), 76% of respondents said they would not buy from a company they do not trust with their data. The study classified 32% as "privacy actives", who identified as: caring about data privacy, willing to invest time and money in it, and had actually _switched providers_ based on their data policies. In a 2021 US survey, [KPMG found 86% say data privacy is a growing concern](https://advisory.kpmg.us/articles/2021/bridging-the-trust-chasm.html), with 30% responding that under no circumstances would they be willing to share personal info with businesses.

Recently, [Eufy cameras were found to be uploading footage to their cloud](https://www.theverge.com/2022/11/30/23486753/anker-eufy-security-camera-cloud-private-encryption-authentication-storage). Notably, these cameras were [marketed with claims of private, local-only storage](https://www.theverge.com/2022/12/16/23512952/anker-eufy-delete-promises-camera-privacy-encryption-authentication). Home air quality monitor [Awair junked their first generation of connected devices](https://www.reddit.com/r/Awair/comments/y7i5ku/awair_discontinues_support_for_v1_devices) by discontinuing the cloud services on short notice. Through unaudited design faults and a business model which relegates ongoing support to a cost center, IoT manufacturers are failing to deliver on privacy or longevity.

This is the sweet spot for open source self-hosted apps. Self-hosted apps have a home field advantage where data is private and sensitive: the sensors in your home, security cameras, paperwork, passwords, personal photos, and health data. There is latent unserved demand for apps which offer users confidence their data is _truly_ private.

## Local = fast

Another major benefit of local apps is latency. This is something you immediately feel when interacting with them. Every operation is nearly instant. The effect is magnified for users with slow or unreliable internet, or those without an always-on connection. Even with the shift towards edge computing to bring servers as close as possible to metro areas, for realtime automation and recognition tasks, you can't beat physics: local apps will win.

## Self-hosted AI has a bright future

Local AI is a notable feature of the majority of apps I listed above. Historically, large firms have had an advantage here. They have larger data sets to work with and open alternatives were generations behind. While [LLMs](https://blogs.nvidia.com/blog/2023/01/26/what-are-large-language-models-used-for) currently require impractically expensive hardware to run, thanks to projects like [Whisper](https://github.com/openai/whisper), [DeepSpeech](https://github.com/mozilla/DeepSpeech), and [Hugging Face](https://huggingface.co), an increasingly large class of cutting edge AI tools have become accessible to run locally.

An interesting scaling property of machine learning is that while vast amounts of compute are required to train models, the models themselves require orders of magnitude less time and energy to run. As it becomes cheaper to run models locally, inference in private spaces like speech and cameras are seeing a push towards local processing, both for speed and privacy.

## Successful communities outcompete big tech

Let's take another look at Home Assistant. One of its key successes is its [massive library of integrations](https://www.home-assistant.io/integrations) with any device imaginable. The smart home industry faltered when it became a [cross product](https://en.wikipedia.org/wiki/Cross_product) of individual hardware makers supporting Google, Apple, and Amazon's disparate home automation systems. Product companies are bandwidth-limited by how they form partnerships. Planned two-way handshakes are slow vs. permissionless integrations built on APIs or hacks.

An army of nerds are now using Home Assistant to solve their specific problems and sharing how they did it. If you search for any particular home automation challenge, you'll probably find one of the first results is the [Home Assistant forum](https://community.home-assistant.io).

Why have products like Google Home plateaued, while Home Assistant has taken off? Google Home has its own huge list of device integrations, but the controls it provides are too simplistic. An expensive, top-heavy product development team like Google or Apple has to focus on solving bounded problems. This makes them uncompetitive when the problem space is sparse and a community of devs are expanding the space for free.

## The web is good enough

Future apps are not installed individually on each device. Apps are services you interact with across _all_ your devices. Self-hosted web apps are uniquely well positioned for this, though there's still a few pieces missing (particularly discovery of available local web-apps).

[Progressive Web Apps](https://web.dev/progressive-web-apps) have been around for a while, but have never had their day in the sun. A major nonstarter was the lack of [push notifications on Mobile Safari](https://webkit.org/blog/13877/web-push-for-web-apps-on-ios-and-ipados), which was recently announced to be in iOS 16.4. It's no coincidence that the apps I listed above are all PWAs: the web is easiest to develop for, works everywhere, and has the largest pool of developers.

A common critique is that web apps yield clunky user experiences. This will be debated endlessly in developer circles, but native feeling UI is not necessary for mass adoption; the bar is "good enough". Component libraries have closed that gap. [MUI](https://mui.com), [Chakra](https://chakra-ui.com), and [Tailwind](https://tailwindcss.com) make it easy to create a UI which feels cohesive and adapts well to any sized device. Looking back across my 15 year professional history building apps, PWAs + an off the shelf component library are the fastest path to "good enough" that has ever been available.

## The last mile is a huge opportunity

It's never been easier to self-host apps. [Let's Encrypt](https://letsencrypt.org) has made standing up secure web apps instant and automatic. [Docker](https://www.docker.com) made them easy to install. Aside from [Raspberry Pis](https://www.raspberrypi.org) becoming [unobtanium](https://rpilocator.com) over the past year, there are [many](https://pine64.com) [available](https://rockpi.org) small, low power computers in the $30-50 dollar range.

However, let's be real: **the biggest thing holding self-hosted apps back is they're _still_ too difficult to install**.

A potential user must be able to:

- Set up Linux on a device and get it onto their network.
- Follow installation instructions specific to their chosen apps and distro.
- Configure subtleties like DNS and HTTPS, then open the right address in their browser.

These steps are hindered by there being multiple ways to accomplish them, yet no best way.

For self-hosted apps to succeed, 5 minutes must be all it takes to get up and running. It must be trivial to discover and install new apps, and the apps themselves need to be immediately discoverable on all of your devices.

One promising solution would be a physical device that gets a foot in the door and tunnels to the internet. Such a tunnel could simplify user setup greatly by providing external access and automated certificate management. This is what [Home Assistant Yellow](https://www.home-assistant.io/yellow) is doing, complete with an [add-on browser](https://www.home-assistant.io/addons) where you can install containers packaging other apps.

The future of self-hosted apps looks bright, and they have a shot at disrupting spaces currently dominated by cloud hosted apps. There is a chicken-and-egg problem here. As more [awesome self-hosted apps](https://github.com/Haxxnet/Compose-Examples) appear, the incentive to ease adoption grows. Once you've solved it for one app, you've opened the door for others. I think it will take vision and creative thinking, but eventually the dam will break. We've seen this story play out many times before. When free apps tackle a market well and are easy to adopt, they take off explosively.
