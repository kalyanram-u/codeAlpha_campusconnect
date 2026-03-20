document.addEventListener('DOMContentLoaded', () => {
    const ADMIN_EMAIL = "kalyan@campus.com";
    const ADMIN_PASS = "kalyan123";

    const mainBtn = document.getElementById('main-btn');
    const authToggle = document.getElementById('auth-toggle');
    const authSection = document.getElementById('auth-section');
    const dashboardContent = document.getElementById('dashboard-content');
    const adminPanel = document.getElementById('admin-panel');
    const newsGrid = document.getElementById('news-grid');
    const userGreeting = document.getElementById('user-greeting');
    const searchInput = document.getElementById('search-input');
    
    let isLoginMode = true;
    let currentUserIsAdmin = false;

    authToggle.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        document.getElementById('auth-title').innerText = isLoginMode ? "Welcome Back" : "Create Account";
        mainBtn.innerText = isLoginMode ? "Log In" : "Register Now";
        authToggle.innerText = isLoginMode ? "Create Account" : "Log In";
    });

    mainBtn.addEventListener('click', () => {
        const user = document.getElementById('user-id').value.trim();
        const pass = document.getElementById('password').value.trim();
        if (!user || !pass) return alert("Please fill all fields!");

        let users = JSON.parse(localStorage.getItem('campusUsers')) || {};

        if (isLoginMode) {
            if (user.toLowerCase() === ADMIN_EMAIL && pass === ADMIN_PASS) {
                enterDashboard(true, "Administrator");
            } else if (users[user] && users[user] === pass) {
                enterDashboard(false, user);
            } else {
                alert("Invalid password!");
            }
        } else {
            users[user] = pass;
            localStorage.setItem('campusUsers', JSON.stringify(users));
            alert("Account Created!");
            authToggle.click();
        }
    });

    function enterDashboard(isAdmin, name) {
        currentUserIsAdmin = isAdmin;
        userGreeting.innerText = `Hello, ${name}!`;
        authSection.style.display = "none";
        dashboardContent.style.display = "block";
        adminPanel.style.display = isAdmin ? "block" : "none";
        loadNews();
    }

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.block').forEach(b => {
            b.style.display = b.innerText.toLowerCase().includes(term) ? "block" : "none";
        });
    });

    function loadNews() {
        const defaults = [
            { id: 1, title: "AI Workshop - ", category: "seminar-label", icon: "🎓" },
            { id: 2, title: "Mid-terms: ", category: "exam-label", icon: "📝" },
            { id: 3, title: "Annual Day Practice:", category: "fest-label", icon: "🎸" },
            { id: 4, title: "Holiday on Sunday", category: "notice-label", icon: "📢" }
        ];
        
        let saved = JSON.parse(localStorage.getItem('campusNews'));
        if (!saved || saved.length === 0) {
            saved = defaults;
            localStorage.setItem('campusNews', JSON.stringify(defaults));
        }

        newsGrid.innerHTML = '';
        saved.sort((a, b) => b.id - a.id).forEach(item => {
            const div = document.createElement('div');
            div.className = `block ${item.category}`;
            const delBtn = currentUserIsAdmin ? `<button class="del-btn" onclick="deleteItem(${item.id})">×</button>` : '';
            div.innerHTML = `${delBtn}<div class="icon">${item.icon}</div><h3>${item.category.split('-')[0].toUpperCase()}</h3><p>${item.title}</p>`;
            newsGrid.appendChild(div);
        });
    }

    document.getElementById('post-news-btn').addEventListener('click', () => {
        const text = document.getElementById('news-input').value.trim();
        const cat = document.getElementById('news-category').value;
        if(!text) return;
        const iconMap = {'seminar-label':'🎓','exam-label':'📝','fest-label':'🎸','notice-label':'📢'};
        let saved = JSON.parse(localStorage.getItem('campusNews')) || [];
        saved.push({ id: Date.now(), title: text, category: cat, icon: iconMap[cat] });
        localStorage.setItem('campusNews', JSON.stringify(saved));
        document.getElementById('news-input').value = '';
        loadNews();
    });

    window.deleteItem = (id) => {
        let saved = JSON.parse(localStorage.getItem('campusNews')) || [];
        const filtered = saved.filter(item => item.id !== id);
        localStorage.setItem('campusNews', JSON.stringify(filtered));
        loadNews();
    };
});