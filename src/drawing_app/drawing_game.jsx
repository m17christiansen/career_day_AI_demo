import React, { useRef, useEffect, useState } from 'react';
import './styles.css';

function DrawingGame() {
  const canvasRef = useRef(null);
  const suggestionDisplayRef = useRef(null);
  const statusMessageRef = useRef(null);

  // Drawing variables
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#000000');
  const [selectedIdea, setSelectedIdea] = useState('');
  const [currentSuggestion, setCurrentSuggestion] = useState('');
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });
  
  // Info panel state
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  // AI suggestion ideas
  const ideas = [
    "Make a cute dog",
    "Make a cute cat",
    "Draw a flower",
    "Create a spaceship or rocket",
    "Draw a K-pop band",
    "Draw a house",
    "Draw a boat sailing on water",
    "Draw a rainbow with all the colors",
    "Make a friendly robot"
  ];

  const ideas_dict = {
    "Make a cute dog": "/draw_photos/dog.jpg",
    "Make a cute cat": "/draw_photos/cat.jpg",
    "Draw a flower": "/draw_photos/flower.jpg",
    "Create a spaceship or rocket": "/draw_photos/rocket.jpg",
    "Draw a K-pop band": "/draw_photos/demon_hunters.jpg",
    "Draw a house": "/draw_photos/house.jpg",
    "Draw a boat sailing on water": "/draw_photos/pirate_ship.jpg",
    "Draw a rainbow with all the colors": "/draw_photos/rainbow.jpg",
    "Make a friendly robot": "/draw_photos/robot.jpg"
  };

  // Get a random idea
  const getRandomIdea = () => {
    return ideas[Math.floor(Math.random() * ideas.length)];
  };

  // Toggle info panel
  const toggleInfoPanel = () => {
    setShowInfoPanel(!showInfoPanel);
  };

  // Close info panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showInfoPanel && 
          !e.target.closest('.info-panel') && 
          !e.target.closest('.info-button')) {
        setShowInfoPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInfoPanel]);

  // Update canvas size on mount and resize
  useEffect(() => {
    const updateCanvasSize = () => {
      const container = document.querySelector('.canvas-container');
      if (container) {
        const maxWidth = Math.min(800, container.clientWidth - 40); // Account for padding/borders
        const height = Math.min(500, (maxWidth * 500) / 800);
        
        setCanvasSize({ width: maxWidth, height: height });
        
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = maxWidth;
          canvas.height = height;
          
          // Redraw white background
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  // Initialize with default random idea
  useEffect(() => {
    const initialIdea = getRandomIdea();
    setCurrentSuggestion(initialIdea);
    setSelectedIdea(initialIdea);
  }, []);

  // Drawing functions
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Get the scale factor between the canvas's display size and its internal resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    
    if (e.type.includes('touch')) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Calculate relative position within the canvas
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    return { x, y };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    
    setIsDrawing(true);
    setLastX(x);
    setLastY(y);
    
    // Start a new path and move to the starting point
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // Set drawing styles once
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    updateStatus("Drawing in progress...");
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    
    // Continue the current path - don't begin a new path!
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setLastX(x);
    setLastY(y);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    updateStatus("Great drawing! Use AI buttons to get suggestions or complete your artwork.");
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    startDrawing(e);
  };
  
  const handleTouchMove = (e) => {
    e.preventDefault();
    draw(e);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    updateStatus("Canvas cleared! Start a new drawing.");
  };

  // AI Integration Functions
  const suggestIdea = () => {
    // Generate a new random idea
    const newIdea = getRandomIdea();
    
    // Update both the suggestion display AND the dropdown selection
    setCurrentSuggestion(newIdea);
    setSelectedIdea(newIdea);
    
    // Clear canvas when new idea is suggested
    clearCanvas();
    
    // Update status
    updateStatus(`AI suggests: ${newIdea}`);
  };

  const handleSuggestionClick = () => {
    // Generate random idea when suggestion box is clicked
    const randomIdea = getRandomIdea();
    setCurrentSuggestion(randomIdea);
    setSelectedIdea(randomIdea); // Also update the dropdown selection
    
    // Clear canvas when new idea is selected
    clearCanvas();
    
    updateStatus(`AI suggests: ${randomIdea}`);
  };

  const handleIdeaSelect = (e) => {
    const selectedValue = e.target.value;
    setSelectedIdea(selectedValue);
    setCurrentSuggestion(selectedValue);
    
    // Clear canvas when new idea is selected
    clearCanvas();
    
    updateStatus(`Selected idea: ${selectedValue}`);
  };

  const completeDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    updateStatus("AI is completing your drawing...");

    // Get the image path for the current suggestion
    const imagePath = ideas_dict[currentSuggestion];
    
    if (!imagePath) {
      updateStatus("No image found for this suggestion. Please select a different idea.");
      return;
    }

    // Create an image object to load the photo
    const img = new Image();
    
    img.onload = function() {
      // Clear the canvas
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Calculate dimensions to fit the image while maintaining aspect ratio
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.width;
      const imgHeight = img.height;
      
      // Calculate scaling to fit the image within the canvas
      const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;
      
      // Center the image on the canvas
      const x = (canvasWidth - scaledWidth) / 2;
      const y = (canvasHeight - scaledHeight) / 2;
      
      // Draw the image on the canvas
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      
      // Add a text overlay
      ctx.fillStyle = '#4169E1';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('AI completed your drawing!', canvasWidth / 2, canvasHeight - 20);
      
      updateStatus(`AI has completed your drawing with: ${currentSuggestion}`);
    };
    
    img.onerror = function() {
      updateStatus(`Error loading image: ${imagePath}. Please check if the file exists.`);
      // Fallback to the old completion method if image fails to load
      fallbackCompletion();
    };
    
    // Start loading the image
    img.src = imagePath;
  };

  // Fallback completion method if image fails to load
  const fallbackCompletion = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Get current drawing state
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Clear canvas and redraw original drawing
    clearCanvas();
    ctx.putImageData(imageData, 0, 0);

    // Simulate AI completion by adding meaningful elements
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.strokeStyle = '#FF69B4';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x1 = centerX + Math.cos(angle) * 20;
      const y1 = centerY + Math.sin(angle) * 20;
      const x2 = centerX + Math.cos(angle) * 50;
      const y2 = centerY + Math.sin(angle) * 50;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    ctx.fillStyle = '#4169E1';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('AI completed your drawing!', centerX, centerY + 100);

    updateStatus("AI has completed your drawing! Great job!");
  };

  const updateStatus = (message) => {
    if (statusMessageRef.current) {
      statusMessageRef.current.textContent = message;
    }
  };

  // Set up event listeners
  useEffect(() => {
    const canvas = canvasRef.current;

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events for mobile devices
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);

    // Cleanup event listeners on unmount
    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);

      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [isDrawing, brushColor, brushSize]); // Dependencies for the drawing functions

  return (
    <div className="drawing-game-container">
      {/* Info Button */}
      <button className="info-button" onClick={toggleInfoPanel}>
        ℹ️ AI Info
      </button>

      {/* Info Panel */}
      <div className={`info-panel ${showInfoPanel ? 'open' : ''}`}>
        <div className="info-panel-header">
          <h2>🤖 AI Technologies Behind This Game</h2>
          <button className="close-button" onClick={toggleInfoPanel}>×</button>
        </div>
        
        <div className="info-panel-content">
          <section className="ai-section">
            <h3>🎨 Image Recognition & Detection</h3>
            <ul>
              <li><strong>Convolutional Neural Networks (CNNs):</strong> Analyze drawings to identify shapes, objects, and patterns</li>
              <li><strong>Object Detection Models:</strong> YOLO, Faster R-CNN, or SSD to recognize specific elements in drawings</li>
              <li><strong>Feature Extraction:</strong> Identify edges, contours, and shapes using algorithms like Canny Edge Detection</li>
              <li><strong>Image Classification:</strong> Classify drawings into categories (animals, objects, scenes)</li>
              <li><strong>Similarity Matching:</strong> Compare user drawings with reference images using embeddings</li>
            </ul>
          </section>

          <section className="ai-section">
            <h3>✨ Generative AI Algorithms</h3>
            <ul>
              <li><strong>Stable Diffusion:</strong> Generate high-quality images from text prompts or incomplete drawings</li>
              <li><strong>DALL-E / Midjourney:</strong> Create detailed artwork based on user sketches and suggestions</li>
              <li><strong>Generative Adversarial Networks (GANs):</strong> StyleGAN or CycleGAN for artistic style transfer</li>
              <li><strong>Variational Autoencoders (VAEs):</strong> Learn latent representations of drawings for completion</li>
              <li><strong>Neural Style Transfer:</strong> Apply artistic styles to user drawings</li>
            </ul>
          </section>

          <section className="ai-section">
            <h3>🧠 Intelligent Features</h3>
            <ul>
              <li><strong>Real-time Drawing Analysis:</strong> Provide feedback as user draws</li>
              <li><strong>Smart Suggestions:</strong> Context-aware idea generation based on current drawing</li>
              <li><strong>Drawing Completion:</strong> Fill in missing parts based on learned patterns</li>
              <li><strong>Color Palette Suggestions:</strong> Recommend colors based on drawing content</li>
              <li><strong>Skill Assessment:</strong> Provide difficulty-appropriate challenges</li>
            </ul>
          </section>

          <section className="ai-section">
            <h3>🔧 Technical Implementation</h3>
            <ul>
              <li><strong>TensorFlow.js / PyTorch:</strong> Run AI models directly in browser</li>
              <li><strong>Canvas API:</strong> Real-time drawing processing</li>
              <li><strong>WebGL Acceleration:</strong> GPU-accelerated AI inference</li>
              <li><strong>REST APIs:</strong> Connect to cloud-based AI services</li>
              <li><strong>WebSockets:</strong> Real-time AI feedback during drawing</li>
            </ul>
          </section>

          <div className="info-footer">
            <p><strong>Current Implementation:</strong> This demo uses pre-generated images. A full implementation would integrate the AI technologies listed above.</p>
          </div>
        </div>
      </div>

      {/* Overlay when panel is open */}
      {showInfoPanel && <div className="info-overlay" onClick={toggleInfoPanel}></div>}

      <header className="compact-header">
        <h1>🎨 AI Drawing Game</h1>
        <p>Draw something and let AI help you complete it!</p>
      </header>

      <div className="game-area">
        <div className="compact-tools-panel">
          <div className="tool-group-row">
            <div className="tool-group compact">
              <label htmlFor="brush-size">Brush Size: {brushSize}</label>
              <input 
                type="range" 
                id="brush-size" 
                min="1" 
                max="50" 
                value={brushSize} 
                onChange={(e) => setBrushSize(parseInt(e.target.value))} 
              />
            </div>

            <div className="tool-group compact">
              <label htmlFor="brush-color">Color:</label>
              <input 
                type="color" 
                id="brush-color" 
                value={brushColor} 
                onChange={(e) => setBrushColor(e.target.value)} 
              />
            </div>
          </div>

          <div className="tool-group-row">
            <div className="tool-group compact button-row">
              <button onClick={clearCanvas}>Clear Canvas</button>
              <button onClick={suggestIdea}>AI Suggest Idea</button>
              <button onClick={completeDrawing}>AI Complete Drawing</button>
            </div>
          </div>

          <div className="tool-group-row">
            <div className="tool-group compact dropdown-row">
              <label htmlFor="idea-select">Select an Idea:</label>
              <select 
                id="idea-select" 
                value={selectedIdea} 
                onChange={handleIdeaSelect}
              >
                {ideas.map((idea, index) => (
                  <option key={index} value={idea}>
                    {idea}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="canvas-container">
          <canvas 
            id="drawing-canvas" 
            width={canvasSize.width}
            height={canvasSize.height}
            ref={canvasRef}
            style={{ touchAction: 'none', width: '100%', height: 'auto' }}
          />
          
          {/* Permanently visible suggestion display */}
          <div 
            id="suggestion-display" 
            className="suggestion-display permanent"
            ref={suggestionDisplayRef}
            onClick={handleSuggestionClick}
            title="Click to get a random suggestion"
          >
            <div className="suggestion-header">💡 AI Suggestion</div>
            <div className="suggestion-content">{currentSuggestion}</div>
          </div>
        </div>
      </div>

      <div className="status-bar">
        <div id="status-message" ref={statusMessageRef}>
          Start drawing! AI will help you complete your artwork.
        </div>
      </div>
    </div>
  );
}

export default DrawingGame;
