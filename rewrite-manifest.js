let fs = require('fs');

let rawManifest = fs.readFileSync('manifest.json').toString();

let manifest = JSON.parse(rawManifest);

manifest['name'] = 'Buff Utility';

fs.writeFileSync('.export/manifest.json', JSON.stringify(manifest, null, 4));
