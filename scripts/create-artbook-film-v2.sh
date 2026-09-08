#!/bin/zsh
set -euo pipefail

source_dir="/Users/sanchitbabbar/Documents/Sanchit Babbar/Photoshoots/Book - By Benjamin /associated-lime"
output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
build_root="/private/tmp/sanch-artbook-film-v2"
font_file="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/public/fonts/Fontspring-DEMO-balgin-regularexpanded.otf"
fps=24
clip_duration=2.4

mkdir -p "$output_dir" "$build_root"

# Product details recur like visual punctuation; portraits and drawings form the central story.
sequence=(12 11 13 16 1 2 3 4 5 6 7 8 14 15 9 10 16 13 11 12 1 14)

render_edit() {
  local width="$1"
  local height="$2"
  local name="$3"
  local build_dir="$build_root/$name"
  mkdir -p "$build_dir"

  for position in {1..22}; do
    local image_number="${sequence[$position]}"
    local input="$source_dir/SANCH_${image_number}.JPG"
    local output="$build_dir/clip_$(printf '%02d' "$position").mp4"
    local mode=$(( (position - 1) % 4 ))
    local zoom="1.055+0.00078*on"
    local x_expr="(iw-iw/zoom)/2"
    local y_expr="(ih-ih/zoom)/2"

    case "$mode" in
      0) x_expr="(iw-iw/zoom)*(on/57)" ;;
      1) x_expr="(iw-iw/zoom)*(1-on/57)" ;;
      2) y_expr="(ih-ih/zoom)*(on/57)" ;;
      3) x_expr="(iw-iw/zoom)*(on/57)"; y_expr="(ih-ih/zoom)*(1-on/57)" ;;
    esac

    ffmpeg -hide_banner -loglevel error -y -loop 1 -i "$input" \
      -vf "scale=$width:$height:force_original_aspect_ratio=increase:flags=lanczos,crop=$width:$height,zoompan=z='$zoom':x='$x_expr':y='$y_expr':d=58:s=${width}x${height}:fps=$fps,eq=contrast=1.04:brightness=-0.008,noise=alls=1.8:allf=t,fade=t=in:st=0:d=0.08:color=black,fade=t=out:st=2.30:d=0.10:color=black,format=yuv420p" \
      -t "$clip_duration" -an -c:v libx264 -preset medium -crf 16 -movflags +faststart "$output"
  done

  : > "$build_dir/concat.txt"
  for position in {1..22}; do
    print -r -- "file '$build_dir/clip_$(printf '%02d' "$position").mp4'" >> "$build_dir/concat.txt"
  done
  ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$build_dir/concat.txt" -c copy "$build_dir/picture.mp4"

  ffmpeg -hide_banner -loglevel error -y -f lavfi -i "color=c=#060606:s=${width}x${height}:r=$fps:d=3.2" \
    -vf "drawtext=fontfile='$font_file':text='S A N C H':fontcolor=#f3f1ec:fontsize=$((width / 25)):x=(w-text_w)/2:y=(h-text_h)/2-18,drawtext=fontfile='$font_file':text='D E   L A   C O U L E U R   D U   N O I R   E T   B L A N C':fontcolor=#aaa7a0:fontsize=$((width / 110)):x=(w-text_w)/2:y=(h-text_h)/2+$((height / 12)),fade=t=in:st=0:d=0.55:color=black,fade=t=out:st=2.55:d=0.65:color=black,format=yuv420p" \
    -an -c:v libx264 -preset medium -crf 16 "$build_dir/end-card.mp4"

  print -r -- "file '$build_dir/picture.mp4'" > "$build_dir/final-concat.txt"
  print -r -- "file '$build_dir/end-card.mp4'" >> "$build_dir/final-concat.txt"
  ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$build_dir/final-concat.txt" -c copy "$build_dir/silent.mp4"
}

render_edit 1920 1080 landscape
render_edit 1080 1920 vertical

# Darker, more rhythmic original soundscape: sub-bass architecture, paper air and four restrained accents.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "sine=frequency=46.25:sample_rate=48000:duration=58" \
  -f lavfi -i "sine=frequency=69.30:sample_rate=48000:duration=58" \
  -f lavfi -i "anoisesrc=color=pink:sample_rate=48000:duration=58" \
  -f lavfi -i "sine=frequency=523.25:sample_rate=48000:duration=0.7" \
  -f lavfi -i "sine=frequency=783.99:sample_rate=48000:duration=0.45" \
  -filter_complex "[0:a]volume=0.035,lowpass=f=95[a0];[1:a]volume='0.012*(0.5+0.5*sin(2*PI*t/13))':eval=frame,lowpass=f=150[a1];[2:a]highpass=f=500,lowpass=f=5000,volume='0.010*(0.25+0.75*abs(sin(PI*t/4.8)))':eval=frame[air];[3:a]volume=0.022,afade=t=out:st=0.05:d=0.6,adelay=9800|9800[p1];[4:a]volume=0.017,afade=t=out:st=0.04:d=0.4,adelay=23800|23800[p2];[a0][a1][air][p1][p2]amix=inputs=5:normalize=0,afade=t=in:st=0:d=1.5,afade=t=out:st=53:d=4,alimiter=limit=0.72[a]" \
  -map "[a]" -c:a aac -b:a 256k "$build_root/soundtrack.m4a"

ffmpeg -hide_banner -loglevel error -y -i "$build_root/landscape/silent.mp4" -i "$build_root/soundtrack.m4a" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart \
  "$output_dir/sanch-artbook-film-v2-cinematic-master.mp4"

ffmpeg -hide_banner -loglevel error -y -i "$build_root/vertical/silent.mp4" -i "$build_root/soundtrack.m4a" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart \
  "$output_dir/sanch-artbook-film-v2-vertical.mp4"

ffmpeg -hide_banner -loglevel error -y -i "$output_dir/sanch-artbook-film-v2-cinematic-master.mp4" \
  -t 12 -an -c:v libx264 -preset medium -crf 17 -movflags +faststart \
  "$output_dir/sanch-artbook-film-v2-website-loop.mp4"

echo "Created:"
ls -lh "$output_dir"/sanch-artbook-film-v2-*.mp4
