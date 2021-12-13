# tsc
tsc

# uglify files

FILES="sources/*.js"
for f in $FILES
do
  echo "Processing (uglifyjs) $f -> .export/$f"
  uglifyjs -c -o ".export/$f" "$f"
done

echo " "

FILES="lib/*.js"
for f in $FILES
do
  echo "Processing (uglifyjs) $f -> .export/$f"
  uglifyjs -c -o ".export/$f" "$f"
done

echo " "

# copy files
# Don't compress the InjectionService, bad things happen :(
for f in "icon128.png" "icon48.png" "icon16.png" "lib/InjectionService.js"
do
  echo "Processing (cp) $f -> .export/$f"
  cp "$f" ".export/$f"
done

echo " "

# rewrite manifest
echo "Writing manifest.json -> .export/manifest.json"
node rewrite-manifest.js

echo " "

# pause
read -p "Press [ENTER] to resume ..."
