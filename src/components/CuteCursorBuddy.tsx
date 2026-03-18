import { useEffect, useRef } from 'react';

type CursorDetail = { x: number; y: number; visible: boolean };

type CursorState = {
  enabled: boolean;
  visible: boolean;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  rafId: number;
  styleEl: HTMLStyleElement | null;
};

type MediaListener = (event?: MediaQueryListEvent) => void;

type LegacyMediaQueryList = MediaQueryList & {
  addListener?: (listener: MediaListener) => void;
  removeListener?: (listener: MediaListener) => void;
};

const CURSOR_EVENT = 'skillbridge:cursor';

const addMediaListener = (query: LegacyMediaQueryList, listener: MediaListener) => {
  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }

  query.addListener?.(listener);
  return () => query.removeListener?.(listener);
};

const CuteCursorBuddy = () => {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot || typeof window === 'undefined' || typeof document === 'undefined') return;

    const finePointer = window.matchMedia('(pointer: fine)') as LegacyMediaQueryList;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)') as LegacyMediaQueryList;
    const state: CursorState = {
      enabled: false,
      visible: false,
      currentX: -100,
      currentY: -100,
      targetX: -100,
      targetY: -100,
      rafId: 0,
      styleEl: null,
    };

    const dispatchCursor = () => {
      const detail: CursorDetail = {
        x: state.currentX,
        y: state.currentY,
        visible: state.visible && state.enabled,
      };
      window.dispatchEvent(new CustomEvent(CURSOR_EVENT, { detail }));
    };

    const ensureCursorHidden = (hide: boolean) => {
      if (hide && !state.styleEl) {
        const style = document.createElement('style');
        style.dataset.skillbridgeCursor = 'true';
        style.textContent = 'html, body, a, button, input, textarea, select, summary, [role="button"], [role="link"], label { cursor: none !important; }';
        document.head.appendChild(style);
        state.styleEl = style;
      }
    };

      if (!hide && state.styleEl) {
        state.styleEl.remove();
        state.styleEl = null;
      }
    };

    const syncEnabled = () => {
      const loadingActive = document.body?.dataset.loadingScreen === 'true';
      state.enabled = finePointer.matches && !reducedMotion.matches && !loadingActive;
      ensureCursorHidden(state.enabled);

      if (!state.enabled) {
        state.visible = false;
        dot.style.opacity = '0';
        dispatchCursor();
      }
    };

    const animate = () => {
      const smoothing = state.visible ? 0.24 : 0.16;
      state.currentX += (state.targetX - state.currentX) * smoothing;
      state.currentY += (state.targetY - state.currentY) * smoothing;
      dot.style.transform = `translate3d(${state.currentX - 8}px, ${state.currentY - 8}px, 0)`;
      dispatchCursor();
      state.rafId = window.requestAnimationFrame(animate);
    };

    const onMove = (event: MouseEvent) => {
      if (!state.enabled) return;
      state.targetX = event.clientX;
      state.targetY = event.clientY;
      state.visible = true;
      dot.style.opacity = '1';
    };

    const onLeave = () => {
      state.visible = false;
      dot.style.opacity = '0';
      dispatchCursor();
    };

    syncEnabled();

    const observer = new MutationObserver(syncEnabled);
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-loading-screen'] });

    const removeFinePointerListener = addMediaListener(finePointer, syncEnabled);
    const removeReducedMotionListener = addMediaListener(reducedMotion, syncEnabled);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseout', onLeave);
    window.addEventListener('blur', onLeave);
    state.rafId = window.requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      removeFinePointerListener();
      removeReducedMotionListener();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
      window.removeEventListener('blur', onLeave);
      window.cancelAnimationFrame(state.rafId);
      ensureCursorHidden(false);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: 16,
        height: 16,
        borderRadius: '9999px',
        background:
          'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.98) 0%, rgba(191,219,254,0.95) 28%, rgba(34,211,238,0.55) 56%, rgba(15,23,42,0.92) 100%)',
        boxShadow:
          '0 0 0 1px rgba(255,255,255,0.55), 0 0 22px rgba(34,211,238,0.28), 0 0 40px rgba(129,140,248,0.16)',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0,
        transition: 'opacity 140ms ease-out',
        willChange: 'transform, opacity',
      }}
    />
  );
};

export default CuteCursorBuddy;
