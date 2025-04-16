const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

// Ajuster la taille du canvas à la fenêtre
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Points du réseau
class Point {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 2 + 1;
        this.color = `rgba(0, ${Math.random() * 155 + 100}, ${Math.random() * 255}, 0.6)`;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Effet de rebond en douceur
        if (this.x < 0 || this.x > canvas.width) {
            this.vx *= -1;
            this.pulse();
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.vy *= -1;
            this.pulse();
        }
    }

    pulse() {
        this.radius = 3;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Effet de lueur
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 150, 255, 0.1)`;
        ctx.fill();

        // Retour progressif à la taille normale
        if (this.radius > 1) {
            this.radius *= 0.95;
        }
    }
}

// Initialisation
let points = [];
const numPoints = 150; // Plus de points
const maxDistance = 200; // Distance de connexion augmentée

function init() {
    points = [];
    for (let i = 0; i < numPoints; i++) {
        points.push(new Point());
    }
}

// Animation
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 20, 0.2)'; // Effet de traînée
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Mise à jour et dessin des points
    points.forEach(point => {
        point.update();
        point.draw();
    });

    // Dessin des lignes
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const dx = points[i].x - points[j].x;
            const dy = points[i].y - points[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[j].x, points[j].y);
                
                // Gradient de couleur pour les lignes
                const gradient = ctx.createLinearGradient(
                    points[i].x, points[i].y, 
                    points[j].x, points[j].y
                );
                gradient.addColorStop(0, points[i].color);
                gradient.addColorStop(1, points[j].color);
                
                const opacity = 1 - (distance / maxDistance);
                ctx.strokeStyle = gradient;
                ctx.globalAlpha = opacity * 0.5;
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    }

    requestAnimationFrame(animate);
}

// Effet interactif avec la souris
let mouse = { x: null, y: null };
const mouseRadius = 150;

canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;

    points.forEach(point => {
        const dx = mouse.x - point.x;
        const dy = mouse.y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius) {
            point.radius = 3;
            point.vx += dx * 0.002;
            point.vy += dy * 0.002;
        }
    });
});

// Événements
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
init();
animate(); 