import { useState, useRef, useEffect, useCallback } from 'react';
// import { getRandomPosition } from '../utils/positionUtils';
import MacBookIcon from '../assets/macbook.png';

const DecisionCard = () => {
  // const [rejectPosition, setRejectPosition] = useState({ x: 0, y: 0 });
  const rejectPosition = useRef({ x: 0, y: 0 });
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const rejectButtonRef = useRef(null);
  const wrapperRef = useRef(null);
  const cardRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [swapButton, setSwapButton] = useState(false);

  const handleRejectHover = (e) => {
    // if (hasConfirmed) return;

    console.log("Handling hover at: ", e.clientX, e.clientY)

    const card = cardRef.current;
    const wrapper = wrapperRef.current;

    if (!card || !wrapper) return;

    const cardRect = card.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    // Get cursor position relative to wrapper center
    const cursorX = e.clientX;
    const cursorY = e.clientY;
    const wrapperCenterX = wrapperRect.left + wrapperRect.width / 2;
    const wrapperCenterY = wrapperRect.top + wrapperRect.height / 2;

    // Calculate direction away from cursor
    const deltaX = wrapperCenterX - cursorX;
    const deltaY = wrapperCenterY - cursorY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Increased detection radius since we have 80px padding
    const detectionRadius = 200; // 80px wrapper padding + extra buffer
    console.log("Distance to cursor: ", distance)
    if (distance > detectionRadius) return;

    // Normalize direction
    const directionX = deltaX / distance;
    const directionY = deltaY / distance;

    // Calculate available space within the card (accounting for wrapper size)
    const maxX = cardRect.width - wrapperRect.width - 40;
    const maxY = cardRect.height - wrapperRect.height - 40;

    // Move wrapper away from cursor with speed matching cursor proximity
    // Closer cursor = faster movement
    const speedMultiplier = 1 - (distance / detectionRadius);
    const baseMove = 500; // Increased for more aggressive evasion
    const moveDistance = baseMove * (0.5 + speedMultiplier * 0.5);

    let newX = rejectPosition.current.x + directionX * moveDistance;
    let newY = rejectPosition.current.y + directionY * moveDistance;

    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

    let tryX = newX;
    let tryY = newY;

    // Check if desired move is out of bounds
    const isXBlocked = tryX < -maxX / 2 || tryX > maxX / 2;
    const isYBlocked = tryY < -maxY / 2 || tryY > maxY / 2;

    // If both valid → use directly
    if (!isXBlocked && !isYBlocked) {
      rejectPosition.current = { x: tryX, y: tryY };
    }
    // If X blocked → try only Y movement
    else if (isXBlocked && !isYBlocked) {
      rejectPosition.current = {
        x: clamp(rejectPosition.current.x, -maxX / 2, maxX / 2),
        y: tryY,
      };
    }
    // If Y blocked → try only X movement
    else if (!isXBlocked && isYBlocked) {
      rejectPosition.current = {
        x: tryX,
        y: clamp(rejectPosition.current.y, -maxY / 2, maxY / 2),
      };
    }
    // If both blocked → slide perpendicular (swap direction)
    else {
      const perpX = -directionY * moveDistance;
      const perpY = directionX * moveDistance;

      const altX = clamp(rejectPosition.current.x + perpX, -maxX / 2, maxX / 2);
      const altY = clamp(rejectPosition.current.y + perpY, -maxY / 2, maxY / 2);

      rejectPosition.current = { x: altX, y: altY };
    }

    wrapper.style.transform = `translate(${rejectPosition.current.x}px, ${rejectPosition.current.y}px)`;

  };

  const handleMouseMove = useCallback((e) => {
    if (hasConfirmed) return;

    console.log("Mouse is moving : ", e.clientX, e.clientY)

    // Cancel previous animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Use requestAnimationFrame for smooth 60fps updates
    animationFrameRef.current = requestAnimationFrame(() => {
      handleRejectHover(e);
    });
  }, [hasConfirmed, animationFrameRef]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    card.addEventListener('mousemove', handleMouseMove, { passive: true });
    // if (isHovering) {
    // }

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseMove]);

  const handleConfirm = () => {
    setHasConfirmed(true);
  };

  const handleReset = () => {
    setHasConfirmed(false);
    // setRejectPosition({ x: 0, y: 0 });
    rejectPosition.current = { x: 0, y: 0 };
  };

  return (
    <div className="card-container">
      <div className="decision-card" ref={cardRef}>
        {!hasConfirmed ? (
          <>
            <div className="card-content">
              <div className="card-icon">
                <img src={MacBookIcon} alt="Rohan" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
              </div>
              <h2 className="card-title">Am I The Greatest Developer You've Ever Met?</h2>
              <p className="card-text">
                Be honest now... 👨‍💻
              </p>
              <p className="card-subtext">
                {`// There's only one correct answer here`}
              </p>
            </div>

            <div className="button-container">
              <button
                className="btn btn-success confirm-btn"
                onClick={handleConfirm}
              >
                ✓ Obviously Yes
              </button>

              {!swapButton ? <div
                ref={wrapperRef}
                className="reject-button-wrapper"
                // style={{
                //   transform: `translate(${rejectPosition.x}px, ${rejectPosition.y}px)`,
                // }}
                onMouseEnter={(e) => {
                  // setIsHovering(true);
                  // handleRejectHover(e);
                }}
              // onMouseLeave={() => setIsHovering(false)}
              >
                <button
                  ref={rejectButtonRef}
                  className="btn btn-danger reject-btn"
                  onFocus={(e) => {
                    // setIsHovering(true);
                    // handleRejectHover(e);
                  }}
                // onBlur={() => setIsHovering(false)}
                onClick={() => setSwapButton(true)}
                >
                  ✗ Nah
                </button>
              </div>
              : <button
                className="btn btn-success confirm-btn"
                onClick={handleConfirm}
              >
                ✓ Obviously Yes
              </button>}
            </div>
          </>
        ) : (
          <div className="success-content">
            <div className="success-icon">😎</div>
            <h2 className="success-title">It's About Time You Admitted It!</h2>
            <p className="success-text">
              Took you long enough to recognize true genius. 🚀
            </p>
            <p className="success-text" style={{ fontSize: '0.95rem', fontStyle: 'italic', color: '#888' }}>
              Finally acknowledged the GOAT 🐐
            </p>
            <button
              className="btn btn-outline-light reset-btn"
              onClick={handleReset}
            >
              Stroke My Ego Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionCard;

// import { useState, useRef, useEffect } from "react";

// const DecisionCard = () => {
//   const [rejectPosition, setRejectPosition] = useState({ x: 0, y: 0 });
//   const [hasConfirmed, setHasConfirmed] = useState(false);
//   const [isHovering, setIsHovering] = useState(false);

//   const rejectButtonRef = useRef(null);
//   const wrapperRef = useRef(null);
//   const cardRef = useRef(null);
//   const animationFrameRef = useRef(null);

//   const currentPos = useRef({ x: 0, y: 0 });
//   const targetPos = useRef({ x: 0, y: 0 });

//   const DETECTION_RADIUS = 1000;
//   const SPEED_FACTOR = 0.25;

//   const handleRejectHover = (e) => {
//     if (hasConfirmed) return;

//     const card = cardRef.current;
//     const wrapper = wrapperRef.current;
//     if (!card || !wrapper) return;

//     const cardRect = card.getBoundingClientRect();
//     const wrapperRect = wrapper.getBoundingClientRect();

//     const cursorX = e.clientX;
//     const cursorY = e.clientY;

//     const wrapperCenterX = wrapperRect.left + wrapperRect.width / 2;
//     const wrapperCenterY = wrapperRect.top + wrapperRect.height / 2;

//     const dx = wrapperCenterX - cursorX;
//     const dy = wrapperCenterY - cursorY;
//     const distance = Math.sqrt(dx * dx + dy * dy);

//     if (distance < DETECTION_RADIUS) {
//       const directionX = dx / distance;
//       const directionY = dy / distance;

//       // Propose new target movement
//       let proposedX =
//         targetPos.current.x +
//         directionX * Math.min(DETECTION_RADIUS - distance, 20);
//       let proposedY =
//         targetPos.current.y +
//         directionY * Math.min(DETECTION_RADIUS - distance, 20);

//       // Compute card boundaries
//       const halfCardWidth = cardRect.width / 2 - wrapperRect.width / 2;
//       const halfCardHeight = cardRect.height / 2 - wrapperRect.height / 2;

//       // Apply boundary clamp
//       proposedX = Math.max(-halfCardWidth, Math.min(halfCardWidth, proposedX));
//       proposedY = Math.max(-halfCardHeight, Math.min(halfCardHeight, proposedY));

//       // Set target
//       targetPos.current.x = proposedX;
//       targetPos.current.y = proposedY;

//       // Keep state in sync
//       setRejectPosition({
//         x: proposedX,
//         y: proposedY,
//       });
//     }
//   };

//   const step = () => {
//     currentPos.current.x +=
//       (targetPos.current.x - currentPos.current.x) * SPEED_FACTOR;
//     currentPos.current.y +=
//       (targetPos.current.y - currentPos.current.y) * SPEED_FACTOR;

//     if (wrapperRef.current) {
//       wrapperRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px)`;
//     }

//     animationFrameRef.current = requestAnimationFrame(step);
//   };

//   useEffect(() => {
//     animationFrameRef.current = requestAnimationFrame(step);

//     return () => {
//       cancelAnimationFrame(animationFrameRef.current);
//     };
//   }, []);

//   const handleMouseMove = (e) => {
//     if (hasConfirmed || !isHovering) return;
//     handleRejectHover(e);
//   };

//   const handleConfirm = () => {
//     setHasConfirmed(true);
//   };

//   const handleReset = () => {
//     setHasConfirmed(false);
//     setRejectPosition({ x: 0, y: 0 });
//     currentPos.current = { x: 0, y: 0 };
//     targetPos.current = { x: 0, y: 0 };
//   };

//   return (
//     <div className="card-container">
//       <div className="decision-card" ref={cardRef}>
//         {!hasConfirmed ? (
//           <>
//             <div className="card-content">
//               <div className="card-icon">🎮</div>
//               <h2 className="card-title">
//                 Am I The Greatest Developer You've Ever Met?
//               </h2>
//               <p className="card-text">Be honest now... 👨‍💻</p>
//               <p className="card-subtext">// There's only one correct answer here</p>
//             </div>

//             <div className="button-container">
//               <button
//                 className="btn btn-success confirm-btn"
//                 onClick={handleConfirm}
//               >
//                 ✓ Obviously Yes
//               </button>

//               <div
//                 ref={wrapperRef}
//                 className="reject-button-wrapper"
//                 style={{
//                   transform: `translate(${rejectPosition.x}px, ${rejectPosition.y}px)`,
//                 }}
//                 onMouseEnter={(e) => {
//                   setIsHovering(true);
//                   handleRejectHover(e);
//                 }}
//                 onMouseLeave={() => setIsHovering(false)}
//                 onMouseMove={handleMouseMove}
//               >
//                 <button
//                   ref={rejectButtonRef}
//                   className="btn btn-danger reject-btn"
//                 >
//                   ✗ Nah
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="success-content">
//             <div className="success-icon">😎</div>
//             <h2 className="success-title">
//               It's About Time You Admitted It!
//             </h2>
//             <p className="success-text">
//               Took you long enough to recognize true genius. 🚀
//             </p>
//             <p
//               className="success-text"
//               style={{
//                 fontSize: "0.95rem",
//                 fontStyle: "italic",
//                 color: "#888",
//               }}
//             >
//               Finally acknowledged the GOAT 🐐
//             </p>
//             <button
//               className="btn btn-outline-light reset-btn"
//               onClick={handleReset}
//             >
//               Stroke My Ego Again
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DecisionCard;

// import { useEffect, useRef, useState } from "react";

// const DecisionCard = () => {
//   const [hasConfirmed, setHasConfirmed] = useState(false);

//   const wrapperRef = useRef(null);
//   const cardRef = useRef(null);
//   const animationFrameRef = useRef(null);

//   // current and target positions
//   const currentPos = useRef({ x: 0, y: 0 });
//   const targetPos = useRef({ x: 0, y: 0 });
//   const cursorPos = useRef({ x: 0, y: 0 });

//   const MIN_DISTANCE = 200; // desired minimum gap
//   const SPEED = 0.28;       // animation smoothing

//   const handleMouseMoveGlobal = (e) => {
//     cursorPos.current = { x: e.clientX, y: e.clientY };
//   };

//   const animate = () => {
//     const wrapper = wrapperRef.current;
//     const card = cardRef.current;
//     if (wrapper && card) {
//       const cardRect = card.getBoundingClientRect();
//       const wrapperRect = wrapper.getBoundingClientRect();

//       const centerX = wrapperRect.left + wrapperRect.width / 2;
//       const centerY = wrapperRect.top + wrapperRect.height / 2;

//       const dx = centerX - cursorPos.current.x;
//       const dy = centerY - cursorPos.current.y;
//       const dist = Math.sqrt(dx * dx + dy * dy);

//       // if cursor is too close, recalc target
//       if (dist < MIN_DISTANCE) {
//         const directionX = dx / dist;
//         const directionY = dy / dist;

//         const desiredX = cursorPos.current.x + directionX * MIN_DISTANCE;
//         const desiredY = cursorPos.current.y + directionY * MIN_DISTANCE;

//         const newTargetX =
//           desiredX - (cardRect.left + cardRect.width / 2);
//         const newTargetY =
//           desiredY - (cardRect.top + cardRect.height / 2);

//         const halfW = cardRect.width / 2 - wrapperRect.width / 2;
//         const halfH = cardRect.height / 2 - wrapperRect.height / 2;

//         targetPos.current.x = Math.max(
//           -halfW,
//           Math.min(halfW, newTargetX)
//         );
//         targetPos.current.y = Math.max(
//           -halfH,
//           Math.min(halfH, newTargetY)
//         );
//       }

//       currentPos.current.x +=
//         (targetPos.current.x - currentPos.current.x) * SPEED;
//       currentPos.current.y +=
//         (targetPos.current.y - currentPos.current.y) * SPEED;

//       wrapper.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px)`;
//     }
//     animationFrameRef.current = requestAnimationFrame(animate);
//   };

//   useEffect(() => {
//     window.addEventListener("mousemove", handleMouseMoveGlobal);
//     animationFrameRef.current = requestAnimationFrame(animate);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMoveGlobal);
//       cancelAnimationFrame(animationFrameRef.current);
//     };
//   }, []);

//   const handleConfirm = () => setHasConfirmed(true);

//   const handleReset = () => {
//     setHasConfirmed(false);
//     currentPos.current = { x: 0, y: 0 };
//     targetPos.current = { x: 0, y: 0 };
//     cursorPos.current = { x: 0, y: 0 };
//   };

//   return (
//     <div className="card-container">
//       <div className="decision-card" ref={cardRef}>
//         {!hasConfirmed ? (
//           <>
//             <div className="card-content">
//               <div className="card-icon">🎮</div>
//               <h2 className="card-title">
//                 Am I The Greatest Developer You've Ever Met?
//               </h2>
//               <p className="card-text">Be honest now... 👨‍💻</p>
//               <p className="card-subtext">// There's only one correct answer here</p>
//             </div>

//             <div className="button-container">
//               <button
//                 className="btn btn-success confirm-btn"
//                 onClick={handleConfirm}
//               >
//                 ✓ Obviously Yes
//               </button>

//               <div
//                 ref={wrapperRef}
//                 className="reject-button-wrapper"
//                 style={{ transform: `translate(0px, 0px)` }}
//               >
//                 <button
//                   // ref={rejectButtonRef}
//                   className="btn btn-danger reject-btn"
//                 >
//                   ✗ Nah
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="success-content">
//             <div className="success-icon">😎</div>
//             <h2 className="success-title">
//               It's About Time You Admitted It!
//             </h2>
//             <p className="success-text">Took you long enough to recognize true genius. 🚀</p>
//             <button
//               className="btn btn-outline-light reset-btn"
//               onClick={handleReset}
//             >
//               Stroke My Ego Again
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DecisionCard;
