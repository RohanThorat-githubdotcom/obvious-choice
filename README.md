Obvious Choice - React Decision Card
A fun, interactive React application featuring a decision card with an evasive "reject" button that moves away from the cursor, making it impossible to click!
🎯 Features

Evasive Reject Button: The "No, Cancel" button smoothly moves away when you try to hover over it
Dark Theme: Beautiful gradient-based dark color palette
Smooth Animations: CSS transitions and cubic-bezier curves for natural movement
Responsive Design: Works on all screen sizes
Bootstrap 5: Latest version for modern styling
Modular Architecture: Clean component structure with separated utilities

🎨 Color Palette

Background: Deep navy gradients (#1a1a2e, #16213e)
Card: Dark blue gradients (#0f3460, #16213e)
Primary: Bright red (#e94560)
Success: Green tones (#00d084, #00a86b)
Accent: Purple-blue (#536dfe)

📁 Project Structure
impossible-choice/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── DecisionCard.jsx      # Main card component
│   │   └── DecisionCard.css      # Card styling
│   ├── utils/
│   │   └── positionUtils.js      # Position calculation utilities
│   ├── App.jsx                   # Root component
│   ├── App.css                   # Global app styles
│   ├── index.js                  # Entry point
│   └── index.css                 # Base styles
├── package.json
├── .gitignore
└── README.md
🚀 Setup Instructions
Prerequisites

Node.js: Version 20.x (LTS)
npm: Comes with Node.js

Step 1: Verify Node Version
bashnode --version
# Should output v20.x.x
If you don't have Node 20, install it:

Download from nodejs.org
Or use nvm:

bash  nvm install 20
  nvm use 20
Step 2: Navigate to Project Directory
bashcd impossible-choice
Step 3: Install Dependencies
bashnpm install
This will install:

React 18.2.0
React DOM 18.2.0
React Scripts 5.0.1
Bootstrap 5.3.2

Step 4: Start Development Server
bashnpm start
The app will automatically open in your browser at http://localhost:3000
📦 Available Scripts
npm start
Runs the app in development mode.
Open http://localhost:3000 to view it in your browser.
The page will reload when you make changes.
npm run build
Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.
npm test
Launches the test runner in interactive watch mode.
🎮 How It Works
Component Architecture

DecisionCard Component (DecisionCard.jsx)

Main interactive card component
Manages state for button position and confirmation status
Handles hover events and position calculations
Renders different views based on confirmation state


Position Utilities (positionUtils.js)

getRandomPosition(): Calculates new random positions for the reject button
Ensures minimum movement distance for better UX
Keeps button within card boundaries


Styling (DecisionCard.css)

Dark theme with gradient backgrounds
Smooth CSS transitions with cubic-bezier easing
Responsive breakpoints for mobile devices
Keyframe animations for success state



Key Features Implementation
Evasive Button Logic:

Uses onMouseEnter and onFocus events to detect cursor approach
Calculates card and button dimensions using refs
Generates random position within safe boundaries
Applies position via CSS transform: translate()

Smooth Movement:

CSS transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)
Cubic-bezier curve creates natural, bouncy motion
Transform property ensures GPU acceleration

🎨 Customization
Change Colors
Edit DecisionCard.css:
css.card-container {
  background: linear-gradient(135deg, #YOUR_COLOR_1, #YOUR_COLOR_2);
}
Adjust Button Evasiveness
Modify positionUtils.js:
javascriptconst minMovement = 150; // Increase for more evasive behavior
Change Animation Speed
Update DecisionCard.css:
css.reject-btn {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
🔧 Troubleshooting
Port Already in Use
If port 3000 is already in use:
bashPORT=3001 npm start
Dependencies Installation Fails
Try clearing npm cache:
bashnpm cache clean --force
npm install
Module Not Found Errors
Delete node_modules and reinstall:
bashrm -rf node_modules package-lock.json
npm install
📱 Browser Support

Chrome (latest)
Firefox (latest)
Safari (latest)
Edge (latest)

🤝 Contributing
Feel free to fork this project and customize it for your needs!
📄 License
This project is open source and available for educational purposes.
🎉 Have Fun!
Try to click that reject button... if you can! 😄ShareArtifactsDownload allQuick start guideDocument · MD ReadmeDocument · MD PackageCode · JSON IndexCode · HTML IndexCode · CSS AppCode · CSS IndexJS AppCode · JSX PositionutilsJS DecisioncardCode · CSS DecisioncardCode · JSX 