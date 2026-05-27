import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();
  const [noTransform, setNoTransform] = useState({ x: 0, y: 0 });
  const [noMessage, setNoMessage] = useState('');
  const noButtonRef = useRef(null);
  const containerRef = useRef(null);

  // Move the button to a random position within container bounds
  const moveNoButton = useCallback(() => {
    if (!noButtonRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const button = noButtonRef.current;
    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    // Available space inside container (consider padding)
    const padding = 16; // px
    const maxX = containerRect.width - buttonRect.width - padding * 2;
    const maxY = containerRect.height - buttonRect.height - padding * 2;

    // Ensure we have positive space, otherwise stay near center
    if (maxX <= 0 || maxY <= 0) {
      setNoTransform({ x: 0, y: 0 });
      return;
    }

    // Random position within bounds, with some margin from edges
    const randomX = Math.random() * (maxX + 40) - 20;
    const randomY = Math.random() * (maxY + 40) - 20;
    // Clamp to keep button inside container
    const clampedX = Math.min(Math.max(randomX, -padding), maxX + padding);
    const clampedY = Math.min(Math.max(randomY, -padding), maxY + padding);

    setNoTransform({ x: clampedX, y: clampedY });
  }, []);

  // Handle any interaction with the No button (click / touch / hover)
  const handleNoInteraction = () => {
    setNoMessage("Nice try! But my heart says Yes 💕 Click 'Yes' for a date!");
    moveNoButton();
    setTimeout(() => setNoMessage(''), 2000);
  };

  // Recalculate bounds on window resize
  useEffect(() => {
    window.addEventListener('resize', moveNoButton);
    return () => window.removeEventListener('resize', moveNoButton);
  }, [moveNoButton]);

  return (
    <>
      <Head>
        <title>Will you go on a date with me? 💖</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
      </Head>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card text-center" ref={containerRef}>
          <div className="mb-6 text-7xl animate-bounce">💌</div>
          <h1 className="text-3xl md:text-5xl font-bold text-rose-600 mb-4">
            Will you go on a date with me?
          </h1>
          <p className="text-gray-600 mb-8 px-2">My heart skips a beat when I think of you ✨</p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center min-h-[130px] relative">
            <button
              onClick={() => router.push('/planning')}
              className="btn-primary text-lg px-8 py-3 w-full sm:w-auto"
            >
              Yes! 😍
            </button>
            
            <button
              ref={noButtonRef}
              onClick={handleNoInteraction}
              onTouchStart={handleNoInteraction}  // for mobile touch
              onMouseEnter={moveNoButton}         // for desktop hover
              className="runaway-btn text-lg px-8 py-3 w-full sm:w-auto"
              style={{
                transform: `translate(${noTransform.x}px, ${noTransform.y}px)`,
                transition: 'transform 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                touchAction: 'manipulation', // improve tap response
              }}
            >
              No 😅
            </button>
          </div>
          
          {noMessage && (
            <div className="mt-4 text-rose-500 font-medium animate-pulse text-sm md:text-base">
              {noMessage}
            </div>
          )}
          
          <div className="mt-8 text-xs md:text-sm text-gray-500">
            💕 The 'No' button runs away – because the answer should be Yes! 💕
          </div>
        </div>
      </div>
    </>
  );
}