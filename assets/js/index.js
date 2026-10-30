const root = document.documentElement;


const DEFAULTS = {
    theme: "dark",
    font: "tajawal",
    color: { primary: "#6366f1", secondary: "#8b5cf6", accent: "#a855f7" },
};

const THEME_COLORS = [
    { name: "Indigo", primary: "#6366f1", secondary: "#8b5cf6", accent: "#a855f7" },
    { name: "Blue", primary: "#3b82f6", secondary: "#06b6d4", accent: "#0ea5e9" },
    { name: "Emerald", primary: "#10b981", secondary: "#14b8a6", accent: "#22c55e" },
    { name: "Rose", primary: "#f43f5e", secondary: "#ec4899", accent: "#f97316" },
    { name: "Amber", primary: "#f59e0b", secondary: "#f97316", accent: "#eab308" },
    { name: "Violet", primary: "#8b5cf6", secondary: "#a855f7", accent: "#d946ef" },
    { name: "Cyan", primary: "#06b6d4", secondary: "#0ea5e9", accent: "#3b82f6" },
    { name: "Red", primary: "#ef4444", secondary: "#f97316", accent: "#f43f5e" },
];

const FONTS = ["alexandria", "tajawal", "cairo"];

const themeBtn = document.getElementById("theme-toggle-button");

function applyTheme(theme) {
    root.classList.toggle("dark", theme === "dark");
    if (themeBtn) themeBtn.setAttribute("aria-pressed", String(theme === "dark"));
}

themeBtn?.addEventListener("click", () => {
    const next = root.classList.contains("dark") ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
});

const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const spySections = [...navLinks]
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

function updateActiveLink() {
    const offset = (document.getElementById("header")?.offsetHeight || 80) + 20;
    const pos = window.scrollY + offset;
    let currentId = spySections[0]?.id;

    spySections.forEach((sec) => {
        if (pos >= sec.offsetTop) currentId = sec.id;
    });

    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
        currentId = spySections[spySections.length - 1]?.id;
    }

    navLinks.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === "#" + currentId);
    });
}

const navMenu = document.querySelector(".nav-links");
const mobileBtn = document.querySelector(".mobile-menu-btn");

mobileBtn?.addEventListener("click", () => {
    const open = navMenu.classList.toggle("active");
    mobileBtn.setAttribute("aria-expanded", String(open));
});
navLinks.forEach((a) =>
    a.addEventListener("click", () => {
        navMenu?.classList.remove("active");
        mobileBtn?.setAttribute("aria-expanded", "false");
    })
);

const filterBtns = document.querySelectorAll(".portfolio-filter");
const portfolioItems = document.querySelectorAll(".portfolio-item");


const ACTIVE_FILTER = ["bg-linear-to-r", "from-primary", "to-secondary", "text-white", "hover:shadow-lg", "hover:shadow-primary/50"];
const INACTIVE_FILTER = ["bg-white", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-300", "hover:bg-slate-100", "dark:hover:bg-slate-700", "border", "border-slate-300", "dark:border-slate-700"];

filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterBtns.forEach((b) => {
            b.classList.remove("active", ...ACTIVE_FILTER);
            b.classList.add(...INACTIVE_FILTER);
            b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active", ...ACTIVE_FILTER);
        btn.classList.remove(...INACTIVE_FILTER);
        btn.setAttribute("aria-pressed", "true");

        const filter = btn.dataset.filter;
        portfolioItems.forEach((item) => {
            const show = filter === "all" || item.dataset.category === filter;
            item.style.display = show ? "" : "none";
        });
    });
});

const track = document.getElementById("testimonials-carousel");
const cards = track ? track.querySelectorAll(".testimonial-card") : [];
const nextBtn = document.getElementById("next-testimonial");
const prevBtn = document.getElementById("prev-testimonial");
const indicators = document.querySelectorAll(".carousel-indicator");

let currentSlide = 0;
let testimonialInterval = null;

function cardsPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
}

function maxSlide() {
    return Math.max(0, cards.length - cardsPerView());
}

function showSlide(index) {
    if (!track || !cards.length) return;
    const max = maxSlide();
    if (index > max) index = 0;
    if (index < 0) index = max;
    currentSlide = index;

    const cardWidth = cards[0].offsetWidth;

    const dir = getComputedStyle(track).direction === "rtl" ? 1 : -1;
    track.style.transform = `translateX(${dir * currentSlide * cardWidth}px)`;

    indicators.forEach((dot, i) => {
        const active = i === currentSlide;
        dot.classList.toggle("bg-accent", active);
        dot.classList.toggle("dark:bg-slate-600", !active);
        dot.setAttribute("aria-selected", String(active));
    });
}

