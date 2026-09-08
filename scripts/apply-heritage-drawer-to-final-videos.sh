#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
build_dir="/private/tmp/sanch-final-heritage-drawer-audio"
drawer_sound="$output_dir/sound-options-drawer-book/03-heritage-luxury-drawer-artbook.wav"

mkdir -p "$build_dir"

create_score() {
  local duration="$1"
  local fade_start="$2"
  local output="$3"

  ffmpeg -hide_banner -loglevel error -y \
    -f lavfi -i "aevalsrc=0.028*(sin(2*PI*36.71*t)+0.66*sin(2*PI*41.20*t)+0.15*sin(2*PI*73.42*t))*(0.58+0.24*sin(PI*(t+3)/43)*sin(PI*(t+3)/43)+0.18*sin(PI*t/27)*sin(PI*t/27)):s=48000:d=$duration" \
    -f lavfi -i "aevalsrc=0.014*(sin(2*PI*73.42*t)+0.48*sin(2*PI*110.00*t)+0.18*sin(2*PI*146.83*t))*(0.35+0.65*sin(PI*(t+7)/37)*sin(PI*(t+7)/37)):s=48000:d=$duration" \
    -f lavfi -i "aevalsrc=0.0065*(sin(2*PI*146.83*t)+0.42*sin(2*PI*220.00*t)+0.14*sin(2*PI*293.66*t))*(0.28+0.72*sin(PI*(t+13)/49)*sin(PI*(t+13)/49)):s=48000:d=$duration" \
    -f lavfi -i "anoisesrc=color=brown:sample_rate=48000:duration=$duration" \
    -filter_complex "[0:a]highpass=f=24,lowpass=f=145,aecho=0.82:0.16:1180:0.035,afade=t=in:st=0:d=7[sub];[1:a]highpass=f=48,lowpass=f=260,aecho=0.86:0.18:1560|2710:0.035|0.018,afade=t=in:st=0:d=10[body];[2:a]highpass=f=90,lowpass=f=430,aecho=0.88:0.16:2210:0.025,afade=t=in:st=0:d=13[bow];[3:a]highpass=f=28,lowpass=f=190,volume=-48dB,afade=t=in:st=0:d=9[velvet];[sub][body][bow][velvet]amix=inputs=4:normalize=0,volume=12dB,afade=t=out:st=${fade_start}:d=4,alimiter=limit=0.62[score]" \
    -map "[score]" -c:a pcm_s24le "$output"
}

render() {
  local video="$1"
  local score="$2"
  local start_ms="$3"
  local duration="$4"
  local temp="$build_dir/$(basename "$video")"

  ffmpeg -hide_banner -loglevel error -y \
    -i "$video" -i "$score" -i "$drawer_sound" \
    -filter_complex "[1:a]anull[score];[2:a]volume=-1dB,adelay=${start_ms}|${start_ms}[drawer];[score][drawer]amix=inputs=2:normalize=0,alimiter=limit=0.82[out]" \
    -map 0:v:0 -map "[out]" -c:v copy -c:a aac -b:a 320k -t "$duration" -movflags +faststart "$temp"

  mv "$temp" "$video"
}

create_score 68.25 64.25 "$build_dir/score-68.wav"
create_score 34.125 30.125 "$build_dir/score-34.wav"
create_score 12.0 8.0 "$build_dir/score-12.wav"

render "$output_dir/comparison-02-editorial-high-fashion-landscape.mp4" "$build_dir/score-68.wav" 59550 68.25
render "$output_dir/editorial-high-fashion-trailer-a-landscape.mp4" "$build_dir/score-34.wav" 25425 34.125
render "$output_dir/editorial-high-fashion-trailer-b-landscape.mp4" "$build_dir/score-34.wav" 25425 34.125
render "$output_dir/sanch-artbook-film-v10-editorial-cuts-vertical.mp4" "$build_dir/score-68.wav" 59550 68.25
render "$output_dir/sanch-artbook-film-v10-editorial-cuts-website-loop.mp4" "$build_dir/score-12.wav" 3300 12.0

echo "Updated final exports:"
ls -lh \
  "$output_dir/comparison-02-editorial-high-fashion-landscape.mp4" \
  "$output_dir/editorial-high-fashion-trailer-a-landscape.mp4" \
  "$output_dir/editorial-high-fashion-trailer-b-landscape.mp4" \
  "$output_dir/sanch-artbook-film-v10-editorial-cuts-vertical.mp4" \
  "$output_dir/sanch-artbook-film-v10-editorial-cuts-website-loop.mp4"
