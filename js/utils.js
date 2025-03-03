/**
 * EveryThink Solar System - Utility Functions
 * Contains helper functions for the EveryThink 3D solar system visualization
 */

// Debug helper functions
const DEBUG = true;
let debugVisible = false;

/**
 * Log debug messages to console and the debug panel
 * @param {string} message - The message to log
 */
function logDebug(message) {
    if (!DEBUG) return;
    
    const debugEl = document.getElementById('debug');
    if (!debugEl) return;
    
    const timestamp = new Date().toLocaleTimeString();
    debugEl.innerHTML += `<div>[${timestamp}] ${message}</div>`;
    console.log(`[${timestamp}] ${message}`);
    
    // Limit number of messages
    const maxMessages = 10;
    const messages = debugEl.querySelectorAll('div');
    if (messages.length > maxMessages) {
        for (let i = 0; i < messages.length - maxMessages; i++) {
            debugEl.removeChild(messages[i]);
        }
    }
    
    // Auto-scroll to the bottom
    debugEl.scrollTop = debugEl.scrollHeight;
}

/**
 * Toggle the debug panel visibility
 */
function setupDebugPanel() {
    const debugEl = document.getElementById('debug');
    const debugToggle = document.getElementById('debugToggle');
    
    if (!debugEl || !debugToggle) return;
    
    debugToggle.addEventListener('click', () => {
        debugVisible = !debugVisible;
        
        if (debugVisible) {
            debugEl.classList.remove('collapsed');
            debugEl.style.display = 'block';
            debugToggle.textContent = 'Hide Debug';
        } else {
            debugEl.classList.add('collapsed');
            debugToggle.textContent = 'Show Debug';
            
            // Hide completely after animation
            setTimeout(() => {
                if (!debugVisible) {
                    debugEl.style.display = 'none';
                }
            }, 300);
        }
    });
}

/**
 * Check whether to show alternative view if 3D is unavailable
 * @param {boolean} threeJsLoaded - Whether Three.js was loaded successfully
 * @param {boolean} loadingTimedOut - Whether loading timed out
 */
function checkAndShowAlternative(threeJsLoaded, loadingTimedOut) {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const alternativeView = document.getElementById('alternativeView');
    
    if (loadingTimedOut && !threeJsLoaded) {
        logDebug("Showing alternative 2D view due to loading timeout");
        if (loadingElement) loadingElement.style.display = 'none';
        if (errorElement) {
            errorElement.style.display = 'block';
            errorElement.textContent = "3D rendering unavailable. Showing alternative view.";
        }
        if (alternativeView) alternativeView.style.display = 'block';
    }
}

/**
 * Set up alternative 2D view interactions
 */
function setupAlternativeView() {
    document.querySelectorAll('.planet').forEach(planet => {
        planet.addEventListener('click', function() {
            // Reset all planets
            document.querySelectorAll('.planet').forEach(p => {
                p.style.transform = p.id === 'sun' ? 'scale(1.2)' : 'scale(1)';
            });
            
            // Scale up the clicked planet
            this.style.transform = 'scale(1.5)';
        });
    });
}

/**
 * Handle window resize
 * @param {THREE.Renderer} renderer - The Three.js renderer
 * @param {THREE.Camera} camera - The Three.js camera
 * @param {boolean} logoMode - Whether the app is in logo mode
 */
function handleWindowResize(renderer, camera, logoMode) {
    if (!logoMode) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        logDebug("Window resized, updating renderer");
    }
}

/**
 * Function to dynamically load a script
 * @param {string} url - URL of the script to load
 * @param {Function} callback - Callback function to execute after loading
 */
function loadScript(url, callback) {
    logDebug(`Loading script: ${url}`);
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = function() {
        logDebug(`Script loaded successfully: ${url}`);
        callback();
    };
    script.onerror = function() {
        logDebug(`Failed to load script: ${url}`);
        callback(new Error(`Failed to load script: ${url}`));
    };
    document.body.appendChild(script);
}

/**
 * Hide any accidental console output that might appear in the DOM
 */
function cleanupDOMConsoleOutput() {
    // Find any text nodes directly in the body that contain code/JSON
    const walker = document.createTreeWalker(
        document.body, 
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let node;
    const nodesToRemove = [];
    while (node = walker.nextNode()) {
        // If text content looks like object notation/code and parent isn't a proper container
        if ((node.textContent.includes('{') || node.textContent.includes('function(')) && 
            !['SCRIPT', 'PRE', 'CODE'].includes(node.parentElement.tagName)) {
            nodesToRemove.push(node);
        }
    }
    
    // Remove identified nodes
    nodesToRemove.forEach(node => node.textContent = '');
}

/**
 * Create a line circle for orbit visualization
 * @param {number} radius - Radius of the orbit
 * @param {number} lineWidth - Width of the line
 * @param {number} opacity - Opacity of the line
 * @returns {THREE.Line} The orbit line
 */
function createOrbitRing(radius, lineWidth = 3, opacity = 0.8) {
    const segments = 64;
    const material = new THREE.LineBasicMaterial({
        color: 0x666666,
        linewidth: lineWidth,
        transparent: true,
        opacity: opacity
    });
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(segments * 3);
    
    for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const line = new THREE.Line(geometry, material);
    line.rotation.x = Math.PI / 2;
    line.userData.type = 'orbit';
    return line;
}

// Initialize utilities on DOM ready
window.addEventListener('DOMContentLoaded', () => {
    setupDebugPanel();
    cleanupDOMConsoleOutput();
    setupAlternativeView();
});

// Export the utility functions
window.EveryThinkUtils = {
    logDebug,
    setupDebugPanel,
    checkAndShowAlternative,
    setupAlternativeView,
    handleWindowResize,
    loadScript,
    cleanupDOMConsoleOutput,
    createOrbitRing
};
