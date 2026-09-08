#!/bin/zsh
set -euo pipefail

output_dir="/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/artbook-film/sound-options"
mkdir -p "$output_dir"

# 1. Thick paper breath followed by a padded hardcover landing.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "anoisesrc=color=pink:sample_rate=48000:duration=4" \
  -f lavfi -i "aevalsrc=0.34*sin(2*PI*(54*t-5*t*t))*exp(-7.5*t):s=48000:d=1.2" \
  -filter_complex "[0:a]highpass=f=420,lowpass=f=2800,volume='0.055*between(t,0.55,1.55)*(sin(PI*(t-0.55)))^2':eval=frame[paper];[1:a]lowpass=f=115,adelay=1450|1450[thud];[paper][thud]amix=inputs=2:normalize=0,volume=5dB,alimiter=limit=0.55[out]" \
  -map "[out]" -c:a pcm_s24le "$output_dir/01-couture-book-closure.wav"

# 2. One slow archival page movement, then a lighter cover settle.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "anoisesrc=color=pink:sample_rate=48000:duration=4.5" \
  -f lavfi -i "aevalsrc=0.25*sin(2*PI*(63*t-6*t*t))*exp(-8*t):s=48000:d=1" \
  -filter_complex "[0:a]highpass=f=650,lowpass=f=4200,volume='0.045*between(t,0.35,2.35)*(sin(PI*(t-0.35)/2))^2':eval=frame[page];[1:a]lowpass=f=145,adelay=2480|2480[settle];[page][settle]amix=inputs=2:normalize=0,volume=5dB,alimiter=limit=0.52[out]" \
  -map "[out]" -c:a pcm_s24le "$output_dir/02-archival-page-and-cover.wav"

# 3. Slow press movement ending in one restrained low impression.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "aevalsrc=0.035*sin(2*PI*(118*t-9*t*t))*(sin(PI*t/2.2))^2*lt(t\,2.2):s=48000:d=4" \
  -f lavfi -i "aevalsrc=0.28*sin(2*PI*(47*t-4*t*t))*exp(-7*t):s=48000:d=1" \
  -filter_complex "[0:a]lowpass=f=260,volume=2dB[mechanism];[1:a]lowpass=f=105,adelay=2200|2200[stamp];[mechanism][stamp]amix=inputs=2:normalize=0,volume=5dB,alimiter=limit=0.55[out]" \
  -map "[out]" -c:a pcm_s24le "$output_dir/03-embossing-press.wav"

# 4. Delicate textile friction with a tiny soft release.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "anoisesrc=color=pink:sample_rate=48000:duration=4" \
  -f lavfi -i "aevalsrc=0.10*sin(2*PI*185*t)*exp(-18*t):s=48000:d=0.5" \
  -filter_complex "[0:a]highpass=f=1300,lowpass=f=6200,volume='0.035*between(t,0.35,2.75)*(sin(PI*(t-0.35)/2.4))^2':eval=frame[silk];[1:a]lowpass=f=1100,adelay=2780|2780[release];[silk][release]amix=inputs=2:normalize=0,volume=7dB,alimiter=limit=0.46[out]" \
  -map "[out]" -c:a pcm_s24le "$output_dir/04-silk-ribbon-withdrawal.wav"

# 5. One rounded bowed-bass resolution, with no percussive event.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "aevalsrc=(0.07*sin(2*PI*55*t)+0.024*sin(2*PI*110*t)+0.009*sin(2*PI*165*t))*(1-exp(-2.1*t))*exp(-0.68*t):s=48000:d=5" \
  -filter_complex "[0:a]lowpass=f=360,aecho=0.84:0.20:920|1840:0.08|0.035,afade=t=out:st=3.2:d=1.8,volume=6dB,alimiter=limit=0.48[out]" \
  -map "[out]" -c:a pcm_s24le "$output_dir/05-single-bowed-bass-resolution.wav"

# 6. Cushioned vitrine mechanism: muted metal, glass body and low closure.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "aevalsrc=0.09*sin(2*PI*310*t)*exp(-24*t):s=48000:d=0.6" \
  -f lavfi -i "aevalsrc=0.25*sin(2*PI*(58*t-5*t*t))*exp(-8*t):s=48000:d=1" \
  -filter_complex "[0:a]lowpass=f=950,adelay=900|900[mechanism];[1:a]lowpass=f=125,adelay=1080|1080[close];[mechanism][close]amix=inputs=2:normalize=0,aecho=0.88:0.12:420:0.025,volume=5dB,alimiter=limit=0.50[out]" \
  -map "[out]" -c:a pcm_s24le "$output_dir/06-museum-vitrine-closure.wav"

echo "Created:"
ls -lh "$output_dir"/*.wav
