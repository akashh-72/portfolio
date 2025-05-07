// DOM elements
const navbar = document.querySelector('.navbar');
const backToTopBtn = document.getElementById('back-to-top');
const heroCanvas = document.getElementById('hero-canvas');
const skillsContainer = document.getElementById('skills-cloud-container');
const projectItems = document.querySelectorAll('.project-item');
const filterBtns = document.querySelectorAll('[data-filter]');
const contactForm = document.getElementById('contact-form');

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Typed.js
    initTypedText();
    
    // Initialize Three.js hero animation
    initHeroAnimation();
    
    // Initialize Skills Cloud
    initSkillsCloud();
    
    // Initialize ScrollTrigger animations
    initScrollAnimations();
    
    // Initialize stat counters
    initCounters();
    
    // Initialize project filters
    initProjectFilters();
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize 3D backgrounds
    init3DBackgrounds();
    
    // Initialize Contact Section 3D Element
    initContactSection();
    
    // Initialize 3D footer with dynamic elements
    initFooter3D();
});

// Initialize particle backgrounds
function initParticles() {
    // Create a particle container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    document.body.appendChild(particleContainer);
    
    // Generate 50 particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size, position and animation delay
        const size = Math.random() * 10 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        
        particleContainer.appendChild(particle);
    }
}

// Initialize Typed.js for dynamic text
function initTypedText() {
    new Typed('#typed-text', {
        strings: ['B.Tech CSE Student', 'Full-Stack Developer', 'Mobile App Developer', 'ML Enthusiast'],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 1500,
        startDelay: 500,
        loop: true
    });
}

