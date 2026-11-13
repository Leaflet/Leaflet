---
layout: tutorial_v2
title: Accessible Maps
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

### Keyboard shortcuts

| Key | Action |
| --- | --- |
| `Tab`, `Shift`+`Tab` | Move between the map, its markers and its controls |
| Arrow keys | Pan the map |
| `+` or `=`, `-` or `_` | Zoom in, zoom out |
| Arrow keys on a [draggable](/reference.html#marker-draggable) marker | Move the marker |
| `Shift` with an arrow or zoom key | Pan, zoom or move the marker three times as far |
| `Enter` or `Space` on a marker | Open the marker's popup |
| `Enter` or `Space` on the layers control | Open its list of layers |
| `Escape` | Close the open popup or list of layers, or exit fullscreen |

The pan and zoom keys work while the map itself has focus,
and their steps are set by the [`keyboardPanDelta`](/reference.html#map-keyboardpandelta)
and [`zoomDelta`](/reference.html#map-zoomdelta) map options
(on a US keyboard, typing `+` involves `Shift`, so it zooms three levels while `=` zooms one).
Nothing on the map tells users that these keys exist, so it is worth listing them near your map,
and the [`ariaKeyShortcuts`](/reference.html#map-ariakeyshortcuts) option exposes them to assistive technologies.

### Markers must be labelled

When using markers,
it is vital to ensure each has a unique and descriptive
[`alt`](/reference.html#marker-alt)
or
[`title`](/reference.html#marker-title),
which becomes its [accessible name](https://www.w3.org/TR/accname-1.1/#dfn-accessible-name):

```js
const marker = new Marker([50.4501, 30.5234], {alt: 'Kyiv'}).addTo(map)
	.bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');
```

Resulting in markers that are discernible to
[screen reader](https://en.wikipedia.org/wiki/Screen_reader)
users:

{% include frame.html url="example.html" %}

In the case of `DivIcon`s,
[custom HTML](/reference.html#divicon-html)
can otherwise provide a visual or non-visual label.

### Translate built-in text

Screen readers announce the titles and labels of Leaflet's controls, which are in English by default.
On a site in another language, translate them with the [`translate`](/reference.html#map-translate) map option.
Here's every built-in text with a Ukrainian translation:

```js
const uk = {
	'Map': 'Мапа',
	'Marker': 'Маркер',
	'Zoom in': 'Наблизити',
	'Zoom out': 'Віддалити',
	'Layers': 'Шари',
	'Enter fullscreen': 'На весь екран',
	'Exit fullscreen': 'Вийти з повноекранного режиму',
	'Close popup': 'Закрити'
};

const map = new LeafletMap('map', {translate: text => uk[text]});
```

If you already use an i18n library, pass its function instead, e.g. `text => i18next.t(text)`.

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
[`inert` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert):

```html
<!-- This map is for aesthetic purposes only, and can not be interacted with due to the 'inert' property! -->
<div id='decorative-map' inert></div>
```

### Offer a fullscreen mode

By allowing users to enter into fullscreen mode,
they can explore the map in isolation,
focusing their attention,
this is especially helpful to keyboard and screen reader users
(as they are less likely to unintentionally navigate outside the map),
but also mobile users in general.
Leaflet comes with a [`FullscreenControl`](/reference.html#fullscreencontrol) for this:

```js
new FullscreenControl().addTo(map);
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

### Use an up-to-date version of Leaflet

Leaflet is constantly improving accessibility.
Use the latest stable
[version](/install.html)
for the greatest features!
