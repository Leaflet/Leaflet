---
layout: v2
title: Blog archive
bodyclass: blog-page
---

## Leaflet Blog Archive

Posts on Leaflet releases and development from 2012 to 2025. New releases are announced on [GitHub Releases](https://github.com/Leaflet/Leaflet/releases) ([Atom feed](https://github.com/Leaflet/Leaflet/releases.atom)).

---

{% for post in site.posts %}
<div class="clearfix">
	<div class="post-date">
		{{ post.date | date_to_string }}
	</div>
	<div class="post-info">
		<h3 class="post-title"><a href="{{ post.url }}">{{ post.title }}</a></h3>
		<p>{{ post.description }} <span class="quiet">&hellip;</span></p>
	</div>
</div>
{% unless forloop.last %}<hr />{% endunless %}
{% endfor %}
