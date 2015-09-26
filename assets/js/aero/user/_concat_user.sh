#!/bin/sh

ROOT="/Users/mikepriest/PhpstormProjects/MyJumpSeat/assets/js/aero/admin"

# Wait 3 seconds for minify to complete
sleep 5

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

OUTPUT="$ROOT/jumpseat-auth.min.js"

cat $INPUTS > $OUTPUT
