// ===== IMAGE DEFINITIONS =====
// All images are drawn procedurally using Canvas API

const PUZZLE_IMAGES = [
  {
    id: 'sunset',
    name: '🌅 Sunset',
    draw: (ctx, w, h) => {
      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.65);
      sky.addColorStop(0, '#1a1a4e');
      sky.addColorStop(0.4, '#c0392b');
      sky.addColorStop(0.7, '#e67e22');
      sky.addColorStop(1, '#f39c12');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h * 0.65);

      // Sun
      const sunY = h * 0.55;
      const sunGlow = ctx.createRadialGradient(w/2, sunY, 0, w/2, sunY, w*0.25);
      sunGlow.addColorStop(0, '#fff176');
      sunGlow.addColorStop(0.3, '#ffd54f');
      sunGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#fff9c4';
      ctx.beginPath(); ctx.arc(w/2, sunY, w*0.1, 0, Math.PI*2); ctx.fill();

      // Water
      const water = ctx.createLinearGradient(0, h*0.65, 0, h);
      water.addColorStop(0, '#1565c0');
      water.addColorStop(1, '#0d47a1');
      ctx.fillStyle = water;
      ctx.fillRect(0, h*0.65, w, h*0.35);

      // Reflection
      ctx.fillStyle = 'rgba(255,200,50,0.3)';
      ctx.fillRect(w*0.35, h*0.65, w*0.3, h*0.35);

      // Waves
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, h*0.7 + i*12);
        ctx.bezierCurveTo(w*0.25, h*0.69 + i*12, w*0.75, h*0.71 + i*12, w, h*0.7 + i*12);
        ctx.stroke();
      }

      // Horizon mountain silhouette
      ctx.fillStyle = '#1a1a2e';
      ctx.beginPath(); ctx.moveTo(0, h*0.65); ctx.lineTo(w*0.15, h*0.45); ctx.lineTo(w*0.3, h*0.65); ctx.fill();
      ctx.beginPath(); ctx.moveTo(w*0.55, h*0.65); ctx.lineTo(w*0.72, h*0.38); ctx.lineTo(w*0.9, h*0.65); ctx.fill();
    }
  },
  {
    id: 'forest',
    name: '🌲 Hutan',
    draw: (ctx, w, h) => {
      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, h*0.5);
      sky.addColorStop(0, '#87ceeb'); sky.addColorStop(1, '#b0e0e6');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h*0.5);

      // Ground
      const ground = ctx.createLinearGradient(0, h*0.5, 0, h);
      ground.addColorStop(0, '#4caf50'); ground.addColorStop(1, '#2e7d32');
      ctx.fillStyle = ground; ctx.fillRect(0, h*0.5, w, h*0.5);

      // Clouds
      const drawCloud = (cx, cy, r) => {
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx+r*0.8, cy+r*0.2, r*0.7, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx-r*0.7, cy+r*0.2, r*0.6, 0, Math.PI*2); ctx.fill();
      };
      drawCloud(w*0.2, h*0.15, w*0.07);
      drawCloud(w*0.7, h*0.1, w*0.09);

      // Trees
      const drawTree = (x, baseY, scale) => {
        const tw = w*0.06*scale, th = h*0.28*scale;
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(x - tw*0.15, baseY - th*0.3, tw*0.3, th*0.35);
        ctx.fillStyle = '#1b5e20';
        ctx.beginPath(); ctx.moveTo(x, baseY - th); ctx.lineTo(x - tw, baseY - th*0.4); ctx.lineTo(x + tw, baseY - th*0.4); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#2e7d32';
        ctx.beginPath(); ctx.moveTo(x, baseY - th*1.25); ctx.lineTo(x - tw*0.75, baseY - th*0.6); ctx.lineTo(x + tw*0.75, baseY - th*0.6); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#43a047';
        ctx.beginPath(); ctx.moveTo(x, baseY - th*1.45); ctx.lineTo(x - tw*0.5, baseY - th*0.8); ctx.lineTo(x + tw*0.5, baseY - th*0.8); ctx.closePath(); ctx.fill();
      };
      drawTree(w*0.1, h*0.75, 1.2);
      drawTree(w*0.85, h*0.72, 1.3);
      drawTree(w*0.5, h*0.7, 1.5);
      drawTree(w*0.28, h*0.8, 0.9);
      drawTree(w*0.68, h*0.78, 1.1);

      // Path
      ctx.fillStyle = '#8d6e63';
      ctx.beginPath(); ctx.moveTo(w*0.38, h); ctx.lineTo(w*0.62, h); ctx.lineTo(w*0.54, h*0.5); ctx.lineTo(w*0.46, h*0.5); ctx.closePath(); ctx.fill();
    }
  },
  {
    id: 'ocean',
    name: '🌊 Lautan',
    draw: (ctx, w, h) => {
      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, h*0.45);
      sky.addColorStop(0, '#0d47a1'); sky.addColorStop(1, '#42a5f5');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h*0.45);

      // Stars/sun
      ctx.fillStyle = '#fff9c4';
      ctx.beginPath(); ctx.arc(w*0.75, h*0.12, w*0.06, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(255,249,196,0.4)';
      ctx.beginPath(); ctx.arc(w*0.75, h*0.12, w*0.12, 0, Math.PI*2); ctx.fill();

      // Ocean layers
      const waveColors = ['#0288d1','#0277bd','#01579b','#014f86','#013a63'];
      waveColors.forEach((c, i) => {
        ctx.fillStyle = c;
        const y = h*0.45 + i*h*0.11;
        ctx.fillRect(0, y, w, h*0.12);
        // Wave crests
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath();
        for (let x = 0; x < w; x += w*0.25) {
          ctx.moveTo(x, y);
          ctx.bezierCurveTo(x+w*0.06, y-h*0.015, x+w*0.12, y-h*0.015, x+w*0.25, y);
        }
        ctx.lineTo(w, y+3); ctx.lineTo(0, y+3); ctx.closePath(); ctx.fill();
      });

      // Boat
      const bx = w*0.35, by = h*0.48;
      ctx.fillStyle = '#5d4037';
      ctx.beginPath(); ctx.moveTo(bx-w*0.12, by); ctx.lineTo(bx+w*0.12, by); ctx.lineTo(bx+w*0.08, by+h*0.04); ctx.lineTo(bx-w*0.08, by+h*0.04); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#e53935';
      ctx.beginPath(); ctx.moveTo(bx, by-h*0.1); ctx.lineTo(bx+w*0.1, by); ctx.lineTo(bx, by); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#4e342e'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(bx, by-h*0.12); ctx.lineTo(bx, by+h*0.04); ctx.stroke();
    }
  },
  {
    id: 'mountain',
    name: '⛰️ Gunung',
    draw: (ctx, w, h) => {
      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, h*0.6);
      sky.addColorStop(0, '#1565c0'); sky.addColorStop(1, '#90caf9');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);

      // Far mountains (blue)
      ctx.fillStyle = '#5c6bc0';
      ctx.beginPath(); ctx.moveTo(0, h*0.65); ctx.lineTo(w*0.2, h*0.3); ctx.lineTo(w*0.4, h*0.65); ctx.fill();
      ctx.beginPath(); ctx.moveTo(w*0.3, h*0.65); ctx.lineTo(w*0.55, h*0.25); ctx.lineTo(w*0.8, h*0.65); ctx.fill();
      ctx.beginPath(); ctx.moveTo(w*0.6, h*0.65); ctx.lineTo(w*0.85, h*0.35); ctx.lineTo(w, h*0.65); ctx.fill();

      // Snow caps
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath(); ctx.moveTo(w*0.2, h*0.3); ctx.lineTo(w*0.15, h*0.42); ctx.lineTo(w*0.25, h*0.42); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(w*0.55, h*0.25); ctx.lineTo(w*0.48, h*0.38); ctx.lineTo(w*0.62, h*0.38); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(w*0.85, h*0.35); ctx.lineTo(w*0.8, h*0.46); ctx.lineTo(w*0.9, h*0.46); ctx.closePath(); ctx.fill();

      // Foreground mountain (dark)
      ctx.fillStyle = '#37474f';
      ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(0, h*0.7); ctx.lineTo(w*0.35, h*0.38); ctx.lineTo(w*0.7, h*0.65); ctx.lineTo(w, h*0.55); ctx.lineTo(w, h); ctx.closePath(); ctx.fill();

      // Front snow cap
      ctx.fillStyle = 'white';
      ctx.beginPath(); ctx.moveTo(w*0.35, h*0.38); ctx.lineTo(w*0.27, h*0.55); ctx.lineTo(w*0.43, h*0.55); ctx.closePath(); ctx.fill();

      // Ground/grass
      ctx.fillStyle = '#388e3c';
      ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(0, h*0.88); ctx.quadraticCurveTo(w*0.5, h*0.75, w, h*0.82); ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
    }
  },
  {
    id: 'city',
    name: '🏙️ Kota',
    draw: (ctx, w, h) => {
      // Night sky
      ctx.fillStyle = '#0a0a2e'; ctx.fillRect(0, 0, w, h);

      // Stars
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      const stars = [[0.1,0.05],[0.25,0.12],[0.45,0.04],[0.6,0.09],[0.78,0.06],[0.9,0.14],[0.15,0.2],[0.55,0.18],[0.85,0.22]];
      stars.forEach(([sx,sy]) => {
        ctx.beginPath(); ctx.arc(w*sx, h*sy, 1.2, 0, Math.PI*2); ctx.fill();
      });

      // Moon
      ctx.fillStyle = '#fff9c4';
      ctx.beginPath(); ctx.arc(w*0.82, h*0.12, w*0.055, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#0a0a2e';
      ctx.beginPath(); ctx.arc(w*0.84, h*0.1, w*0.045, 0, Math.PI*2); ctx.fill();

      // Buildings - back layer
      const buildBg = (x, bw, bh, wc, wgx, wgy) => {
        ctx.fillStyle = '#1a237e';
        ctx.fillRect(x, h - bh, bw, bh);
        ctx.fillStyle = wc;
        for (let wy = h - bh + 6; wy < h - 4; wy += wgy) {
          for (let wx = x + 4; wx < x + bw - 4; wx += wgx) {
            ctx.fillRect(wx, wy, wgx - 2, wgy - 2);
          }
        }
      };
      buildBg(0, w*0.18, h*0.55, 'rgba(255,235,59,0.4)', 8, 10);
      buildBg(w*0.15, w*0.12, h*0.42, 'rgba(100,181,246,0.4)', 7, 9);
      buildBg(w*0.55, w*0.2, h*0.6, 'rgba(255,235,59,0.4)', 8, 10);
      buildBg(w*0.72, w*0.15, h*0.45, 'rgba(100,181,246,0.4)', 7, 9);
      buildBg(w*0.85, w*0.15, h*0.5, 'rgba(255,235,59,0.3)', 8, 10);

      // Main building
      ctx.fillStyle = '#263238';
      ctx.fillRect(w*0.3, h*0.25, w*0.28, h*0.75);
      ctx.fillStyle = 'rgba(255,235,59,0.6)';
      for (let wy = h*0.28; wy < h - 4; wy += 12) {
        for (let wx = w*0.33; wx < w*0.55; wx += 10) {
          ctx.fillRect(wx, wy, 7, 8);
        }
      }

      // Road
      ctx.fillStyle = '#212121'; ctx.fillRect(0, h*0.85, w, h*0.15);
      ctx.fillStyle = '#ffd600';
      for (let x = 0; x < w; x += w*0.12) { ctx.fillRect(x, h*0.92, w*0.07, 3); }
    }
  },
  {
    id: 'sakura',
    name: '🌸 Sakura',
    draw: (ctx, w, h) => {
      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#fce4ec'); bg.addColorStop(1, '#f8bbd9');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

      // Ground
      ctx.fillStyle = '#a5d6a7';
      ctx.beginPath(); ctx.ellipse(w/2, h*0.92, w*0.6, h*0.12, 0, 0, Math.PI*2); ctx.fill();

      // Tree trunk
      ctx.strokeStyle = '#5d4037'; ctx.lineWidth = w*0.025;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(w*0.5, h*0.9); ctx.bezierCurveTo(w*0.5, h*0.65, w*0.48, h*0.5, w*0.45, h*0.35); ctx.stroke();
      ctx.lineWidth = w*0.015;
      ctx.beginPath(); ctx.moveTo(w*0.47, h*0.6); ctx.bezierCurveTo(w*0.35, h*0.5, w*0.28, h*0.45, w*0.22, h*0.38); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w*0.49, h*0.5); ctx.bezierCurveTo(w*0.6, h*0.42, w*0.68, h*0.4, w*0.75, h*0.35); ctx.stroke();

      // Blossom clusters
      const drawBlossom = (cx, cy, r, count) => {
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const bx = cx + Math.cos(angle) * r * 0.5;
          const by = cy + Math.sin(angle) * r * 0.5;
          ctx.fillStyle = `rgba(244,114,182,${0.5 + Math.random()*0.4})`;
          ctx.beginPath(); ctx.arc(bx, by, r*0.38, 0, Math.PI*2); ctx.fill();
        }
        ctx.fillStyle = 'rgba(252,231,243,0.8)';
        ctx.beginPath(); ctx.arc(cx, cy, r*0.45, 0, Math.PI*2); ctx.fill();
      };
      drawBlossom(w*0.45, h*0.32, w*0.15, 8);
      drawBlossom(w*0.25, h*0.35, w*0.1, 6);
      drawBlossom(w*0.7, h*0.3, w*0.12, 7);
      drawBlossom(w*0.55, h*0.22, w*0.09, 5);

      // Falling petals
      const petals = [[0.15,0.55],[0.35,0.45],[0.62,0.52],[0.8,0.42],[0.25,0.68],[0.55,0.7],[0.72,0.65]];
      petals.forEach(([px, py]) => {
        ctx.fillStyle = 'rgba(244,114,182,0.7)';
        ctx.save(); ctx.translate(w*px, h*py); ctx.rotate(Math.random()*Math.PI);
        ctx.beginPath(); ctx.ellipse(0, 0, 5, 3, 0, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      });
    }
  },
  {
    id: 'space',
    name: '🚀 Luar Angkasa',
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#000014'; ctx.fillRect(0, 0, w, h);

      // Nebula background
      const neb = ctx.createRadialGradient(w*0.3, h*0.4, 0, w*0.3, h*0.4, w*0.5);
      neb.addColorStop(0, 'rgba(88,40,120,0.6)'); neb.addColorStop(1, 'transparent');
      ctx.fillStyle = neb; ctx.fillRect(0, 0, w, h);
      const neb2 = ctx.createRadialGradient(w*0.7, h*0.6, 0, w*0.7, h*0.6, w*0.4);
      neb2.addColorStop(0, 'rgba(20,60,120,0.5)'); neb2.addColorStop(1, 'transparent');
      ctx.fillStyle = neb2; ctx.fillRect(0, 0, w, h);

      // Stars
      for (let i = 0; i < 80; i++) {
        const sx = Math.random()*w, sy = Math.random()*h;
        const sr = Math.random()*1.5 + 0.3;
        ctx.fillStyle = `rgba(255,255,255,${0.4 + Math.random()*0.6})`;
        ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI*2); ctx.fill();
      }

      // Planet
      const pg = ctx.createRadialGradient(w*0.65, h*0.25, 0, w*0.65, h*0.28, w*0.18);
      pg.addColorStop(0, '#ef9a9a'); pg.addColorStop(0.5, '#e57373'); pg.addColorStop(1, '#b71c1c');
      ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(w*0.65, h*0.28, w*0.16, 0, Math.PI*2); ctx.fill();
      // Ring
      ctx.strokeStyle = 'rgba(255,204,128,0.7)'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.ellipse(w*0.65, h*0.28, w*0.26, h*0.05, -0.3, 0, Math.PI*2); ctx.stroke();

      // Rocket
      const rx = w*0.25, ry = h*0.55;
      ctx.save(); ctx.translate(rx, ry); ctx.rotate(-0.4);
      ctx.fillStyle = '#eceff1';
      ctx.beginPath(); ctx.moveTo(0, -h*0.1); ctx.lineTo(w*0.04, h*0.05); ctx.lineTo(-w*0.04, h*0.05); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ef5350';
      ctx.beginPath(); ctx.arc(0, -h*0.1, w*0.025, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#1565c0';
      ctx.fillRect(-w*0.015, -h*0.04, w*0.03, h*0.04);
      ctx.fillStyle = 'rgba(255,171,64,0.8)';
      ctx.beginPath(); ctx.moveTo(-w*0.02, h*0.05); ctx.lineTo(w*0.02, h*0.05); ctx.lineTo(0, h*0.12); ctx.closePath(); ctx.fill();
      ctx.restore();

      // Shooting star
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(w*0.1, h*0.15); ctx.lineTo(w*0.35, h*0.08); ctx.stroke();
    }
  },
  {
    id: 'abstract',
    name: '🎨 Abstrak',
    draw: (ctx, w, h) => {
      // Background
      ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0, 0, w, h);

      // Circles
      const circles = [
        { x:0.2, y:0.3, r:0.25, c1:'#6c63ff', c2:'transparent' },
        { x:0.75, y:0.6, r:0.3, c1:'#ff6584', c2:'transparent' },
        { x:0.5, y:0.8, r:0.2, c1:'#43e97b', c2:'transparent' },
        { x:0.1, y:0.75, r:0.15, c1:'#f9ca24', c2:'transparent' },
        { x:0.85, y:0.2, r:0.18, c1:'#00cec9', c2:'transparent' },
      ];
      circles.forEach(({ x, y, r, c1 }) => {
        const g = ctx.createRadialGradient(w*x, h*y, 0, w*x, h*y, w*r);
        g.addColorStop(0, c1.replace(')', ',0.4)').replace('rgb', 'rgba'));
        g.addColorStop(0.5, c1.replace(')', ',0.2)').replace('rgb', 'rgba'));
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = c1; ctx.lineWidth = 2; ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.arc(w*x, h*y, w*r, 0, Math.PI*2); ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // Lines
      const lineColors = ['#6c63ff','#ff6584','#43e97b','#f9ca24'];
      for (let i = 0; i < 8; i++) {
        ctx.strokeStyle = lineColors[i % lineColors.length];
        ctx.lineWidth = 1; ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(Math.random()*w, Math.random()*h);
        ctx.lineTo(Math.random()*w, Math.random()*h);
        ctx.stroke(); ctx.globalAlpha = 1;
      }

      // Triangles
      const tris = [[0.5,0.1,0.35],[0.15,0.5,0.2],[0.8,0.4,0.15]];
      tris.forEach(([tx, ty, tr], i) => {
        ctx.strokeStyle = lineColors[i];
        ctx.lineWidth = 2; ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(w*tx, h*ty - h*tr);
        ctx.lineTo(w*tx + w*tr, h*ty + h*tr*0.5);
        ctx.lineTo(w*tx - w*tr, h*ty + h*tr*0.5);
        ctx.closePath(); ctx.stroke(); ctx.globalAlpha = 1;
      });
    }
  }
];
