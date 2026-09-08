#!/bin/zsh
set -euo pipefail

source_dir="/Users/sanchitbabbar/Documents/Sanchit Babbar/Photoshoots/Book - By Benjamin /associated-lime"
output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
build_root="/private/tmp/sanch-artbook-film-v6"
font_file="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/public/fonts/Fontspring-DEMO-balgin-regularexpanded.otf"
fps=24
clip_duration=3.8

mkdir -p "$output_dir" "$build_root"

# Product details recur like visual punctuation; portraits and drawings form the central story.
sequence=(12 11 13 16 1 2 3 4 5 6 7 8 14 15 9 10 16 12)

render_edit() {
  local width="$1"
  local height="$2"
  local name="$3"
  local build_dir="$build_root/$name"
    local render_width=$((width * 2))
    local render_height=$((height * 2))
    local foreground_width=$((render_width * 9 / 10))
    local foreground_height=$((render_height * 9 / 10))
  mkdir -p "$build_dir"

  for position in {1..18}; do
    local image_number="${sequence[$position]}"
    local input="$source_dir/SANCH_${image_number}.JPG"
    local output="$build_dir/clip_$(printf '%02d' "$position").mp4"
    local mode=$(( (position - 1) % 4 ))
    local zoom="1.22"
    local x_expr="(iw-iw/zoom)/2"
    local y_expr="(ih-ih/zoom)/2"
    local pre_filter="scale=$render_width:$render_height:force_original_aspect_ratio=increase:flags=lanczos,crop=$render_width:$render_height"

    # Open spreads reveal themselves from detail to complete composition.
    # Product views travel much farther across edges, spine, binding and paper surface.
    if (( image_number == 10 )); then
      # The standing-book portrait must resolve to the complete physical object.
      pre_filter="scale=$width:$height:force_original_aspect_ratio=decrease:flags=lanczos,pad=$width:$height:(ow-iw)/2:(oh-ih)/2:color=white"
      zoom="max(1.0,1.09-0.001*on)"
      x_expr="(iw-iw/zoom)/2"
      y_expr="(ih-ih/zoom)/2"
    elif (( image_number >= 2 && image_number <= 9 )); then
      zoom="max(1.015,1.31-0.00325*on)"
      x_expr="(iw-iw/zoom)/2"
      y_expr="(ih-ih/zoom)/2"
    elif (( image_number == 1 )); then
      zoom="1.035+0.00125*on"
    else
      case "$mode" in
        0) x_expr="(iw-iw/zoom)*(on/90)" ;;
        1) x_expr="(iw-iw/zoom)*(1-on/90)" ;;
        2) y_expr="(ih-ih/zoom)*(on/90)" ;;
        3) x_expr="(iw-iw/zoom)*(on/90)"; y_expr="(ih-ih/zoom)*(1-on/90)" ;;
      esac
    fi

    if (( image_number == 10 )); then
      local feather=240
      [[ "$name" == "vertical" ]] && feather=400
      ffmpeg -hide_banner -loglevel error -y -loop 1 -i "$input" \
        -filter_complex "[0:v]split[bg0][fg0];[bg0]scale=$render_width:$render_height:force_original_aspect_ratio=increase:flags=lanczos,crop=$render_width:$render_height,gblur=sigma=85,eq=contrast=0.42:brightness=0.12[bg];[fg0]scale=$foreground_width:$foreground_height:force_original_aspect_ratio=decrease:flags=lanczos,format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='255*min(1,min(min(X/$feather,(W-X)/$feather),min(Y/$feather,(H-Y)/$feather)))'[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2:format=auto,zoompan=z='$zoom':x='$x_expr':y='$y_expr':d=91:s=${width}x${height}:fps=$fps,eq=contrast=1.04:brightness=-0.008,fade=t=in:st=0:d=0.32:color=black,fade=t=out:st=3.44:d=0.36:color=black,format=yuv420p[out]" \
        -map "[out]" -t "$clip_duration" -an -c:v libx264 -preset medium -crf 16 -movflags +faststart "$output"
    else
      ffmpeg -hide_banner -loglevel error -y -loop 1 -i "$input" \
        -vf "$pre_filter,zoompan=z='$zoom':x='$x_expr':y='$y_expr':d=91:s=${width}x${height}:fps=$fps,eq=contrast=1.04:brightness=-0.008,fade=t=in:st=0:d=0.32:color=black,fade=t=out:st=3.44:d=0.36:color=black,format=yuv420p" \
        -t "$clip_duration" -an -c:v libx264 -preset medium -crf 16 -movflags +faststart "$output"
    fi
  done

  : > "$build_dir/concat.txt"
  for position in {1..18}; do
    print -r -- "file '$build_dir/clip_$(printf '%02d' "$position").mp4'" >> "$build_dir/concat.txt"
  done
  ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$build_dir/concat.txt" -c copy "$build_dir/picture.mp4"

  ffmpeg -hide_banner -loglevel error -y -f lavfi -i "color=c=#060606:s=${width}x${height}:r=$fps:d=3.8" \
    -vf "drawtext=fontfile='$font_file':text='S A N C H':fontcolor=#f3f1ec:fontsize=$((width / 25)):x=(w-text_w)/2:y=(h-text_h)/2-18,drawtext=fontfile='$font_file':text='D E   L A   C O U L E U R   D U   N O I R   E T   B L A N C':fontcolor=#aaa7a0:fontsize=$((width / 110)):x=(w-text_w)/2:y=(h-text_h)/2+$((height / 12)),fade=t=in:st=0:d=0.8:color=black,fade=t=out:st=2.95:d=0.85:color=black,format=yuv420p" \
    -an -c:v libx264 -preset medium -crf 16 "$build_dir/end-card.mp4"

  print -r -- "file '$build_dir/picture.mp4'" > "$build_dir/final-concat.txt"
  print -r -- "file '$build_dir/end-card.mp4'" >> "$build_dir/final-concat.txt"
  ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$build_dir/final-concat.txt" -c copy "$build_dir/silent.mp4"
}

