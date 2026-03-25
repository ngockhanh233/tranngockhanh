(function() {
    'use strict';

    // ============================================
    // CẤU HÌNH AI CHAT
    // ============================================
    var AI_CHAT_CONFIG = {
        // Phương án 1: OpenAI API
        // apiType: 'openai',
        // apiKey: 'YOUR_OPENAI_API_KEY',
        // apiEndpoint: 'https://api.openai.com/v1/chat/completions',
        // model: 'gpt-3.5-turbo',

        // Phương án 2: Custom AI Service
        apiType: 'custom',
        apiEndpoint: 'https://chatbotprojectporfolio.onrender.com/api/chat',

        // Endpoint dùng để đánh thức server
        // Nên tạo riêng endpoint nhẹ như /api/health hoặc /api/ping ở backend
        warmupEndpoint: 'https://chatbotprojectporfolio.onrender.com/api/chat',

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

    // Tránh gọi warmup quá nhiều lần trong 1 phiên
    var hasWarmedUp = false;

    // ============================================
    // WARM UP SERVER RENDER
    // ============================================
    async function warmUpServer() {
        if (hasWarmedUp || AI_CHAT_CONFIG.apiType !== 'custom') return;
        hasWarmedUp = true;

        try {
            var headers = {
                'Content-Type': 'application/json'
            };

            if (AI_CHAT_CONFIG.apiKey) {
                headers['Authorization'] = 'Bearer ' + AI_CHAT_CONFIG.apiKey;
            }

            // Nếu backend của bạn chưa có /api/ping hoặc /api/health
            // thì tạm ping luôn /api/chat bằng payload nhẹ
            await fetch(AI_CHAT_CONFIG.warmupEndpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    message: '__warmup__'
                })
            });

            console.log('Server warm-up request sent.');
        } catch (error) {
            console.warn('Warm-up failed:', error);
        }
    }

 
  

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

    async function getCustomAPIResponse(message, conversationHistory) {
        try {
            var headers = {
                'Content-Type': 'application/json'
            };

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

            if (data.success && data.answer) {
                return data.answer;
            } else if (data.answer) {
                return data.answer;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Custom API error:', error);
            throw error;
        }
    }

    async function getAIResponse(message, conversationHistory) {
        if (AI_CHAT_CONFIG.apiType === 'openai') {
            return await getOpenAIResponse(message, conversationHistory);
        } else if (AI_CHAT_CONFIG.apiType === 'custom') {
            return await getCustomAPIResponse(message, conversationHistory);
        } else {
            throw new Error('Unsupported API type');
        }
    }

    var conversationHistory = [];

    function addToHistory(role, content) {
        conversationHistory.push({ role: role, content: content });
        if (conversationHistory.length > 20) {
            conversationHistory.shift();
        }
    }

    function addMessage(content, isUser, isError = false) {
        var chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
    
        var messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message ' + 
            (isUser ? 'chat-message-user' : 'chat-message-bot');
    
        if (isError) {
            messageDiv.classList.add('chat-message-error');
        }
    
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

    async function sendMessage() {
        var chatInput = document.getElementById('chatInput');
        var sendBtn = document.getElementById('chatSendBtn');

        if (!chatInput || !sendBtn) return;

        var message = chatInput.value.trim();
        if (!message) return;

        chatInput.disabled = true;
        sendBtn.disabled = true;
        sendBtn.classList.add('loading');

        addMessage(message, true);
        addToHistory('user', message);

        chatInput.value = '';
        addLoadingMessage();

        try {
            var response = await getAIResponse(message, conversationHistory);

            removeLoadingMessage();
            addMessage(response, false);
            addToHistory('assistant', response);
        } catch (error) {
            console.error('Error sending message:', error);
            removeLoadingMessage();
            addMessage('Gửi tin nhắn không thành công. Vui lòng thử lại sau.', false, true);
        } finally {
            chatInput.disabled = false;
            sendBtn.disabled = false;
            sendBtn.classList.remove('loading');
            chatInput.focus();
        }
    }

    function initChat() {
        var chatInput = document.getElementById('chatInput');
        var sendBtn = document.getElementById('chatSendBtn');

        if (!chatInput || !sendBtn) return;

        sendBtn.addEventListener('click', sendMessage);

        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        var chatButton = document.getElementById('chatButton');
        var chatWindow = document.getElementById('chatWindow');

        if (chatButton && chatWindow) {
            chatButton.addEventListener('click', function() {
                // Khi user mở chat thì cũng warmup luôn, nếu chưa gọi trước đó
                warmUpServer();

                setTimeout(function() {
                    if (chatWindow.classList.contains('active')) {
                        chatInput.focus();
                    }
                }, 300);
            });
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        initChat();

        // Gửi request ngầm ngay khi trang load
        warmUpServer();
    });

    window.AIChat = {
        sendMessage: sendMessage,
        addMessage: addMessage,
        getAIResponse: getAIResponse
    };

})();