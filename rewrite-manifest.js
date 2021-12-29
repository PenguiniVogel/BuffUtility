let fs = require('fs');

let rawManifest = fs.readFileSync('manifest.json').toString();

let manifest = JSON.parse(rawManifest);

let argv2 = process.argv[2];

let dest;
switch (argv2) {
    case 'firefox':
        dest = '.export/BuffUtility_Firefox';

        manifest['name'] = 'Buff Utility (Firefox)';
        manifest['browser_specific_settings'] = {
            'gecko': {
                'id': 'buff.utility@penguinivogel.github.io',
                'strict_min_version': '42.0'
            }
        };

        break;
    default:
        dest = '.export/BuffUtility';

        manifest['name'] = 'Buff Utility';

        break;
}

fs.writeFileSync(`${dest}/manifest.json`, JSON.stringify(manifest, null, 4));
