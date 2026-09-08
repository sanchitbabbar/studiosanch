#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
asset_dir="$output_dir/assets/generated-scenes"
build_dir="/private/tmp/sanch-model-cabinet-ending"
landscape_image="$asset_dir/model-placing-sanch-book-cabinet-landscape-v1.png"
vertical_image="$asset_dir/model-placing-sanch-book-cabinet-vertical-v1.png"
drawer_sound="$output_dir/sound-options-drawer-book/03-heritage-luxury-drawer-artbook.wav"
fps=24
scene_duration=6

mkdir -p "$build_dir"

# Oversampled, extremely restrained camera push to retain stability and detail.
ffmpeg -hide_banner -loglevel error -y -loop 1 -i "$landscape_image" \
  -vf "scale=3840:2160:force_original_aspect_ratio=increase:flags=lanczos,crop=3840:2160,zoompan=z='1.0+0.00018*on':x='trunc(((iw-iw/zoom)/2)/2)*2':y='trunc(((ih-ih/zoom)/2)/2)*2':d=144:s=3840x2160:fps=$fps,scale=1920:1080:flags=lanczos,format=yuv420p" \
  -t "$scene_duration" -an -c:v libx264 -preset medium -crf 16 -movflags +faststart "$build_dir/ending-landscape.mp4"

ffmpeg -hide_banner -loglevel error -y -loop 1 -i "$vertical_image" \
  -vf "scale=2160:3840:force_original_aspect_ratio=increase:flags=lanczos,crop=2160:3840,zoompan=z='1.0+0.00018*on':x='trunc(((iw-iw/zoom)/2)/2)*2':y='trunc(((ih-ih/zoom)/2)/2)*2':d=144:s=2160x3840:fps=$fps,scale=1080:1920:flags=lanczos,format=yuv420p" \
  -t "$scene_duration" -an -c:v libx264 -preset medium -crf 16 -movflags +faststart "$build_dir/ending-vertical.mp4"

append_scene() {
  local video="$1"
  local ending="$2"
  local name="$3"
  local silent="$build_dir/${name}-silent.mp4"

  ffmpeg -hide_banner -loglevel error -y -i "$video" -map 0:v:0 -an -c:v copy "$build_dir/${name}-original-picture.mp4"
  print -r -- "file '$build_dir/${name}-original-picture.mp4'" > "$build_dir/${name}-concat.txt"
  print -r -- "file '$ending'" >> "$build_dir/${name}-concat.txt"
  ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$build_dir/${name}-concat.txt" -c copy "$silent"
}

append_scene "$output_dir/comparison-02-editorial-high-fashion-landscape.mp4" "$build_dir/ending-landscape.mp4" long
append_scene "$output_dir/editorial-high-fashion-trailer-a-landscape.mp4" "$build_dir/ending-landscape.mp4" trailer-a
append_scene "$output_dir/editorial-high-fashion-trailer-b-landscape.mp4" "$build_dir/ending-landscape.mp4" trailer-b
append_scene "$output_dir/sanch-artbook-film-v10-editorial-cuts-vertical.mp4" "$build_dir/ending-vertical.mp4" vertical
append_scene "$output_dir/sanch-artbook-film-v10-editorial-cuts-website-loop.mp4" "$build_dir/ending-landscape.mp4" website

# Shared dark bronze gong, without an airy noise layer.
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

create_score 74.25 70.25 "$build_dir/score-74.wav"
create_score 40.125 36.125 "$build_dir/score-40.wav"
create_score 18.0 14.0 "$build_dir/score-18.wav"

finish() {
  local silent="$1"
  local score="$2"
  local drawer_start_ms="$3"
  local duration="$4"
  local output="$5"
  ffmpeg -hide_banner -loglevel error -y \
    -i "$silent" -i "$score" -i "$drawer_sound" \
    -filter_complex "[1:a]anull[score];[2:a]volume=-1dB,adelay=${drawer_start_ms}|${drawer_start_ms}[drawer];[score][drawer]amix=inputs=2:normalize=0,alimiter=limit=0.82[out]" \
    -map 0:v:0 -map "[out]" -c:v copy -c:a aac -b:a 320k -t "$duration" -movflags +faststart "$build_dir/final.mp4"
  mv "$build_dir/final.mp4" "$output"
}

finish "$build_dir/long-silent.mp4" "$build_dir/score-74.wav" 65550 74.25 "$output_dir/comparison-02-editorial-high-fashion-landscape.mp4"
finish "$build_dir/trailer-a-silent.mp4" "$build_dir/score-40.wav" 31425 40.125 "$output_dir/editorial-high-fashion-trailer-a-landscape.mp4"
finish "$build_dir/trailer-b-silent.mp4" "$build_dir/score-40.wav" 31425 40.125 "$output_dir/editorial-high-fashion-trailer-b-landscape.mp4"
finish "$build_dir/vertical-silent.mp4" "$build_dir/score-74.wav" 65550 74.25 "$output_dir/sanch-artbook-film-v10-editorial-cuts-vertical.mp4"
finish "$build_dir/website-silent.mp4" "$build_dir/score-18.wav" 9300 18.0 "$output_dir/sanch-artbook-film-v10-editorial-cuts-website-loop.mp4"

echo "Added model-and-cabinet ending to all five final videos."
