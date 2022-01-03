# tsc
tsc

# setup folder structure
echo "Checking directory structure..."
mkdir -p .export/{BuffUtility,BuffUtility_Firefox}/{lib,sources/csgostash}
echo " "

# f_copy
f_copy() {
  for f in $1
  do
    echo "Processing (cp) $f -> $DEST/$f"
    cp "$f" "$DEST/$f"
  done
}

# f_uglify
f_uglify() {
  for f in $1
  do
    echo "Processing (uglifyjs) $f -> $DEST/$f"
    uglifyjs -c -o "$DEST/$f" "$f"
  done
}

# f_build
f_build() {
  # uglify files

  f_uglify "sources/*.js"
  echo " "

  f_uglify "sources/csgostash/*.js"
  echo " "

  f_uglify "lib/*.js"
  echo " "

  # copy files
  # Don't compress the InjectionService, bad things happen :(
  for f in "icon128.png" "icon48.png" "icon16.png" "lib/InjectionService.js"
  do
    f_copy $f
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