// Initialize Three.js hero animation
function initHeroAnimation() {
    if (!heroCanvas) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 7;
    
    const renderer = new THREE.WebGLRenderer({ 
        canvas: heroCanvas, 
        alpha: true, 
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Create a more impressive background
    const heroBackground = createHeroBackground();
    scene.add(heroBackground);
    
    // Add ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    // Add directional light for shadows
    const directionalLight = new THREE.DirectionalLight(0x007BFF, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    // Add point lights for highlights
    const pointLight1 = new THREE.PointLight(0x007BFF, 1, 10);
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xFFFFFF, 0.8, 10);
    pointLight2.position.set(-2, -2, 2);
    scene.add(pointLight2);
    
    // Add volumetric lighting effects
    const spotLight = new THREE.SpotLight(0x007BFF, 0.8, 15, Math.PI / 6, 0.25, 1);
    spotLight.position.set(0, 5, 5);
    spotLight.castShadow = true;
    scene.add(spotLight);
    
    // Track mouse position
    const mouse = { x: 0, y: 0 };
    
    document.addEventListener('mousemove', (event) => {
        // Calculate normalized coordinates (-1 to 1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now();
        
        // Get scroll position
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector('.hero-section').offsetHeight;
        const scrollProgress = Math.min(scrollY / heroHeight, 1);
        
        // Animate background with mouse interaction
        if (heroBackground) {
            // Only use mouse position for rotation - no continuous rotation
            const targetRotationY = mouse.x * 0.3; // Increased influence
            const targetRotationX = mouse.y * 0.2;
            
            // Smooth transition to target rotation
            heroBackground.rotation.y += (targetRotationY - heroBackground.rotation.y) * 0.05;
            heroBackground.rotation.x += (targetRotationX - heroBackground.rotation.x) * 0.05;
            
            heroBackground.position.z = -5 + (scrollProgress * 2);
            
            // Run the background's update function with mouse data
            if (heroBackground.userData && typeof heroBackground.userData.update === 'function') {
                heroBackground.userData.update(time, mouse);
            }
        }
        
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    animate();
}

// Create hero background with GitHub-style network visualization
function createHeroBackground() {
    const group = new THREE.Group();
    
    // Create nodes and connections - reduced count for minimal look
    const nodeCount = 80; // Reduced from 150 for minimal style
    const nodeGeometry = new THREE.SphereGeometry(0.03, 8, 8);
    const nodeMaterial = new THREE.MeshBasicMaterial({
        color: 0x007BFF,
        transparent: true,
        opacity: 0.6
    });
    
    // Store nodes and their metadata
    const nodes = [];
    
    // Create nodes with better distribution
    for (let i = 0; i < nodeCount; i++) {
        const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
        
        // Improved distribution to cover the entire screen
        // Use a combination of grid and random placement for better coverage
        let x, y, z;
        
        if (i < nodeCount * 0.7) {
            // 70% of nodes: distributed evenly in a grid-like pattern with some randomness
            const cols = Math.ceil(Math.sqrt(nodeCount * 0.7));
            const rows = Math.ceil((nodeCount * 0.7) / cols);
            
            const col = i % cols;
            const row = Math.floor(i / cols);
            
            // Calculate normalized position (-1 to 1 range)
            const normalizedX = (col / (cols - 1)) * 2 - 1;
            const normalizedY = (row / (rows - 1)) * 2 - 1;
            
            // Apply some randomness to avoid perfect grid
            x = normalizedX * 18 + (Math.random() - 0.5) * 3;
            y = normalizedY * 10 + (Math.random() - 0.5) * 3;
            z = (Math.random() - 0.5) * 5;
        } else {
            // 30% of nodes: completely random for natural feel
            x = (Math.random() - 0.5) * 40;
            y = (Math.random() - 0.5) * 20;
            z = (Math.random() - 0.5) * 10;
        }
        
        mesh.position.set(x, y, z);
        
        // Store base position for animation
        mesh.userData = {
            basePosition: mesh.position.clone(),
            pulseSpeed: 0.3 + Math.random() * 0.3,
            size: 0.02 + Math.random() * 0.02,
            connections: []
        };
        
        group.add(mesh);
        nodes.push(mesh);
    }
    
    // Create connections between nearby nodes
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x007BFF,
        transparent: true,
        opacity: 0.15 // More subtle lines
    });
    
    const maxDistance = 7; // Increased for better connectivity
    const connections = [];
    
    // Ensure each node has at least one connection
    const minConnectionsPerNode = 1; // Reduced for minimal look
    
    // First, connect nearby nodes
    for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        
        for (let j = i + 1; j < nodes.length; j++) {
            const nodeB = nodes[j];
            const distance = nodeA.position.distanceTo(nodeB.position);
            
            if (distance < maxDistance) {
                // Create line geometry
                const points = [nodeA.position, nodeB.position];
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(lineGeometry, lineMaterial.clone());
                
                // Store the connected nodes for updating the line later
                line.userData = {
                    nodeA: nodeA,
                    nodeB: nodeB,
                    baseOpacity: 0.05 + (1 - distance / maxDistance) * 0.15 // Reduced opacity
                };
                
                // Set initial opacity based on distance
                line.material.opacity = line.userData.baseOpacity;
                
                // Add to scene
                group.add(line);
                connections.push(line);
                
                // Reference connections in nodes for easy access
                nodeA.userData.connections.push(line);
                nodeB.userData.connections.push(line);
            }
        }
    }
    
    // Then ensure each node has minimum connections
    for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        
        // If node doesn't have minimum connections, find closest nodes to connect with
        if (nodeA.userData.connections.length < minConnectionsPerNode) {
            // Calculate distances to all other nodes
            const distances = [];
            
            for (let j = 0; j < nodes.length; j++) {
                if (i !== j) {
                    const nodeB = nodes[j];
                    const distance = nodeA.position.distanceTo(nodeB.position);
                    distances.push({ index: j, distance: distance });
                }
            }
            
            // Sort by distance
            distances.sort((a, b) => a.distance - b.distance);
            
            // Connect to closest nodes until minimum is reached
            const connectionsNeeded = minConnectionsPerNode - nodeA.userData.connections.length;
            
            for (let k = 0; k < connectionsNeeded && k < distances.length; k++) {
                const nodeB = nodes[distances[k].index];
                
                // Check if they're already connected
                const alreadyConnected = nodeA.userData.connections.some(line => 
                    (line.userData.nodeA === nodeA && line.userData.nodeB === nodeB) || 
                    (line.userData.nodeA === nodeB && line.userData.nodeB === nodeA)
                );
                
                if (!alreadyConnected) {
                    // Create new connection
                    const points = [nodeA.position, nodeB.position];
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(lineGeometry, lineMaterial.clone());
                    
                    const distance = distances[k].distance;
                    line.userData = {
                        nodeA: nodeA,
                        nodeB: nodeB,
                        baseOpacity: 0.03 + (1 - Math.min(distance, maxDistance * 1.5) / (maxDistance * 1.5)) * 0.1
                    };
                    
                    line.material.opacity = line.userData.baseOpacity;
                    
                    group.add(line);
                    connections.push(line);
                    
                    nodeA.userData.connections.push(line);
                    nodeB.userData.connections.push(line);
                }
            }
        }
    }
    
    // Add white stars (existing)
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 120; // Slightly reduced
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    
    // Create random star positions
    for (let i = 0; i < starCount * 3; i += 3) {
        // Distribute stars across the visible area
        starPositions[i] = (Math.random() - 0.5) * 40;  // x
        starPositions[i + 1] = (Math.random() - 0.5) * 25; // y
        starPositions[i + 2] = (Math.random() - 0.5) * 15; // z
        
        // Vary star sizes
        starSizes[i/3] = 0.01 + Math.random() * 0.04;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    
    // Create star material with custom shader for proper star appearance
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    stars.userData = {
        originalPositions: starPositions.slice(),
        sizes: starSizes
    };
    group.add(stars);
    
    // Add colorful stars (new)
    const colorStarGeometry = new THREE.BufferGeometry();
    const colorStarCount = 70; // Fewer colorful stars to keep it subtle
    const colorStarPositions = new Float32Array(colorStarCount * 3);
    const colorStarColors = new Float32Array(colorStarCount * 3);
    const colorStarSizes = new Float32Array(colorStarCount);
    
    // Colorful star palette (professional, modern colors)
    const colorPalette = [
        [0.0, 0.7, 1.0],  // Light blue
        [0.9, 0.5, 0.1],  // Orange
        [0.1, 0.9, 0.5],  // Teal
        [0.8, 0.2, 0.5],  // Pink
        [0.5, 0.2, 1.0],  // Purple
        [0.1, 0.8, 0.8]   // Cyan
    ];
    
    // Create random colorful star positions and colors
    for (let i = 0; i < colorStarCount; i++) {
        const i3 = i * 3;
        
        // Distribute colorful stars more towards the screen edges for better effect
        const radius = 10 + Math.random() * 30;
        const angle = Math.random() * Math.PI * 2;
        colorStarPositions[i3] = Math.cos(angle) * radius;     // x
        colorStarPositions[i3+1] = Math.sin(angle) * radius;  // y
        colorStarPositions[i3+2] = (Math.random() - 0.5) * 15; // z
        
        // Assign a random color from our palette
        const colorChoice = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colorStarColors[i3] = colorChoice[0];
        colorStarColors[i3+1] = colorChoice[1];
        colorStarColors[i3+2] = colorChoice[2];
        
        // Much larger star sizes
        colorStarSizes[i] = 0.15 + Math.random() * 0.15;
    }
    
    colorStarGeometry.setAttribute('position', new THREE.BufferAttribute(colorStarPositions, 3));
    colorStarGeometry.setAttribute('color', new THREE.BufferAttribute(colorStarColors, 3));
    
    // Create colorful star material with larger size
    const colorStarMaterial = new THREE.PointsMaterial({
        size: 0.25, // Further increased size
        vertexColors: true,
        transparent: true,
        opacity: 0.8, // Slightly increased opacity
        sizeAttenuation: true
    });
    
    const colorStars = new THREE.Points(colorStarGeometry, colorStarMaterial);
    colorStars.userData = {
        originalPositions: colorStarPositions.slice(),
        sizes: colorStarSizes
    };
    group.add(colorStars);
    
    // Add subtle ambient glow
    const ambientGlow = new THREE.AmbientLight(0x004080, 0.1); // Dimmer for minimal look
    group.add(ambientGlow);
    
    // Create a subtle glow around mouse position
    const mouseGlow = new THREE.PointLight(0x007BFF, 1.5, 5); // Less intense
    mouseGlow.position.set(0, 0, 1);
    group.add(mouseGlow);
    
    // Add animation to the group
    group.userData = {
        nodes: nodes,
        connections: connections,
        stars: stars,
        colorStars: colorStars,
        mouseGlow: mouseGlow,
        update: function(time, mouse) {
            // Convert normalized mouse coordinates to scene coordinates
            // Scale to get better coverage across the scene
            const mouseX = mouse.x * 12;
            const mouseY = mouse.y * 8;
            
            // Update mouseGlow position
            this.mouseGlow.position.x = mouseX;
            this.mouseGlow.position.y = mouseY;
            this.mouseGlow.intensity = 1 + Math.sin(time * 0.001) * 0.3;
            
            // Update nodes - more subtle animation
            this.nodes.forEach(node => {
                // Distance from mouse
                const dx = node.position.x - mouseX;
                const dy = node.position.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                const basePos = node.userData.basePosition;
                
                // Mouse repulsion/attraction effect - more subtle
                const mouseInfluence = Math.max(0, 5 - dist) / 5;
                
                // Repulsion force - push nodes away from mouse
                let targetX = basePos.x;
                let targetY = basePos.y;
                
                if (dist < 5) {
                    const angle = Math.atan2(dy, dx);
                    const force = (5 - dist) * 0.03; // Reduced force
                    targetX = basePos.x + Math.cos(angle) * force;
                    targetY = basePos.y + Math.sin(angle) * force;
                }
                
                // Very slight ambient movement
                const ambientX = Math.sin(time * 0.0003 + basePos.x) * 0.07;
                const ambientY = Math.cos(time * 0.0003 + basePos.y) * 0.07;
                
                // Combine all movements
                targetX += ambientX;
                targetY += ambientY;
                
                // Smooth transition to target position
                node.position.x += (targetX - node.position.x) * 0.04;
                node.position.y += (targetY - node.position.y) * 0.04;
                
                // Subtle size pulse based on mouse proximity
                const pulse = 1 + Math.sin(time * 0.0007 * node.userData.pulseSpeed) * 0.1;
                const proximity = 1 + mouseInfluence * 0.3;
                const scale = node.userData.size * pulse * proximity;
                node.scale.set(scale, scale, scale);
                
                // Update node color based on mouse proximity
                if (mouseInfluence > 0) {
                    node.material.color.setHSL(0.6, 0.8, 0.5 + mouseInfluence * 0.3);
                    node.material.opacity = 0.6 + mouseInfluence * 0.2;
                } else {
                    node.material.color.set(0x007BFF);
                    node.material.opacity = 0.6;
                }
            });
            
            // Update connections (lines) - more subtle
            this.connections.forEach(line => {
                const nodeA = line.userData.nodeA;
                const nodeB = line.userData.nodeB;
                
                // Update line geometry positions to match node positions
                const positions = line.geometry.attributes.position.array;
                
                positions[0] = nodeA.position.x;
                positions[1] = nodeA.position.y;
                positions[2] = nodeA.position.z;
                
                positions[3] = nodeB.position.x;
                positions[4] = nodeB.position.y;
                positions[5] = nodeB.position.z;
                
                line.geometry.attributes.position.needsUpdate = true;
                
                // Calculate distance to mouse
                const lineMidX = (nodeA.position.x + nodeB.position.x) / 2;
                const lineMidY = (nodeA.position.y + nodeB.position.y) / 2;
                const dx = lineMidX - mouseX;
                const dy = lineMidY - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                const mouseInfluence = Math.max(0, 5 - dist) / 5;
                
                // Update line opacity based on mouse proximity - more subtle
                line.material.opacity = line.userData.baseOpacity + mouseInfluence * 0.3;
                
                // Update line color for nearby lines - more subtle
                if (mouseInfluence > 0.2) {
                    line.material.color.setHSL(0.6, 0.8, 0.5 + mouseInfluence * 0.3);
                } else {
                    line.material.color.set(0x007BFF);
                }
            });
            
            // Animate white stars with gentle twinkling and subtle mouse influence
            if (this.stars) {
                const starsPositions = this.stars.geometry.attributes.position.array;
                const originalPositions = this.stars.userData.originalPositions;
                
                for (let i = 0; i < starsPositions.length; i += 3) {
                    // Get original position
                    const origX = originalPositions[i];
                    const origY = originalPositions[i + 1];
                    const origZ = originalPositions[i + 2];
                    
                    // Calculate distance to mouse
                    const dx = origX - mouseX;
                    const dy = origY - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const mouseInfluence = Math.max(0, 8 - dist) / 8;
                    
                    // Apply very subtle drift
                    starsPositions[i] = origX + Math.sin(time * 0.0002 + i) * 0.05;
                    starsPositions[i + 1] = origY + Math.cos(time * 0.0002 + i) * 0.05;
                    
                    // Add slight mouse influence
                    if (mouseInfluence > 0) {
                        const angle = Math.atan2(dy, dx);
                        starsPositions[i] += Math.cos(angle) * mouseInfluence * 0.2;
                        starsPositions[i + 1] += Math.sin(angle) * mouseInfluence * 0.2;
                    }
                }
                
                // Make stars twinkle
                const starMaterial = this.stars.material;
                starMaterial.size = 0.05 + Math.sin(time * 0.001) * 0.01;
                
                this.stars.geometry.attributes.position.needsUpdate = true;
            }
            
            // Animate colorful stars - direct mouse tracking without circular motion
            if (this.colorStars) {
                const colorStarsPositions = this.colorStars.geometry.attributes.position.array;
                const originalPositions = this.colorStars.userData.originalPositions;
                
                for (let i = 0; i < colorStarsPositions.length; i += 3) {
                    // Get original position
                    const origX = originalPositions[i];
                    const origY = originalPositions[i + 1];
                    const origZ = originalPositions[i + 2];
                    
                    // Calculate distance to mouse
                    const dx = origX - mouseX;
                    const dy = origY - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    // Calculate influence factor based on distance - stronger attraction
                    const mouseInfluence = Math.max(0, 15 - dist) / 15;
                    
                    // Stars should be attracted to mouse, stronger for closer stars
                    // No circular motion, just direct tracking
                    if (mouseInfluence > 0) {
                        const angle = Math.atan2(dy, dx);
                        // Directly move toward/away from mouse based on mouse position
                        // Negative value for attraction (move toward mouse)
                        const attractFactor = 0.8 * mouseInfluence;
                        colorStarsPositions[i] = origX - (dx * attractFactor * 0.2);
                        colorStarsPositions[i + 1] = origY - (dy * attractFactor * 0.2);
                    } else {
                        // Return to original position when not influenced by mouse
                        colorStarsPositions[i] = origX;
                        colorStarsPositions[i + 1] = origY;
                    }
                    
                    // Keep z position constant to avoid weird depth changes
                    colorStarsPositions[i + 2] = origZ;
                }
                
                // Make colorful stars pulse with different rhythm
                const colorStarMaterial = this.colorStars.material;
                colorStarMaterial.size = 0.25 + Math.sin(time * 0.001) * 0.05;
                
                this.colorStars.geometry.attributes.position.needsUpdate = true;
            }
        }
    };
    
    return group;
}

// Create particles system
function createParticles() {
    const particleCount = 500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // Position
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;
        
        // Color
        colors[i] = 0.2 + Math.random() * 0.5;  // R (blue tone)
        colors[i + 1] = 0.2 + Math.random() * 0.5;  // G
        colors[i + 2] = 0.5 + Math.random() * 0.5;  // B
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    return new THREE.Points(particles, particleMaterial);
}

// Create AP Logo with advanced Three.js techniques
function createAPLogo() {
    const group = new THREE.Group();
    
    // Create better materials with reflections and textures
    const mainMaterial = new THREE.MeshStandardMaterial({
        color: 0x007BFF,
        metalness: 0.7,
        roughness: 0.2,
        emissive: 0x004a9f,
        emissiveIntensity: 0.2,
    });
    
    // Use ExtrudeGeometry for high-quality 3D text
    const aShape = new THREE.Shape();
    
    // Create a custom A shape 
    aShape.moveTo(-1, -2);
    aShape.lineTo(0, 2);
    aShape.lineTo(1, -2);
    aShape.lineTo(0.6, -2);
    aShape.lineTo(0.4, -1);
    aShape.lineTo(-0.4, -1);
    aShape.lineTo(-0.6, -2);
    aShape.lineTo(-1, -2);
    
    // Add the crossbar in the A
    const aHole = new THREE.Path();
    aHole.moveTo(-0.3, -0.5);
    aHole.lineTo(0.3, -0.5);
    aHole.lineTo(0, 0.5);
    aHole.lineTo(-0.3, -0.5);
    
    aShape.holes.push(aHole);
    
    const extrudeSettings = {
        steps: 2,
        depth: 0.5,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 3
    };
    
    const aGeometry = new THREE.ExtrudeGeometry(aShape, extrudeSettings);
    const aMesh = new THREE.Mesh(aGeometry, mainMaterial);
    aMesh.position.set(-1.8, 0, 0);
    aMesh.castShadow = true;
    aMesh.receiveShadow = true;
    group.add(aMesh);
    
    // Create "P" with smooth geometry
    const pShape = new THREE.Shape();
    
    // Main P vertical line
    pShape.moveTo(-0.5, -2);
    pShape.lineTo(-0.5, 2);
    pShape.lineTo(0, 2);
    pShape.lineTo(0, -2);
    pShape.lineTo(-0.5, -2);
    
    // P's loop
    pShape.moveTo(0, 0);
    pShape.lineTo(0, 2);
    pShape.bezierCurveTo(1.5, 2, 1.5, 0, 0, 0);
    
    const pGeometry = new THREE.ExtrudeGeometry(pShape, extrudeSettings);
    const pMesh = new THREE.Mesh(pGeometry, mainMaterial);
    pMesh.position.set(1.5, 0, 0);
    pMesh.castShadow = true;
    pMesh.receiveShadow = true;
    group.add(pMesh);
    
    // Add a glow effect
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x007BFF,
        transparent: true,
        opacity: 0.2
    });
    
    const aGlow = new THREE.Mesh(aGeometry, glowMaterial);
    aGlow.position.copy(aMesh.position);
    aGlow.scale.multiplyScalar(1.1);
    group.add(aGlow);
    
    const pGlow = new THREE.Mesh(pGeometry, glowMaterial);
    pGlow.position.copy(pMesh.position);
    pGlow.scale.multiplyScalar(1.1);
    group.add(pGlow);
    
    // Scale down the entire group (reduced from 0.7 to 0.65)
    group.scale.set(0.65, 0.65, 0.65);
    
    return group;
}

