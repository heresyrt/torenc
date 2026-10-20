# White Background Favicon Design

## Goal

Replace the current dark-background favicon with the white-background symbol from the supplied original Illustrator artwork. The browser tab should show the brand mark clearly without the dark square that currently clashes with the tab UI.

## Source

- Use the symbol from the left, white-background half of `로고 원본.ai`.
- Use the dark navy and beige symbol artwork without any accompanying Korean or English wordmark.
- Do not redraw or reinterpret the logo.

## Output

- Replace `src/app/icon.png`, which Next.js exposes as the application favicon.
- Keep a square white canvas.
- Center the symbol and crop its surrounding whitespace so it remains legible at browser-tab sizes.
- Export at a sufficiently high resolution for Next.js and browsers to downsample cleanly.

## Scope

This change affects only the favicon asset. Header logos, footer logos, metadata text, and other brand assets remain unchanged.

## Verification

- Confirm the replacement PNG is square, RGB or RGBA, and visually matches the white-background source artwork.
- Render or inspect the icon at favicon scale to ensure the symbol remains recognizable and does not appear clipped.
- Run the relevant project tests and production build to confirm Next.js accepts and serves the asset.

