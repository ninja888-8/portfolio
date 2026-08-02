const canvas = document.getElementById('jagged-bg');
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const background = document.querySelector('.page-content');

const mouse = {
    x: -1000,
    y: -1000,
    radius: 150
};

const points = [];
const spacing = 160;

for (let x = 0; x <= width + spacing; x += spacing) {
    for (let y = 0; y <= height + spacing; y += spacing) {
        const origX = x + (Math.random() - 0.5) * spacing * 0.5;
        const origY = y + (Math.random() - 0.5) * spacing * 0.5;
        points.push({
            origX: origX, origY: origY,
            x: origX, y: origY,
            vx: 0, vy: 0
        });
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    points.forEach(p => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius) {
            const force = (1 - dist / mouse.radius) * 12;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force;
            p.vy += Math.sin(angle) * force;
        }

        p.vx += (p.origX - p.x) * 0.08;
        p.vy += (p.origY - p.y) * 0.08;

        p.vx *= 0.82;
        p.vy *= 0.82;

        p.x += p.vx;
        p.y += p.vy;
    });

    ctx.strokeStyle = '#383737';
    ctx.lineWidth = 1.5;

    // connecting polygons
    for (let i = 0; i < points.length; i++) {
        const p = points[i];

        for (let point of points) {
            let dist = Math.sqrt(Math.pow(p.origX - point.origX, 2) + Math.pow(p.origY - point.origY, 2));

            if (dist < 245) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
            }
        }
    }

    if (window.location.pathname !== '/garden.html') { // only displays the visual
        requestAnimationFrame(animate);
    }
}

function trackMouse() {
    const root = document.documentElement;
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // sets mouse gradient
        root.style.setProperty('--cursor-x', `${e.clientX}px`);
        root.style.setProperty('--cursor-y', `${e.clientY}px`);
        root.style.setProperty('--cursor-bgcolor', `rgba(${e.clientX / width * 255}, ${e.clientY / width * 255}, 127, 0.4)`);
    });
}

animate();
if (window.location.pathname !== '/garden.html') { // only displays the visual
    trackMouse();
}