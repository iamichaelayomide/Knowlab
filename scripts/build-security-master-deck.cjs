const fs = require("fs");
const path = require("path");
const os = require("os");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaBook,
  FaBalanceScale,
  FaShieldAlt,
  FaClipboardList,
  FaUsers,
  FaBroadcastTower,
  FaExclamationTriangle,
  FaFirstAid,
  FaGavel,
  FaCheckCircle,
  FaUserShield,
  FaArrowRight,
  FaBullseye,
} = require("react-icons/fa");

const C = {
  navy: "0E2038",
  navySoft: "183153",
  sky: "5B8DEF",
  cyan: "4CC9D8",
  green: "2A7A54",
  gold: "D2B15B",
  sand: "F4EFE5",
  cloud: "F7F8FC",
  line: "D6DCE8",
  slate: "66758C",
  text: "18212F",
  white: "FFFFFF",
  red: "B54141",
  amber: "A96C19",
  purple: "7B61A8",
};

const PDF_ASSETS = {
  handbook: path.resolve(process.cwd(), "outputs/pdf-extracts/P-00092_SecurityOfficerHandbook.page1.png"),
  curriculum: path.resolve(process.cwd(), "outputs/pdf-extracts/P-01878_SecurityOfficerCurriculumGuide.page1.png"),
  ftmInstructor: path.resolve(process.cwd(), "outputs/pdf-extracts/P-02078_FTM-Instructors_Guide.page1.png"),
  ftmStudent: path.resolve(process.cwd(), "outputs/pdf-extracts/P-02079_FTM-Student_Guide.page1.png"),
  legacy: path.resolve(process.cwd(), "outputs/pdf-extracts/SecurityDCoursetrainingCurriculum.page1.png"),
};

async function iconPng(IconComp, color = "#FFFFFF", size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComp, { color, size: String(size) }),
  );
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return `data:image/png;base64,${buf.toString("base64")}`;
}

const shadow = () => ({
  type: "outer",
  color: "000000",
  blur: 4,
  offset: 2,
  angle: 135,
  opacity: 0.12,
});

function addFooter(slide, pres, label = "Florida security training synthesis from FDACS handbook, curriculum guide, and FTM manuals") {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 5.38,
    w: 10,
    h: 0.245,
    fill: { color: C.cloud },
    line: { color: C.cloud },
  });
  slide.addText(label, {
    x: 0.38,
    y: 5.395,
    w: 9.2,
    h: 0.18,
    fontSize: 8,
    color: C.slate,
  });
}

function addHeader(slide, pres, title, eyebrow = null) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 10,
    h: 0.92,
    fill: { color: C.navy },
    line: { color: C.navy },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 0.16,
    h: 5.625,
    fill: { color: C.gold },
    line: { color: C.gold },
  });
  if (eyebrow) {
    slide.addText(eyebrow, {
      x: 0.42,
      y: 0.11,
      w: 9.0,
      h: 0.16,
      fontSize: 9,
      bold: true,
      color: C.gold,
      charSpacing: 1.8,
    });
  }
  slide.addText(title, {
    x: 0.42,
    y: eyebrow ? 0.29 : 0.18,
    w: 9.0,
    h: 0.42,
    fontSize: 22,
    bold: true,
    color: C.white,
    fontFace: "Georgia",
    valign: "middle",
    margin: 0,
  });
}

function addTitleSlide(pres, title, subtitle, sourceNote, covers) {
  const slide = pres.addSlide();
  slide.background = { color: C.navy };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 0.18,
    h: 5.625,
    fill: { color: C.gold },
    line: { color: C.gold },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.42,
    y: 4.78,
    w: 4.2,
    h: 0.03,
    fill: { color: C.gold },
    line: { color: C.gold },
  });

  slide.addText("FDACS TRAINING SYNTHESIS", {
    x: 0.42,
    y: 0.42,
    w: 3.5,
    h: 0.2,
    fontSize: 10,
    bold: true,
    color: C.gold,
    charSpacing: 2,
  });
  slide.addText(title, {
    x: 0.42,
    y: 0.95,
    w: 4.6,
    h: 1.7,
    fontSize: 28,
    bold: true,
    color: C.white,
    fontFace: "Georgia",
    valign: "middle",
  });
  slide.addText(subtitle, {
    x: 0.42,
    y: 2.85,
    w: 4.55,
    h: 1.05,
    fontSize: 14,
    italic: true,
    color: "D8DFEC",
    valign: "top",
  });
  slide.addText(sourceNote, {
    x: 0.42,
    y: 4.98,
    w: 4.5,
    h: 0.3,
    fontSize: 9,
    color: "9FB0C7",
  });

  const positions = [
    { x: 5.28, y: 0.5, w: 1.35, h: 1.95 },
    { x: 6.8, y: 0.8, w: 1.55, h: 2.15 },
    { x: 8.55, y: 0.46, w: 1.1, h: 1.75 },
    { x: 5.78, y: 2.72, w: 1.6, h: 2.3 },
    { x: 7.75, y: 2.98, w: 1.65, h: 2.0 },
  ];

  covers.forEach((cover, index) => {
    const pos = positions[index];
    slide.addShape(pres.shapes.RECTANGLE, {
      x: pos.x - 0.04,
      y: pos.y - 0.04,
      w: pos.w + 0.08,
      h: pos.h + 0.08,
      fill: { color: C.white },
      line: { color: "24364E", width: 0.6 },
      shadow: shadow(),
    });
    slide.addImage({ path: cover.path, x: pos.x, y: pos.y, w: pos.w, h: pos.h });
  });

  slide.addText("Class D, Class G, handbook, curriculum, and instructor alignment in one deck", {
    x: 5.28,
    y: 5.0,
    w: 4.3,
    h: 0.24,
    fontSize: 9,
    color: "B8C8DF",
    align: "right",
  });
}

