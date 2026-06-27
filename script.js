/* ========================================
   INITIALIZATION & DOM READY
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    updateFooterYear();
    setupEmailClipboard();
    setupInteractiveElements();
    triggerLoadAnimation();
}

/* ========================================
   FOOTER YEAR UPDATE
   ======================================== */

function updateFooterYear() {
    const currentYear = new Date().getFullYear();
    const footerText = document.querySelector('.footer-text');
    
    if (footerText) {
        const text = footerText.textContent;
        footerText.textContent = text.replace(/\d{4}/, currentYear);
    }
}

/* ========================================
   EMAIL CLIPBOARD FUNCTIONALITY
   ======================================== */

function setupEmailClipboard() {
    const emailLink = document.querySelector('a[href^="mailto:"]');
    
    if (!emailLink) return;

    emailLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        const email = emailLink.getAttribute('href').replace('mailto:', '');
        
        copyToClipboard(email, emailLink);
    });
}

function copyToClipboard(text, element) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(() => showCopyFeedback(element))
            .catch(() => fallbackCopy(text, element));
    } else {
        fallbackCopy(text, element);
    }
}

function fallbackCopy(text, element) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showCopyFeedback(element);
    } catch (err) {
        console.error('Copy failed:', err);
    } finally {
        document.body.removeChild(textarea);
    }
}

function showCopyFeedback(element) {
    element.classList.add('email-feedback');
    
    const originalLabel = element.querySelector('.label').textContent;
    element.querySelector('.label').textContent = 'Copied!';
    
    setTimeout(() => {
        element.classList.remove('email-feedback');
        element.querySelector('.label').textContent = originalLabel;
    }, 2000);
}

/* ========================================
   INTERACTIVE ELEMENTS
   ======================================== */

function setupInteractiveElements() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach((link) => {
        link.addEventListener('mouseenter', () => {
            addPulseEffect(link);
        });

        link.addEventListener('focus', () => {
            link.setAttribute('aria-pressed', 'true');
        });

        link.addEventListener('blur', () => {
            link.setAttribute('aria-pressed', 'false');
        });
    });
}

function addPulseEffect(element) {
    const icon = element.querySelector('.icon');
    if (icon) {
        icon.style.animation = 'none';
        setTimeout(() => {
            icon.style.animation = '';
        }, 10);
    }
}

/* ========================================
   LOAD ANIMATION
   ======================================== */

function triggerLoadAnimation() {
    document.body.classList.add('loaded');
    
    const profileImage = document.querySelector('.profile-image');
    if (profileImage && profileImage.complete) {
        profileImage.style.opacity = '1';
    }
}

/* ========================================
   PERFORMANCE & UTILITIES
   ======================================== */

// Intersection Observer for lazy animations
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
    });

    document.querySelectorAll('[data-animate]').forEach((el) => {
        observer.observe(el);
    });
}

// Debounce utility for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
window.addEventListener(
    'resize',
    debounce(() => {
        // Add resize handling logic if needed
    }, 250)
);

/* ========================================
   KEYBOARD NAVIGATION ENHANCEMENTS
   ======================================== */

document.addEventListener('keydown', (e) => {
    // Focus visible on Tab key
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

/* ========================================
   ANALYTICS & TRACKING (Optional)
   ======================================== */

function trackLinkClick(link) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            'event_category': 'engagement',
            'event_label': link.getAttribute('aria-label'),
        });
    }
}

// Optional: Add tracking to social links
document.querySelectorAll('.social-link').forEach((link) => {
    link.addEventListener('click', () => {
        trackLinkClick(link);
    });
});

/* ========================================
   THEME COLOR ANIMATION (Optional)
   ======================================== */

function animateThemeColor() {
    const colors = ['#38BDF8', '#8B5CF6'];
    let colorIndex = 0;

    setInterval(() => {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            colorIndex = (colorIndex + 1) % colors.length;
            metaThemeColor.setAttribute('content', colors[colorIndex]);
        }
    }, 3000);
}

// Uncomment to enable theme color animation
// animateThemeColor();

/* ========================================
   SERVICE WORKER REGISTRATION (Optional PWA)
   ======================================== */

if ('serviceWorker' in navigator) {
    // window.addEventListener('load', () => {
    //     navigator.serviceWorker.register('/sw.js');
    // });
}

/* ========================================
   ERROR HANDLING
   ======================================== */

window.addEventListener('error', (event) => {
    console.error('An error occurred:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
