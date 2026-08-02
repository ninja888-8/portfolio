const floatingButton = document.getElementById('floating-btn');

let posX = Math.random() * (window.innerWidth - 100);
let posY = Math.random() * (window.innerHeight - 100);

let vx = 0.3;
let vy = 0.1;

function animate() {
    const rect = floatingButton.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;

    posX += vx;
    posY += vy;

    if (posX <= 0) {
        posX = 0;
        vx *= -1;
    }
    else if (posX >= maxX) {
        posX = maxX;
        vx *= -1;
    }

    if (posY <= 0) {
        posY = 0;
        vy *= -1;
    }
    else if (posY >= maxY) {
        posY = maxY;
        vy *= -1;
    }

    floatingButton.style.transform = `translate(${posX}px, ${posY}px)`;

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

window.addEventListener('resize', () => {
    const rect = floatingButton.getBoundingClientRect();
    if (posX > window.innerWidth - rect.width) posX = window.innerWidth - rect.width;
    if (posY > window.innerHeight - rect.height) posY = window.innerHeight - rect.height;
});