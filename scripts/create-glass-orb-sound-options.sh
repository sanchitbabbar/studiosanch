#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film/sound-options-glass-orb"
mkdir -p "$output_dir"

render_orb() {
  local fundamental="$1"
  local second="$2"
  local third="$3"
  local low="$4"
  local delays="$5"
  local decays="$6"
  local output="$7"

  ffmpeg -hide_banner -loglevel error -y \
    -f lavfi -i "sine=frequency=${fundamental}:sample_rate=48000:duration=1.7" \
    -f lavfi -i "sine=frequency=${second}:sample_rate=48000:duration=1.35" \
    -f lavfi -i "sine=frequency=${third}:sample_rate=48000:duration=1.05" \
    -f lavfi -i "sine=frequency=${low}:sample_rate=48000:duration=0.55" \
    -filter_complex "[0:a]afade=t=out:st=0:d=1.7:curve=exp,volume=-13dB[f0];[1:a]afade=t=out:st=0:d=1.35:curve=exp,volume=-18dB[f1];[2:a]afade=t=out:st=0:d=1.05:curve=exp,volume=-24dB[f2];[3:a]afade=t=out:st=0:d=0.55:curve=exp,volume=-20dB[contact];[f0][f1][f2][contact]amix=inputs=4:normalize=0,adelay=420|420,aecho=0.86:0.34:${delays}:${decays},lowpass=f=5200,alimiter=limit=0.54,apad=pad_dur=3[out]" \
    -map "[out]" -t 5 -c:a pcm_s24le "$output"
}

# Clear gallery crystal: precise contact with a luminous but controlled room tail.
render_orb 1046.50 1569.75 2354.63 196.00 "230|510|940|1510" "0.23|0.16|0.10|0.055" \
  "$output_dir/01-clear-glass-orb.wav"

# Smoked glass: lower, warmer and more grounded, with less sparkle.
render_orb 698.46 1047.69 1571.54 146.83 "270|620|1080|1690" "0.24|0.17|0.105|0.052" \
  "$output_dir/02-smoked-glass-orb.wav"

# Large crystal sphere: deeper physical body and the longest elegant decay.
render_orb 587.33 880.99 1321.49 110.00 "310|710|1260|1970" "0.25|0.175|0.105|0.05" \
  "$output_dir/03-large-crystal-sphere.wav"

echo "Created:"
ls -lh "$output_dir"/*.wav
