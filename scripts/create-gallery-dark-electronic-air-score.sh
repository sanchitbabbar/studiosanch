#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
build_dir="/private/tmp/sanch-gallery-dark-electronic-air"
duration="68.25"

mkdir -p "$build_dir"

# Non-melodic couture soundscape: detuned low architecture and unequal long-form swells.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "aevalsrc=0.036*(sin(2*PI*41.20*t)+0.78*sin(2*PI*43.65*t)+0.18*sin(2*PI*82.40*t))*(0.48+0.30*sin(PI*t/37)*sin(PI*t/37)+0.22*sin(PI*(t+9)/23)*sin(PI*(t+9)/23)):s=48000:d=$duration" \
  -f lavfi -i "aevalsrc=0.017*(sin(2*PI*109.70*t)+0.73*sin(2*PI*111.15*t)+0.26*sin(2*PI*164.35*t))*(0.30+0.70*sin(PI*(t+4)/29)*sin(PI*(t+4)/29)):s=48000:d=$duration" \
  -f lavfi -i "aevalsrc=0.0055*(sin(2*PI*879.2*t)+0.62*sin(2*PI*887.7*t)+0.28*sin(2*PI*1317.4*t))*(0.25+0.75*sin(PI*(t+11)/41)*sin(PI*(t+11)/41)):s=48000:d=$duration" \
  -f lavfi -i "aevalsrc=0.025*(sin(2*PI*73.42*t)+0.38*sin(2*PI*110.13*t)):s=48000:d=16.4" \
  -f lavfi -i "aevalsrc=0.020*(sin(2*PI*55.00*t)+0.33*sin(2*PI*82.41*t)):s=48000:d=19.7" \
  -filter_complex "[0:a]highpass=f=25,lowpass=f=210,aecho=0.74:0.18:730:0.06,afade=t=in:st=0:d=4,afade=t=out:st=63:d=5.25[sub];[1:a]highpass=f=72,lowpass=f=620,aecho=0.80:0.25:970|1690:0.07|0.04,afade=t=in:st=0:d=6,afade=t=out:st=61:d=7.25[body];[2:a]highpass=f=620,lowpass=f=2100,aecho=0.84:0.34:1320|2380:0.09|0.045,afade=t=in:st=0:d=10,afade=t=out:st=57:d=11.25[air];[3:a]lowpass=f=410,afade=t=in:st=0:d=8.2,afade=t=out:st=10:d=6.4,adelay=13700|13700[swell1];[4:a]lowpass=f=360,afade=t=in:st=0:d=10.5,afade=t=out:st=12:d=7.7,adelay=42800|42800[swell2];[sub][body][air][swell1][swell2]amix=inputs=5:normalize=0,volume=8dB,alimiter=limit=0.78[score]" \
  -map "[score]" -c:a aac -b:a 320k "$build_dir/score-master.m4a"

for format in master vertical; do
  ffmpeg -hide_banner -loglevel error -y \
    -i "$output_dir/sanch-artbook-film-v10-editorial-cuts-${format}.mp4" \
    -i "$build_dir/score-master.m4a" \
    -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -shortest -movflags +faststart \
    "$output_dir/sanch-artbook-film-v21-gallery-cut-dark-electronic-air-${format}.mp4"
done

ffmpeg -hide_banner -loglevel error -y \
  -i "$output_dir/sanch-artbook-film-v21-gallery-cut-dark-electronic-air-master.mp4" \
  -t 32 -c:v libx264 -preset medium -crf 17 -c:a aac -b:a 192k -movflags +faststart \
  "$output_dir/sanch-artbook-film-v21-gallery-cut-dark-electronic-air-preview.mp4"

echo "Created:"
ls -lh "$output_dir"/sanch-artbook-film-v21-*.mp4
