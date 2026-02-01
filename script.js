// Gestion de la page d'introduction
const introPage = document.getElementById('introPage');
const mainPage = document.getElementById('mainPage');
const btnSuite = document.getElementById('btnSuite');

// Initialiser le body avec la classe pour permettre le scroll
document.body.classList.add('intro-visible');

// Gérer le clic sur le bouton "Passe à la suite"
btnSuite.addEventListener('click', function() {
    // Masquer la page d'introduction avec une animation
    introPage.style.opacity = '0';
    introPage.style.transition = 'opacity 0.5s ease-out';
    
    setTimeout(function() {
        introPage.classList.add('hidden');
        // Changer la classe du body pour empêcher le scroll
        document.body.classList.remove('intro-visible');
        document.body.classList.add('main-visible');
        
        // Afficher la page principale avec les boutons
        mainPage.classList.remove('hidden');
        mainPage.style.opacity = '0';
        mainPage.style.transition = 'opacity 0.5s ease-in';
        
        // Initialiser le bouton "Non" en position fixed
        if (btnNon) {
            btnNon.style.position = 'fixed';
        }
        
        // Initialiser les positions des boutons après l'affichage
        setTimeout(function() {
            mainPage.style.opacity = '1';
            initializeButtonPosition();
            setTimeout(initializeButtonPosition, 100);
        }, 50);
    }, 500);
});

const btnOui = document.getElementById('btnOui');
const btnNon = document.getElementById('btnNon');
const gifContainer = document.getElementById('gifContainer');

// Initialiser le bouton "Non" en position fixed pour pouvoir se déplacer sur tout l'écran
// Seulement si le bouton existe (après le passage à la page principale)
if (btnNon) {
    btnNon.style.position = 'fixed';
}

// Initialiser la position du bouton "Non" au chargement - côte à côte avec "Oui", centré
function initializeButtonPosition() {
    if (!btnOui || !btnNon) return;
    
    const btnOuiRect = btnOui.getBoundingClientRect();
    const btnNonRect = btnNon.getBoundingClientRect();
    
    // Positionner le bouton "Non" à côté du bouton "Oui", centré et à distance égale
    // Le bouton "Oui" est centré, donc on place "Non" à droite avec un espacement égal
    const gap = 30; // Espacement entre les boutons
    const initialX = btnOuiRect.right + gap;
    const initialY = btnOuiRect.top; // Aligné verticalement avec "Oui"
    
    btnNon.style.left = initialX + 'px';
    btnNon.style.top = initialY + 'px';
}

// Initialiser au chargement et après un petit délai pour s'assurer que tout est rendu
window.addEventListener('load', function() {
    initializeButtonPosition();
    setTimeout(initializeButtonPosition, 100);
});

// Réinitialiser la position si la fenêtre est redimensionnée
window.addEventListener('resize', function() {
    // Ne réinitialiser que si le bouton n'a pas encore bougé (position initiale)
    const btnNonRect = btnNon.getBoundingClientRect();
    const btnOuiRect = btnOui.getBoundingClientRect();
    const expectedX = btnOuiRect.right + 30;
    
    // Si le bouton est toujours près de sa position initiale, le repositionner
    if (Math.abs(btnNonRect.left - expectedX) < 50) {
        initializeButtonPosition();
    }
});

// Fonction pour obtenir une position aléatoire sur tout l'écran
function getRandomPosition() {
    const btnNonRect = btnNon.getBoundingClientRect();
    
    // Calculer les limites pour que le bouton reste visible sur tout l'écran
    const maxX = window.innerWidth - btnNonRect.width;
    const maxY = window.innerHeight - btnNonRect.height;
    
    // Générer une position aléatoire sur tout l'écran
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    return { x: randomX, y: randomY };
}

