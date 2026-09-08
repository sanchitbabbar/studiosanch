#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
build_dir="/private/tmp/sanch-gallery-couture-chamber"
duration="68.25"

mkdir -p "$build_dir"

# Original through-composed chamber ambience: harmonic movement, silence and no percussion.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "aevalsrc=0.070*(sin(2*PI*43.65*t)+0.34*sin(2*PI*87.30*t)+0.14*sin(2*PI*130.95*t))*(0.72+0.28*sin(PI*t/34)*sin(PI*t/34)):s=48000:d=$duration" \
  -f lavfi -i "aevalsrc=0.038*(sin(2*PI*146.83*t)+0.64*sin(2*PI*174.61*t)+0.48*sin(2*PI*220*t)+0.18*sin(2*PI*293.66*t)):s=48000:d=27" \
  -f lavfi -i "aevalsrc=0.038*(sin(2*PI*116.54*t)+0.62*sin(2*PI*146.83*t)+0.46*sin(2*PI*174.61*t)+0.16*sin(2*PI*233.08*t)):s=48000:d=29" \
  -f lavfi -i "aevalsrc=0.040*(sin(2*PI*130.81*t)+0.60*sin(2*PI*155.56*t)+0.44*sin(2*PI*196*t)+0.15*sin(2*PI*261.63*t)):s=48000:d=28.25" \
  -f lavfi -i "aevalsrc=0.025*(sin(2*PI*(220+0.75*sin(2*PI*4.7*t))*t)+0.38*sin(2*PI*(440+1.1*sin(2*PI*4.7*t))*t)+0.16*sin(2*PI*660*t)):s=48000:d=17" \
  -f lavfi -i "aevalsrc=0.022*(sin(2*PI*(196+0.62*sin(2*PI*4.4*t))*t)+0.35*sin(2*PI*(392+0.92*sin(2*PI*4.4*t))*t)+0.14*sin(2*PI*588*t)):s=48000:d=14" \
  -filter_complex "[0:a]lowpass=f=310,highpass=f=28,aecho=0.78:0.22:610:0.08,afade=t=in:st=0:d=3.2,afade=t=out:st=63.2:d=5.05[contra];[1:a]lowpass=f=1550,afade=t=in:st=0:d=4.0,afade=t=out:st=20:d=7.0[chord1];[2:a]lowpass=f=1450,afade=t=in:st=0:d=6.0,afade=t=out:st=21:d=8.0,adelay=19000|19000[chord2];[3:a]lowpass=f=1500,afade=t=in:st=0:d=7.0,afade=t=out:st=21:d=7.25,adelay=40000|40000[chord3];[4:a]highpass=f=155,lowpass=f=2300,aecho=0.86:0.42:980|1810|2870:0.16|0.10|0.055,afade=t=in:st=0:d=5.5,afade=t=out:st=11:d=6,adelay=23500|23500[voice1];[5:a]highpass=f=145,lowpass=f=2150,aecho=0.88:0.44:1120|2060|3180:0.15|0.09|0.05,afade=t=in:st=0:d=4.5,afade=t=out:st=9:d=5,adelay=51500|51500[voice2];[contra][chord1][chord2][chord3][voice1][voice2]amix=inputs=6:normalize=0,volume=5.5dB,alimiter=limit=0.80[score]" \
  -map "[score]" -c:a aac -b:a 320k "$build_dir/score-master.m4a"

for format in master vertical; do
  ffmpeg -hide_banner -loglevel error -y \
    -i "$output_dir/sanch-artbook-film-v10-editorial-cuts-${format}.mp4" \
    -i "$build_dir/score-master.m4a" \
    -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -shortest -movflags +faststart \
    "$output_dir/sanch-artbook-film-v19-gallery-cut-couture-chamber-${format}.mp4"
done

ffmpeg -hide_banner -loglevel error -y \
  -i "$output_dir/sanch-artbook-film-v19-gallery-cut-couture-chamber-master.mp4" \
  -t 32 -c:v libx264 -preset medium -crf 17 -c:a aac -b:a 192k -movflags +faststart \
  "$output_dir/sanch-artbook-film-v19-gallery-cut-couture-chamber-preview.mp4"

echo "Created:"
ls -lh "$output_dir"/sanch-artbook-film-v19-*.mp4