function addSectionDivider(pres, section, title, body, iconData) {
  const slide = pres.addSlide();
  slide.background = { color: C.navySoft };
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 10,
    h: 0.1,
    fill: { color: C.gold },
    line: { color: C.gold },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 5.525,
    w: 10,
    h: 0.1,
    fill: { color: C.gold },
    line: { color: C.gold },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 0.58,
    y: 1.38,
    w: 1.28,
    h: 1.28,
    fill: { color: C.gold },
    line: { color: C.gold },
  });
  slide.addText(section, {
    x: 0.58,
    y: 1.38,
    w: 1.28,
    h: 1.28,
    margin: 0,
    fontSize: 30,
    bold: true,
    color: C.navy,
    align: "center",
    valign: "middle",
  });
  slide.addText("SECTION", {
    x: 2.15,
    y: 1.45,
    w: 2.4,
    h: 0.18,
    fontSize: 11,
    bold: true,
    color: C.gold,
    charSpacing: 3,
  });
  slide.addText(title, {
    x: 2.15,
    y: 1.8,
    w: 5.2,
    h: 0.8,
    fontSize: 28,
    bold: true,
    color: C.white,
    fontFace: "Georgia",
  });
  slide.addText(body, {
    x: 2.15,
    y: 2.85,
    w: 4.8,
    h: 1.1,
    fontSize: 13.2,
    color: "D8DFEC",
    fontFace: "Calibri",
  });
  if (iconData) {
    slide.addImage({ data: iconData, x: 7.95, y: 2.2, w: 1.3, h: 1.3 });
  }
  slide.addText("Built from FDACS handbook, curriculum, and firearms training manuals", {
    x: 0.5,
    y: 5.2,
    w: 9.0,
    h: 0.2,
    fontSize: 8.5,
    color: "AAB7D0",
    align: "center",
  });
}

function addBulletSlide(pres, title, eyebrow, bullets, opts = {}) {
  const slide = pres.addSlide();
  slide.background = { color: opts.bg || C.white };
  addHeader(slide, pres, title, eyebrow);

  const runs = [];
  bullets.forEach((item, index) => {
    if (item.type === "heading") {
      if (index > 0) {
        runs.push({ text: "", options: { breakLine: true, fontSize: 4 } });
      }
      runs.push({
        text: item.text,
        options: {
          bold: true,
          color: C.navy,
          fontSize: item.size || 15,
          breakLine: true,
        },
      });
      return;
    }

    if (item.type === "note") {
      runs.push({
        text: item.text,
        options: {
          italic: true,
          color: C.slate,
          fontSize: 11.5,
          breakLine: true,
        },
      });
      return;
    }

    runs.push({
      text: item.text,
      options: {
        bullet: item.sub ? { indent: 24 } : true,
        indentLevel: item.sub ? 1 : 0,
        color: C.text,
        fontSize: item.size || 13.6,
        bold: !!item.bold,
        breakLine: true,
      },
    });
  });
  if (runs.length) {
    runs[runs.length - 1].options.breakLine = false;
  }

  slide.addText(runs, {
    x: 0.44,
    y: 1.1,
    w: opts.textW || 9.02,
    h: 4.12,
    fontFace: "Calibri",
    paraSpaceAfterPt: 4,
    valign: "top",
  });

  addFooter(slide, pres, opts.footer);
}

function addTwoColSlide(pres, title, eyebrow, leftTitle, leftItems, rightTitle, rightItems, leftColor, rightColor) {
  const slide = pres.addSlide();
  slide.background = { color: C.white };
  addHeader(slide, pres, title, eyebrow);

  [
    { x: 0.42, title: leftTitle, items: leftItems, color: leftColor },
    { x: 5.14, title: rightTitle, items: rightItems, color: rightColor },
  ].forEach((col) => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: col.x,
      y: 1.16,
      w: 4.4,
      h: 0.44,
      fill: { color: col.color },
      line: { color: col.color },
    });
    slide.addText(col.title, {
      x: col.x,
      y: 1.16,
      w: 4.4,
      h: 0.44,
      margin: 0,
      fontSize: 12.5,
      bold: true,
      color: C.white,
      align: "center",
      valign: "middle",
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: col.x,
      y: 1.62,
      w: 4.4,
      h: 3.56,
      fill: { color: C.cloud },
      line: { color: C.line, width: 0.6 },
      shadow: shadow(),
    });
    slide.addText(
      col.items.map((text, index) => ({
        text,
        options: {
          bullet: true,
          breakLine: index < col.items.length - 1,
          fontSize: 12.4,
          color: C.text,
        },
      })),
      {
        x: col.x + 0.16,
        y: 1.76,
        w: 4.05,
        h: 3.2,
        fontFace: "Calibri",
        paraSpaceAfterPt: 4,
        valign: "top",
      },
    );
  });

  addFooter(slide, pres);
}