// Initialize 3D backgrounds for sections
function init3DBackgrounds() {
    const sections = document.querySelectorAll('.section-padding');
    
    sections.forEach((section, index) => {
        if (section.id === 'skills' || section.id === 'contact') return; // Skip sections that already have special effects
        
        // Create canvas for this section
        const canvas = document.createElement('canvas');
        canvas.classList.add('background-canvas');
        section.prepend(canvas);
        
        // Initialize Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, section.offsetWidth / section.offsetHeight, 0.1, 1000);
        camera.position.z = 5;
        
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        renderer.setSize(section.offsetWidth, section.offsetHeight);
        
        // Create different background effects based on section
        let backgroundObjects;
        
        if (section.id === 'about') {
            backgroundObjects = createWaveBackground(0x007BFF, 0.1);
        } else if (section.id === 'projects') {
            backgroundObjects = createGridBackground(0x007BFF, 0.2);
        } else if (section.id === 'experience') {
            backgroundObjects = createFloatingShapes(0x007BFF, 0.15);
        } else if (section.id === 'awards') {
            backgroundObjects = createStarField(0x007BFF, 0.25);
        } else {
            backgroundObjects = createWaveBackground(0x007BFF, 0.1);
        }
        
        scene.add(backgroundObjects);
        
        // Add ambient light
        const light = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(light);
        
        // Animation function
        function animate() {
            requestAnimationFrame(animate);
            
            // Animate background objects
            if (backgroundObjects) {
                backgroundObjects.rotation.x += 0.001;
                backgroundObjects.rotation.y += 0.001;
            }
            
            renderer.render(scene, camera);
        }
        
        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = section.offsetWidth / section.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(section.offsetWidth, section.offsetHeight);
        });
        
        // Start animation
        animate();
    });
}

