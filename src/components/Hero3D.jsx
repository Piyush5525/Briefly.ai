import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Floating 3D "briefing sheets" + drifting dust, reacting to pointer and scroll.
function sheetTexture(i) {
  const w = 512, h = 680;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.fillStyle = '#fbf6ec';
  g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(18,37,74,.25)';
  g.lineWidth = 4;
  g.strokeRect(2, 2, w - 4, h - 4);
  const chips = [['VERIFIED', '#1f7a4d'], ['COMPANY-STATED', '#2f5fa8'], ['SINGLE SOURCE', '#b7791f'], ['VERIFIED', '#1f7a4d']];
  const [label, col] = chips[i % chips.length];
  g.fillStyle = '#12254a';
  g.font = '700 44px "Jersey 93", Impact, sans-serif';
  g.fillText(['FUNDING', 'LEADERSHIP', 'PRODUCT', 'PARTNERS'][i % 4], 36, 80);
  g.fillStyle = col;
  g.fillRect(36, 110, 22 + label.length * 14, 34);
  g.fillStyle = '#fff';
  g.font = '600 20px Inter, sans-serif';
  g.fillText(label, 48, 134);
  g.fillStyle = 'rgba(18,37,74,.75)';
  for (let r = 0; r < 9; r++) {
    const wd = 440 - ((r * 53 + i * 37) % 160);
    g.fillRect(36, 186 + r * 40, wd, 12);
  }
  g.fillStyle = '#2f5fa8';
  g.fillRect(36, 570, 120, 12);
  g.fillRect(36, 600, 220, 12);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export default function Hero3D() {
  const mount = useRef(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch {
      return undefined; // WebGL unavailable: the hero still works without the 3D layer.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    const group = new THREE.Group();
    scene.add(group);

    const geo = new THREE.PlaneGeometry(2.1, 2.8);
    const sheets = [];
    const layout = [
      [-7.4, -1.6, 0.5, -0.35, 0.25], [-5.6, -3.6, 1.2, 0.25, -0.2], [7.4, -1.0, 0.8, 0.35, -0.2],
      [5.6, -3.6, 1.2, -0.25, 0.15], [-7.6, 1.8, -1.5, 0.45, 0.3], [7.8, 2.2, -1.2, -0.4, -0.3],
    ];
    layout.forEach(([x, y, z, ry, rz], i) => {
      const tex = sheetTexture(i);
      const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true, opacity: 0.96 });
      const m = new THREE.Mesh(geo, mat);
      // soft shadow card behind for depth
      const sh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x12254a, transparent: true, opacity: 0.12 }));
      sh.position.set(0.14, -0.16, -0.06);
      m.add(sh);
      m.position.set(x, y, z);
      m.rotation.set(0.1, ry, rz);
      m.userData = { x, y, z, ry, rz, ph: i * 1.3 };
      group.add(m);
      sheets.push(m);
    });

    const N = 140;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 24; pos[i * 3 + 1] = (Math.random() - 0.5) * 12; pos[i * 3 + 2] = (Math.random() - 0.5) * 10; }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.07, transparent: true, opacity: 0.8, depthWrite: false }));
    scene.add(dust);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => { mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2; mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2; };
    let scrollY = 0;
    const onScroll = () => { scrollY = Math.min(window.scrollY / window.innerHeight, 1.2); };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      group.visible = w > 760; // sheets would crowd the copy on small screens; dust remains
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let raf;
    const clock = new THREE.Clock();
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(el);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = clock.getElapsedTime();
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      group.rotation.y = mouse.x * 0.18;
      group.rotation.x = mouse.y * 0.08;
      sheets.forEach((m) => {
        const d = m.userData;
        m.position.y = d.y + Math.sin(t * 0.7 + d.ph) * 0.22 + scrollY * 1.4;
        m.position.x = d.x + mouse.x * 0.25 * (d.z + 2);
        m.rotation.y = d.ry + Math.sin(t * 0.5 + d.ph) * 0.12 + scrollY * 0.5;
        m.rotation.z = d.rz + Math.cos(t * 0.4 + d.ph) * 0.04;
      });
      dust.rotation.y = t * 0.02 + mouse.x * 0.05;
      dust.position.y = scrollY * 1.2;
      renderer.render(scene, camera);
    };
    if (reduce) { renderer.render(scene, camera); } else frame();
    // Re-render once fonts are ready so the sheet headings use the supplied heading font.
    document.fonts?.ready.then(() => { sheets.forEach((m, i) => { m.material.map.dispose(); m.material.map = sheetTexture(i); }); if (reduce) renderer.render(scene, camera); });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      sheets.forEach((m) => { m.material.map?.dispose(); m.material.dispose(); });
      geo.dispose(); pg.dispose(); renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="hero3d" ref={mount} aria-hidden="true" />;
}
