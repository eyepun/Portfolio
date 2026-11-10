from pathlib import Path
import re

html_path = Path("/mnt/data/portfolio_with_separate_css.html")
html = html_path.read_text(encoding="utf-8")

js = r"""// Portfolio JavaScript
// 1) เลื่อนหน้าอย่างนุ่มนวลเมื่อกดเมนู
// 2) ไฮไลต์เมนูตามหน้าที่กำลังอ่าน
// 3) เพิ่มปุ่มพิมพ์ / บันทึกเป็น PDF

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("nav a[href^='#']");
  const sections = [...navLinks]
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  // Smooth scrolling
  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Highlight the current section in the navigation
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "page");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-25% 0px -60% 0px" });

    sections.forEach(section => observer.observe(section));
  }

  // Add a print / save as PDF button
  const nav = document.querySelector("nav");
  if (nav && !document.querySelector("#printPortfolio")) {
    const printButton = document.createElement("button");
    printButton.id = "printPortfolio";
    printButton.type = "button";
    printButton.textContent = "พิมพ์ / บันทึก PDF";
    printButton.addEventListener("click", () => window.print());
    printButton.style.cssText = [
      "border:0",
      "border-radius:20px",
      "padding:8px 14px",
      "background:#2f75b9",
      "color:#fff",
      "font:inherit",
      "font-size:13px",
      "cursor:pointer"
    ].join(";");
    nav.appendChild(printButton);
  }
});
"""
js_path = Path("/mnt/data/script.js")
js_path.write_text(js, encoding="utf-8")

# Add active-link styling and connect the external JS file.
if 'script.js' not in html:
    html = html.replace("</head>", """<style>
nav a.active { color:#173b68; font-weight:700; text-decoration:underline; }
nav button:focus-visible, nav a:focus-visible { outline:3px solid #8bc7f0; outline-offset:3px; }
</style>
<script src="script.js" defer></script>
</head>""")
integrated_path = Path("/mnt/data/portfolio_html_css_js.html")
integrated_path.write_text(html, encoding="utf-8")

print(f"สร้างไฟล์ JavaScript แล้ว: {js_path} ({js_path.stat().st_size:,} bytes)")
print(f"สร้างไฟล์ HTML ที่เชื่อม CSS และ JS แล้ว: {integrated_path}")
