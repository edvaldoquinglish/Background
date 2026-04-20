// Backgrounds Animados - Funcionalidades
document.addEventListener('DOMContentLoaded', function() {
    // Navegação entre backgrounds
    const navButtons = document.querySelectorAll('.nav-btn');
    const backgrounds = document.querySelectorAll('.background');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetBg = this.getAttribute('data-bg');
            
            // Remover active de todos
            navButtons.forEach(btn => btn.classList.remove('active'));
            backgrounds.forEach(bg => bg.classList.remove('active'));
            
            // Adicionar active ao selecionado
            this.classList.add('active');
            document.getElementById(targetBg).classList.add('active');
        });
    });
    
    // Controles de velocidade
    const speedControl = document.getElementById('speedControl');
    speedControl.addEventListener('input', function() {
        const speed = this.value / 5;
        document.documentElement.style.setProperty('--animation-speed', speed);
        
        // Aplicar velocidade às animações
        document.querySelectorAll('.background').forEach(bg => {
            bg.style.animationDuration = `${8 / speed}s`;
        });
    });
    
    // Controle de cores
    const colorControl = document.getElementById('colorControl');
    colorControl.addEventListener('input', function() {
        document.documentElement.style.setProperty('--primary-color', this.value);
    });
    
    // Botão pausar
    const pauseBtn = document.getElementById('pauseBtn');
    let isPaused = false;
    
    pauseBtn.addEventListener('click', function() {
        isPaused = !isPaused;
        
        if (isPaused) {
            document.querySelectorAll('*').forEach(el => {
                el.style.animationPlayState = 'paused';
            });
            this.innerHTML = '<i class="fas fa-play"></i> Retomar';
        } else {
            document.querySelectorAll('*').forEach(el => {
                el.style.animationPlayState = 'running';
            });
            this.innerHTML = '<i class="fas fa-pause"></i> Pausar';
        }
    });
    
    // Tela cheia
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    fullscreenBtn.addEventListener('click', function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });
    
    // Gerar partículas dinamicamente
    generateParticles();
    
    // Gerar grid dinamicamente
    generateGrid();
    
    // Gerar gotas de chuva
    generateRain();
    
    // Interatividade com mouse
    initMouseInteractions();
});

function generateParticles() {
    const container = document.querySelector('.particles-container');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posição aleatória
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        // Tamanho aleatório
        const size = Math.random() * 4 + 1;
        
        // Cor aleatória
        const colors = ['#667eea', '#764ba2', '#4ecdc4', '#f093fb'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Atrasar animação
        const delay = Math.random() * 6;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            top: ${top}%;
            left: ${left}%;
            background: ${color};
            animation-delay: ${delay}s;
            animation-duration: ${Math.random() * 4 + 3}s;
        `;
        
        container.appendChild(particle);
    }
}

function generateGrid() {
    const container = document.querySelector('.grid-container');
    const cellCount = 400; // 20x20 grid
    
    container.innerHTML = '';
    
    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        
        // Efeito de onda ao passar o mouse
        cell.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.1s ease';
        });
        
        cell.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.5s ease';
        });
        
        container.appendChild(cell);
    }
}

function generateRain() {
    const container = document.querySelector('.rain-container');
    const dropCount = 100;
    
    for (let i = 0; i < dropCount; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = Math.random() * 1 + 1;
        
        drop.style.cssText = `
            left: ${left}%;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
        `;
        
        container.appendChild(drop);
    }
}

function initMouseInteractions() {
    // Efeito de partículas ao clicar
    document.addEventListener('click', function(e) {
        createClickParticles(e.clientX, e.clientY);
    });
    
    // Efeito de onda no grid
    const gridCells = document.querySelectorAll('.grid-cell');
    
    document.addEventListener('mousemove', function(e) {
        gridCells.forEach(cell => {
            const rect = cell.getBoundingClientRect();
            const cellX = rect.left + rect.width / 2;
            const cellY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(e.clientX - cellX, 2) + 
                Math.pow(e.clientY - cellY, 2)
            );
            
            if (distance < 100) {
                const intensity = 1 - (distance / 100);
                cell.style.transform = `scale(${1 + intensity * 0.3})`;
                cell.style.background = `rgba(102, 126, 234, ${intensity * 0.3})`;
            }
        });
    });
}

function createClickParticles(x, y) {
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: white;
            border-radius: 50%;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            z-index: 10000;
        `;
        
        document.body.appendChild(particle);
        
        // Animação
        const angle = (i / particleCount) * Math.PI * 2;
        const speed = 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        let posX = x;
        let posY = y;
        let opacity = 1;
        
        function animate() {
            posX += vx;
            posY += vy;
            opacity -= 0.02;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        }
        
        animate();
    }
}