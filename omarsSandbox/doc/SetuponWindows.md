###These are instructions for setting up the server on a windows box
###I am testing all this on the Lab computer.
###These instructions are incomplete Im trying to write them
###as I install everything. Right now I cant get bower installed but
###I think I know what the problem is  we
###need to get appdata to be kept on local machine not remote server
  
#Setup Node fullstack on Windows
Download msi installers from mongo and node

####Install mongo 
locate the bin directory that includes all the executables
copy and paste the directory path into the system path create a 
directory on 'c:/data/db' To test run mongod open a second command 
prompt and run mongo if you get no errors and get the mongo 
Command line it worked

####Install Node
After using the node installer make sure it installed correctly
by running ‘node’ in command prompt if your get “>” you’re good
just hit control+c twice to exit

####Install latest version of python
just download installer and run it then check you can run it anywhere
(python is used for a lot of the packets and installers and what not…)

Installing python 2.7.10 worked

####Install Ruby
[Ruby installer](rubyinstaller.org/downloads) Download 2.2.3 (x64 if
you have a 64 bit OS)

####Install Sass

    gem install sass

####Install Grunt

    npm install -g grunt-cli

####Install bower
If you are doing this on your own windows computer just run the following
then go to the next step 'Build Dependencies'

    npm install -g bower

Installing an older version may not be necessary If I can figure out
what is going wrong with the bower install. I believe it is steming from
working on a remote hard drive and not the hard drive on the server. A solution
might be to move appdata to the server instead of remotely storing it on the 
H: drive or fileserver thingy.

    npm uninstall -g bower
    npm install -g bower@1.2.6


####Build dependencies

    npm install
	bower install


####Test run
Now everything should be installed and setup just run the following to
start the local server

    grunt serve
    
To compile files and make a distribution folder for production run

    grunt

This will compile, shrinkify, and uglify all the files the server needs
into a more lightweight package and store it in a folder named dist. 
Then to run 

    grunt serve:dist
    
This will also run a local version but in a non debugger friendly version
but this will be what we eventually run and be what the end product looks
like and runs.