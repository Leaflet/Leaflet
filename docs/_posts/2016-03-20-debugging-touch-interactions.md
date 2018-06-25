---
layout: post
title: Debugging touch interactions
description: To debug Leaflet, sometimes you need to create a new tool.
author: Iván Sánchez
authorsite: http://ivan.sanchezortega.es
---


Most of the time, fixing bugs in the Leaflet code is a breeze. The code is simple, easy to read (for the most part) and well structured. Code conventions and unit tests make it easy for newcomers to try some modifications to the core code. During the past few months we've sent a few simple bug reports to the folks at [Your First PR](https://yourfirstpr.github.io/) - we love to see first-timers contributing fixes to Leaflet!


Some of the difficulties of maintaining/developing a javascript library like Leaflet is making sure that everything works on every major browser out there. A technique that works on Firefox on a Ubuntu desktop might result in glitches in Safari on a Macbook; something that works in Edge on Windows 10 might break completely in Chrome on Android.

Fortunately, all of the browser-specific hacks in Leaflet can be easily seen by looking at the [references to `L.Browser`](https://github.com/search?q=Browser+repo%3ALeaflet%2FLeaflet+language%3AJavaScript+extension%3Ajs+path%3A%2Fsrc&ref=searchresults&type=Code&utf8=%E2%9C%93) in the code.

This can lead to somewhat [undesirable code](https://github.com/Leaflet/Leaflet/blob/master/src/dom/DomEvent.DoubleTap.js#L65) sometimes:

<pre><code class="javascript">    // On some platforms (notably, chrome on win10 + touchscreen + mouse),
    // the browser doesn't fire touchend/pointerup events but does fire
    // native dblclicks. See #4127.
    if (!L.Browser.edge) {
    	obj.addEventListener('dblclick', handler, false);
    }
</code></pre>

I've been told more than a few times by browser developers that browser sniffing is wrong, and that feature detection is right. I mean, detecting 3D CSS transforms and HTML5 `<video>` support is easy, but there is no (sane) way to detect if a browser fires a `dblclick` event by itself when double-tapping a touchscreen.

Debugging touch interactions is particularly tricky. Sometimes the conditions to reproduce a touch-interaction bug is simple (double-tap the touchscreen in the same spot), but sometimes they are more specific. In [#3798](https://github.com/Leaflet/Leaflet/issues/3798) and [#3814](https://github.com/Leaflet/Leaflet/issues/3814) the conditions are "drag with one finger, then put down another finger and pinch", and in [#3530](https://github.com/Leaflet/Leaflet/issues/3530) it's "pinch in until `maxZoom` is reached, then do a two-finger drag".

The problem with this kind of bugs is that they're **frustrating** and **time-consuming** to reproduce under controlled conditions. Imagine having a code editor and a browser debugger when at the same time using two hands to perform a very specific touch gesture while watching the debugger. Then you want to inspect a variable in the debugger but you cannot move your fingers even a pixel because that will run more code and change the state.

And then, for the fifth time in the last hour, the wobbly phone charger connector wobbles again, and the debugger disconnects, and you have to start all over again.

<table class="image">
<!-- <caption align="bottom"><small></small></caption> -->
<tr><td style='text-align:center'><img src="https://i.chzbgr.com/full/4896152320/h3FAAE99E/" alt="rage quit"/></td></tr>
</table>

If I had an extra hand or two, debugging touch interactions would be much simpler, but biotechnology is still far away from allowing me to grow an extra hand.

Fortunately, we can leverage [dispatching custom events to the browser](https://developer.mozilla.org/docs/Web/API/EventTarget/dispatchEvent). Normally, when we use a mouse (or a touchpad, or a touchscreen, or a digitizer tablet), the web browser will generate a [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) (or a [`TouchEvent`](https://developer.mozilla.org/docs/Web/API/TouchEvent) or a [`PointerEvent`](https://developer.mozilla.org/docs/Web/API/PointerEvent)). But instead of that, we javascript programmers can create a synthetic (i.e. fake) event, then throw it to the browser so it can dispatch it to whatever code is listening for an event.

Unfortunately creating and dispatching such events is cumbersome. A touch gesture involves *at least* 4 to 8 events in a particular order, with particular data, with a particular timing. There have been a few attempts to automate this (the best I could find was the [hammer.js simulator](https://github.com/hammerjs/simulator)), but there is no good way of emulating complex custom touch gestures.

Until now.

I'm proud to introduce [**prosthetic-hand**](https://github.com/Leaflet/prosthetic-hand), for all you javascript debugging needs that require you to have an extra hand.

With prosthetic-hand, I can now automate a pinch-zoom gesture in a Leaflet webpage:


<table class="image">
<caption align="bottom"><small>You get to see my disembodied fingers as a bonus</small></caption>
<tr><td style='text-align:center'><img src="/docs/images/2016-03-20-prosthetic-hand-zooming.gif" alt="Animated screenshot of prosthetic-hand zooming in and out"/></td></tr>
</table>


With this library loaded, just ask for an extra hand (with a specific timing mode):
<pre><code class="javascript">var h = new Hand({ timing: 'frame' });
</code></pre>

Then grow some fingers:
<pre><code class="javascript">var f1 = h.growFinger('touch');
var f2 = h.growFinger('touch');
</code></pre>

Then move the fingers around (using pixel coordinates and milliseconds):
<pre><code class="javascript">f1.wait(100).moveTo(250, 200, 0)
	.down().wait(500).moveBy(-200, 0, 1000).wait(500).up().wait(500)
	.down().wait(500).moveBy( 200, 0, 1000).wait(500).up().wait(500);

f2.wait(100).moveTo(350, 200, 0)
	.down().wait(500).moveBy( 200, 0, 1000).wait(500).up().wait(500)
	.down().wait(500).moveBy(-200, 0, 1000).wait(500).up().wait(500);
</code></pre>

You can check this in the [live prosthetic-hand demos](https://leaflet.github.io/prosthetic-hand/demos/).

The prosthetic-hand library is not perfect, and some types of events only work in some browsers, but it can help trigger mouse/touch/pointer events in a repeatable way, with adjustable timing, allowing developers to keep both hands at the debugger. The timing modes allow granular control of the events fired, allowing to run less iterations of the code for the same gesture, which in turn means a simpler, better understanding of what's going on.

---

A famous quote (often [misattributed to Abraham Lincoln](http://quoteinvestigator.com/2014/03/29/sharp-axe/)) says:

<blockquote>A woodsman was once asked, “What would you do if you had just five minutes to chop down a tree?” He answered, “I would spend the first two and a half minutes sharpening my axe.”</blockquote>

Web development is no different - having the right tools will make your task so much easier.

It's not just a matter of time. Maybe writing a tool from scratch was time-consuming, but the best gain is that debugging **stops being frustrating**. Before, it was "use a hand on the touchscreen, look closely at the debugger, don't use breakpoints because you don't have enough hands". Now it's "change the timing on the prosthetic-hand events, set a breakpoint, *boom*".

And what's even better, having an automated tool means that Leaflet now has [**unit tests for touch interactions**](https://github.com/Leaflet/Leaflet/blob/master/spec/suites/map/handler/Map.TouchZoomSpec.js). The PhantomJS headless web browser can understand the `TouchEvent`s that prosthetic-hand generates, and can check if a map behaves as expected when that gesture is performed.

The amount of time and headaches we'll save in Leaflet by having automated touch tests is going to be huge. We can only hope more projects will benefit from similar automated testing.

---

Don't just write open-source code. Make better tools for everybody.

Yours,
Iván