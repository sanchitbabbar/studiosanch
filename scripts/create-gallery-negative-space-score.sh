#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
build_dir="/private/tmp/sanch-gallery-negative-space"
duration="68.25"

mkdir -p "$build_dir"

# Unevenly placed, differently voiced prepared-piano gestures.
frequencies=(293.66 220.00 349.23 261.63 146.83 440.00 311.13 196.00 523.25 261.63 220.00 293.66)
delays=(2700 8100 14300 19600 28700 33100 41700 44600 51100 57600 63100 65700)
levels=(0.16 0.12 0.14 0.10 0.17 0.09 0.13 0.11 0.075 0.12 0.09 0.13)

for index in {1..12}; do
  frequency="${frequencies[$index]}"
  level="${levels[$index]}"
  ffmpeg -hide_banner -loglevel error -y \
    -f lavfi -i "aevalsrc=${level}*(sin(2*PI*${frequency}*t)+0.47*sin(2*PI*${frequency}*2.01*t)+0.21*sin(2*PI*${frequency}*3.02*t)+0.085*sin(2*PI*${frequency}*5.01*t))*exp(-1.48*t)+0.028*sin(2*PI*${frequency}*7.93*t)*exp(-11*t):s=48000:d=4.8" \
    -af "highpass=f=70,lowpass=f=5100,aecho=0.78:0.18:190|410:0.07|0.035,afade=t=out:st=3.2:d=1.6" \
    -c:a pcm_s24le "$build_dir/note_${index}.wav"
done

# A nearly subliminal bowed-bass arc and a single harmonic opening toward the final object shot.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "aevalsrc=0.030*(sin(2*PI*43.65*t)+0.30*sin(2*PI*87.30*t)+0.10*sin(2*PI*130.95*t))*(0.12+0.32*sin(PI*t/68.25)*sin(PI*t/68.25)):s=48000:d=$duration" \
  -f lavfi -i "aevalsrc=0.022*(sin(2*PI*130.81*t)+0.56*sin(2*PI*155.56*t)+0.40*sin(2*PI*196*t)):s=48000:d=13.25" \
  -filter_complex "[0:a]lowpass=f=260,afade=t=in:st=0:d=5,afade=t=out:st=63:d=5.25[bass];[1:a]lowpass=f=1250,aecho=0.82:0.30:920|1760:0.10|0.055,afade=t=in:st=0:d=7.5,afade=t=out:st=10:d=3.25,adelay=55000|55000[final];[bass][final]amix=inputs=2:normalize=0[bed]" \
  -map "[bed]" -c:a pcm_s24le "$build_dir/bed.wav"

inputs=(-i "$build_dir/bed.wav")
filter="[0:a]anull[a0];"
mix_labels="[a0]"
for index in {1..12}; do
  inputs+=(-i "$build_dir/note_${index}.wav")
  delay="${delays[$index]}"
  filter+="[${index}:a]adelay=${delay}|${delay}[a${index}];"
  mix_labels+="[a${index}]"
done
filter+="${mix_labels}amix=inputs=13:normalize=0,volume=10dB,afade=t=in:st=0:d=1.8,afade=t=out:st=65:d=3.25,alimiter=limit=0.80[score]"

ffmpeg -hide_banner -loglevel error -y "${inputs[@]}" \
  -filter_complex "$filter" -map "[score]" -t "$duration" -c:a aac -b:a 320k \
  "$build_dir/score-master.m4a"

for format in master vertical; do
  ffmpeg -hide_banner -loglevel error -y \
    -i "$output_dir/sanch-artbook-film-v10-editorial-cuts-${format}.mp4" \
    -i "$build_dir/score-master.m4a" \
    -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -shortest -movflags +faststart \
    "$output_dir/sanch-artbook-film-v20-gallery-cut-negative-space-${format}.mp4"
done

ffmpeg -hide_banner -loglevel error -y \
  -i "$output_dir/sanch-artbook-film-v20-gallery-cut-negative-space-master.mp4" \
  -t 32 -c:v libx264 -preset medium -crf 17 -c:a aac -b:a 192k -movflags +faststart \
  "$output_dir/sanch-artbook-film-v20-gallery-cut-negative-space-preview.mp4"

echo "Created:"
ls -lh "$output_dir"/sanch-artbook-film-v20-*.mp4
