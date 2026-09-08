#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
source_audio="$output_dir/assets/paris-field-recordings/paris-richelieu-library-cc0.mp3"
build_dir="/private/tmp/sanch-gallery-paris-richelieu"

mkdir -p "$build_dir"

# Authentic quiet Paris: restrained murmurs, pages, footsteps and architectural room air.
ffmpeg -hide_banner -loglevel error -y -ss 45 -i "$source_audio" \
  -af "highpass=f=105,lowpass=f=6100,afftdn=nf=-48:tn=1,acompressor=threshold=0.16:ratio=1.7:attack=45:release=520:makeup=1.08,stereotools=mlev=0.82:slev=1.08,volume=-3dB,afade=t=in:st=0:d=3,afade=t=out:st=63:d=5.25" \
  -t 68.25 -c:a aac -b:a 320k "$build_dir/richelieu-master.m4a"

for format in master vertical; do
  ffmpeg -hide_banner -loglevel error -y \
    -i "$output_dir/sanch-artbook-film-v10-editorial-cuts-${format}.mp4" \
    -i "$build_dir/richelieu-master.m4a" \
    -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -shortest -movflags +faststart \
    "$output_dir/sanch-artbook-film-v23-gallery-cut-paris-richelieu-${format}.mp4"
done

ffmpeg -hide_banner -loglevel error -y \
  -i "$output_dir/sanch-artbook-film-v23-gallery-cut-paris-richelieu-master.mp4" \
  -t 32 -c:v libx264 -preset medium -crf 17 -c:a aac -b:a 192k -movflags +faststart \
  "$output_dir/sanch-artbook-film-v23-gallery-cut-paris-richelieu-preview.mp4"

echo "Created:"
ls -lh "$output_dir"/sanch-artbook-film-v23-*.mp4
