# tsc
tsc

# copy files
cp manifest.json .export/

cp icon128.png .export/
cp icon48.png .export/
cp icon16.png .export/

uglifyjs -c -o .export/sources/Util.js sources/Util.js
uglifyjs -c -o .export/sources/Start.js sources/Start.js
uglifyjs -c -o .export/sources/fRequest.js sources/fRequest.js
uglifyjs -c -o .export/sources/ExtensionSettings.js sources/ExtensionSettings.js
uglifyjs -c -o .export/sources/Cookie.js sources/Cookie.js

uglifyjs -c -o .export/sources/Adjust_Settings.js sources/Adjust_Settings.js
uglifyjs -c -o .export/sources/Adjust_Listings.js sources/Adjust_Listings.js

uglifyjs -c -o .export/lib/InjectionService.js lib/InjectionService.js
uglifyjs -c -o .export/lib/CurrencySymbols.js lib/CurrencySymbols.js
uglifyjs -c -o .export/lib/CurrencyHelper.js lib/CurrencyHelper.js
