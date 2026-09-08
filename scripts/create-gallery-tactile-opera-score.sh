#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
build_dir="/private/tmp/sanch-gallery-tactile-opera"
duration="68.25"

mkdir -p "$build_dir"

# Preserve the dark evolving background; add only sparse, asymmetrically placed tactile details.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "sine=frequency=43.65:sample_rate=48000:duration=$duration" \
  -f lavfi -i "sine=frequency=65.41:sample_rate=48000:duration=$duration" \
  -f lavfi -i "sine=frequency=174.61:sample_rate=48000:duration=$duration" \
  -f lavfi -i "sine=frequency=220.00:sample_rate=48000:duration=$duration" \
  -f lavfi -i "sine=frequency=261.63:sample_rate=48000:duration=$duration" \
  -f lavfi -i "anoisesrc=color=pink:sample_rate=48000:duration=0.82" \
  -f lavfi -i "anoisesrc=color=white:sample_rate=48000:duration=0.12" \
  -f lavfi -i "anoisesrc=color=white:sample_rate=48000:duration=0.36" \
  -filter_complex "[0:a]volume='0.22*(0.62+0.38*pow(sin(PI*t/18),2))':eval=frame,lowpass=f=78[sub];[1:a]volume='0.095*(0.55+0.45*pow(sin(PI*(t+3)/25),2))':eval=frame,lowpass=f=118[bass];[2:a]volume='0.036*(0.50+0.50*pow(sin(PI*t/24),2))':eval=frame[o1];[3:a]volume='0.026*(0.50+0.50*pow(sin(PI*(t+7)/31),2))':eval=frame[o2];[4:a]volume='0.019*(0.50+0.50*pow(sin(PI*(t+13)/37),2))':eval=frame[o3];[o1][o2][o3]amix=inputs=3:normalize=0,lowpass=f=1350,aecho=0.84:0.48:820|1510|2380:0.14|0.09|0.05[opera];[5:a]highpass=f=260,lowpass=f=4200,volume=0.032,afade=t=in:st=0:d=0.10,afade=t=out:st=0.30:d=0.52,asplit=2[p1][p2];[p1]adelay=18400|18400[paper1];[p2]volume=0.78,adelay=47700|47700[paper2];[6:a]highpass=f=620,lowpass=f=3100,volume=0.024,afade=t=out:st=0:d=0.11,asplit=3[f1][f2][f3];[f1]adelay=10900|10900[flash1];[f2]volume=0.82,adelay=39700|39700[flash2];[f3]volume=0.68,adelay=59100|59100[flash3];[7:a]highpass=f=1700,lowpass=f=6200,volume=0.013,afade=t=in:st=0:d=0.06,afade=t=out:st=0.12:d=0.24,asplit=2[n1][n2];[n1]adelay=29300|29300[pen1];[n2]volume=0.72,adelay=64600|64600[pen2];[sub][bass][opera][paper1][paper2][flash1][flash2][flash3][pen1][pen2]amix=inputs=10:normalize=0,highpass=f=24,afade=t=in:st=0:d=2.1,afade=t=out:st=63.5:d=4.75,alimiter=limit=0.78[score]" \
  -map "[score]" -c:a pcm_s24le "$build_dir/score.wav"

ffmpeg -hide_banner -loglevel error -y -i "$build_dir/score.wav" \
  -af "volume=11dB,alimiter=limit=0.82" -c:a aac -b:a 320k "$build_dir/score-master.m4a"

for format in master vertical; do
  ffmpeg -hide_banner -loglevel error -y \
    -i "$output_dir/sanch-artbook-film-v10-editorial-cuts-${format}.mp4" \
    -i "$build_dir/score-master.m4a" \
    -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -shortest -movflags +faststart \
    "$output_dir/sanch-artbook-film-v18-gallery-cut-tactile-opera-${format}.mp4"
done

ffmpeg -hide_banner -loglevel error -y \
  -i "$output_dir/sanch-artbook-film-v18-gallery-cut-tactile-opera-master.mp4" \
  -t 32 -c:v libx264 -preset medium -crf 17 -c:a aac -b:a 192k -movflags +faststart \
  "$output_dir/sanch-artbook-film-v18-gallery-cut-tactile-opera-preview.mp4"

echo "Created:"
ls -lh "$output_dir"/sanch-artbook-film-v18-*.mp4
