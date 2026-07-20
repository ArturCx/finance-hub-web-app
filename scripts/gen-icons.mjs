import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const SRC = "public/brand/finance-hub-symbol.svg";
const BG = "#0097b2"; // cor de fundo da marca (teal)
const OUT = "public/icons";

await mkdir(OUT, { recursive: true });

const render = (size) =>
  sharp(SRC, { density: 384 }).resize(size, size, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

// transparentes (favicon + manifest Android)
await render(512).png().toFile(`${OUT}/icon.png`);
await render(512).png().toFile(`${OUT}/icon-512.png`);
await render(192).png().toFile(`${OUT}/icon-192.png`);

// iOS: fundo sólido da marca, sem canal alfa e sem cantos arredondados
await render(180)
  .flatten({ background: BG })
  .png({ palette: false })
  .toFile(`${OUT}/apple-icon.png`);

console.log("ok");
