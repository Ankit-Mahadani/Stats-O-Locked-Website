document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('open');
        });
    }

    // Highlight Active Link Strategy
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksList = document.querySelectorAll('.nav-links a');

    navLinksList.forEach(link => {
        const href = link.getAttribute('href');
        // Simple check: if href matches current filename
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });


    // Scroll Reveal Animation (Simple Intersection Observer)
    const revealElements = document.querySelectorAll('.feature-card, .event-showcase, .research-card, .team-card');

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

    // Add 'revealed' class style dynamically if not in CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
});

// Mock Data Population (Will be replaced by Supabase fetching)
async function fetchMockData() {
    console.log("Fetching mock data...");

    // Mock Leaderboard
    const leaderboardBody = document.getElementById('leaderboard-body');
    if (leaderboardBody) {
        const mockLeaderboard = [
            { rank: 1, name: "Aarav Sharma", likes: 45, judgeScore: 88, total: 538 },
            { rank: 2, name: "Sneha Patel", likes: 30, judgeScore: 92, total: 522 },
            { rank: 3, name: "Rohan Gupta", likes: 25, judgeScore: 85, total: 460 },
            { rank: 4, name: "Priya Singh", likes: 40, judgeScore: 78, total: 458 },
            { rank: 5, name: "Vikram Das", likes: 20, judgeScore: 80, total: 380 }
        ];

        leaderboardBody.innerHTML = mockLeaderboard.map(u => `
            <tr>
                <td>#${u.rank}</td>
                <td>${u.name}</td>
                <td>${u.likes}</td>
                <td>${u.judgeScore}</td>
                <td><strong>${u.total}</strong></td>
            </tr>
        `).join('');
    }

    // Mock Team
    const teamGrid = document.getElementById('team-grid');
    if (teamGrid) {
        const mockTeam = [
            { name: "Ankit Verma", role: "President", img: "" },
            { name: "Meera Reddy", role: "Research Lead", img: "" },
            { name: "Kabir Kohl", role: "Tech Lead", img: "" },
            { name: "Sanya Joy", role: "Event Manager", img: "" }
        ];

        teamGrid.innerHTML = mockTeam.map(m => `
            <div class="team-card">
                <div class="team-img" style="background-color: #222;"></div>
                <h3>${m.name}</h3>
                <span class="role">${m.role}</span>
            </div>
        `).join('');
    }
}

// Call data fetch on load
window.addEventListener('load', fetchMockData);

// Tab Switching Logic
document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding content
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
});
