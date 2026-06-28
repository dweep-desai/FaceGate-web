// FaceGate Website Interactions & Animations

// Shared space scroll tracker for starfield parallax coordination
window.spaceScroll = {
    currentX: 0,
    targetX: 0
};

// Global screenshot configurations
const screenshots = [
    {
        image: "assets/screenshots/auth.png",
        title: "Face Authentication",
        description: "Unlock your macOS apps seamlessly using offline face recognition with no-peek auth overlay."
    },
    {
        image: "assets/screenshots/menubar.png",
        title: "System Menu Bar",
        description: "Monitor security status and toggle protection quickly from the macOS menu bar."
    },
    {
        image: "assets/screenshots/behaviour.png",
        title: "Custom Lock Behaviors",
        description: "Configure per-app options, sessions, lock delay timers, and custom gestures."
    },
    {
        image: "assets/screenshots/auth_sett.png",
        title: "Security & Fallbacks",
        description: "Manage database encryption keys, liveness settings, and Touch ID fallbacks."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initScreenshotsShowcase();
    initHorizontalScroll();
    initHeaderScroll();
    initMobileNav();
    initCopyButtons();
    initInstallTabs();
    initScrollReveal();
    initStarfield();
});

// Pinning & showcase interaction states
let activeShowcaseIndex = 0;
let targetCarouselRotation = 0;
let currentCarouselRotation = 0;

// --- Screenshots Showcase Logic ---
function initScreenshotsShowcase() {
    const wheel = document.getElementById('carousel-wheel');
    if (!wheel) return;
    
    // Generate markup
    wheel.innerHTML = '';
    screenshots.forEach((screen, index) => {
        const card = document.createElement('div');
        card.className = `screenshot-card ${index === 0 ? 'active' : ''}`;
        if (index === 1) {
            card.classList.add('portrait');
        }
        
        card.setAttribute('data-index', index);
        card.setAttribute('role', 'group');
        card.setAttribute('aria-label', `Screenshot ${index + 1}: ${screen.title}`);
        
        const img = document.createElement('img');
        img.src = screen.image;
        img.alt = screen.title;
        img.loading = 'lazy';
        
        card.appendChild(img);
        
        // Let cards be clickable on mobile to focus them directly
        card.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                activeShowcaseIndex = index;
                updateActiveShowcaseInfo(index);
                targetCarouselRotation = -index * 38;
            }
        });
        
        wheel.appendChild(card);
    });
    
    // Generate navigation dots & swipe listeners for mobile viewports
    const showcaseContainer = document.querySelector('.screenshots-showcase-container');
    if (showcaseContainer) {
        let dotsContainer = showcaseContainer.querySelector('.carousel-dots');
        if (!dotsContainer) {
            dotsContainer = document.createElement('div');
            dotsContainer.className = 'carousel-dots';
            showcaseContainer.appendChild(dotsContainer);
        }
        dotsContainer.innerHTML = '';
        
        const carouselViewport = showcaseContainer.querySelector('.carousel-viewport');

        // Add manual navigation arrows
        let prevBtn = carouselViewport.querySelector('.carousel-nav-btn.prev');
        if (!prevBtn) {
            prevBtn = document.createElement('button');
            prevBtn.className = 'carousel-nav-btn prev';
            prevBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
            prevBtn.setAttribute('aria-label', 'Previous screenshot');
            prevBtn.addEventListener('click', () => {
                if (activeShowcaseIndex > 0) {
                    activeShowcaseIndex--;
                    updateActiveShowcaseInfo(activeShowcaseIndex);
                    targetCarouselRotation = -activeShowcaseIndex * 38;
                }
            });
            carouselViewport.appendChild(prevBtn);
        }
        
        let nextBtn = carouselViewport.querySelector('.carousel-nav-btn.next');
        if (!nextBtn) {
            nextBtn = document.createElement('button');
            nextBtn.className = 'carousel-nav-btn next';
            nextBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
            nextBtn.setAttribute('aria-label', 'Next screenshot');
            nextBtn.addEventListener('click', () => {
                if (activeShowcaseIndex < screenshots.length - 1) {
                    activeShowcaseIndex++;
                    updateActiveShowcaseInfo(activeShowcaseIndex);
                    targetCarouselRotation = -activeShowcaseIndex * 38;
                }
            });
            carouselViewport.appendChild(nextBtn);
        }

        screenshots.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                activeShowcaseIndex = index;
                updateActiveShowcaseInfo(index);
                targetCarouselRotation = -index * 38;
            });
            dotsContainer.appendChild(dot);
        });
    }

    // Swipe gestures
    const viewport = document.querySelector('.carousel-viewport');
    if (viewport) {
        let touchStartX = 0;
        let touchEndX = 0;
        viewport.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        viewport.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const threshold = 50;
            if (touchStartX - touchEndX > threshold) {
                if (activeShowcaseIndex < screenshots.length - 1) {
                    activeShowcaseIndex++;
                    updateActiveShowcaseInfo(activeShowcaseIndex);
                    targetCarouselRotation = -activeShowcaseIndex * 38;
                }
            } else if (touchEndX - touchStartX > threshold) {
                if (activeShowcaseIndex > 0) {
                    activeShowcaseIndex--;
                    updateActiveShowcaseInfo(activeShowcaseIndex);
                    targetCarouselRotation = -activeShowcaseIndex * 38;
                }
            }
        }, { passive: true });
    }
    
    updateActiveShowcaseInfo(0);
}

