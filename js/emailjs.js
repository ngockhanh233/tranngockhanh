/**
 * EmailJS Integration
 * Xử lý gửi email từ form liên hệ
 * 
 * Hướng dẫn cấu hình:
 * 1. Đăng ký tài khoản tại https://www.emailjs.com/
 * 2. Tạo Email Service (Gmail, Outlook, etc.)
 * 3. Tạo Email Template với các biến: {{from_name}}, {{from_email}}, {{message}}
 * 4. Thay thế YOUR_PUBLIC_KEY, YOUR_SERVICE_ID, YOUR_TEMPLATE_ID bên dưới
 */

(function() {
    'use strict';

    // ============================================
    // CẤU HÌNH EMAILJS (Encoded để bảo vệ)
    // ============================================
    var _e = function(s) { return atob(s); }; // Decode function
    
    var EMAILJS_CONFIG = {
        publicKey: _e('TWdHX3dZZGtMbkZlZEo4ZFE='),           // Encoded
        serviceId: _e('c2VydmljZV8xeWZxZ3p2'),               // Encoded
        templateAutoReply: _e('dGVtcGxhdGVfazhxbnFjbg=='),   // Encoded
        templateNotify: _e('dGVtcGxhdGVfb2MyajVjcA==')       // Encoded
    };

    // ============================================
    // KHỞI TẠO EMAILJS
    // ============================================
    function initEmailJS() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_CONFIG.publicKey);
            console.log('EmailJS initialized successfully');
        } else {
            console.error('EmailJS SDK not loaded');
        }
    }

    // ============================================
    // LẤY THỜI GIAN HIỆN TẠI
    // ============================================
    function getCurrentTime() {
        var now = new Date();
        var options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        return now.toLocaleString('vi-VN', options);
    }

    // ============================================
    // XỬ LÝ GỬI EMAIL
    // ============================================
    function sendEmail(formData) {
        var templateParams = {
            name: formData.name,           // Tên người gửi (từ form) - dùng cho {{name}}
            email: formData.email,         // Email người gửi (từ form) - dùng cho {{email}}
            message: formData.message,     // Nội dung tin nhắn (từ form) - dùng cho {{message}}
            time: getCurrentTime(),        // Thời gian gửi - dùng cho {{time}}
            reply_to: formData.email       // Email để reply lại
        };

        // Gửi cả 2 email: thông báo cho bạn + phản hồi tự động cho người gửi
        var notifyPromise = emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateNotify,
            templateParams
        );

        var autoReplyPromise = emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateAutoReply,
            templateParams
        );

        // Đợi cả 2 email gửi xong
        return Promise.all([notifyPromise, autoReplyPromise]);
    }

    // ============================================
    // HIỂN THỊ THÔNG BÁO
    // ============================================
    function showNotification(type, message) {
        // Xóa notification cũ nếu có
        var existingNotification = document.querySelector('.email-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Tạo notification mới
        var notification = document.createElement('div');
        notification.className = 'email-notification ' + type;
        notification.innerHTML = '<i class="bi ' + (type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill') + '"></i><span>' + message + '</span>';

        document.body.appendChild(notification);

        // Animation hiển thị
        setTimeout(function() {
            notification.classList.add('show');
        }, 10);

        // Tự động ẩn sau 5 giây
        setTimeout(function() {
            notification.classList.remove('show');
            setTimeout(function() {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // ============================================
    // CẬP NHẬT TRẠNG THÁI NÚT GỬI
    // ============================================
    function setButtonLoading(button, isLoading) {
        var btnText = button.querySelector('.btn-text');
        var btnIcon = button.querySelector('.btn-icon i');

        if (isLoading) {
            button.disabled = true;
            button.classList.add('loading');
            if (btnText) btnText.textContent = 'Đang gửi...';
            if (btnIcon) {
                btnIcon.className = 'bi bi-arrow-repeat spin';
            }
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            if (btnText) btnText.textContent = 'Send Message';
            if (btnIcon) {
                btnIcon.className = 'bi bi-send-fill';
            }
        }
    }

    // ============================================
    // VALIDATE FORM
    // ============================================
    function validateForm(formData) {
        var errors = [];

        if (!formData.name || formData.name.trim().length < 2) {
            errors.push('Vui lòng nhập tên (ít nhất 2 ký tự)');
        }

        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            errors.push('Vui lòng nhập email hợp lệ');
        }

        if (!formData.message || formData.message.trim().length < 10) {
            errors.push('Vui lòng nhập tin nhắn (ít nhất 10 ký tự)');
        }

        return errors;
    }

    // ============================================
    // XỬ LÝ SUBMIT FORM
    // ============================================
    function handleFormSubmit(event) {
        event.preventDefault();

        var form = event.target;
        var submitBtn = form.querySelector('.send-btn');

        // Lấy dữ liệu form
        var formData = {
            name: form.querySelector('#name').value,
            email: form.querySelector('#email').value,
            message: form.querySelector('#message').value
        };

        // Validate
        var errors = validateForm(formData);
        if (errors.length > 0) {
            showNotification('error', errors[0]);
            return;
        }

        // Kiểm tra cấu hình
        if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
            showNotification('error', 'Vui lòng cấu hình EmailJS trước khi sử dụng');
            console.error('EmailJS chưa được cấu hình. Vui lòng thay đổi các giá trị trong EMAILJS_CONFIG');
            return;
        }

        // Hiển thị loading
        setButtonLoading(submitBtn, true);

        // Gửi email
        sendEmail(formData)
            .then(function(response) {
                console.log('Email sent successfully:', response);
                showNotification('success', 'Gửi tin nhắn thành công! Tôi sẽ phản hồi sớm nhất có thể.');
                form.reset();
            })
            .catch(function(error) {
                console.error('Failed to send email:', error);
                showNotification('error', 'Gửi tin nhắn thất bại. Vui lòng thử lại sau.');
            })
            .finally(function() {
                setButtonLoading(submitBtn, false);
            });
    }

    // ============================================
    // KHỞI TẠO KHI DOM READY
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        // Khởi tạo EmailJS
        initEmailJS();

        // Tìm form liên hệ
        var contactForm = document.querySelector('.creative-form');
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }
    });

})();

