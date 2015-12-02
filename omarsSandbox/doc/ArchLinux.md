#Setup
[Pacman](https://www.archlinux.org/pacman/pacman.8.html) is the packmanager used
    
	//update package listings pacman -Syu
	//-S is for synchronizing packages
	//-y is for refresh master package list
	pacman -Syyuu
	
	//install stuff
	pacman -S nodejs npm
	pacman -S git
	pacman -S python
	