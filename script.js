/* ============================================================
   منزل الأحلام — سكربت الموقع
   - قائمة الجوال
   - تأثيرات التمرير
   - فتح الصور في نافذة عرض كبيرة
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    /* ---------- السنة الحالية في التذييل ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    /* ---------- قائمة الجوال ---------- */
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('primary-nav');

    function closeMenu() {
        if (!nav || !menuToggle) return;
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'فتح القائمة');
    }

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function () {
            const isOpen = nav.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.setAttribute('aria-label', isOpen ? 'إغلاق القائمة' : 'فتح القائمة');
        });

        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('click', function (event) {
            if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
                closeMenu();
            }
        });

        window.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') closeMenu();
        });
    }

    /* ---------- ظل الشريط عند التمرير ---------- */
    const header = document.querySelector('.site-header');
    if (header) {
        const updateHeader = function () {
            header.classList.toggle('is-scrolled', window.scrollY > 24);
        };
        updateHeader();
        window.addEventListener('scroll', updateHeader, { passive: true });
    }

    /* ---------- إبراز الرابط النشط ---------- */
    const navLinks = Array.from(document.querySelectorAll('.primary-nav a[href^="#"]'));
    const sections = navLinks
        .map(function (link) {
            return document.querySelector(link.getAttribute('href'));
        })
        .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
        const sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function (link) {
                    link.classList.toggle(
                        'is-active',
                        link.getAttribute('href') === '#' + entry.target.id
                    );
                });
            });
        }, { rootMargin: '-35% 0px -55% 0px' });

        sections.forEach(function (section) {
            sectionObserver.observe(section);
        });
    }

    /* ---------- ظهور العناصر عند التمرير ---------- */
    const revealItems = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        revealItems.forEach(function (el) {
            el.classList.add('is-visible');
        });
    } else {
        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealItems.forEach(function (el) {
            revealObserver.observe(el);
        });
    }

    /* ---------- نافذة عرض الصورة ---------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxSpecs = document.getElementById('lightbox-specs');
    let lastFocused = null;

    function fillSpecs(specs) {
        if (!lightboxSpecs) return;
        lightboxSpecs.replaceChildren();
        specs.forEach(function (spec) {
            const li = document.createElement('li');
            li.textContent = spec;
            lightboxSpecs.appendChild(li);
        });
    }

    function openLightbox(data) {
        if (!lightbox || !lightboxImage) return;
        lastFocused = document.activeElement;

        lightboxImage.src = data.src;
        lightboxImage.alt = data.alt || data.title || '';
        if (lightboxTitle) lightboxTitle.textContent = data.title || '';
        if (lightboxDesc) lightboxDesc.textContent = data.desc || '';
        fillSpecs(data.specs || []);

        lightbox.hidden = false;
        document.body.classList.add('lightbox-open');
        const closeButton = lightbox.querySelector('.lightbox-close');
        if (closeButton) closeButton.focus();
    }

    function closeLightbox() {
        if (!lightbox || lightbox.hidden) return;
        lightbox.hidden = true;
        document.body.classList.remove('lightbox-open');
        if (lightboxImage) lightboxImage.removeAttribute('src');
        if (lastFocused && typeof lastFocused.focus === 'function') {
            lastFocused.focus();
        }
    }

    /* فتح من بطاقات المنتجات */
    document.querySelectorAll('.product-media').forEach(function (button) {
        button.addEventListener('click', function () {
            const card = button.closest('.product-card');
            if (!card) return;
            const img = button.querySelector('img');
            const rawSpecs = card.dataset.specs || '';

            openLightbox({
                src: img ? img.getAttribute('src') : '',
                alt: img ? img.alt : '',
                title: card.dataset.name || '',
                desc: card.dataset.desc || '',
                specs: rawSpecs.split('|').filter(Boolean)
            });
        });
    });

    /* فتح من معرض الصور */
    document.querySelectorAll('.gallery-item').forEach(function (button) {
        button.addEventListener('click', function () {
            const img = button.querySelector('img');
            const caption = button.querySelector('.gallery-caption');
            const title = caption ? caption.textContent.trim() : 'تصميم منزلي';

            openLightbox({
                src: img ? img.getAttribute('src') : '',
                alt: img ? img.alt : title,
                title: title,
                desc: 'صورة من معرض التصاميم المنزلية، تُعرض بحجم أكبر لرؤية التفاصيل المتاحة.',
                specs: ['صورة من مجلد gallery', 'تفاصيل إضافية غير متوفرة في الملف']
            });
        });
    });

    if (lightbox) {
        lightbox.querySelectorAll('[data-close]').forEach(function (el) {
            el.addEventListener('click', function (event) {
                event.preventDefault();
                closeLightbox();
            });
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') closeLightbox();
        });
    }
});