function updateActiveShowcaseInfo(index) {
    const titleEl = document.getElementById('showcase-active-title');
    const descEl = document.getElementById('showcase-active-desc');
    
    if (titleEl && descEl && screenshots[index]) {
        titleEl.textContent = screenshots[index].title;
        descEl.textContent = screenshots[index].description;
    }
    
    const cards = document.querySelectorAll('.screenshot-card');
    cards.forEach((card, idx) => {
        if (idx === index) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });

    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
        if (idx === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function updateWheelTransforms(rotationAngle) {
    const cards = document.querySelectorAll('.screenshot-card');
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Flat carousel layout on mobile for cleaner, native feel
        cards.forEach((card, idx) => {
            const diff = idx - activeShowcaseIndex;
            const cardWidth = 260; // matches mobile CSS width
            const gap = 20;
            const tx = diff * (cardWidth + gap);
            
            const scale = idx === activeShowcaseIndex ? 1.0 : 0.85;
            const opacity = idx === activeShowcaseIndex ? 1.0 : 0.35;
            const blur = idx === activeShowcaseIndex ? 0 : 2;
            const visibility = Math.abs(diff) <= 1 ? 'visible' : 'hidden';
            
            card.style.transform = `translate3d(${tx}px, 0px, 0px) scale(${scale})`;
            card.style.opacity = opacity;
            card.style.filter = blur > 0 ? `blur(${blur}px)` : 'none';
            card.style.zIndex = idx === activeShowcaseIndex ? 100 : 50;
            card.style.visibility = visibility;
        });
        return;
    }
    
    // Circle math parameters (virtual rotation center below the screen) for desktop
    const radius = 800; 
    const angleStep = 38; // angle spacing between cards
    
    cards.forEach((card, idx) => {
        const itemAngle = (idx * angleStep) + rotationAngle;
        const rad = (itemAngle * Math.PI) / 180;
        
        // Circular tangent positioning:
        const tx = Math.sin(rad) * radius;
        // Curve downwards using cos formula relative to virtual center at (0, radius)
        const ty = (1 - Math.cos(rad)) * radius;
        
        // Active visual scaling & blur formulas based on deviation from top-center (0 degrees)
        const diff = Math.abs(itemAngle);
        const focusFactor = Math.max(0, 1 - (diff / 38));
        
        const scale = 0.75 + (focusFactor * 0.25);
        const opacity = 0.15 + (focusFactor * 0.85);
        const blur = diff < 15 ? 0 : Math.min(4, (diff - 15) * 0.15);
        
        // Tilt matching circle curvature (rotate(itemAngle))
        card.style.transform = `translate3d(${tx}px, ${ty}px, 0px) rotate(${itemAngle}deg) scale(${scale})`;
        card.style.opacity = opacity;
        card.style.filter = `blur(${blur}px)`;
        card.style.zIndex = Math.round(focusFactor * 100);
    });
}

// --- Horizontal Scroll Logic (Desktop Only) ---
function initHorizontalScroll() {
    const track = document.querySelector('.horizontal-track');
    const main = document.querySelector('main');
    
    if (!track || !main) return;
    
    let currentTranslateX = 0;
    let targetTranslateX = 0;
    
    const handleScrollTranslation = () => {
        if (window.innerWidth <= 768) {
            targetTranslateX = 0;
            return;
        }
        
        const mainRect = main.getBoundingClientRect();
        const scrollHeight = main.scrollHeight - window.innerHeight;
        
        // scrolledAmount: vertical pixels scrolled relative to main section start
        const scrolledAmount = -mainRect.top;
        
        // Translate percentage (clamped between 0 and 1)
        let progress = scrolledAmount / scrollHeight;
        progress = Math.max(0, Math.min(progress, 1));
        
        // Calculate maximum horizontal travel distance
        const maxTranslate = track.scrollWidth - window.innerWidth;
        
        // Segment boundaries mapping
        const previewSection = document.getElementById('preview');
        const sections = document.querySelectorAll('.horizontal-track > section');
        
        if (previewSection && maxTranslate > 0) {
            const previewLeft = previewSection.offsetLeft;
            const previewWidth = previewSection.offsetWidth;
            
            // Allocate 15% of the total vertical page scroll space to carousel rotation
            const pinProgressStart = (previewLeft - 100) / maxTranslate;
            const pinProgressDuration = 0.15;
            const pinProgressEnd = pinProgressStart + pinProgressDuration;
            
            const angleStep = 38;
            const totalRotationSpan = (screenshots.length - 1) * angleStep;
            
            if (progress >= pinProgressStart && progress <= pinProgressEnd) {
                // Pin scroll movement horizontally inside the preview window slide
                const relativeScrollProgress = (progress - pinProgressStart) / pinProgressDuration;
                targetTranslateX = previewLeft;
                
                // Calculate rotation angle matching scroll progression step
                targetCarouselRotation = -relativeScrollProgress * totalRotationSpan;
                
                // Calculate current active focused index
                const activeIndex = Math.min(
                    screenshots.length - 1,
                    Math.max(0, Math.round(relativeScrollProgress * (screenshots.length - 1)))
                );
                if (activeIndex !== activeShowcaseIndex) {
                    activeShowcaseIndex = activeIndex;
                    updateActiveShowcaseInfo(activeIndex);
                }
            } else if (progress < pinProgressStart) {
                // Normal translation before pinning zone
                const ratio = progress / pinProgressStart;
                targetTranslateX = ratio * previewLeft;
                targetCarouselRotation = 0;
                if (activeShowcaseIndex !== 0) {
                    activeShowcaseIndex = 0;
                    updateActiveShowcaseInfo(0);
                }
            } else {
                // Normal translation after pinning zone
                const postProgress = (progress - pinProgressEnd) / (1 - pinProgressEnd);
                const remainingTranslate = maxTranslate - previewLeft;
                targetTranslateX = previewLeft + (postProgress * remainingTranslate);
                targetCarouselRotation = -totalRotationSpan;
                if (activeShowcaseIndex !== screenshots.length - 1) {
                    activeShowcaseIndex = screenshots.length - 1;
                    updateActiveShowcaseInfo(screenshots.length - 1);
                }
            }
        } else {
            targetTranslateX = progress * maxTranslate;
        }
    };
    
    // Physics loop to animate scrolling position smoothly
    const updateScrollPhysics = () => {
        if (window.innerWidth > 768) {
            // Smoothly interpolate current position toward target position (lerp)
            currentTranslateX += (targetTranslateX - currentTranslateX) * 0.085;
            currentCarouselRotation += (targetCarouselRotation - currentCarouselRotation) * 0.085;
            
            // Snap to target if extremely close to stop animation calculations
            if (Math.abs(targetTranslateX - currentTranslateX) < 0.05) {
                currentTranslateX = targetTranslateX;
            }
            if (Math.abs(targetCarouselRotation - currentCarouselRotation) < 0.05) {
                currentCarouselRotation = targetCarouselRotation;
            }
            
            track.style.transform = `translateX(-${currentTranslateX}px)`;
            updateWheelTransforms(currentCarouselRotation);
            
            // Share translate amount with starfield animation
            window.spaceScroll.targetX = currentTranslateX;
            
            // Update active nav links based on current viewport section
            updateActiveNavLink(currentTranslateX);
            
            // Update top progress bar width smoothly
            const maxTranslate = track.scrollWidth - window.innerWidth;
            const currentProgress = maxTranslate > 0 ? (currentTranslateX / maxTranslate) : 0;
            const progressBar = document.getElementById('progress-bar');
            if (progressBar) {
                progressBar.style.width = `${currentProgress * 100}%`;
            }
        } else {
            // Mobile reset
            track.style.transform = 'none';
            window.spaceScroll.targetX = 0;
            currentTranslateX = 0;
            targetTranslateX = 0;
            
            // Smoothly rotate the carousel on mobile matching the active showcase item
            currentCarouselRotation += (targetCarouselRotation - currentCarouselRotation) * 0.085;
            if (Math.abs(targetCarouselRotation - currentCarouselRotation) < 0.05) {
                currentCarouselRotation = targetCarouselRotation;
            }
            updateWheelTransforms(currentCarouselRotation);
            
            // Reset top progress bar
            const progressBar = document.getElementById('progress-bar');
            if (progressBar) {
                progressBar.style.width = '0%';
            }
        }
        
        requestAnimationFrame(updateScrollPhysics);
    };
    
    // Start physics loop
    requestAnimationFrame(updateScrollPhysics);
    
    // Update active nav link based on horizontal scroll position
    const updateActiveNavLink = (translateX) => {
        const isDesktop = window.innerWidth > 768;
        const sections = isDesktop 
            ? document.querySelectorAll('.horizontal-track > section')
            : document.querySelectorAll('main > section, .horizontal-track > section');
            
        const navLinks = document.querySelectorAll('.nav-link');
        let activeSectionId = '';
        
        sections.forEach(section => {
            const id = section.getAttribute('id');
            if (!id) return;
            
            if (isDesktop) {
                const sectionLeft = section.offsetLeft;
                const sectionWidth = section.offsetWidth;
                if (translateX >= sectionLeft - window.innerWidth / 3 && 
                    translateX < sectionLeft + sectionWidth - window.innerWidth / 3) {
                    activeSectionId = id;
                }
            } else {
                const rect = section.getBoundingClientRect();
                const headerOffset = 80;
                // Check if section is currently occupying the main view area
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= headerOffset + 100) {
                    activeSectionId = id;
                }
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (activeSectionId && href === `#${activeSectionId}`) {
                link.classList.add('active');
            }
        });
    };
    
    // Intercept navigation links click to map to vertical scroll positions
    const initNavOverrides = () => {
        const navLinks = document.querySelectorAll('.nav-link, .logo, .btn-primary[href^="#"], .btn-nav');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (!href) return;
                
                // Logo or top clicks
                if (href === '#' || href === '') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
                
                if (href.startsWith('#')) {
                    const targetSec = document.querySelector(href);
                    if (targetSec) {
                        e.preventDefault();
                        
                        if (window.innerWidth > 768) {
                            const sectionLeft = targetSec.offsetLeft;
                            const maxTranslate = track.scrollWidth - window.innerWidth;
                            const scrollHeight = main.scrollHeight - window.innerHeight;
                            
                            let targetProgress = 0;
                            const previewSection = document.getElementById('preview');
                            if (previewSection && maxTranslate > 0) {
                                const previewLeft = previewSection.offsetLeft;
                                const pinProgressStart = (previewLeft - 100) / maxTranslate;
                                const pinProgressEnd = pinProgressStart + 0.15;
                                const remainingTranslate = maxTranslate - previewLeft;
                                
                                if (sectionLeft < previewLeft) {
                                    targetProgress = (sectionLeft / previewLeft) * pinProgressStart;
                                } else if (sectionLeft === previewLeft) {
                                    targetProgress = pinProgressStart;
                                } else {
                                    const postProgress = (sectionLeft - previewLeft) / remainingTranslate;
                                    targetProgress = (postProgress * (1 - pinProgressEnd)) + pinProgressEnd;
                                }
                            } else {
                                targetProgress = sectionLeft / maxTranslate;
                            }
                            
                            // Map horizontal offset back to vertical scroll target
                            const targetScrollY = targetProgress * scrollHeight;
                            
                            window.scrollTo({
                                top: targetScrollY,
                                behavior: 'smooth'
                            });
                        } else {
                            // Mobile vertical native scroll fallback
                            const headerOffset = 80;
                            const elementPosition = targetSec.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                            
                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }
                }
            });
        });
    };
    
    window.addEventListener('scroll', handleScrollTranslation);
    window.addEventListener('resize', handleScrollTranslation);
    
    // Initialize navigation overrides
    initNavOverrides();
    // Initial run
    handleScrollTranslation();
}

