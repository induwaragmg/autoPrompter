@echo off
REM Development script for Auto Prompter Extension (Windows)

echo 🤖 Auto Prompter Extension - Development Setup
echo ==============================================

REM Check for Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check for npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are available

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
) else (
    echo ✅ Dependencies already installed
)

REM Build the extension
echo 🔨 Building extension...
npm run build

if errorlevel 1 (
    echo ❌ Build failed! Check the error messages above.
    pause
    exit /b 1
) else (
    echo ✅ Extension built successfully!
    echo.
    echo 📋 Next steps to load in Brave:
    echo 1. Open Brave browser
    echo 2. Go to brave://extensions/
    echo 3. Enable 'Developer mode' ^(top-right toggle^)
    echo 4. Click 'Load unpacked'
    echo 5. Select the 'dist' folder ^(NOT the root folder^)
    echo.
    echo 📍 Important: Select this folder when loading:
    echo    %CD%\dist
    echo.
    echo 🧪 Quick Test:
    echo 1. Click extension icon and enable it
    echo 2. Go to chat.openai.com
    echo 3. Ask: "Explain AI in detail"
    echo 4. Watch it auto-type "continue" after response
    echo.
    echo 📖 Full testing guide: See TESTING.md
    echo.
    pause
)
