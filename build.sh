# tsc
echo "Building: --project build.tsconfig.json"
node_modules/.bin/tsc --project build.tsconfig.json
echo " "

# tsc
echo "Building background: --project build.tsconfig.json"
node_modules/.bin/tsc --project background/build.tsconfig.json
echo " "

# tsc
echo "Building options: --project build.tsconfig.json"
node_modules/.bin/tsc --project resources/build.tsconfig.json
echo " "

# delete previous export
echo "Deleting previous export..."
rm -rf ".export"
echo " "

# pause
read -p "Press [ENTER] to resume ..."

# setup folder structure
echo "Checking directory structure..."
mkdir -p .export/{BuffUtility,BuffUtility_Firefox}/sources/{adjustments,csgostash}
mkdir -p .export/{BuffUtility,BuffUtility_Firefox}/resources/icon
mkdir -p .export/{BuffUtility,BuffUtility_Firefox}/background
echo " "

# f_copy
f_copy() {
  for f in $1
  do
    echo "Processing (cp) $f -> $2/${f:$3}"
    cp "$f" "$2/${f:$3}"
  done
}

# f_build
f_build() {

  # copy sources/*.js
  f_copy ".out/sources/*.js" "$DEST" 5

  # copy sources/**/*.js
  f_copy ".out/sources/**/*.js" "$DEST" 5

  # copy background/merge_background.js
  f_copy ".out/background/merge_background.js" "$DEST" 5

  # copy resources
  f_copy "resources/icon/*.png" "$DEST/resources/icon" 15
  f_copy "resources/options.html" "$DEST/resources" 10
  f_copy "resources/options.js" "$DEST/resources" 10

  # rewrite manifest
  echo "Writing manifest.json -> $DEST/manifest.json"
  node ./resources/rewrite-manifest.js "$1"
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
