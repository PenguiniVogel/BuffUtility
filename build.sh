# tsc
echo "Building: --project tsconfig.json --inlineSources false --inlineSourceMap false --removeComments true --outDir .out"
tsc --project tsconfig.json --inlineSources false --inlineSourceMap false --removeComments true --outDir .out
echo " "

echo "Building: SchemaData.ts --inlineSources false --inlineSourceMap false --removeComments true --outDir .out/SchemaData"
tsc SchemaData/SchemaData.ts --inlineSources false --inlineSourceMap false --removeComments true --outDir .out/SchemaData
echo " "

# delete previous export
echo "Deleting previous export..."
rm -rf ".export"
echo " "

# pause
read -p "Press [ENTER] to resume ..."

# setup folder structure
echo "Checking directory structure..."
mkdir -p .export/{BuffUtility,BuffUtility_Firefox}/{lib,SchemaData,sources/csgostash}
echo " "

# f_copy
f_copy() {
  for f in $1
  do
    echo "Processing (cp) $f -> $DEST/${f:5}"
    cp "$f" "$DEST/${f:5}"
  done
}

# f_uglify
#f_uglify() {
#  for f in $1
#  do
#    echo "Processing (uglifyjs) $f -> $DEST/${f:5}"
#    uglifyjs -c -o "$DEST/${f:5}" "$f"
#  done
#}

# f_build
f_build() {
  # uglify files
  #  f_uglify ".out/sources/*.js"
  #  echo " "
  #
  #  f_uglify ".out/sources/csgostash/*.js"
  #  echo " "
  #
  #  f_uglify ".out/lib/*.js"
  #  echo " "

  # copy lib
  f_copy ".out/lib/*.js"

  # copy SchemaData
  f_copy ".out/SchemaData/*.js"

  # copy sources
  f_copy ".out/sources/*.js"

  # copy csgostash
  f_copy ".out/sources/csgostash/*.js"

  # copy icons
  for f in "icon128.png" "icon48.png" "icon16.png" "options.html" "options.js"
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
