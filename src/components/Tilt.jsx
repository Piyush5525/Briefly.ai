import React, { useRef } from 'react';

// Pointer-driven 3D tilt with a moving glare. Pure CSS transforms; disabled for reduced motion.
export default function Tilt({ children, className = '', max = 10, as: Tag = 'div', ...rest }) {
  const ref = useRef(null);
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const move = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ref.current.style.setProperty('--rx', `${(0.5 - py) * max}deg`);
    ref.current.style.setProperty('--ry', `${(px - 0.5) * max}deg`);
    ref.current.style.setProperty('--gx', `${px * 100}%`);
    ref.current.style.setProperty('--gy', `${py * 100}%`);
  };
  const leave = () => {
    if (!ref.current) return;
    ['--rx', '--ry'].forEach((k) => ref.current.style.setProperty(k, '0deg'));
  };

  return (
    <Tag ref={ref} className={`tilt ${className}`} onPointerMove={move} onPointerLeave={leave} {...rest}>
      <span className="tilt-glare" aria-hidden="true" />
      {children}
    </Tag>
  );
}