// Create wave background effect for sections
function createWaveBackground(color, opacity) {
    const group = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: opacity
    });
    
    const geometry = new THREE.PlaneGeometry(15, 15, 20, 20);
    const positions = geometry.attributes.position.array;
    
    // Create wave pattern
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        positions[i + 2] = Math.sin(x) * 0.5 + Math.sin(y) * 0.5;
    }
    
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);
    
    return group;
}

// Create grid background effect for sections
function createGridBackground(color, opacity) {
    const group = new THREE.Group();
    
    // Create grid lines
    const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacity
    });
    
    const size = 10;
    const divisions = 10;
    
    const gridHelper = new THREE.GridHelper(size, divisions, color, color);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.material.opacity = opacity;
    gridHelper.material.transparent = true;
    
    group.add(gridHelper);
    
    return group;
}

// Create floating shapes background
function createFloatingShapes(color, opacity) {
    const group = new THREE.Group();
    
    const material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: opacity
    });
    
    // Add various shapes
    for (let i = 0; i < 20; i++) {
        let geometry;
        const random = Math.random();
        
        if (random < 0.33) {
            geometry = new THREE.BoxGeometry(1, 1, 1);
        } else if (random < 0.66) {
            geometry = new THREE.SphereGeometry(0.5, 8, 8);
        } else {
            geometry = new THREE.TetrahedronGeometry(0.5);
        }
        
        const mesh = new THREE.Mesh(geometry, material);
        
        // Random position
        mesh.position.set(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 5
        );
        
        // Random rotation
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        group.add(mesh);
    }
    
    return group;
}

