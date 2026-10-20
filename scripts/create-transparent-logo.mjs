import sharp from "sharp";

const input = "public/images/brand/logo-horizontal-dark.png";
const output = "public/images/brand/logo-horizontal-transparent.png";
const background = [44, 63, 79];

const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let index = 0; index < data.length; index += 4) {
  const redDistance = data[index] - background[0];
  const greenDistance = data[index + 1] - background[1];
  const blueDistance = data[index + 2] - background[2];
  const distance = Math.sqrt(
    redDistance ** 2 + greenDistance ** 2 + blueDistance ** 2,
  );

  if (distance <= 2) data[index + 3] = 0;
}

await sharp(data, {
  raw: {
    width: info.width,
    height: info.height,
    channels: 4,
  },
})
  .png({ compressionLevel: 9 })
  .toFile(output);

