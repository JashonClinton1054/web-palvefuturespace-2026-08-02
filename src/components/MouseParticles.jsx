import { useEffect, useState, useRef } from "react";
import styled from "styled-components";

const ParticleCanvas = styled.canvas`
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 9998;
  @media (max-width:768px){
    display:none;
  }
`;

export default function MouseParticles() {
  const canvasRef = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 2 + 1;
        this.alpha = 0.6;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.decay = 0.012;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
        ctx.fill();
      }
    }

    const spawn = (e) => {
      particles.current.push(new Particle(e.clientX, e.clientY));
      // 限制最大粒子数量防止卡顿
      if (particles.current.length > 80) particles.current.shift();
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.update();
        p.draw();
        if (p.alpha <= 0) particles.current.splice(i, 1);
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", spawn);
    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });
    animate();

    return () => {
      window.removeEventListener("mousemove", spawn);
    };
  }, []);

  return <ParticleCanvas ref={canvasRef} />;
}