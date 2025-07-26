window.onload = function() {
  const bubbleContainer = document.querySelector('.bubbles');

  // Number of bubbles you want to create
  const numberOfBubbles = 30;

  for (let i = 0; i < numberOfBubbles; i++) {
    const bubble = document.createElement('span');
    
    // Randomly position the bubble
    const randomLeft = Math.random() * 100; // Random left percentage (0 to 100)
    const randomDuration = Math.random() * 10 + 5; // Random duration (5s to 15s)
    const randomSize = Math.random() * 20 + 20; // Random size (20px to 40px)
    
    // Apply random styles to the bubble
    bubble.style.left = `${randomLeft}%`;
    bubble.style.animationDuration = `${randomDuration}s`;
    bubble.style.width = `${randomSize}px`;
    bubble.style.height = `${randomSize}px`;

    // Append the bubble to the container
    bubbleContainer.appendChild(bubble);
  }
};
