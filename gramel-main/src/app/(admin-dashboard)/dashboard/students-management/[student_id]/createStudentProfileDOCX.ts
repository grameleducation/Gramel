import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  VerticalAlign,
  BorderStyle,
  ImageRun,
  Footer,
  PageNumber,
} from "docx";
import moment from "moment";
import { StudentData } from "./types";
import { formatDate } from "./utils";
import { Nullable } from "@/lib/types";

// small helpers for styles used across the document
const HEADER_FONT = "Helvetica"; // fallback will be used if not available
const TEXT_FONT = "Helvetica";

export default async function createStudentProfileDocx(
  studentData: StudentData,
) {
  const docChildren: (Paragraph | Table)[] = [];

  // Header
  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "STUDENT PROFILE DOCUMENT",
          bold: true,
          size: 36, // 18points -> docx sizes are half-points (18 * 2 = 36)
          font: HEADER_FONT,
          color: "1A1A1A",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 }, // 3pt. 1pt = 20twips
    }),
  );
  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Official Academic Record",
          size: 24,
          font: TEXT_FONT,
          color: "666666",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
    }),
  );

  // thin horizontal line (simulate header line)
  docChildren.push(
    new Paragraph({
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 16, color: "333333" }, // size 8 = 1pt
      },
      spacing: { after: 600 },
    }),
  );

  // PERSONAL INFORMATION SECTION
  docChildren.push(sectionHeaderParagraph("Personal Information"));

  // left: personal items table; right: image (if any)
  const personalItems = [
    { label: "First Name", value: studentData.first_name },
    { label: "Last Name", value: studentData.last_name },
    { label: "Middle Name", value: studentData.middle_name },
    { label: "Date of Birth", value: formatDate(studentData.date_of_birth) },
    { label: "Gender", value: studentData.gender },
    { label: "Marital Status", value: studentData.marital_status },
    { label: "Phone", value: studentData.phone },
    { label: "Email", value: studentData.email },
    { label: "Passport No", value: studentData.passport_no },
    {
      label: "Passport Expiry",
      value: formatDate(studentData.passport_expiry_date),
    },
    { label: "Address", value: studentData.address },
  ];

  // Prepare image if available
  const imageData = studentData.profile_picture_url
    ? await fetchImageData(studentData.profile_picture_url)
    : null;

  // Create a two-column table: left for details, right for image
  const leftCell = new TableCell({
    width: { size: 70, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NIL },
      bottom: { style: BorderStyle.NIL },
      left: { style: BorderStyle.NIL },
      right: { style: BorderStyle.NIL },
    },
    children: labelValueTable(personalItems),
  });

  const rightCell = new TableCell({
    width: { size: 30, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NIL },
      bottom: { style: BorderStyle.NIL },
      left: { style: BorderStyle.NIL },
      right: { style: BorderStyle.NIL },
    },
    children: imageData
      ? [
          new Paragraph({
            children: [
              new ImageRun({
                data: imageData,
                transformation: { width: 120, height: 120 },
                type: studentData.profile_picture_url?.endsWith(".png")
                  ? "png"
                  : "jpg",
              }),
            ],
            alignment: AlignmentType.RIGHT,
          }),
        ]
      : [new Paragraph({ text: "" })],
    verticalAlign: VerticalAlign.TOP,
  });

  const personalTable = new Table({
    rows: [new TableRow({ children: [leftCell, rightCell] })],
    width: { size: 100, type: WidthType.PERCENTAGE },
    margins: { top: 0, bottom: 0 },
  });

  docChildren.push(personalTable);
  docChildren.push(new Paragraph({ text: "", spacing: { after: 160 } }));

  // NEXT OF KIN
  docChildren.push(sectionHeaderParagraph("Next of Kin Information"));

  const nokItems = [
    { label: "Name", value: studentData.next_of_kin?.name },
    { label: "Phone", value: studentData.next_of_kin?.phone },
    { label: "Email", value: studentData.next_of_kin?.email },
    { label: "Address", value: studentData.next_of_kin?.address },
  ];

  docChildren.push(...labelValueTable(nokItems));
  docChildren.push(new Paragraph({ text: "", spacing: { after: 160 } }));

  // EDUCATION SUMMARY
  docChildren.push(sectionHeaderParagraph("Education Summary"));
  const edItems = [
    { label: "Highest Education", value: studentData.highest_education || "-" },
    { label: "Country", value: studentData.highest_edu_country || "-" },
    {
      label: "Grading Scale",
      value: studentData.highest_edu_grading_scale || "-",
    },
    {
      label: "Grade Average",
      value: studentData.highest_edu_grade_average || "-",
    },
  ];
  docChildren.push(...labelValueTable(edItems));
  docChildren.push(new Paragraph({ text: "", spacing: { after: 160 } }));

  // HIGHER INSTITUTIONS
  if (
    Array.isArray(studentData.higher_institutions) &&
    studentData.higher_institutions.length
  ) {
    docChildren.push(sectionHeaderParagraph("Higher Institution Education"));
    studentData.higher_institutions.forEach((inst, idx) => {
      docChildren.push(createInstitutionBlock(inst, idx, "Institution"));
      docChildren.push(new Paragraph({ text: "", spacing: { after: 120 } }));
    });
  }

  // SECONDARY SCHOOLS
  if (
    Array.isArray(studentData.secondary_schools) &&
    studentData.secondary_schools.length
  ) {
    docChildren.push(sectionHeaderParagraph("Secondary School Education"));
    studentData.secondary_schools.forEach((inst, idx) => {
      docChildren.push(createInstitutionBlock(inst, idx, "School"));
      docChildren.push(new Paragraph({ text: "", spacing: { after: 120 } }));
    });
  }

  // OTHER EDUCATION
  if (
    Array.isArray(studentData.other_education) &&
    studentData.other_education.length
  ) {
    docChildren.push(
      sectionHeaderParagraph("Other Education & Certifications"),
    );
    studentData.other_education.forEach((inst, idx) => {
      docChildren.push(createInstitutionBlock(inst, idx));
      docChildren.push(new Paragraph({ text: "", spacing: { after: 120 } }));
    });
  }

  // Footer content (will be added as section footer)
  const generatedOn = moment().format("MMMM Do, YYYY");
  const confidentialText =
    "This document contains confidential student information and should be handled accordingly.";

  const footerParagraphs = [
    new Paragraph({
      border: {
        top: { style: BorderStyle.SINGLE, size: 4, color: "B3B3B3" },
      },
      children: [
        new TextRun({
          text: confidentialText,
          size: 16,
          font: TEXT_FONT,
          color: "B3B3B3",
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated on ${generatedOn} - Page `,
          size: 16,
          font: TEXT_FONT,
          color: "B3B3B3",
        }),
        // Attempt dynamic page number. docx provides PageNumber for this purpose.
        new TextRun({
          children: [PageNumber.CURRENT],
          size: 16,
          font: TEXT_FONT,
          color: "B3B3B3",
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
  ];

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11907, // A4 width in twips
              height: 16840, // A4 height in twips
            },
            margin: {
              top: 720, // MS Word's narrow margin preset. 0.5 inch all round = 720 twips
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        footers: { default: new Footer({ children: footerParagraphs }) },
        children: docChildren,
      },
    ],
  });

  // Return a Blob in browser-ready format
  const blob = await Packer.toBlob(doc);
  return blob;
}

function sectionHeaderParagraph(title: string) {
  // Title uppercase, colored, bold, small underline via bottom border
  return new Paragraph({
    children: [
      new TextRun({
        text: title.toUpperCase(),
        bold: true,
        size: 28,
        font: TEXT_FONT,
        color: "62A9DC",
      }),
    ],
    spacing: { after: 340 },
    alignment: AlignmentType.LEFT,
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 8, color: "B3B3B3" },
    },
  });
}

async function fetchImageData(url: string): Promise<ArrayBuffer | null> {
  try {
    if (!url) return null;
    const resp = await fetch(
      url.replace("/upload/", "/upload/c_fill,g_face,w_220,h_220/"),
    );
    if (!resp.ok) return null;
    return await resp.arrayBuffer();
  } catch {
    return null;
  }
}

function labelValueTable(
  items: Array<{ label: string; value: Nullable<string> }>,
) {
  return items.map(
    (it) =>
      new Paragraph({
        children: [
          new TextRun({
            text: `${it.label}: `,
            size: 24,
            font: TEXT_FONT,
            color: "6B6B6B",
          }),
          new TextRun({
            text: it.value || "-",
            bold: true,
            size: 24,
            font: TEXT_FONT,
          }),
        ],
      }),
  );
}

// Helper to create institution blocks
function createInstitutionBlock(
  inst: StudentData["higher_institutions"][number],
  index?: number,
  labelName = "Institution",
) {
  const headerParagraph = new Paragraph({
    children: [
      new TextRun({
        text: `${labelName} ${index !== undefined ? index + 1 : ""}`,
        bold: true,
        size: 28,
        font: TEXT_FONT,
      }),
    ],
    spacing: { after: 120 },
  });

  const items = [
    { label: labelName, value: inst.name },
    { label: "Country", value: inst.country },
    { label: "City", value: inst.city },
    { label: "Attended From", value: formatDate(inst.attended_from) },
    { label: "Attended To", value: formatDate(inst.attended_to) },
    { label: "Graduation Date", value: formatDate(inst.graduation_date) },
  ];

  // Build a table for these items (two columns per row)
  const itemRows: TableRow[] = [];
  for (let i = 0; i < items.length; i += 2) {
    const left = items[i];
    const right = items[i + 1];

    const leftCell = new TableCell({
      width: { size: 55, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NIL },
        bottom: { style: BorderStyle.NIL },
        left: { style: BorderStyle.NIL },
        right: { style: BorderStyle.NIL },
      },
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: `${left.label}: `,
              size: 24,
              font: TEXT_FONT,
              color: "6B6B6B",
            }),
            new TextRun({
              text: left.value || "-",
              bold: true,
              size: 24,
              font: TEXT_FONT,
            }),
          ],
        }),
      ],
    });

    const rightCell = new TableCell({
      width: { size: 45, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NIL },
        bottom: { style: BorderStyle.NIL },
        left: { style: BorderStyle.NIL },
        right: { style: BorderStyle.NIL },
      },
      children: right
        ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${right.label}: `,
                  size: 24,
                  font: TEXT_FONT,
                  color: "6B6B6B",
                }),
                new TextRun({
                  text: right.value || "-",
                  bold: true,
                  size: 24,
                  font: TEXT_FONT,
                }),
              ],
            }),
          ]
        : [new Paragraph({ text: "" })],
    });

    itemRows.push(new TableRow({ children: [leftCell, rightCell] }));
  }

  // Outer table
  const outer = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NIL },
              bottom: { style: BorderStyle.NIL },
              left: { style: BorderStyle.NIL },
              right: { style: BorderStyle.NIL },
            },
            children: [
              headerParagraph,
              new Table({
                rows: itemRows,
                width: { size: 100, type: WidthType.PERCENTAGE },
              }),
            ],
          }),
        ],
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });

  return outer;
}
