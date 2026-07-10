@echo off
REM Siraj Hackathon - GitHub Pages Deploy Script for Windows
REM Usage: double-click this file to run

echo.
echo ========================================================
echo  Siraj Hackathon - GitHub Pages Deployment Setup
echo ========================================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed!
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo ✅ Git is installed
echo.

REM Get GitHub username
set /p GITHUB_USERNAME="📝 Enter your GitHub username: "
set /p GITHUB_TOKEN="📝 Enter your GitHub token (leave blank to skip): "

REM Repository details
set REPO_NAME=siraj-hackathon
set REPO_URL=https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git

echo.
echo 📂 Setting up repository...
echo.

REM Check if repo exists
if exist "%REPO_NAME%" (
    echo Repository already exists. Updating...
    cd %REPO_NAME%
    git pull origin main
) else (
    echo Cloning repository...
    if not "%GITHUB_TOKEN%"=="" (
        git clone "https://%GITHUB_USERNAME%:%GITHUB_TOKEN%@github.com/%GITHUB_USERNAME%/%REPO_NAME%.git"
    ) else (
        git clone %REPO_URL%
    )
    cd %REPO_NAME%
)

echo ✅ Repository ready
echo.

REM Check if HTML file exists
if exist "siraj-hackathon.html" (
    echo ✅ siraj-hackathon.html found
) else (
    echo ⚠️  siraj-hackathon.html not found in current directory
    echo.
    echo Please copy siraj-hackathon.html to:
    echo %cd%
    echo.
    pause
    
    if not exist "siraj-hackathon.html" (
        echo ❌ File not found. Exiting.
        pause
        exit /b 1
    )
)

echo.
echo 📤 Committing and pushing to GitHub...
echo.

git add siraj-hackathon.html
git commit -m "Add Siraj hackathon landing page"
if %ERRORLEVEL% EQU 0 (
    echo ✅ Changes committed
) else (
    echo ℹ️  No changes to commit
)

git push origin main

echo.
echo ✅ Pushed to GitHub!
echo.
echo =======================================================
echo  Your live URL:
echo  https://%GITHUB_USERNAME%.github.io/%REPO_NAME%/siraj-hackathon.html
echo =======================================================
echo.
echo 📋 Next steps:
echo   1. Go to: https://github.com/%GITHUB_USERNAME%/%REPO_NAME%/settings/pages
echo   2. Under 'Source', select 'main' branch and '/' folder
echo   3. Click Save
echo   4. Wait 1-2 minutes for deployment
echo   5. Share your live URL with the team!
echo.
echo 🎉 Done! Your page will be live shortly.
echo.
pause
