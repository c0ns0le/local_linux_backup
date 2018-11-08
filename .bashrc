# .bashrc
sleep .15
#xdotool key Alt+t p Down Return
xdotool key F10 Right Right Right Right Down Right Down Return

# including this ensures that new gnome-terminal tabs keep the parent `pwd` !
if [ -e /etc/profile.d/vte.sh ]; then
    . /etc/profile.d/vte.sh
fi




# aliae
alias vi="/usr/bin/vim"


# sshing
alias rh='xdotool key --delay 20 F10 Right Right Right Right Down Right Down Down Return; ssh -q rhino;'
alias yrh='xdotool key --delay 20 F10 Right Right Right Right Down Right Down Down Return; ssh -qY rhino;'
alias be='xdotool key --delay 30 F10 Right Right Right Right Down Right Return; ssh -q bear;'
alias ybe='xdotool key --delay 30 F10 Right Right Right Right Down Right Return; ssh -qY bear;'


# sshing
#alias rh='xdotool key --delay 20 Alt+t p Down Down Return; ssh -q rhino;'
#alias yrh='xdotool key --delay 20 Alt+t p Down Down Return; ssh -qY rhino;'
#alias be='xdotool key --delay 30 Alt+t p Return; ssh -q bear;'
#alias ybe='xdotool key --delay 30 Alt+t p Return; ssh -qY bear;'
#alias ywdev='xdotool key --delay 30 Alt+t p Return; ssh -qY wwwdev;'

function ak(){
/bin/autokey-gtk 2> /dev/null &
timeout .5 feh -. -x -g 100x100+1 ~/pics/icons/keyboard.png
}


# do things
alias sunny='xdotool key --delay 20 Alt+t p Down Down Down Return'
alias pdflatex='pdflatex -interaction nonstopmode'

clc(){
	echo -e "warning('off'); $@" | octave -qf
}


## Source global definitions
#if [ -f /etc/bashrc ]; then
#	. /etc/bashrc
#fi
#

## fix trackpad (can't edit /etc/X11/xorg.conf.d/00.conf) 
## make sure click method is set to fingers
#synclient ClickTime=0
#synclient SingleTapTimeout=0


# below no longer neccessary thanks to streamkeys working globally in opera!
##global media keys function for opera
#function send_opera(){
#	actwin=$(xdotool getactivewindow)                     # get current window id
#	xdotool search -class opera windowactivate --sync %3  # switch to opera
#	xdotool key "$@"                                      # send simulated keypress
#	xdotool windowactivate --sync $actwin                 # switch back to current window
#}


# this is a change


## Uncomment the following line if you don't like systemctl's auto-paging feature:
## export SYSTEMD_PAGER=
export PS1="[\u@\W :]"

export ml_path="
/home/kessler/.local/bin:
/home/kessler/.linuxbrew/bin/:
/home/kessler/.linuxbrew/sbin/:
/bin:
/home/kessler/my_scripts/:
/sbin:
/usr/bin:
/usr/local/bin:
/usr/local/sbin:
/usr/sbin:
.
"


export PATH=$(echo $ml_path | tr -d ' ')
export MANPATH="/home/kessler/.linuxbrew/share/man:/usr/share/man/:/home/kessler/.local/share/man:/usr/local/share/man/"
export PKG_CONFIG_PATH="/home/kessler/.linuxbrew/lib/pkgconfig/"

export TEXINPUTS=.:$HOME/.local/share/tex:




# User specific aliases and functions
# aliae
alias src='. ~/.bashrc'
alias cp='cp -i'
alias mv='mv -i'
alias ls='ls --color'
alias ll='ls -l'
alias l.='ls -d .*'
alias less='less -i'
alias python='$HOME/.linuxbrew/bin/python3.7'
alias pip='$HOME/.linuxbrew/bin/pip3'
alias brown='play -n synth brownnoise'
alias 2pdf="libreoffice --headless --convert-to pdf"
alias myxev="/bin/xev | sed -nr 's/.*keycode ([0-9]+) \S+ \S+ (\S+)\), .*/\1 \2/p' "
alias win='/home/kessler/my_scripts/set_kb.sh w'
alias mac='/home/kessler/my_scripts/set_kb.sh m'

# functions

mu(){ /usr/local/bin/mupdf-x11 "$@" & }

tex2pdf() { 
	# pass the first arg to entr           compile it                    send SIGHUP so mudpf refreshes
	ls $1 | entr -p /bin/bash -c "pdflatex -interaction nonstopmode $1 && pkill -HUP mupdf" \
	| awk '/!/ { print $0; system("timeout .5 feh -. -x -g 100x100+1 $HOME/pics/icons/death-skull.png") }' 
	#   now search output for errors (!) and if they exist flash a skull icon so I know to check for them
}




#opera_mac(){ 
#	setxkbmap -option 
#	killall xbindkeys 2>/dev/null
#	killall xcape
#	setxkbmap -option 'ctrl:nocaps, shift:both_capslock, apple:alupckeys, altwin:swap_lalt_lwin'
#	xcape -e 'Control_L=Escape' 
#	xbindkeys -f ~/.opera_xbindkeys
#}

#mac(){ setxkbmap -option; setxkbmap -option 'caps:escape, shift:both_capslock, apple:alupckeys'; }

function cs(){
builtin cd "$@" && ls
}

bigger(){
xrandr --newmode "1600x900"  119.00  1600 1696 1864 2128  900 901 904 932  -HSync +Vsync
xrandr --addmode eDP-1 1600x900
xrandr -s 1600x900
}


biggest(){
xrandr --newmode "1280x720" 74.48  1280 1336 1472 1664  720 721 724 746  -HSync +Vsync
xrandr --addmode eDP-1 1280x720
xrandr -s 1280x720
}


scrfix(){
ids=$(xinput | grep -i logitech | grep -Eo '=[0-9]{1,2}' | grep -Eo '[0-9]+')
for id in $ids; do xinput set-prop $id  "Evdev Scrolling Distance" -1 1 1; done
}


function cs(){
builtin cd "$@" && ls
}
