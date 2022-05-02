---
layout: tutorial_v2
title: A guide to basic Leaflet accessibility
---

## Accessible maps

[Web accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
is the inclusive practice of ensuring no barriers exist
that would prevent interactions or information access.

This guide to Leaflet accessibility can help you create maps that are usable
to persons of a wide range of abilities.

### Preserve useful defaults

Leaflet comes with a set of useful defaults.

The map container and markers are keyboard operable by default,
this enables users who are unable to use a pointing device.
Consider the effects on your users before changing defaults such as these.

### Markers must be labelled

When using markers,
it is vital to ensure each has a unique and descriptive
[`alt`](/reference.html#marker-alt)
or
[`title`](/reference.html#marker-title):

<pre><code class="javascript">var marker = L.marker([50.4501, 30.5234],
  {alt: 'Kyiv'}).addTo(map) // "Kyiv" is the <a href="https://www.w3.org/TR/accname-1.1/#dfn-accessible-name"><em>accessible name</em></a> of this marker
  .bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');</code></pre>

Resulting in markers that are discernible to
[screen reader](https://en.wikipedia.org/wiki/Screen_reader)
users:

{% include frame.html url="example.html" width=600 height=400 %}

In the case of `divIcon`s,
[custom HTML](/reference.html#divicon-html)
can otherwise provide a visual or non-visual label.

### Test your maps

The best way to discover accessibility issues
is to test your maps using only a keyboard,
as well as using a screen reader.
You may already have a screen reader pre-installed,
for example:

- [Narrator](https://support.microsoft.com/en-us/windows/complete-guide-to-narrator-e4397a0d-ef4f-b386-d8ae-c172f109bdb1)
on Windows
- [Orca](https://help.gnome.org/users/orca/stable/index.html.en)
on Linux
- [TalkBack](https://support.google.com/accessibility/android/answer/6283677?hl=en)
on Android
- VoiceOver on
[macOS](https://support.apple.com/guide/voiceover/welcome/mac)
and
[iOS](https://support.apple.com/guide/iphone/turn-on-and-practice-voiceover-iph3e2e415f/ios)

### Purely decorative maps

Some maps are
[purely decorative](https://www.w3.org/TR/WCAG21/#dfn-pure-decoration)
and not intended for users to interact with
(in similar fashion to background-images and -videos).

Such maps should be hidden from
assistive technologies (ATs),
and have no focusable descendants.
This is to avoid the potential to confuse screen reader users,
and to remove any unnecessary tab stops for keyboard users.
A simple way to achieve this is to use the HTML
[`inert` attribute](https://github.com/WICG/inert)
polyfill:

```html
<!-- This map is for aesthetic purposes only, and can not be interacted with! -->
<div id='decorative-map' inert></div>
<script src='https://unpkg.com/wicg-inert@latest/dist/inert.min.js'></script>
```

### Utilizing plugins

[Plugins](/plugins.html)
can enhance the experience for your users,
but can also degrade it in some cases.
Therefore it is important that you
[test your maps](#test-your-maps)
whenever a new plugin is added.

If you find an accessibility issue in a plugin,
please report it to the plugin's author.

An example of a plugin that can enhance the experience for your users is the
[Leaflet.fullscreen](https://github.com/Leaflet/Leaflet.fullscreen)
plugin.
By allowing users to enter into fullscreen mode,
they can explore the map in isolation,
focusing their attention,
this is especially helpful to keyboard and screen reader users
(as they are less likely to unintentionally navigate outside the map),
but also mobile users in general.

### Use an up-to-date version of Leaflet

Leaflet is constantly improving accessibility.
Use the latest stable
[version](/download.html)
for the greatest features!
