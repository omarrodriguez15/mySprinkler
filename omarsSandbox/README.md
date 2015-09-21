#Omar's Sandbox
###Intro
This folder contains the website code that will eventually run on the Raspberry pi.

###Setup
The following setup instrucctions work on my macBook Pro. They 
should work on many other Linux distros. If you have node and 
mongo installed.  
To get started after you have pulled latest navigate
to the server directory through the terminal.  

    npm install

That will install all the necessary dependencies the project
requires that are in the package.json file.

Make sure the mongo daemon is running in the background. To check run mongo,
if you don't get an error and you go into the CLI the daemon is running.
Run exit to get out. However if you get an error run

    sudo mongod

 Once it is running you need to either close terminal or open a new terminal
 window. DO NOT STOP THE MONGOD PROCESS. When you close the terminal window
 the mongo daemon should continue to run in the background.
 
 Now in the server directory run node app.js after a very small delay
 you should see listening on port 3000...
 
 Go to a browser and navigate to 
 
    localhost:3000/Weather 

This will display the JSON format of every document in the database.