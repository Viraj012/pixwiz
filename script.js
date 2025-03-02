document.addEventListener('DOMContentLoaded', function() {
    // Create stars for the background
    const starsContainer = document.querySelector('.stars');
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 4}s`;
        starsContainer.appendChild(star);
    }
    
    // Create buildings for the city
    const cityContainer = document.querySelector('.city');
    for (let i = 0; i < 15; i++) {
        const building = document.createElement('div');
        building.classList.add('building');
        
        // Add windows to each building
        const windowCount = Math.floor(Math.random() * 4) + 1;
        for (let j = 0; j < windowCount; j++) {
            const windowEl = document.createElement('div');
            windowEl.classList.add('window');
            windowEl.style.left = `${Math.random() * 70 + 10}%`;
            windowEl.style.top = `${Math.random() * 70 + 10}%`;
            building.appendChild(windowEl);
        }
        
        cityContainer.appendChild(building);
    }
    
    // DOM Elements
    const canvas = document.getElementById('pixel-canvas');
    const penColorEl = document.getElementById('pen-color');
    const bgColorEl = document.getElementById('bg-color');
    const fillBtn = document.getElementById('fill-btn');
    const eyedropperBtn = document.getElementById('eyedropper-btn');
    const eraserBtn = document.getElementById('eraser-btn');
    const rainbowBtn = document.getElementById('rainbow-btn');
    const shadeBtn = document.getElementById('shade-btn');
    const lightenBtn = document.getElementById('lighten-btn');
    const gridSizeSlider = document.getElementById('grid-size-slider');
    const sizeValueEl = document.getElementById('size-value');
    const gridLinesBtn = document.getElementById('grid-lines-btn');
    const clearBtn = document.getElementById('clear-btn');
    const saveBtn = document.getElementById('save-btn');
    const adventureBtn = document.getElementById('adventure-btn');
    
    // App state
    let penColor = '#ffde59';
    let bgColor = '#ffffff';
    let isDrawing = false;
    let currentMode = 'pen'; // pen, eraser, fill, eyedropper, rainbow, shade, lighten
    let gridSize = 16;
    let showGridLines = true;
    
    // Initialize canvas
    createGrid(gridSize);
    
    // Adventure button
    adventureBtn.addEventListener('click', function() {
        // Start with a clear canvas
        document.querySelectorAll('.pixel').forEach(pixel => {
            pixel.style.backgroundColor = bgColor;
        });
        
        // Create a simple pixel art
        const pixelArt = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,2,2,2,2,3,3,3,3,2,2,2,2,0,0],
            [0,2,2,2,2,3,3,3,3,3,3,2,2,2,2,0],
            [0,2,2,2,2,3,3,3,3,3,3,2,2,2,2,0],
            [0,2,2,2,2,3,3,3,3,3,3,2,2,2,2,0],
            [0,2,2,2,2,3,3,3,3,3,3,2,2,2,2,0],
            [0,0,2,2,2,2,3,3,3,3,2,2,2,2,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ];
        
        const colors = {
            0: bgColor,
            1: "#4a43a0", // Purple
            2: "#ffde59", // Yellow
            3: "#ff5555"  // Red
        };
        
        const pixels = Array.from(canvas.children);
        
        // Draw the pixel art with a delay
        let idx = 0;
        const drawInterval = setInterval(() => {
            if (idx >= pixels.length) {
                clearInterval(drawInterval);
                return;
            }
            
            const row = Math.floor(idx / gridSize);
            const col = idx % gridSize;
            
            if (row < pixelArt.length && col < pixelArt[row].length) {
                const colorCode = pixelArt[row][col];
                pixels[idx].style.backgroundColor = colors[colorCode];
            }
            
            idx++;
        }, 10);
    });
    
    // Color picker functionality
    penColorEl.addEventListener('click', () => {
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = penColor;
        colorPicker.style.opacity = 0;
        colorPicker.style.position = 'absolute';
        document.body.appendChild(colorPicker);
        
        colorPicker.addEventListener('change', (e) => {
            penColor = e.target.value;
            penColorEl.style.backgroundColor = penColor;
            document.body.removeChild(colorPicker);
        });
        
        colorPicker.addEventListener('close', () => {
            document.body.removeChild(colorPicker);
        });
        
        colorPicker.click();
    });
    
    bgColorEl.addEventListener('click', () => {
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = bgColor;
        colorPicker.style.opacity = 0;
        colorPicker.style.position = 'absolute';
        document.body.appendChild(colorPicker);
        
        colorPicker.addEventListener('change', (e) => {
            bgColor = e.target.value;
            bgColorEl.style.backgroundColor = bgColor;
            document.querySelectorAll('.pixel:not([style*="background-color"])').forEach(pixel => {
                pixel.style.backgroundColor = bgColor;
            });
            document.body.removeChild(colorPicker);
        });
        
        colorPicker.addEventListener('close', () => {
            document.body.removeChild(colorPicker);
        });
        
        colorPicker.click();
    });
    
    // Mode buttons
    fillBtn.addEventListener('click', () => {
        setActiveMode('fill');
    });
    
    eyedropperBtn.addEventListener('click', () => {
        setActiveMode('eyedropper');
    });
    
    eraserBtn.addEventListener('click', () => {
        toggleMode('eraser', eraserBtn);
    });
    
    rainbowBtn.addEventListener('click', () => {
        toggleMode('rainbow', rainbowBtn);
    });
    
    shadeBtn.addEventListener('click', () => {
        toggleMode('shade', shadeBtn);
    });
    
    lightenBtn.addEventListener('click', () => {
        toggleMode('lighten', lightenBtn);
    });
    
    // Grid size slider
    gridSizeSlider.addEventListener('input', (e) => {
        gridSize = parseInt(e.target.value);
        sizeValueEl.textContent = `${gridSize}×${gridSize}`;
    });
    
    gridSizeSlider.addEventListener('change', () => {
        createGrid(gridSize);
    });
    
    // Grid lines toggle
    gridLinesBtn.addEventListener('click', () => {
        showGridLines = !showGridLines;
        document.querySelectorAll('.pixel').forEach(pixel => {
            if (showGridLines) {
                pixel.classList.add('grid-lines');
            } else {
                pixel.classList.remove('grid-lines');
            }
        });
        gridLinesBtn.classList.toggle('active', showGridLines);
    });
    
    // Clear button with pixel animation
    clearBtn.addEventListener('click', () => {
        let pixels = Array.from(document.querySelectorAll('.pixel'));
        // Randomize pixels for a pixel-dissolve effect
        pixels = pixels.sort(() => Math.random() - 0.5);
        
        let delay = 0;
        const clearDelay = 1; // Very quick for the pixelated effect
        
        pixels.forEach((pixel) => {
            setTimeout(() => {
                pixel.style.backgroundColor = bgColor;
            }, delay);
            delay += clearDelay;
        });
    });
    
    // Save button
    saveBtn.addEventListener('click', () => {
        html2canvas(canvas, {
            backgroundColor: null,
            scale: 10
        }).then(function(canvas) {
            const link = document.createElement('a');
            link.download = 'pixel-art-wizard.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
    
    // Canvas events for drawing
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        if (e.target.classList.contains('pixel')) {
            handlePixelInteraction(e.target);
        }
    });
    
    canvas.addEventListener('mouseover', (e) => {
        if (isDrawing && e.target.classList.contains('pixel')) {
            handlePixelInteraction(e.target);
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDrawing = false;
    });
    
    // Functions
    function createGrid(size) {
        // Clear existing grid
        canvas.innerHTML = '';
        
        // Set the new grid template
        canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        
        // Create new pixels
        for (let i = 0; i < size * size; i++) {
            const pixel = document.createElement('div');
            pixel.classList.add('pixel');
            pixel.style.backgroundColor = bgColor;
            if (showGridLines) {
                pixel.classList.add('grid-lines');
            }
            canvas.appendChild(pixel);
        }
        
        // Reset grid lines button state
        gridLinesBtn.classList.toggle('active', showGridLines);
    }
    
    function setActiveMode(mode) {
        currentMode = mode;
        
        // Reset all mode buttons
        [fillBtn, eyedropperBtn, eraserBtn, rainbowBtn, shadeBtn, lightenBtn].forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Set the active button
        if (mode === 'fill') fillBtn.classList.add('active');
        else if (mode === 'eyedropper') eyedropperBtn.classList.add('active');
        else if (mode === 'eraser') eraserBtn.classList.add('active');
        else if (mode === 'rainbow') rainbowBtn.classList.add('active');
        else if (mode === 'shade') shadeBtn.classList.add('active');
        else if (mode === 'lighten') lightenBtn.classList.add('active');
    }
    
    function toggleMode(mode, button) {
        if (currentMode === mode) {
            currentMode = 'pen';
            button.classList.remove('active');
        } else {
            setActiveMode(mode);
        }
    }
    
    function handlePixelInteraction(pixel) {
        // Add a subtle pixelated "splash" effect
        if (currentMode === 'pen' || currentMode === 'rainbow') {
            createPixelSplash(pixel);
        }
        
        switch (currentMode) {
            case 'pen':
                pixel.style.backgroundColor = penColor;
                break;
            case 'eraser':
                pixel.style.backgroundColor = bgColor;
                break;
            case 'eyedropper':
                penColor = getComputedStyle(pixel).backgroundColor;
                // Convert RGB to HEX
                const rgb = penColor.match(/\d+/g);
                if (rgb && rgb.length === 3) {
                    const hex = '#' + rgb.map(x => {
                        const hex = parseInt(x).toString(16);
                        return hex.length === 1 ? '0' + hex : hex;
                    }).join('');
                    penColor = hex;
                    penColorEl.style.backgroundColor = penColor;
                }
                setActiveMode('pen');
                break;
            case 'fill':
                const targetColor = getComputedStyle(pixel).backgroundColor;
                fillArea(pixel, targetColor);
                setActiveMode('pen');
                break;
            case 'rainbow':
                const randomColor = getPixelColor();
                pixel.style.backgroundColor = randomColor;
                break;
            case 'shade':
                darkenColor(pixel);
                break;
            case 'lighten':
                lightenColor(pixel);
                break;
        }
    }
    
    function createPixelSplash(pixel) {
        // This is just a visual effect, not functional in this simplified version
        pixel.style.transform = 'scale(1.2)';
        setTimeout(() => {
            pixel.style.transform = '';
        }, 150);
    }
    
    function getPixelColor() {
        // Pixel art friendly colors
        const pixelColors = [
            '#ffde59', // Yellow
            '#ff5555', // Red
            '#4a43a0', // Purple
            '#55ff55', // Green
            '#5555ff', // Blue
            '#ff55ff', // Pink
            '#ffaa00', // Orange
            '#00aaaa'  // Teal
        ];
        return pixelColors[Math.floor(Math.random() * pixelColors.length)];
    }
    
    function fillArea(pixel, targetColor) {
        const queue = [pixel];
        const visited = new Set();
        const gridSizeValue = parseInt(gridSizeSlider.value);
        
        while (queue.length > 0) {
            const currentPixel = queue.shift();
            const index = Array.from(canvas.children).indexOf(currentPixel);
            
            if (visited.has(index) || getComputedStyle(currentPixel).backgroundColor !== targetColor) {
                continue;
            }
            
            currentPixel.style.backgroundColor = penColor;
            visited.add(index);
            
            // Add a slight delay for a pixel-fill animation effect
            setTimeout(() => {
                currentPixel.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    currentPixel.style.transform = '';
                }, 100);
            }, visited.size * 5);
            
            // Check adjacent pixels (up, right, down, left)
            const row = Math.floor(index / gridSizeValue);
            const col = index % gridSizeValue;
            
            // Up
            if (row > 0) {
                const upIndex = index - gridSizeValue;
                if (upIndex >= 0 && !visited.has(upIndex)) {
                    const upPixel = canvas.children[upIndex];
                    if (getComputedStyle(upPixel).backgroundColor === targetColor) {
                        queue.push(upPixel);
                    }
                }
            }
            
            // Right
            if (col < gridSizeValue - 1) {
                const rightIndex = index + 1;
                if (rightIndex < canvas.children.length && !visited.has(rightIndex)) {
                    const rightPixel = canvas.children[rightIndex];
                    if (getComputedStyle(rightPixel).backgroundColor === targetColor) {
                        queue.push(rightPixel);
                    }
                }
            }
            
            // Down
            if (row < gridSizeValue - 1) {
                const downIndex = index + gridSizeValue;
                if (downIndex < canvas.children.length && !visited.has(downIndex)) {
                    const downPixel = canvas.children[downIndex];
                    if (getComputedStyle(downPixel).backgroundColor === targetColor) {
                        queue.push(downPixel);
                    }
                }
            }
            
            // Left
            if (col > 0) {
                const leftIndex = index - 1;
                if (leftIndex >= 0 && !visited.has(leftIndex)) {
                    const leftPixel = canvas.children[leftIndex];
                    if (getComputedStyle(leftPixel).backgroundColor === targetColor) {
                        queue.push(leftPixel);
                    }
                }
            }
        }
    }
    
    function darkenColor(pixel) {
        const color = getComputedStyle(pixel).backgroundColor;
        const rgb = color.match(/\d+/g);
        if (rgb && rgb.length === 3) {
            // Use larger steps for more visible "pixel art" style changes
            const darkerRgb = rgb.map(value => Math.max(0, parseInt(value) - 40));
            pixel.style.backgroundColor = `rgb(${darkerRgb[0]}, ${darkerRgb[1]}, ${darkerRgb[2]})`;
        }
    }
    
    function lightenColor(pixel) {
        const color = getComputedStyle(pixel).backgroundColor;
        const rgb = color.match(/\d+/g);
        if (rgb && rgb.length === 3) {
            // Use larger steps for more visible "pixel art" style changes
            const lighterRgb = rgb.map(value => Math.min(255, parseInt(value) + 40));
            pixel.style.backgroundColor = `rgb(${lighterRgb[0]}, ${lighterRgb[1]}, ${lighterRgb[2]})`;
        }
    }
    
    // For saving images
    function html2canvas(element, options) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const scale = options?.scale || 1;
            const pixelCount = gridSize;
            const pixelSize = 10; 
            
            canvas.width = pixelCount * pixelSize * scale;
            canvas.height = pixelCount * pixelSize * scale;
            
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false; // Keep pixelated look
            
            // Fill with transparent background by default
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw each pixel
            for (let i = 0; i < element.children.length; i++) {
                const pixel = element.children[i];
                const row = Math.floor(i / pixelCount);
                const col = i % pixelCount;
                
                ctx.fillStyle = getComputedStyle(pixel).backgroundColor;
                ctx.fillRect(
                    col * pixelSize * scale, 
                    row * pixelSize * scale, 
                    pixelSize * scale, 
                    pixelSize * scale
                );
            }
            
            resolve(canvas);
        });
    }
});