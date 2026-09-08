#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
source_clips="/private/tmp/sanch-artbook-film-v10/landscape"
build_dir="/private/tmp/sanch-editorial-twin-trailers"
signature="$output_dir/assets/paris-field-recordings/cursive-pen-signature-cc0.mp3"
clicks="$output_dir/assets/paris-field-recordings/pen-open-close-cc0.mp3"
duration="34.125"

mkdir -p "$build_dir"

# Both edits share the same visual signature at the beginning and end.
# Trailer A explores product construction; Trailer B explores editorial narrative.
trailer_a=(1 2 3 4 13 14 16 17 18)
trailer_b=(1 2 5 6 8 11 15 17 18)

assemble_picture() {
  local name="$1"
  shift
  local clips=("$@")
  local concat_file="$build_dir/${name}-concat.txt"

  : > "$concat_file"
  for clip in "${clips[@]}"; do
    print -r -- "file '$source_clips/clip_$(printf '%02d' "$clip").mp4'" >> "$concat_file"
  done

  ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$concat_file" -c copy "$build_dir/${name}-picture.mp4"
}

assemble_picture trailer-a "${trailer_a[@]}"
assemble_picture trailer-b "${trailer_b[@]}"

# One shared score so the pair feels like a single campaign.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "aevalsrc=0.028*(sin(2*PI*36.71*t)+0.66*sin(2*PI*41.20*t)+0.15*sin(2*PI*73.42*t))*(0.58+0.24*sin(PI*(t+3)/43)*sin(PI*(t+3)/43)+0.18*sin(PI*t/27)*sin(PI*t/27)):s=48000:d=$duration" \
  -f lavfi -i "aevalsrc=0.014*(sin(2*PI*73.42*t)+0.48*sin(2*PI*110.00*t)+0.18*sin(2*PI*146.83*t))*(0.35+0.65*sin(PI*(t+7)/37)*sin(PI*(t+7)/37)):s=48000:d=$duration" \
  -f lavfi -i "aevalsrc=0.0065*(sin(2*PI*146.83*t)+0.42*sin(2*PI*220.00*t)+0.14*sin(2*PI*293.66*t))*(0.28+0.72*sin(PI*(t+13)/49)*sin(PI*(t+13)/49)):s=48000:d=$duration" \
  -f lavfi -i "anoisesrc=color=brown:sample_rate=48000:duration=$duration" \
  -filter_complex "[0:a]highpass=f=24,lowpass=f=145,aecho=0.82:0.16:1180:0.035,afade=t=in:st=0:d=7[sub];[1:a]highpass=f=48,lowpass=f=260,aecho=0.86:0.18:1560|2710:0.035|0.018,afade=t=in:st=0:d=10[body];[2:a]highpass=f=90,lowpass=f=430,aecho=0.88:0.16:2210:0.025,afade=t=in:st=0:d=13[bow];[3:a]highpass=f=28,lowpass=f=190,volume=-48dB,afade=t=in:st=0:d=9[velvet];[sub][body][bow][velvet]amix=inputs=4:normalize=0,volume=12dB,afade=t=out:st=30.125:d=4,alimiter=limit=0.62[score]" \
  -map "[score]" -c:a pcm_s24le "$build_dir/shared-score.wav"

ffmpeg -hide_banner -loglevel error -y \
  -i "$build_dir/shared-score.wav" -i "$signature" -i "$clicks" \
  -filter_complex "[0:a]anull[score];[1:a]highpass=f=620,lowpass=f=6500,volume=-9dB,afade=t=in:st=0:d=0.035,afade=t=out:st=2.05:d=0.40,adelay=29800|29800[pen];[2:a]asplit=2[openraw][closeraw];[openraw]atrim=start=0:end=0.38,asetpts=PTS-STARTPTS,highpass=f=180,lowpass=f=6000,volume=-10dB,adelay=29000|29000[open];[closeraw]atrim=start=0.38:end=0.806,asetpts=PTS-STARTPTS,highpass=f=180,lowpass=f=6000,volume=-10dB,adelay=32600|32600[close];[score][pen][open][close]amix=inputs=4:normalize=0,alimiter=limit=0.70[out]" \
  -map "[out]" -c:a pcm_s24le "$build_dir/shared-score-with-signature.wav"

for trailer in a b; do
  ffmpeg -hide_banner -loglevel error -y \
    -i "$build_dir/trailer-${trailer}-picture.mp4" -i "$build_dir/shared-score-with-signature.wav" \
    -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 320k -shortest -movflags +faststart \
    "$output_dir/editorial-high-fashion-trailer-${trailer}-landscape.mp4"
done

echo "Created:"
ls -lh "$output_dir"/editorial-high-fashion-trailer-*-landscape.mp4
