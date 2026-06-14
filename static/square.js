const square = document.getElementById('square');
const scoreDisplay = document.getElementById('score');
let clicks = 0;

function teleportSquare() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const squareWidth = square.offsetWidth;
    const squareHeight = square.offsetHeight;

    const maxX = windowWidth - squareWidth;
    const maxY = windowHeight - squareHeight;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    square.style.left = `${randomX}px`;
    square.style.top = `${randomY}px`;
    square.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    square.style.boxShadow = `0px 0px 20px rgba(${r}, ${g}, ${b}, 0.6)`;
}

square.addEventListener('click', () => {
    clicks++;
    localStorage.setItem('clicks', clicks);
    scoreDisplay.textContent = clicks;
    teleportSquare();
});

teleportSquare();

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