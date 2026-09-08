#!/bin/zsh
set -euo pipefail

project_root="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch"
source_dir="$project_root/public/images/boutique/artbook-gallery"
output_dir="$project_root/artbook-film"
build_dir="/private/tmp/sanch-open-artbook-editorial-20s"

fps=24
width=1920
height=1080
shot_duration=1.25
frames=30

mkdir -p "$output_dir" "$build_dir/clips"

# Only photographs where the artbook is visibly open.
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

clip_index=1
for image in "${images[@]}"; do
  for treatment in detail complete; do
    output="$build_dir/clips/clip_$(printf '%02d' "$clip_index").mp4"
    direction=$((clip_index % 4))

    if [[ "$treatment" == "detail" ]]; then
      # Fast editorial crop: begin inside the page and breathe outward.
      zoom="max(1.10,1.30-0.0067*on)"
      case "$direction" in
        0) x="(iw-iw/zoom)*0.16"; y="(ih-ih/zoom)*0.42" ;;
        1) x="(iw-iw/zoom)*0.84"; y="(ih-ih/zoom)*0.38" ;;
        2) x="(iw-iw/zoom)*0.48"; y="(ih-ih/zoom)*0.16" ;;
        3) x="(iw-iw/zoom)*0.52"; y="(ih-ih/zoom)*0.82" ;;
      esac
    else
      # Complete spread: a precise, restrained push toward the physical book.
      zoom="min(1.075,1.00+0.0025*on)"
      x="(iw-iw/zoom)/2"
      y="(ih-ih/zoom)/2"
    fi

    ffmpeg -hide_banner -loglevel error -y -loop 1 -i "$image" \
      -vf "scale=2304:1296:force_original_aspect_ratio=increase:flags=lanczos,crop=2304:1296,zoompan=z='$zoom':x='$x':y='$y':d=${frames}:s=${width}x${height}:fps=$fps,eq=contrast=1.045:brightness=-0.006:saturation=0.12,curves=all='0/0 0.06/0.045 0.50/0.51 0.94/0.965 1/1',noise=alls=1.15:allf=t+u,fade=t=in:st=0:d=0.055,fade=t=out:st=1.195:d=0.055,format=yuv420p" \
      -t "$shot_duration" -an -c:v libx264 -preset slow -crf 15 -movflags +faststart "$output"

    clip_index=$((clip_index + 1))
  done
done

: > "$build_dir/concat.txt"
for clip in "$build_dir"/clips/clip_*.mp4; do
  print -r -- "file '$clip'" >> "$build_dir/concat.txt"
done

ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$build_dir/concat.txt" \
  -c copy "$build_dir/picture.mp4"

# Original 20-second fashion sound design: sub pulse, paper air, and restrained cut accents.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "sine=frequency=46.25:sample_rate=48000:duration=20" \
  -f lavfi -i "sine=frequency=92.50:sample_rate=48000:duration=20" \
  -f lavfi -i "anoisesrc=color=pink:sample_rate=48000:duration=20" \
  -f lavfi -i "aevalsrc=if(lt(mod(t\,1.25)\,0.035)\,0.65*exp(-90*mod(t\,1.25))*sin(2*PI*1250*t)\,0):s=48000:d=20" \
  -filter_complex "[0:a]volume=0.055,lowpass=f=110[sub];[1:a]volume='0.015*(0.55+0.45*sin(2*PI*t/5))':eval=frame,lowpass=f=220[tone];[2:a]highpass=f=650,lowpass=f=5800,volume=0.014[air];[3:a]volume=0.12,highpass=f=700[cut];[sub][tone][air][cut]amix=inputs=4:normalize=0,afade=t=in:st=0:d=0.65,afade=t=out:st=18.6:d=1.4,alimiter=limit=0.8[a]" \
  -map "[a]" -c:a aac -b:a 256k "$build_dir/soundtrack.m4a"

final="$output_dir/sanch-open-artbook-editorial-20s.mp4"
ffmpeg -hide_banner -loglevel error -y -i "$build_dir/picture.mp4" -i "$build_dir/soundtrack.m4a" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -t 20 -movflags +faststart "$final"

ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_name,width,height,r_frame_rate \
  -of default=noprint_wrappers=1 "$final"
print -r -- "Created: $final"
