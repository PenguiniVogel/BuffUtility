if test "$1" != '-si'
then
  npm install
else
  echo "Skipping npm install"
fi

echo ""

echo "Building main project..."
tsc -p tsconfig.json
echo "Done."
echo ""

echo "Changing to background build..."
cd ./background || exit

echo "Building background project..."
tsc -p build.tsconfig.json
echo "Done."
echo ""

# pause
read -p "Press [ENTER] to resume ..."
