#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film/sound-options-crisp"
mkdir -p "$output_dir"

# 1. Foil-stamp impact: dry top snap with a compact, grounded body.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "anoisesrc=color=white:sample_rate=48000:duration=0.032" \
  -f lavfi -i "sine=frequency=78:sample_rate=48000:duration=0.42" \
  -f lavfi -i "sine=frequency=920:sample_rate=48000:duration=0.10" \
  -filter_complex "[0:a]highpass=f=1600,lowpass=f=8500,volume=-5dB,adelay=350|350[snap];[1:a]afade=t=out:st=0:d=0.42,volume=-9dB,adelay=354|354[body];[2:a]afade=t=out:st=0:d=0.10,volume=-12dB,adelay=350|350[mid];[snap][body][mid]amix=inputs=3:normalize=0,alimiter=limit=0.62,apad=pad_dur=1.2[out]" \
  -map "[out]" -t 2 -c:a pcm_s24le "$output_dir/01-foil-stamp-impact.wav"

# 2. Magnetic presentation-case latch: two precise contacts and a short low lock.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "anoisesrc=color=white:sample_rate=48000:duration=0.020" \
  -f lavfi -i "anoisesrc=color=white:sample_rate=48000:duration=0.026" \
  -f lavfi -i "sine=frequency=96:sample_rate=48000:duration=0.32" \
  -filter_complex "[0:a]highpass=f=2200,lowpass=f=9000,volume=-8dB,adelay=340|340[first];[1:a]highpass=f=1400,lowpass=f=7200,volume=-5dB,adelay=425|425[lock];[2:a]afade=t=out:st=0:d=0.32,volume=-13dB,adelay=430|430[body];[first][lock][body]amix=inputs=3:normalize=0,alimiter=limit=0.60,apad=pad_dur=1.2[out]" \
  -map "[out]" -t 2 -c:a pcm_s24le "$output_dir/02-magnetic-case-latch.wav"

# 3. Couture shears: a single clean atelier cut, no trailing air.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "anoisesrc=color=white:sample_rate=48000:duration=0.022" \
  -f lavfi -i "sine=frequency=2450:sample_rate=48000:duration=0.075" \
  -f lavfi -i "sine=frequency=155:sample_rate=48000:duration=0.18" \
  -filter_complex "[0:a]highpass=f=1900,lowpass=f=9800,volume=-6dB,adelay=390|390[cut];[1:a]afade=t=out:st=0:d=0.075,volume=-16dB,adelay=388|388[metal];[2:a]afade=t=out:st=0:d=0.18,volume=-17dB,adelay=402|402[handle];[cut][metal][handle]amix=inputs=3:normalize=0,alimiter=limit=0.58,apad=pad_dur=1.2[out]" \
  -map "[out]" -t 2 -c:a pcm_s24le "$output_dir/03-couture-shears.wav"

# 4. Precision aperture: one compact three-part mechanical gesture.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "anoisesrc=color=white:sample_rate=48000:duration=0.014" \
  -f lavfi -i "anoisesrc=color=white:sample_rate=48000:duration=0.018" \
  -f lavfi -i "sine=frequency=118:sample_rate=48000:duration=0.22" \
  -filter_complex "[0:a]highpass=f=2800,lowpass=f=10000,volume=-10dB,adelay=330|330[a];[0:a]highpass=f=2100,lowpass=f=9000,volume=-12dB,adelay=365|365[b];[1:a]highpass=f=1500,lowpass=f=7600,volume=-7dB,adelay=410|410[c];[2:a]afade=t=out:st=0:d=0.22,volume=-16dB,adelay=412|412[body];[a][b][c][body]amix=inputs=4:normalize=0,alimiter=limit=0.56,apad=pad_dur=1.2[out]" \
  -map "[out]" -t 2 -c:a pcm_s24le "$output_dir/04-precision-aperture.wav"

# 5. Hardcover edge tap: tactile paper-board contact with a concise low answer.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "anoisesrc=color=pink:sample_rate=48000:duration=0.028" \
  -f lavfi -i "sine=frequency=690:sample_rate=48000:duration=0.11" \
  -f lavfi -i "sine=frequency=88:sample_rate=48000:duration=0.34" \
  -filter_complex "[0:a]highpass=f=700,lowpass=f=5200,volume=-4dB,adelay=370|370[edge];[1:a]afade=t=out:st=0:d=0.11,volume=-12dB,adelay=368|368[board];[2:a]afade=t=out:st=0:d=0.34,volume=-13dB,adelay=374|374[body];[edge][board][body]amix=inputs=3:normalize=0,alimiter=limit=0.60,apad=pad_dur=1.2[out]" \
  -map "[out]" -t 2 -c:a pcm_s24le "$output_dir/05-hardcover-edge-tap.wav"

# 6. Lacquered display-case closure: glossy snap with a short, expensive low finish.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "anoisesrc=color=white:sample_rate=48000:duration=0.024" \
  -f lavfi -i "sine=frequency=1320:sample_rate=48000:duration=0.085" \
  -f lavfi -i "sine=frequency=64:sample_rate=48000:duration=0.48" \
  -filter_complex "[0:a]highpass=f=1800,lowpass=f=8200,volume=-6dB,adelay=360|360[gloss];[1:a]afade=t=out:st=0:d=0.085,volume=-15dB,adelay=360|360[shell];[2:a]afade=t=out:st=0:d=0.48,volume=-10dB,adelay=366|366[low];[gloss][shell][low]amix=inputs=3:normalize=0,alimiter=limit=0.60,apad=pad_dur=1.2[out]" \
  -map "[out]" -t 2 -c:a pcm_s24le "$output_dir/06-lacquered-case-closure.wav"

echo "Created:"
ls -lh "$output_dir"/*.wav
