#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
build_dir="/private/tmp/sanch-final-vintage-gong-audio"
drawer_sound="$output_dir/sound-options-drawer-book/03-heritage-luxury-drawer-artbook.wav"

mkdir -p "$build_dir"

# One dark bronze gong voice. Inharmonic partials create an aged physical metal
# resonance; there is deliberately no noise, air, sweep, or high-frequency wash.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "aevalsrc=(0.16*sin(2*PI*73.42*t)+0.075*sin(2*PI*119.3*t)+0.045*sin(2*PI*176.8*t)+0.020*sin(2*PI*247.1*t)+0.009*sin(2*PI*318.6*t))*exp(-0.52*t):s=48000:d=8" \
  -filter_complex "[0:a]highpass=f=28,lowpass=f=780,aecho=0.88:0.20:420|910|1730:0.11|0.065|0.028,afade=t=in:st=0:d=0.018,afade=t=out:st=6.2:d=1.8,volume=-5dB,alimiter=limit=0.52[gong]" \
  -map "[gong]" -c:a pcm_s24le "$build_dir/gong.wav"

create_score() {
  local duration="$1"
  local fade_start="$2"
  local output="$3"

  ffmpeg -hide_banner -loglevel error -y \
    -f lavfi -i "aevalsrc=(0.024*sin(2*PI*36.71*t)+0.009*sin(2*PI*55.00*t)+0.004*sin(2*PI*73.42*t))*(0.78+0.22*sin(PI*(t+5)/31)*sin(PI*(t+5)/31)):s=48000:d=$duration" \
    -i "$build_dir/gong.wav" \
    -filter_complex "[0:a]highpass=f=23,lowpass=f=125,afade=t=in:st=0:d=6,afade=t=out:st=${fade_start}:d=4,volume=8dB[foundation];[1:a]asplit=3[g1raw][g2raw][g3raw];[g1raw]adelay=2000|2000[g1];[g2raw]volume=-2dB,adelay=18500|18500[g2];[g3raw]volume=-4dB,adelay=41700|41700[g3];[foundation][g1][g2][g3]amix=inputs=4:normalize=0,alimiter=limit=0.66[score]" \
    -map "[score]" -t "$duration" -c:a pcm_s24le "$output"
}

render() {
  local video="$1"
  local score="$2"
  local drawer_start_ms="$3"
  local duration="$4"
  local temp="$build_dir/$(basename "$video")"

  ffmpeg -hide_banner -loglevel error -y \
    -i "$video" -i "$score" -i "$drawer_sound" \
    -filter_complex "[1:a]anull[score];[2:a]volume=-1dB,adelay=${drawer_start_ms}|${drawer_start_ms}[drawer];[score][drawer]amix=inputs=2:normalize=0,alimiter=limit=0.82[out]" \
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

echo "Updated final exports with vintage gong bed:"
ls -lh \
  "$output_dir/comparison-02-editorial-high-fashion-landscape.mp4" \
  "$output_dir/editorial-high-fashion-trailer-a-landscape.mp4" \
  "$output_dir/editorial-high-fashion-trailer-b-landscape.mp4" \
  "$output_dir/sanch-artbook-film-v10-editorial-cuts-vertical.mp4" \
  "$output_dir/sanch-artbook-film-v10-editorial-cuts-website-loop.mp4"