// Create star field background
function createStarField(color, opacity) {
    const group = new THREE.Group();
    
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 10;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: color,
        size: 0.1,
        transparent: true,
        opacity: opacity
    });
    
    const stars = new THREE.Points(geometry, material);
    group.add(stars);
    
    return group;
}

// Initialize Skills Cloud with better 3D animation and tab system
function initSkillsCloud() {
    // Define all skills categories
    const skillCategories = [
        {
            id: 'languages',
            name: 'Languages',
            skills: [
                { name: 'JavaScript', level: 95 },
                { name: 'TypeScript', level: 90 },
                { name: 'Python', level: 85 },
                { name: 'HTML/CSS', level: 95 },
                { name: 'SQL', level: 80 },
                { name: 'Java', level: 70 },
                { name: 'C/C++', level: 65 }
            ]
        },
        {
            id: 'frameworks',
            name: 'Frameworks & Libraries',
            skills: [
                { name: 'React', level: 95 },
                { name: 'Node.js', level: 90 },
                { name: 'Express.js', level: 85 },
                { name: 'Vue.js', level: 75 },
                { name: 'Angular', level: 70 },
                { name: 'Django', level: 80 },
                { name: 'Flask', level: 85 },
                { name: 'Bootstrap', level: 90 }
            ]
        },
        {
            id: 'tools',
            name: 'Tools & Technologies',
            skills: [
                { name: 'Git', level: 95 },
                { name: 'Docker', level: 85 },
                { name: 'AWS', level: 80 },
                { name: 'MongoDB', level: 85 },
                { name: 'PostgreSQL', level: 80 },
                { name: 'Redis', level: 75 },
                { name: 'GraphQL', level: 80 },
                { name: 'RESTful APIs', level: 95 }
            ]
        },
        {
            id: 'ml',
            name: 'Machine Learning',
            skills: [
                { name: 'TensorFlow', level: 80 },
                { name: 'PyTorch', level: 75 },
                { name: 'Scikit-learn', level: 85 },
                { name: 'Pandas', level: 90 },
                { name: 'NumPy', level: 90 },
                { name: 'Data Visualization', level: 85 },
                { name: 'NLP', level: 75 }
            ]
        }
    ];

    const container = document.getElementById('skills-cloud-container');
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';

    // Create a container for each category
    skillCategories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category';
        categoryDiv.id = `skill-category-${category.id}`;
        categoryDiv.setAttribute('data-category', category.id);
        
        // Add category title
        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'mb-4';
        categoryTitle.textContent = category.name;
        categoryDiv.appendChild(categoryTitle);

        // Add skills grid
        const skillsGrid = document.createElement('div');
        skillsGrid.className = 'row g-4';

        // Create skill items
        category.skills.forEach(skill => {
            const skillCol = document.createElement('div');
            skillCol.className = 'col-md-6';

            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item mb-3';

            const skillInfo = document.createElement('div');
            skillInfo.className = 'd-flex justify-content-between mb-1';

            const skillName = document.createElement('span');
            skillName.className = 'skill-name';
            skillName.textContent = skill.name;

            const skillLevel = document.createElement('span');
            skillLevel.className = 'skill-percentage';
            skillLevel.textContent = `${skill.level}%`;

            skillInfo.appendChild(skillName);
            skillInfo.appendChild(skillLevel);

            const progressContainer = document.createElement('div');
            progressContainer.className = 'progress';
            progressContainer.style.height = '8px';
            
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressBar.setAttribute('role', 'progressbar');
            progressBar.setAttribute('aria-valuenow', skill.level);
            progressBar.setAttribute('aria-valuemin', '0');
            progressBar.setAttribute('aria-valuemax', '100');
            progressBar.style.width = '0%'; // Start at 0 for animation
            progressBar.style.backgroundColor = 'var(--primary-color)';
            
            progressContainer.appendChild(progressBar);
            
            skillItem.appendChild(skillInfo);
            skillItem.appendChild(progressContainer);
            
            skillCol.appendChild(skillItem);
            skillsGrid.appendChild(skillCol);
        });

        categoryDiv.appendChild(skillsGrid);
        container.appendChild(categoryDiv);
    });

    // Initialize the tab system
    initSkillsTabs();
}

