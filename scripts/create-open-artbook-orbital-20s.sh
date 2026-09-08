#!/bin/zsh
set -euo pipefail

project_root="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch"
source_dir="$project_root/public/images/boutique/artbook-gallery"
output_dir="$project_root/artbook-film"
build_dir="/private/tmp/sanch-open-artbook-orbital-20s"

fps=24
width=1920
height=1080
shot_duration=2.5
frames=60

mkdir -p "$output_dir" "$build_dir/clips"

# Every open spread appears exactly once.
images=(
  "$source_dir/portrait-spread.jpg"
  "$source_dir/spread-02.jpg"
  "$source_dir/atelier-spread.jpg"
  "$source_dir/spread-04.jpg"
  "$source_dir/sketch-spread.jpg"
  "$source_dir/spread-05.jpg"
  "$source_dir/spread-07.jpg"
  "$source_dir/spread-08.jpg"
)

for position in {1..8}; do
  image="${images[$position]}"
  output="$build_dir/clips/clip_$(printf '%02d' "$position").mp4"
  phase=$(awk -v n="$position" 'BEGIN { printf "%.6f", (n-1)*0.785398 }')

  # A constant-distance elliptical orbit across the open spread. The image never
  # performs the familiar push-in / pull-out; motion travels around the page.
  x_expr="iw/2-(iw/zoom/2)+72*cos(2*PI*on/${frames}+${phase})"
  y_expr="ih/2-(ih/zoom/2)+42*sin(2*PI*on/${frames}+${phase})"
  roll_expr="0.0065*sin(2*PI*t/${shot_duration}+${phase})"

  ffmpeg -hide_banner -loglevel error -y -loop 1 -i "$image" \
    -vf "scale=2520:1418:force_original_aspect_ratio=increase:flags=lanczos,crop=2520:1418,zoompan=z='1.18':x='$x_expr':y='$y_expr':d=${frames}:s=2048x1152:fps=$fps,rotate='$roll_expr':ow=2048:oh=1152:c=white@1:bilinear=1,crop=${width}:${height},eq=contrast=1.055:brightness=-0.012:saturation=0.08,curves=all='0/0 0.055/0.038 0.48/0.50 0.93/0.965 1/1',noise=alls=0.85:allf=t+u,fade=t=in:st=0:d=0.09,fade=t=out:st=2.41:d=0.09,format=yuv420p" \
    -t "$shot_duration" -an -c:v libx264 -preset slow -crf 14 -movflags +faststart "$output"
done

: > "$build_dir/concat.txt"
for clip in "$build_dir"/clips/clip_*.mp4; do
  print -r -- "file '$clip'" >> "$build_dir/concat.txt"
done

ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$build_dir/concat.txt" \
  -c copy "$build_dir/picture.mp4"

# Fluid, non-percussive original score: dark harmonic floor, evolving bowed tone,
# filtered silk air and two low cinematic swells. No metronomic clicks.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "sine=frequency=43.65:sample_rate=48000:duration=20" \
  -f lavfi -i "sine=frequency=65.41:sample_rate=48000:duration=20" \
  -f lavfi -i "sine=frequency=130.81:sample_rate=48000:duration=20" \
  -f lavfi -i "anoisesrc=color=brown:sample_rate=48000:duration=20" \
  -filter_complex "[0:a]volume='0.038*(0.72+0.28*sin(2*PI*t/10))':eval=frame,lowpass=f=95[a0];[1:a]volume='0.018*(0.48+0.52*sin(2*PI*t/13+0.7))':eval=frame,lowpass=f=180[a1];[2:a]volume='0.006*(0.5+0.5*sin(2*PI*t/7.5))':eval=frame,lowpass=f=420[a2];[3:a]highpass=f=380,lowpass=f=4200,volume='0.012*(0.35+0.65*abs(sin(PI*t/8)))':eval=frame[air];[a0][a1][a2][air]amix=inputs=4:normalize=0,aecho=0.8:0.72:650|1100:0.14|0.08,afade=t=in:st=0:d=1.5,afade=t=out:st=17.8:d=2.2,alimiter=limit=0.72[a]" \
  -map "[a]" -c:a aac -b:a 256k "$build_dir/soundtrack.m4a"

final="$output_dir/sanch-open-artbook-orbital-editorial-20s.mp4"
ffmpeg -hide_banner -loglevel error -y -i "$build_dir/picture.mp4" -i "$build_dir/soundtrack.m4a" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -t 20 -movflags +faststart "$final"

ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_name,width,height,r_frame_rate \
  -of default=noprint_wrappers=1 "$final"
print -r -- "Created: $final"
