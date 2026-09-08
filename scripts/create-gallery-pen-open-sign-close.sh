#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
clicks="$output_dir/assets/paris-field-recordings/pen-open-close-cc0.mp3"

# Preserve v27 exactly, adding one opening click before the signature and one closing click after it.
for format in master vertical; do
  ffmpeg -hide_banner -loglevel error -y \
    -i "$output_dir/sanch-artbook-film-v27-gallery-cut-room-tone-signature-${format}.mp4" \
    -i "$clicks" \
    -filter_complex "[0:a]anull[approved];[1:a]asplit=2[openraw][closeraw];[openraw]atrim=start=0:end=0.38,asetpts=PTS-STARTPTS,highpass=f=180,lowpass=f=7200,volume=-8dB,adelay=33900|33900[open];[closeraw]atrim=start=0.38:end=0.806,asetpts=PTS-STARTPTS,highpass=f=180,lowpass=f=7200,volume=-8dB,adelay=37500|37500[close];[approved][open][close]amix=inputs=3:normalize=0,alimiter=limit=0.76[out]" \
    -map 0:v:0 -map "[out]" -c:v copy -c:a aac -b:a 320k -shortest -movflags +faststart \
    "$output_dir/sanch-artbook-film-v28-gallery-cut-pen-open-sign-close-${format}.mp4"
done

ffmpeg -hide_banner -loglevel error -y \
  -ss 31.5 -i "$output_dir/sanch-artbook-film-v28-gallery-cut-pen-open-sign-close-master.mp4" \
  -t 9.5 -c:v libx264 -preset medium -crf 17 -c:a aac -b:a 192k -movflags +faststart \
  "$output_dir/sanch-artbook-film-v28-gallery-cut-pen-open-sign-close-preview.mp4"

echo "Created:"
ls -lh "$output_dir"/sanch-artbook-film-v28-*.mp4
