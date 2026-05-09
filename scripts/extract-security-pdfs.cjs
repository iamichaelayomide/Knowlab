const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");

const files = [
  "C:/Users/DELL/Desktop/P-00092_SecurityOfficerHandbook.pdf",
  "C:/Users/DELL/Desktop/P-01878_SecurityOfficerCurriculumGuide.pdf",
  "C:/Users/DELL/Desktop/P-02078_FTM-Instructors_Guide.pdf",
  "C:/Users/DELL/Desktop/P-02079_FTM-Student_Guide.pdf",
  "C:/Users/DELL/Desktop/SecurityDCoursetrainingCurriculum.pdf",
];

async function samplePdf(file) {
  const data = fs.readFileSync(file);
  const parser = new PDFParse({ data });
  const info = await parser.getInfo({ parsePageInfo: true });
  const firstPages = await parser.getText({ first: 1, last: Math.min(6, info.total) });
  const screenshots = await parser.getScreenshot({ partial: [1], desiredWidth: 1200 });
  await parser.destroy();

  return {
    file,
    totalPages: info.total,
    info: info.info || {},
    text: firstPages.text,
    screenshot: screenshots.pages?.[0]?.data || null,
  };
}

async function main() {
  const outDir = path.resolve(process.cwd(), "outputs", "pdf-extracts");
  fs.mkdirSync(outDir, { recursive: true });

  for (const file of files) {
    const result = await samplePdf(file);
    const base = path.basename(file, path.extname(file));
    const cleanText = result.text.replace(/\s+/g, " ").trim();
    fs.writeFileSync(
      path.join(outDir, `${base}.summary.txt`),
      [
        `FILE: ${result.file}`,
        `PAGES: ${result.totalPages}`,
        `TITLE: ${result.info.Title || ""}`,
        "",
        cleanText,
      ].join("\n"),
    );
    if (result.screenshot) {
      fs.writeFileSync(path.join(outDir, `${base}.page1.png`), result.screenshot);
    }
    console.log(`${base} :: ${result.totalPages} pages`);
    console.log(cleanText.slice(0, 2000));
    console.log("----");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
