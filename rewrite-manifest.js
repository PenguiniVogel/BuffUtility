let fs = require('fs');

let rawManifest = fs.readFileSync('manifest.json').toString();

let manifest = JSON.parse(rawManifest);

let dest = '.export';

// console.log(process.argv[2]);

if (process.argv[2] == 'dev') {
    dest = '.local';

    manifest['name'] = 'Buff Utility (Local)';
} else {
    manifest['name'] = 'Buff Utility';
}

fs.writeFileSync(dest + '/manifest.json', JSON.stringify(manifest, null, 4));
