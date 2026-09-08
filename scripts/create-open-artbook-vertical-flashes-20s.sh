#!/bin/zsh
set -euo pipefail

project_root="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch"
source_dir="$project_root/public/images/boutique/artbook-gallery"
output_dir="$project_root/artbook-film"
build_dir="/private/tmp/sanch-open-artbook-vertical-flashes-20s"

fps=24
width=1080
height=1920
image_frames=28
black_frames=2

mkdir -p "$output_dir" "$build_dir/clips"

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

# Every spread appears first as a complete gallery plate, then later as one
# tightly selected editorial detail. No image repeats consecutively.
detail_x=(120 1450 260 1380 820 1040 180 1420)

ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "color=c=black:s=${width}x${height}:r=$fps" \
  -frames:v "$black_frames" -an -c:v libx264 -preset slow -crf 10 -pix_fmt yuv420p \
  "$build_dir/clips/black.mp4"

clip_index=1
for round in {1..2}; do
  for image_position in {1..8}; do
    image="${images[$image_position]}"
    output="$build_dir/clips/image_$(printf '%02d' "$clip_index").mp4"
    if (( round == 1 )); then
      # Complete uncropped open-book photograph, centred with generous black space.
      filter="scale=1040:-1:flags=lanczos,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=#080808"
      c="1.10"; b="-0.010"
    else
      # One close detail per spread, always after all complete views have appeared.
      x="${detail_x[$image_position]}"
      filter="scale=-1:2304:flags=lanczos,crop=1296:2304:${x}:0,scale=${width}:${height}:flags=lanczos"
      c="1.16"; b="0.004"
    fi

    # Static photographic flashes: no pan, orbit, or zoom cycle.
    ffmpeg -hide_banner -loglevel error -y -loop 1 -i "$image" \
      -vf "${filter},eq=contrast=${c}:brightness=${b}:saturation=0.04,curves=all='0/0 0.045/0.025 0.48/0.50 0.92/0.97 1/1',noise=alls=0.55:allf=t+u,format=yuv420p" \
      -frames:v "$image_frames" -an -c:v libx264 -preset slow -crf 13 "$output"

    clip_index=$((clip_index + 1))
  done
done

: > "$build_dir/concat.txt"
for index in {1..16}; do
  print -r -- "file '$build_dir/clips/image_$(printf '%02d' "$index").mp4'" >> "$build_dir/concat.txt"
  print -r -- "file '$build_dir/clips/black.mp4'" >> "$build_dir/concat.txt"
done

final="$output_dir/sanch-open-artbook-vertical-fashion-flashes-20s.mp4"
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$build_dir/concat.txt" \
  -an -vf "setpts=N/(${fps}*TB),fps=${fps},format=yuv420p" -frames:v 480 \
  -c:v libx264 -preset slow -crf 13 -movflags +faststart "$final"

ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_name,width,height,r_frame_rate \
  -of default=noprint_wrappers=1 "$final"
print -r -- "Created: $final"
