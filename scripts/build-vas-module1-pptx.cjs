const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaBalanceScale,
  FaGavel,
  FaShieldAlt,
  FaEye,
  FaCheckCircle,
  FaUniversity,
} = require("react-icons/fa");

const C = {
  navy: "002147",
  navyMid: "003B7A",
  blue: "0055A5",
  gold: "C8A951",
  goldLt: "E8CC78",
  white: "FFFFFF",
  offWht: "F4F6FA",
  slate: "4A5568",
  ltGray: "E8ECF2",
  red: "B91C1C",
  green: "166534",
  greenLt: "DCFCE7",
  amber: "B45309",
  amberLt: "FEF3C7",
  text: "1A202C",
};

async function iconPng(IconComp, color = "#FFFFFF", size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComp, { color, size: String(size) }),
  );
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return `data:image/png;base64,${buf.toString("base64")}`;
}

const sh = () => ({
  type: "outer",
  color: "000000",
  blur: 4,
  offset: 2,
  angle: 135,
  opacity: 0.12,
});

function addFooter(slide, pres, text = "VAS Security Academy  |  Module 1: Legal Aspects  |  Chapter 493, F.S.") {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 5.38,
    w: 10,
    h: 0.245,
    fill: { color: C.ltGray },
    line: { color: C.ltGray },
  });
  slide.addText(text, {
    x: 0.4,
    y: 5.39,
    w: 9.2,
    h: 0.22,
    fontSize: 8,
    color: C.slate,
    align: "left",
  });
}

function addHeader(slide, pres, title, bg = C.navy) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 10,
    h: 1.05,
    fill: { color: bg },
    line: { color: bg },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 0.14,
    h: 5.625,
    fill: { color: C.gold },
    line: { color: C.gold },
  });
  slide.addText(title, {
    x: 0.4,
    y: 0.12,
    w: 9.1,
    h: 0.8,
    fontSize: 22,
    bold: true,
    color: C.white,
    fontFace: "Georgia",
    valign: "middle",
  });
}

function addTitleSlide(pres, title, subtitle, moduleLabel) {
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
    x: 8.55,
    y: 0,
    w: 1.45,
    h: 0.1,
    fill: { color: C.gold },
    line: { color: C.gold },
  });

  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.45,
    y: 0.45,
    w: 2.95,
    h: 0.44,
    rectRadius: 0.05,
    fill: { color: C.gold },
    line: { color: C.gold },
  });
  slide.addText(moduleLabel, {
    x: 0.45,
    y: 0.45,
    w: 2.95,
    h: 0.44,
    margin: 0,
    fontSize: 11,
    bold: true,
    color: C.navy,
    align: "center",
    valign: "middle",
  });

  slide.addText("VAS SECURITY ACADEMY", {
    x: 3.7,
    y: 0.5,
    w: 5.9,
    h: 0.25,
    fontSize: 10,
    color: C.goldLt,
    align: "right",
    bold: true,
    charSpacing: 2,
  });

  slide.addText(title, {
    x: 0.45,
    y: 1.28,
    w: 8.8,
    h: 1.9,
    fontSize: 30,
    bold: true,
    color: C.white,
    fontFace: "Georgia",
    valign: "middle",
  });

  slide.addText(subtitle, {
    x: 0.45,
    y: 3.5,
    w: 9.0,
    h: 0.8,
    fontSize: 16,
    color: C.goldLt,
    italic: true,
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.45,
    y: 4.38,
    w: 4.6,
    h: 0.02,
    fill: { color: C.gold },
    line: { color: C.gold },
  });

  slide.addText("Chapter 493, Florida Statutes  |  Rule 5N-1.140, F.A.C.  |  FDACS-P-01878", {
    x: 0.45,
    y: 5.08,
    w: 9.0,
    h: 0.3,
    fontSize: 9,
    color: "6688AA",
  });
}

