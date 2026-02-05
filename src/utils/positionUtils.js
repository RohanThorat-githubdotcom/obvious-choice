/**
 * Generates a random position for the reject button to move to
 * Ensures the button stays within the card boundaries
 * @param {number} maxX - Maximum X coordinate
 * @param {number} maxY - Maximum Y coordinate
 * @param {object} currentPosition - Current button position
 * @returns {object} New position with x and y coordinates
 */
export const getRandomPosition = (maxX, maxY, currentPosition) => {
  // Ensure minimum movement of 100px to make it feel more evasive
  const minMovement = 100;
  
  let newX, newY;
  let attempts = 0;
  const maxAttempts = 100000;
  
  do {
    // Generate random position within bounds
    newX = Math.random() * maxX - maxX / 2;
    newY = Math.random() * maxY - maxY / 2;
    
    // Calculate distance from current position
    const distance = Math.sqrt(
      Math.pow(newX - currentPosition.x, 2) + 
      Math.pow(newY - currentPosition.y, 2)
    );
    
    // If distance is sufficient or we've tried too many times, use this position
    if (distance >= minMovement || attempts >= maxAttempts) {
      break;
    }
    
    attempts++;
  } while (attempts < maxAttempts);
  
  return { x: newX, y: newY };
};

/**
 * Calculates distance between two points
 * @param {object} point1 - First point with x and y
 * @param {object} point2 - Second point with x and y
 * @returns {number} Distance between points
 */
export const calculateDistance = (point1, point2) => {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + 
    Math.pow(point2.y - point1.y, 2)
  );
};