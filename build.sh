# tsc
tsc

# setup folder structure
echo "Checking directory structure..."
mkdir -p .export/{BuffUtility,BuffUtility_Firefox}/{lib,sources/csgostash}
echo " "

# f_build
f_build()
{
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
}

# regular build
DEST=".export/BuffUtility"

# f_build regular
echo "f_build (normal)"
f_build ""
echo " "

# firefox build
DEST=".export/BuffUtility_Firefox"

# f_build firefox
echo "f_build (Firefox)"
f_build "firefox"
echo " "

# pause
read -p "Press [ENTER] to resume ..."
