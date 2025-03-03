/**
 * EveryThink Solar System - Content Management
 * Manages dynamic content for the EveryThink 3D solar system
 */

// Solar system data - can be customized or loaded from an API
const solarSystemData = {
    // Central object (sun)
    central: {
        name: "EveryThink",
        description: "The central hub connecting all ideas and concepts",
        type: "sun",
        radius: 5,
        color: 0xFFD700
    },
    
    // Planets (major concepts)
    planets: [
        { 
            name: "Creates", 
            color: 0x3498DB, 
            radius: 3, 
            distance: 20, 
            orbitSpeed: 0.3,
            rotationSpeed: 0.01,
            moons: ["Marketplace", "Workshops"],
            description: "The creative hub for making and building"
        },
        { 
            name: "Curates", 
            color: 0xE74C3C, 
            radius: 4, 
            distance: 35, 
            orbitSpeed: 0.2,
            rotationSpeed: 0.008,
            moons: ["Exhibitions", "Pop Ups", "Events"],
            description: "Where ideas are organized, collected, and shared"
        },
        { 
            name: "Connects", 
            color: 0x2ECC71, 
            radius: 3.5, 
            distance: 50, 
            orbitSpeed: 0.15,
            rotationSpeed: 0.012,
            moons: ["Directory", "Zine"],
            description: "Bringing people and ideas together"
        }
    ]
};

// Content for the different coin sections
const coinContent = {
    About: {
        title: "About EveryThink Coin",
        content: `
            <p>EveryThink Coin is a digital currency designed to support local communities and creative projects. It provides a way to localize money within groups, giving value to ideas and supporting innovation.</p>
            <p>The currency is interoperable between different communities, allowing for a wide network of support while still maintaining the benefits of local economies.</p>
        `
    },
    Physical: {
        title: "Physical & Digital",
        content: `
            <p>EveryThink Coin bridges the physical and digital worlds with unique physical coins that contain NFC chips and QR codes for verification and blockchain integration.</p>
            
            <div class="qr-container">
                <div class="qr-code">
                    <!-- QR code placeholder -->
                    <svg width="130" height="130" viewBox="0 0 100 100">
                        <!-- QR Code pattern -->
                        <rect x="0" y="0" width="100" height="100" fill="none" stroke="#000" stroke-width="2"></rect>
                        <rect x="10" y="10" width="20" height="20" fill="#000"></rect>
                        <rect x="70" y="10" width="20" height="20" fill="#000"></rect>
                        <rect x="10" y="70" width="20" height="20" fill="#000"></rect>
                        <rect x="40" y="40" width="20" height="20" fill="#000"></rect>
                        <rect x="70" y="40" width="10" height="10" fill="#000"></rect>
                        <rect x="40" y="70" width="10" height="10" fill="#000"></rect>
                        <rect x="60" y="70" width="30" height="10" fill="#000"></rect>
                        <rect x="60" y="80" width="10" height="10" fill="#000"></rect>
                    </svg>
                </div>
                <div class="qr-info">
                    <h3>Scan to Connect</h3>
                    <p>Each physical coin contains a unique QR code that links to its digital counterpart on the blockchain.</p>
                    <p>Users can scan the code to verify authenticity, check the coin's value, or transfer ownership.</p>
                </div>
            </div>
        `
    },
    Earning: {
        title: "Earning & Spending",
        content: `
            <p>Users can earn EveryThink Coins by contributing to the community, completing tasks, or through direct purchase.</p>
            <p>The coins can be used within specific communities, traded for goods and services, or topped up to their original value if partially spent.</p>
            
            <h3>Reward Tiers</h3>
            <ul>
                <li><strong>Tier 1:</strong> Basic community participation</li>
                <li><strong>Tier 2:</strong> Active content creation and participation</li>
                <li><strong>Tier 3:</strong> Leadership and significant contributions</li>
            </ul>
        `
    }
};

/**
 * Set up coin icon interactions for content display
 * @param {Function} toggleLogoModeFunc - Function to toggle logo mode
 */
function setupCoinIcons(toggleLogoModeFunc) {
    document.querySelectorAll('.coin-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const section = icon.getAttribute('data-section');
            
            // Enter logo mode (if not already)
            if (!window.logoMode) {
                toggleLogoModeFunc(true);
            }
            
            // Populate content area with relevant content
            populateContentSection(section);
            
            // Scroll to the requested section
            scrollToSection(section);
        });
    });
}

/**
 * Populate the content area with section-specific content
 * @param {string} sectionName - Name of the section to display
 */
function populateContentSection(sectionName) {
    const contentArea = document.getElementById('contentArea');
    
    // Check if contentArea exists
    if (!contentArea) return;
    
    // If this is the first content being loaded, clear default content
    if (!contentArea.getAttribute('data-initialized')) {
        contentArea.setAttribute('data-initialized', 'true');
        contentArea.innerHTML = `<h1>EveryThink Coin Project</h1>`;
    }
    
    // Find existing section or create new one
    let sectionElement = document.querySelector(`.project-content[data-section="${sectionName}"]`);
    
    if (!sectionElement) {
        sectionElement = document.createElement('div');
        sectionElement.className = 'project-content';
        sectionElement.setAttribute('data-section', sectionName);
        contentArea.appendChild(sectionElement);
    }
    
    // Populate the section with content
    const sectionData = coinContent[sectionName];
    if (sectionData) {
        sectionElement.innerHTML = `
            <h2>${sectionData.title}</h2>
            ${sectionData.content}
        `;
    } else {
        sectionElement.innerHTML = `
            <h2>${sectionName}</h2>
            <p>Content for this section is coming soon...</p>
        `;
    }
}

/**
 * Scroll to a specific section in the content area
 * @param {string} sectionName - Name of the section to scroll to
 */
function scrollToSection(sectionName) {
    const targetSections = document.querySelectorAll(`.project-content[data-section="${sectionName}"]`);
    
    if (targetSections.length > 0) {
        targetSections[0].scrollIntoView({ behavior: 'smooth' });
    } else {
        // Try finding sections by their heading text
        const headings = document.querySelectorAll(`.project-content h2`);
        let foundSection = false;
        
        for (let i = 0; i < headings.length; i++) {
            if (headings[i].textContent.includes(sectionName)) {
                headings[i].parentElement.scrollIntoView({ behavior: 'smooth' });
                foundSection = true;
                break;
            }
        }
        
        if (!foundSection) {
            console.log(`Section not found: ${sectionName}`);
        }
    }
}

// Export content management functions
window.EveryThinkContent = {
    solarSystemData,
    coinContent,
    setupCoinIcons,
    populateContentSection,
    scrollToSection
};
