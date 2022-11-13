if test "$1" == '-install'
then
  npm install
else
  echo "Skipping npm install"
fi

echo ""

echo "Building main project..."
node_modules/.bin/tsc --project tsconfig.json
echo "Done."
echo ""

echo "Changing to background build..."
echo "Building background project..."
node_modules/.bin/tsc --project background/tsconfig.json
echo "Done."
echo ""

echo "Changing to option build..."
echo "Building background project..."
node_modules/.bin/tsc --project resources/tsconfig.json
echo "Done."
echo ""

# pause
read -p "Press [ENTER] to resume ..."
