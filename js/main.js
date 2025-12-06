/**
 * Digital Human Kiosk Website
 * Main JavaScript File
 */

// ===== Mobile Menu Toggle =====
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    const header = document.getElementById('header');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');

            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking on a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // ===== Sticky Header on Scroll =====
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===== Enhanced Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
};

// 创建性能优化的观察器
const createAnimationObserver = () => {
    return new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 添加延迟以创建交错效果
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                    entry.target.classList.add('animated');
                }, index * 100); // 每个元素延迟100ms

                // 动画完成后停止观察以优化性能
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
};

const observer = createAnimationObserver();

// 观察所有需要动画的元素
const animateElements = () => {
    // Fade-in-up 元素
    document.querySelectorAll('.fade-in-up').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // 卡片元素 - 交错动画
    document.querySelectorAll('.feature-card, .product-card, .solution-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px) scale(0.95)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        el.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(el);
    });

    // 统计卡片
    document.querySelectorAll('.stat-item').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'scale(0.8)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
};

// 使用 requestAnimationFrame 优化初始化
requestAnimationFrame(animateElements);

// ===== Enhanced Counter Animation with Easing =====
function animateCounter(element) {
    const target = element.textContent;
    const isPercentage = target.includes('%');
    const isPlus = target.includes('+');
    const isMultiplier = target.includes('x');
    const isTime = target.includes('/');

    let numericValue;
    if (isTime) {
        // For time format like "24/7", only extract the first number
        numericValue = parseInt(target.split('/')[0]);
    } else {
        numericValue = parseInt(target.replace(/[^0-9]/g, ''));
    }
    if (isNaN(numericValue)) return;

    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    // 使用 easeOutExpo 缓动函数
    const easeOutExpo = (t) => {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);

        const current = Math.floor(easedProgress * numericValue);
        let displayValue = current.toString();

        if (isPercentage) displayValue += '%';
        if (isPlus) displayValue += '+';
        if (isMultiplier) displayValue += 'x';
        if (isTime) displayValue += '/7';

        element.textContent = displayValue;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // 确保最终值正确
            let finalValue = numericValue.toString();
            if (isPercentage) finalValue += '%';
            if (isPlus) finalValue += '+';
            if (isMultiplier) finalValue += 'x';
            if (isTime) finalValue += '/7';
            element.textContent = finalValue;
        }
    };

    requestAnimationFrame(animate);
}

// Observe stat numbers
const statObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            statObserver.unobserve(entry.target); // Only animate once
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => {
    statObserver.observe(el);
});

// ===== Form Validation Enhancement =====
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
        // Add focus/blur effects
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });

        // Real-time validation
        input.addEventListener('input', function() {
            if (this.validity.valid) {
                this.style.borderColor = '#34a853';
            } else {
                this.style.borderColor = '';
            }
        });
    });
});

// ===== Loading Animation =====
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease-in';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ===== Back to Top Button =====
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="transition: transform 0.3s ease;">
        <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`;
backToTopButton.setAttribute('aria-label', 'Back to top');
backToTopButton.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    z-index: 999;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5), 0 0 20px rgba(118, 75, 162, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
    backdrop-filter: blur(10px);
    animation: pulse-glow 2s ease-in-out infinite;
`;

// Add animated gradient border
const borderGradient = document.createElement('div');
borderGradient.style.cssText = `
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f093fb, #4facfe, #00f2fe, #43e97b, #ff6b6b);
    background-size: 400% 400%;
    animation: gradientRotate 4s ease infinite;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.4s ease;
`;
backToTopButton.appendChild(borderGradient);

