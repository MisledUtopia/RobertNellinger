// ====================================
// Navigation Scroll Effect
// ====================================

const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ====================================
// Mobile Navigation Toggle
// ====================================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ====================================
// Typing Animation
// ====================================

const typingText = document.querySelector('.typing-text');
const phrases = [
    'Lead Solutions Architect',
    'AI Integration Expert',
    'Building Since Age 12',
    'Full Stack Developer',
    'LLM Workflow Architect',
    'Game Developer',
    'Multimedia Producer',
    '27 Years of Passion'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 150;

function typePhrase() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 150;
    }
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause at end of phrase
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500;
    }
    
    setTimeout(typePhrase, typingSpeed);
}

// Start typing animation
setTimeout(typePhrase, 1000);

// ====================================
// Scroll Animations (Intersection Observer)
// ====================================

const observerOptions = {
    threshold: 0,
    rootMargin: '0px 0px 500px 0px' // Trigger 500px BEFORE section enters viewport
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections for scroll animations
const sections = document.querySelectorAll('section > .container');
sections.forEach(section => {
    section.classList.add('fade-in-section');
    observer.observe(section);
});

// Add the fade-in CSS
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
    .fade-in-section {
        opacity: 0;
        transform: translateY(15px);
        transition: opacity 0.4s ease, transform 0.4s ease;
    }
    .fade-in-section.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(fadeStyle);

// Immediately show all sections that are anywhere near the viewport on page load
document.addEventListener('DOMContentLoaded', () => {
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        // If section is anywhere in the top 150% of viewport height, show it immediately
        if (rect.top < window.innerHeight * 1.5) {
            section.classList.add('visible');
        }
    });
});

// Also check on load event as backup
window.addEventListener('load', () => {
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.5) {
            section.classList.add('visible');
        }
    });
});

// ====================================
// Animated Counters
// ====================================

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };
    
    updateCounter();
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(counter => {
    counterObserver.observe(counter);
});

// ====================================
// Smooth Scroll for Navigation Links
// ====================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Skip if href is just "#" or has onclick handler
        if (href === '#' || this.hasAttribute('onclick')) {
            return;
        }
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ====================================
// Active Navigation Link on Scroll
// ====================================

const navSections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    navSections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ====================================
// Contact Form Handling
// ====================================

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    try {
        const response = await fetch('send-email.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Thank you for your message! I\'ll get back to you soon.');
            contactForm.reset();
        } else {
            alert('Error: ' + (result.message || 'Failed to send message. Please try again.'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to send message. Please try again or email me directly at contact@robertnellinger.com');
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

// ====================================
// Parallax Effect for Hero Background
// ====================================

const blobs = document.querySelectorAll('.gradient-blob');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    blobs.forEach((blob, index) => {
        const speed = 0.5 + (index * 0.2);
        const yPos = -(scrolled * speed);
        blob.style.transform = `translateY(${yPos}px)`;
    });
});

// ====================================
// Project Card Hover Effects
// ====================================

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// ====================================
// Skills Tag Interactive Highlight
// ====================================

const skillTags = document.querySelectorAll('.skill-tag');

skillTags.forEach(tag => {
    tag.addEventListener('click', () => {
        tag.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            tag.style.animation = '';
        }, 500);
    });
});

// Add pulse animation to CSS dynamically if needed
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }
    
    .nav-link.active {
        color: var(--primary-color);
        font-weight: 600;
    }