function addSectionSlide(pres, sectionNum, title, hoursLabel, iconData) {
  const slide = pres.addSlide();
  slide.background = { color: C.navyMid };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 10,
    h: 0.09,
    fill: { color: C.gold },
    line: { color: C.gold },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 5.535,
    w: 10,
    h: 0.09,
    fill: { color: C.gold },
    line: { color: C.gold },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 0.6,
    y: 1.35,
    w: 1.3,
    h: 1.3,
    fill: { color: C.gold },
    line: { color: C.gold },
  });
  slide.addText(sectionNum, {
    x: 0.6,
    y: 1.35,
    w: 1.3,
    h: 1.3,
    margin: 0,
    fontSize: 34,
    bold: true,
    color: C.navy,
    align: "center",
    valign: "middle",
  });
  slide.addText("SECTION", {
    x: 2.2,
    y: 1.45,
    w: 7.0,
    h: 0.24,
    fontSize: 12,
    bold: true,
    color: C.goldLt,
    charSpacing: 3,
  });
  slide.addText(title, {
    x: 2.2,
    y: 1.8,
    w: 5.5,
    h: 1.2,
    fontSize: 28,
    bold: true,
    color: C.white,
    fontFace: "Georgia",
  });
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 2.2,
    y: 3.25,
    w: 1.65,
    h: 0.4,
    rectRadius: 0.05,
    fill: { color: C.blue },
    line: { color: C.blue },
  });
  slide.addText(hoursLabel, {
    x: 2.2,
    y: 3.25,
    w: 1.65,
    h: 0.4,
    margin: 0,
    fontSize: 11,
    bold: true,
    color: C.white,
    align: "center",
    valign: "middle",
  });
  if (iconData) {
    slide.addImage({ data: iconData, x: 7.9, y: 2.8, w: 1.25, h: 1.25 });
  }
  slide.addText("Module 1 | Legal Aspects of Private Security | VAS Security Academy", {
    x: 0.45,
    y: 5.18,
    w: 9.1,
    h: 0.22,
    fontSize: 8.5,
    color: "AAB7D0",
    align: "center",
  });
}

function addBulletSlide(pres, title, bullets, opts = {}) {
  const slide = pres.addSlide();
  slide.background = { color: opts.bg || C.white };
  addHeader(slide, pres, title, opts.headerBg || C.navy);

  const runs = [];
  bullets.forEach((item, index) => {
    if (item.type === "heading") {
      if (index > 0) {
        runs.push({ text: "", options: { breakLine: true, fontSize: 4 } });
      }
      runs.push({
        text: item.text,
        options: {
          breakLine: true,
          bold: true,
          color: C.navy,
          fontSize: item.size || 15,
        },
      });
      return;
    }

    if (item.type === "note") {
      runs.push({
        text: item.text,
        options: {
          breakLine: true,
          italic: true,
          color: C.slate,
          fontSize: 11.5,
        },
      });
      return;
    }

    runs.push({
      text: item.text,
      options: {
        breakLine: true,
        bullet: item.sub ? { indent: 24 } : true,
        indentLevel: item.sub ? 1 : 0,
        color: C.text,
        fontSize: item.size || 14,
        bold: !!item.bold,
      },
    });
  });

  if (runs.length > 0) {
    runs[runs.length - 1].options.breakLine = false;
  }

  slide.addText(runs, {
    x: 0.45,
    y: 1.2,
    w: opts.textW || 9.05,
    h: 4.05,
    fontFace: "Calibri",
    valign: "top",
    paraSpaceAfterPt: 4,
  });
  addFooter(slide, pres);
}

