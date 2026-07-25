(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const pdfBtn = document.getElementById("download-pdf-btn");
    const docxBtn = document.getElementById("download-docx-btn");

    if (pdfBtn) {
      pdfBtn.addEventListener("click", () => {
        const printRoot = document.getElementById("resume-print-root");
        if (!printRoot) {
          showToast("Something went wrong preparing the PDF.", "error");
          return;
        }
        const resume = builderStore.getResume();
        const name = resume.personalInfo.fullName || "Resume";
        const opened = printElementInNewWindow(printRoot, `${name} Resume`);
        if (!opened) {
          showToast("Please allow pop-ups for this site to download the PDF.", "error");
        }
      });
    }

    if (docxBtn) {
      docxBtn.addEventListener("click", async () => {
        const originalText = docxBtn.textContent;
        docxBtn.disabled = true;
        docxBtn.textContent = "Generating...";
        try {
          const resume = builderStore.getResume();
          const response = await fetch("/api/export/docx", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resume }),
          });
          if (!response.ok) throw new Error("Export failed");
          const blob = await response.blob();
          const name = resume.personalInfo.fullName || "resume";
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${name}-resume.docx`;
          link.click();
          URL.revokeObjectURL(url);
        } catch {
          showToast("Something went wrong generating the DOCX file.", "error");
        } finally {
          docxBtn.disabled = false;
          docxBtn.textContent = originalText;
        }
      });
    }
  });
})();
