#Setup on Mac
Having to do this from a fresh install of OS X El Capitan
####Xcode and Home Brew install
Use the app store to download and install Xcode and the command line
utilities you need it to install brew.

    xcode-select --install

Download and install [Xquartz](http://xquartz.macosforge.org/landing/)
this is for Homebrew it uses it somehow...

Use ruby package manager gem, which comes preloaded on mac, 
to download and install brew. Brew is a mac package manager.

    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

    brew update
    brew install mongodb
    
 Go to root directory and create /data/db
 
Make sure everything is set up and working correctly by running

    sudo mongod

open a seprate terminal window
    
    mongo
    
should see '>' then type exit to exit mongo command line


###Install Node
Go to the [NodeJS](https://nodejs.org/en/) and download the latest package
to install node. Follow the instructions to install.

After installation complete make sure you can use it open terminal

    node -v
Should get a version number, if not you screwed up!

Side note run the following just incase to update npm

    npm update

##Setup project
####Clone the repo
Easiest way to do this is download Github Desktop install and set that up
then go to the repo page and click clone in desktop button on the Repo 
homepage.

####Globally install bower and grunt
Had to use sudo in the past I didn't have to I don't know 
if my shell is configured different or if it's an OS change

    sudo npm install -g bower
    sudo npm install -g grunt-cli


####Install Dependencies
Navigate to the directory of the repo to setup the fullstack website go to
the fullstack directory and run the following

    npm install
    bower install


####Install Sass

    sudo gem install sass