// Fonction pour calculer la distance entre deux points
function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Fonction pour vérifier si le bouton est dans un coin
function isInCorner(x, y, btnWidth, btnHeight) {
    const cornerThreshold = 80; // Distance du bord pour considérer qu'on est dans un coin
    
    const isNearLeft = x < cornerThreshold;
    const isNearRight = x > window.innerWidth - btnWidth - cornerThreshold;
    const isNearTop = y < cornerThreshold;
    const isNearBottom = y > window.innerHeight - btnHeight - cornerThreshold;
    
    // Vérifier si on est dans un coin (proche de deux bords en même temps)
    return (isNearLeft || isNearRight) && (isNearTop || isNearBottom);
}

// Fonction pour ramener le bouton vers le centre
function moveToCenter() {
    const btnNonRect = btnNon.getBoundingClientRect();
    const centerX = (window.innerWidth - btnNonRect.width) / 2;
    const centerY = (window.innerHeight - btnNonRect.height) / 2;
    
    // Ajouter un peu d'aléatoire autour du centre pour éviter qu'il soit trop prévisible
    const randomOffsetX = (Math.random() - 0.5) * 100;
    const randomOffsetY = (Math.random() - 0.5) * 100;
    
    const newX = centerX + randomOffsetX;
    const newY = centerY + randomOffsetY;
    
    // S'assurer que le bouton reste dans les limites
    const maxX = window.innerWidth - btnNonRect.width;
    const maxY = window.innerHeight - btnNonRect.height;
    
    btnNon.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
    btnNon.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
    btnNon.style.transform = 'translate(0, 0)';
}

// Fonction pour déplacer le bouton "Non" sur tout l'écran
function moveButtonNon(mouseX = null, mouseY = null) {
    const btnNonRect = btnNon.getBoundingClientRect();
    
    // Position actuelle du bouton (coordonnées absolues de la fenêtre)
    const currentX = btnNonRect.left;
    const currentY = btnNonRect.top;
    
    // Vérifier si le bouton est dans un coin
    if (isInCorner(currentX, currentY, btnNonRect.width, btnNonRect.height)) {
        // Si le bouton est dans un coin, le ramener vers le centre
        moveToCenter();
        return;
    }
    
    let newX, newY;
    
    if (mouseX !== null && mouseY !== null) {
        // Calculer la direction opposée à la souris
        const angle = Math.atan2(mouseY - currentY, mouseX - currentX);
        const distance = 150; // Distance minimale à maintenir
        
        // Nouvelle position dans la direction opposée
        newX = currentX - Math.cos(angle) * distance;
        newY = currentY - Math.sin(angle) * distance;
        
        // Ajouter plus d'aléatoire pour rendre le mouvement très imprévisible
        newX += (Math.random() - 0.5) * 100;
        newY += (Math.random() - 0.5) * 100;
        
        // S'assurer que le bouton reste dans les limites de l'écran
        const maxX = window.innerWidth - btnNonRect.width;
        const maxY = window.innerHeight - btnNonRect.height;
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        // Vérifier si la nouvelle position serait dans un coin
        if (isInCorner(newX, newY, btnNonRect.width, btnNonRect.height)) {
            // Si oui, ramener vers le centre au lieu d'aller dans le coin
            moveToCenter();
            return;
        }
    } else {
        // Si pas de position de souris, utiliser une position aléatoire très éloignée
        let attempts = 0;
        const maxAttempts = 100;
        
        do {
            const randomPos = getRandomPosition();
            newX = randomPos.x;
            newY = randomPos.y;
            attempts++;
        } while (attempts < maxAttempts && getDistance(currentX, currentY, newX, newY) < 100);
        
        // Vérifier si la position aléatoire est dans un coin
        if (isInCorner(newX, newY, btnNonRect.width, btnNonRect.height)) {
            moveToCenter();
            return;
        }
    }
    
    // Appliquer la nouvelle position avec une transition fluide
    btnNon.style.left = newX + 'px';
    btnNon.style.top = newY + 'px';
    btnNon.style.transform = 'translate(0, 0)';
}

// Désactiver les événements de pointeur sur le bouton "Non" pour empêcher le clic
btnNon.style.pointerEvents = 'none';

// Variables pour suivre la position de la souris
let lastMouseX = null;
let lastMouseY = null;

