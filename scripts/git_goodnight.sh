#!/bin/bash

if [ "$1" = "" ]; then
	echo 'Usage: ./git_goodnight.sh commit_message'
	exit
fi

BRANCH=$(git branch | grep "*" | cut -c3-)

clear
echo ''
echo ''
echo '***************************'
echo '******     GITHUB    ******' 
echo '***************************'
echo '******               ******'
echo '******   GOODNIGHT!  ******'
echo '******               ******'
echo '***************************'
echo '***************************'
echo ''
echo "This will PUSH latest commits in $BRANCH to MASTER!"
echo ''


while true; do
    read -p "Are you sure you want to continue? (y/n)" yn
    case $yn in
        [Yy]* ) echo "Pushing branch $BRANCH to MASTER"; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done

# exit

cd /var/www/systemapic.js
git add .
git commit -m "$1"
git fetch upstream
git merge upstream/master


while true; do
    echo ''
    echo ''
    echo ''
    read -p "Did everything go OK? If no commit problems above, then continue. If not, press n! (y/n)" yn
    case $yn in
        [Yy]* ) echo "Pushing branch $BRANCH to MASTER"; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done


git push origin "$BRANCH"

echo ''
echo 'All done. Have a good one!'