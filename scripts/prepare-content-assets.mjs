import { copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const inputRoot = path.join(root, "tmp", "image");

const groups = [
  {
    input: "사업분야",
    output: path.join("public", "images", "business"),
    files: {
      "TOR 자립식 옹벽.jpg": "tor-self-supporting-wall.jpg",
      "TOR 절토부 옹벽.jpg": "tor-cut-slope-wall.jpg",
      "보강토 옹벽.jpg": "reinforced-soil-wall.jpg",
      "중력식 옹벽.png": "gravity-wall.png",
      "경관 옹벽.png": "landscape-wall.png",
      "산석 옹벽.jpg": "natural-stone-wall.jpg",
    },
  },
  {
    input: "시공실적",
    output: path.join("public", "images", "projects"),
    files: {
      "거제 상동2지구 현장.jpg": "geoje-sangdong-2.jpg",
      "정읍 내장산 리조트 현장.jpg": "jeongeup-naejangsan-resort.jpg",
      "곤지암 한씨주어종중 현장.jpg": "gonjiam-han-clan.jpg",
      "공주 월송 현장.jpg": "gongju-wolsong.jpg",
      "평택 가재지구 자연석(산석)옹벽.jpg": "pyeongtaek-gajae-stone-wall.jpg",
    },
  },
];

async function findNormalized(directory, expected) {
  const files = await readdir(directory);
  const match = files.find((file) => file.normalize("NFC") === expected.normalize("NFC"));
  if (!match) throw new Error(`${directory}에서 ${expected} 파일을 찾을 수 없습니다.`);
  return path.join(directory, match);
}

for (const group of groups) {
  const inputDirectory = await findNormalized(inputRoot, group.input);
  const outputDirectory = path.join(root, group.output);
  await mkdir(outputDirectory, { recursive: true });

  for (const [sourceName, outputName] of Object.entries(group.files)) {
    const source = await findNormalized(inputDirectory, sourceName);
    const destination = path.join(outputDirectory, outputName);
    const pipeline = sharp(source).rotate();
    if (outputName.endsWith(".png")) {
      await pipeline.png({ compressionLevel: 9 }).toFile(destination);
    } else {
      await pipeline
        .resize(2400, 2400, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 90, chromaSubsampling: "4:2:0", mozjpeg: true })
        .toFile(destination);
    }
  }
}

const certificateInput = await findNormalized(inputRoot, "특허현황");
const certificateOutput = path.join(root, "public", "documents", "certificates");
await mkdir(certificateOutput, { recursive: true });

const certificates = {
  "결속구 디자인등록증.pdf": "h-beam-fastener-design-registration.pdf",
  "디자인등록증(조립식옹벽패널).pdf": "prefabricated-wall-panel-design-registration.pdf",
  "자립식 특허증.pdf": "self-supporting-wall-patent.pdf",
};

for (const [sourceName, outputName] of Object.entries(certificates)) {
  await copyFile(await findNormalized(certificateInput, sourceName), path.join(certificateOutput, outputName));
}
