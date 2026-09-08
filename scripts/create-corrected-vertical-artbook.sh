#!/bin/zsh
set -euo pipefail

source_dir="/Users/sanchitbabbar/Documents/Sanchit Babbar/Photoshoots/Book - By Benjamin /associated-lime"
output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
source_clips="/private/tmp/sanch-artbook-film-v10/vertical"
build_dir="/private/tmp/sanch-artbook-film-v33-vertical"
fps=24
clip_duration=3.8
sequence=(12 11 13 16 1 2 3 4 5 6 7 8 14 15 9 16 12 10)

mkdir -p "$build_dir"

for position in {1..18}; do
  image_number="${sequence[$position]}"
  output="$build_dir/clip_$(printf '%02d' "$position").mp4"

  if (( image_number == 1 || (image_number >= 2 && image_number <= 9) )); then
    input="$source_dir/SANCH_${image_number}.JPG"
    zoom="1.0+0.00090*on"
    (( image_number >= 2 )) && zoom="max(1.0,1.13-0.00145*on)"

    ffmpeg -hide_banner -loglevel error -y -loop 1 -i "$input" \
      -filter_complex "[0:v]split=2[bgsrc][fgsrc];[bgsrc]crop=iw:100:0:0,scale=2160:3840:flags=lanczos,boxblur=120:2[bg];[fgsrc]scale=2160:-2:flags=lanczos,format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='255*min(1,min(Y/240,(H-Y)/240))'[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,zoompan=z='$zoom':x='trunc(((iw-iw/zoom)/2)/2)*2':y='trunc(((ih-ih/zoom)/2)/2)*2':d=91:s=2160x3840:fps=$fps,scale=1080:1920:flags=lanczos,curves=r='0/0 0.025/0 0.55/0.505 1/0.865':g='0/0 0.025/0 0.55/0.502 1/0.86':b='0/0 0.025/0 0.55/0.498 1/0.85',eq=contrast=1.02:brightness=0.006,format=yuv420p" \
      -t "$clip_duration" -an -c:v libx264 -preset medium -crf 16 -movflags +faststart "$output"
  else
    cp "$source_clips/clip_$(printf '%02d' "$position").mp4" "$output"
  fi
done

: > "$build_dir/concat.txt"
for position in {1..18}; do
  print -r -- "file '$build_dir/clip_$(printf '%02d' "$position").mp4'" >> "$build_dir/concat.txt"
done

ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$build_dir/concat.txt" -c copy "$build_dir/picture.mp4"

ffmpeg -hide_banner -loglevel error -y \
  -i "$build_dir/picture.mp4" \
  -i "$output_dir/sanch-artbook-film-v28-gallery-cut-pen-open-sign-close-vertical.mp4" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -shortest -movflags +faststart \
  "$output_dir/sanch-artbook-film-v33-vertical-stabilized-full-spreads.mp4"

echo "Created:"
ls -lh "$output_dir/sanch-artbook-film-v33-vertical-stabilized-full-spreads.mp4"
