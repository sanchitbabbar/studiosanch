#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
build_dir="/private/tmp/sanch-gallery-grounded-dark-air-v34"
signature="$output_dir/assets/paris-field-recordings/cursive-pen-signature-cc0.mp3"
clicks="$output_dir/assets/paris-field-recordings/pen-open-close-cc0.mp3"
duration="68.25"

mkdir -p "$build_dir"

# Retain the long, uneven breath of v21 while removing its crystalline register.
# The replacement voice is a rounded, bowed-bass-like harmonic body with soft attacks.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "aevalsrc=0.028*(sin(2*PI*36.71*t)+0.66*sin(2*PI*41.20*t)+0.15*sin(2*PI*73.42*t))*(0.58+0.24*sin(PI*(t+3)/43)*sin(PI*(t+3)/43)+0.18*sin(PI*t/27)*sin(PI*t/27)):s=48000:d=$duration" \
  -f lavfi -i "aevalsrc=0.014*(sin(2*PI*73.42*t)+0.48*sin(2*PI*110.00*t)+0.18*sin(2*PI*146.83*t))*(0.35+0.65*sin(PI*(t+7)/37)*sin(PI*(t+7)/37)):s=48000:d=$duration" \
  -f lavfi -i "aevalsrc=0.0065*(sin(2*PI*146.83*t)+0.42*sin(2*PI*220.00*t)+0.14*sin(2*PI*293.66*t))*(0.28+0.72*sin(PI*(t+13)/49)*sin(PI*(t+13)/49)):s=48000:d=$duration" \
  -f lavfi -i "anoisesrc=color=brown:sample_rate=48000:duration=$duration" \
  -filter_complex "[0:a]highpass=f=24,lowpass=f=145,aecho=0.82:0.16:1180:0.035,afade=t=in:st=0:d=7,afade=t=out:st=61:d=7.25[sub];[1:a]highpass=f=48,lowpass=f=260,aecho=0.86:0.18:1560|2710:0.035|0.018,afade=t=in:st=0:d=10,afade=t=out:st=59:d=9.25[body];[2:a]highpass=f=90,lowpass=f=430,aecho=0.88:0.16:2210:0.025,afade=t=in:st=0:d=13,afade=t=out:st=56:d=12.25[bow];[3:a]highpass=f=28,lowpass=f=190,volume=-48dB,afade=t=in:st=0:d=9,afade=t=out:st=59:d=9.25[velvet];[sub][body][bow][velvet]amix=inputs=4:normalize=0,volume=12dB,alimiter=limit=0.62[score]" \
  -map "[score]" -c:a pcm_s24le "$build_dir/grounded-dark-air.wav"

render_film() {
  local picture="$1"
  local output="$2"

  ffmpeg -hide_banner -loglevel error -y \
    -i "$picture" -i "$build_dir/grounded-dark-air.wav" -i "$signature" -i "$clicks" \
    -filter_complex "[1:a]anull[score];[2:a]highpass=f=620,lowpass=f=6500,volume=-9dB,afade=t=in:st=0:d=0.035,afade=t=out:st=2.05:d=0.40,adelay=34800|34800[pen];[3:a]asplit=2[openraw][closeraw];[openraw]atrim=start=0:end=0.38,asetpts=PTS-STARTPTS,highpass=f=180,lowpass=f=6000,volume=-10dB,adelay=33900|33900[open];[closeraw]atrim=start=0.38:end=0.806,asetpts=PTS-STARTPTS,highpass=f=180,lowpass=f=6000,volume=-10dB,adelay=37500|37500[close];[score][pen][open][close]amix=inputs=4:normalize=0,alimiter=limit=0.70[out]" \
    -map 0:v:0 -map "[out]" -c:v copy -c:a aac -b:a 320k -shortest -movflags +faststart "$output"
}

render_film \
  "$output_dir/sanch-artbook-film-v10-editorial-cuts-master.mp4" \
  "$output_dir/sanch-artbook-film-v34-grounded-dark-air-master.mp4"

render_film \
  "$output_dir/sanch-artbook-film-v33-vertical-stabilized-full-spreads.mp4" \
  "$output_dir/sanch-artbook-film-v34-grounded-dark-air-vertical.mp4"

ffmpeg -hide_banner -loglevel error -y \
  -i "$output_dir/sanch-artbook-film-v34-grounded-dark-air-master.mp4" \
  -t 32 -c:v libx264 -preset medium -crf 17 -c:a aac -b:a 192k -movflags +faststart \
  "$output_dir/sanch-artbook-film-v34-grounded-dark-air-preview.mp4"

echo "Created:"
ls -lh "$output_dir"/sanch-artbook-film-v34-*.mp4