render_edit 1920 1080 landscape
render_edit 1080 1920 vertical

# Darker, more rhythmic original soundscape: sub-bass architecture, paper air and four restrained accents.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "sine=frequency=46.25:sample_rate=48000:duration=74" \
  -f lavfi -i "sine=frequency=69.30:sample_rate=48000:duration=74" \
  -f lavfi -i "anoisesrc=color=pink:sample_rate=48000:duration=74" \
  -f lavfi -i "sine=frequency=523.25:sample_rate=48000:duration=0.7" \
  -f lavfi -i "sine=frequency=783.99:sample_rate=48000:duration=0.45" \
  -filter_complex "[0:a]volume=0.035,lowpass=f=95[a0];[1:a]volume='0.012*(0.5+0.5*sin(2*PI*t/16))':eval=frame,lowpass=f=150[a1];[2:a]highpass=f=500,lowpass=f=5000,volume='0.010*(0.25+0.75*abs(sin(PI*t/7.6)))':eval=frame[air];[3:a]volume=0.022,afade=t=out:st=0.05:d=0.6,adelay=14800|14800[p1];[4:a]volume=0.017,afade=t=out:st=0.04:d=0.4,adelay=38200|38200[p2];[a0][a1][air][p1][p2]amix=inputs=5:normalize=0,afade=t=in:st=0:d=2.0,afade=t=out:st=68:d=5,alimiter=limit=0.72[a]" \
  -map "[a]" -c:a aac -b:a 256k "$build_root/soundtrack.m4a"

ffmpeg -hide_banner -loglevel error -y -i "$build_root/landscape/silent.mp4" -i "$build_root/soundtrack.m4a" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart \
  "$output_dir/sanch-artbook-film-v6-blended-gallery-master.mp4"

ffmpeg -hide_banner -loglevel error -y -i "$build_root/vertical/silent.mp4" -i "$build_root/soundtrack.m4a" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart \
  "$output_dir/sanch-artbook-film-v6-blended-gallery-vertical.mp4"

ffmpeg -hide_banner -loglevel error -y -i "$output_dir/sanch-artbook-film-v6-blended-gallery-master.mp4" \
  -t 12 -an -c:v libx264 -preset medium -crf 17 -movflags +faststart \
  "$output_dir/sanch-artbook-film-v6-blended-gallery-website-loop.mp4"

echo "Created:"
ls -lh "$output_dir"/sanch-artbook-film-v6-*.mp4
