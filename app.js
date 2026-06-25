// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const settingsThemeToggle = document.getElementById('settings-theme-toggle');
const body = document.body;

function toggleTheme() {
    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        if (settingsThemeToggle) {
            settingsThemeToggle.querySelector('span').textContent = 'Dark';
        }
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
        if (settingsThemeToggle) {
            settingsThemeToggle.querySelector('span').textContent = 'Light';
        }
    }
}

themeToggle.addEventListener('click', toggleTheme);
if (settingsThemeToggle) {
    settingsThemeToggle.addEventListener('click', toggleTheme);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
body.classList.add(savedTheme + '-theme');

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileNav = document.getElementById('mobile-nav');

mobileMenuToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
});

// Navigation
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = link.getAttribute('data-page');
        
        // Update active nav
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Show target page
        pages.forEach(p => p.classList.remove('active'));
        document.getElementById(targetPage + '-page').classList.add('active');
        
        // Close mobile menu
        mobileNav.classList.remove('active');
        
        // Scroll to top
        window.scrollTo(0, 0);
    });
});

// File Upload
const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');
let selectedFiles = [];

uploadZone.addEventListener('click', () => {
    fileInput.click();
});

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'hsl(var(--primary))';
    uploadZone.style.background = 'hsl(var(--primary) / 0.05)';
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.style.borderColor = '';
    uploadZone.style.background = '';
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = '';
    uploadZone.style.background = '';
    
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
});

fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
});

function addFiles(files) {
    selectedFiles = [...selectedFiles, ...files];
    renderFileList();
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    renderFileList();
}

function renderFileList() {
    if (selectedFiles.length === 0) {
        fileList.innerHTML = '';
        return;
    }
    
    fileList.innerHTML = `
        <h3 style="margin-bottom: 0.75rem;">Selected Files (${selectedFiles.length})</h3>
        ${selectedFiles.map((file, index) => `
            <div class="card" style="padding: 0.75rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="font-size: 0.875rem; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${file.name}</span>
                <button class="btn btn-ghost btn-icon" onclick="removeFile(${index})" style="flex-shrink: 0;">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `).join('')}
        <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="startDetection()">Start Detection</button>
    `;
}

function startDetection() {
    console.log('Starting detection for files:', selectedFiles);
    alert('Detection started! (This is a UI demo)');
}

// Zoom Controls
let zoomLevel = 1;
const detectionImage = document.getElementById('detection-image');
const zoomLevelDisplay = document.querySelector('.zoom-level');

document.getElementById('zoom-in')?.addEventListener('click', () => {
    zoomLevel = Math.min(3, zoomLevel + 0.1);
    updateZoom();
});

document.getElementById('zoom-out')?.addEventListener('click', () => {
    zoomLevel = Math.max(0.5, zoomLevel - 0.1);
    updateZoom();
});

document.getElementById('fit-screen')?.addEventListener('click', () => {
    zoomLevel = 1;
    updateZoom();
});

function updateZoom() {
    if (detectionImage) {
        detectionImage.style.transform = `scale(${zoomLevel})`;
        detectionImage.style.transformOrigin = 'top left';
        zoomLevelDisplay.textContent = Math.round(zoomLevel * 100) + '%';
    }
}

// Confidence Slider
const confidenceSlider = document.getElementById('confidence-slider');
const sliderValue = document.querySelector('.slider-value');

if (confidenceSlider) {
    confidenceSlider.addEventListener('input', (e) => {
        sliderValue.textContent = e.target.value + '%';
    });
}

// Settings Confidence Slider
const settingsConfidence = document.getElementById('settings-confidence');
if (settingsConfidence) {
    settingsConfidence.addEventListener('input', (e) => {
        const description = document.querySelector('.settings-description .font-mono');
        if (description) {
            description.textContent = e.target.value + '%';
        }
    });
}

// Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === targetTab + '-tab') {
                content.classList.add('active');
            }
        });
    });
});

