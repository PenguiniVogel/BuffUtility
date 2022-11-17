if test "$1" == '-install'
then
  npm install
else
  echo "Skipping npm install"
fi

echo ""

echo "Building main project..."
node_modules/.bin/tsc -p tsconfig.json
echo "Done."
echo ""

echo "Building background project..."
node_modules/.bin/tsc -p background/tsconfig.json
echo "Done."
echo ""

echo "Building option project..."
node_modules/.bin/tsc -p options/tsconfig.json
echo "Done."
echo ""

# pause
read -p "Press [ENTER] to resume ..."
