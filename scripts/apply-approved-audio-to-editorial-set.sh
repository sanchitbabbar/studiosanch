#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
build_dir="/private/tmp/sanch-editorial-approved-audio"
signature="$output_dir/assets/paris-field-recordings/cursive-pen-signature-cc0.mp3"
clicks="$output_dir/assets/paris-field-recordings/pen-open-close-cc0.mp3"

mkdir -p "$build_dir"

create_score() {
  local duration="$1"
  local score="$2"

  ffmpeg -hide_banner -loglevel error -y \
    -f lavfi -i "aevalsrc=0.028*(sin(2*PI*36.71*t)+0.66*sin(2*PI*41.20*t)+0.15*sin(2*PI*73.42*t))*(0.58+0.24*sin(PI*(t+3)/43)*sin(PI*(t+3)/43)+0.18*sin(PI*t/27)*sin(PI*t/27)):s=48000:d=$duration" \
    -f lavfi -i "aevalsrc=0.014*(sin(2*PI*73.42*t)+0.48*sin(2*PI*110.00*t)+0.18*sin(2*PI*146.83*t))*(0.35+0.65*sin(PI*(t+7)/37)*sin(PI*(t+7)/37)):s=48000:d=$duration" \
    -f lavfi -i "aevalsrc=0.0065*(sin(2*PI*146.83*t)+0.42*sin(2*PI*220.00*t)+0.14*sin(2*PI*293.66*t))*(0.28+0.72*sin(PI*(t+13)/49)*sin(PI*(t+13)/49)):s=48000:d=$duration" \
    -f lavfi -i "anoisesrc=color=brown:sample_rate=48000:duration=$duration" \
    -filter_complex "[0:a]highpass=f=24,lowpass=f=145,aecho=0.82:0.16:1180:0.035,afade=t=in:st=0:d=7[sub];[1:a]highpass=f=48,lowpass=f=260,aecho=0.86:0.18:1560|2710:0.035|0.018,afade=t=in:st=0:d=10[body];[2:a]highpass=f=90,lowpass=f=430,aecho=0.88:0.16:2210:0.025,afade=t=in:st=0:d=13[bow];[3:a]highpass=f=28,lowpass=f=190,volume=-48dB,afade=t=in:st=0:d=9[velvet];[sub][body][bow][velvet]amix=inputs=4:normalize=0,volume=12dB,alimiter=limit=0.62[score]" \
    -map "[score]" -c:a pcm_s24le "$score"
}

render() {
  local picture="$1"
  local score="$2"
  local duration="$3"
  local fade_start="$4"
  local open_ms="$5"
  local signature_ms="$6"
  local close_ms="$7"
  local output="$8"

  ffmpeg -hide_banner -loglevel error -y \
    -i "$picture" -i "$score" -i "$signature" -i "$clicks" \
    -filter_complex "[1:a]afade=t=out:st=${fade_start}:d=4[score];[2:a]highpass=f=620,lowpass=f=6500,volume=-9dB,afade=t=in:st=0:d=0.035,afade=t=out:st=2.05:d=0.40,adelay=${signature_ms}|${signature_ms}[pen];[3:a]asplit=2[openraw][closeraw];[openraw]atrim=start=0:end=0.38,asetpts=PTS-STARTPTS,highpass=f=180,lowpass=f=6000,volume=-10dB,adelay=${open_ms}|${open_ms}[open];[closeraw]atrim=start=0.38:end=0.806,asetpts=PTS-STARTPTS,highpass=f=180,lowpass=f=6000,volume=-10dB,adelay=${close_ms}|${close_ms}[close];[score][pen][open][close]amix=inputs=4:normalize=0,alimiter=limit=0.70[out]" \
    -map 0:v:0 -map "[out]" -c:v copy -c:a aac -b:a 320k -t "$duration" -movflags +faststart "$output"
}

create_score 68.25 "$build_dir/score-68.wav"
create_score 12.0 "$build_dir/score-12.wav"

render "$output_dir/sanch-artbook-film-v10-editorial-cuts-master.mp4" "$build_dir/score-68.wav" 68.25 64.25 63200 64000 66800 "$build_dir/master.mp4"
render "$output_dir/assets/video-sources/editorial-vertical-stabilized-picture.mp4" "$build_dir/score-68.wav" 68.25 64.25 63200 64000 66800 "$build_dir/vertical.mp4"
render "$output_dir/sanch-artbook-film-v10-editorial-cuts-website-loop.mp4" "$build_dir/score-12.wav" 12.0 8.0 7000 7800 10600 "$build_dir/website.mp4"

mv "$build_dir/master.mp4" "$output_dir/sanch-artbook-film-v10-editorial-cuts-master.mp4"
mv "$build_dir/vertical.mp4" "$output_dir/sanch-artbook-film-v10-editorial-cuts-vertical.mp4"
mv "$build_dir/website.mp4" "$output_dir/sanch-artbook-film-v10-editorial-cuts-website-loop.mp4"

echo "Updated:"
ls -lh "$output_dir/comparison-02-editorial-high-fashion-landscape.mp4" "$output_dir"/sanch-artbook-film-v10-editorial-cuts-*.mp4
