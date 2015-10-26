#Notes
###Generators
Generators are basically scripts that help automate
web development processes using Yeoman  

[Angular FullStack Generators](https://github.com/DaftMonk/generator-angular-fullstack#generators)  

To create a new route that can be accesed through the API  
[Api endpoints on fullstack website](https://github.com/DaftMonk/generator-angular-fullstack#endpoint)


#AWS
I had problems with bower
[Bower issue tracker thread](https://github.com/bower/bower/issues/1607)

    sudo chown -R [user name] ~/.config
    sudo chown -R [user name] ~/.cache
    
Then I updated bower cleaned cache and reinstalled bower dependencies

    bower cache clean
    sudo npm install -g bower
    bower install