// Add particles effect
for (let i = 0; i < 3; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: white;
        opacity: 0.6;
        animation: float-particle ${2 + i * 0.5}s ease-in-out ${i * 0.3}s infinite;
        pointer-events: none;
    `;
    backToTopButton.appendChild(particle);
}

// Add ripple effect container
const rippleContainer = document.createElement('div');
rippleContainer.style.cssText = `
    position: absolute;
    inset: 0;
    border-radius: 50%;
    overflow: hidden;
`;
backToTopButton.appendChild(rippleContainer);

document.body.appendChild(backToTopButton);

// Scroll progress ring with gradient
const progressRing = document.createElement('svg');
progressRing.setAttribute('width', '68');
progressRing.setAttribute('height', '68');
progressRing.style.cssText = `
    position: absolute;
    top: -4px;
    left: -4px;
    transform: rotate(-90deg);
    pointer-events: none;
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
`;
progressRing.innerHTML = `
    <defs>
        <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4facfe;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#00f2fe;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#43e97b;stop-opacity:1" />
        </linearGradient>
    </defs>
    <circle cx="34" cy="34" r="29"
        stroke="rgba(255,255,255,0.2)"
        stroke-width="4"
        fill="none"/>
    <circle id="progress-circle" cx="34" cy="34" r="29"
        stroke="url(#progress-gradient)"
        stroke-width="4"
        fill="none"
        stroke-dasharray="182"
        stroke-dashoffset="182"
        stroke-linecap="round"
        style="transition: stroke-dashoffset 0.1s linear;"/>
`;
backToTopButton.appendChild(progressRing);

const progressCircle = document.getElementById('progress-circle');

window.addEventListener('scroll', function() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / scrollHeight) * 182;

    if (progressCircle) {
        progressCircle.style.strokeDashoffset = 182 - progress;
    }

    if (window.scrollY > 500) {
        backToTopButton.style.opacity = '1';
        backToTopButton.style.visibility = 'visible';
        backToTopButton.style.transform = 'scale(1) rotate(0deg)';
        backToTopButton.style.animation = 'pulse-glow 2s ease-in-out infinite';
    } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.style.visibility = 'hidden';
        backToTopButton.style.transform = 'scale(0.5) rotate(180deg)';
    }
});

backToTopButton.addEventListener('click', function(e) {
    // Create ripple effect
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        width: 100%;
        height: 100%;
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    rippleContainer.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

backToTopButton.addEventListener('mouseenter', function() {
    this.style.animation = 'none';
    this.style.transform = 'scale(1.2) translateY(-8px) rotate(5deg)';
    this.style.boxShadow = '0 15px 45px rgba(102, 126, 234, 0.7), 0 0 30px rgba(240, 147, 251, 0.5)';
    borderGradient.style.opacity = '1';
    const svg = this.querySelector('svg');
    if (svg) svg.style.transform = 'translateY(-5px) scale(1.2)';
});

backToTopButton.addEventListener('mouseleave', function() {
    this.style.animation = 'pulse-glow 2s ease-in-out infinite';
    this.style.transform = 'scale(1)';
    this.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.5), 0 0 20px rgba(118, 75, 162, 0.3)';
    borderGradient.style.opacity = '0';
    const svg = this.querySelector('svg');
    if (svg) svg.style.transform = 'translateY(0) scale(1)';
});

// Add keyframe animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(2.5);
            opacity: 0;
        }
    }

    @keyframes pulse-glow {
        0%, 100% {
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5), 0 0 20px rgba(118, 75, 162, 0.3);
        }
        50% {
            box-shadow: 0 12px 40px rgba(102, 126, 234, 0.7), 0 0 30px rgba(240, 147, 251, 0.5);
        }
    }

    @keyframes float-particle {
        0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
        }
        25% {
            transform: translate(15px, -15px) scale(0.8);
            opacity: 0.3;
        }
        50% {
            transform: translate(0, -25px) scale(1.2);
            opacity: 0.8;
        }
        75% {
            transform: translate(-15px, -15px) scale(0.8);
            opacity: 0.3;
        }
    }

    @keyframes gradientRotate {
        0%, 100% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
    }
`;
document.head.appendChild(style);

// ===== Parallax Scrolling Effect (Disabled) =====
// 视差滚动效果已禁用，如需启用请取消下方代码注释
/*
const parallaxElements = document.querySelectorAll('.hero-image, .product-image');

let ticking = false;

function updateParallax() {
    const scrolled = window.scrollY;

    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);

        // 使用 transform 而不是 top/position 以获得更好的性能
        if (element.classList.contains('hero-image')) {
            element.style.transform = `translateY(${yPos * 0.3}px)`;
        }
    });

    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
});
*/

// ===== Mouse Tracking for Cards (Disabled) =====
// 3D鼠标跟踪效果已禁用，如需启用请取消下方代码注释
/*
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

if (!isMobile) {
    const trackableCards = document.querySelectorAll('.feature-card, .product-card');

    trackableCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}
*/

// ===== Smooth Reveal for Images =====
const images = document.querySelectorAll('img');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '0';
            img.style.transform = 'scale(0.9)';
            img.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';

            // 图片加载完成后显示
            if (img.complete) {
                setTimeout(() => {
                    img.style.opacity = '1';
                    img.style.transform = 'scale(1)';
                }, 100);
            } else {
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                    img.style.transform = 'scale(1)';
                });
            }

            imageObserver.unobserve(img);
        }
    });
}, { threshold: 0.1 });

