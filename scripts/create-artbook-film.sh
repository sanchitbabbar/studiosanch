#!/bin/zsh
set -euo pipefail

source_dir="/Users/sanchitbabbar/Documents/Sanchit Babbar/Photoshoots/Book - By Benjamin /associated-lime"
output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
build_dir="/private/tmp/sanch-artbook-film-build"
font_file="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/public/fonts/Fontspring-DEMO-balgin-regularexpanded.otf"

mkdir -p "$output_dir" "$build_dir"

# Editorial sequence: object, persona, maker, illustrated woman, material close.
sequence=(1 11 12 13 2 3 4 5 6 7 8 9 14 15 16 10)
clip_duration="3.6"
fps="24"

for position in {1..16}; do
  image_number="${sequence[$position]}"
  input="$source_dir/SANCH_${image_number}.JPG"
  output="$build_dir/clip_$(printf '%02d' "$position").mp4"

  # Alternate extremely restrained inward and outward movements. Portraits never deform.
  if (( position % 2 == 0 )); then
    zoom="if(eq(on,0),1.028,max(zoom-0.00032,1.0))"
  else
    zoom="min(zoom+0.00032,1.028)"
  fi

  ffmpeg -hide_banner -loglevel error -y -loop 1 -i "$input" \
    -vf "scale=1920:1080:force_original_aspect_ratio=decrease:flags=lanczos,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=white,zoompan=z='$zoom':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=87:s=1920x1080:fps=$fps,fade=t=in:st=0:d=0.28:color=white,fade=t=out:st=3.28:d=0.32:color=white,format=yuv420p" \
    -t "$clip_duration" -an -c:v libx264 -preset medium -crf 16 -movflags +faststart "$output"
done

concat_file="$build_dir/concat.txt"
: > "$concat_file"
for position in {1..16}; do
  print -r -- "file '$build_dir/clip_$(printf '%02d' "$position").mp4'" >> "$concat_file"
done

ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$concat_file" -c copy "$build_dir/picture.mp4"

# Four-second gallery-white signature card.
ffmpeg -hide_banner -loglevel error -y -f lavfi -i "color=c=#f7f6f3:s=1920x1080:r=$fps:d=4" \
  -vf "drawtext=fontfile='$font_file':text='S A N C H':fontcolor=#111111:fontsize=74:x=(w-text_w)/2:y=(h-text_h)/2-24,drawtext=fontfile='$font_file':text='D E   L A   C O U L E U R   D U   N O I R   E T   B L A N C':fontcolor=#555555:fontsize=16:x=(w-text_w)/2:y=(h-text_h)/2+92,fade=t=in:st=0:d=0.8:color=white,fade=t=out:st=3.25:d=0.75:color=white,format=yuv420p" \
  -an -c:v libx264 -preset medium -crf 16 "$build_dir/end-card.mp4"

print -r -- "file '$build_dir/picture.mp4'" > "$build_dir/final-concat.txt"
print -r -- "file '$build_dir/end-card.mp4'" >> "$build_dir/final-concat.txt"
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$build_dir/final-concat.txt" -c copy "$build_dir/silent-master.mp4"

# Original restrained soundscape: low gallery drone, filtered paper texture and sparse glass-like tones.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "sine=frequency=55:sample_rate=48000:duration=62" \
  -f lavfi -i "sine=frequency=82.41:sample_rate=48000:duration=62" \
  -f lavfi -i "anoisesrc=color=pink:sample_rate=48000:duration=62" \
  -f lavfi -i "sine=frequency=659.25:sample_rate=48000:duration=0.8" \
  -f lavfi -i "sine=frequency=987.77:sample_rate=48000:duration=0.55" \
  -filter_complex "[0:a]volume=0.025,lowpass=f=110[a0];[1:a]volume='0.010*(0.55+0.45*sin(2*PI*t/17))':eval=frame,lowpass=f=180[a1];[2:a]highpass=f=350,lowpass=f=4200,volume='0.012*(0.35+0.65*abs(sin(PI*t/7.2)))':eval=frame[paper];[3:a]volume=0.018,afade=t=out:st=0.08:d=0.7,adelay=11200|11200[b1];[4:a]volume=0.014,afade=t=out:st=0.05:d=0.5,adelay=28600|28600[b2];[a0][a1][paper][b1][b2]amix=inputs=5:normalize=0,afade=t=in:st=0:d=2.5,afade=t=out:st=58:d=4,alimiter=limit=0.7[a]" \
  -map "[a]" -c:a aac -b:a 256k "$build_dir/soundtrack.m4a"

ffmpeg -hide_banner -loglevel error -y -i "$build_dir/silent-master.mp4" -i "$build_dir/soundtrack.m4a" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart \
  "$output_dir/sanch-artbook-film-master-1080p.mp4"

ffmpeg -hide_banner -loglevel error -y -i "$output_dir/sanch-artbook-film-master-1080p.mp4" \
  -vf "scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920" \
  -t 30 -c:v libx264 -preset medium -crf 18 -c:a aac -b:a 192k -movflags +faststart \
  "$output_dir/sanch-artbook-film-vertical-30s.mp4"

ffmpeg -hide_banner -loglevel error -y -i "$output_dir/sanch-artbook-film-master-1080p.mp4" \
  -t 12 -an -c:v libx264 -preset medium -crf 18 -movflags +faststart \
  "$output_dir/sanch-artbook-film-website-loop-12s.mp4"

echo "Created:"
ls -lh "$output_dir"/*.mp4
