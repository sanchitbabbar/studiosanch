#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film"
build_dir="/private/tmp/sanch-gallery-deep-silk-v32"
signature="$output_dir/assets/paris-field-recordings/cursive-pen-signature-cc0.mp3"
clicks="$output_dir/assets/paris-field-recordings/pen-open-close-cc0.mp3"
duration="68.25"

mkdir -p "$build_dir"

# A continuous, non-rhythmic low register: soft architectural depth without melody.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "sine=frequency=46.25:sample_rate=48000:duration=$duration" \
  -f lavfi -i "sine=frequency=69.30:sample_rate=48000:duration=$duration" \
  -f lavfi -i "sine=frequency=92.50:sample_rate=48000:duration=$duration" \
  -f lavfi -i "anoisesrc=color=brown:sample_rate=48000:duration=$duration" \
  -filter_complex "[0:a]lowpass=f=82,volume=-29dB[foundation];[1:a]lowpass=f=105,volume=-36dB[fifth];[2:a]lowpass=f=125,volume=-42dB[airharmonic];[3:a]highpass=f=32,lowpass=f=240,volume=-44dB[velvet];[foundation][fifth][airharmonic][velvet]amix=inputs=4:normalize=0,afade=t=in:st=0:d=6,afade=t=out:st=62:d=6.25,alimiter=limit=0.55[bed]" \
  -map "[bed]" -c:a pcm_s24le "$build_dir/deep-silk-bed.wav"

render_film() {
  local picture="$1"
  local output="$2"

  ffmpeg -hide_banner -loglevel error -y \
    -i "$picture" \
    -i "$build_dir/deep-silk-bed.wav" \
    -i "$signature" \
    -i "$clicks" \
    -filter_complex "[1:a]anull[bed];[2:a]highpass=f=620,lowpass=f=7800,volume=-7dB,afade=t=in:st=0:d=0.035,afade=t=out:st=2.05:d=0.40,adelay=34800|34800[pen];[3:a]asplit=2[openraw][closeraw];[openraw]atrim=start=0:end=0.38,asetpts=PTS-STARTPTS,highpass=f=180,lowpass=f=7200,volume=-8dB,adelay=33900|33900[open];[closeraw]atrim=start=0.38:end=0.806,asetpts=PTS-STARTPTS,highpass=f=180,lowpass=f=7200,volume=-8dB,adelay=37500|37500[close];[bed][pen][open][close]amix=inputs=4:normalize=0,alimiter=limit=0.70[out]" \
    -map 0:v:0 -map "[out]" -c:v copy -c:a aac -b:a 320k -shortest -movflags +faststart "$output"
}

render_film \
  "$output_dir/sanch-artbook-film-v10-editorial-cuts-master.mp4" \
  "$output_dir/sanch-artbook-film-v32-deep-silk-minimal-master.mp4"

render_film \
  "$output_dir/sanch-artbook-film-v33-vertical-stabilized-full-spreads.mp4" \
  "$output_dir/sanch-artbook-film-v33-deep-silk-stabilized-vertical.mp4"

ffmpeg -hide_banner -loglevel error -y \
  -ss 27 -i "$output_dir/sanch-artbook-film-v32-deep-silk-minimal-master.mp4" \
  -t 16 -c:v libx264 -preset medium -crf 17 -c:a aac -b:a 192k -movflags +faststart \
  "$output_dir/sanch-artbook-film-v32-deep-silk-minimal-preview.mp4"

echo "Created:"
ls -lh "$output_dir"/sanch-artbook-film-v32-*.mp4 "$output_dir/sanch-artbook-film-v33-deep-silk-stabilized-vertical.mp4"
