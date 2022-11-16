# tsc
echo "Building main: -p tsconfig.build.json"
node_modules/.bin/tsc -p tsconfig.build.json
echo " "

# tsc
echo "Building background: -p background/tsconfig.build.json"
node_modules/.bin/tsc -p background/tsconfig.build.json
echo " "

# tsc
echo "Building options: -p options/tsconfig.build.json"
node_modules/.bin/tsc -p options/tsconfig.build.json
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
mkdir -p .export/{BuffUtility,BuffUtility_Firefox}/{background,options}
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

  # copy options/merge_options.js
  f_copy ".out/options/merge_options.js" "$DEST" 5

  # copy options/options.html
  f_copy "options/options.html" "$DEST" 0

  # copy resources
  f_copy "resources/icon/*.png" "$DEST/resources/icon" 15

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
