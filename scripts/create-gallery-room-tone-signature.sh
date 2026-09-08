#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
signature="$output_dir/assets/paris-field-recordings/cursive-pen-signature-cc0.mp3"

# Preserve the approved room tone exactly; add one cursive signature at 34.8 seconds.
for format in master vertical; do
  ffmpeg -hide_banner -loglevel error -y \
    -i "$output_dir/sanch-artbook-film-v26-gallery-cut-pure-room-tone-${format}.mp4" \
    -i "$signature" \
    -filter_complex "[0:a]anull[room];[1:a]highpass=f=620,lowpass=f=7800,volume=-7dB,afade=t=in:st=0:d=0.035,afade=t=out:st=2.05:d=0.40,adelay=34800|34800[pen];[room][pen]amix=inputs=2:normalize=0,alimiter=limit=0.76[out]" \
    -map 0:v:0 -map "[out]" -c:v copy -c:a aac -b:a 320k -shortest -movflags +faststart \
    "$output_dir/sanch-artbook-film-v27-gallery-cut-room-tone-signature-${format}.mp4"
done

ffmpeg -hide_banner -loglevel error -y \
  -ss 27 -i "$output_dir/sanch-artbook-film-v27-gallery-cut-room-tone-signature-master.mp4" \
  -t 16 -c:v libx264 -preset medium -crf 17 -c:a aac -b:a 192k -movflags +faststart \
  "$output_dir/sanch-artbook-film-v27-gallery-cut-room-tone-signature-preview.mp4"

echo "Created:"
ls -lh "$output_dir"/sanch-artbook-film-v27-*.mp4
