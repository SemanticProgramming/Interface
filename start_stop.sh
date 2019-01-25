!#/bin/sh

####################################
###          Variables           ###
####################################

APP_DIR='/home/SOME_DIR/mdb_proto'
NAME='MY_APP'

#####################################

clear
echo "MDB Prototype nodeJS application"
echo "           (Sample)"
echo "--------------------------------"
echo
echo "Please adapt to you own needs"
echo

sleep 5


echo "Stopping all running instances and clear logs"
sleep 1
forever stopall
eccho
forever cleanlogs

sleep 3
echo
echo "Starting ..."
sleep 1

# Start applicatiopn and watch for file changes (-w) like nodemon. You might want to ommit the -w option on production systems.
cd  $APP_DIR
forever start --id $NAME --minUptime 10000 --spinSleepTime 20000 -a -w -l $APP_DIR/mdb.log server.js
echo
echo "MDB started!"
echo
echo "Some logfile output from $APP_DIR/mdb.log" 
echo
echo "-----      last 12 lines of logfile      -----"

# give the app some time to start up
sleep 3

tail -n 12  $APP_DIR/mdb.log
echo "-----              END OF LOG            ------"

sleep 1

echo
forever list
forever logs

sleep 1

echo
echo "Start/stop manually"
echo "-------------------"
echo "Start: forever start --id $NAME -a -w server.js"
echo "Stop:  forever stop $NAME"
echo "Check: forever list"
echo

exit 0

