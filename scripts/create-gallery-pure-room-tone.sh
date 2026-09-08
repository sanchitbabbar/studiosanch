#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
build_dir="/private/tmp/sanch-gallery-pure-room-tone"
duration="68.25"

mkdir -p "$build_dir"

# One stable architectural room tone. No musical or narrative events.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "anoisesrc=color=brown:sample_rate=48000:duration=$duration" \
  -f lavfi -i "sine=frequency=48.2:sample_rate=48000:duration=$duration" \
  -filter_complex "[0:a]highpass=f=135,lowpass=f=1450,volume=-38dB[air];[1:a]lowpass=f=72,volume=-39dB[room];[air][room]amix=inputs=2:normalize=0,afade=t=in:st=0:d=4,afade=t=out:st=63:d=5.25,alimiter=limit=0.70[out]" \
  -map "[out]" -c:a aac -b:a 256k "$build_dir/room-tone.m4a"

for format in master vertical; do
  ffmpeg -hide_banner -loglevel error -y \
    -i "$output_dir/sanch-artbook-film-v10-editorial-cuts-${format}.mp4" \
    -i "$build_dir/room-tone.m4a" \
    -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -shortest -movflags +faststart \
    "$output_dir/sanch-artbook-film-v26-gallery-cut-pure-room-tone-${format}.mp4"
done

ffmpeg -hide_banner -loglevel error -y \
  -i "$output_dir/sanch-artbook-film-v26-gallery-cut-pure-room-tone-master.mp4" \
  -t 24 -c:v libx264 -preset medium -crf 17 -c:a aac -b:a 160k -movflags +faststart \
  "$output_dir/sanch-artbook-film-v26-gallery-cut-pure-room-tone-preview.mp4"

echo "Created:"
ls -lh "$output_dir"/sanch-artbook-film-v26-*.mp4
