import { PDFDocument, StandardFonts, rgb, type PDFImage } from "pdf-lib";
import type { PDFPage, PDFFont } from "pdf-lib";
import { StudentData } from "./types";
import { formatDate } from "./utils";
import moment from "moment";
import { Nullable } from "@/lib/types";

// A4 dimensions in points (1 point = 1/72 inch)
const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const MARGIN_LEFT = 42.52; // 15mm
const MARGIN_RIGHT = 42.52; // 15mm
const MARGIN_TOP = 56.7; // 20mm
const MARGIN_BOTTOM = 28.35; // 10mm
const CONTENT_WIDTH = A4_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
// const CONTENT_HEIGHT = A4_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;

interface PDFContext {
  doc: PDFDocument;
  currentPage: PDFPage;
  font: PDFFont;
  boldFont: PDFFont;
  currentY: number;
  pageNumber: number;
}

export default async function createStudentProfilePdf(
  studentData: StudentData,
) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Create first page
  const firstPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

  const context: PDFContext = {
    doc: pdfDoc,
    currentPage: firstPage,
    font,
    boldFont,
    currentY: A4_HEIGHT - MARGIN_TOP,
    pageNumber: 1,
  };

  // Add document header
  addHeader(context);

  // Add personal information section
  await addPersonalInformation(context, studentData);

  // Add next of kin information
  addNextOfKinInformation(context, studentData);

  // Add education summary
  addEducationSummary(context, studentData);

  // Add higher institutions
  addInstitutionSection(
    context,
    studentData.higher_institutions,
    "Higher Institution Education",
  );

  // Add secondary schools
  addInstitutionSection(
    context,
    studentData.secondary_schools,
    "Secondary School Education",
    "School",
  );

  // Add other education
  addInstitutionSection(
    context,
    studentData.other_education,
    "Other Education & Certifications",
  );

  // Add footer to final page
  addFooter(context);

  return await pdfDoc.save();
}

function addText(
  context: PDFContext,
  text: string,
  x: number,
  fontSize: number = 10,
  isBold: boolean = false,
  color: [number, number, number] = [0, 0, 0],
): void {
  const font = isBold ? context.boldFont : context.font;
  context.currentPage.drawText(text, {
    x: MARGIN_LEFT + x,
    y: context.currentY,
    size: fontSize,
    font,
    color: rgb(color[0], color[1], color[2]),
  });
}

function addHeader(context: PDFContext): void {
  // Main title
  addText(
    context,
    "STUDENT PROFILE DOCUMENT",
    CONTENT_WIDTH / 2 - 120,
    18,
    true,
    [0.1, 0.1, 0.1],
  );
  context.currentY -= 18;

  // Subtitle
  addText(
    context,
    "Official Academic Record",
    CONTENT_WIDTH / 2 - 70,
    12,
    false,
    [0.4, 0.4, 0.4],
  );
  context.currentY -= 15;

  // Header line
  context.currentPage.drawLine({
    start: { x: MARGIN_LEFT, y: context.currentY },
    end: { x: MARGIN_LEFT + CONTENT_WIDTH, y: context.currentY },
    thickness: 2,
    color: rgb(0.2, 0.2, 0.2),
  });
  context.currentY -= 40;
}

function addNewPage(context: PDFContext): void {
  context.currentPage = context.doc.addPage([A4_WIDTH, A4_HEIGHT]);
  context.currentY = A4_HEIGHT - MARGIN_TOP;
  context.pageNumber++;
}

function checkPageOverflow(context: PDFContext, requiredHeight: number): void {
  if (context.currentY - requiredHeight < MARGIN_BOTTOM + 50) {
    // 50 points buffer for footer
    addFooter(context);
    addNewPage(context);
  }
}

function addSectionHeader(context: PDFContext, title: string): void {
  checkPageOverflow(context, 40);

  // Add section title
  addText(context, title.toUpperCase(), 0, 14, true, [
    98 / 255,
    169 / 255,
    220 / 255,
  ]);
  context.currentY -= 5;

  // Add underline
  context.currentPage.drawLine({
    start: { x: MARGIN_LEFT, y: context.currentY },
    end: { x: MARGIN_LEFT + CONTENT_WIDTH, y: context.currentY },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });
  context.currentY -= 18;
}

function addProfileItem(
  context: PDFContext,
  label: string,
  value: Nullable<string>,
  x: number = 0,
  labelWidth: number = 100,
): void {
  const displayValue = value || "-";
  addText(context, `${label}:`, x, 10, false, [0.4, 0.4, 0.4]);
  addText(context, displayValue, x + labelWidth, 10, true, [0.3, 0.3, 0.3]);
}

function addRelatedProfileItem(
  items: Array<{ label: string; value: Nullable<string> }>,
  context: PDFContext,
) {
  items.forEach((item) => {
    checkPageOverflow(context, 20);
    addProfileItem(context, item.label, item.value, 0, 90);
    context.currentY -= 18;
  });
  context.currentY -= 16;
}

async function embedImage(
  context: PDFContext,
  imageUrl: string,
): Promise<PDFImage | null> {
  if (!imageUrl) return null;
  try {
    const response = await fetch(
      imageUrl.replace("/upload/", "/upload/c_fill,g_face,w_220,h_220/"),
    );
    if (!response.ok) return null;

    const imageBytes = await response.arrayBuffer();
    let image: PDFImage;

    // Try to determine image type from URL or content
    if (imageUrl.toLowerCase().match(/\.(jpg|jpeg)$/)) {
      image = await context.doc.embedJpg(imageBytes);
    } else {
      // Default to PNG
      image = await context.doc.embedPng(imageBytes);
    }

    return image;
  } catch {
    return null;
  }
}

