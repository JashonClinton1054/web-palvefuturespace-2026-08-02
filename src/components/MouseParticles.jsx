import { useEffect, useRef } from "react";
import styled from "styled-components";

const ParticleCanvas = styled.canvas`
  pointer-events: none; position: fixed; inset: 0; z-index: 9998;
  @media (max-width:768px), (pointer:coarse), (prefers-reduced-motion:reduce){display:none;}
`;

export default function MouseParticles() {
  const canvasRef = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion || window.innerWidth <= 768) return undefined;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return undefined;

    let frameId;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    class Particle {
      constructor(x, y) {
        this.x = x; this.y = y;
        this.radius = Math.random() * 2 + 1;
        this.alpha = 0.6;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
      }
      update() { this.x += this.vx; this.y += this.vy; this.alpha -= 0.012; }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
        ctx.fill();
      }
    }

    const spawn = (event) => {
      particles.current.push(new Particle(event.clientX, event.clientY));
      if (particles.current.length > 64) particles.current.shift();
    };
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let index = particles.current.length - 1; index >= 0; index -= 1) {
        const particle = particles.current[index];
        particle.update();
        particle.draw();
        if (particle.alpha <= 0) particles.current.splice(index, 1);
      }
      frameId = window.requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", spawn, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", spawn);
      window.removeEventListener("resize", resize);
      particles.current = [];
    };
  }, []);

  return <ParticleCanvas ref={canvasRef} aria-hidden="true" />;
}