function addCardGridSlide(pres, title, cards) {
  const slide = pres.addSlide();
  slide.background = { color: C.white };
  addHeader(slide, pres, title);

  cards.forEach((card, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col === 0 ? 0.4 : 5.15;
    const y = 1.22 + row * 1.33;

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x,
      y,
      w: 4.35,
      h: 1.15,
      rectRadius: 0.05,
      fill: { color: C.offWht },
      line: { color: C.ltGray, width: 0.5 },
      shadow: sh(),
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x,
      y,
      w: 4.35,
      h: 0.28,
      fill: { color: card.color || C.navy },
      line: { color: card.color || C.navy },
    });
    slide.addText(card.term, {
      x: x + 0.12,
      y: y + 0.04,
      w: 4.05,
      h: 0.18,
      margin: 0,
      fontSize: 11,
      bold: true,
      color: C.white,
      valign: "middle",
    });
    slide.addText(card.definition, {
      x: x + 0.12,
      y: y + 0.4,
      w: 4.05,
      h: 0.62,
      fontSize: 11.5,
      color: C.text,
      fontFace: "Calibri",
      valign: "top",
    });
  });

  addFooter(slide, pres);
}

function addTwoColSlide(pres, title, leftTitle, leftItems, rightTitle, rightItems, leftColor, rightColor) {
  const slide = pres.addSlide();
  slide.background = { color: C.white };
  addHeader(slide, pres, title);

  [
    { x: 0.4, title: leftTitle, items: leftItems, color: leftColor },
    { x: 5.1, title: rightTitle, items: rightItems, color: rightColor },
  ].forEach((col) => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: col.x,
      y: 1.2,
      w: 4.45,
      h: 0.42,
      fill: { color: col.color },
      line: { color: col.color },
    });
    slide.addText(col.title, {
      x: col.x,
      y: 1.2,
      w: 4.45,
      h: 0.42,
      margin: 0,
      fontSize: 12.5,
      bold: true,
      color: C.white,
      align: "center",
      valign: "middle",
    });
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: col.x,
      y: 1.64,
      w: 4.45,
      h: 3.55,
      rectRadius: 0.04,
      fill: { color: C.offWht },
      line: { color: C.ltGray, width: 0.5 },
      shadow: sh(),
    });
    slide.addText(
      col.items.map((text, index) => ({
        text,
        options: {
          bullet: true,
          breakLine: index < col.items.length - 1,
          color: C.text,
          fontSize: 12.3,
        },
      })),
      {
        x: col.x + 0.14,
        y: 1.74,
        w: 4.12,
        h: 3.3,
        fontFace: "Calibri",
        valign: "top",
        paraSpaceAfterPt: 4,
      },
    );
  });

  addFooter(slide, pres);
}

function addStatuteSlide(pres, title, statuteRef, excerpt, points) {
  const slide = pres.addSlide();
  slide.background = { color: C.offWht };
  addHeader(slide, pres, title);

  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 8.1,
    y: 0.2,
    w: 1.65,
    h: 0.58,
    rectRadius: 0.05,
    fill: { color: C.gold },
    line: { color: C.gold },
  });
  slide.addText(statuteRef, {
    x: 8.1,
    y: 0.2,
    w: 1.65,
    h: 0.58,
    margin: 0,
    fontSize: 10,
    bold: true,
    color: C.navy,
    align: "center",
    valign: "middle",
  });

  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.4,
    y: 1.18,
    w: 9.2,
    h: 1.48,
    rectRadius: 0.04,
    fill: { color: C.navy },
    line: { color: C.navy },
    shadow: sh(),
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4,
    y: 1.18,
    w: 0.08,
    h: 1.48,
    fill: { color: C.gold },
    line: { color: C.gold },
  });
  slide.addText(excerpt, {
    x: 0.65,
    y: 1.35,
    w: 8.65,
    h: 1.05,
    fontSize: 12.8,
    italic: true,
    color: C.white,
    fontFace: "Georgia",
    valign: "middle",
  });

  slide.addText("KEY POINTS", {
    x: 0.42,
    y: 2.92,
    w: 2.0,
    h: 0.22,
    fontSize: 11,
    bold: true,
    color: C.navyMid,
    charSpacing: 2,
  });
  slide.addText(
    points.map((text, index) => ({
      text,
      options: {
        bullet: true,
        breakLine: index < points.length - 1,
        color: C.text,
        fontSize: 13,
      },
    })),
    {
      x: 0.42,
      y: 3.2,
      w: 9.1,
      h: 1.95,
      fontFace: "Calibri",
      valign: "top",
      paraSpaceAfterPt: 5,
    },
  );

  addFooter(slide, pres);
}

