const movies = [
	{
		title: "Brinquedo Assassino 2",
		year: 1990,
		director: "John Lafia",
		description:
			"Um boneco que sai matando todo mundo.",
		poster: "https://play-lh.googleusercontent.com/wxQ5uIQ7jFpr-NIvCXJ2OnuNMwo-hnV3cGs7f8K__coll7WrMesB8g4CWFWOD-xxJ5sZ"
	},
	{
		title: "O Exorcista",
		year: 1974,
		director: "William Friedkin",
		description:
			"Uma mulher possuída",
		poster: "https://br.web.img2.acsta.net/medias/nmedia/18/87/26/84/19873738.jpg"
	},
	{
		title: "Hereditário",
		year: 2018,
		director: " Ari Aster",
		description:
			"A garota perde a cabeça numa batida contra um poste.",
		poster:
			"https://upload.wikimedia.org/wikipedia/pt/d/d9/Hereditary.png"
	},
	{
		title: "O Bebê de Rosemary",
		year: 1969,
		director: "Roman Polanski",
		description:
			"Uma grávida que fica doida (acontece neh).",
		poster: "https://m.media-amazon.com/images/I/61EJd9oPopL._AC_UF1000,1000_QL80_.jpg"
	},
	{
		title: "V/H/S",
		year: 2012,
		director: "Ti West",
		description:
			"É sobre uma fita cassete.",
		poster:
			"https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/91/30/92/20139126.jpg"
	}
];

class MovieCarousel {
	constructor() {
		this.currentIndex = Math.floor(movies.length / 2);
		this.isPlaying = false;
		this.autoplayInterval = null;
		this.carousel = document.getElementById("movieCarousel");
		this.movieInfo = document.getElementById("movieInfo");
		this.touchStartX = 0;
		this.touchEndX = 0;

		this.initializeCarousel();
		this.setupEventListeners();
		this.setupParticles();
		this.update();
	}

	initializeCarousel() {
		movies.forEach((movie, index) => {
			const card = this.createMovieCard(movie, index);
			this.carousel.appendChild(card);
		});
	}

	createMovieCard(movie, index) {
		const card = document.createElement("div");
		card.className = "movie-card";
		card.innerHTML = `
            <div class="movie-card-inner">
                <img class="movie-poster" src="${movie.poster}" alt="${movie.title}" loading="lazy">
                <input type="range" min="0" max="1" step="0.01" value="1" onchange="this.parentNode.volume=this.value;">
                <div class="movie-content">
                    <h3 class="movie-title">${movie.title}</h3>
                    <p class="movie-year">${movie.year}</p>
                    <p class="movie-director">Dir. ${movie.director}</p>
                    <p class="movie-description">${movie.description}</p>
                </div>
            </input>
        `;

		card.addEventListener("click", () => {
			this.currentIndex = index;
			this.stopAutoplay();
			this.update();
		});

		return card;
	}

	setupEventListeners() {
		
		document.getElementById("prevBtn").addEventListener("click", () => {
			this.prev();
			this.stopAutoplay();
		});

		document.getElementById("nextBtn").addEventListener("click", () => {
			this.next();
			this.stopAutoplay();
		});

		document.getElementById("playBtn").addEventListener("click", () => {
			this.toggleAutoplay();
		});

		
		document.addEventListener("keydown", (e) => {
			switch (e.key) {
				case "ArrowLeft":
					this.prev();
					this.stopAutoplay();
					break;
				case "ArrowRight":
					this.next();
					this.stopAutoplay();
					break;
				case " ":
					e.preventDefault();
					this.toggleAutoplay();
					break;
			}
		});

		
		document.addEventListener("touchstart", (e) => {
			this.touchStartX = e.changedTouches[0].screenX;
		});

		document.addEventListener("touchend", (e) => {
			this.touchEndX = e.changedTouches[0].screenX;
			this.handleSwipe();
		});

		const cursor = document.querySelector(".custom-cursor");
		document.addEventListener("mousemove", (e) => {
			cursor.style.left = e.clientX + "px";
			cursor.style.top = e.clientY + "px";

			const target = e.target;
			if (target.closest(".control-btn") || target.closest(".movie-card")) {
				cursor.style.transform = "scale(2)";
				cursor.style.borderColor = "var(--accent)";
			} else {
				cursor.style.transform = "scale(1)";
				cursor.style.borderColor = "var(--primary)";
			}
		});

		
		document.addEventListener("mousemove", (e) => {
			const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
			const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
			const bg = document.querySelector(".ambient-bg");

			bg.style.transform = `translate(${moveX}px, ${moveY}px)`;
		});

	
		window.addEventListener("resize", () => {
			clearTimeout(this.resizeTimeout);
			this.resizeTimeout = setTimeout(() => this.update(), 100);
		});
	}

