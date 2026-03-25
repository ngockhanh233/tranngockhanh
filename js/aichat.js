/**
 * AI Chat Integration
 * Tích hợp chatbot AI để trả lời tự động
 * 
 * Hướng dẫn cấu hình:
 * 1. Chọn một trong các phương án:
 *    - OpenAI API (cần API key)
 *    - Custom AI service endpoint
 *    - Rule-based chatbot (không cần API)
 * 
 * 2. Cấu hình API endpoint và key trong AI_CHAT_CONFIG bên dưới
 */

(function() {
    'use strict';

    // ============================================
    // CẤU HÌNH AI CHAT
    // ============================================
    var AI_CHAT_CONFIG = {
        // Phương án 1: OpenAI API
        // apiType: 'openai',
        // apiKey: 'YOUR_OPENAI_API_KEY', // Thay bằng API key của bạn
        // apiEndpoint: 'https://api.openai.com/v1/chat/completions',
        // model: 'gpt-3.5-turbo',

        // Phương án 2: Custom AI Service
        apiType: 'custom',
        apiEndpoint: 'https://chatbotprojectporfolio.onrender.com/api/chat',
        userInfo: {
            name: 'Khanh',
            role: 'Software Developer & Guitarist',
            email: 'ngockhanh23032003@gmail.com',
            phone: '0342 837 537',
            location: 'Ho Chi Minh City, Vietnam',
            skills: ['PHP Laravel', 'React Native', 'Flutter', 'C#', 'ASP.NET'],
            experience: '1+ years coding, 6+ years guitar performance'
        }
    };

    // ============================================
    // RULE-BASED RESPONSES (Fallback)
    // ============================================
    var ruleBasedResponses = {
        greetings: [
            'Xin chào! 👋 Tôi có thể giúp gì cho bạn?',
            'Chào bạn! Bạn muốn biết gì về Khanh?',
            'Hello! Tôi sẵn sàng trả lời các câu hỏi của bạn.'
        ],
        about: [
            'Khanh là một Software Developer và Guitarist đầy đam mê. Anh ấy có hơn 1 năm kinh nghiệm lập trình và 6+ năm biểu diễn guitar trên sân khấu.',
            'Khanh là developer chuyên về PHP Laravel, React Native, Flutter và các công nghệ web hiện đại. Ngoài ra, anh ấy còn là một guitarist với nhiều năm kinh nghiệm biểu diễn.',
            'Khanh đang làm việc tại BSP Software với vai trò PHP Laravel Developer. Anh ấy cũng có kinh nghiệm với React Native tại Tanca Company.'
        ],
        skills: [
            'Khanh có kỹ năng về: Web Development (Laravel, C#, ASP.NET), Mobile Development (React Native, Flutter), Database (MySQL, SQL Server, Oracle), và Design Tools (Figma, Photoshop, Canva).',
            'Các công nghệ chính: PHP Laravel, React Native, Flutter, C#, ASP.NET, MySQL, và nhiều công cụ khác.',
            'Khanh chuyên về full-stack development với Laravel, mobile apps với React Native/Flutter, và có kinh nghiệm với nhiều database systems.'
        ],
        contact: [
            'Bạn có thể liên hệ Khanh qua:\n📧 Email: ngockhanh23032003@gmail.com\n📱 Phone: 0342 837 537\n📍 Location: Ho Chi Minh City, Vietnam',
            'Để liên hệ, bạn có thể:\n- Gửi email đến ngockhanh23032003@gmail.com\n- Gọi điện: 0342 837 537\n- Hoặc điền form liên hệ trên website',
            'Thông tin liên hệ:\nEmail: ngockhanh23032003@gmail.com\nSố điện thoại: 0342 837 537\nĐịa chỉ: Ho Chi Minh City, Vietnam'
        ],
        portfolio: [
            'Bạn có thể xem portfolio và kinh nghiệm của Khanh trong phần Experience và Highlights trên website này.',
            'Khanh đã làm việc tại Tanca Company (React Native Developer) và hiện tại tại BSP Software (PHP Laravel Developer).',
            'Portfolio bao gồm các dự án web và mobile apps, cùng với các buổi biểu diễn guitar tại HUFLIT Music Club.'
        ],
        default: [
            'Cảm ơn bạn đã quan tâm! Bạn có thể hỏi về:\n- Thông tin về Khanh\n- Kỹ năng và kinh nghiệm\n- Cách liên hệ\n- Portfolio và dự án',
            'Tôi có thể giúp bạn tìm hiểu về Khanh. Hãy hỏi về skills, experience, hoặc cách liên hệ nhé!',
            'Bạn muốn biết gì về Khanh? Tôi có thể trả lời về background, skills, hoặc contact information.'
        ]
    };

    // ============================================
    // XỬ LÝ TIN NHẮN VỚI RULE-BASED
    // ============================================
    function getRuleBasedResponse(message) {
        var lowerMessage = message.toLowerCase().trim();
        
        // Greetings
        if (lowerMessage.match(/^(hi|hello|chào|xin chào|hey|chào bạn)/)) {
            return getRandomResponse(ruleBasedResponses.greetings);
        }
        
        // About
        if (lowerMessage.match(/(giới thiệu|about|về|khanh là ai|ai là khanh|who is)/)) {
            return getRandomResponse(ruleBasedResponses.about);
        }
        
        // Skills
        if (lowerMessage.match(/(kỹ năng|skills|công nghệ|technology|biết gì|can do|expertise)/)) {
            return getRandomResponse(ruleBasedResponses.skills);
        }
        
        // Contact
        if (lowerMessage.match(/(liên hệ|contact|email|phone|số điện thoại|địa chỉ|address)/)) {
            return getRandomResponse(ruleBasedResponses.contact);
        }
        
        // Portfolio/Experience
        if (lowerMessage.match(/(portfolio|kinh nghiệm|experience|dự án|project|làm việc|work)/)) {
            return getRandomResponse(ruleBasedResponses.portfolio);
        }
        
        // Default
        return getRandomResponse(ruleBasedResponses.default);
    }

    function getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // ============================================
    // XỬ LÝ VỚI OPENAI API
    // ============================================
    async function getOpenAIResponse(message, conversationHistory) {
        try {
            var response = await fetch(AI_CHAT_CONFIG.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + AI_CHAT_CONFIG.apiKey
                },
                body: JSON.stringify({
                    model: AI_CHAT_CONFIG.model || 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'Bạn là AI assistant của Khanh, một Software Developer và Guitarist. Trả lời ngắn gọn, thân thiện bằng tiếng Việt. Thông tin về Khanh: ' + JSON.stringify(AI_CHAT_CONFIG.userInfo)
                        },
                        ...conversationHistory,
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    max_tokens: 200,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            var data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API error:', error);
            throw error;
        }
    }

    // ============================================
    // XỬ LÝ VỚI CUSTOM API
    // ============================================
    async function getCustomAPIResponse(message, conversationHistory) {
        try {
            var headers = {
                'Content-Type': 'application/json'
            };

            // Thêm Authorization header nếu có API key
            if (AI_CHAT_CONFIG.apiKey) {
                headers['Authorization'] = 'Bearer ' + AI_CHAT_CONFIG.apiKey;
            }

            var response = await fetch(AI_CHAT_CONFIG.apiEndpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    message: message
                })
            });

            if (!response.ok) {
                throw new Error('API request failed with status: ' + response.status);
            }

            var data = await response.json();
            
            // Xử lý response theo format: { answer, question, success }
            if (data.success && data.answer) {
                return data.answer;
            } else if (data.answer) {
                // Nếu có answer nhưng không có success field
                return data.answer;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Custom API error:', error);
            throw error;
        }
    }

    // ============================================
    // LẤY PHẢN HỒI TỪ AI
    // ============================================
    async function getAIResponse(message, conversationHistory) {
        try {
            if (AI_CHAT_CONFIG.apiType === 'openai') {
                return await getOpenAIResponse(message, conversationHistory);
            } else if (AI_CHAT_CONFIG.apiType === 'custom') {
                return await getCustomAPIResponse(message, conversationHistory);
            } else {
                // Rule-based fallback
                return getRuleBasedResponse(message);
            }
        } catch (error) {
            console.error('AI response error:', error);
            // Fallback to rule-based
            return getRuleBasedResponse(message);
        }
    }

    // ============================================
    // QUẢN LÝ LỊCH SỬ CHAT
    // ============================================
    var conversationHistory = [];

    function addToHistory(role, content) {
        conversationHistory.push({ role: role, content: content });
        // Giới hạn lịch sử để tránh quá dài
        if (conversationHistory.length > 20) {
            conversationHistory.shift();
        }
    }

    // ============================================
    // HIỂN THỊ TIN NHẮN
    // ============================================
    function addMessage(content, isUser) {
        var chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        var messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message ' + (isUser ? 'chat-message-user' : 'chat-message-bot');

        var avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<i class="bi ' + (isUser ? 'bi-person-fill' : 'bi-robot') + '"></i>';

        var messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        var p = document.createElement('p');
        p.textContent = content;
        messageContent.appendChild(p);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        scrollToBottom();
    }

    function addLoadingMessage() {
        var chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        var loadingDiv = document.createElement('div');
        loadingDiv.className = 'chat-message chat-message-bot';
        loadingDiv.id = 'chatLoading';

        var avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<i class="bi bi-robot"></i>';

        var loadingContent = document.createElement('div');
        loadingContent.className = 'message-content chat-message-loading';
        loadingContent.innerHTML = '<span></span><span></span><span></span>';

        loadingDiv.appendChild(avatar);
        loadingDiv.appendChild(loadingContent);
        chatMessages.appendChild(loadingDiv);

        scrollToBottom();
    }

    function removeLoadingMessage() {
        var loading = document.getElementById('chatLoading');
        if (loading) {
            loading.remove();
        }
    }

    function scrollToBottom() {
        var chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // ============================================
    // XỬ LÝ GỬI TIN NHẮN
    // ============================================
    async function sendMessage() {
        var chatInput = document.getElementById('chatInput');
        var sendBtn = document.getElementById('chatSendBtn');
        
        if (!chatInput || !sendBtn) return;

        var message = chatInput.value.trim();
        if (!message) return;

        // Disable input và button
        chatInput.disabled = true;
        sendBtn.disabled = true;
        sendBtn.classList.add('loading');

        // Hiển thị tin nhắn của user
        addMessage(message, true);
        addToHistory('user', message);

        // Clear input
        chatInput.value = '';

        // Hiển thị loading
        addLoadingMessage();

        try {
            // Lấy phản hồi từ AI
            var response = await getAIResponse(message, conversationHistory);
            
            // Xóa loading
            removeLoadingMessage();

            // Hiển thị phản hồi
            addMessage(response, false);
            addToHistory('assistant', response);
        } catch (error) {
            console.error('Error sending message:', error);
            removeLoadingMessage();
            addMessage('Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.', false);
        } finally {
            // Enable lại input và button
            chatInput.disabled = false;
            sendBtn.disabled = false;
            sendBtn.classList.remove('loading');
            chatInput.focus();
        }
    }

    // ============================================
    // KHỞI TẠO EVENT LISTENERS
    // ============================================
    function initChat() {
        var chatInput = document.getElementById('chatInput');
        var sendBtn = document.getElementById('chatSendBtn');

        if (!chatInput || !sendBtn) return;

        // Send button click
        sendBtn.addEventListener('click', sendMessage);

        // Enter key press
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Focus input when chat opens
        var chatButton = document.getElementById('chatButton');
        var chatWindow = document.getElementById('chatWindow');
        
        if (chatButton && chatWindow) {
            chatButton.addEventListener('click', function() {
                setTimeout(function() {
                    if (chatWindow.classList.contains('active')) {
                        chatInput.focus();
                    }
                }, 300);
            });
        }
    }

    // ============================================
    // KHỞI TẠO KHI DOM READY
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        initChat();
    });

    // Export functions for external use
    window.AIChat = {
        sendMessage: sendMessage,
        addMessage: addMessage,
        getAIResponse: getAIResponse
    };

})();