function initSkillsTabs() {
    const tabs = document.querySelectorAll('.skill-tab');
    const slider = document.querySelector('.tab-slider');
    const categories = document.querySelectorAll('.skill-category');
    
    // Set the first category (Languages) as active by default
    document.querySelector('.skill-category[data-category="languages"]').classList.add('active');
    
    // Position the slider initially
    if (tabs.length > 0 && slider) {
        const activeTab = document.querySelector('.skill-tab.active');
        positionSlider(activeTab, slider);
    }
    
    // Add click event to each tab
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Position slider
            positionSlider(this, slider);
            
            // Show corresponding category and hide others
            const categoryId = this.getAttribute('data-category');
            categories.forEach(category => {
                category.classList.remove('active');
                if (category.getAttribute('data-category') === categoryId) {
                    category.classList.add('active');
                    // Animate progress bars
                    animateProgressBars(category);
                }
            });
        });
    });
    
    // Initial animation for the active category
    animateProgressBars(document.querySelector('.skill-category.active'));
    
    // Function to position the slider under the active tab
    function positionSlider(activeTab, slider) {
        slider.style.width = `${activeTab.offsetWidth}px`;
        slider.style.left = `${activeTab.offsetLeft}px`;
    }
    
    // Function to animate progress bars
    function animateProgressBars(category) {
        const progressBars = category.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const targetWidth = bar.getAttribute('aria-valuenow') + '%';
            // Reset width first
            bar.style.width = '0%';
            // Trigger animation
            setTimeout(() => {
                bar.style.transition = 'width 1s ease-in-out';
                bar.style.width = targetWidth;
            }, 50);
        });
    }
    
    // Use Intersection Observer to animate progress bars when the section comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBars(document.querySelector('.skill-category.active'));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
    
    // Handle window resize to reposition the slider
    window.addEventListener('resize', () => {
        const activeTab = document.querySelector('.skill-tab.active');
        if (activeTab && slider) {
            positionSlider(activeTab, slider);
        }
    });
}

