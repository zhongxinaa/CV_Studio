function showToast(message, variant) {
  variant = variant || "default";
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "fixed bottom-4 right-4 z-50 flex flex-col gap-2";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  const colors =
    variant === "error"
      ? "bg-red-600 text-white"
      : variant === "success"
        ? "bg-green-600 text-white"
        : "bg-card border";
  toast.className = `rounded-md px-4 py-2.5 text-sm shadow-lg ${colors}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}
