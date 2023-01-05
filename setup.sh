if test "$1" == '-install'
then
  npm install
else
  echo "Skipping npm install"
fi

echo ""

echo "Running bundled tsc -p tsconfig.json"
node_modules/.bin/tsc -p tsconfig.json
echo "Done."
echo ""

echo "Running bundled tsc -p background/tsconfig.json"
node_modules/.bin/tsc -p background/tsconfig.json
echo "Done."
echo ""

echo "Running bundled tsc -p options/tsconfig.json"
node_modules/.bin/tsc -p options/tsconfig.json
echo "Done."
echo ""

echo "Running bundled tsc -p steam/tsconfig.json"
node_modules/.bin/tsc -p steam/tsconfig.json
echo "Done."
echo ""

# pause
read -p "Press [ENTER] to resume ..."
