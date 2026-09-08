#!/bin/zsh
set -euo pipefail

project_root="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch"
source_dir="$project_root/public/images/boutique/artbook-gallery"
output_dir="$project_root/artbook-film"
build_dir="/private/tmp/sanch-open-artbook-glimpses-20s"

fps=24
width=1920
height=1080
shot_duration=2.5
frames=60

mkdir -p "$output_dir" "$build_dir/clips"

# One appearance per open spread. No covers, binding shots, or repeated photographs.
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

  # Eight different camera gestures. Curves are partial arcs, never closed loops.
  case "$position" in
    1) # Low lateral pass: left portrait to right portrait.
      zoom="1.34"; x="(iw-iw/zoom)*(0.05+0.90*on/${frames})"; y="(ih-ih/zoom)*(0.62-0.18*sin(PI*on/${frames}))" ;;
    2) # Descending crescent around the black page and figure.
      zoom="1.42"; x="(iw-iw/zoom)*(0.82-0.54*on/${frames})"; y="(ih-ih/zoom)*(0.10+0.66*on/${frames}-0.18*sin(PI*on/${frames}))" ;;
    3) # Architectural diagonal: wall texture through the artist's hands.
      zoom="1.31"; x="(iw-iw/zoom)*(0.06+0.67*on/${frames})"; y="(ih-ih/zoom)*(0.12+0.50*on/${frames})" ;;
    4) # Spine orbit: rise from lower gutter into the hat portrait.
      zoom="1.48"; x="(iw-iw/zoom)*(0.48+0.30*sin(PI*on/(2*${frames})))"; y="(ih-ih/zoom)*(0.82-0.68*on/${frames})" ;;
    5) # Couture sweep: trace the drawn hem in a shallow upward arc.
      zoom="1.38"; x="(iw-iw/zoom)*(0.03+0.91*on/${frames})"; y="(ih-ih/zoom)*(0.71-0.32*sin(PI*on/${frames}))" ;;
    6) # Vertical parallax: descend through concrete geometry to the figure.
      zoom="1.36"; x="(iw-iw/zoom)*(0.78-0.22*sin(PI*on/(2*${frames})))"; y="(ih-ih/zoom)*(0.04+0.78*on/${frames})" ;;
    7) # Reverse fashion tracking shot across face and negative space.
      zoom="1.44"; x="(iw-iw/zoom)*(0.92-0.84*on/${frames})"; y="(ih-ih/zoom)*(0.34+0.24*sin(PI*on/${frames}))" ;;
    8) # Final reveal: typography to the illustrated silhouette, easing wider once.
      zoom="max(1.12,1.34-0.0037*on)"; x="(iw-iw/zoom)*(0.18+0.58*on/${frames})"; y="(ih-ih/zoom)*(0.54-0.10*sin(PI*on/${frames}))" ;;
  esac

  # A subtle light traversal is tied to the moving camera, giving depth without
  # adding any imagery that is not already present in the open-book photograph.
  light_x="W*(0.10+0.80*N/${frames})"

  ffmpeg -hide_banner -loglevel error -y -loop 1 -i "$image" \
    -filter_complex "[0:v]scale=2688:1512:force_original_aspect_ratio=increase:flags=lanczos,crop=2688:1512,zoompan=z='$zoom':x='$x':y='$y':d=${frames}:s=${width}x${height}:fps=$fps,eq=contrast=1.075:brightness=-0.018:saturation=0.06,curves=all='0/0 0.06/0.035 0.47/0.49 0.91/0.955 1/1',noise=alls=0.72:allf=t+u,format=rgba[base];color=c=white@0.0:s=${width}x${height}:r=$fps:d=$shot_duration,format=rgba,geq=r='255':g='255':b='255':a='18*exp(-pow((X-${light_x})/310,2))'[light];[base][light]overlay=0:0:format=auto,fade=t=in:st=0:d=0.065,fade=t=out:st=2.435:d=0.065,format=yuv420p[out]" \
    -map "[out]" -t "$shot_duration" -an -c:v libx264 -preset slow -crf 14 -movflags +faststart "$output"
done

: > "$build_dir/concat.txt"
for clip in "$build_dir"/clips/clip_*.mp4; do
  print -r -- "file '$clip'" >> "$build_dir/concat.txt"
done
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$build_dir/concat.txt" -c copy "$build_dir/picture.mp4"

# Luxury editorial score: continuous sub architecture, distant bowed harmonics,
# and silk-like air. No clicks, beat grid, or repeated transition sound.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "sine=frequency=41.20:sample_rate=48000:duration=20" \
  -f lavfi -i "sine=frequency=61.74:sample_rate=48000:duration=20" \
  -f lavfi -i "sine=frequency=164.81:sample_rate=48000:duration=20" \
  -f lavfi -i "anoisesrc=color=pink:sample_rate=48000:duration=20" \
  -filter_complex "[0:a]volume='0.040*(0.78+0.22*sin(2*PI*t/17))':eval=frame,lowpass=f=88[sub];[1:a]volume='0.015*(0.48+0.52*sin(2*PI*t/11+1.2))':eval=frame,lowpass=f=145[bow];[2:a]volume='0.0045*(0.5+0.5*sin(2*PI*t/9))':eval=frame,lowpass=f=520[harm];[3:a]highpass=f=700,lowpass=f=6200,volume='0.008*(0.35+0.65*sin(PI*t/20))':eval=frame[air];[sub][bow][harm][air]amix=inputs=4:normalize=0,aecho=0.8:0.66:900|1450:0.13|0.07,afade=t=in:st=0:d=1.8,afade=t=out:st=17.2:d=2.8,alimiter=limit=0.68[a]" \
  -map "[a]" -c:a aac -b:a 256k "$build_dir/soundtrack.m4a"

final="$output_dir/sanch-open-artbook-fashion-glimpses-20s.mp4"
ffmpeg -hide_banner -loglevel error -y -i "$build_dir/picture.mp4" -i "$build_dir/soundtrack.m4a" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -t 20 -movflags +faststart "$final"

ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_name,width,height,r_frame_rate \
  -of default=noprint_wrappers=1 "$final"
print -r -- "Created: $final"
