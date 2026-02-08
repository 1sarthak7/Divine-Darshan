// --- SETUP ---
gsap.registerPlugin(ScrollTrigger);
const lenis = new Lenis({ duration: 1.2, smooth: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// --- 1. MAGNETIC BUTTON EFFECT ---
const btnWrap = document.querySelector('.magnetic-wrap');
const btn = document.querySelector('.enter-btn');

if(btnWrap) {
    btnWrap.addEventListener('mousemove', (e) => {
        const rect = btnWrap.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Move button slightly towards cursor
        gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
    });

    btnWrap.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    });
}

// --- 2. ENTER ANIMATION SEQUENCE ---
const enterBtn = document.getElementById('enter-btn');
const gate = document.getElementById('gate');
const audio = document.getElementById('ambient-sound');

enterBtn.addEventListener('click', () => {
    // Audio
    audio.volume = 0;
    audio.play().then(() => gsap.to(audio, { volume: 0.5, duration: 4 }));

    // Gate Exit
    const tl = gsap.timeline();
    tl.to(".gate-content", { y: -50, opacity: 0, duration: 1, ease: "power2.in" })
      .to(gate, { opacity: 0, duration: 1, onComplete: () => gate.style.display = 'none' })
      .add(() => initMainAnimations()); // Start site animations
});

// --- 3. MAIN SITE ANIMATIONS ---
function initMainAnimations() {
    
    // A. HERO: NAMASTE BLUR REVEAL
    // It starts blurry and large, then focuses and settles
    gsap.to(".hero-sanskrit", {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        duration: 2.5,
        ease: "power2.out"
    });

    // B. HERO TEXT LINES REVEAL (Staggered slide up)
    gsap.from(".hero-eng .reveal-text", {
        y: 50,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        delay: 1,
        ease: "power3.out"
    });

    // C. SPLIT TEXT ANIMATION FOR SECTIONS
    // Split titles into characters for cool effect
    const splitTypes = document.querySelectorAll('.char-anim');
    splitTypes.forEach((char, i) => {
        const text = new SplitType(char, { types: 'chars' });
        
        gsap.from(text.chars, {
            scrollTrigger: {
                trigger: char,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            stagger: 0.05,
            duration: 1,
            ease: "back.out(1.7)"
        });
    });

    // D. STANDARD REVEAL TEXT (Paragraphs etc)
    const revealTexts = document.querySelectorAll('.reveal-text:not(.hero-eng .reveal-text)');
    revealTexts.forEach(text => {
        gsap.from(text, {
            scrollTrigger: {
                trigger: text,
                start: "top 85%",
            },
            y: 30,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });
    });

    // E. IMAGE PARALLAX
    document.querySelectorAll('.section.deity').forEach(section => {
        gsap.fromTo(section.querySelector('img'), 
            { scale: 1.2, yPercent: -10 },
            { 
                scale: 1, yPercent: 10,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            }
        );
    });

    // F. FOOTER
    gsap.to(".peace", {
        opacity: 1,
        letterSpacing: "20px", // Expand letter spacing on reveal
        duration: 3,
        scrollTrigger: { trigger: ".footer", start: "top 70%" }
    });
}

// --- 4. FLUID CANVAS (The Spirit) ---
const canvas = document.getElementById('fluid-canvas');
const ctx = canvas.getContext('2d');
let w, h;

function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

const orbs = [];
for(let i=0; i<6; i++) {
    orbs.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 200 + 100
    });
}

function animateCanvas() {
    ctx.clearRect(0,0,w,h);
    // Additive blending for "light" feel
    ctx.globalCompositeOperation = 'screen'; 
    
    orbs.forEach(o => {
        o.x += o.vx; o.y += o.vy;
        if(o.x < -o.r || o.x > w + o.r) o.vx *= -1;
        if(o.y < -o.r || o.y > h + o.r) o.vy *= -1;

        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, 'rgba(212, 175, 55, 0.15)'); // Gold center
        g.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(animateCanvas);
}
animateCanvas();

// --- 5. CURSOR LOGIC ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorCircle = document.querySelector('.cursor-circle');
let mouseX = 0, mouseY = 0;
let dotX = 0, dotY = 0;
let circX = 0, circY = 0;

document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

function animateCursor() {
    dotX += (mouseX - dotX) * 0.2; dotY += (mouseY - dotY) * 0.2;
    circX += (mouseX - circX) * 0.1; circY += (mouseY - circY) * 0.1;
    
    cursorDot.style.left = `${dotX}px`; cursorDot.style.top = `${dotY}px`;
    cursorCircle.style.left = `${circX}px`; cursorCircle.style.top = `${circY}px`;
    
    requestAnimationFrame(animateCursor);
}
animateCursor();