// --- Header Scroll State ---
function initHeaderScroll() {
    const header = document.querySelector('.header');
    const heroIcon = document.querySelector('.hero-app-icon');
    
    const handleScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Mobile logo transition logic
        if (window.innerWidth <= 768 && heroIcon) {
            const flyingLogo = document.getElementById('flying-logo');
            const navLogoImg = header.querySelector('.logo-img');
            const heroTitle = document.querySelector('.hero-title');
            
            // Get coordinates
            const rect = heroIcon.getBoundingClientRect();
            const startTop = rect.top + window.scrollY;
            const startX = rect.left;
            const startWidth = 192;
            
            const headerContainer = header.querySelector('.header-container');
            const hRect = header.getBoundingClientRect();
            const hcRect = headerContainer.getBoundingClientRect();
            const hcStyle = window.getComputedStyle(headerContainer);
            
            const targetWidth = 38;
            const targetX = hcRect.left + parseFloat(hcStyle.paddingLeft || '20');
            const targetTop = hRect.top + (hRect.height - targetWidth) / 2;
            
            // Animation completes when hero title approaches the header
            let titleDistance = 150;
            if (heroTitle) {
                const titleTop = heroTitle.getBoundingClientRect().top + window.scrollY;
                titleDistance = titleTop - hRect.height - 20; // Complete 20px before title hits header
            }
            const animationDistance = Math.max(titleDistance, 100);
            
            let progress = window.scrollY / animationDistance;
            progress = Math.max(0, Math.min(progress, 1));
            
            if (progress > 0 && progress < 1) {
                header.classList.remove('show-logo');
                header.classList.add('animating-logo');
                heroIcon.style.opacity = '0';
                
                if (flyingLogo) {
                    flyingLogo.style.display = 'block';
                    
                    const easeX = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                    const easeY = progress; // Linear in screen-space feels smooth
                    
                    const currentX = startX + (targetX - startX) * easeX;
                    const currentY = startTop + (targetTop - startTop) * easeY;
                    const currentWidth = startWidth + (targetWidth - startWidth) * easeX;
                    
                    flyingLogo.style.left = `${currentX}px`;
                    flyingLogo.style.top = `${currentY}px`;
                    flyingLogo.style.width = `${currentWidth}px`;
                    flyingLogo.style.height = `${currentWidth}px`;
                }
                
                if (navLogoImg) {
                    // Delay text push until the logo is actually arriving (last 40% of scroll)
                    let textProgress = Math.max(0, (progress - 0.6) / 0.4);
                    let easeText = textProgress < 0.5 ? 2 * textProgress * textProgress : 1 - Math.pow(-2 * textProgress + 2, 2) / 2;
                    
                    navLogoImg.style.maxWidth = `${targetWidth * easeText}px`;
                    navLogoImg.style.marginRight = `${-12 * (1 - easeText)}px`;
                }
            } else if (progress === 1) {
                header.classList.remove('animating-logo');
                header.classList.add('show-logo');
                heroIcon.style.opacity = '0';
                if (flyingLogo) flyingLogo.style.display = 'none';
                if (navLogoImg) {
                    navLogoImg.style.maxWidth = '';
                    navLogoImg.style.marginRight = '';
                }
            } else {
                header.classList.remove('animating-logo');
                header.classList.remove('show-logo');
                heroIcon.style.opacity = '1';
                if (flyingLogo) flyingLogo.style.display = 'none';
                if (navLogoImg) {
                    navLogoImg.style.maxWidth = '';
                    navLogoImg.style.marginRight = '';
                }
            }
        } else {
            header.classList.remove('show-logo');
            header.classList.remove('animating-logo');
            if (heroIcon) heroIcon.style.opacity = '1';
            const flyingLogo = document.getElementById('flying-logo');
            if (flyingLogo) flyingLogo.style.display = 'none';
            const navLogoImg = header.querySelector('.logo-img');
            if (navLogoImg) {
                navLogoImg.style.maxWidth = '';
                navLogoImg.style.marginRight = '';
            }
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();
}

// --- Mobile Navigation Menu ---
function initMobileNav() {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!toggle || !header) return;
    
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        header.classList.toggle('nav-active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            header.classList.remove('nav-active');
        });
    });

    document.addEventListener('click', (e) => {
        const isClickInside = header.contains(e.target);
        if (!isClickInside && header.classList.contains('nav-active')) {
            header.classList.remove('nav-active');
        }
    });
}

