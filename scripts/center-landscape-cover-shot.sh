#!/bin/zsh
set -euo pipefail

source_image="/Users/sanchitbabbar/Documents/Sanchit Babbar/Photoshoots/Book - By Benjamin /associated-lime/SANCH_1.JPG"
clip_dir="/private/tmp/sanch-artbook-film-v10/landscape"
output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
build_dir="/private/tmp/sanch-centered-landscape-cover"
fps=24

mkdir -p "$build_dir"

# Keep the cover's optical center fixed. The 72 px correction is applied on the
# double-resolution working canvas and resolves to a restrained 36 px shift.
ffmpeg -hide_banner -loglevel error -y -loop 1 -i "$source_image" \
  -filter_complex "[0:v]scale=3840:2160:force_original_aspect_ratio=increase:flags=lanczos,crop=3840:2160,zoompan=z='1.035+0.00125*on':x='(iw-iw/zoom)/2+72':y='(ih-ih/zoom)/2':d=91:s=1920x1080:fps=$fps,curves=r='0/0 0.025/0 0.55/0.505 1/0.865':g='0/0 0.025/0 0.55/0.502 1/0.86':b='0/0 0.025/0 0.55/0.498 1/0.85',eq=contrast=1.02:brightness=0.006,format=yuv420p" \
  -t 3.8 -an -c:v libx264 -preset medium -crf 16 -movflags +faststart "$build_dir/clip_05.mp4"

mv "$build_dir/clip_05.mp4" "$clip_dir/clip_05.mp4"

: > "$build_dir/full-concat.txt"
for position in {1..18}; do
  print -r -- "file '$clip_dir/clip_$(printf '%02d' "$position").mp4'" >> "$build_dir/full-concat.txt"
done

ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$build_dir/full-concat.txt" -c copy "$build_dir/full-picture.mp4"

# Preserve the already approved common soundtrack and closing signature.
ffmpeg -hide_banner -loglevel error -y \
  -i "$build_dir/full-picture.mp4" -i "$output_dir/sanch-artbook-film-v10-editorial-cuts-master.mp4" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -shortest -movflags +faststart "$build_dir/master.mp4"

mv "$build_dir/master.mp4" "$output_dir/sanch-artbook-film-v10-editorial-cuts-master.mp4"

ffmpeg -hide_banner -loglevel error -y \
  -i "$build_dir/full-picture.mp4" -i "$output_dir/comparison-02-editorial-high-fashion-landscape.mp4" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -shortest -movflags +faststart "$build_dir/comparison.mp4"

mv "$build_dir/comparison.mp4" "$output_dir/comparison-02-editorial-high-fashion-landscape.mp4"

echo "Centered landscape cover clip and rebuilt full landscape exports."