function addScenarioSlide(pres, title, scenario, question, analysis) {
  const slide = pres.addSlide();
  slide.background = { color: C.white };
  addHeader(slide, pres, title, C.navyMid);

  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.4,
    y: 1.16,
    w: 9.15,
    h: 1.55,
    rectRadius: 0.04,
    fill: { color: "FFF8E1" },
    line: { color: C.gold, width: 1.2 },
    shadow: sh(),
  });
  slide.addText("SCENARIO", {
    x: 0.6,
    y: 1.26,
    w: 1.1,
    h: 0.18,
    fontSize: 9,
    bold: true,
    color: C.gold,
    charSpacing: 1,
  });
  slide.addText(scenario, {
    x: 0.6,
    y: 1.55,
    w: 8.7,
    h: 0.95,
    fontSize: 12.8,
    color: C.text,
    fontFace: "Calibri",
    valign: "top",
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4,
    y: 2.95,
    w: 9.15,
    h: 0.5,
    fill: { color: C.blue },
    line: { color: C.blue },
  });
  slide.addText(question, {
    x: 0.58,
    y: 3.01,
    w: 8.85,
    h: 0.34,
    fontSize: 13.2,
    bold: true,
    color: C.white,
    valign: "middle",
  });

  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.4,
    y: 3.65,
    w: 9.15,
    h: 1.44,
    rectRadius: 0.04,
    fill: { color: C.greenLt },
    line: { color: "86EFAC", width: 1 },
  });
  slide.addText("ANALYSIS", {
    x: 0.58,
    y: 3.8,
    w: 1.1,
    h: 0.18,
    fontSize: 9,
    bold: true,
    color: C.green,
    charSpacing: 1,
  });
  slide.addText(analysis, {
    x: 0.58,
    y: 4.05,
    w: 8.72,
    h: 0.86,
    fontSize: 12.2,
    color: C.green,
    fontFace: "Calibri",
    valign: "top",
  });

  addFooter(slide, pres);
}

function addReferenceSlide(pres, refs) {
  const slide = pres.addSlide();
  slide.background = { color: C.white };
  addHeader(slide, pres, "Quick Reference — Key Statutes & Rules");

  refs.forEach((ref, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col === 0 ? 0.4 : 5.1;
    const y = 1.22 + row * 0.7;

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x,
      y,
      w: 4.45,
      h: 0.58,
      rectRadius: 0.03,
      fill: { color: C.offWht },
      line: { color: C.ltGray, width: 0.5 },
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x,
      y,
      w: 1.2,
      h: 0.58,
      fill: { color: ref.color },
      line: { color: ref.color },
    });
    slide.addText(ref.code, {
      x,
      y,
      w: 1.2,
      h: 0.58,
      margin: 0,
      fontSize: 10,
      bold: true,
      color: C.white,
      align: "center",
      valign: "middle",
    });
    slide.addText(ref.label, {
      x: x + 1.28,
      y: y + 0.08,
      w: 3.0,
      h: 0.38,
      fontSize: 11.8,
      color: C.text,
      valign: "middle",
    });
  });

  addFooter(slide, pres);
}