// --- Copy to Clipboard Handler ---
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.btn-copy, .btn-copy-tab');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const terminalBody = button.closest('.terminal-body');
            if (!terminalBody) return;
            
            const codeEl = terminalBody.querySelector('.terminal-code');
            if (!codeEl) return;
            
            const textToCopy = codeEl.textContent.trim();
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                
                const copyIcon = button.querySelector('.icon-copy');
                const checkIcon = button.querySelector('.icon-check');
                
                if (copyIcon && checkIcon) {
                    copyIcon.classList.add('hidden');
                    checkIcon.classList.remove('hidden');
                    button.classList.add('copied');
                    
                    setTimeout(() => {
                        copyIcon.classList.remove('hidden');
                        checkIcon.classList.add('hidden');
                        button.classList.remove('copied');
                    }, 2000);
                }
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });
    });
}

// --- Installation Section Tabs ---
function initInstallTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            contents.forEach(content => {
                if (content.id === `tab-${target}`) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });
}

// --- Scroll Reveal Animations ---
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 100px 0px 100px' // Wider side margins to trigger correctly on horizontal translations
        });
        
        revealElements.forEach(el => observer.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('revealed'));
    }
}

// --- Interactive 3D Parallax Starfield Canvas ---
function initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    let stars = [];
    const starCount = 120;
    
    // Mouse coordinates
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars();
    }
    
    function initStars() {
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.8 + 0.2,
                speedX: (Math.random() - 0.5) * 0.04,
                speedY: (Math.random() - 0.5) * 0.04,
                depth: Math.random() * 0.7 + 0.3, // Depth multiplier for parallax layers
                alpha: Math.random() * 0.7 + 0.3,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    window.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX - window.innerWidth / 2) * 0.4;
        targetMouseY = (e.clientY - window.innerHeight / 2) * 0.4;
    });
    
    window.addEventListener('deviceorientation', (e) => {
        if (e.beta === null || e.gamma === null) return;
        targetMouseX = e.gamma * 6;
        targetMouseY = e.beta * 6;
    });
    
    function draw() {
        if (window.innerWidth <= 768) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = 'none';
            requestAnimationFrame(draw);
            return;
        }
        canvas.style.display = 'block';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Interpolate mouse movements
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
        
        // Interpolate horizontal scroll tracking
        window.spaceScroll.currentX += (window.spaceScroll.targetX - window.spaceScroll.currentX) * 0.08;
        
        for (let i = 0; i < starCount; i++) {
            const star = stars[i];
            
            // Drift updating
            star.x += star.speedX;
            star.y += star.speedY;
            
            // Warp star if it drifts out of canvas boundaries
            if (star.x < 0) star.x = canvas.width;
            if (star.x > canvas.width) star.x = 0;
            if (star.y < 0) star.y = canvas.height;
            if (star.y > canvas.height) star.y = 0;
            
            // Math for Parallax: mouse movement offset + scroll drift offset
            // As we scroll horizontally, stars move left in the opposite direction
            // Closer stars (larger depth values) move faster
            let renderX = (star.x - mouseX * star.depth * 0.06 - window.spaceScroll.currentX * star.depth * 0.25) % canvas.width;
            if (renderX < 0) renderX += canvas.width;
            
            const renderY = star.y - mouseY * star.depth * 0.06;
            
            // Twinkle state
            star.twinklePhase += star.twinkleSpeed;
            const currentAlpha = Math.max(0.15, star.alpha + Math.sin(star.twinklePhase) * 0.25);
            
            ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
            ctx.beginPath();
            ctx.arc(renderX, renderY, star.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        requestAnimationFrame(draw);
    }
    
    draw();
}
