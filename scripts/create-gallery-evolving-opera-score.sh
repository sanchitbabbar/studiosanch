#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
build_dir="/private/tmp/sanch-gallery-evolving-opera"
duration="68.25"

mkdir -p "$build_dir"

# Evolving score with sparse, deliberately irregular detail—no repeating hi-hat pattern.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "sine=frequency=43.65:sample_rate=48000:duration=$duration" \
  -f lavfi -i "sine=frequency=65.41:sample_rate=48000:duration=$duration" \
  -f lavfi -i "anoisesrc=color=white:sample_rate=48000:duration=$duration" \
  -f lavfi -i "anoisesrc=color=white:sample_rate=48000:duration=$duration" \
  -f lavfi -i "sine=frequency=174.61:sample_rate=48000:duration=$duration" \
  -f lavfi -i "sine=frequency=220.00:sample_rate=48000:duration=$duration" \
  -f lavfi -i "sine=frequency=261.63:sample_rate=48000:duration=$duration" \
  -filter_complex "[0:a]volume='0.22*(0.62+0.38*pow(sin(PI*t/18),2))':eval=frame,lowpass=f=78[sub];[1:a]volume='0.095*(0.55+0.45*pow(sin(PI*(t+3)/25),2))':eval=frame,lowpass=f=118[bass];[2:a]highpass=f=7200,lowpass=f=14800,volume='0.075*min(1,exp(-34*abs(t-5.4))+exp(-34*abs(t-13.1))+exp(-34*abs(t-22.7))+exp(-34*abs(t-36.2))+exp(-34*abs(t-49.8))+exp(-34*abs(t-61.4)))':eval=frame[crystal];[3:a]highpass=f=1900,lowpass=f=4700,volume='0.040*min(1,exp(-25*abs(t-8.8))+exp(-25*abs(t-28.6))+exp(-25*abs(t-44.3))+exp(-25*abs(t-57.1)))':eval=frame[snap];[4:a]volume='0.036*(0.50+0.50*pow(sin(PI*t/24),2))':eval=frame[o1];[5:a]volume='0.026*(0.50+0.50*pow(sin(PI*(t+7)/31),2))':eval=frame[o2];[6:a]volume='0.019*(0.50+0.50*pow(sin(PI*(t+13)/37),2))':eval=frame[o3];[o1][o2][o3]amix=inputs=3:normalize=0,lowpass=f=1350,aecho=0.84:0.48:820|1510|2380:0.14|0.09|0.05[opera];[sub][bass][crystal][snap][opera]amix=inputs=5:normalize=0,highpass=f=24,afade=t=in:st=0:d=2.1,afade=t=out:st=63.5:d=4.75,alimiter=limit=0.78[score]" \
  -map "[score]" -c:a pcm_s24le "$build_dir/score.wav"

ffmpeg -hide_banner -loglevel error -y -i "$build_dir/score.wav" \
  -af "volume=11dB,alimiter=limit=0.82" -c:a aac -b:a 320k "$build_dir/score-master.m4a"

for format in master vertical; do
  ffmpeg -hide_banner -loglevel error -y \
    -i "$output_dir/sanch-artbook-film-v10-editorial-cuts-${format}.mp4" \
    -i "$build_dir/score-master.m4a" \
    -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -shortest -movflags +faststart \
    "$output_dir/sanch-artbook-film-v17-gallery-cut-evolving-opera-${format}.mp4"
done

ffmpeg -hide_banner -loglevel error -y \
  -i "$output_dir/sanch-artbook-film-v17-gallery-cut-evolving-opera-master.mp4" \
  -t 12 -c:v libx264 -preset medium -crf 17 -c:a aac -b:a 192k -movflags +faststart \
  "$output_dir/sanch-artbook-film-v17-gallery-cut-evolving-opera-preview.mp4"

echo "Created:"
ls -lh "$output_dir"/sanch-artbook-film-v17-*.mp4
