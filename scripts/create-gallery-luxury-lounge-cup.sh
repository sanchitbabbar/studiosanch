#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
lounge="$output_dir/assets/paris-field-recordings/luxury-hotel-lobby-cc0.mp3"
cup="$output_dir/assets/paris-field-recordings/cup-saucer-cc0.mp3"
build_dir="/private/tmp/sanch-gallery-luxury-lounge"

mkdir -p "$build_dir"

# Quiet lounge bed with one—and only one—porcelain cup placement at 44.7 seconds.
ffmpeg -hide_banner -loglevel error -y -ss 28 -i "$lounge" -i "$cup" \
  -filter_complex "[0:a]highpass=f=92,lowpass=f=5900,afftdn=nf=-46:tn=1,acompressor=threshold=0.18:ratio=1.55:attack=55:release=620:makeup=1.03,stereotools=mlev=0.84:slev=1.05,volume=-6dB,afade=t=in:st=0:d=3.2,afade=t=out:st=63:d=5.25[lounge];[1:a]highpass=f=180,lowpass=f=6100,volume=-8dB,adelay=44700|44700[cup];[lounge][cup]amix=inputs=2:normalize=0,alimiter=limit=0.78[out]" \
  -map "[out]" -t 68.25 -c:a aac -b:a 320k "$build_dir/lounge-master.m4a"

for format in master vertical; do
  ffmpeg -hide_banner -loglevel error -y \
    -i "$output_dir/sanch-artbook-film-v10-editorial-cuts-${format}.mp4" \
    -i "$build_dir/lounge-master.m4a" \
    -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -shortest -movflags +faststart \
    "$output_dir/sanch-artbook-film-v24-gallery-cut-luxury-lounge-${format}.mp4"
done

ffmpeg -hide_banner -loglevel error -y \
  -i "$output_dir/sanch-artbook-film-v24-gallery-cut-luxury-lounge-master.mp4" \
  -ss 34 -t 20 -c:v libx264 -preset medium -crf 17 -c:a aac -b:a 192k -movflags +faststart \
  "$output_dir/sanch-artbook-film-v24-gallery-cut-luxury-lounge-cup-preview.mp4"

echo "Created:"
ls -lh "$output_dir"/sanch-artbook-film-v24-*.mp4
