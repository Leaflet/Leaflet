---
layout: post
title: The bugfixes of today are the legacy standards of tomorrow
description: Leaflet 1.0 beta 2 released, fixing over 50 bugs over the previous beta.
author: Iván Sánchez
authorsite: http://ivan.sanchezortega.es
---

Most of the time, developing with Leaflet is a bliss. We are able to abstract some browser behaviour, make some pretty decent guesses on when to use a modern browser feature, and generally make Leaflet feel the same across the myriad of similar-but-not-exactly-the-same web browsers out there. However, there are a few times when one hits very specific bugs to which the only answer is a facepalm.

Like last week. With the `transitionend` event. *Again*.

One of the great features of Leaflet 1.0.0 is smooth zoom (and fly) animations, powered by CSS transforms. These are very CPU and DOM efficient, providing a smooth animation in devices with very modest CPU power.

A big part of these animations is the [`transitionend`](https://developer.mozilla.org/docs/Web/Events/transitionend) DOM event. The whole ordeal is more or less as follows:

* The user scrolls their mouse wheel or hits a zoom plus/minus button.
* Leaflet wraps a bunch of map elements together, and applies a 250 millisec [CSS transition](https://developer.mozilla.org/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions) to it.
* At the same time, Leaflet disables interactivity in the map, because dragging the map would break the animation.
* Leaflet waits for a `transitionend` event. This should happen one frame after the 250 millisec duration of the animation.
* Leaflet unwraps some map elements, re-enables interactivity, and returns to a "non-animating" state.

But here's the catch: Even if CSS transitions and the `transitionend` event are very closely related, *sometimes* the `transitionend` won't be fired, particularly [when running safari in iOS](https://github.com/Leaflet/Leaflet/issues/2693#issuecomment-46053713) or [when using a very specific Android device](https://github.com/Leaflet/Leaflet/issues/3832#issuecomment-140505894).

Something obvious to do, then, is to enable CSS transitions and `transitionend` only if the browser supports them. By contrast, looking at which browser the user has, and then deciding which behaviour to use, is a well-known [antipattern](https://en.wikipedia.org/wiki/Anti-pattern) in web development. [Rivers](https://developer.mozilla.org/en-US/docs/Web/Guide/Writing_forward-compatible_websites) [of](https://learn.jquery.com/code-organization/feature-browser-detection/) [ink](http://www.html5rocks.com/en/tutorials/detection/index.html) have been written about the subject.

We, the Leaflet developers, try very, **very** hard to do things right. We want Leaflet to work reliably in every device out there and be future-proof and use the latest browser features. All while keeping the code clean to work with and while using best practices.

Unfortunately, this desire to do things right sometimes has unintended consequences.

The *right* way to check if a browser supports CSS transitions & `transitionend` is to do feature detection. In this case, Leaflet detects is the `transition` CSS property exists. As CSS transitions were experimental at some point, Leaflet checks for the standard `transition` name, then `-webkit-transition`, `-o-transition` , `-moz-transition` and `-ms-transition`, as any good future-proof library would.

But then, [W3C decided it was a good idea to use the `-webkit-` prefix in non-webkit browsers](http://www.sitepoint.com/w3c-css-webkit-prefix-crisis/).

And then, [Android 4.1.1 came and broke everything and forced Leaflet to work around a browser bug](https://github.com/Leaflet/Leaflet/commit/64ca0af124b7145e8c2a746e2fb087b2298a4b72).

And then, [Firefox implemented the `-webkit-` CSS prefix by default](https://bugzilla.mozilla.org/show_bug.cgi?id=1213126).

And then, [Leaflet stopped working on the beta of Firefox v46](https://bugzilla.mozilla.org/show_bug.cgi?id=1236930).

For most web developers this will be another quirk. For me, it's watching the [birth](https://github.com/whatwg/compat/issues/24) of a horrible [compatibility standards for the web](https://compat.spec.whatwg.org/).

We, the Leaflet developers, try very, **very** hard to do things right. We just tried to make everyone happy, bugfix something in a very specific browser, but the current outcome is a new legacy standard.

---

Unfortunately `transitionend` is not a lone case. Last year I expected multi-input devices such as the Microsoft Surface (touchscreen + USB mouse) to be a headache, and just recently we had to code our [first hack ever for MS Edge](https://github.com/Leaflet/Leaflet/pull/4131/files#diff-9090b4e6161dbf1beb1091cabcfb8e38R68). I predict `pointer` events to become a bigger problem if/as Win10 wins a bit more of traction.

«Perform feature detection», they said. «don't sniff the browser», they said. That's easy to say when you're not dealing with [undetectable browser features](https://github.com/Modernizr/Modernizr/wiki/Undetectables).

---

So, how could this ever happen? This is my personal theory:


#### 1. The standards for the web are insanely complex

Fifteen years ago we could write all of the HTML3 bits and pieces by memory, and we could have one cheatsheet for CSS2.

Today we have HTML5, media extensions (video, audio, MIDI, joysticks), WebGL, Javasacript ES5, Javascript ES6 (Mutators, Promises, fetch API), sourcemaps, CSS3, CSS3 animations, CSS transitions (not to be confused with CSS animations!), CSS media queries, SVG, web fonts, web workers, websockets, web speech, web storage (and cookies still), offline appcache, CORS, geolocation, generating your own client SSL certificate on the browser. Oh, and make sure blind people can read it by adding some AIGA tags.

Fifteen years ago, creating a new browser able to browse most of the web was a feasible task. It could be ugly, but it was feasible. Nowadays, it's a huge effort, as most websites make use of a lot of advanced (and complex) web technologies. This means that...


#### 2. Realistically, there are only 4 browsers

Firefox, Chrome, Safari, and IE/Edge. Anything else is either a reuse of one of these four rendering engines (Gecko, Google's webkit, Apple's webkit, Trident/HTMLEdge), or something that implements only a tiny portion of the current web technologies (yeah, I still use [w3m](https://en.wikipedia.org/wiki/W3m) sometimes).

The main implication is that *new web technologies are driven by one out of just four possible actors*. And each of those actors want to nudge the web towards a different goal:

* Google wants to track you better and provide a better experience in Android
* Apple wants to provide a better experience in the latest iFad
* Microsoft wants people to forget they made IE
* Mozilla just everybody to be able to contribute to the web

Just look at what each vendor is pushing towards. Google pushes things like WebGL, appcache and web workers. Apple pushed hard for graphics acceleration via CSS (and in-browser ad-blocking to screw Google). Microsoft is pushing `pointer` events for all their new multifactor touchscreens. Mozilla pushed for `do-not-track` and semantic web.

So the four main vendors are basically free to implement a new shiny feature whenever they want, if that will benefit them. And they will provide shiny developer demos and talk about the new shiny feature in conferences, all while trying to not break anything else. That leads to...


#### 3. The hell of vendor prefixes

Vendor creates something new, `feature` and hides it behind a vendor prefix, `-vendor-feature`. Some eager web developer implements it in a publicly-facing webpage. Vendor pushes the `-vendor-feature` to a million mobile devices out there. Hordes of web developers implement the feature based on the eager developer example, which uses `-vendor-feature` and not just `feature`.

Then, OtherVendor gets jealous. OtherVendor also wants this feature, and also wants its browser to support the hordes of webpages which already use `-vendor-feature`. Web developers are too lazy to fix it. So instead of implementing `feature` and `-othervendor-feature`, it also implements `-vendor-feature` "just to be safe".

This is exactly what happened in the [history of user-agent strings](http://webaim.org/blog/user-agent-string-history/):

> And Microsoft grew impatient, and did not wish to wait for webmasters to learn of IE and begin to send it frames, and so Internet Explorer declared that it was “Mozilla compatible” and began to impersonate Netscape, and called itself *Mozilla/1.22 (compatible; MSIE 2.0; Windows 95)*, and Internet Explorer received frames, and all of Microsoft was happy, but webmasters were confused.

The only difference being that now, Firefox and IE/Edge pretend to have webkit **features** in order to not break the *de facto* web.


#### 4. The bless and curse of not using a CDN

The whole `transitionend` ordeal could have been avoided if there was a single point where Leaflet would be fetched for all users. Then we could fix it properly and it would be automatically deployed to all new users from there on.

This could have happened in a propietary platform; think Google Maps. In that case, some Google engineer would have edited the javascript code for Google Maps, and problem solved.

But Open Source doesn't work like that. There is no single way of getting Leaflet (you could copy the Javascript from any site using Leaflet!). You are free to use Leaflet without needing to use a specific CDN server, or without  needing to connect to any network at all. You don't need to ask anybody for permission to mirror the code. And **this is a good thing**. This is how Open Source works.

Unfortunately, this can create legacy quite fast, but this is expected of the web. After all, the webpage for a news article from 1998 should look today exactly like it looked like in 1998.

To be clear, it's not Open Source libraries which creates legacy: any experiment with or implementation of vendor prefixes creates legacy. Open Source libraries create legacy *faster* because they can be copied and adopted *more efficiently* than individual, private, closed, privative implementations.


#### 5. The brittle state of the web

Web technologies live in a delicate balance. On one side there are the browser vendors; on the other side the big closed-source web systems (e.g. Facebook, Twitter, Netflix); and on the other, a myriad of Open Source sites and libraries. And everyone pulls towards their own goals.

The big players can push new technologies and modify big code repositories serving millions of users, yet the intrinsic distributed nature of the WWW has given Leaflet (and other libraries and frameworks) enough traction to make its hacks and kludges a *de facto* feature of the WWW.

And the "kludgy web" is likely not going away. Nowadays we can compare what technologies [the](https://platform-status.mozilla.org/) [browsers](https://dev.windows.com/en-us/microsoft-edge/platform/status/) [are](https://www.chromestatus.com/features) [implementing](https://webkit.org/status/), and:

* Some vendors are never going to implement some features.
* There will still be vendor-prefixed features.
* Feature detection is different for each feature (sometimes not provided in any example).
* It's still pretty impossible to detect the version of the rendering engine without resorting to the (very broken) user-agent string.
* As implementations are independent (and sometimes lacking a reference implementation), there will be *tiny* subtle differences that sooner or later will show up.
* Polyfills are not provided (most of the time), they are coded *a posteriori*.

Unfortunately, I don't think that standards bodies like the [W3C](https://www.w3.org/) and the [WHATWG](https://whatwg.org/) can help to un-kludge the future. And given the different rendering engines and different codebases, using the same code to implement the same feature in all browsers seems implausible. Maybe we the WWW people need some kind of [Debian-like manifesto](https://www.techdirt.com/articles/20160112/16582733316/ian-murdock-his-own-words-what-made-debian-such-community-project.shtml) to bring everybody together. Maybe we need to drop everything and engineer HTML6 with feature dependencies in mind.

Or maybe we'll just keep writing kludges and getting angry and writing rants for a few more years until the dust settles.

— Iván

