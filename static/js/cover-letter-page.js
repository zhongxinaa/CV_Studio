(function () {
  const form = document.getElementById("cover-letter-form");
  const submitBtn = document.getElementById("submit-btn");
  const submitLabel = document.getElementById("submit-label");
  const resultPanel = document.getElementById("result-panel");

  function clearErrors() {
    form.querySelectorAll("[data-error-for]").forEach((el) => {
      el.textContent = "";
      el.classList.add("hidden");
    });
  }

  function setError(field, message) {
    const el = form.querySelector(`[data-error-for="${field}"]`);
    if (el) {
      el.textContent = message;
      el.classList.remove("hidden");
    }
  }

  function validate(values) {
    let ok = true;
    if (values.resumeText.length < 50) {
      setError("resumeText", "Paste at least a few lines of your resume (50+ characters).");
      ok = false;
    }
    if (values.resumeText.length > 20000) {
      setError("resumeText", "Resume text is too long (max 20,000 characters).");
      ok = false;
    }
    if (!values.companyName) {
      setError("companyName", "Company name is required.");
      ok = false;
    }
    if (!values.position) {
      setError("position", "Position is required.");
      ok = false;
    }
    return ok;
  }

  function renderSkeleton() {
    resultPanel.innerHTML = `
      <div class="rounded-xl border p-6 space-y-3 animate-pulse">
        <div class="h-4 w-1/3 rounded bg-muted"></div>
        <div class="h-3 w-full rounded bg-muted"></div>
        <div class="h-3 w-full rounded bg-muted"></div>
        <div class="h-3 w-5/6 rounded bg-muted"></div>
        <div class="h-3 w-full rounded bg-muted"></div>
        <div class="h-3 w-4/6 rounded bg-muted"></div>
      </div>`;
  }

  function renderEmpty() {
    resultPanel.innerHTML = `
      <div class="text-muted-foreground bg-card/50 flex h-full min-h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-8 text-center text-sm">
        Your generated cover letter will appear here.
      </div>`;
  }

  function renderResult(content) {
    resultPanel.innerHTML = `
      <div class="border-primary/20 rounded-xl border bg-card shadow-sm">
        <div class="flex items-center justify-between border-b px-5 py-3">
          <h3 class="flex items-center gap-1.5 text-sm font-semibold">✦ Your cover letter</h3>
          <div class="flex gap-2">
            <button id="copy-btn" class="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted">Copy</button>
            <button id="download-btn" class="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted">Download</button>
          </div>
        </div>
        <div class="max-h-[32rem] overflow-y-auto p-5">
          <p class="text-sm whitespace-pre-wrap"></p>
        </div>
      </div>`;
    resultPanel.querySelector("p").textContent = content;

    resultPanel.querySelector("#copy-btn").addEventListener("click", async () => {
      await navigator.clipboard.writeText(content);
      showToast("Copied to clipboard", "success");
    });
    resultPanel.querySelector("#download-btn").addEventListener("click", () => {
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "cover-letter.txt";
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();

    const values = {
      resumeText: form.resumeText.value.trim(),
      companyName: form.companyName.value.trim(),
      hiringManager: form.hiringManager.value.trim(),
      position: form.position.value.trim(),
      jobDescription: form.jobDescription.value.trim(),
      tone: form.tone.value,
    };

    if (!validate(values)) return;

    submitBtn.disabled = true;
    submitLabel.textContent = "Generating...";
    renderSkeleton();

    try {
      const response = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate cover letter.");
      }
      renderResult(data.content);
    } catch (error) {
      showToast(error.message, "error");
      renderEmpty();
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = "✦ Generate cover letter";
    }
  });
})();
