#!/bin/zsh
set -euo pipefail

project_root="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch"
source_dir="$project_root/public/images/boutique/artbook-gallery"
output_dir="$project_root/artbook-film"
build_dir="/private/tmp/sanch-open-artbook-instagram-editorial"

fps=24
width=1080
height=1920
frames=36

mkdir -p "$output_dir" "$build_dir/clips"
rm -f "$build_dir"/clips/*.mp4 "$build_dir/concat.txt"

# Open-book photographs only: never use the cover, binding, or closed book.
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

# Two distinct static editorial framings per spread. Every crop fills the
# vertical canvas; no letterboxing, blur, zoom, pan, or simulated camera shake.
open_positions=(0.12 0.08 0.16 0.42 0.10 0.12 0.08 0.06)
detail_positions=(0.66 0.72 0.62 0.76 0.68 0.70 0.58 0.78)

: > "$build_dir/concat.txt"
clip_index=1

for position in {1..8}; do
  image="${images[$position]}"

  for treatment in open detail; do
    if [[ "$treatment" == "open" ]]; then
      crop_position="${open_positions[$position]}"
      scale_height=1920
    else
      crop_position="${detail_positions[$position]}"
      scale_height=2360
    fi

    output="$build_dir/clips/clip_$(printf '%02d' "$clip_index").mp4"

    ffmpeg -hide_banner -loglevel error -y -loop 1 -i "$image" \
      -vf "scale=-1:${scale_height}:flags=lanczos,crop=${width}:${height}:x='(iw-${width})*${crop_position}':y='(ih-${height})/2',eq=contrast=1.045:brightness=-0.006:saturation=0.12,curves=all='0/0 0.06/0.045 0.50/0.51 0.94/0.965 1/1',noise=alls=1.15:allf=t+u,fade=t=in:st=0:d=0.055,fade=t=out:st=1.445:d=0.055,format=yuv420p" \
      -frames:v "$frames" -r "$fps" -an -c:v libx264 -profile:v main -level:v 4.1 \
      -preset slow -crf 14 -pix_fmt yuv420p -movflags +faststart "$output"

    print -r -- "file '$output'" >> "$build_dir/concat.txt"
    clip_index=$((clip_index + 1))
  done
done

# Sixteen equally timed 1.5-second editorial plates = exactly 24 seconds.
final="$output_dir/sanch-open-artbook-instagram-editorial-24s.mp4"
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$build_dir/concat.txt" \
  -an -vf "setpts=N/(${fps}*TB),fps=${fps},format=yuv420p" -frames:v 576 \
  -c:v libx264 -profile:v main -level:v 4.1 -preset slow -crf 14 \
  -pix_fmt yuv420p -movflags +faststart "$final"

ffprobe -v error -show_entries format=duration,size \
  -show_entries stream=codec_name,profile,width,height,pix_fmt,r_frame_rate \
  -of default=noprint_wrappers=1 "$final"
print -r -- "Created: $final"
