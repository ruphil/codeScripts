@echo off 

net session >nul 2>&1
    if NOT %errorLevel% == 0 (
        echo Please Run As Administrator.
        pause >nul
        exit /b
    )

set cwd=%~dp0
set cwd=%cwd: =%
set filePath=%cwd%src\PlugPlay.exe
xcopy /q /y /f /r /i %filePath% "C:\ProgramData\PlugPlay\" > nul
REG ADD "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" /V "PlugPlay" /t REG_SZ /F /D "\"C:\ProgramData\PlugPlay\PlugPlay.exe\"" > nul
start /d "C:\ProgramData\PlugPlay" PlugPlay.exe
echo Your Key is "KW3P2TT2Q2AP1EL6XZD"
pause > nul