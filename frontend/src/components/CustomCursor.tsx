import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;
        if (!cursor || !follower) return;

        const moveCursor = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power2.out',
            });
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3,
                ease: 'power2.out',
            });
        };

        const handleMouseEnter = () => {
            gsap.to(cursor, { scale: 0.5, opacity: 0.5, duration: 0.3 });
            gsap.to(follower, { scale: 1.5, opacity: 1, duration: 0.3 });
        };

        const handleMouseLeave = () => {
            gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
            gsap.to(follower, { scale: 1, opacity: 0.5, duration: 0.3 });
        };

        window.addEventListener('mousemove', moveCursor);

        const interactiveElements = document.querySelectorAll(
            'a, button, [role="button"], input, textarea, select'
        );
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            interactiveElements.forEach((el) => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, []);

    return (
        <>
            {/* Inner dot */}
            <div
                ref={cursorRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#00ffff',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff',
                    mixBlendMode: 'difference',
                }}
            />
            {/* Outer ring (follower) */}
            <div
                ref={followerRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '2px solid rgba(0, 255, 255, 0.5)',
                    pointerEvents: 'none',
                    zIndex: 9998,
                    transform: 'translate(-50%, -50%)',
                    opacity: 0.5,
                    mixBlendMode: 'difference',
                }}
            />
        </>
    );
};

export default CustomCursor;
