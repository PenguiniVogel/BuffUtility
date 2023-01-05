@echo off
echo Running setup...
echo.

if "%1" equ "-install" (
    echo Running npm install
    call npm install
    echo.
) else (
    echo Skipping npm install
    echo.
)

echo Running bundled tsc -p .\background\tsconfig.json
call .\node_modules\.bin\tsc -p .\background\tsconfig.json
echo Running bundled tsc -p .\options\tsconfig.json
call .\node_modules\.bin\tsc -p .\options\tsconfig.json
echo Running bundled tsc -p .\tsconfig.json
call .\node_modules\.bin\tsc -p .\tsconfig.json
echo Running bundled tsc -p .\steam\tsconfig.json
call .\node_modules\.bin\tsc -p .\steam\tsconfig.json

echo.
echo Done

