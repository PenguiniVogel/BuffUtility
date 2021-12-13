echo "Building .export"

(
./export.sh
)

echo "Building .local"

(
./export.sh dev
)
