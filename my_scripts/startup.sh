
## try sleeping for 5 seconds
sleep 5; 

notify-send 'ran startup script!'
source ~/.bashrc


# increase screen res
bigger 2> /dev/null

#start xbindkeys
xbindkeys

# call unlock script 
/home/kessler/my_scripts/unlock.sh

# start lock monitor
nohup /home/kessler/my_scripts/daemon_unlock.sh &> /dev/null &