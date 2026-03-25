$(window).load(function(){
	$('#preloader').fadeOut('slow',function(){$(this).remove();});
});

/******************************************************************************************************************************
Calculate Years of Experience
*******************************************************************************************************************************/
(function() {
	var codingYearsEl = document.getElementById('coding-years');
	if (codingYearsEl) {
		var startYear = 2025;
		var currentYear = new Date().getFullYear();
		var years = currentYear - startYear;
		codingYearsEl.textContent = years + '+';
	}
})();

/******************************************************************************************************************************
Dark Mode Toggle
*******************************************************************************************************************************/
(function() {
	var themeToggle = document.getElementById('themeToggle');
	var body = document.body;
	
	// Check saved preference
	var savedTheme = localStorage.getItem('theme');
	if (savedTheme === 'dark') {
		body.classList.add('dark-mode');
		if (themeToggle) themeToggle.checked = true;
	}
	
	if (themeToggle) {
		themeToggle.addEventListener('change', function() {
			if (this.checked) {
				body.classList.add('dark-mode');
				localStorage.setItem('theme', 'dark');
			} else {
				body.classList.remove('dark-mode');
				localStorage.setItem('theme', 'light');
			}
		});
	}
})();

/******************************************************************************************************************************
Modern Navigation
*******************************************************************************************************************************/
(function() {
	// Navigation toggle
	var navToggle = document.getElementById('navToggle');
	var navLinks = document.getElementById('navLinks');
	
	if (navToggle && navLinks) {
		navToggle.addEventListener('click', function() {
			navToggle.classList.toggle('active');
			navLinks.classList.toggle('active');
		});

		// Close menu when clicking a link
		var links = navLinks.querySelectorAll('.nav-link');
		links.forEach(function(link) {
			link.addEventListener('click', function() {
				navToggle.classList.remove('active');
				navLinks.classList.remove('active');
			});
		});
	}

	// Navigation scroll effect
	var nav = document.querySelector('.modern-nav');
	if (nav) {
		window.addEventListener('scroll', function() {
			if (window.scrollY > 50) {
				nav.classList.add('scrolled');
			} else {
				nav.classList.remove('scrolled');
			}
		});
	}

	// Smooth scroll for navigation links
	document.querySelectorAll('.nav-link, .hero-btn, .hero-scroll').forEach(function(link) {
		link.addEventListener('click', function(e) {
			var href = this.getAttribute('href');
			if (href && href.startsWith('#')) {
				e.preventDefault();
				var target = document.querySelector(href);
				if (target) {
					var offsetTop = target.offsetTop - 80;
					window.scrollTo({
						top: offsetTop,
						behavior: 'smooth'
					});
				}
			}
		});
	});
})();

/******************************************************************************************************************************
Chat Support Widget
*******************************************************************************************************************************/
(function() {
	var chatButton = document.getElementById('chatButton');
	var chatWindow = document.getElementById('chatWindow');
	var chatClose = document.getElementById('chatClose');
	
	if (chatButton && chatWindow && chatClose) {
		// Toggle chat window
		chatButton.addEventListener('click', function() {
			chatWindow.classList.toggle('active');
			if (chatWindow.classList.contains('active')) {
				chatButton.style.transform = 'scale(0.9)';
			} else {
				chatButton.style.transform = 'scale(1)';
			}
		});
		
		// Close chat window
		chatClose.addEventListener('click', function() {
			chatWindow.classList.remove('active');
			chatButton.style.transform = 'scale(1)';
		});
		
		// Close when clicking outside
		document.addEventListener('click', function(e) {
			var chatWidget = document.getElementById('chatWidget');
			if (chatWidget && !chatWidget.contains(e.target) && chatWindow.classList.contains('active')) {
				chatWindow.classList.remove('active');
				chatButton.style.transform = 'scale(1)';
			}
		});
		
		// Prevent closing when clicking inside chat window
		chatWindow.addEventListener('click', function(e) {
			e.stopPropagation();
		});
	}
})();

