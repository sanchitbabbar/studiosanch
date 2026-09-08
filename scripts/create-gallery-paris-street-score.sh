#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
source_audio="$output_dir/assets/paris-field-recordings/paris-traffic-cc0.mp3"
build_dir="/private/tmp/sanch-gallery-paris-street"

mkdir -p "$build_dir"

# Authentic Paris field recording, treated minimally for a dry, controlled editorial soundstage.
ffmpeg -hide_banner -loglevel error -y -i "$source_audio" \
  -af "atempo=0.75,highpass=f=78,lowpass=f=7200,acompressor=threshold=0.12:ratio=2.2:attack=35:release=420:makeup=1.25,volume=-5dB,afade=t=in:st=0:d=2.5,afade=t=out:st=63:d=5.25,apad=pad_dur=2" \
  -t 68.25 -c:a aac -b:a 320k "$build_dir/paris-street-master.m4a"

for format in master vertical; do
  ffmpeg -hide_banner -loglevel error -y \
    -i "$output_dir/sanch-artbook-film-v10-editorial-cuts-${format}.mp4" \
    -i "$build_dir/paris-street-master.m4a" \
    -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -shortest -movflags +faststart \
    "$output_dir/sanch-artbook-film-v22-gallery-cut-paris-street-${format}.mp4"
done

ffmpeg -hide_banner -loglevel error -y \
  -i "$output_dir/sanch-artbook-film-v22-gallery-cut-paris-street-master.mp4" \
  -t 32 -c:v libx264 -preset medium -crf 17 -c:a aac -b:a 192k -movflags +faststart \
  "$output_dir/sanch-artbook-film-v22-gallery-cut-paris-street-preview.mp4"

echo "Created:"
ls -lh "$output_dir"/sanch-artbook-film-v22-*.mp4