// Generate History Items
const historyGrid = document.getElementById('history-grid');
const historyItems = [
    { id: 1, date: '2024-10-05 14:30', pests: ['tungro', 'brownspot'], confidence: 92, gradient: 'linear-gradient(135deg, hsl(142 76% 36% / 0.3) 0%, hsl(38 92% 50% / 0.3) 100%)' },
    { id: 2, date: '2024-10-04 09:15', pests: ['brownspot'], confidence: 95, gradient: 'linear-gradient(135deg, hsl(38 92% 50% / 0.3) 0%, hsl(210 65% 55% / 0.3) 100%)' },
    { id: 3, date: '2024-10-03 16:45', pests: ['blight'], confidence: 93, gradient: 'linear-gradient(135deg, hsl(210 65% 55% / 0.3) 0%, hsl(280 65% 60% / 0.3) 100%)' },
    { id: 4, date: '2024-10-02 11:20', pests: ['blast', 'bacterial'], confidence: 88, gradient: 'linear-gradient(135deg, hsl(280 65% 60% / 0.3) 0%, hsl(25 75% 58% / 0.3) 100%)' },
    { id: 5, date: '2024-10-01 13:00', pests: ['twirl'], confidence: 95, gradient: 'linear-gradient(135deg, hsl(25 75% 58% / 0.3) 0%, hsl(142 76% 36% / 0.3) 100%)' },
    { id: 6, date: '2024-09-30 10:30', pests: ['blight'], confidence: 98, gradient: 'linear-gradient(135deg, hsl(142 76% 36% / 0.3) 0%, hsl(210 65% 55% / 0.3) 100%)' }
];

if (historyGrid) {
    historyGrid.innerHTML = historyItems.map(item => `
        <div class="card" style="overflow: hidden; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;" onmouseenter="this.style.transform='scale(1.02)'" onmouseleave="this.style.transform='scale(1)'">
            <div style="height: 12rem; background: ${item.gradient};"></div>
            <div style="padding: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: hsl(var(--muted-foreground)); margin-bottom: 0.75rem;">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>${item.date}</span>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
                    ${item.pests.map(pest => `<span class="badge" style="background: hsl(var(--muted)); color: hsl(var(--foreground));">${pest}</span>`).join('')}
                </div>
                <div style="font-size: 0.875rem;">
                    <span style="color: hsl(var(--muted-foreground));">Avg. Confidence: </span>
                    <span style="font-family: var(--font-mono); font-weight: 600;">${item.confidence}%</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Make removeFile and startDetection globally accessible
window.removeFile = removeFile;
window.startDetection = startDetection;

console.log('GreenScan UI initialized');

async function startDetection() {
    if (selectedFiles.length === 0) {
        alert('Please select at least one image!');
        return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('images', file));

    const response = await fetch('/detect', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        alert('detection detected!');
        return;
    }

    const detectionContainer = document.getElementById('detection-image');
    detectionContainer.innerHTML = ''; // clear old results

    // Assume backend sends base64 image + boxes: [{x, y, width, height, label, confidence}]
    data.results.forEach(result => {
        // Create image
        const img = document.createElement('img');
        img.src = result.detected_image; // base64 or URL
        img.classList.add('detection-base-image');
        detectionContainer.appendChild(img);

        // Create boxes overlay
        result.boxes.forEach(box => {
            const div = document.createElement('div');
            div.classList.add('detection-box');
            div.style.left = box.x + 'px';
            div.style.top = box.y + 'px';
            div.style.width = box.width + 'px';
            div.style.height = box.height + 'px';
            div.style.borderColor = box.color || '#ef4444';

            const label = document.createElement('span');
            label.classList.add('detection-label');
            label.style.backgroundColor = box.color || '#ef4444';
            label.textContent = `${box.label} ${box.confidence}%`;

            div.appendChild(label);
            detectionContainer.appendChild(div);
        });
    });

    // Scroll to results
    document.querySelector('.results-section').scrollIntoView({ behavior: 'smooth' });
}