function addDocMosaicSlide(pres) {
  const slide = pres.addSlide();
  slide.background = { color: C.sand };
  addHeader(slide, pres, "Source Documents Used to Build This Deck", "DOCUMENT STACK");

  const docs = [
    { label: "P-00092 Handbook", path: PDF_ASSETS.handbook, x: 0.5, y: 1.16, w: 1.48, h: 2.1 },
    { label: "P-01878 Curriculum", path: PDF_ASSETS.curriculum, x: 2.15, y: 1.16, w: 1.48, h: 2.1 },
    { label: "Legacy D Curriculum", path: PDF_ASSETS.legacy, x: 3.8, y: 1.16, w: 1.48, h: 2.1 },
    { label: "FTM Instructor", path: PDF_ASSETS.ftmInstructor, x: 5.45, y: 1.16, w: 1.48, h: 2.1 },
    { label: "FTM Student", path: PDF_ASSETS.ftmStudent, x: 7.1, y: 1.16, w: 1.48, h: 2.1 },
  ];

  docs.forEach((doc) => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: doc.x - 0.04,
      y: doc.y - 0.04,
      w: doc.w + 0.08,
      h: doc.h + 0.08,
      fill: { color: C.white },
      line: { color: C.line, width: 0.7 },
      shadow: shadow(),
    });
    slide.addImage({ path: doc.path, x: doc.x, y: doc.y, w: doc.w, h: doc.h });
    slide.addText(doc.label, {
      x: doc.x,
      y: 3.35,
      w: doc.w,
      h: 0.24,
      fontSize: 10.4,
      bold: true,
      color: C.navy,
      align: "center",
    });
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5,
    y: 3.78,
    w: 8.85,
    h: 1.14,
    fill: { color: C.white },
    line: { color: C.line, width: 0.7 },
  });
  slide.addText(
    [
      { text: "How this deck uses them\n", options: { bold: true, color: C.navy, fontSize: 13, breakLine: true } },
      { text: "The handbook anchors day-to-day compliance. The curriculum guide defines the 40-hour Class D structure and the 170-question exam weighting. The two FTM manuals define the Class G firearms training path, with the student handbook carrying the learning content and the instructor guide defining the teaching method. The legacy curriculum shows how the current program evolved from an older split-course structure.", options: { color: C.text, fontSize: 12.2 } },
    ],
    {
      x: 0.68,
      y: 3.98,
      w: 8.5,
      h: 0.78,
      fontFace: "Calibri",
      valign: "top",
    },
  );

  addFooter(slide, pres);
}

function addTrainingEcosystemSlide(pres, icons) {
  const slide = pres.addSlide();
  slide.background = { color: C.white };
  addHeader(slide, pres, "How the Documents Fit Together", "TRAINING ECOSYSTEM");

  const nodes = [
    { x: 0.56, y: 1.45, w: 2.05, h: 1.1, title: "Law and Rule", body: "Chapter 493 and Rule 5N-1 create the legal framework and minimum standards.", color: C.navy, icon: icons.balance },
    { x: 3.02, y: 1.45, w: 2.05, h: 1.1, title: "Class D Guide", body: "P-01878 maps the 40-hour curriculum and the 170-question exam.", color: C.sky, icon: icons.clipboard },
    { x: 5.48, y: 1.45, w: 2.05, h: 1.1, title: "Handbook", body: "P-00092 explains what licensees must actually do and avoid in practice.", color: C.green, icon: icons.book },
    { x: 7.94, y: 1.45, w: 1.5, h: 1.1, title: "FTM", body: "P-02078 and P-02079 govern firearms training for Class G.", color: C.red, icon: icons.shield },
  ];

  nodes.forEach((node) => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: node.x,
      y: node.y,
      w: node.w,
      h: node.h,
      fill: { color: C.cloud },
      line: { color: C.line, width: 0.8 },
      shadow: shadow(),
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: node.x,
      y: node.y,
      w: node.w,
      h: 0.16,
      fill: { color: node.color },
      line: { color: node.color },
    });
    slide.addImage({ data: node.icon, x: node.x + 0.14, y: node.y + 0.25, w: 0.26, h: 0.26 });
    slide.addText(node.title, {
      x: node.x + 0.48,
      y: node.y + 0.22,
      w: node.w - 0.58,
      h: 0.2,
      fontSize: 11.5,
      bold: true,
      color: C.navy,
    });
    slide.addText(node.body, {
      x: node.x + 0.14,
      y: node.y + 0.52,
      w: node.w - 0.28,
      h: 0.42,
      fontSize: 10.4,
      color: C.text,
    });
  });

  for (let i = 0; i < 3; i += 1) {
    slide.addImage({ data: icons.arrow, x: 2.68 + i * 2.46, y: 1.86, w: 0.22, h: 0.22 });
  }

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.56,
    y: 3.18,
    w: 8.86,
    h: 1.54,
    fill: { color: C.sand },
    line: { color: C.gold, width: 0.8 },
  });
  slide.addText("What this means for a training program", {
    x: 0.74,
    y: 3.36,
    w: 3.2,
    h: 0.18,
    fontSize: 12,
    bold: true,
    color: C.navy,
  });
  slide.addText(
    [
      { text: "A student cannot treat these as separate worlds.\n", options: { bold: true, color: C.text, fontSize: 12.4, breakLine: true } },
      { text: "The curriculum guide says what must be taught. The handbook says how licensure actually works in the field. The FTM takes over when an officer's duties require a firearm. A strong school or academy should teach them as one compliance-and-performance system, not as disconnected PDFs.", options: { color: C.text, fontSize: 12.1 } },
    ],
    {
      x: 0.74,
      y: 3.64,
      w: 8.4,
      h: 0.8,
      fontFace: "Calibri",
    },
  );

  addFooter(slide, pres);
}