async function addPersonalInformation(
  context: PDFContext,
  studentData: StudentData,
): Promise<void> {
  addSectionHeader(context, "Personal Information");

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
    {
      label: "Address",
      value: studentData.address,
    },
  ];

  // Save the current Y position for image positioning
  const initialY = context.currentY;

  // Add personal information items
  addRelatedProfileItem(personalItems, context);

  // Add profile picture if available
  if (studentData.profile_picture_url) {
    const image = await embedImage(context, studentData.profile_picture_url);
    if (image) {
      // Image dimensions (160x160px)
      const imageSize = 120; // 1px = 0.75point
      const imageX = A4_WIDTH - MARGIN_RIGHT - imageSize;
      const imageY = initialY - imageSize + 5; // shift image up a bit

      // Draw the image
      context.currentPage.drawImage(image, {
        x: imageX,
        y: imageY,
        width: imageSize,
        height: imageSize,
      });
    }
  }
}

function addNextOfKinInformation(
  context: PDFContext,
  studentData: StudentData,
): void {
  addSectionHeader(context, "Next of Kin Information");

  const nextOfKinItems = [
    { label: "Name", value: studentData.next_of_kin.name },
    { label: "Phone", value: studentData.next_of_kin.phone },
    { label: "Email", value: studentData.next_of_kin.email },
    { label: "Address", value: studentData.next_of_kin.address },
  ];

  addRelatedProfileItem(nextOfKinItems, context);
}

function addEducationSummary(
  context: PDFContext,
  studentData: StudentData,
): void {
  addSectionHeader(context, "Education Summary");

  const educationItems = [
    { label: "Highest Education", value: studentData.highest_education },
    { label: "Country", value: studentData.highest_edu_country },
    { label: "Grading Scale", value: studentData.highest_edu_grading_scale },
    { label: "Grade Average", value: studentData.highest_edu_grade_average },
  ];

  addRelatedProfileItem(educationItems, context);
}

function addInstitutionSection(
  context: PDFContext,
  institutions: Array<{
    name: string;
    attended_from: string;
    attended_to: string;
    graduation_date: string;
    country: string;
    city: string;
  }>,
  sectionTitle: string,
  institutionLabel: string = "Institution",
): void {
  if (institutions.length === 0) return;

  // Check if we need a new page for this education section
  checkPageOverflow(context, 120);

  addSectionHeader(context, sectionTitle);

  institutions.forEach((institution, index) => {
    checkPageOverflow(context, 90); // Estimate space needed for single institution

    // Left border line
    context.currentPage.drawLine({
      start: { x: MARGIN_LEFT, y: context.currentY + 10 },
      end: {
        x: MARGIN_LEFT,
        y: context.currentY - (institutions.length > 1 ? 60 : 40),
      },
      thickness: 3,
      color: rgb(0.7, 0.7, 0.7),
    });

    // Institution header if multiple
    if (institutions.length > 1) {
      addText(
        context,
        `${institutionLabel} ${index + 1}`,
        15,
        12,
        true,
        [0.3, 0.3, 0.3],
      );
      context.currentY -= 20;
    }

    const institutionItems = [
      { label: institutionLabel, value: institution.name },
      { label: "Country", value: institution.country },
      { label: "City", value: institution.city },
      { label: "Attended From", value: formatDate(institution.attended_from) },
      { label: "Attended To", value: formatDate(institution.attended_to) },
      {
        label: "Graduation Date",
        value: formatDate(institution.graduation_date),
      },
    ];

    // Add items with left margin for border
    institutionItems.forEach((item, itemIndex) => {
      if (itemIndex % 2 === 0) {
        checkPageOverflow(context, 20);
      }

      const x = itemIndex % 2 === 0 ? 15 : CONTENT_WIDTH / 2 + 15;
      addProfileItem(context, item.label, item.value, x, 90);

      if (itemIndex % 2 === 1) {
        context.currentY -= 18;
      }
    });

    // Handle odd number of items
    if (institutionItems.length % 2 === 1) {
      context.currentY -= 18;
    }

    context.currentY -= 15; // Space between institutions
  });

  context.currentY -= 19;
}

function addFooter(context: PDFContext): void {
  const footerY = MARGIN_BOTTOM + 20;

  // Footer line
  context.currentPage.drawLine({
    start: { x: MARGIN_LEFT + 40, y: footerY + 15 },
    end: { x: A4_WIDTH - MARGIN_RIGHT - 40, y: footerY + 15 },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });

  // Confidential notice
  const confidentialText =
    "This document contains confidential student information and should be handled accordingly.";
  const confidentialWidth = context.font.widthOfTextAtSize(confidentialText, 8);
  context.currentPage.drawText(confidentialText, {
    x: MARGIN_LEFT + (CONTENT_WIDTH - confidentialWidth) / 2,
    y: footerY,
    size: 8,
    font: context.font,
    color: rgb(0.7, 0.7, 0.7),
  });

  // Generation date
  const dateText = `Page ${context.pageNumber} - Generated on ${moment().format("MMMM Do, YYYY")}`;
  const dateWidth = context.font.widthOfTextAtSize(dateText, 8);
  context.currentPage.drawText(dateText, {
    x: MARGIN_LEFT + (CONTENT_WIDTH - dateWidth) / 2,
    y: footerY - 12,
    size: 8,
    font: context.font,
    color: rgb(0.7, 0.7, 0.7),
  });
}
