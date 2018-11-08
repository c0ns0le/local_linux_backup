#!/bin/bash 

timer=${2:-.2}
# this commment is new
#  so's this one!

case "$1" in 
	w) 
	timeout $timer feh -. -x -g 100x100+1 ~/pics/icons/dungeon-light.png
        /bin/setxkbmap -option
	xset -q | grep -Eo 'Caps Lock:\s+\w+' | grep on && xdotool key Caps_Lock
	killall xcape
        /bin/setxkbmap -option 'altwin:swap_alt_win, ctrl:nocaps, shift:both_capslock'
	xmodmap ~/.Xmodmap_numpad
        /home/kessler/.local/bin/xcape -e 'Control_L=Escape'

	;;

	m)
	timeout $timer feh -. -x -g 100x100+1 ~/pics/icons/shiny-apple.png
        /bin/setxkbmap -option
	xset -q | grep -Eo 'Caps Lock:\s+\w+' | grep on && xdotool key Caps_Lock
        killall xbindkeys 2> /dev/null
        killall xcape
        /bin/setxkbmap -option 'ctrl:nocaps, shift:both_capslock, apple:alupckeys'
        /home/kessler/.local/bin/xcape -e 'Control_L=Escape'
        /home/kessler/.local/bin/xbindkeys
	;;
esac


	
