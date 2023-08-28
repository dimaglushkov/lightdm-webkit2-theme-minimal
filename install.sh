#!/usr/bin/env bash

set -e

theme_location='/usr/share/lightdm-webkit/themes/minimal'

echo 'Removing existing theme...'
rm -rf "$theme_location"
echo 'Coping files...'
cp -r src "$theme_location"

echo 'Complete'

if [ "$1" == "--test-mode" ]
then
    lightdm-webkit2-greeter
fi