function addReviewSlide(pres, title, points) {
  const slide = pres.addSlide();
  slide.background = { color: C.navy };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 0.14,
    h: 5.625,
    fill: { color: C.gold },
    line: { color: C.gold },
  });
  slide.addText("MODULE REVIEW", {
    x: 0.4,
    y: 0.3,
    w: 9.2,
    h: 0.24,
    fontSize: 11,
    color: C.goldLt,
    bold: true,
    charSpacing: 3,
  });
  slide.addText(title, {
    x: 0.4,
    y: 0.64,
    w: 9.0,
    h: 0.62,
    fontSize: 28,
    bold: true,
    color: C.white,
    fontFace: "Georgia",
  });

  points.forEach((point, index) => {
    const y = 1.45 + index * 0.63;
    slide.addShape(pres.shapes.OVAL, {
      x: 0.42,
      y,
      w: 0.4,
      h: 0.4,
      fill: { color: C.gold },
      line: { color: C.gold },
    });
    slide.addText(String(index + 1), {
      x: 0.42,
      y,
      w: 0.4,
      h: 0.4,
      margin: 0,
      fontSize: 13,
      bold: true,
      color: C.navy,
      align: "center",
      valign: "middle",
    });
    slide.addText(point, {
      x: 1.0,
      y: y + 0.02,
      w: 8.2,
      h: 0.32,
      fontSize: 13.2,
      color: C.white,
      fontFace: "Calibri",
      valign: "middle",
    });
  });

  slide.addText("VAS Security Academy  |  Class D Security Officer Training  |  FDACS-P-01878", {
    x: 0.4,
    y: 5.24,
    w: 9.1,
    h: 0.22,
    fontSize: 8.5,
    color: "AAB7D0",
    align: "center",
  });
}

