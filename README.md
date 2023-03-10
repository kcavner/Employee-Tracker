# Employee-Tracker
![img](Capture.JPG)
## Description
- This application allows for the creation of employee information tables that takes in set allowed information about departments and employee information. It also allows for the display of information gathered with inquirer in table format allowed with the console.table npm module.
## Details
- The application has no front end development so it runs in a terminal with node js prepared with an npm install. Once you have your packages installed you need to run your database with mysql. Once that is all up and running you can start the index.js file that has the inquirer prompts and sql queries inside. Some of the tables have columns that have foreign keys that are referenced in another table. The employee table needs to be updated before you can view its role and manager id so it needs the inquirer line update to run before those columns are populated.
## What i learned
- The foreign keys used didnt make sense until i was a couple hours into creating this app. Sql queries were also tough to understand, but a little googling and testing got me to the conclusion that INSERT INTO, SELECT *, and UPDATE were key in getting this app to work.