An unofficial branch for making rotation work in rc1. Developed by @hyperknot and @fnicollet.

Based on @IvanSanchez's [rotate work](https://github.com/Leaflet/Leaflet/tree/rotate) for pre-1.0.

Here is a squash from all commits of that branch:
https://github.com/hyperknot/Leaflet/commit/0448ffd8f28730ff3c59822351d4a04f54a3972f

Philosophy:

1. Porting the core features, one by one
2. Making sure everything works and as performant as possible before adding new features.

Known issues:
- No support for `zoomAnimation: false` for popups
