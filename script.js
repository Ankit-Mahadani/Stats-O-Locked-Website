document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       NAV + SECTION SWITCHING
       ============================================================ */
    const navItems   = document.querySelectorAll('.nav-item');
    const sections   = document.querySelectorAll('.page-section');
    const indicator  = document.getElementById('nav-indicator');

    function updateIndicator(activeBtn) {
        const rect    = activeBtn.getBoundingClientRect();
        const navRect = activeBtn.parentElement.getBoundingClientRect();
        indicator.style.width = `${rect.width}px`;
        indicator.style.left  = `${rect.left - navRect.left}px`;
    }

    // Dialogue per tab
    const dialogue = {
        home   : "👋 Welcome! I'm Statsy — your data-savvy companion!",
        about  : "🎯 Our Vision drives everything we do!",
        events : "🗓️ Events incoming… calculating ETA!",
        contact: "📡 Ready to receive your signals!"
    };

    navItems.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            if (btn.classList.contains('active')) return;

            navItems.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateIndicator(btn);

            sections.forEach(sec => {
                sec.classList.toggle('active', sec.id === targetId);
            });

            typeDialogue(dialogue[targetId] || "🤖 Processing...");
        });
    });

    // Init indicator
    const initBtn = document.querySelector('.nav-item.active');
    if (initBtn) setTimeout(() => updateIndicator(initBtn), 300);
    window.addEventListener('resize', () => {
        const a = document.querySelector('.nav-item.active');
        if (a) updateIndicator(a);
    });

    /* ============================================================
       MASCOT ELEMENTS
       ============================================================ */
    const mascot      = document.getElementById('mascot');
    const speechBubble= document.getElementById('speech-bubble');
    const speechText  = document.getElementById('speech-text');
    const leftPupil   = document.getElementById('left-pupil');
    const rightPupil  = document.getElementById('right-pupil');
    const leftShine   = document.getElementById('left-eye-shine');
    const rightShine  = document.getElementById('right-eye-shine');

    /* ============================================================
       TYPEWRITER SPEECH BUBBLE
       ============================================================ */
    let speechTimeout;
    let typeInterval;

    function typeDialogue(text, duration = 6000) {
        clearTimeout(speechTimeout);
        clearInterval(typeInterval);

        speechBubble.classList.remove('hidden');
        speechText.textContent = '';

        let i = 0;
        typeInterval = setInterval(() => {
            speechText.textContent += text[i];
            i++;
            if (i >= text.length) clearInterval(typeInterval);
        }, 38);

        speechTimeout = setTimeout(() => {
            speechBubble.classList.add('hidden');
        }, duration);
    }

    // Welcome on load
    setTimeout(() => typeDialogue("🌟 Welcome to Stats O Locked! I'm Statsy!", 8000), 1200);

    // Hover interaction
    mascot.addEventListener('mouseenter', () => {
        typeDialogue("Boop! 🤖 Show me the data!", 4000);
    });

    // Random chatter
    const randomChats = [
        "📊 Correlation ≠ Causation... but still cool!",
        "✋ Point of Information!",
        "🧠 Training neural net… accuracy: 99.8%",
        "🌍 The delegate yields the floor!",
        "🔐 Stats unlocked — insight achieved.",
        "📉 Outliers detected... investigating!",
        "🤝 Diplomacy + Data = 🏆",
        "💡 Insight loading… 98%… 99%… done!",
        "🎙️ Preparing opening statement…",
    ];
    setInterval(() => {
        if (speechBubble.classList.contains('hidden') && Math.random() > 0.55) {
            const msg = randomChats[Math.floor(Math.random() * randomChats.length)];
            typeDialogue(msg, 5500);
        }
    }, 15000);

    /* ============================================================
       EYE TRACKING — pupils follow the cursor
       ============================================================ */
    const svgEl      = document.getElementById('statsy-svg');
    // Eye centres in SVG coordinate space
    const EYES = [
        { pupil: leftPupil,  shine: leftShine,  cx: 69, cy: 56, maxR: 2.5 },
        { pupil: rightPupil, shine: rightShine, cx: 111, cy: 56, maxR: 2.5 },
    ];

    document.addEventListener('mousemove', (e) => {
        if (!svgEl) return;

        const svgRect = svgEl.getBoundingClientRect();
        const svgW    = svgRect.width;
        const svgH    = svgRect.height;
        const vbW     = 180;
        const vbH     = 280;

        // Mouse position in SVG viewBox coords
        const mx = ((e.clientX - svgRect.left) / svgW) * vbW;
        const my = ((e.clientY - svgRect.top)  / svgH) * vbH;

        EYES.forEach(({ pupil, shine, cx, cy, maxR }) => {
            const dx    = mx - cx;
            const dy    = my - cy;
            const angle = Math.atan2(dy, dx);
            const dist  = Math.min(Math.hypot(dx, dy) / 30, 1); // normalise
            const px    = cx + Math.cos(angle) * maxR * dist;
            const py    = cy + Math.sin(angle) * maxR * dist;

            pupil.setAttribute('cx', px.toFixed(2));
            pupil.setAttribute('cy', py.toFixed(2));
            shine.setAttribute('cx', (px + 1).toFixed(2));
            shine.setAttribute('cy', (py - 1.5).toFixed(2));
        });
    });

    /* ============================================================
       CLICK MASCOT — do a little happy bounce + confetti chatter
       ============================================================ */
    const clickPhrases = [
        "⚡ Statsy ACTIVATED!",
        "🚀 Data to the moon!",
        "📈 Uptrend confirmed!",
        "🤯 Mind = Blown!",
        "🎉 Let's get analytical!",
    ];
    let clickIdx = 0;
    mascot.addEventListener('click', () => {
        typeDialogue(clickPhrases[clickIdx % clickPhrases.length], 4000);
        clickIdx++;
        // Quick bounce via class toggle
        mascot.style.animation = 'none';
        void mascot.offsetWidth;
        mascot.style.animation = 'statsy-bounce 0.5s cubic-bezier(0.34,1.56,0.64,1), statsy-float 4s ease-in-out 0.5s infinite';
    });

    // inject bounce keyframe dynamically once
    if (!document.getElementById('statsy-bounce-kf')) {
        const style = document.createElement('style');
        style.id = 'statsy-bounce-kf';
        style.textContent = `
            @keyframes statsy-bounce {
                0%   { transform: translateY(0); }
                40%  { transform: translateY(-30px) scale(1.05); }
                70%  { transform: translateY(-10px) scale(0.97); }
                100% { transform: translateY(0)  scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    /* ============================================================
       ANIMATED PARTICLE CANVAS (floating data dots)
       ============================================================ */
    const canvas = document.getElementById('particle-canvas');
    const ctx    = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const PARTICLE_COUNT = 60;
    const particles = [];

    function randBetween(a, b) { return a + Math.random() * (b - a); }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x   : randBetween(0, window.innerWidth),
            y   : randBetween(0, window.innerHeight),
            r   : randBetween(1, 3),
            vx  : randBetween(-0.3, 0.3),
            vy  : randBetween(-0.5, -0.1),
            alpha: randBetween(0.2, 0.8),
            hue : Math.random() > 0.5 ? '#4facfe' : '#ffd200',
        });
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.hue;
            ctx.globalAlpha = p.alpha;
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;

            // Wrap around
            if (p.y < -10) { p.y = canvas.height + 10; p.x = randBetween(0, canvas.width); }
            if (p.x < -10) p.x = canvas.width  + 10;
            if (p.x > canvas.width  + 10) p.x = -10;
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(drawParticles);
    }
    drawParticles();

});
