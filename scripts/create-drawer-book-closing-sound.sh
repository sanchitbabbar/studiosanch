#!/bin/zsh
set -euo pipefail

asset_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film/assets/foley-cc0"
output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film/sound-options-drawer-book"
drawer="$asset_dir/drawer-open-close-fossarts-740297-cc0.mp3"
book="$asset_dir/book-drop-spacejoe-484902-cc0.mp3"

mkdir -p "$output_dir"

# Real CC0 Foley, edited into one restrained action:
# drawer opens -> pause -> hardcover settles -> pause -> drawer closes.
ffmpeg -hide_banner -loglevel error -y \
  -i "$drawer" -i "$book" \
  -filter_complex "[0:a]asplit=2[drawopenraw][drawcloseraw];[drawopenraw]atrim=start=0.14:end=1.36,asetpts=PTS-STARTPTS,highpass=f=42,lowpass=f=6200,volume=-5dB,adelay=240|240[open];[1:a]atrim=start=0.56:end=1.14,asetpts=PTS-STARTPTS,highpass=f=38,lowpass=f=5600,volume=-7dB,adelay=2200|2200[book];[drawcloseraw]atrim=start=2.38:end=3.82,asetpts=PTS-STARTPTS,highpass=f=42,lowpass=f=6200,volume=-5dB,adelay=3360|3360[close];[open][book][close]amix=inputs=3:normalize=0,aecho=0.92:0.10:145:0.035,alimiter=limit=0.68,apad=pad_dur=1[out]" \
  -map "[out]" -t 5.8 -c:a pcm_s24le "$output_dir/01-drawer-open-book-place-drawer-close.wav"

# A materially heavier interpretation. The real Foley is pitched and extended
# downward, reinforced only in its physical low register, and allowed more time.
ffmpeg -hide_banner -loglevel error -y \
  -i "$drawer" -i "$book" \
  -f lavfi -i "sine=frequency=47:sample_rate=48000:duration=0.72" \
  -f lavfi -i "sine=frequency=38:sample_rate=48000:duration=0.90" \
  -filter_complex "[0:a]asplit=4[openraw][openbodyraw][closeraw][closebodyraw];[openraw]atrim=start=0.10:end=1.40,asetpts=PTS-STARTPTS,asetrate=39000,aresample=48000,highpass=f=32,lowpass=f=4600,volume=-1dB,adelay=260|260[open];[openbodyraw]atrim=start=0.10:end=1.40,asetpts=PTS-STARTPTS,asetrate=39000,aresample=48000,lowpass=f=230,volume=5dB,adelay=260|260[openbody];[1:a]atrim=start=0.56:end=1.14,asetpts=PTS-STARTPTS,asetrate=36000,aresample=48000,highpass=f=28,lowpass=f=4300,volume=0dB,adelay=2860|2860[book];[2:a]afade=t=out:st=0:d=0.72:curve=exp,volume=-5dB,adelay=2890|2890[bookweight];[closeraw]atrim=start=2.35:end=3.88,asetpts=PTS-STARTPTS,asetrate=38500,aresample=48000,highpass=f=30,lowpass=f=4500,volume=0dB,adelay=4430|4430[close];[closebodyraw]atrim=start=2.35:end=3.88,asetpts=PTS-STARTPTS,asetrate=38500,aresample=48000,lowpass=f=210,volume=6dB,adelay=4430|4430[closebody];[3:a]afade=t=out:st=0:d=0.90:curve=exp,volume=-7dB,adelay=5750|5750[stop];[open][openbody][book][bookweight][close][closebody][stop]amix=inputs=7:normalize=0,aecho=0.94:0.08:170:0.025,acompressor=threshold=0.18:ratio=2.2:attack=12:release=180:makeup=1.15,alimiter=limit=0.78,apad=pad_dur=1[out]" \
  -map "[out]" -t 7.4 -c:a pcm_s24le "$output_dir/02-heavy-drawer-heavy-artbook.wav"

# Heritage cabinet version: slower, lower and denser, with controlled solid-wood
# resonance rather than loose rattles or inexpensive squeaks.
ffmpeg -hide_banner -loglevel error -y \
  -i "$drawer" -i "$book" \
  -f lavfi -i "sine=frequency=41:sample_rate=48000:duration=1.10" \
  -f lavfi -i "sine=frequency=52:sample_rate=48000:duration=0.92" \
  -f lavfi -i "sine=frequency=33:sample_rate=48000:duration=1.35" \
  -filter_complex "[0:a]asplit=4[openraw][openwoodraw][closeraw][closewoodraw];[openraw]atrim=start=0.08:end=1.44,asetpts=PTS-STARTPTS,asetrate=33000,aresample=48000,highpass=f=25,lowpass=f=3400,volume=1dB,adelay=300|300[open];[openwoodraw]atrim=start=0.08:end=1.44,asetpts=PTS-STARTPTS,asetrate=33000,aresample=48000,lowpass=f=190,volume=8dB,adelay=300|300[openwood];[2:a]afade=t=out:st=0:d=1.10:curve=exp,volume=-9dB,adelay=620|620[runnerbody];[1:a]atrim=start=0.55:end=1.16,asetpts=PTS-STARTPTS,asetrate=31500,aresample=48000,highpass=f=24,lowpass=f=3600,volume=2dB,adelay=3350|3350[book];[3:a]afade=t=out:st=0:d=0.92:curve=exp,volume=-3dB,adelay=3390|3390[bookmass];[closeraw]atrim=start=2.32:end=3.92,asetpts=PTS-STARTPTS,asetrate=32500,aresample=48000,highpass=f=24,lowpass=f=3300,volume=1dB,adelay=5150|5150[close];[closewoodraw]atrim=start=2.32:end=3.92,asetpts=PTS-STARTPTS,asetrate=32500,aresample=48000,lowpass=f=180,volume=9dB,adelay=5150|5150[closewood];[4:a]afade=t=out:st=0:d=1.35:curve=exp,volume=-4dB,adelay=6940|6940[finalmass];[open][openwood][runnerbody][book][bookmass][close][closewood][finalmass]amix=inputs=8:normalize=0,aecho=0.92:0.14:210|470:0.045|0.018,acompressor=threshold=0.16:ratio=2.5:attack=18:release=260:makeup=1.10,alimiter=limit=0.80,apad=pad_dur=1[out]" \
  -map "[out]" -t 8.7 -c:a pcm_s24le "$output_dir/03-heritage-luxury-drawer-artbook.wav"

echo "Created:"
ls -lh "$output_dir"/*.wav