const showNextTestimonial = () => showSlide(currentSlide + 1);
const showPrevTestimonial = () => showSlide(currentSlide - 1);

function startAutoplay() {
    clearInterval(testimonialInterval);
    testimonialInterval = setInterval(showNextTestimonial, 5000);
}

nextBtn?.addEventListener("click", () => { showNextTestimonial(); startAutoplay(); });
prevBtn?.addEventListener("click", () => { showPrevTestimonial(); startAutoplay(); });
indicators.forEach((dot) =>
    dot.addEventListener("click", () => {
        showSlide(Number(dot.dataset.index));
        startAutoplay();
    })
);
window.addEventListener("resize", () => showSlide(currentSlide));

const settingsToggle = document.getElementById("settings-toggle");
const settingsSidebar = document.getElementById("settings-sidebar");
const closeSettings = document.getElementById("close-settings");

function setSidebar(open) {
    if (!settingsSidebar) return;
    settingsSidebar.classList.toggle("translate-x-full", !open);
    settingsSidebar.setAttribute("aria-hidden", String(!open));
    settingsToggle?.setAttribute("aria-expanded", String(open));

    if (settingsToggle) {
        settingsToggle.style.right = open ? settingsSidebar.offsetWidth + "px" : "0";
    }
}

settingsToggle?.addEventListener("click", () =>
    setSidebar(settingsSidebar.classList.contains("translate-x-full"))
);
closeSettings?.addEventListener("click", () => setSidebar(false));
document.addEventListener("keydown", (e) => e.key === "Escape" && setSidebar(false));
document.addEventListener("click", (e) => {
    if (
        settingsSidebar &&
        !settingsSidebar.classList.contains("translate-x-full") &&
        !settingsSidebar.contains(e.target) &&
        !settingsToggle.contains(e.target)
    ) setSidebar(false);
});

const colorsGrid = document.getElementById("theme-colors-grid");

function applyColor(c) {
    root.style.setProperty("--color-primary", c.primary);
    root.style.setProperty("--color-secondary", c.secondary);
    root.style.setProperty("--color-accent", c.accent);

    colorsGrid?.querySelectorAll(".color-option").forEach((b) => {
        const active = b.dataset.primary === c.primary;
        b.classList.toggle("ring-2", active);
        b.classList.toggle("ring-offset-2", active);
        b.classList.toggle("ring-primary", active);
        b.setAttribute("aria-checked", String(active));
    });
}


THEME_COLORS.forEach((c) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
        "color-option w-full aspect-square rounded-full border-2 border-white dark:border-slate-800 shadow-md hover:scale-110 transition-transform";
    btn.style.background = `linear-gradient(135deg, ${c.primary}, ${c.secondary})`;
    btn.dataset.primary = c.primary;
    btn.title = c.name;
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-label", c.name);
    btn.addEventListener("click", () => {
        applyColor(c);
        localStorage.setItem("color", JSON.stringify(c));
    });
    colorsGrid?.appendChild(btn);
});

const fontOptions = document.querySelectorAll(".font-option");

function applyFont(font) {
    FONTS.forEach((f) => document.body.classList.remove("font-" + f));
    document.body.classList.add("font-" + font);

    fontOptions.forEach((opt) => {
        const active = opt.dataset.font === font;
        opt.classList.toggle("active", active);
        opt.classList.toggle("border-primary", active);
        opt.setAttribute("aria-checked", String(active));
    });
}

fontOptions.forEach((opt) =>
    opt.addEventListener("click", () => {
        applyFont(opt.dataset.font);
        localStorage.setItem("font", opt.dataset.font);
    })
);

document.getElementById("reset-settings")?.addEventListener("click", () => {
    ["theme", "color", "font"].forEach((k) => localStorage.removeItem(k));
    applyTheme(DEFAULTS.theme);
    applyColor(DEFAULTS.color);
    applyFont(DEFAULTS.font);
});

const scrollTopBtn = document.getElementById("scroll-to-top");

function toggleScrollTop() {
    const show = window.scrollY > 300;
    scrollTopBtn?.classList.toggle("opacity-0", !show);
    scrollTopBtn?.classList.toggle("invisible", !show);
}

scrollTopBtn?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
);

function loadSettings() {
    applyTheme(localStorage.getItem("theme") || DEFAULTS.theme);

    let color = DEFAULTS.color;
    try {
        color = JSON.parse(localStorage.getItem("color")) || DEFAULTS.color;
    } catch { }
    applyColor(color);

    const font = localStorage.getItem("font");
    applyFont(FONTS.includes(font) ? font : DEFAULTS.font);
}

window.addEventListener("scroll", () => {
    updateActiveLink();
    toggleScrollTop();
}, { passive: true });

loadSettings();
updateActiveLink();
toggleScrollTop();
showSlide(0);
startAutoplay();