# tsc
tsc

# determine if dev
DEST=".export"
if [ "$1" == "dev" ]
then
  DEST=".local"
fi

# uglify files

FILES="sources/*.js"
for f in $FILES
do
  echo "Processing (uglifyjs) $f -> $DEST/$f"
  uglifyjs -c -o "$DEST/$f" "$f"
done

echo " "

FILES="sources/csgostash/*.js"
for f in $FILES
do
  echo "Processing (uglifyjs) $f -> $DEST/$f"
  uglifyjs -c -o "$DEST/$f" "$f"
done

echo " "

FILES="lib/*.js"
for f in $FILES
do
  echo "Processing (uglifyjs) $f -> $DEST/$f"
  uglifyjs -c -o "$DEST/$f" "$f"
done

echo " "

# copy files
# Don't compress the InjectionService, bad things happen :(
for f in "icon128.png" "icon48.png" "icon16.png" "lib/InjectionService.js"
do
  echo "Processing (cp) $f -> $DEST/$f"
  cp "$f" "$DEST/$f"
done

echo " "

# rewrite manifest
echo "Writing manifest.json -> $DEST/manifest.json"
node rewrite-manifest.js "$1"

echo " "

# pause
read -p "Press [ENTER] to resume ..."
