document.addEventListener('DOMContentLoaded', () => {
   
const start_btn = document.getElementById('start_btn');
const screens = document.querySelectorAll('.screen');
const choose_strain_btns = document.querySelectorAll('.choose_strain_btn');
const game_container = document.querySelector('.game_container');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const final_message = document.getElementById('final_message');
const cardib = document.getElementById("cardib");
const coronatime = document.getElementById("coronatime");
let seconds = 0;
let score = 0;
let selected_virus = {};

start_btn.addEventListener('click', () => {
	screens[0].classList.add('up');
	cardib.play();
});

choose_strain_btns.forEach(btn => {
	btn.addEventListener('click', () => {
		const img = btn.querySelector('img');
		const src = img.getAttribute('src');
		const alt = img.getAttribute('alt');
		selected_virus = {src, alt};
		screens[1].classList.add('up');
		setTimeout(createVirus, 1000);
		cardib.play();
		startGame();
	});
});

function increaseTime() {
	let m = Math.floor(seconds / 60);
	let s = seconds % 60;
	m = m < 10 ? `0${m}` : m;
	s = s < 10 ? `0${s}` : s;
	timeEl.innerHTML = `Time: ${m}:${s}`;
	seconds++;
}

function addViruses() {
	setTimeout(createVirus, 1000);
	setTimeout(createVirus, 1500);
}

function createVirus() {
	const virus = document.createElement('div');
	const { x, y } = getRandomLocation();
	virus.classList.add('virus');
	virus.style.left = `${x}px`;
	virus.style.top = `${y}px`;
	virus.innerHTML = `<img src="${selected_virus.src}" alt="${selected_virus.alt}" 
			style="transform: rotate(${Math.random() * 360}deg);"/>`;
	virus.addEventListener('click', catchVirus);
	game_container.appendChild(virus);
}

function catchVirus() {
	increaseScore();
	this.classList.add('catched');
	setTimeout(() => {
		this.remove();
	}, 2000);
	addViruses();
}

function increaseScore() {
	score++;
	if (score >= 20) {
		final_message.classList.add('visible');
	}
	scoreEl.innerHTML = `Score: ${score}`;
}

function startGame() {
    setTimeout(function() {
        coronatime.play();
    }, 1500);
    setInterval(increaseTime, 1000);

	// Trigger Phase 1 and Phase 2 at specific times
	setTimeout(startPhase1, 10000); // Trigger Phase 1 after 30 seconds
	setTimeout(startPhase2, 60000); // Trigger Phase 2 after 60 seconds
}

function getRandomLocation() {
	const width = window.innerWidth;
	const height = window.innerHeight;
	const x = Math.random() * (width - 200) + 100;
	const y = Math.random() * (height - 200) + 100;
	return {x, y};
}

let phase1Triggered = false;
let phase2Triggered = false;
const messagePopup = document.getElementById('message-popup');
const messageText = document.getElementById('message-text');
const messageCloseBtn = document.getElementById('message-close-btn');

function explodeViruses() {
    const viruses = document.querySelectorAll('.virus');
    viruses.forEach(virus => {
        const explosion = document.createElement('img');
        explosion.src = 'explosion.gif'; // Path to your explosion GIF
        explosion.classList.add('explosion-effect');
        explosion.style.left = virus.style.left;
        explosion.style.top = virus.style.top;
        game_container.appendChild(explosion);

        setTimeout(() => {
            explosion.remove(); // Remove the explosion GIF after the effect
        }, 500); // Match the duration of the explosion GIF

        virus.remove(); // Remove the virus
    });
}

// Function to show a message popup
function showMessage(message, callback) {
    console.log('messageText:', messageText); // Debugging log
    messageText.innerText = message; // This is where the error occurs
    messagePopup.classList.remove('hidden');
    messageCloseBtn.onclick = () => {
        messagePopup.classList.add('hidden');
        if (callback) callback();
    };
}

function startPhase1() {
    if (phase1Triggered) return; // Prevent multiple triggers
    phase1Triggered = true;
    console.log('Phase 1 triggered');

    const popup = document.getElementById('phase1-popup');
    popup.classList.remove('hidden');

    const tapBtn = document.getElementById('phase1-tap-btn');
    let taps = 0;

    tapBtn.onclick = () => {
        taps++;
    };

    setTimeout(() => {
        popup.classList.add('hidden');
        if (taps >= 20) {
            explodeViruses();
            showMessage('You cleared Phase 1!', () => {
                // 💡 Add this to resume virus spawning
                addViruses();
            });
        } else {
            showMessage('You failed Phase 1!', null);
        }
    }, 5000);
}


function startPhase2() {
    if (phase2Triggered) return;
    phase2Triggered = true;

    const popup = document.getElementById('phase2-popup');
    const tapBtn = document.getElementById('phase2-tap-btn');
    const nukeEffect = document.getElementById('nuke-effect');
    let taps = 0;

    popup.classList.remove('hidden');

    tapBtn.addEventListener('click', () => {
        taps++;
    });

    setTimeout(() => {
        popup.classList.add('hidden');
        if (taps >= 100) { // Adjust the number of taps required
            nukeEffect.classList.remove('hidden');
            setTimeout(() => {
                nukeEffect.classList.add('hidden');
                explodeViruses();
                showMessage('You cleared Phase 2! You won!', null);
            }, 2000); // Show nuke effect for 2 seconds
        } else {
            showMessage('You failed Phase 2!', null); // No explosion on failure
        }
    }, 10000); // 10 seconds
}

});