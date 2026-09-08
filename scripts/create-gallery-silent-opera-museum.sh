#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
museum="$output_dir/assets/paris-field-recordings/paris-richelieu-library-cc0.mp3"
build_dir="/private/tmp/sanch-gallery-silent-opera-museum"

mkdir -p "$build_dir"

# Near-silent museum air with a distant, non-melodic operatic presence in two brief arcs.
ffmpeg -hide_banner -loglevel error -y -ss 112 -i "$museum" \
  -f lavfi -i "aevalsrc=0.010*(sin(2*PI*(196+0.44*sin(2*PI*4.2*t))*t)+0.28*sin(2*PI*(392+0.72*sin(2*PI*4.2*t))*t)+0.09*sin(2*PI*588*t)):s=48000:d=18" \
  -f lavfi -i "aevalsrc=0.008*(sin(2*PI*(174.61+0.38*sin(2*PI*4.0*t))*t)+0.25*sin(2*PI*(349.23+0.61*sin(2*PI*4.0*t))*t)):s=48000:d=12" \
  -filter_complex "[0:a]highpass=f=125,lowpass=f=4200,afftdn=nf=-44:tn=1,stereotools=mlev=0.88:slev=1.02,volume=-17dB,afade=t=in:st=0:d=4,afade=t=out:st=63:d=5.25[museum];[1:a]highpass=f=165,lowpass=f=1650,aecho=0.90:0.48:1280|2460|3710:0.13|0.075|0.035,volume=-15dB,afade=t=in:st=0:d=7,afade=t=out:st=10:d=8,adelay=17600|17600[opera1];[2:a]highpass=f=150,lowpass=f=1450,aecho=0.91:0.50:1460|2790:0.12|0.055,volume=-17dB,afade=t=in:st=0:d=5.5,afade=t=out:st=7:d=5,adelay=52100|52100[opera2];[museum][opera1][opera2]amix=inputs=3:normalize=0,volume=18dB,alimiter=limit=0.72[out]" \
  -map "[out]" -t 68.25 -c:a aac -b:a 320k "$build_dir/silent-opera-museum.m4a"

for format in master vertical; do
  ffmpeg -hide_banner -loglevel error -y \
    -i "$output_dir/sanch-artbook-film-v10-editorial-cuts-${format}.mp4" \
    -i "$build_dir/silent-opera-museum.m4a" \
    -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -shortest -movflags +faststart \
    "$output_dir/sanch-artbook-film-v25-gallery-cut-silent-opera-museum-${format}.mp4"
done

ffmpeg -hide_banner -loglevel error -y \
  -i "$output_dir/sanch-artbook-film-v25-gallery-cut-silent-opera-museum-master.mp4" \
  -t 32 -c:v libx264 -preset medium -crf 17 -c:a aac -b:a 192k -movflags +faststart \
  "$output_dir/sanch-artbook-film-v25-gallery-cut-silent-opera-museum-preview.mp4"

echo "Created:"
ls -lh "$output_dir"/sanch-artbook-film-v25-*.mp4
