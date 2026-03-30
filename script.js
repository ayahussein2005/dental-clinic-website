
//  المتغيرات العامة 
let bookingCount = 0;
let currentYear = new Date().getFullYear();
let isMenuOpen = false;
let selectedService = '';
let formSubmissions = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ تم تحميل DOM بالكامل');
    
    //  عناصر DOM الرئيسية 
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const header = document.querySelector('.main-header');
    const bookingForm = document.querySelector('.contact-form form');
    const serviceCards = document.querySelectorAll('.service-card');
    const doctorCards = document.querySelectorAll('.doctor-card');
    const footerYear = document.querySelector('.footer-bottom p');
    const contactForm = document.getElementById('contactForm'); // سنضيف هذا الـ ID للنموذج


    // دالة تحديث سنة الحقوق في الفوتر
    function updateFooterYear() {
        if (footerYear) {
            footerYear.innerHTML = `جميع الحقوق محفوظة © ${currentYear} عيادة الرائعة البسمة لطب الأسنان`;
            console.log('✅ تم تحديث سنة الحقوق:', currentYear);
        }
    }

    // دالة إنشاء عنصر إشعار ديناميكي
    function createNotification(message, type = 'success') {
        // إزالة أي إشعار سابق
        const oldNotification = document.querySelector('.notification');
        if (oldNotification) {
            oldNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // تحديد الأيقونة حسب نوع الإشعار
        let icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';
        if (type === 'info') icon = 'fa-info-circle';
        if (type === 'warning') icon = 'fa-exclamation-triangle';
        
        notification.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#2E8B57' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#1a365d'};
            color: ${type === 'warning' ? '#000' : '#fff'};
            padding: 15px 30px;
            border-radius: 50px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 12px;
            font-family: 'Tajawal', sans-serif;
            font-size: 1rem;
            font-weight: 500;
            direction: rtl;
            animation: slideDown 0.3s ease;
            max-width: 90%;
            text-align: center;
            justify-content: center;
            border: 2px solid rgba(255,255,255,0.2);
        `;
        
        document.body.appendChild(notification);
        console.log(`🔔 إشعار: ${message}`);
        
        // إزالة الإشعار بعد 3 ثواني
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    if (notification && notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
        
        return notification;
    }

    // دالة التحقق من صحة البريد الإلكتروني
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // دالة التحقق من صحة رقم الهاتف (أرقام فقط)
    function validatePhone(phone) {
        const re = /^[\d\+\-\(\)\s]{10,}$/;
        return re.test(phone);
    }

    // دالة تحديث عداد الحجوزات
    function updateBookingCounter() {
        let counterElement = document.querySelector('.booking-counter');
        
        if (!counterElement) {
            counterElement = document.createElement('div');
            counterElement.className = 'booking-counter';
            counterElement.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #2E8B57;
                color: white;
                padding: 12px 25px;
                border-radius: 50px;
                box-shadow: 0 5px 20px rgba(46, 139, 86, 0.3);
                z-index: 9998;
                font-family: 'Tajawal', sans-serif;
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 500;
                border: 2px solid rgba(255,255,255,0.2);
                direction: rtl;
            `;
            document.body.appendChild(counterElement);
        }
        
        counterElement.innerHTML = `
            <i class="fa-solid fa-calendar-check" style="font-size: 1.2rem;"></i>
            <span>عدد الحجوزات: ${bookingCount}</span>
        `;
        
        // إضافة حدث click على العداد
        counterElement.onclick = () => {
            let message = `📊 إحصائيات الحجوزات:\nعدد الحجوزات الكلي: ${bookingCount}`;
            if (formSubmissions.length > 0) {
                message += `\n\nآخر الحجوزات:`;
                formSubmissions.slice(-3).forEach((sub, index) => {
                    message += `\n${index + 1}. ${sub.name || 'غير معروف'} - ${sub.service || 'خدمة غير محددة'}`;
                });
            } else {
                message += `\n\nلا توجد حجوزات سابقة`;
            }
            alert(message);
            console.log('📊 تم عرض إحصائيات الحجوزات');
        };

        // تأثير hover
        counterElement.addEventListener('mouseenter', () => {
            counterElement.style.transform = 'scale(1.05)';
            counterElement.style.background = '#1a365d';
        });
        
        counterElement.addEventListener('mouseleave', () => {
            counterElement.style.transform = 'scale(1)';
            counterElement.style.background = '#2E8B57';
        });
    }

    
    function setupFormHandler() {
        // البحث عن النموذج بعدة طرق
        const form = document.querySelector('.contact-form form') || 
                     document.querySelector('form') ||
                     document.getElementById('contactForm');
        
        if (form) {
            console.log('✅ تم العثور على النموذج:', form);
            
            // إضافة ID للنموذج ليسهل الوصول إليه
            if (!form.id) {
                form.id = 'contactForm';
            }
            
            // إزالة أي مستمعات أحداث سابقة (لتجنب التكرار)
            form.removeEventListener('submit', handleFormSubmit);
            
            // إضافة مستمع الحدث الجديد
            form.addEventListener('submit', handleFormSubmit);
            
            console.log('✅ تم ربط حدث submit بالنموذج بنجاح');
        } else {
            console.error('❌ لم يتم العثور على النموذج!');
            
            // محاولة إيجاد النموذج مرة أخرى بعد تأخير
            setTimeout(() => {
                const retryForm = document.querySelector('.contact-form form') || document.querySelector('form');
                if (retryForm) {
                    console.log('✅ تم العثور على النموذج بعد تأخير');
                    retryForm.addEventListener('submit', handleFormSubmit);
                } else {
                    console.error('❌ لا يزال النموذج غير موجود');
                }
            }, 500);
        }
    }

    // دالة معالجة إرسال النموذج
    function handleFormSubmit(e) {
        e.preventDefault(); // منع إعادة تحميل الصفحة
        e.stopPropagation(); // منع انتشار الحدث
        
        console.log('📝 تم استدعاء دالة إرسال النموذج');
        
        // الحصول على النموذج
        const form = e.target;
        
        // جمع بيانات النموذج
        const nameInput = form.querySelector('input[type="text"]') || form.querySelector('input[name="name"]');
        const phoneInput = form.querySelector('input[type="tel"]') || form.querySelector('input[name="phone"]');
        const emailInput = form.querySelector('input[type="email"]') || form.querySelector('input[name="email"]');
        const serviceSelect = form.querySelector('select');
        const notesTextarea = form.querySelector('textarea');
        
        // الحصول على القيم
        const name = nameInput ? nameInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const service = serviceSelect ? serviceSelect.value : '';
        const serviceText = serviceSelect && serviceSelect.options[serviceSelect.selectedIndex] ? 
                           serviceSelect.options[serviceSelect.selectedIndex].text : 'غير محدد';
        const notes = notesTextarea ? notesTextarea.value.trim() : '';
        
        console.log('📋 بيانات النموذج:', { name, phone, email, service, notes });
        
        // التحقق من الحقول المطلوبة
        if (!name) {
            createNotification('❌ الرجاء إدخال الاسم', 'error');
            if (nameInput) {
                nameInput.style.borderColor = '#dc3545';
                nameInput.focus();
            }
            return;
        }
        
        if (!phone) {
            createNotification('❌ الرجاء إدخال رقم الهاتف', 'error');
            if (phoneInput) {
                phoneInput.style.borderColor = '#dc3545';
                phoneInput.focus();
            }
            return;
        }
        
        // التحقق من صحة رقم الهاتف 
        if (phone.length < 10) {
            createNotification('❌ رقم الهاتف يجب أن يكون 10 أرقام على الأقل', 'error');
            if (phoneInput) {
                phoneInput.style.borderColor = '#dc3545';
                phoneInput.focus();
            }
            return;
        }
        
        // التحقق من البريد الإلكتروني إذا تم إدخاله
        if (email && !validateEmail(email)) {
            createNotification('❌ الرجاء إدخال بريد إلكتروني صحيح', 'error');
            if (emailInput) {
                emailInput.style.borderColor = '#dc3545';
                emailInput.focus();
            }
            return;
        }
        
        // زيادة عداد الحجوزات
        bookingCount++;
        
        // حفظ البيانات
        const submission = {
            id: Date.now(),
            name: name,
            phone: phone,
            email: email || 'غير مدخل',
            service: serviceText,
            serviceValue: service,
            notes: notes || 'بدون ملاحظات',
            date: new Date().toLocaleString('ar-EG'),
            timestamp: new Date().toISOString()
        };
        
        formSubmissions.push(submission);
        
        // حفظ في localStorage كنسخة احتياطية
        try {
            localStorage.setItem('clinicBookings', JSON.stringify(formSubmissions));
        } catch (error) {
            console.warn('⚠️ لم نتمكن من حفظ البيانات محلياً');
        }
        
        // عرض رسالة نجاح
        createNotification(`✅ تم إرسال طلبك بنجاح! رقم الحجز: ${bookingCount}`);
        
        // تحديث العداد
        updateBookingCounter();
        
        // إعادة تعيين ألوان الحقول
        if (nameInput) nameInput.style.borderColor = '';
        if (phoneInput) phoneInput.style.borderColor = '';
        if (emailInput) emailInput.style.borderColor = '';
        
        // مسح النموذج
        form.reset();
        
        // رسالة تأكيد في الكونسول
        console.log('✅ تم إرسال حجز جديد بنجاح:', submission);
        console.log(`📊 إجمالي الحجوزات: ${bookingCount}`);
        
        //  تمرير سلس إلى أعلى الصفحة
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 1000);
        
        return false; // منع أي سلوك افتراضي إضافي
    }


    // حدث التمرير
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            } else {
                header.style.background = '#ffffff';
                header.style.backdropFilter = 'none';
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }
        });
    }

    // حدث النقر على زر القائمة
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            mainNav.classList.toggle('active');
            
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (isMenuOpen) {
                    icon.className = 'fa-solid fa-times';
                } else {
                    icon.className = 'fa-solid fa-bars';
                }
            }
            
            document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
            console.log('🍔 حالة القائمة:', isMenuOpen ? 'مفتوحة' : 'مغلقة');
        });
    }

    // أحداث بطاقات الخدمات
    serviceCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('click', () => {
            const serviceTitle = card.querySelector('h3')?.textContent || 'خدمة';
            const serviceSelect = document.querySelector('select');
            
            if (serviceSelect) {
                for (let option of serviceSelect.options) {
                    if (option.text.includes(serviceTitle)) {
                        option.selected = true;
                        break;
                    }
                }
            }
            
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            createNotification(`✨ تم اختيار: ${serviceTitle}`, 'info');
            console.log(`🖱️ تم اختيار خدمة: ${serviceTitle}`);
        });
    });

    // أحداث روابط القائمة
    document.querySelectorAll('.main-nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                if (isMenuOpen && mainNav && mobileMenuBtn) {
                    mainNav.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) icon.className = 'fa-solid fa-bars';
                    isMenuOpen = false;
                    document.body.style.overflow = 'auto';
                }
                
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // أحداث أزرار "احجز الآن"
    document.querySelectorAll('.service-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const serviceCard = link.closest('.service-card');
            const serviceTitle = serviceCard?.querySelector('h3')?.textContent || 'خدمة';
            
            const serviceSelect = document.querySelector('select');
            if (serviceSelect) {
                for (let option of serviceSelect.options) {
                    if (option.text.includes(serviceTitle)) {
                        option.selected = true;
                        break;
                    }
                }
            }
            
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            console.log(`🔗 تم النقر على احجز الآن لخدمة: ${serviceTitle}`);
        });
    });

    // حدث تحميل الصفحة
    window.addEventListener('load', () => {
        console.log('🚀 تم تحميل الصفحة بالكامل');
        
        // تحديث سنة الحقوق
        updateFooterYear();
        
        // إنشاء عداد الحجوزات
        updateBookingCounter();
        
        // إضافة أنماط CSS للحركات
        addAnimationStyles();
        
        // محاولة استرجاع الحجوزات السابقة من localStorage
        try {
            const savedBookings = localStorage.getItem('clinicBookings');
            if (savedBookings) {
                formSubmissions = JSON.parse(savedBookings);
                bookingCount = formSubmissions.length;
                console.log(`📦 تم استرجاع ${bookingCount} حجز من التخزين المحلي`);
                updateBookingCounter();
            }
        } catch (error) {
            console.warn('⚠️ لا يوجد حجوزات سابقة');
        }
        
        // عرض رسالة ترحيب بعد ثانية
        setTimeout(() => {
            createNotification('👋 مرحباً بك في عيادة الرائعة البسمة', 'info');
        }, 1000);
    });

    // دالة إضافة أنماط CSS
    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from {
                    transform: translate(-50%, -100%);
                    opacity: 0;
                }
                to {
                    transform: translate(-50%, 0);
                    opacity: 1;
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
            
            .notification {
                direction: rtl;
            }
            
            .booking-counter:hover {
                transform: scale(1.05) !important;
            }
            
            .main-nav.active {
                transform: translateY(0) !important;
            }
            
            /* تحسين مظهر الحقول عند الخطأ */
            input:focus, select:focus, textarea:focus {
                outline: none;
                box-shadow: 0 0 0 3px rgba(46, 139, 86, 0.1);
            }
        `;
        document.head.appendChild(style);
    }

    // محاولة ربط النموذج فوراً
    setupFormHandler();
    
    // محاولة ربط النموذج مرة أخرى بعد تأخير للتأكد
    setTimeout(setupFormHandler, 1000);
    
    // إضافة مستمع لأي تغييرات في DOM قد تضيف النموذج
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                const form = document.querySelector('.contact-form form') || document.querySelector('form');
                if (form && !form.hasSubmitListener) {
                    console.log('🔄 تم اكتشاف إضافة نموذج جديد، جاري الربط...');
                    form.removeEventListener('submit', handleFormSubmit);
                    form.addEventListener('submit', handleFormSubmit);
                    form.hasSubmitListener = true;
                }
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('✅ تم تهيئة جميع وظائف JavaScript بنجاح');
});

window.clinicApp = {
    bookingCount: () => bookingCount,
    formSubmissions: () => formSubmissions,
    showNotification: createNotification,
    resetBookings: () => {
        bookingCount = 0;
        formSubmissions = [];
        localStorage.removeItem('clinicBookings');
        updateBookingCounter();
        console.log('🔄 تم إعادة تعيين الحجوزات');
    }
};