#!/bin/sh

# Watcher should be added using:
# /Users/mikepriest/PhpstormProjects/MyJumpSeat/assets/js/aero/admin/_concat.sh

# Location of your Admin Folder
ROOT="/Users/mikepriest/PhpstormProjects/MyJumpSeat/assets/js/aero/user"

# Wait for Minify to Complete
sleep 5

# Order to Concat
INPUTS="
$ROOT/aero.min.js
$ROOT/aero-audit.min.js
$ROOT/aero-pathway.min.js
$ROOT/aero-step.min.js
$ROOT/aero-tip.min.js
$ROOT/aero-guide.min.js
$ROOT/_main.min.js
"


# Output Concat File
OUTPUT="$ROOT/jumpseat.min.js"

cat $INPUTS > $OUTPUT
