#!/bin/bash

# Path to the start_factorio.sh script
# Keep the "-s factorio" session name, as we use it to send messages to the factorio server

tmux new-session -d -s factorio /bin/bash /opt/factorio/factorio/start_factorio.sh