(function () {
  const trigger = document.getElementById("ai-tools-trigger");
  const menu = document.getElementById("ai-tools-menu");
  if (trigger && menu) {
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      menu.classList.toggle("hidden");
    });
    document.addEventListener("click", () => menu.classList.add("hidden"));
  }

  const themeOrder = ["light", "dark", "system"];
  const toggleButton = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    const isDark =
      theme === "dark" ||
      (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("cvstudio:theme", theme);
  }

  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      const current = localStorage.getItem("cvstudio:theme") || "system";
      const next = themeOrder[(themeOrder.indexOf(current) + 1) % themeOrder.length];
      applyTheme(next);
    });
  }
})();
