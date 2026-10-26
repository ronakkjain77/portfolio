/* Ronak Lodha — portfolio behaviour.
   Everything here is progressive: the page is fully readable without it. */
(() => {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Theme ────────────────────────────────────────────── */
  const root = document.documentElement;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } }
  };

  const systemDark = matchMedia("(prefers-color-scheme: dark)");
  const saved = store.get("theme");
  applyTheme(saved || (systemDark.matches ? "dark" : "light"));

  systemDark.addEventListener("change", (e) => {
    if (!store.get("theme")) applyTheme(e.matches ? "dark" : "light");
  });

  function applyTheme(t) {
    root.dataset.theme = t;
    const btn = $("#themeBtn");
    if (btn) btn.setAttribute("aria-label", `Switch to ${t === "dark" ? "light" : "dark"} theme`);
  }

  $("#themeBtn")?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    store.set("theme", next);
  });

  /* ── Sticky bar + scroll progress ─────────────────────── */
  const topbar = $("#topbar");
  const rule = $("#scrollRule");
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    topbar?.classList.toggle("is-stuck", y > 8);
    if (rule) {
      const max = document.documentElement.scrollHeight - innerHeight;
      rule.style.setProperty("--p", `${max > 0 ? Math.min(100, (y / max) * 100) : 0}%`);
    }
    ticking = false;
  };
  addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ── Mobile sheet ─────────────────────────────────────── */
  const burger = $("#burger");
  const sheet = $("#mobilenav");

  const setSheet = (open) => {
    if (!sheet || !burger) return;
    sheet.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  burger?.addEventListener("click", () => setSheet(sheet.hidden));
  sheet?.addEventListener("click", (e) => { if (e.target.closest("a")) setSheet(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && sheet && !sheet.hidden) setSheet(false); });
  matchMedia("(min-width: 861px)").addEventListener("change", (e) => { if (e.matches) setSheet(false); });

  /* ── Reveal on scroll ─────────────────────────────────── */
  const revealables = $$(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const group = [...(el.parentElement?.children || [])].filter((n) => n.classList.contains("reveal"));
        el.style.transitionDelay = `${Math.min(group.indexOf(el), 6) * 55}ms`;
        el.classList.add("in");
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    revealables.forEach((el) => io.observe(el));
  }

  /* ── Animated stat counters ───────────────────────────── */
  const nums = $$(".num");
  if (!reduced && "IntersectionObserver" in window && nums.length) {
    const numIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        numIO.unobserve(entry.target);
      });
    }, { threshold: .6 });
    nums.forEach((n) => numIO.observe(n));
  }

  function countUp(el) {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || "";
    const dur = 1100;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ── Active section in nav ────────────────────────────── */
  const sections = $$("main section[id]");
  const navLinks = new Map($$(".nav a").map((a) => [a.getAttribute("href")?.slice(1), a]));

  if ("IntersectionObserver" in window && sections.length) {
    const seen = new Set();
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.isIntersecting ? seen.add(e.target.id) : seen.delete(e.target.id));
      navLinks.forEach((a, id) => a.classList.toggle("is-active", seen.has(id)));
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => navIO.observe(s));
  }

  /* ── Accordion: close siblings where [name] is unsupported ── */
  const recs = $$(".rec");
  const supportsName = "name" in HTMLDetailsElement.prototype;
  if (!supportsName) {
    recs.forEach((d) => d.addEventListener("toggle", () => {
      if (d.open) recs.forEach((o) => { if (o !== d) o.open = false; });
    }));
  }

  /* ── Command palette ──────────────────────────────────── */
  const dlg = $("#cmd");
  const input = $("#cmdInput");
  const list = $("#cmdList");

  const items = [
    { n: "01", label: "Now",         hint: "Current role at Iksula", href: "#now" },
    { n: "02", label: "Selected work", hint: "Case studies",         href: "#work" },
    { n: "03", label: "Path",        hint: "Career timeline",        href: "#path" },
    { n: "04", label: "Toolkit",     hint: "Skills by purpose",      href: "#toolkit" },
    { n: "05", label: "Offline",     hint: "Skating & the rest",     href: "#offline" },
    { n: "06", label: "Credentials", hint: "Education & certs",      href: "#credentials" },
    { n: "07", label: "Contact",     hint: "Email & links",          href: "#contact" },
    { n: "↗",  label: "LinkedIn",    hint: "in/ronak-lodha",         href: "https://www.linkedin.com/in/ronak-lodha", ext: true },
    { n: "↗",  label: "GitHub",      hint: "ronakkjain77",           href: "https://github.com/ronakkjain77", ext: true },
    { n: "↓",  label: "Résumé",      hint: "PDF download",           href: "assets/resume.pdf", dl: true }
  ];

  let active = 0;

  function render(filter = "") {
    if (!list) return;
    const q = filter.trim().toLowerCase();
    const hits = items.filter((i) => !q || `${i.label} ${i.hint}`.toLowerCase().includes(q));
    active = 0;
    list.innerHTML = hits.length
      ? hits.map((i, idx) => `<li role="option" aria-selected="${idx === 0}">
           <button type="button" data-href="${i.href}" ${i.ext ? 'data-ext="1"' : ""} ${i.dl ? 'data-dl="1"' : ""} aria-selected="${idx === 0}">
             <em>${i.n}</em>${i.label}<span>${i.hint}</span>
           </button></li>`).join("")
      : `<li class="cmd__empty">Nothing matches that.</li>`;
  }

  function go(btn) {
    if (!btn) return;
    const href = btn.dataset.href;
    dlg?.close();
    if (btn.dataset.ext) { window.open(href, "_blank", "noopener"); return; }
    if (btn.dataset.dl) { const a = document.createElement("a"); a.href = href; a.download = ""; a.click(); return; }
    document.querySelector(href)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }

  function openCmd() {
    if (!dlg?.showModal) return;
    render("");
    dlg.showModal();
    if (input) { input.value = ""; input.focus(); }
  }

  $("#cmdOpen")?.addEventListener("click", openCmd);
  input?.addEventListener("input", () => render(input.value));

  list?.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (btn) { e.preventDefault(); go(btn); }
  });

  dlg?.addEventListener("keydown", (e) => {
    const btns = $$("button", list);
    if (!btns.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      active = (active + (e.key === "ArrowDown" ? 1 : -1) + btns.length) % btns.length;
      btns.forEach((b, i) => {
        const on = i === active;
        b.setAttribute("aria-selected", String(on));
        b.parentElement?.setAttribute("aria-selected", String(on));
        if (on) b.scrollIntoView({ block: "nearest" });
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(btns[active]);
    }
  });

  addEventListener("keydown", (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
    if (typing) return;
    if (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
      e.preventDefault();
      dlg?.open ? dlg.close() : openCmd();
    }
  });

  /* ── Footer year ──────────────────────────────────────── */
  const yr = $("#yr");
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
