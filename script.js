window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading').classList.add('fade-out');
    }, 2000);
});
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.getElementById('scrollProgress').style.width = scrollPercent + '%';
    if (scrollTop > 50) {
        document.getElementById('mainHeader').classList.add('scrolled');
    } else {
        document.getElementById('mainHeader').classList.remove('scrolled');
    }
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    alpha: true,
    antialias: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
camera.position.set(0, 0, 8);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);
const mainLight = new THREE.DirectionalLight(0x00ccff, 2);
mainLight.position.set(10, 10, 5);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 2048;
mainLight.shadow.mapSize.height = 2048;
scene.add(mainLight);
const fillLight = new THREE.DirectionalLight(0xff00cc, 1.5);
fillLight.position.set(-10, 5, -5);
scene.add(fillLight);
const rimLight = new THREE.DirectionalLight(0xffaa00, 1);
rimLight.position.set(0, -10, 10);
scene.add(rimLight);
function createAdvancedParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 150; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        const size = Math.random() * 4 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDelay = `${Math.random() * 8}s`;
        particle.style.animationDuration = `${8 + Math.random() * 4}s`;
        particlesContainer.appendChild(particle);
    }
}
createAdvancedParticles();
const droneGroup = new THREE.Group();
scene.add(droneGroup);
const loader = new THREE.GLTFLoader();
let droneModel = null;
let mixer = null;
let clock = new THREE.Clock();
document.getElementById('modelLoading').style.display = 'block';
loader.load(
    '',
    function (gltf) {
        droneModel = gltf.scene;
        droneModel.scale.set(3.5, 3.5, 3.5);
        droneModel.position.set(0, 0, 0);
        droneModel.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                if (node.material) {
                    node.material.metalness = 0.9;
                    node.material.roughness = 0.1;
                    node.material.envMapIntensity = 1;
                }
            }
        });
        droneGroup.add(droneModel);
        document.getElementById('modelLoading').style.display = 'none';
        if (gltf.animations && gltf.animations.length) {
            mixer = new THREE.AnimationMixer(droneModel);
            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
            });
        }
        setTimeout(setupExtendedScrollAnimations, 500);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('Error loading model:', error);
        document.getElementById('modelLoading').textContent = 'Failed to load 3D model. Using fallback.';
        createFallbackDrone();
        setTimeout(setupExtendedScrollAnimations, 500);
    }
);
function createFallbackDrone() {
    const bodyGeometry = new THREE.BoxGeometry(1, 0.2, 1);
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x222222,
        metalness: 0.9,
        roughness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    droneGroup.add(body);
    const armGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 16);
    const armMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x333333
    });
    for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i;
        const arm = new THREE.Mesh(armGeometry, armMaterial);
        arm.rotation.x = Math.PI / 2;
        arm.position.set(
            Math.cos(angle) * 0.6,
            0,
            Math.sin(angle) * 0.6
        );
        droneGroup.add(arm);
        const motorGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 32);
        const motor = new THREE.Mesh(motorGeometry, armMaterial);
        motor.position.set(
            Math.cos(angle) * 0.6,
            0,
            Math.sin(angle) * 0.6
        );
        droneGroup.add(motor);
        const propellerGeometry = new THREE.BoxGeometry(0.4, 0.02, 0.1);
        const propeller = new THREE.Mesh(propellerGeometry, new THREE.MeshPhysicalMaterial({
            color: 0x444444,
            transparent: true,
            opacity: 0.8
        }));
        propeller.position.set(
            Math.cos(angle) * 0.6,
            0.1,
            Math.sin(angle) * 0.6
        );
        droneGroup.propellers = droneGroup.propellers || [];
        droneGroup.propellers.push(propeller);
        droneGroup.add(propeller);
    }
    const cameraGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const cameraMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x111111
    });
    const cameraMesh = new THREE.Mesh(cameraGeometry, cameraMaterial);
    cameraMesh.position.y = -0.2;
    droneGroup.add(cameraMesh);
    const lensGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.05, 32);
    const lensMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0066ff,
        metalness: 0.5,
        roughness: 0.2
    });
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.rotation.x = Math.PI / 2;
    lens.position.y = -0.2;
    lens.position.z = -0.15;
    droneGroup.add(lens);
    droneGroup.scale.set(3.5, 3.5, 3.5);
    document.getElementById('modelLoading').style.display = 'none';
}
function createAdvancedEnvironment() {
    scene.fog = new THREE.Fog(0x000011, 5, 50);
    const gridHelper = new THREE.GridHelper(30, 30, 0x00aaff, 0x003366);
    gridHelper.position.y = -8;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.3;
    scene.add(gridHelper);
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x00ccff,
        size: 0.1,
        transparent: true,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });
    const particlesVertices = [];
    const particlesColors = [];
    for (let i = 0; i < 500; i++) {
        const x = (Math.random() - 0.5) * 40;
        const y = (Math.random() - 0.5) * 40;
        const z = (Math.random() - 0.5) * 40;
        particlesVertices.push(x, y, z);
        const r = Math.random() * 0.5;
        const g = Math.random() * 0.5 + 0.5;
        const b = 1;
        particlesColors.push(r, g, b);
    }
    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlesVertices, 3));
    particlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(particlesColors, 3));
    const particles3D = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles3D);
    const ringGeometry = new THREE.RingGeometry(8, 8.2, 64);
    const ringMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ccff,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
    });
    for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        ring.position.y = (i - 1) * 10;
        scene.add(ring);
    }
}
createAdvancedEnvironment();
function setupExtendedScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    const features = document.querySelectorAll('.feature');
    const ctaFinal = document.querySelector('.cta-final');
    features.forEach((feature, index) => {
        gsap.to(feature, {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
                trigger: feature,
                start: "top 80%",
                toggleActions: "play none none reverse",
                onEnter: () => feature.classList.add('visible')
            }
        });
        const specCards = feature.querySelectorAll('.spec-card');
        gsap.from(specCards, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            delay: 0.5,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: feature,
                start: "top 70%"
            }
        });
    });
    gsap.to(ctaFinal, {
        opacity: 1,
        y: 0,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ctaFinal,
            start: "top 80%",
            toggleActions: "play none none reverse",
            onEnter: () => ctaFinal.classList.add('visible')
        }
    });
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".content",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
            pin: false
        }
    });
    tl.to(droneGroup.position, {
        y: 2,
        z: 2,
        duration: 3,
        ease: "power2.out"
    })
    .to(droneGroup.rotation, {
        y: Math.PI * 0.5,
        duration: 3,
        ease: "power2.inOut"
    }, "<")
    .to(camera.position, {
        z: 6,
        y: 1,
        duration: 3
    }, "<");
    tl.to(camera.position, {
        x: 4,
        y: 2,
        z: 4,
        duration: 4
    })
    .to(camera.rotation, {
        x: -0.3,
        y: 0.6,
        z: 0.1,
        duration: 4
    }, "<")
    .to(droneGroup.rotation, {
        y: Math.PI * 1.2,
        z: 0.2,
        duration: 4
    }, "<");
    tl.to(droneGroup.position, {
        x: -3,
        y: 3,
        z: 1,
        duration: 4,
        ease: "power2.inOut"
    })
    .to(droneGroup.rotation, {
        y: Math.PI * 1.8,
        x: 0.3,
        z: -0.3,
        duration: 4,
        ease: "power2.inOut"
    }, "<")
    .to(camera.position, {
        x: -2,
        y: 1,
        z: 6,
        duration: 4
    }, "<");
    tl.to(camera.position, {
        x: 1,
        y: 0,
        z: 3,
        duration: 3
    })
    .to(camera.rotation, {
        x: 0,
        y: -0.2,
        z: 0,
        duration: 3
    }, "<")
    .to(droneGroup.rotation, {
        y: Math.PI * 2.2,
        x: 0,
        z: 0,
        duration: 3
    }, "<");
    tl.to(camera.position, {
        x: 0,
        y: 6,
        z: 0,
        duration: 4
    })
    .to(camera.rotation, {
        x: -Math.PI/2,
        y: 0,
        z: 0,
        duration: 4
    }, "<")
    .to(droneGroup.rotation, {
        y: Math.PI * 3,
        duration: 4,
        ease: "power1.inOut"
    }, "<");
    tl.to(camera.position, {
        x: 8,
        y: 0,
        z: 0,
        duration: 3
    })
    .to(camera.rotation, {
        x: 0,
        y: Math.PI/2,
        z: 0,
        duration: 3
    }, "<")
    .to(droneGroup.position, {
        x: 0,
        y: 0,
        z: 0,
        duration: 3
    }, "<");
    tl.to(droneGroup.position, {
        x: 2,
        y: -1,
        z: -2,
        duration: 4
    })
    .to(droneGroup.rotation, {
        y: Math.PI * 3.5,
        x: -0.2,
        duration: 4
    }, "<")
    .to(camera.position, {
        x: 0,
        y: 2,
        z: 8,
        duration: 4
    }, "<")
    .to(camera.rotation, {
        x: -0.2,
        y: 0,
        z: 0,
        duration: 4
    }, "<");
    tl.to(droneGroup.position, {
        x: 0,
        y: -3,
        z: -5,
        duration: 5,
        ease: "power2.out"
    })
    .to(droneGroup.rotation, {
        y: Math.PI * 4,
        x: 0.1,
        z: 0,
        duration: 5,
        ease: "power2.out"
    }, "<")
    .to(camera.position, {
        x: 0,
        y: 0,
        z: 10,
        duration: 5
    }, "<")
    .to(camera.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 5
    }, "<");
}
let frameCount = 0;
function animate() {
    requestAnimationFrame(animate);
    frameCount++;
    if (mixer) {
        mixer.update(clock.getDelta());
    }
    if (droneGroup.propellers) {
        droneGroup.propellers.forEach((propeller, index) => {
            const speed = 0.4 + Math.sin(frameCount * 0.01) * 0.1;
            propeller.rotation.y += speed * (index % 2 === 0 ? 1 : -1);
        });
    }
    const time = Date.now() * 0.001;
    droneGroup.position.y += Math.sin(time) * 0.008;
    droneGroup.position.x += Math.cos(time * 0.7) * 0.005;
    droneGroup.rotation.z = Math.sin(time * 0.5) * 0.02;
    scene.traverse((object) => {
        if (object instanceof THREE.Points) {
            object.rotation.y += 0.001;
            object.rotation.x += 0.0005;
        }
        if (object instanceof THREE.Mesh && object.geometry instanceof THREE.RingGeometry) {
            object.rotation.y += 0.002;
            object.rotation.x += 0.001;
        }
    });
    scene.children.forEach((child) => {
        if (child instanceof THREE.DirectionalLight) {
            child.intensity = 1 + Math.sin(time + child.position.x) * 0.2;
        }
    });
    renderer.render(scene, camera);
}
animate();
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    gsap.to(camera.position, {
        x: mouseX * 0.5,
        y: mouseY * 0.3,
        duration: 2,
        ease: "power2.out"
    });
});
let isVisible = true;
document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible) {
        animate();
    }
});