function addDonutAndCalloutSlide(pres, title, eyebrow) {
  const slide = pres.addSlide();
  slide.background = { color: C.white };
  addHeader(slide, pres, title, eyebrow);

  slide.addChart(
    pres.charts.DOUGHNUT,
    [{
      name: "Hours",
      labels: [
        "Legal and compliance",
        "Security operations",
        "Observation and control",
        "Emergency and safety",
        "Advanced risks and special issues",
      ],
      values: [6, 9, 7, 8.5, 9.5],
    }],
    {
      x: 0.55,
      y: 1.18,
      w: 4.35,
      h: 3.5,
      showLegend: true,
      legendPos: "r",
      showTitle: false,
      holeSize: 58,
      chartColors: [C.navy, C.sky, C.cyan, C.green, C.gold],
      chartArea: { fill: { color: C.white }, border: { color: C.white } },
      showPercent: true,
      showValue: false,
      dataLabelColor: C.text,
      dataLabelPosition: "bestFit",
    },
  );

  const blocks = [
    { y: 1.22, color: C.navy, title: "Legal and compliance", body: "6 hours. Chapter 493, liability, force, scene control, testimony, and EEO." },
    { y: 1.95, color: C.sky, title: "Security operations", body: "9 hours. Role, conduct, communications, interviewing, systems, and customer-facing practice." },
    { y: 2.68, color: C.cyan, title: "Observation and control", body: "7 hours. Reporting, access control, patrols, physical barriers, and information protection." },
    { y: 3.41, color: C.green, title: "Emergency and safety", body: "8.5 hours. Preparedness, hazard control, medical emergencies, CPR, and AED." },
    { y: 4.14, color: C.gold, title: "Advanced risks", body: "9.5 hours. Terrorism, special issues, event security, and intro to weapons." },
  ];

  blocks.forEach((block) => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 5.26,
      y: block.y,
      w: 4.16,
      h: 0.56,
      fill: { color: C.cloud },
      line: { color: C.line, width: 0.5 },
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 5.26,
      y: block.y,
      w: 0.18,
      h: 0.56,
      fill: { color: block.color },
      line: { color: block.color },
    });
    slide.addText(block.title, {
      x: 5.52,
      y: block.y + 0.08,
      w: 1.85,
      h: 0.16,
      fontSize: 11.2,
      bold: true,
      color: C.navy,
    });
    slide.addText(block.body, {
      x: 7.05,
      y: block.y + 0.08,
      w: 2.18,
      h: 0.28,
      fontSize: 10.4,
      color: C.text,
    });
  });

  addFooter(slide, pres);
}

function addExamBlueprintSlide(pres) {
  const slide = pres.addSlide();
  slide.background = { color: C.white };
  addHeader(slide, pres, "170-Question Exam Blueprint", "ASSESSMENT WEIGHTING");

  slide.addChart(
    pres.charts.BAR,
    [{
      name: "Questions",
      labels: ["Legal", "Medical", "Reporting", "Special Issues", "Conduct", "Safety", "Terrorism", "Role", "Communications"],
      values: [26, 19, 17, 17, 13, 11, 11, 9, 9],
    }],
    {
      x: 0.55,
      y: 1.18,
      w: 5.85,
      h: 3.8,
      barDir: "bar",
      catAxisLabelColor: C.slate,
      valAxisLabelColor: C.slate,
      chartColors: [C.navy, C.sky, C.cyan, C.gold, C.green, C.purple, C.red, "6BAAA8", "8EA2C3"],
      showLegend: false,
      showTitle: false,
      showValue: true,
      dataLabelPosition: "outEnd",
      dataLabelColor: C.text,
      valGridLine: { color: "E7EBF3", size: 0.5 },
      catGridLine: { style: "none" },
      chartArea: { fill: { color: C.white }, border: { color: C.white } },
    },
  );

  const notes = [
    "Legal Aspects of Private Security is the single heaviest subject at 26 questions.",
    "Medical Emergencies, Observation/Incident Reporting, and Special Issues together account for 53 questions.",
    "No more than 50 percent of the questions in each core topic may be true or false.",
    "A smart prep strategy weights study time by exam density, not by what feels most familiar.",
  ];
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 6.7,
    y: 1.22,
    w: 2.75,
    h: 3.72,
    fill: { color: C.sand },
    line: { color: C.gold, width: 0.8 },
  });
  slide.addText("What to do with this", {
    x: 6.9,
    y: 1.42,
    w: 2.2,
    h: 0.18,
    fontSize: 12,
    bold: true,
    color: C.navy,
  });
  slide.addText(
    notes.map((text, index) => ({
      text,
      options: {
        bullet: true,
        breakLine: index < notes.length - 1,
        fontSize: 11.5,
        color: C.text,
      },
    })),
    {
      x: 6.88,
      y: 1.74,
      w: 2.3,
      h: 2.85,
      fontFace: "Calibri",
      paraSpaceAfterPt: 5,
      valign: "top",
    },
  );

  addFooter(slide, pres);
}

function addCurriculumCardsSlide(pres, title, eyebrow, cards, footer) {
  const slide = pres.addSlide();
  slide.background = { color: C.white };
  addHeader(slide, pres, title, eyebrow);

  cards.forEach((card, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col === 0 ? 0.46 : 5.06;
    const y = 1.18 + row * 1.02;
    slide.addShape(pres.shapes.RECTANGLE, {
      x,
      y,
      w: 4.35,
      h: 0.84,
      fill: { color: C.cloud },
      line: { color: C.line, width: 0.6 },
      shadow: shadow(),
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x,
      y,
      w: 0.16,
      h: 0.84,
      fill: { color: card.color },
      line: { color: card.color },
    });
    slide.addText(card.label, {
      x: x + 0.24,
      y: y + 0.1,
      w: 2.55,
      h: 0.16,
      fontSize: 11.5,
      bold: true,
      color: C.navy,
    });
    slide.addText(card.hours, {
      x: x + 2.95,
      y: y + 0.08,
      w: 1.15,
      h: 0.18,
      fontSize: 11.5,
      bold: true,
      color: card.color,
      align: "right",
    });
    slide.addText(card.body, {
      x: x + 0.24,
      y: y + 0.34,
      w: 3.9,
      h: 0.32,
      fontSize: 10.5,
      color: C.text,
    });
  });

  addFooter(slide, pres, footer);
}