async function buildDeck() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "OpenAI Codex";
  pres.company = "VAS Security Academy";
  pres.subject = "Class D Security Officer Training";
  pres.title = "Module 1: Legal Aspects of Private Security";
  pres.lang = "en-US";
  pres.theme = {
    headFontFace: "Georgia",
    bodyFontFace: "Calibri",
    lang: "en-US",
  };

  const [icoShield, icoScale, icoGavel, icoEye, icoCheck, icoUniversity] = await Promise.all([
    iconPng(FaShieldAlt, "#C8A951"),
    iconPng(FaBalanceScale, "#C8A951"),
    iconPng(FaGavel, "#C8A951"),
    iconPng(FaEye, "#C8A951"),
    iconPng(FaCheckCircle, "#C8A951"),
    iconPng(FaUniversity, "#C8A951"),
  ]);

  addTitleSlide(
    pres,
    "Legal Aspects of\nPrivate Security",
    "Module 1  •  6 Hours  •  26 Exam Questions  •  Class D Security Officer Training",
    "MODULE 1  |  CLASS D TRAINING",
  );

  const about = pres.addSlide();
  about.background = { color: C.white };
  addHeader(about, pres, "About This Module");
  [
    { x: 0.4, value: "6", label: "Hours", color: C.navy },
    { x: 2.78, value: "26", label: "Exam Questions", color: C.blue },
    { x: 5.16, value: "15.3%", label: "Exam Weight", color: C.navyMid },
    { x: 7.54, value: "75%", label: "Passing Score", color: C.amber },
  ].forEach((card) => {
    about.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: card.x,
      y: 1.2,
      w: 2.06,
      h: 1.15,
      rectRadius: 0.04,
      fill: { color: card.color },
      line: { color: card.color },
      shadow: sh(),
    });
    about.addText(card.value, {
      x: card.x,
      y: 1.34,
      w: 2.06,
      h: 0.42,
      margin: 0,
      fontSize: 25,
      bold: true,
      color: C.white,
      align: "center",
      valign: "middle",
    });
    about.addText(card.label, {
      x: card.x,
      y: 1.86,
      w: 2.06,
      h: 0.18,
      margin: 0,
      fontSize: 10.5,
      color: "E8ECF2",
      align: "center",
    });
  });
  about.addText("Sections Covered", {
    x: 0.45,
    y: 2.72,
    w: 2.0,
    h: 0.22,
    fontSize: 11,
    bold: true,
    color: C.navyMid,
    charSpacing: 1,
  });
  about.addText(
    [
      "Chapter 493, F.S. and Rule 5N-1, F.A.C.",
      "Liability, detention limits, searches, and seizures",
      "Use of force under Chapter 776, F.S.",
      "Incident scene control and evidence preservation",
      "Court testimony, subpoenas, depositions, and demeanor",
      "Equal Employment Opportunity and diversity obligations",
    ].map((text, index) => ({
      text,
      options: {
        bullet: true,
        breakLine: index < 5,
        fontSize: 13,
        color: C.text,
      },
    })),
    {
      x: 0.45,
      y: 3.05,
      w: 9.0,
      h: 2.0,
      fontFace: "Calibri",
      paraSpaceAfterPt: 4,
    },
  );
  addFooter(about, pres);

  addBulletSlide(pres, "Learning Objectives", [
    { type: "heading", text: "By the end of this module, students should be able to:" },
    { text: "Explain the licensing framework created by Chapter 493, Florida Statutes." },
    { text: "Identify licensing requirements, renewals, and common disciplinary violations." },
    { text: "Distinguish criminal liability from civil liability in security work." },
    { text: "Define assault, battery, robbery, trespass, and forcible felony." },
    { text: "Apply Florida's standards for reasonable and deadly force." },
    { text: "Secure an incident scene and preserve evidence properly." },
    { text: "Testify professionally in court, depositions, and administrative hearings." },
    { text: "Understand EEO and diversity responsibilities while on duty." },
  ]);

  addSectionSlide(pres, "1.1", "Chapter 493, Florida Statutes\n& Rule 5N-1, F.A.C.", "~2.5 hrs", icoShield);

  addStatuteSlide(
    pres,
    "Chapter 493, F.S. — Legislative Intent",
    "s. 493.6100",
    "Chapter 493 establishes the regulatory framework for private investigation and security services in Florida, including licensing, training, conduct, and discipline.",
    [
      "FDACS Division of Licensing administers the chapter.",
      "Anyone performing regulated security services for compensation must hold the proper license.",
      "The law exists to protect the public through minimum standards and accountability.",
      "It covers Class D, Class G, Class DI, Class DS, Class B, and related credentials.",
    ],
  );

  addCardGridSlide(pres, "Key Definitions — s. 493.6101, F.S.", [
    {
      term: "Security Officer",
      definition: "An individual employed to perform security services for another, for compensation, on a contractual or assigned basis.",
      color: C.navy,
    },
    {
      term: "Private Investigator",
      definition: "An individual who investigates crimes, persons, or property for a client for compensation.",
      color: C.navyMid,
    },
    {
      term: "Licensee",
      definition: "Any person who holds a current, valid license issued under Chapter 493.",
      color: C.blue,
    },
    {
      term: "Agency",
      definition: "A business entity that employs or contracts licensed security officers or investigators.",
      color: C.slate,
    },
    {
      term: "Contract Security",
      definition: "Security services delivered to clients under contract by a licensed security agency.",
      color: C.amber,
    },
    {
      term: "Class G License",
      definition: "A statewide firearm license that authorizes licensed personnel to carry a firearm while performing regulated duties.",
      color: C.red,
    },
  ]);

  addBulletSlide(pres, "Licensing, Renewal & Discipline", [
    { type: "heading", text: "Initial application basics" },
    { text: "Class D applicants must submit the application, fingerprints, and proof of the required training hours." },
    { text: "Applicants must meet age, identity, and background requirements." },
    { text: "False statements on an application can lead to denial and criminal consequences.", bold: true },
    { type: "heading", text: "Renewal and on-duty rules" },
    { text: "Class D licenses are renewed on a two-year cycle." },
    { text: "Class G holders must also maintain annual firearms requalification." },
    { text: "A license and employer-issued ID card must be carried while on duty." },
    { text: "Working on an expired or inactive license is treated like unlicensed activity.", bold: true },
  ]);

  addSectionSlide(pres, "1.2", "Liability", "~1 hr", icoGavel);

  addTwoColSlide(
    pres,
    "Criminal Liability vs. Civil Liability",
    "CRIMINAL LIABILITY",
    [
      "Violation of a Florida criminal statute.",
      "Prosecuted by the State of Florida.",
      "Penalties may include jail, prison, probation, or fines.",
      "Burden of proof is beyond a reasonable doubt.",
      "Examples include assault, battery, robbery, and unlicensed activity.",
    ],
    "CIVIL LIABILITY",
    [
      "A private wrong that causes injury or loss to another person.",
      "Usually brought by the injured individual or entity.",
      "Penalties usually involve monetary damages or injunctions.",
      "Burden of proof is preponderance of the evidence.",
      "Examples include negligence, false imprisonment, and excessive force claims.",
    ],
    C.red,
    C.navy,
  );

  addBulletSlide(pres, "Detention, Searches & Seizures", [
    { type: "heading", text: "Security officers are not law enforcement." },
    { text: "They do not have general police powers and should not describe a detention as an arrest unless a lawful citizen's arrest applies." },
    { text: "Retail theft detention authority is narrow and must be exercised reasonably under Florida law." },
    { text: "Wrongful detention may create false imprisonment liability.", bold: true },
    { type: "heading", text: "Fourth Amendment principles still matter." },
    { text: "The Fourth Amendment primarily restricts government actors, but private security actions may still be challenged if the officer acts like an agent of the state." },
    { text: "Consent, policy, and scope matter; when in doubt, secure the scene and call law enforcement." },
  ]);

  addSectionSlide(pres, "1.3", "Use of Force\nChapter 776, F.S.", "~1 hr", icoScale);

  addStatuteSlide(
    pres,
    "Use of Force in Defense of Person — s. 776.012, F.S.",
    "s. 776.012",
    "Deadly force is justified only when a person reasonably believes it is necessary to prevent imminent death, great bodily harm, or the imminent commission of a forcible felony.",
    [
      "Security officers have citizen-level force authority only.",
      "Reasonableness is judged from the facts known at the time, not hindsight.",
      "The threat must be imminent, not speculative or already over.",
      "Deadly force remains a last resort even when it may be legally justified.",
    ],
  );

  addScenarioSlide(
    pres,
    "Use of Force Scenario",
    "An armed officer at a parking facility sees a robber strike a victim, grab a purse, and run. The suspect is now fleeing, unarmed, and no longer threatening the victim.",
    "Is deadly force justified once the suspect is simply running away with the property?",
    "No. Once the imminent threat to life or great bodily harm has ended, deadly force is no longer justified. The officer should secure the scene, call 911, protect witnesses, and aid the victim.",
  );

  addSectionSlide(pres, "1.4", "Incident Scene &\nEvidence Preservation", "~45 min", icoEye);

  addBulletSlide(pres, "First Responder Duties at the Scene", [
    { type: "heading", text: "Your priorities on arrival" },
    { text: "Protect your own safety first and assess whether the threat is still active." },
    { text: "Call law enforcement and emergency medical services immediately." },
    { text: "Render aid within your training level, including CPR, first aid, or AED support if appropriate." },
    { text: "Establish a perimeter to keep unauthorized people out and preserve the scene." },
    { type: "heading", text: "Evidence preservation" },
    { text: "Do not move, pick up, or handle evidence unless required to save a life." },
    { text: "Record times, observations, witness names, and changes to the scene." },
    { text: "A broken chain of custody can make evidence unusable in court.", bold: true },
  ]);

  addSectionSlide(pres, "1.5", "Court Testimony", "~30 min", icoUniversity);

  addBulletSlide(pres, "Professional Testimony & Courtroom Demeanor", [
    { type: "heading", text: "Preparation" },
    { text: "Review incident reports, notes, logs, and exhibits before appearing." },
    { text: "Understand whether you are appearing for a criminal case, civil case, or administrative hearing." },
    { type: "heading", text: "On the stand" },
    { text: "Tell the truth, answer only the question asked, and never guess." },
    { text: "If you do not know or do not recall, say so honestly." },
    { text: "Speak clearly, stay calm under cross-examination, and maintain professional appearance." },
    { text: "Depositions are sworn testimony too; false statements can amount to perjury.", bold: true },
  ]);

  addReferenceSlide(pres, [
    { code: "s. 493.6100", label: "Legislative intent", color: C.navy },
    { code: "s. 493.6105", label: "Initial application for licensure", color: C.navy },
    { code: "s. 493.6111", label: "License / ID card requirements", color: C.navyMid },
    { code: "s. 493.6113", label: "Renewal application", color: C.navyMid },
    { code: "s. 493.6115", label: "Weapons and firearms", color: C.red },
    { code: "s. 493.6118", label: "Grounds for discipline", color: C.red },
    { code: "s. 493.6120", label: "Violations and penalties", color: C.amber },
    { code: "s. 776.012", label: "Defense of person", color: C.blue },
    { code: "s. 776.031", label: "Defense of property", color: C.blue },
    { code: "s. 776.08", label: "Forcible felony definition", color: C.blue },
    { code: "s. 812.015", label: "Retail theft detention authority", color: C.slate },
    { code: "5N-1.140", label: "Training curriculum guide", color: C.slate },
  ]);

  addReviewSlide(pres, "Module 1 — Key Takeaways", [
    "Chapter 493 is the foundation for licensed private security activity in Florida.",
    "Carry your valid license and agency ID while on duty and stay inside your license scope.",
    "Security officers have citizen-level force authority, not police powers.",
    "Deadly force is tied to imminent danger, not punishment or retaliation.",
    "Scene control, documentation, and evidence preservation protect both investigations and your credibility.",
    "Professional testimony depends on truthful, calm, well-prepared communication.",
  ]);

  const closing = pres.addSlide();
  closing.background = { color: C.navy };
  closing.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 0.14,
    h: 5.625,
    fill: { color: C.gold },
    line: { color: C.gold },
  });
  closing.addText("END OF MODULE 1", {
    x: 0.42,
    y: 0.42,
    w: 9.0,
    h: 0.24,
    fontSize: 13,
    bold: true,
    color: C.goldLt,
    charSpacing: 3,
  });
  closing.addText("Legal Aspects of\nPrivate Security", {
    x: 0.42,
    y: 0.88,
    w: 8.6,
    h: 1.3,
    fontSize: 36,
    bold: true,
    color: C.white,
    fontFace: "Georgia",
  });
  closing.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.45,
    y: 3.1,
    w: 4.9,
    h: 1.35,
    rectRadius: 0.04,
    fill: { color: C.navyMid },
    line: { color: C.gold, width: 0.75 },
  });
  closing.addText(
    [
      { text: "Written Exam Reminder\n", options: { breakLine: true, bold: true, color: C.gold, fontSize: 12 } },
      { text: "26 questions from Module 1\n", options: { breakLine: true, color: C.white, fontSize: 13 } },
      { text: "Minimum 75% to pass\n", options: { breakLine: true, color: C.white, fontSize: 13 } },
      { text: "Review statutes, force rules, and discipline triggers", options: { color: C.white, fontSize: 13 } },
    ],
    {
      x: 0.68,
      y: 3.34,
      w: 4.45,
      h: 0.9,
      fontFace: "Calibri",
      valign: "top",
    },
  );
  closing.addImage({ data: icoCheck, x: 7.92, y: 2.7, w: 1.15, h: 1.15 });
  closing.addText("VAS Security Academy  |  Class D Security Officer Training  |  FDACS-P-01878", {
    x: 0.42,
    y: 5.24,
    w: 9.0,
    h: 0.24,
    fontSize: 8.5,
    color: "AAB7D0",
    align: "center",
  });

  const outDir = path.resolve(process.cwd(), "outputs");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "VAS_Module1_Legal_Aspects_Class_D.pptx");
  await pres.writeFile({ fileName: outPath });
  console.log(outPath);
}

buildDeck().catch((error) => {
  console.error(error);
  process.exit(1);
});
