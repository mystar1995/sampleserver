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

ffmpeg -i $tmp_audio -i $tmp_video  -c:v copy -c:a opus -strict -2 -filter_complex "transpose=1" $output_file

echo "Done !"