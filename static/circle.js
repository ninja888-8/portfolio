const circle = document.getElementById('circle');
const scoreDisplay = document.getElementById('score');
let clicks = 0;

function teleportCircle() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const circleWidth = circle.offsetWidth;
    const circleHeight = circle.offsetHeight;

    const maxX = windowWidth - circleWidth;
    const maxY = windowHeight - circleHeight;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    circle.style.left = `${randomX}px`;
    circle.style.top = `${randomY}px`;
    circle.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    circle.style.boxShadow = `0px 0px 20px rgba(${r}, ${g}, ${b}, 0.6)`;
}

circle.addEventListener('click', () => {
    clicks++;
    localStorage.setItem('clicks', clicks);
    scoreDisplay.textContent = clicks;
    teleportCircle();
});

teleportCircle();

if (!localStorage.getItem('clicks')) {
    localStorage.setItem('clicks', '0');
    scoreDisplay.textContent = 0;
}
else {
    clicks = localStorage.getItem('clicks');
    scoreDisplay.textContent = clicks;
}

if (!localStorage.getItem('hey')) {
    localStorage.setItem('hey', 'don\'t change the clicks :(');
}