`;
document.head.appendChild(style);

// ====================================
// Performance: Throttle Scroll Events
// ====================================

function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
}

// Apply throttling to scroll-heavy functions
window.addEventListener('scroll', throttle(() => {
    // Additional scroll effects can be added here
}, 100));

// ====================================
// Page Load Animation
// ====================================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ====================================
// Cursor Trail Effect (Optional - for extra wow factor)
// ====================================

const cursorTrail = [];
const maxTrail = 20;

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) { // Only on desktop
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        document.body.appendChild(trail);
        
        cursorTrail.push(trail);
        
        if (cursorTrail.length > maxTrail) {
            const oldTrail = cursorTrail.shift();
            oldTrail.remove();
        }
        
        setTimeout(() => {
            trail.remove();
        }, 1000);
    }
});

// Add cursor trail styles
const trailStyle = document.createElement('style');
trailStyle.textContent = `
    .cursor-trail {
        position: fixed;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: var(--primary-color);
        pointer-events: none;
        z-index: 9999;
        animation: fadeTrail 1s ease forwards;
        opacity: 0.6;
    }
    
    @keyframes fadeTrail {
        to {
            transform: scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(trailStyle);

console.log('🚀 Robert Nellinger Portfolio - Loaded and Ready!');

// ====================================
// Dynamic Resume PDF Generation
// ====================================

// Make function globally accessible for onclick handler
window.generateResumePDF = function() {
    console.log('generateResumePDF called!');
    
    try {
        // Check if html2pdf is loaded
        if (typeof html2pdf === 'undefined') {
            console.error('html2pdf library not loaded!');
            alert('PDF library not loaded. Please refresh the page and try again.');
            return;
        }
        
        console.log('html2pdf library found, generating resume...');
        
        // Gather data from the page
        const name = "Robert Nellinger";
        const title = document.querySelector('.timeline-title')?.textContent || "Lead Solutions Architect";
    const email = "robertnellinger@gmail.com";
    const phone = "(989) 873-0802";
    const linkedin = "linkedin.com/in/robert-nellinger-38142224";
    const github = "github.com/MisledUtopia";
    
    // Get experience items
    const experienceItems = document.querySelectorAll('.timeline-item');
    let experienceHTML = '';
    experienceItems.forEach(item => {
        const date = item.querySelector('.timeline-date')?.textContent || '';
        const jobTitle = item.querySelector('.timeline-title')?.textContent || '';
        const company = item.querySelector('.timeline-company')?.textContent || '';
        const description = item.querySelector('.timeline-description')?.textContent || '';
        const highlights = item.querySelectorAll('.timeline-highlights li');
        
        let highlightsHTML = '';
        highlights.forEach(li => {
            highlightsHTML += `<li>${li.textContent}</li>`;
        });
        
        experienceHTML += `
            <div class="resume-job">
                <div class="resume-job-header">
                    <strong>${jobTitle}</strong> | ${company}
                    <span class="resume-date">${date}</span>
                </div>
                <p>${description.trim()}</p>
                <ul>${highlightsHTML}</ul>
            </div>
        `;
    });
    
    // Get skills by category (only from Skills section, not Education section)
    const skillsSection = document.getElementById('skills');
    const skillCategories = skillsSection?.querySelectorAll('.skill-category') || [];
    let skillsHTML = '';
    skillCategories.forEach(cat => {
        const catTitle = cat.querySelector('.category-title')?.textContent || '';
        const tags = cat.querySelectorAll('.skill-tag');
        let tagList = [];
        tags.forEach(tag => tagList.push(tag.textContent));
        if (tagList.length > 0) {
            skillsHTML += `<p><strong>${catTitle}:</strong> ${tagList.join(', ')}</p>`;
        }
    });
    
    // Get education from the Education section
    const eduSection = document.getElementById('education');
    const eduDetails = eduSection?.querySelector('.edu-details');
    const eduDegree = eduDetails?.querySelector('h4')?.textContent || '';
    const eduField = eduDetails?.querySelector('p strong')?.textContent || '';
    const eduSchool = eduDetails?.querySelectorAll('p')[1]?.textContent || '';
    const eduDate = eduDetails?.querySelector('.edu-date')?.textContent || '';
    
    // Get certifications from the Certifications category in Education section
    const certCategory = eduSection?.querySelectorAll('.skill-category')[2]; // Third card is Certifications
    const certTags = certCategory?.querySelectorAll('.skill-tag') || [];
    let certsHTML = '';
    certTags.forEach(tag => {
        certsHTML += `<li>${tag.textContent}</li>`;
    });
    
    // Build the resume HTML
    const resumeHTML = `
        <div id="resume-content" style="font-family: 'Inter', Arial, sans-serif; color: #333; padding: 40px; max-width: 800px; margin: 0 auto;">
            <style>
                #resume-content h1 { font-size: 28px; margin-bottom: 5px; color: #1e293b; }
                #resume-content h2 { font-size: 16px; color: #4f46e5; margin-bottom: 15px; font-weight: 500; }
                #resume-content h3 { font-size: 14px; color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 5px; margin: 25px 0 15px 0; text-transform: uppercase; letter-spacing: 1px; }
                #resume-content .contact-line { font-size: 11px; color: #64748b; margin-bottom: 20px; }
                #resume-content .contact-line a { color: #4f46e5; text-decoration: none; }
                #resume-content .resume-job { margin-bottom: 20px; }
                #resume-content .resume-job-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
                #resume-content .resume-date { color: #64748b; font-size: 12px; }
                #resume-content p { font-size: 12px; line-height: 1.6; margin-bottom: 8px; }
                #resume-content ul { font-size: 11px; margin: 8px 0; padding-left: 20px; }
                #resume-content li { margin-bottom: 4px; line-height: 1.5; }
                #resume-content .skills-section p { font-size: 11px; margin-bottom: 6px; }
                #resume-content .edu-item { margin-bottom: 10px; }
                #resume-content .page-break { page-break-before: always; margin-top: 0; padding-top: 0; }
            </style>
            
            <h1>${name}</h1>
            <h2>${title}</h2>
            <div class="contact-line">
                ${email} | ${phone} | <a href="https://${linkedin}">${linkedin}</a> | <a href="https://${github}">${github}</a>
            </div>
            
            <h3>Professional Experience</h3>
            ${experienceHTML}
            
            <h3 class="page-break">Technical Skills</h3>
            <div class="skills-section">
                ${skillsHTML}
            </div>
            
            <h3>Education</h3>
            <div class="edu-item">
                <strong>${eduDegree}</strong> - ${eduField}<br>
                <span style="color: #64748b;">${eduSchool} | ${eduDate}</span>
            </div>
            
            <h3>Certifications</h3>
            <ul>
                ${certsHTML}
            </ul>
            
            <p style="text-align: center; color: #94a3b8; font-size: 10px; margin-top: 30px;">
                References available upon request
            </p>
        </div>
    `;
    
        // Create a temporary container - HIDDEN off-screen
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        container.style.width = '800px';
        container.innerHTML = resumeHTML;
        document.body.appendChild(container);
        
        console.log('Resume HTML created, calling html2pdf...');
        
        // Get the actual resume element
        const resumeElement = document.getElementById('resume-content');
        
        // PDF options
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: 'Robert_Nellinger_Resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        
        // Generate PDF
        html2pdf().set(opt).from(resumeElement).save().then(() => {
            console.log('PDF generated successfully!');
            // Clean up
            document.body.removeChild(container);
        }).catch(err => {
            console.error('PDF generation failed:', err);
            document.body.removeChild(container);
        });
        
    } catch (error) {
        console.error('Error in generateResumePDF:', error);
        alert('Error generating resume: ' + error.message);
    }
};

// Also keep function reference for event listeners
const generateResumePDF = window.generateResumePDF;
