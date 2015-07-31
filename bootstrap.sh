#!/usr/bin/env bash

# Get root up in here
sudo su

# Just a simple way of checking if we need to install everything
if [ ! -d "/var/www" ]
then
    # Install Apache, PHP and Connectors
    apt-get install -y apache2 php5 php5-mongo php5-mcrypt

    # Import Mongo Public Key
    apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10

    # Add Mongo DB Repo
    apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
    echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list

    # Update and begin installing some utility tools
    apt-get update
    apt-get install -y memcached build-essential

    # Install Mongo
    apt-get install -y mongodb-org

    # Symlink our host www to the guest /var/www folder
    ln -s /vagrant /var/www

    # Enable Rewrite
    a2enmod rewrite

    # Enable Headers
    a2enmod headers

    # Restart Apache
    service apache2 restart

    # Victory!
    echo "You're all done!"
fi
