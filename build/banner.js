export function createBanner(version) {
	return `/* @preserve
 * Leaflet ${version}, a JS library for interactive maps. https://leafletjs.com
 * (c) 2010-${new Date().getFullYear()} Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */
`;
}
