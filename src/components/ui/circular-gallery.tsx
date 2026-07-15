"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface GalleryItem {
  image: string;
  text: string;
  focalX?: number;
  focalY?: number;
}

interface CircularGalleryProps {
  items: GalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  font = "bold 30px DM Sans",
  scrollSpeed = 2,
  scrollEase = 0.05,
}: CircularGalleryProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    scroll: 0,
    targetScroll: 0,
    isDragging: false,
    lastX: 0,
    velocity: 0,
    animId: 0,
    images: [] as HTMLImageElement[],
    loaded: 0,
  });
  const [ready, setReady] = useState(false);

  const loadImages = useCallback(() => {
    const state = stateRef.current;
    state.images = [];
    state.loaded = 0;
    items.forEach((item, i) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        state.loaded++;
        if (state.loaded === items.length) setReady(true);
      };
      img.onerror = () => {
        state.loaded++;
        if (state.loaded === items.length) setReady(true);
      };
      img.src = item.image;
      state.images[i] = img;
    });
  }, [items]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = stateRef.current;

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const ITEM_W = Math.min(canvas.width * 0.38, 380);
    const ITEM_H = ITEM_W * 0.65;
    const GAP = 24;
    const TOTAL_W = (ITEM_W + GAP) * items.length;

    function draw() {
      const w = canvas!.width;
      const h = canvas!.height;
      ctx!.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const radius = bend > 0 ? (w * 2) / bend : Infinity;

      items.forEach((item, i) => {
        const rawX = (i * (ITEM_W + GAP)) - state.scroll + (w - ITEM_W) / 2;
        const normX = (rawX + ITEM_W / 2 - cx) / (w / 2);

        let yOffset = 0;
        let scale = 1;
        if (isFinite(radius)) {
          yOffset = -(normX * normX) * (h / (radius / (ITEM_H * 0.5)));
          scale = 1 - Math.abs(normX) * 0.08;
        }

        const x = rawX;
        const y = cy - ITEM_H / 2 + yOffset;
        const iw = ITEM_W * scale;
        const ih = ITEM_H * scale;
        const ox = x + (ITEM_W - iw) / 2;
        const oy = y + (ITEM_H - ih) / 2;

        if (ox + iw < -50 || ox > w + 50) return;

        const r = borderRadius * iw;
        ctx!.save();
        ctx!.beginPath();
        ctx!.moveTo(ox + r, oy);
        ctx!.lineTo(ox + iw - r, oy);
        ctx!.quadraticCurveTo(ox + iw, oy, ox + iw, oy + r);
        ctx!.lineTo(ox + iw, oy + ih - r);
        ctx!.quadraticCurveTo(ox + iw, oy + ih, ox + iw - r, oy + ih);
        ctx!.lineTo(ox + r, oy + ih);
        ctx!.quadraticCurveTo(ox, oy + ih, ox, oy + ih - r);
        ctx!.lineTo(ox, oy + r);
        ctx!.quadraticCurveTo(ox, oy, ox + r, oy);
        ctx!.closePath();
        ctx!.clip();

        const img = state.images[i];
        if (img && img.complete && img.naturalWidth > 0) {
          const fx = item.focalX ?? 0.5;
          const fy = item.focalY ?? 0.5;
          const imgAspect = img.naturalWidth / img.naturalHeight;
          const boxAspect = iw / ih;
          let sw, sh, sx, sy;
          if (imgAspect > boxAspect) {
            sh = img.naturalHeight;
            sw = sh * boxAspect;
            sx = (img.naturalWidth - sw) * fx;
            sy = 0;
          } else {
            sw = img.naturalWidth;
            sh = sw / boxAspect;
            sx = 0;
            sy = (img.naturalHeight - sh) * fy;
          }
          ctx!.drawImage(img, sx, sy, sw, sh, ox, oy, iw, ih);
        } else {
          ctx!.fillStyle = "#163d2a";
          ctx!.fillRect(ox, oy, iw, ih);
        }

        // gradient overlay
        const grad = ctx!.createLinearGradient(ox, oy + ih * 0.5, ox, oy + ih);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, "rgba(0,0,0,0.72)");
        ctx!.fillStyle = grad;
        ctx!.fillRect(ox, oy, iw, ih);

        if (item.text) {
          ctx!.font = font;
          ctx!.fillStyle = textColor;
          ctx!.textBaseline = "bottom";
          ctx!.textAlign = "left";
          const padding = 14 * scale;
          const fontSize = parseFloat(font) * scale;
          ctx!.font = font.replace(/\d+px/, `${Math.round(fontSize)}px`);
          ctx!.fillText(item.text, ox + padding, oy + ih - padding, iw - padding * 2);
        }

        ctx!.restore();
      });
    }

    function animate() {
      state.scroll = lerp(state.scroll, state.targetScroll, scrollEase);
      // wrap
      if (state.targetScroll > TOTAL_W) {
        state.scroll -= TOTAL_W;
        state.targetScroll -= TOTAL_W;
      }
      if (state.targetScroll < 0) {
        state.scroll += TOTAL_W;
        state.targetScroll += TOTAL_W;
      }
      draw();
      state.animId = requestAnimationFrame(animate);
    }
    state.animId = requestAnimationFrame(animate);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      state.targetScroll += e.deltaX || e.deltaY * 0.6;
    };
    const onPointerDown = (e: PointerEvent) => {
      state.isDragging = true;
      state.lastX = e.clientX;
      state.velocity = 0;
      canvas!.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!state.isDragging) return;
      const dx = e.clientX - state.lastX;
      state.velocity = dx;
      state.targetScroll -= dx * scrollSpeed * 0.5;
      state.lastX = e.clientX;
    };
    const onPointerUp = () => {
      state.isDragging = false;
      state.targetScroll -= state.velocity * 3;
    };

    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    return () => {
      cancelAnimationFrame(state.animId);
      ro.disconnect();
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    };
  }, [ready, items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase]);

  return (
    <div ref={containerRef} className="w-full h-full relative select-none cursor-grab active:cursor-grabbing">
      <canvas ref={canvasRef} className="w-full h-full" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gold-400/40 border-t-gold-400 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
