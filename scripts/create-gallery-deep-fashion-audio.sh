#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
build_dir="/private/tmp/sanch-gallery-deep-fashion-audio"
duration="68.25"

mkdir -p "$build_dir"

# A continuous, low architectural fashion score: no surf-like noise and no isolated chimes.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "sine=frequency=43.65:sample_rate=48000:duration=$duration" \
  -f lavfi -i "sine=frequency=65.41:sample_rate=48000:duration=$duration" \
  -f lavfi -i "sine=frequency=87.31:sample_rate=48000:duration=$duration" \
  -f lavfi -i "sine=frequency=130.81:sample_rate=48000:duration=$duration" \
  -filter_complex "[0:a]volume='0.040*(0.58+0.42*pow(max(0,cos(PI*mod(t,3.8)/3.8)),6))':eval=frame,lowpass=f=82[sub];[1:a]volume='0.018*(0.55+0.45*sin(2*PI*t/19))':eval=frame,lowpass=f=115[bass];[2:a]volume='0.010*(0.65+0.35*sin(2*PI*t/13+1.2))':eval=frame,lowpass=f=175[body];[3:a]volume='0.0045*(0.55+0.45*sin(2*PI*t/23+0.7))':eval=frame,lowpass=f=280,highpass=f=105[texture];[sub][bass][body][texture]amix=inputs=4:normalize=0,aecho=0.7:0.22:420:0.10,afade=t=in:st=0:d=2.2,afade=t=out:st=63.5:d=4.75,alimiter=limit=0.70[a]" \
  -map "[a]" -c:a aac -b:a 256k "$build_dir/deep-fashion-score.m4a"

ffmpeg -hide_banner -loglevel error -y \
  -i "$output_dir/sanch-artbook-film-v10-editorial-cuts-master.mp4" \
  -i "$build_dir/deep-fashion-score.m4a" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart \
  "$output_dir/sanch-artbook-film-v14-gallery-cut-deep-fashion-master.mp4"

ffmpeg -hide_banner -loglevel error -y \
  -i "$output_dir/sanch-artbook-film-v10-editorial-cuts-vertical.mp4" \
  -i "$build_dir/deep-fashion-score.m4a" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart \
  "$output_dir/sanch-artbook-film-v14-gallery-cut-deep-fashion-vertical.mp4"

ffmpeg -hide_banner -loglevel error -y \
  -i "$output_dir/sanch-artbook-film-v14-gallery-cut-deep-fashion-master.mp4" \
  -t 12 -c:v libx264 -preset medium -crf 17 -c:a aac -b:a 160k -movflags +faststart \
  "$output_dir/sanch-artbook-film-v14-gallery-cut-deep-fashion-preview.mp4"

echo "Created:"
ls -lh "$output_dir"/sanch-artbook-film-v14-*.mp4