// Détecter quand la souris s'approche du bouton "Non"
document.addEventListener('mouseenter', function(e) {
    if (e.target === btnNon) {
        moveButtonNon(e.clientX, e.clientY);
    }
}, true);

// Détecter le mouvement de la souris près du bouton "Non" - VERSION ULTRA RÉACTIVE
let lastMoveTime = 0;
document.addEventListener('mousemove', function(e) {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    
    const btnNonRect = btnNon.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculer la distance entre la souris et le bouton
    const distance = getDistance(
        mouseX, 
        mouseY, 
        btnNonRect.left + btnNonRect.width / 2, 
        btnNonRect.top + btnNonRect.height / 2
    );
    
    // Si la souris est à moins de 100px du bouton, le déplacer IMMÉDIATEMENT
    if (distance < 100) {
        // Désactiver complètement le pointeur
        btnNon.style.pointerEvents = 'none';
        
        // Déplacer immédiatement sans timeout
        const now = Date.now();
        if (now - lastMoveTime > 5) { // Limiter à toutes les 5ms max pour plus de réactivité
            moveButtonNon(mouseX, mouseY);
            lastMoveTime = now;
        }
    }
}, { passive: true });

// Vérification continue avec requestAnimationFrame pour s'assurer que le bouton bouge toujours
function continuousCheck() {
    const btnNonRect = btnNon.getBoundingClientRect();
    const currentX = btnNonRect.left;
    const currentY = btnNonRect.top;
    
    // Vérifier si le bouton est dans un coin et le ramener vers le centre
    if (isInCorner(currentX, currentY, btnNonRect.width, btnNonRect.height)) {
        btnNon.style.pointerEvents = 'none';
        moveToCenter();
    } else if (lastMouseX !== null && lastMouseY !== null) {
        const distance = getDistance(
            lastMouseX, 
            lastMouseY, 
            btnNonRect.left + btnNonRect.width / 2, 
            btnNonRect.top + btnNonRect.height / 2
        );
        
        // Si la souris est proche, continuer à déplacer le bouton
        if (distance < 120) {
            btnNon.style.pointerEvents = 'none';
            moveButtonNon(lastMouseX, lastMouseY);
        }
    }
    requestAnimationFrame(continuousCheck);
}

// Démarrer la vérification continue
requestAnimationFrame(continuousCheck);

// Détecter mousedown pour déplacer le bouton AVANT le clic - PROTECTION MAXIMALE
document.addEventListener('mousedown', function(e) {
    const btnNonRect = btnNon.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Vérifier si le clic est sur le bouton "Non" ou très proche
    const distance = getDistance(
        mouseX, 
        mouseY, 
        btnNonRect.left + btnNonRect.width / 2, 
        btnNonRect.top + btnNonRect.height / 2
    );
    
    if (distance < btnNonRect.width + 20) { // Zone de sécurité élargie
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Désactiver le pointeur
        btnNon.style.pointerEvents = 'none';
        
        // Déplacer immédiatement très loin
        moveButtonNon(mouseX, mouseY);
        return false;
    }
}, true);

// Gérer le clic sur le bouton "Oui"
btnOui.addEventListener('click', function() {
    gifContainer.classList.remove('hidden');
    btnOui.style.pointerEvents = 'none';
    btnNon.style.display = 'none';
    
    // Animation de célébration
    btnOui.style.animation = 'bounce 0.5s ease';
});

// Ajouter une animation de rebond
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;
document.head.appendChild(style);

// Empêcher le bouton "Non" d'être cliqué - MULTIPLE PROTECTIONS
btnNon.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    // Déplacer le bouton immédiatement très loin
    moveButtonNon();
    return false;
}, true);

// Protection supplémentaire avec mouseup
btnNon.addEventListener('mouseup', function(e) {
    e.preventDefault();
    e.stopPropagation();
    moveButtonNon(e.clientX, e.clientY);
    return false;
}, true);

// Protection avec touchstart pour mobile
btnNon.addEventListener('touchstart', function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.touches.length > 0) {
        const touch = e.touches[0];
        moveButtonNon(touch.clientX, touch.clientY);
    }
    return false;
}, true);