// Initialize scroll animations using GSAP ScrollTrigger
function initScrollAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Navbar scroll behavior
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Back to top button visibility
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Create more advanced animations for sections
    const sections = document.querySelectorAll('section:not(.hero-section)');
    sections.forEach(section => {
        // Add animation classes
        section.classList.add('fade-in');
        
        // Create ScrollTrigger for each section
        ScrollTrigger.create({
            trigger: section,
            start: 'top 80%',
            onEnter: () => {
                section.classList.add('visible');
                gsap.to(section, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out"
                });
            },
            once: true
        });
    });
    
    // Project cards animation
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.classList.add('slide-up');
        
        ScrollTrigger.create({
            trigger: card,
            start: 'top 90%',
            onEnter: () => {
                // Staggered animation
                gsap.to(card, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "back.out(1.5)"
                });
            },
            once: true
        });
    });
    
    // Timeline animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.classList.add('slide-up');
        
        ScrollTrigger.create({
            trigger: item,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(item, {
                    x: 0,
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: index * 0.2,
                    ease: "power2.out"
                });
            },
            once: true
        });
    });
    
    // Awards animation
    const awardItems = document.querySelectorAll('.award-item');
    
    // First ensure all award items are visible
    awardItems.forEach(item => {
        item.style.opacity = '1';
    });
    
    // Then set up animations
    awardItems.forEach((item, index) => {
        item.classList.add('fade-in');
        
        ScrollTrigger.create({
            trigger: item,
            start: 'top 90%',
            onEnter: () => {
                // Animation for award items
                gsap.to(item, {
                    rotation: 0,
                    scale: 1,
                    duration: 1,
                    delay: index * 0.15,
                    ease: "elastic.out(1, 0.3)"
                });
                
                // Animation for the SVG icon
                const icon = item.querySelector('.award-icon');
                if (icon) {
                    gsap.to(icon, {
                        scale: 1.2,
                        duration: 1.2,
                        delay: index * 0.15 + 0.3,
                        ease: "elastic.out(1, 0.3)",
                        yoyo: true,
                        repeat: 1
                    });
                }
            },
            once: true
        });
    });
}

// Initialize stat counters with animation
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    ScrollTrigger.create({
        trigger: '.stats-container',
        start: 'top 80%',
        onEnter: () => {
            counters.forEach(counter => {
                const target = parseInt(counter.textContent);
                let count = 0;
                const duration = 2000; // ms
                const increment = target / (duration / 16); // 60fps
                
                function updateCount() {
                    if (count < target) {
                        count += increment;
                        if (count > target) count = target;
                        counter.textContent = Math.floor(count);
                        requestAnimationFrame(updateCount);
                    }
                }
                
                updateCount();
            });
        },
        once: true
    });
}

// Initialize project filters
function initProjectFilters() {
    if (!filterBtns.length || !projectItems.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter projects with GSAP
            projectItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || filter === category) {
                    gsap.to(item, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.5,
                        ease: 'power2.out',
                        clearProps: 'scale'
                    });
                } else {
                    gsap.to(item, {
                        scale: 0.8,
                        opacity: 0.3,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
            });
        });
    });
}

// Initialize event listeners
function initEventListeners() {
    // Back to top button click
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Contact form submission
    if (contactForm) {
        const formInputs = contactForm.querySelectorAll('input, textarea');
        
        // Add validation class on blur
        formInputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value.trim() !== '') {
                    input.classList.add('is-valid');
                } else {
                    input.classList.remove('is-valid');
                }
            });
        });
        
        // Form submission with animation
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Validate form
            let isValid = true;
            formInputs.forEach(input => {
                if (input.value.trim() === '') {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                }
            });
            
            if (!isValid) return;
            
            // Animation for submit button
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Sending...
            `;
            
            // Simulate sending (would be replaced with actual AJAX in production)
            setTimeout(() => {
                // Success animation
                submitButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                    Sent!
                `;
                
                // Clear form with animation
                formInputs.forEach(input => {
                    gsap.to(input, {
                        value: '',
                        duration: 0.3,
                        delay: 0.5,
                        onComplete: () => {
                            input.classList.remove('is-valid');
                            submitButton.disabled = false;
                            
                            // Reset button after delay
                            setTimeout(() => {
                                submitButton.innerHTML = originalText;
                            }, 2000);
                        }
                    });
                });
            }, 1500);
        });
    }
    
    // Project cards 3D hover effect with GSAP
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            gsap.to(card, {
                rotationY: x * 15,
                rotationX: -y * 15,
                ease: 'power2.out',
                duration: 0.5,
                transformPerspective: 1000,
                transformOrigin: 'center'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationY: 0,
                rotationX: 0,
                ease: 'elastic.out(1, 0.3)',
                duration: 1
            });
        });
    });
    
    // Enhanced modals
    initProjectModals();
}

