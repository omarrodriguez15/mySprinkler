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
    sudo bower install --allow-root


#ARCH Linux Pi

     pacman -Syyuu
     pacman -S iw wpa_supplicant dialog
     wifi-menu
     //maybe do this just for safe measure
     ls /etc/netctl//look for profilename
     chmod 600 /etc/netctl/PROFILENAMEHERE
     systemctl reboot
     netctl start PROFILENAMEHERE
     
Create new user
    useradd name
    passwd name
add user to wheel
