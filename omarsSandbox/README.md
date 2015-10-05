#Omar's Sandbox

##FullStack
This folder is a prototype of the website I used 
the [Angular-Fullstack](https://github.com/DaftMonk/generator-angular-fullstack) 
generator through yeoman to start this project. This folder
contains the server and client side code.[Here is the project structure](https://github.com/DaftMonk/generator-angular-fullstack#project-structure)

###Setup
Do step 1 and 2 as explained in client server folders setup section below.

Now to launch the project and run a local server use grunt it should have
automatically been installed with all the other dependencies.

    grunt serve

This might take a while and will launch a browser window with 
the website running assuming there are no errors.

If in the future the website becomes slow when testing something you can
run the following and it will run a more compact, but not so debuggable
(don't know if thats a real word) application.

    grunt
    grunt serve:dist


##Client and Server Folders
###Intro
These two folders are testing of the weather API using node

###Setup
####Step 1
The following setup instrucctions work on my macBook Pro. They 
should work on many other Linux distros. If you have node and 
mongo installed. To get started after you have pulled latest navigate
to the main directory through the terminal. You should see a package.json
file. Run the following. 

    npm install

That will install all the necessary dependencies the project
requires that are in the package.json file.
####Step 2
Make sure the mongo daemon is running in the background. To check run mongo,
if you don't get an error and you go into the CLI the daemon is running.
Run exit to get out. However if you get an error run

    sudo mongod

 Once it is running you need to either close terminal or open a new terminal
 window. DO NOT STOP THE MONGOD PROCESS. When you close the terminal window
 the mongo daemon should continue to run in the background.
 
 ####Step 3
 Now in the server directory run node app.js after a very small delay
 you should see listening on port 3000...
 
 Go to a browser and navigate to 
 
    localhost:3000/Weather 

This will display the JSON format of every document in the database.