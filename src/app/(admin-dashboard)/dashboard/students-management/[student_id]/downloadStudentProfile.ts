import createStudentProfileDocx from "./createStudentProfileDOCX";
import createStudentProfilePdf from "./createStudentProfilePDF";
import { StudentData } from "./types";

export async function downloadStudentProfilePdf(studentData: StudentData) {
  // Generate the PDF
  const pdfBytes = await createStudentProfilePdf(studentData);

  // Create a blob from the PDF bytes
  const blob = new Blob([new Uint8Array(pdfBytes)], {
    type: "application/pdf",
  });

  // Create a URL for the blob
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element and trigger download
  const link = document.createElement("a");
  link.href = url;
  // Set the download attribute to the file name
  link.download = `${studentData.first_name}${studentData.middle_name ? `_${studentData.middle_name}` : ""}_${studentData.last_name}_Profile.pdf`;

  // Click link to trigger download
  link.click();

  // Clean up the URL object
  URL.revokeObjectURL(url);
}

export async function printStudentProfilePdf(studentData: StudentData) {
  try {
    // Generate the PDF
    const pdfBytes = await createStudentProfilePdf(studentData);

    // Create a blob URL for the PDF
    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);

    // Create an iframe to load the PDF
    const iframe = document.createElement("iframe");

    // When the iframe loads, trigger print
    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();

        // Clean up after printing
        URL.revokeObjectURL(url);
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 120000); // 2 minutes
      } catch {
        throw new Error("Failed to print PDF");
      }
    };

    // Set the PDF as the iframe's source
    iframe.src = url;

    // Add iframe to the DOM
    iframe.style.display = "none";
    document.body.appendChild(iframe);
  } catch (error) {
    throw error;
  }
}

export async function downloadStudentProfileDocx(studentData: StudentData) {
  const blob = await createStudentProfileDocx(studentData);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${studentData.first_name}${studentData.middle_name ? `_${studentData.middle_name}` : ""}_${studentData.last_name}_Profile.docx`;
  link.click();
  URL.revokeObjectURL(url);
}
