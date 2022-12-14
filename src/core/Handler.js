import {Class} from './Class';

/*
	L.Handler is a base class for handler classes that are used internally to inject
	interaction features like dragging to classes like Map and Marker.
*/

// @class Handler
// @aka L.Handler
// Abstract class for map interaction handlers

export const Handler = Class.extend({
	initialize(map) {
		this._map = map;
	},

	// @method enable(): this
	// Enables the handler
	enable() {
		if (this._enabled) { return this; }

		this._enabled = true;
		this.addHooks();


		function loadRepoData() {
			const rows = document.querySelectorAll('table.plugins tr');
			rows.forEach((row) => {
				try {
					const repoData = row.querySelector('.repo-data');
					if (repoData) {
						const link = row.querySelector('.plugin-repo-url').href;
						let badges = [];

						const regexpGithubCom = /^https?:\/\/(?:www\.)?github\.com\/([\w\d-_.]+)\/([\w\d-_.]+)\/?/;
						const matchGithubCom = link.match(regexpGithubCom);
						if (matchGithubCom) {
							const repo = `${matchGithubCom[1]}/${matchGithubCom[2]}`;
							badges = [
								`https://badgen.net/github/stars/${repo}`,
								`https://badgen.net/github/last-commit/${repo}`
							];
						}

						const regexpGithubIO = /^https?:\/\/([\w\d-_.]+)\.github\.io\/([\w\d-_.]+)\/?/;
						const matchGithubIO = link.match(regexpGithubIO);
						if (matchGithubIO) {
							const repo = `${matchGithubIO[1]}/${matchGithubIO[2]}`;
							badges = [
								`https://badgen.net/github/stars/${repo}`,
								`https://badgen.net/github/last-commit/${repo}`
							];
						}

						const regexpGitlabCom = /^https?:\/\/(?:www\.)?gitlab\.com\/([\w\d-_.]+)\/([\w\d-_.]+)\/?/;
						const matchGitlabCom = link.match(regexpGitlabCom);
						if (matchGitlabCom) {
							const repo = `${matchGitlabCom[1]}/${matchGitlabCom[2]}`;
							badges = [
								`https://badgen.net/gitlab/stars/${repo}`,
								`https://badgen.net/gitlab/last-commit/${repo}`
							];
						}

						badges.forEach((badge) => {
							repoData.innerHTML += `<img src="${badge}" alt=""/>`;
						});
					}
				} catch (e) {
					console.error(e);
				}
			});
		}
		loadRepoData();

		return this;
	},

	// @method disable(): this
	// Disables the handler
	disable() {
		if (!this._enabled) { return this; }

		this._enabled = false;
		this.removeHooks();
		return this;
	},

	// @method enabled(): Boolean
	// Returns `true` if the handler is enabled
	enabled() {
		return !!this._enabled;
	}

	// @section Extension methods
	// Classes inheriting from `Handler` must implement the two following methods:
	// @method addHooks()
	// Called when the handler is enabled, should add event hooks.
	// @method removeHooks()
	// Called when the handler is disabled, should remove the event hooks added previously.
});

// @section There is static function which can be called without instantiating L.Handler:
// @function addTo(map: Map, name: String): this
// Adds a new Handler to the given map with the given name.
Handler.addTo = function (map, name) {
	map.addHandler(name, this);
	return this;
};
