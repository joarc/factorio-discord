#!/bin/bash

# Make sure the console.log file path is set, as we need it for the factorio console log listener
# The server admins and settings files are optional, but recommended

cd /opt/factorio/factorio/
./bin/x64/factorio --start-server savefile_name --console-log /opt/factorio/factorio/console.log --server-adminlist server-admins.json --server-settings server-settings.json