function addLicenseMatrixSlide(pres) {
  const slide = pres.addSlide();
  slide.background = { color: C.white };
  addHeader(slide, pres, "License Classes You Need to Keep Straight", "HANDBOOK + LEGAL");

  const cards = [
    ["Class D", "Unarmed security officer license for persons performing security services."],
    ["Class G", "Companion statewide firearm license required to carry a firearm on duty."],
    ["Class B / BB", "Security agency and branch office licenses for the business entity."],
    ["Class M / MB", "Manager credentials for licensed agency or branch leadership."],
    ["Class DI / DS", "Security instructor and security school/training facility licenses."],
    ["Class K", "Firearms instructor credential for Class G classroom and range instruction."],
  ];

  cards.forEach((card, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col === 0 ? 0.48 : 5.04;
    const y = 1.18 + row * 1.19;
    const color = index % 3 === 0 ? C.navy : index % 3 === 1 ? C.sky : C.gold;
    slide.addShape(pres.shapes.RECTANGLE, {
      x,
      y,
      w: 4.32,
      h: 0.96,
      fill: { color: C.cloud },
      line: { color: C.line, width: 0.6 },
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x,
      y,
      w: 0.92,
      h: 0.96,
      fill: { color },
      line: { color },
    });
    slide.addText(card[0], {
      x,
      y: y + 0.25,
      w: 0.92,
      h: 0.22,
      fontSize: 15,
      bold: true,
      color: C.white,
      align: "center",
      valign: "middle",
    });
    slide.addText(card[1], {
      x: x + 1.08,
      y: y + 0.18,
      w: 3.0,
      h: 0.45,
      fontSize: 11,
      color: C.text,
    });
  });

  slide.addText("The most common mistake in training conversations is treating Class G like a replacement for Class D. It is not. The firearm license rides on top of the base credential; it does not stand alone for security work.", {
    x: 0.52,
    y: 4.98,
    w: 8.8,
    h: 0.28,
    fontSize: 10.8,
    color: C.slate,
    italic: true,
  });

  addFooter(slide, pres);
}

function addFTMStructureSlide(pres) {
  const slide = pres.addSlide();
  slide.background = { color: C.white };
  addHeader(slide, pres, "FTM Student Handbook Content Map", "CLASS G STRUCTURE");

  const rows = [
    ["Section 1: Legal", "Licensure, definitions, legal concepts, use of force, and case studies."],
    ["Unit 1: Safety", "Foundational firearms safety procedures and safe handling habits."],
    ["Unit 2: Familiarization", "Revolver, semiautomatic pistol, shotgun, and rifle/carbine orientation."],
    ["Units 3-4", "Ammunition use, maintenance, and fundamentals of marksmanship."],
    ["Units 5-7", "Drawing, holstering, loading, unloading, and use of cover."],
    ["Units 8-10", "Malfunctions, cleaning, survival shooting, discretionary shooting, and appendices."],
  ];

  rows.forEach((row, index) => {
    const y = 1.2 + index * 0.58;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.52,
      y,
      w: 8.92,
      h: 0.44,
      fill: { color: index % 2 === 0 ? C.cloud : C.sand },
      line: { color: C.line, width: 0.4 },
    });
    slide.addText(row[0], {
      x: 0.68,
      y: y + 0.1,
      w: 2.0,
      h: 0.16,
      fontSize: 11.5,
      bold: true,
      color: C.navy,
    });
    slide.addText(row[1], {
      x: 2.7,
      y: y + 0.08,
      w: 6.4,
      h: 0.2,
      fontSize: 10.8,
      color: C.text,
    });
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.52,
    y: 4.9,
    w: 8.92,
    h: 0.22,
    fill: { color: C.navySoft },
    line: { color: C.navySoft },
  });
  slide.addText("The legal module at the front of the FTM frames every later decision about carrying, drawing, and firing a weapon while performing regulated duties.", {
    x: 0.68,
    y: 5.0,
    w: 8.5,
    h: 0.12,
    fontSize: 10.2,
    color: C.white,
    align: "center",
  });

  addFooter(slide, pres);
}

function addStudyPlanSlide(pres, icons) {
  const slide = pres.addSlide();
  slide.background = { color: C.white };
  addHeader(slide, pres, "Practical Study and Compliance Plan", "WHAT A SOLID PROGRAM SHOULD DO");

  const steps = [
    { icon: icons.book, title: "Start with the curriculum guide", body: "Use P-01878 to understand subject order, hour allocation, and the biggest exam domains." },
    { icon: icons.clipboard, title: "Use the handbook for rule memory", body: "Treat P-00092 as the operational rulebook for licensing, ID, uniforms, firearms, penalties, and reporting." },
    { icon: icons.shield, title: "Move to FTM only when duty requires a firearm", body: "Class G content is an extension path, not a substitute for the Class D foundation." },
    { icon: icons.target, title: "Practice by exam density", body: "Put more review time into legal, medical, reporting, special issues, and safety because they dominate the test." },
    { icon: icons.check, title: "Close every study block with scenarios", body: "Use force, detention, scene control, and report-writing scenarios to convert statutes into field decisions." },
  ];

  steps.forEach((step, index) => {
    const y = 1.18 + index * 0.79;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.54,
      y,
      w: 8.9,
      h: 0.58,
      fill: { color: index % 2 === 0 ? C.cloud : C.white },
      line: { color: C.line, width: 0.5 },
    });
    slide.addImage({ data: step.icon, x: 0.7, y: y + 0.13, w: 0.24, h: 0.24 });
    slide.addText(step.title, {
      x: 1.05,
      y: y + 0.12,
      w: 2.9,
      h: 0.16,
      fontSize: 11.6,
      bold: true,
      color: C.navy,
    });
    slide.addText(step.body, {
      x: 3.1,
      y: y + 0.1,
      w: 5.95,
      h: 0.22,
      fontSize: 10.8,
      color: C.text,
    });
  });

  addFooter(slide, pres);
}

