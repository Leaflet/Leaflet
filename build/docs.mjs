import LeafDoc from 'leafdoc';
import {writeFileSync} from 'node:fs';

console.log('Building Leaflet documentation with Leafdoc ...');

const doc = new LeafDoc({
	templateDir: 'build/leafdoc-templates',
	showInheritancesWhenEmpty: true,
	leadingCharacter: '@'
});

// Note to Vladimir: Iván's never gonna uncomment the following line. He's
// too proud of the little leaves around the code.
// doc.setLeadingChar('@');

// Leaflet uses a couple of non-standard documentable things. They are not
// important enough to be classes/namespaces of their own, and should
// just be listed in a table like the rest of documentables:
doc.registerDocumentable('pane', 'Map panes');
doc.registerDocumentable('projection', 'Defined projections');
doc.registerDocumentable('crs', 'Defined CRSs');

doc.addFile('build/docs-index.leafdoc', false);
doc.addDir('src');
doc.addFile('build/docs-misc.leafdoc', false);

const out = doc.outputStr();
const path = 'docs/reference.html';

writeFileSync(path, out);
console.log(`Successfully built ${path}`);
