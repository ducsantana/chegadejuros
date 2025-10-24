// Mobile menu toggle function
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.mobile-menu-toggle');

    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function (event) {
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.mobile-menu-toggle');

    if (!nav.contains(event.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.mobile-menu-toggle');

        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Function to initialize header after it's loaded
function initializeHeader() {
    // Fix logo path for different directory levels
    const logoImg = document.querySelector('.logo-img');
    if (logoImg) {
        const currentPath = window.location.pathname;
        let logoPath = '/images/logo.png';
        
        // If we're in a subdirectory, adjust the path
        if (currentPath.includes('/artigos/')) {
            logoPath = '../images/logo.png';
        } else {
            logoPath = 'images/logo.png';
        }
        
        logoImg.src = logoPath;
    }
    
    // Add active state to current page link
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        // Remove any existing active class
        link.classList.remove('active');

        // Check if this link matches current page
        const linkUrl = new URL(link.href);
        const linkPath = linkUrl.pathname;
        const linkHash = linkUrl.hash;
        
        // For the home page, only highlight if we're at that specific section
        if (currentPath === '/' || currentPath === '/index.html') {
            if (linkPath === '/blog.html' && currentPath === linkPath) {
                link.classList.add('active');
            } else if (linkHash && linkHash === currentHash) {
                link.classList.add('active');
            } else if (!currentHash && !linkHash && linkPath === '/') {
                // Only highlight home link if we're at the top with no hash
                link.classList.add('active');
            }
        } else if (currentPath === '/blog.html' && linkPath === '/blog.html') {
            link.classList.add('active');
        } else if (currentPath.includes('/artigos/') && linkPath === '/blog.html') {
            link.classList.add('active');
        }
    });
}

// Also run on DOMContentLoaded in case header is already loaded
document.addEventListener('DOMContentLoaded', function () {
    // Try to initialize if header is already present
    if (document.querySelector('.logo-img')) {
        initializeHeader();
    }
});

// Update active state when hash changes
window.addEventListener('hashchange', function() {
    if (document.querySelector('.logo-img')) {
        initializeHeader();
    }
});