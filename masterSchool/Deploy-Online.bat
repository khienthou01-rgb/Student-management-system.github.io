@echo off
title MasterSchool - Deploy to Firebase Hosting
echo ========================================================
echo   MasterSchool - កំពុងបង្ហោះឡើងលើ Firebase Hosting...
echo ========================================================
cmd.exe /c "firebase deploy --only hosting"
echo.
echo ========================================================
echo   ការបង្ហោះបានជោគជ័យ!
echo   Link: https://system-student-c2267.web.app
echo ========================================================
pause
