document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Tech Intro Animation ---
    const introOverlay = document.getElementById('intro-overlay');
    if (introOverlay) {
        setTimeout(() => {
            introOverlay.classList.add('hidden');
            setTimeout(() => {
                introOverlay.style.display = 'none';
            }, 800);
        }, 3000);
    }

    // --- 2. Mobile Navigation Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('open');
        });
    }

    // --- 3. Highlight Active Link ---
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksList = document.querySelectorAll('.nav-links a');
    navLinksList.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        }
    });

    // --- 4. Particles (Three.js) ---
    initParticles();

    // --- 5. Scroll Reveal ---
    const revealElements = document.querySelectorAll('.feature-card, .member-card, .tier-section');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        revealObserver.observe(el);
    });

    const style = document.createElement('style');
    style.innerHTML = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);
});

// --- PARTICLES ENGINE ---
function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Antialias true rakha hai clear dikhne ke liye
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true, 
        antialias: true 
    });

    // Function to handle resize properly
    function resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    window.addEventListener('resize', resize);
    resize(); // Initial call to set full screen

    const geo = new THREE.BufferGeometry();
    const count = 1500; 
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
        pos[i] = (Math.random() - 0.5) * 10;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({ 
        size: 0.02, 
        color: 0x00f0ff, 
        transparent: true, 
        opacity: 0.6 
    });
    
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        points.rotation.y += 0.0008;
        points.rotation.x += 0.0005;
        renderer.render(scene, camera);
    }
    animate();
}

// --- TEAM DATA POPULATION (FIXED) ---
async function fetchData() {
    // 1. Leaderboard (If exists)
    const lbBody = document.getElementById('leaderboard-body');
    if (lbBody) {
        lbBody.innerHTML = `<tr><td>#1</td><td>Aarav Sharma</td><td>45</td><td>88</td><td><strong>538</strong></td></tr>`;
    }

    // 2. Full Team Members List
    const teamMembers = [
        // EXECUTIVE BOARD
        { name: "Shivam Waghule", role: "President", category: "exec", img: "pics/shivam.jpeg" },
        { name: "Ankit Verma", role: "President", category: "exec", img: "" },

        // SECRETARIAT (Ye raha tera missing part)
        { name: "Meera Reddy", role: "General Secretary", category: "sec", img: "" },
        { name: "Alex Reed", role: "Joint Secretary", category: "sec", img: "" },

        // LEADS
        { name: "Kabir Kohl", role: "Technical Lead", category: "leads", img: "" },
        { name: "Sanya Joy", role: "Event Manager", category: "leads", img: "" },

        // CORE
        { name: "Rahul Dev", role: "Core Member", category: "core", img: "" },
        { name: "Priya Das", role: "Core Member", category: "core", img: "" }
    ];

    // Clear and Fill Grids
    const categories = ['exec', 'sec', 'leads', 'core'];
    categories.forEach(cat => {
        const grid = document.getElementById(`${cat}-grid`);
        if (grid) {
            grid.innerHTML = ''; // Pehle purana kachra saaf
            const filtered = teamMembers.filter(m => m.category === cat);
            grid.innerHTML = filtered.map(m => `
                <div class="member-card">
                    <div class="img-circle">
                        <img src="${m.img || 'https://via.placeholder.com/150'}" onerror="this.src='https://via.placeholder.com/150'">
                    </div>
                    <h3>${m.name}</h3>
                    <span class="role">${m.role}</span>
                </div>
            `).join('');
        }
    });
}

window.addEventListener('load', fetchData);
