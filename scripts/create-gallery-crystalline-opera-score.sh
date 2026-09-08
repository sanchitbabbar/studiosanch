#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
build_dir="/private/tmp/sanch-gallery-crystalline-opera"
duration="68.25"

mkdir -p "$build_dir"

# Original crystalline fashion score: controlled sub, micro-percussion and distant operatic harmony.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "sine=frequency=43.65:sample_rate=48000:duration=$duration" \
  -f lavfi -i "sine=frequency=65.41:sample_rate=48000:duration=$duration" \
  -f lavfi -i "anoisesrc=color=white:sample_rate=48000:duration=$duration" \
  -f lavfi -i "anoisesrc=color=white:sample_rate=48000:duration=$duration" \
  -f lavfi -i "sine=frequency=174.61:sample_rate=48000:duration=$duration" \
  -f lavfi -i "sine=frequency=220.00:sample_rate=48000:duration=$duration" \
  -f lavfi -i "sine=frequency=261.63:sample_rate=48000:duration=$duration" \
  -filter_complex "[0:a]volume='0.24*(0.62+0.38*pow(max(0,cos(PI*mod(t,3.2)/3.2)),10))':eval=frame,lowpass=f=78[sub];[1:a]volume='0.12*(0.40+0.60*pow(max(0,cos(PI*mod(t-0.8,1.6)/1.6)),14))':eval=frame,lowpass=f=118[bass];[2:a]highpass=f=6800,lowpass=f=14500,volume='0.052*pow(max(0,cos(2*PI*(t-0.04)/0.40)),34)':eval=frame[crystal];[3:a]highpass=f=1800,lowpass=f=4800,volume='0.030*pow(max(0,cos(2*PI*(t-0.23)/1.60)),44)':eval=frame[snap];[4:a]volume='0.030*(0.58+0.42*sin(2*PI*t/21))':eval=frame[o1];[5:a]volume='0.022*(0.58+0.42*sin(2*PI*t/27+1.4))':eval=frame[o2];[6:a]volume='0.016*(0.58+0.42*sin(2*PI*t/31+2.2))':eval=frame[o3];[o1][o2][o3]amix=inputs=3:normalize=0,lowpass=f=1250,aecho=0.82:0.46:780|1420|2240:0.13|0.09|0.055[opera];[sub][bass][crystal][snap][opera]amix=inputs=5:normalize=0,highpass=f=24,afade=t=in:st=0:d=1.8,afade=t=out:st=63.5:d=4.75,alimiter=limit=0.78[score]" \
  -map "[score]" -c:a pcm_s24le "$build_dir/score.wav"

ffmpeg -hide_banner -loglevel error -y -i "$build_dir/score.wav" \
  -af "volume=11dB,alimiter=limit=0.82" -c:a aac -b:a 320k "$build_dir/score-master.m4a"

ffmpeg -hide_banner -loglevel error -y \
  -i "$output_dir/sanch-artbook-film-v10-editorial-cuts-master.mp4" \
  -i "$build_dir/score-master.m4a" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -shortest -movflags +faststart \
  "$output_dir/sanch-artbook-film-v16-gallery-cut-crystalline-opera-master.mp4"

ffmpeg -hide_banner -loglevel error -y \
  -i "$output_dir/sanch-artbook-film-v10-editorial-cuts-vertical.mp4" \
  -i "$build_dir/score-master.m4a" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -shortest -movflags +faststart \
  "$output_dir/sanch-artbook-film-v16-gallery-cut-crystalline-opera-vertical.mp4"

ffmpeg -hide_banner -loglevel error -y \
  -i "$output_dir/sanch-artbook-film-v16-gallery-cut-crystalline-opera-master.mp4" \
  -t 12 -c:v libx264 -preset medium -crf 17 -c:a aac -b:a 192k -movflags +faststart \
  "$output_dir/sanch-artbook-film-v16-gallery-cut-crystalline-opera-preview.mp4"

echo "Created:"
ls -lh "$output_dir"/sanch-artbook-film-v16-*.mp4
