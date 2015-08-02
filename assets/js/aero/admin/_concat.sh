#!/bin/sh

# Watcher should be added using:
# /Users/mikepriest/PhpstormProjects/MyJumpSeat/assets/js/aero/admin/_concat.sh

# Location of your Admin Folder
ROOT="/Users/mikepriest/PhpstormProjects/MyJumpSeat/assets/js/aero/admin"

# Wait for Minify to Complete
sleep 5

# Order to Concat
INPUTS="
$ROOT/aero-admin.min.js
$ROOT/aero-guide.min.js
$ROOT/aero-step.min.js
$ROOT/aero-pathway.min.js
$ROOT/aero-role.min.js
$ROOT/aero-picker.min.js
$ROOT/aero-quiz.min.js
$ROOT/_main.min.js
"

# Output Concat File
OUTPUT="$ROOT/jumpseat-auth.min.js"

cat $INPUTS > $OUTPUT
