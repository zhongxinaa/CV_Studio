function printElementInNewWindow(element, documentTitle) {
  const printWindow = window.open("", "_blank", "width=850,height=1100");
  if (!printWindow) return false;

  const styles = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n");
      } catch {
        return "";
      }
    })
    .join("\n");

  printWindow.document.open();
  printWindow.document.write(
    `<!DOCTYPE html><html><head><meta charset="utf-8" />` +
      `<title>${documentTitle}</title>` +
      `<base href="${window.location.origin}/" />` +
      `<style>${styles}</style>` +
      `<style>@page{size:letter;margin:0;}html,body{margin:0;padding:0;}</style>` +
      `</head><body>${element.innerHTML}</body></html>`,
  );
  printWindow.document.close();

  const triggerPrint = () => {
    printWindow.focus();
    printWindow.print();
  };

  if (printWindow.document.readyState === "complete") {
    triggerPrint();
  } else {
    printWindow.addEventListener("load", triggerPrint, { once: true });
  }

  return true;
}
