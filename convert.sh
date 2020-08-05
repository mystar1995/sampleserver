#!/bin/bash

# converter.sh

# Declare the binary path of the converter
januspprec_binary=janus-pp-rec

# Contains the prefix of the recording session of janus e.g
session_prefix="$1"
output_file="$2"

# Create temporary files that will store the individual tracks (audio and video)
tmp_video=/tmp/mjr-$RANDOM.webm
tmp_audio=/tmp/mjr-$RANDOM.opus

echo "Converting mjr files to individual tracks ..."
$januspprec_binary $session_prefix-video.mjr $tmp_video
$januspprec_binary $session_prefix-audio.mjr $tmp_audio

echo "Merging audio track with video ..."

ffmpeg -i $tmp_audio -i $tmp_video -c:v h264 -c:a aac -strict experimental $output_file

rm -rf $tmp_audio
rm -rf $tmp_video
rm -rf $session_prefix-audio.mjr
rm -rf $session_prefix-video.mjr

echo "Done !"