images.forEach(img => imageObserver.observe(img));

// ===== Add Stagger Animation to Navigation Links =====
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(-10px)';
        link.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

        setTimeout(() => {
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });
});

// ===== Performance Monitoring =====
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('%c⚡ Page Load Performance', 'color: #34a853; font-size: 14px; font-weight: bold;');
                console.log(`Load Time: ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
            }
        }, 0);
    });
}

// ===== Service Impact Progress Bar Animation =====
document.addEventListener('DOMContentLoaded', function() {
    const progressBarObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 找到所有进度条并触发动画
                const progressBars = document.querySelectorAll('.progress-bar-fill');
                progressBars.forEach((bar, index) => {
                    const targetWidth = bar.getAttribute('data-width');
                    // 使用 requestAnimationFrame 确保平滑动画
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            bar.style.width = targetWidth + '%';
                        }, 100 + (index * 300)); // 交错延迟
                    });
                });

                // 停止观察以防重复触发
                progressBarObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });

    // 观察服务影响卡片
    const serviceImpactCard = document.querySelector('.service-impact-card');
    if (serviceImpactCard) {
        progressBarObserver.observe(serviceImpactCard);
    }

    // 为度量项添加序列化出现动画
    const metricItems = document.querySelectorAll('.metric-item-enhanced');
    metricItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    const metricObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.metric-item-enhanced');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, index * 200);
                });
                metricObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    if (serviceImpactCard) {
        metricObserver.observe(serviceImpactCard);
    }
});

// ===== Banking Timeline Interactive Animation =====
document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (timelineItems.length > 0) {
        // 为每个时间轴项添加过渡效果
        timelineItems.forEach((item, index) => {
            const dot = item.querySelector('.timeline-dot');
            const content = item.querySelector('.timeline-content');
            const popup = item.querySelector('.efficiency-popup');

            // 设置默认过渡效果 - 使用弹性缓动函数
            if (dot) {
                dot.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }
            if (content) {
                content.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
            if (popup) {
                popup.style.transition = 'opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }

            // 鼠标悬停效果已禁用
            // 如需启用,请取消下方代码注释
            /*
            item.addEventListener('mouseenter', function() {
                if (dot) {
                    dot.style.transform = 'scale(1.15) rotate(5deg)';
                    dot.style.boxShadow = '0 10px 30px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)';
                    dot.style.borderColor = 'rgba(255, 255, 255, 1)';
                }

                if (content) {
                    content.style.background = 'rgba(255, 255, 255, 0.2)';
                    content.style.boxShadow = '0 4px 20px rgba(255, 255, 255, 0.15)';
                }

                if (popup) {
                    popup.style.display = 'block';
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            popup.style.opacity = '1';
                            popup.style.transform = 'translateY(0) scale(1)';
                        });
                    });
                }
            });

            item.addEventListener('mouseleave', function() {
                if (dot) {
                    dot.style.transform = 'scale(1) rotate(0deg)';
                    dot.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                    dot.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }

                if (content) {
                    content.style.background = 'rgba(255, 255, 255, 0.1)';
                    content.style.boxShadow = 'none';
                }

                if (popup) {
                    popup.style.opacity = '0';
                    popup.style.transform = 'translateY(-10px) scale(0.95)';
                    setTimeout(() => {
                        popup.style.display = 'none';
                    }, 400);
                }
            });
            */

            // 初始化弹窗状态
            if (popup) {
                popup.style.opacity = '0';
                popup.style.transform = 'translateY(-10px) scale(0.95)';
            }
        });

        // 滚动时的入场动画
        const timelineObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = entry.target.querySelectorAll('.timeline-item');
                    items.forEach((item, index) => {
                        // 初始状态
                        item.style.opacity = '0';
                        item.style.transform = 'translateX(-30px)';

                        // 交错动画
                        setTimeout(() => {
                            item.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        }, index * 200);
                    });

                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        // 观察时间轴容器
        const timelineContainer = document.querySelector('.banking-timeline-card');
        if (timelineContainer) {
            timelineObserver.observe(timelineContainer);
        }

        // 时间轴线条动画
        const timelineObserverLine = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const timelineLine = card.querySelector('.timeline-container').previousElementSibling;

                    if (timelineLine) {
                        // 时间轴线条从上到下生长动画
                        timelineLine.style.height = '0';
                        timelineLine.style.transition = 'height 1.5s ease-out';

                        setTimeout(() => {
                            timelineLine.style.height = '100%';
                        }, 300);
                    }

                    timelineObserverLine.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const bankingCard = document.querySelector('.banking-timeline-card');
        if (bankingCard) {
            timelineObserverLine.observe(bankingCard);
        }

        // 添加点击效果（可选 - 移动端友好）
        timelineItems.forEach(item => {
            item.addEventListener('click', function() {
                const popup = this.querySelector('.efficiency-popup');
                if (popup) {
                    const isVisible = popup.style.display === 'block';

                    // 关闭所有其他弹窗
                    document.querySelectorAll('.efficiency-popup').forEach(p => {
                        p.style.display = 'none';
                    });

                    // 切换当前弹窗
                    if (!isVisible) {
                        popup.style.display = 'block';
                        popup.style.opacity = '1';
                        popup.style.transform = 'translateY(0)';
                    }
                }
            });
        });
    }
});

// ===== Two Column Section Animation (Vertical Layout) =====
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for vertical stacked sections
    const twoColumnObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate top and bottom sections with vertical slide
                const leftColumn = entry.target.querySelector('.left-column');
                const rightColumn = entry.target.querySelector('.right-column');

                if (leftColumn) {
                    leftColumn.style.opacity = '1';
                    leftColumn.style.transform = 'translateY(0)';
                }

                if (rightColumn) {
                    setTimeout(() => {
                        rightColumn.style.opacity = '1';
                        rightColumn.style.transform = 'translateY(0)';
                    }, 200);
                }

                // Animate advantage items in left column
                const advantageItems = entry.target.querySelectorAll('.advantage-item');
                advantageItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                        item.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    }, 300 + (index * 200));
                });

                // Animate team content in right column
                const teamParagraphs = entry.target.querySelectorAll('.team-content > p');
                teamParagraphs.forEach((p, index) => {
                    setTimeout(() => {
                        p.style.opacity = '1';
                        p.style.transform = 'translateY(0)';
                        p.style.transition = 'all 0.6s ease-out';
                    }, 400 + (index * 200));
                });

                // Animate highlight box with scale effect
                const highlightBox = entry.target.querySelector('.highlight-box');
                if (highlightBox) {
                    setTimeout(() => {
                        highlightBox.style.opacity = '1';
                        highlightBox.style.transform = 'scale(1)';
                        highlightBox.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    }, 800);
                }

                // Animate summary box
                const summaryBox = entry.target.querySelector('.summary-box');
                if (summaryBox) {
                    setTimeout(() => {
                        summaryBox.style.opacity = '1';
                        summaryBox.style.transform = 'translateY(0)';
                        summaryBox.style.transition = 'all 0.6s ease-out';
                    }, 1200);
                }

                twoColumnObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });

    // Observe the two column section
    const twoColumnSection = document.querySelector('.two-column-section');
    if (twoColumnSection) {
        // Set initial states
        const leftColumn = twoColumnSection.querySelector('.left-column');
        const rightColumn = twoColumnSection.querySelector('.right-column');

        if (leftColumn) {
            leftColumn.style.transition = 'all 0.8s ease-out';
        }

        if (rightColumn) {
            rightColumn.style.transition = 'all 0.8s ease-out';
        }

        twoColumnObserver.observe(twoColumnSection);
    }

    // Add number badge rotation animation on hover
    const advantageItems = document.querySelectorAll('.advantage-item');
    advantageItems.forEach(item => {
        const badge = item.querySelector('h3 span');
        if (badge) {
            item.addEventListener('mouseenter', function() {
                badge.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            });
        }
    });

    // ===== Progress Groups Animation =====
    const progressGroups = document.querySelectorAll('.progress-group');
    if (progressGroups.length > 0) {
        const progressObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Fade in the progress group (handles both left and right slide-in)
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';

                    // Animate each progress item within this group
                    const progressItems = entry.target.querySelectorAll('.progress-item');
                    progressItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                            item.style.transition = 'all 0.5s ease-out';

                            // Animate the progress bar
                            const progressBar = item.querySelector('.progress-bar');
                            if (progressBar) {
                                const targetWidth = progressBar.getAttribute('data-width');
                                setTimeout(() => {
                                    progressBar.style.width = targetWidth + '%';
                                }, 100);
                            }
                        }, index * 150);
                    });

                    progressObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe each progress group
        progressGroups.forEach(group => {
            group.style.transition = 'all 0.8s ease-out';
            progressObserver.observe(group);
        });
    }
});

// ===== Console Welcome Message =====
console.log('%c🤖 Welcome to AI Kiosk Pro!', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cInterested in our technology? Contact us at sales@aikioskpro.com', 'color: #5f6368; font-size: 14px;');