	handleSwipe() {
		const swipeThreshold = 50;
		const swipeDistance = this.touchEndX - this.touchStartX;

		if (Math.abs(swipeDistance) > swipeThreshold) {
			if (swipeDistance > 0) {
				this.prev();
			} else {
				this.next();
			}
			this.stopAutoplay();
		}
	}

	setupParticles() {
		const particlesContainer = document.querySelector(".particles-container");

		const createParticle = () => {
			const particle = document.createElement("div");
			const size = Math.random() * 4 + 2;
			const duration = Math.random() * 10 + 5;

			particle.className = "particle";
			particle.style.width = `${size}px`;
			particle.style.height = `${size}px`;
			particle.style.left = `${Math.random() * window.innerWidth}px`;
			particle.style.opacity = Math.random() * 0.5;
			particle.style.animation = `float ${duration}s linear infinite`;

			particlesContainer.appendChild(particle);

			setTimeout(() => particle.remove(), duration * 1000);
		};

		setInterval(createParticle, 1000);
	}

	prev() {
		this.currentIndex = (this.currentIndex - 1 + movies.length) % movies.length;
		this.update();
	}

	next() {
		this.currentIndex = (this.currentIndex + 1) % movies.length;
		this.update();
	}

	toggleAutoplay() {
		if (this.isPlaying) {
			this.stopAutoplay();
		} else {
			this.startAutoplay();
		}
	}

	startAutoplay() {
		this.isPlaying = true;
		document.getElementById("playBtn").innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
            </svg>
        `;
		this.autoplayInterval = setInterval(() => this.next(), 3000);
	}

	stopAutoplay() {
		this.isPlaying = false;
		document.getElementById("playBtn").innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 3l14 9-14 9V3z"/>
            </svg>
        `;
		clearInterval(this.autoplayInterval);
	}

	update() {
		const cards = this.carousel.children;
		const cardWidth = cards[0].offsetWidth;
		const centerOffset = window.innerWidth / 2 - cardWidth / 2;

		for (let i = 0; i < cards.length; i++) {
			const offset = i - this.currentIndex;
			const card = cards[i];

			
			const translateX = centerOffset + offset * 180;
			const translateZ = Math.abs(offset) * -100;
			const rotateY = offset * -15;
			const scale = Math.max(0.8, 1 - Math.abs(offset) * 0.2);
			const opacity = Math.max(0.5, 1 - Math.abs(offset) * 0.3);

			
			card.style.transform = `
                translateX(${translateX}px)
                translateZ(${translateZ}px)
                rotateY(${rotateY}deg)
                scale(${scale})
            `;
			card.style.opacity = opacity;
			card.style.zIndex = 100 - Math.abs(offset);
		}

		
		const currentMovie = movies[this.currentIndex];
		this.movieInfo.classList.remove("active");

		
		void this.movieInfo.offsetWidth;

		this.movieInfo.innerHTML = `
            <div class="info-content">
                <h2>${currentMovie.title}</h2>
                <p class="year">${currentMovie.year}</p>
                <p class="director">Directed by ${currentMovie.director}</p>
                <p class="description">${currentMovie.description}</p>
                <div class="rating">${currentMovie.rating}</div>
            </div>
            <div class="info-background"></div>
        `;

		this.movieInfo.classList.add("active");
	}
}


document.addEventListener("DOMContentLoaded", () => {
	new MovieCarousel();
});

document.getElementById("playPauseButton").addEventListener("click", function() {
	const audio = document.getElementById("terrorMusic");
	if (audio.paused) {
		audio.play();
	} else {
		audio.pause();
	}
});
