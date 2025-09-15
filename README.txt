# AeroDrone X7 - Product Showcase Website

## Project Overview

A modern, interactive website showcasing the AeroDrone X7 drone with 3D visualization and smooth scrolling animations. This single-page application features a futuristic design with immersive 3D elements that respond to user scrolling and mouse movements.

## Features

- **3D Drone Visualization**: Interactive Three.js model that responds to scrolling
- **Smooth Animations**: GSAP-powered scroll animations with parallax effects
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, futuristic design with gradient accents
- **Performance Optimized**: Efficient rendering and loading sequences
- **Progressive Loading**: Elegant loading screen with smooth transitions

## Technical Specifications

### Built With

- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with CSS variables and animations
- **JavaScript (ES6+)** - Interactive functionality
- **Three.js** - 3D rendering and visualization
- **GSAP** - Advanced animations and scroll effects
- **Google Fonts** - Typography (Inter and Orbitron)

### Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

*Note: Some advanced 3D features may have limited support on older browsers.*

## File Structure

```
aero-drone-website/
├── index.html          # Main HTML file
├── style.css           # Styles and responsive design
├── script.js           # JavaScript functionality and 3D rendering
└── drone.glb           # 3D model file (add your own)
```

## Setup Instructions

### Prerequisites

- A modern web browser with WebGL support
- A local server (recommended for testing to avoid CORS issues)

### Installation

1. **Download the project files** to your local machine

2. **Add your 3D model**:
   - Obtain a drone model in GLB format
   - Place it in the project directory as `drone.glb`
   - If you don't have a model, the site will generate a fallback drone

3. **Open the website**:
   - Option 1: Simply open `index.html` in a web browser
   - Option 2: For best results, use a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve
     
     # Using PHP
     php -S localhost:8000
     ```

4. **Access the site**:
   - Navigate to `http://localhost:8000` (or your chosen port)
   - The website should load with the interactive 3D drone

## Customization Guide

### Color Scheme

Edit the CSS variables in `style.css` to change the color scheme:

```css
:root {
    --primary-color: #ffffff;
    --secondary-color: #a3a3a3;
    --background-color: #0a0a0a;
    --accent-color: #00c2ff;      /* Main accent color */
    --accent-color-2: #ff00c8;    /* Secondary accent */
    --accent-color-3: #ffaa00;    /* Tertiary accent */
}
```

### Content Modification

Update the HTML sections to modify:

- Product features and descriptions
- Technical specifications
- Marketing copy and value propositions
- Call-to-action buttons and links

### 3D Model

Replace `drone.glb` with your own model. The site will automatically:

- Scale it appropriately (current scale: 3.5x)
- Add proper lighting and materials
- Set up animations and interactions

### Performance Optimization

If experiencing performance issues:

1. Reduce blur values in CSS:
   ```css
   header {
       backdrop-filter: blur(5px); /* Reduced from 10px */
   }
   ```

2. Lower particle count in JavaScript:
   ```javascript
   for (let i = 0; i < 75; i++) { /* Reduced from 150 */
   ```

## Technical Details

### 3D Implementation

The website uses Three.js for 3D rendering with:

- Perspective camera with responsive aspect ratio
- Multiple directional lights for realistic shading
- GLTFLoader for model loading with fallback
- Animation mixer for model animations
- Scroll-triggered camera movements

### Animation System

GSAP with ScrollTrigger creates seamless scroll-based animations:

- Section reveal effects with opacity and transform
- Parallax scrolling for depth perception
- Smooth camera movements synchronized with content
- Progressive animation of spec cards

### Responsive Design

Breakpoints implemented:

- **968px and below**: Tablet optimization
- **640px and below**: Mobile optimization

## Performance Notes

- The site uses a loading screen to ensure smooth initial experience
- 3D rendering automatically pauses when the tab is not active
- Blur effects are optimized for performance across devices
- Progressive loading of 3D assets with fallback

## Troubleshooting

### Common Issues

1. **3D model not loading**:
   - Check browser console for errors
   - Ensure model path is correct
   - Verify model is in GLB format

2. **Performance issues**:
   - Reduce blur values in CSS
   - Lower particle count in JavaScript
   - Close other demanding applications

3. **Scroll animations not working**:
   - Verify GSAP and ScrollTrigger are loaded
   - Check for JavaScript errors in console

### Browser-Specific Considerations

- **Safari**: May have reduced performance with heavy blur effects
- **Mobile**: Touch events may behave differently than mouse events
- **Older browsers**: Some features may fall back to simpler implementations

## Future Enhancements

Potential improvements for future versions:

- [ ] More interactive 3D controls (rotation, zoom)
- [ ] Product configurator with different drone models
- [ ] Video backgrounds showcasing drone footage
- [ ] E-commerce integration for pre-orders
- [ ] AR view using WebXR
- [ ] Multi-language support
- [ ] Advanced lighting scenarios (day/night toggle)

## License

This project is open source and available under the MIT License.

## Support

For technical issues:

1. Check the browser console for error messages
2. Verify all files are in the correct directory
3. Ensure you're using a supported browser
4. Test with a local server to avoid CORS issues

## Credits

- Three.js community for 3D rendering libraries
- GSAP for advanced animation capabilities
- Google Fonts for typography
