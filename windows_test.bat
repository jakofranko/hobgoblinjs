ECHO ON
TITLE Automated Test Build for hobgoblin
IF NOT EXIST test (mkdir test)
SET /P _deltest= Clear contents of test dir? (y/n)
IF "%_deltest%"=="y" GOTO :deltest
IF "%_deltest%"=="n" GOTO :cdtest
:deltest
del test\js\*.js
rmdir test\js
:cdtest
ECHO Entering test dir...
cd test
node ..\hobgoblin.js init -e
index.html
cd ..
PAUSE