async function buildDeck() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "OpenAI Codex";
  pres.company = "FDACS training synthesis";
  pres.subject = "Florida Security Officer Training";
  pres.title = "Florida Security Officer Training Playbook";
  pres.lang = "en-US";
  pres.theme = { headFontFace: "Georgia", bodyFontFace: "Calibri", lang: "en-US" };

  const icons = {
    book: await iconPng(FaBook, "#0E2038"),
    balance: await iconPng(FaBalanceScale, "#0E2038"),
    shield: await iconPng(FaShieldAlt, "#0E2038"),
    clipboard: await iconPng(FaClipboardList, "#0E2038"),
    users: await iconPng(FaUsers, "#0E2038"),
    comms: await iconPng(FaBroadcastTower, "#0E2038"),
    warning: await iconPng(FaExclamationTriangle, "#0E2038"),
    aid: await iconPng(FaFirstAid, "#0E2038"),
    gavel: await iconPng(FaGavel, "#D2B15B"),
    check: await iconPng(FaCheckCircle, "#0E2038"),
    userShield: await iconPng(FaUserShield, "#D2B15B"),
    arrow: await iconPng(FaArrowRight, "#5B8DEF"),
    target: await iconPng(FaBullseye, "#0E2038"),
  };

  addTitleSlide(
    pres,
    "Florida Security Officer\nTraining Playbook",
    "A super-detailed briefing deck built from the FDACS Security Officer Handbook, the current and legacy Class D curriculum guides, and the Firearms Training Manual student and instructor documents.",
    "Primary sources: P-00092, P-01878, P-02078, P-02079, and SecurityDCoursetrainingCurriculum.",
    [
      { path: PDF_ASSETS.handbook },
      { path: PDF_ASSETS.curriculum },
      { path: PDF_ASSETS.legacy },
      { path: PDF_ASSETS.ftmStudent },
      { path: PDF_ASSETS.ftmInstructor },
    ],
  );
  addDocMosaicSlide(pres);
  addTrainingEcosystemSlide(pres, icons);
  addDonutAndCalloutSlide(pres, "40-Hour Class D Curriculum Architecture", "CURRENT CURRICULUM GUIDE");
  addExamBlueprintSlide(pres);
  addSectionDivider(pres, "I", "Class D Curriculum", "What the current 40-hour guide expects a school to teach and what a student should master before sitting the exam.", icons.clipboard);
  addCurriculumCardsSlide(pres, "Current Class D Subject Map: Core Foundation", "P-01878 OUTLINE", [
    { label: "1. Legal Aspects of Private Security", hours: "6 hrs", body: "Statutes, licensing, liability, force, scene control, testimony, and EEO.", color: C.navy },
    { label: "2. Role of Private Security Officers", hours: "2 hrs", body: "Assets, threats, vulnerabilities, observe-and-report, and client programs.", color: C.sky },
    { label: "3. Security Officer Conduct", hours: "3 hrs", body: "Ethics, professionalism, appearance, public/client relations, and diversity.", color: C.green },
    { label: "4. Principles of Communications", hours: "2 hrs", body: "Verbal, written, nonverbal, conflict resolution, active listening, and media contact.", color: C.cyan },
    { label: "5. Observation and Incident Reporting", hours: "4 hrs", body: "Use of senses, note taking, descriptions, incident reports, and logs.", color: C.gold },
    { label: "6. Principles of Access Control", hours: "1 hr", body: "Ingress/egress control for people, vehicles, property, and visitor management systems.", color: C.amber },
    { label: "7. Patrols", hours: "1 hr", body: "Internal/external rounds, vehicles, equipment, pattern variation, and patrol problems.", color: C.red },
    { label: "8. Safeguarding Information", hours: "1 hr", body: "Confidential information, OPSEC, HIPAA, and basic cyber security awareness.", color: C.purple },
  ], "Slides 6-13 condense the full current Class D guide into teaching clusters that align better with real classroom flow.");
  addCurriculumCardsSlide(pres, "Current Class D Subject Map: Operational and Response Topics", "P-01878 OUTLINE", [
    { label: "9. Physical Security", hours: "1 hr", body: "CPTED, barriers, locks, lighting, CCTV, and intrusion detection basics.", color: C.navy },
    { label: "10. Interviewing Techniques", hours: "1 hr", body: "Interview vs interrogation, rapport, approach, closeout, and deceptive cues.", color: C.sky },
    { label: "11. Emergency Preparedness", hours: "1.5 hrs", body: "Emergency plans, severe weather, fires, bomb threats, spills, and evacuation.", color: C.green },
    { label: "12. Safety Awareness", hours: "2.5 hrs", body: "Work hazards, fire prevention, NFPA concepts, OSHA, hazmat, and egress.", color: C.cyan },
    { label: "13. Medical Emergencies", hours: "4.5 hrs", body: "Good Samaritan Act, first aid, CPR, AED, and blood-borne pathogens.", color: C.gold },
    { label: "14. Terrorism", hours: "2.5 hrs", body: "Threat recognition, CBRNE concepts, responses, and prior attack lessons.", color: C.amber },
    { label: "15. Event Security and Special Assignments", hours: "1 hr", body: "Traffic, parking, crowds, searches, wands, and executive protection basics.", color: C.red },
    { label: "16-18. Systems, Special Issues, Weapons", hours: "6 hrs", body: "Communication systems, disruptive behavior, active shooter, gangs, and intro to weapons.", color: C.purple },
  ], "The later curriculum hours lean toward applied response and behavior management rather than pure statute memorization.");
  addBulletSlide(pres, "Legal Module Deep Dive", "TOPIC 1 FROM P-01878", [
    { type: "heading", text: "The curriculum guide's legal block is broader than just Chapter 493." },
    { text: "It starts with Chapter 493 and Rule 5N-1, but it also covers liability, use of force, scene preservation, testimony, and EEO." },
    { text: "Students are expected to know legislative intent, definitions, inapplicability, initial application, renewals, cancellations, firearms rules, state seal limits, uniforms, lights, unlawful symbols, and disciplinary guidelines." },
    { text: "The same 6-hour block then moves into limits on arrest authority, crimes, felony vs misdemeanor, searches and seizures, reasonable force, deadly force, evidence preservation, chain of custody, witness identification, and courtroom practice." },
    { text: "The first topic is really the compliance-and-liability backbone of the whole course.", bold: true },
  ]);
  addLicenseMatrixSlide(pres);
  addTwoColSlide(pres, "Legal Risk Themes Students Must Be Ready For", "CURRICULUM + HANDBOOK", "Common liability triggers", [
    "Unlicensed activity or working outside the scope of the credential.",
    "Improper detention, false imprisonment, or confusing a detention with an arrest.",
    "Improper use of force or force after the threat has already ended.",
    "Failure to preserve evidence or document the scene properly.",
    "Poor testimony, speculation, or inconsistency with reports and notes.",
  ], "What strong instruction should reinforce", [
    "Security officers are not law enforcement and should stay inside citizen-level authority.",
    "Reasonable force is judged by the circumstances known at the time.",
    "Deadly force is tied to imminent death, great bodily harm, or forcible felony standards.",
    "Scene control, note taking, and chain of custody protect both the case and the officer.",
    "Professional demeanor matters in court, in reports, and in client/public interactions.",
  ], C.red, C.navy);
  addBulletSlide(pres, "Role, Conduct, Communications, and Reporting", "TOPICS 2-5 FROM P-01878", [
    { type: "heading", text: "The middle of the curriculum turns the licensee into a usable officer." },
    { text: "Role of Private Security Officers focuses on assets, threats, vulnerabilities, observe-and-report, and support for the client's security program." },
    { text: "Security Officer Conduct layers in ethics, professionalism, appearance, discipline, alertness, honesty, public relations, client relations, and diversity." },
    { text: "Principles of Communications covers verbal and nonverbal communication, body language, tone, active listening, conflict resolution, and dealing with aggression." },
    { text: "Observation and Incident Reporting converts communication into evidence-quality documentation through senses, note taking, physical descriptions, and report-writing structure." },
    { text: "These subjects shape whether the officer is trusted, useful, and defensible on the job.", bold: true },
  ]);
  addBulletSlide(pres, "Access, Patrol, Information, and Physical Security", "TOPICS 6-9 FROM P-01878", [
    { type: "heading", text: "These topics cover the everyday operating environment." },
    { text: "Access control includes ingress/egress procedures for people, vehicles, and property, plus visitor management systems." },
    { text: "Patrols cover internal and external rounds, vehicle safety, pattern variation, patrol equipment, and sensory awareness." },
    { text: "Safeguarding information addresses confidential information, OPSEC, HIPAA, and basic cyber hygiene." },
    { text: "Physical security moves into CPTED, perimeters, locks, windows, lighting, CCTV, alarms, and access control systems." },
    { text: "Together, these subjects train the student to think beyond standing post and toward system-aware risk reduction.", bold: true },
  ]);
  addBulletSlide(pres, "Interviewing, Emergency Preparedness, Safety, and Medical Response", "TOPICS 10-13 FROM P-01878", [
    { type: "heading", text: "The guide pushes well beyond pure guarding functions." },
    { text: "Interviewing teaches rapport, structure, closeout, and deceptive cues while preserving the boundary between interview and interrogation." },
    { text: "Emergency Preparedness covers natural disasters, severe weather, fires, bomb threats, spills, and evacuation processes." },
    { text: "Safety Awareness includes OSHA, hazards, labels, fire behavior, egress, extinguishers, and hazardous materials response considerations." },
    { text: "Medical Emergencies carries a large 4.5-hour block because first aid, CPR, AED use, and blood-borne pathogen awareness are core field realities." },
    { text: "This is one of the most test-heavy parts of the exam and one of the most consequential parts of the job.", bold: true },
  ]);
  addBulletSlide(pres, "Terrorism, Special Assignments, Systems, and Special Issues", "TOPICS 14-18 FROM P-01878", [
    { type: "heading", text: "The final modules prepare students for less routine but high-impact situations." },
    { text: "Terrorism covers threat recognition, response, and CBRNE concepts." },
    { text: "Event Security and Special Assignments addresses traffic control, crowd management, searches, metal detectors, and executive protection basics." },
    { text: "Communications Systems reinforces radios, telephones, PA systems, phonetics, and emergency communication discipline." },
    { text: "Special Issues spans disabilities, juveniles, elderly persons, homelessness, substance influence, workplace violence, active shooter, and gang awareness." },
    { text: "Introduction to Weapons closes with non-lethal tools and a basic overview of firearms, which naturally leads into the separate Class G firearms track.", bold: true },
  ]);
  addSectionDivider(pres, "II", "Handbook Rules", "How the Security Officer Handbook translates the curriculum into concrete licensee obligations, restrictions, and practical compliance points.", icons.book);
  addBulletSlide(pres, "Handbook Spotlight: Licensing and Renewal", "P-00092 HANDBOOK", [
    { type: "heading", text: "The handbook is where the rules become operational." },
    { text: "It confirms that a Class D licensee performs security services, a Class G license rides with it for armed duty, and agency/business roles require separate licenses." },
    { text: "It emphasizes that licenses are generally valid for two years, while certain agency and instructor credentials run on three-year cycles." },
    { text: "The licensee, not the agency, is responsible for timely renewal even if a notice is not received." },
    { text: "The handbook also reinforces that the Class D license must be in the officer's possession while on duty, and the Class G must also be present when armed.", bold: true },
  ]);
  addBulletSlide(pres, "Handbook Spotlight: Firearms, Uniforms, and Prohibited Acts", "P-00092 HANDBOOK", [
    { type: "heading", text: "The handbook is especially strong on the do-not-get-this-wrong material." },
    { text: "It treats the firearms license as an additional requirement, not a separate replacement for the base security credential." },
    { text: "It addresses uniforms, identification cards, badges, vehicle lights, unlawful symbols of authority, and use of the state seal." },
    { text: "It outlines disciplinary action, penalties, and the duty to report arrests." },
    { text: "In practice, the handbook is the fastest way to brief a new officer on what can get them or the agency in trouble quickly.", bold: true },
  ]);
  addSectionDivider(pres, "III", "Firearms Training Manual", "Where the Class G path begins: legal concepts first, then safe handling, marksmanship, proficiency, and instructor-led range standards.", icons.userShield);
  addBulletSlide(pres, "Why the Firearms Training Manual Exists", "P-02078 + P-02079", [
    { type: "heading", text: "The FTM is a separate training world with a specific purpose." },
    { text: "Chapter 493 requires applicants for a Class G statewide firearm license to complete the firearms training criteria established by rule." },
    { text: "The student handbook explains what the student must learn, while the instructor guide explains how the instructor should deliver it." },
    { text: "The manual states that the program is derived from FDLE basic recruit firearms training, positioning it as a benchmark of excellence for licensed armed personnel." },
    { text: "It is detailed because carrying a firearm while performing regulated duties raises the liability stakes dramatically.", bold: true },
  ]);
  addTwoColSlide(pres, "Class G Training Path at a Glance", "FTM COURSE SUMMARY", "Initial and ongoing requirements", [
    "28-hour initial qualification course for a new Class G applicant.",
    "Written examination at the end of the classroom portion.",
    "Handgun course of fire and practical proficiency requirement.",
    "Annual 4-hour firearms requalification during each year of the license period.",
    "Additional 4-hour transition/requalification when changing firearm type or caliber.",
  ], "What the student handbook says this covers", [
    "Legal authority to carry and the limits on deadly force.",
    "Liability exposure from improper firearm use.",
    "Safe handling, parts identification, maintenance, and cleaning.",
    "Drawing, holstering, loading, unloading, and malfunction handling.",
    "Basic shooting principles and qualification-level proficiency.",
  ], C.navy, C.red);
  addBulletSlide(pres, "FTM Legal Module: The Bridge from Class D to Class G", "SECTION 1 OF P-02079", [
    { type: "heading", text: "The FTM does not abandon the legal material taught in Class D. It sharpens it." },
    { text: "The student handbook opens with licensure, definitions, legal concepts, and use of force before moving into mechanical firearms content." },
    { text: "That order matters: the state is signaling that a shooter who can pass the range but cannot reason through authority, force, and liability is not adequately prepared." },
    { text: "The course expectations explicitly mention legal authority to carry, limitations on deadly force, crimes that may justify deadly force, and liability for improper use." },
    { text: "A good school should teach the legal carryover as reinforcement, not as a disconnected refresher.", bold: true },
  ]);
  addFTMStructureSlide(pres);
  addBulletSlide(pres, "Why the Instructor Guide Matters", "P-02078 INSTRUCTOR'S GUIDE", [
    { type: "heading", text: "The instructor guide is not just an appendix; it defines how the standard is delivered." },
    { text: "It identifies specific educational objectives for each lesson and provides exercises and activities that help instructors meet those objectives." },
    { text: "It includes details concerning the course of fire and the way training is administered, which creates consistency across instructors and schools." },
    { text: "This is important because firearms training quality depends heavily on delivery discipline, not just on the existence of lesson content." },
    { text: "If the student handbook tells the learner what to know, the instructor guide tells the academy how to teach it well.", bold: true },
  ]);
  addSectionDivider(pres, "IV", "Readiness Plan", "Turning five dense state documents into a practical training and study system for schools, instructors, and students.", icons.target);
  addStudyPlanSlide(pres, icons);

  const closing = pres.addSlide();
  closing.background = { color: C.navy };
  closing.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.18, h: 5.625, fill: { color: C.gold }, line: { color: C.gold } });
  closing.addText("FINAL TAKEAWAY", { x: 0.44, y: 0.44, w: 3.0, h: 0.18, fontSize: 11, bold: true, color: C.gold, charSpacing: 2 });
  closing.addText("A solid Florida security program is not one PDF.\nIt is a connected system.", { x: 0.44, y: 1.0, w: 5.8, h: 1.1, fontSize: 28, bold: true, color: C.white, fontFace: "Georgia" });
  closing.addText([
    { text: "The curriculum guide defines the structure.\n", options: { breakLine: true, color: "D8DFEC", fontSize: 14 } },
    { text: "The handbook defines the operational rules.\n", options: { breakLine: true, color: "D8DFEC", fontSize: 14 } },
    { text: "The FTM defines the firearms standard when duty expands.\n", options: { breakLine: true, color: "D8DFEC", fontSize: 14 } },
    { text: "Teaching them together is how you get officers who are both licensable and reliable.", options: { color: C.white, fontSize: 14, bold: true } },
  ], { x: 0.44, y: 2.4, w: 5.6, h: 1.35, fontFace: "Calibri" });
  closing.addImage({ data: icons.check, x: 7.86, y: 1.82, w: 1.2, h: 1.2 });
  closing.addShape(pres.shapes.RECTANGLE, { x: 6.7, y: 3.55, w: 2.55, h: 0.92, fill: { color: C.navySoft }, line: { color: C.gold, width: 0.8 } });
  closing.addText("Deliverable\n22-slide master deck", { x: 6.7, y: 3.7, w: 2.55, h: 0.44, fontSize: 13, bold: true, color: C.white, align: "center" });
  closing.addText("Built from the five PDFs you shared", { x: 0.44, y: 5.18, w: 8.8, h: 0.2, fontSize: 8.5, color: "AAB7D0", align: "center" });

  const outDir = path.resolve(process.cwd(), "outputs");
  fs.mkdirSync(outDir, { recursive: true });
  const workspaceOut = path.join(outDir, "Florida_Security_Officer_Training_Playbook.pptx");
  const desktopOut = path.join(os.homedir(), "Desktop", "Florida_Security_Officer_Training_Playbook.pptx");
  await pres.writeFile({ fileName: workspaceOut });
  fs.copyFileSync(workspaceOut, desktopOut);
  console.log(workspaceOut);
  console.log(desktopOut);
}

buildDeck().catch((error) => {
  console.error(error);
  process.exit(1);
});
