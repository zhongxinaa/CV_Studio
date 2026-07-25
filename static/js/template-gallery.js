(function () {
  const PAGE_WIDTH = 816;
  const THUMB_WIDTH = 280;
  const THUMB_SCALE = THUMB_WIDTH / PAGE_WIDTH;
  const THUMB_HEIGHT = Math.round(1056 * THUMB_SCALE);
  const COLOR_SWATCHES = ["#4f46e5", "#0f766e", "#be185d", "#78350f", "#171717", "#1d4ed8", "#b91c1c", "#166534"];
  const FONT_OPTIONS = [
    { label: "Sans", value: "sans" },
    { label: "Serif", value: "serif" },
    { label: "Mono", value: "mono" },
  ];

  let selectedId = TEMPLATE_REGISTRY[0].id;
  let theme = { primaryColor: TEMPLATE_REGISTRY[0].defaultColor, fontFamily: "sans" };

  const cardsEl = document.getElementById("template-cards");
  const outerEl = document.getElementById("scaled-preview-outer");
  const frameEl = document.getElementById("scaled-preview-frame");
  const innerEl = document.getElementById("scaled-preview-inner");
  const nameEl = document.getElementById("selected-template-name");
  const swatchesEl = document.getElementById("color-swatches");
  const fontOptionsEl = document.getElementById("font-options");

  function themeForCard(template) {
    return template.id === selectedId ? theme : { primaryColor: template.defaultColor, fontFamily: "sans" };
  }

  function renderCards() {
    cardsEl.innerHTML = TEMPLATE_REGISTRY.map((template) => {
      const cardTheme = themeForCard(template);
      const borderClass = template.id === selectedId ? "border-primary shadow-md" : "border-transparent hover:border-neutral-300";
      const html = renderResumeTemplate(template.id, cloneSampleResume(), cardTheme);
      return `<button type="button" data-template-id="${template.id}" class="group text-left rounded-xl outline-none">
        <div style="width:${THUMB_WIDTH}px;height:${THUMB_HEIGHT}px" class="overflow-hidden rounded-lg border-2 bg-white shadow-sm transition-all ${borderClass}">
          <div style="width:${PAGE_WIDTH}px;transform:scale(${THUMB_SCALE});transform-origin:top left;">${html}</div>
        </div>
        <p class="mt-2 text-sm font-medium">${template.name}</p>
        <p class="text-muted-foreground text-xs">${template.description}</p>
      </button>`;
    }).join("");

    cardsEl.querySelectorAll("button[data-template-id]").forEach((btn) => {
      btn.addEventListener("click", () => selectTemplate(btn.dataset.templateId));
    });
  }

  function recomputeScaledPreview() {
    const containerWidth = outerEl.offsetWidth;
    const scale = Math.min(1, containerWidth / PAGE_WIDTH);
    const naturalHeight = innerEl.scrollHeight;
    frameEl.style.width = `${PAGE_WIDTH * scale}px`;
    frameEl.style.height = `${naturalHeight * scale}px`;
    innerEl.style.width = `${PAGE_WIDTH}px`;
    innerEl.style.transform = `scale(${scale})`;
    innerEl.style.transformOrigin = "top left";
  }

  function renderPreview() {
    innerEl.innerHTML = renderResumeTemplate(selectedId, cloneSampleResume(), theme);
    recomputeScaledPreview();
  }

  function renderCustomizer() {
    const selected = getTemplateById(selectedId);
    nameEl.textContent = selected.name;

    swatchesEl.innerHTML = COLOR_SWATCHES.map(
      (color) =>
        `<button type="button" data-color="${color}" aria-label="Use color ${color}" class="flex size-7 items-center justify-center rounded-full" style="background-color:${color}">${
          theme.primaryColor.toLowerCase() === color ? '<span class="text-white text-xs">✓</span>' : ""
        }</button>`,
    ).join("");
    swatchesEl.querySelectorAll("button[data-color]").forEach((btn) => {
      btn.addEventListener("click", () => {
        theme = { ...theme, primaryColor: btn.dataset.color };
        renderAll();
      });
    });

    fontOptionsEl.innerHTML = FONT_OPTIONS.map((font) => {
      const active = theme.fontFamily === font.value;
      const fontClass = font.value === "serif" ? "font-serif" : font.value === "mono" ? "font-mono" : "";
      const style = active ? "bg-primary text-primary-foreground" : "border hover:bg-muted";
      return `<button type="button" data-font="${font.value}" class="rounded-md px-3 py-1.5 text-sm ${style} ${fontClass}">${font.label}</button>`;
    }).join("");
    fontOptionsEl.querySelectorAll("button[data-font]").forEach((btn) => {
      btn.addEventListener("click", () => {
        theme = { ...theme, fontFamily: btn.dataset.font };
        renderAll();
      });
    });
  }

  function selectTemplate(templateId) {
    const template = getTemplateById(templateId);
    if (!template) return;
    selectedId = templateId;
    theme = { primaryColor: template.defaultColor, fontFamily: "sans" };
    renderAll();
  }

  function renderAll() {
    renderCards();
    renderPreview();
    renderCustomizer();
  }

  renderAll();
  new ResizeObserver(recomputeScaledPreview).observe(outerEl);
})();
