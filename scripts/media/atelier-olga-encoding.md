# Atelier Olga landing-page video

Source: `~/Downloads/Atelier_combinaison_Olga.mov` (original retained unchanged).
Keep 0–101.5 seconds; the closing SANCH end-card begins after this point.
Input has a -90° rotation matrix; FFmpeg autorotation produces 1080 × 1918 portrait video.

Both exports remove unused audio and metadata. The landing-page video is muted,
inline, looping and deferred until near the viewport; MP4 is the Safari fallback.
The poster comes from 12 seconds. Mobile presentation uses a native 9:16 portrait
container rather than a landscape box.

WebM: VP9, yuv420p, CRF 27, target 1500k/max 1700k, buffer 3000k,
`-deadline good -cpu-used 5 -row-mt 1 -tile-columns 2`.
MP4: H.264, yuv420p, CRF 20, max 1700k/buffer 3000k,
`-preset medium -movflags +faststart`.

Decode-validate finished exports and check duration, display orientation and file
size before publishing. Each file must remain below the Pages asset limit.

## Additional Atelier logo-free variants

- `atelier-fitting-logo-free.webm`: first 50 seconds of the original fitting
  export, stream-copied without re-encoding to remove its closing logo card.
- `atelier-sketch-logo-free.webm`: retains 0–5.3 and 9.8 seconds onward from
  `4.webm`; the middle branded sketch sequence is omitted. VP9 CRF 20, original
  dimensions and frame rate, no audio.
- `1.webm` and `Atelier_ultrahq_curved.webm`: reviewed opening, middle and ending
  sequences; no standalone SANCH branding sequence found, left unchanged.

The landing-page fitting slot and both Atelier language pages use the new
logo-free fitting file. Both Atelier pages also use the logo-free sketch file.