// Initialize project modals with enhanced animations
function initProjectModals() {
    const projectModals = document.querySelectorAll('.modal');
    
    projectModals.forEach(modal => {
        // When modal is about to show
        modal.addEventListener('show.bs.modal', function() {
            // Pre-animation setup - if needed
            const modalContent = this.querySelector('.modal-content');
            gsap.set(modalContent, { 
                opacity: 0,
                scale: 0.8,
                y: 20
            });
        });
        
        // When modal is fully visible
        modal.addEventListener('shown.bs.modal', function() {
            // Main modal animation
            const modalContent = this.querySelector('.modal-content');
            gsap.to(modalContent, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.6,
                ease: 'back.out(1.7)',
                onComplete: () => {
                    // Animate video container once modal is visible
                    const videoContainer = this.querySelector('.ratio');
                    if (videoContainer) {
                        gsap.fromTo(videoContainer, 
                            { y: 30, opacity: 0.5 },
                            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
                        );
                    }
                }
            });
        });
        
        // When modal starts to hide
        modal.addEventListener('hide.bs.modal', function() {
            const modalContent = this.querySelector('.modal-content');
            gsap.to(modalContent, {
                opacity: 0,
                scale: 0.8,
                y: -20,
                duration: 0.4,
                ease: 'power2.in'
            });
        });
    });
    
    // Add click effect on technology badges
    const techBadges = document.querySelectorAll('.modal .tech-stack .badge');
    techBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            gsap.to(this, {
                scale: 1.2,
                duration: 0.2,
                ease: 'power2.out',
                onComplete: () => {
                    gsap.to(this, {
                        scale: 1,
                        duration: 0.4,
                        ease: 'elastic.out(1.5, 0.3)'
                    });
                }
            });
        });
    });
}

// Initialize Contact Section 3D Element
function initContactSection() {
    // Form animation only, no 3D elements
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const formElements = form.querySelectorAll('input, textarea, button');
    
    formElements.forEach((element, index) => {
        gsap.from(element, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: 0.3 + (index * 0.1),
            scrollTrigger: {
                trigger: form,
                start: 'top 80%'
            }
        });
    });
}

// Initialize 3D footer with dynamic elements
function initFooter3D() {
    const footer3DContainer = document.getElementById('footer-3d');
    if (!footer3DContainer) return;
    
    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    
    // Set dimensions
    const width = footer3DContainer.clientWidth || window.innerWidth;
    const height = Math.max(300, footer3DContainer.clientHeight || footer3DContainer.offsetHeight || 300);
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    footer3DContainer.appendChild(renderer.domElement);
    
    // Create grid with floating orbs and particles
    const group = new THREE.Group();
    scene.add(group);
    
    // Add a grid floor
    const gridSize = 20;
    const gridDivisions = 20;
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x007BFF, 0x0a1930);
    gridHelper.position.y = -3;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.2;
    group.add(gridHelper);
    
    // Add floating orbs
    const orbGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const orbMaterial = new THREE.MeshPhongMaterial({
        color: 0x007BFF,
        emissive: 0x003366,
        shininess: 90,
        transparent: true,
        opacity: 0.8
    });
    
    const orbs = [];
    for (let i = 0; i < 10; i++) {
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        orb.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 5
        );
        orb.userData = {
            speed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.01
            }
        };
        group.add(orb);
        orbs.push(orb);
    }
    
    // Add particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 20;
        posArray[i+1] = (Math.random() - 0.5) * 10;
        posArray[i+2] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x6c63ff,
        transparent: true,
        opacity: 0.5
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    group.add(particlesMesh);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x007BFF, 0.8, 20);
    pointLight.position.set(0, 2, 5);
    scene.add(pointLight);
    
    // Create animate function
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate the entire group
        group.rotation.y += 0.001;
        
        // Animate orbs
        orbs.forEach(orb => {
            orb.position.x += orb.userData.speed.x;
            orb.position.y += orb.userData.speed.y;
            orb.position.z += orb.userData.speed.z;
            
            // Boundary check and reverse direction
            if (Math.abs(orb.position.x) > 5) orb.userData.speed.x *= -1;
            if (Math.abs(orb.position.y) > 3) orb.userData.speed.y *= -1;
            if (Math.abs(orb.position.z) > 3) orb.userData.speed.z *= -1;
            
            // Subtle pulsing effect
            orb.scale.x = orb.scale.y = orb.scale.z = 1 + 0.1 * Math.sin(Date.now() * 0.001 + orb.position.x);
        });
        
        // Rotate particles
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;
        
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    function onResize() {
        const newWidth = footer3DContainer.clientWidth || window.innerWidth;
        const newHeight = Math.max(300, footer3DContainer.clientHeight || footer3DContainer.offsetHeight || 300);
        
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    }
    
    window.addEventListener('resize', onResize);
    
    // Start animation
    animate();
    
    // Add interaction with mouse
    document.addEventListener('mousemove', (event) => {
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Subtle movement following mouse
        gsap.to(group.rotation, {
            x: y * 0.1,
            y: x * 0.1,
            duration: 1,
            ease: "power2.out"
        });
    });
} 