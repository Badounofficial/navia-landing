import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

/* ─────────────────────────────────────────────
   Ozaia  ·  Interactive App Prototype
   4 screens: Onboarding · Journal · Profile · Circles
   ───────────────────────────────────────────── */

/* ── Color tokens ── */
const palette = {
  night: {
    bg: "#2B2940",
    bgGrad: "radial-gradient(ellipse at top, #3E3A7A 0%, #2B2940 55%, #1d1b2e 100%)",
    text: "rgba(245,240,230,0.92)",
    textSoft: "rgba(245,240,230,0.55)",
    textStrong: "#F5F0E6",
    hairline: "rgba(245,240,230,0.14)",
    accentRose: "#E8A89D",
    accentAube: "#E8C58F",
    cardBg: "rgba(245,240,230,0.04)",
    moonColor: "#F5F0E6",
    moonHalo: "rgba(245,240,230,0.65)",
    moonHaloWide: "rgba(245,240,230,0.25)",
    inputBg: "rgba(245,240,230,0.06)",
    inputBorder: "rgba(245,240,230,0.25)",
    btnBg: "#F5F0E6",
    btnText: "#2B2940",
    moonBrightness: 1.0,
    moonContrast: 1.0,
    // Three.js moon params
    moonMaterialColor: 0xffffff,
    moonLightColor: 0xfff8f0,
    moonLightIntensity: 1.4,
  },
  day: {
    bg: "#F4EFF5",
    bgGrad: "radial-gradient(ellipse at top, #F8F3F8 0%, #F4EFF5 55%, #EDE6EE 100%)",
    text: "rgba(43,41,64,0.88)",
    textSoft: "rgba(43,41,64,0.55)",
    textStrong: "#2B2940",
    hairline: "rgba(43,41,64,0.12)",
    accentRose: "#C97A8E",
    accentAube: "#8E7BB8",
    cardBg: "rgba(43,41,64,0.04)",
    moonColor: "#FBF9FD",
    moonHalo: "rgba(208,196,232,0.38)",
    moonHaloWide: "rgba(230,205,220,0.18)",
    inputBg: "rgba(43,41,64,0.04)",
    inputBorder: "rgba(43,41,64,0.22)",
    btnBg: "#2B2940",
    btnText: "#F5F0E6",
    moonBrightness: 0.55,
    moonContrast: 1.3,
    // Three.js moon params
    moonMaterialColor: 0xd8cfe8,
    moonLightColor: 0xe0d8f0,
    moonLightIntensity: 1.2,
  },
};

/* ── Onboarding scenes ── */
const onboardingScenes = [
  { id: 1, moonPhase: 0.05, text: null, subtext: null, delay: 2500 },
  { id: 2, moonPhase: 0.15, text: null, subtext: null, delay: 3000 },
  { id: 3, moonPhase: 0.25, text: "You can stay here for a moment.", subtext: null, delay: 4000 },
  { id: 4, moonPhase: 0.35, text: null, subtext: "No need to know what to say.", delay: 3500 },
  { id: 5, moonPhase: 0.45, text: "You can speak if you want.", subtext: "Long press to talk", delay: 3500 },
  { id: 6, moonPhase: 0.6, text: "I heard you.", subtext: "What brought you here, tonight?", delay: 4500 },
  { id: 7, moonPhase: 0.75, text: "There is something that weighs a little more than the rest.", subtext: null, delay: 4500 },
  { id: 8, moonPhase: 0.88, text: "You can stay.", subtext: null, delay: 3000, showSignup: true },
  { id: 9, moonPhase: 1.0, text: "We can stop here for now.", subtext: "You can come back whenever you want.", delay: 4000, final: true },
];

/* ── Diary entries (demo) ── */
const demoEntries = [
  {
    date: "Friday, April 18",
    text: "I had a strange day. Not bad. Just heavy. The kind where everything works on the surface but something underneath stays tight. I smiled at the right moments. I answered every message. But when I got home and closed the door, I just stood there for a while. Not doing anything. Not thinking anything specific. Just standing.",
    ozaia: "What you are describing does not make noise on the outside. But inside, it takes up space.",
  },
  {
    date: "Saturday, April 19",
    text: "I keep circling back to something I cannot name. It is not sadness. More like a weight I forgot I was carrying. I noticed it again this morning when I woke up and my first thought was already heavy before I even opened my eyes.",
    ozaia: "You come back to that often. It matters more than you say.",
  },
  {
    date: "Sunday, April 20",
    text: null,
    ozaia: null,
    morning: "What stays with you",
    morningNote: "Yesterday you mentioned a weight you forgot you were carrying. Sometimes naming what we carry is what makes it lighter. There is no rush.",
  },
];

/* ── Circles (demo) ── */
const demoCircles = [
  { name: "Amara", duration: "12 days", phase: "Accompany a friend who just gave birth", moonPhase: 0.6, daysLeft: 8 },
  { name: "Leila", duration: "12 hours", phase: "Cross a difficult night together", moonPhase: 0.25, daysLeft: 0, hoursLeft: 4 },
  { name: "Maman", duration: "12 weeks", phase: "Walk through a first trimester", moonPhase: 0.85, daysLeft: 62 },
];

/* ═══════════════════════════════════════════
   Components
   ═══════════════════════════════════════════ */

/* ── Three.js 3D Rotating NASA Moon ── */
function NasaMoon({ size = 120, phase = 1.0, colors, glow = true, breathing = true, mood = "calm" }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const moonRef = useRef(null);
  const lightRef = useRef(null);
  const frameRef = useRef(null);
  const mountedRef = useRef(true);

  // Initialize Three.js scene
  useEffect(() => {
    mountedRef.current = true;
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.z = 2.8;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.12);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(colors.moonLightColor, colors.moonLightIntensity);
    directionalLight.position.set(-3, 2, 4);
    scene.add(directionalLight);
    lightRef.current = directionalLight;

    const fillLight = new THREE.DirectionalLight(0xd0c8f0, 0.15);
    fillLight.position.set(3, -1, -2);
    scene.add(fillLight);

    // Procedural moon texture (no external fetch needed)
    function createMoonTexture(res) {
      const canvas = document.createElement("canvas");
      canvas.width = res;
      canvas.height = res;
      const ctx = canvas.getContext("2d");

      // Base lunar grey
      ctx.fillStyle = "#b8b8b8";
      ctx.fillRect(0, 0, res, res);

      // Seeded pseudo-random for consistency
      let seed = 42;
      const rand = () => { seed = (seed * 16807 + 0) % 2147483647; return (seed - 1) / 2147483646; };

      // Large maria (dark patches)
      const maria = [
        { x: 0.3, y: 0.35, r: 0.18, c: "#8a8a8a" },
        { x: 0.55, y: 0.25, r: 0.12, c: "#909090" },
        { x: 0.65, y: 0.55, r: 0.15, c: "#878787" },
        { x: 0.4, y: 0.6, r: 0.1, c: "#8c8c8c" },
        { x: 0.25, y: 0.7, r: 0.09, c: "#8e8e8e" },
        { x: 0.7, y: 0.35, r: 0.08, c: "#919191" },
        { x: 0.5, y: 0.45, r: 0.14, c: "#898989" },
      ];
      maria.forEach((m) => {
        const grad = ctx.createRadialGradient(m.x * res, m.y * res, 0, m.x * res, m.y * res, m.r * res);
        grad.addColorStop(0, m.c);
        grad.addColorStop(0.7, m.c + "88");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, res, res);
      });

      // Craters: large, medium, small
      const drawCrater = (cx, cy, cr) => {
        // Dark ring
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(80,80,80,${0.15 + rand() * 0.15})`;
        ctx.fill();
        // Bright rim (highlight)
        ctx.beginPath();
        ctx.arc(cx - cr * 0.15, cy - cr * 0.15, cr * 0.85, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,200,200,${0.08 + rand() * 0.1})`;
        ctx.fill();
        // Central bright spot
        ctx.beginPath();
        ctx.arc(cx, cy, cr * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190,190,190,${0.1 + rand() * 0.08})`;
        ctx.fill();
      };

      // Large craters
      for (let i = 0; i < 12; i++) {
        drawCrater(rand() * res, rand() * res, 8 + rand() * 20);
      }
      // Medium craters
      for (let i = 0; i < 40; i++) {
        drawCrater(rand() * res, rand() * res, 3 + rand() * 8);
      }
      // Small craters (surface texture)
      for (let i = 0; i < 200; i++) {
        const x = rand() * res, y = rand() * res, r = 1 + rand() * 3;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rand() > 0.5 ? 160 : 100},${rand() > 0.5 ? 160 : 100},${rand() > 0.5 ? 160 : 100},${0.08 + rand() * 0.12})`;
        ctx.fill();
      }

      // Fine noise grain for surface realism
      const imageData = ctx.getImageData(0, 0, res, res);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const noise = (rand() - 0.5) * 18;
        imageData.data[i] += noise;
        imageData.data[i + 1] += noise;
        imageData.data[i + 2] += noise;
      }
      ctx.putImageData(imageData, 0, 0);

      return canvas;
    }

    const texCanvas = createMoonTexture(512);
    const texture = new THREE.CanvasTexture(texCanvas);
    texture.needsUpdate = true;

    // Also create a bump texture (higher contrast version)
    const bumpCanvas = createMoonTexture(512);
    const bumpCtx = bumpCanvas.getContext("2d");
    bumpCtx.globalCompositeOperation = "source-atop";
    bumpCtx.filter = "contrast(1.8) brightness(0.9)";
    bumpCtx.drawImage(bumpCanvas, 0, 0);
    const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
    bumpTexture.needsUpdate = true;

    // Moon geometry and material
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      bumpMap: bumpTexture,
      bumpScale: 0.04,
      roughness: 0.9,
      metalness: 0.0,
      color: new THREE.Color(colors.moonMaterialColor),
    });

    const moon = new THREE.Mesh(geometry, material);
    moon.rotation.x = 0.15;
    moon.rotation.z = -0.05;
    scene.add(moon);
    moonRef.current = moon;

    // Animation loop
    let breatheStart = Date.now();
    var moodRef = { current: "calm" };
    const animate = () => {
      if (!mountedRef.current) return;
      frameRef.current = requestAnimationFrame(animate);

      // Slow rotation
      moon.rotation.y += 0.001;

      // Breathing scale — speed and amplitude respond to mood
      if (breathing) {
        var duration = 5000;
        var amplitude = 0.035;
        if (moodRef.current === "attentive") {
          duration = 2500;
          amplitude = 0.04;
        } else if (moodRef.current === "thinking") {
          duration = 3500;
          amplitude = 0.055;
        }
        const t = (Date.now() - breatheStart) / duration;
        const s = 1 + Math.sin(t * Math.PI * 2) * amplitude;
        moon.scale.set(s, s, s);
      }

      renderer.render(scene, camera);
    };
    containerRef.current._moodRef = moodRef;
    animate();

    return () => {
      mountedRef.current = false;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, [size]);

  // Sync mood prop into the animation loop's moodRef
  useEffect(function() {
    if (containerRef.current && containerRef.current._moodRef) {
      containerRef.current._moodRef.current = mood;
    }
  }, [mood]);

  // Update colors when theme changes
  useEffect(() => {
    if (moonRef.current) {
      moonRef.current.material.color = new THREE.Color(colors.moonMaterialColor);
    }
    if (lightRef.current) {
      lightRef.current.color = new THREE.Color(colors.moonLightColor);
      lightRef.current.intensity = colors.moonLightIntensity;
    }
  }, [colors.moonMaterialColor, colors.moonLightColor, colors.moonLightIntensity]);

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
      }}
    >
      {/* Outer halo glow — pulses faster when attentive or thinking */}
      {glow && (
        <>
          <div
            style={{
              position: "absolute",
              inset: -size * 0.5,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${colors.moonHaloWide} 0%, transparent 65%)`,
              opacity: 0.5,
              pointerEvents: "none",
              animation: mood === "calm" ? "haloBreath 5s ease-in-out infinite" : mood === "attentive" ? "haloBreath 2.5s ease-in-out infinite" : "haloBreath 3.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: -size * 0.2,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${colors.moonHalo} 0%, transparent 55%)`,
              opacity: 0.35,
              pointerEvents: "none",
              animation: mood === "calm" ? "haloBreath 5s ease-in-out infinite" : mood === "attentive" ? "haloBreath 2.5s ease-in-out infinite" : "haloBreath 3.5s ease-in-out infinite",
              transform: mood === "thinking" ? "scale(1.08)" : "scale(1)",
              transition: "transform 1.2s ease-in-out",
            }}
          />
        </>
      )}
      {/* Three.js canvas container */}
      <div
        ref={containerRef}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          position: "relative",
        }}
      />
    </div>
  );
}

/* ── Phone Frame ── */
function PhoneFrame({ children, colors }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 500);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) {
    // Full-screen on real phones: no frame, no border-radius, fill viewport
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: colors.bgGrad,
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Safe area top spacing */}
        <div style={{ height: "env(safe-area-inset-top, 44px)", flexShrink: 0 }} />
        {children}
        {/* Safe area bottom */}
        <div style={{ height: "env(safe-area-inset-bottom, 0px)", flexShrink: 0 }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: 20, background: "#111" }}>
      <div
        style={{
          width: 390,
          height: 844,
          borderRadius: 44,
          overflow: "hidden",
          background: colors.bgGrad,
          position: "relative",
          boxShadow: "0 25px 80px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Dynamic Island */}
        <div
          style={{
            height: 54,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "0 28px 6px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 126,
              height: 30,
              borderRadius: 20,
              background: "#000",
              position: "absolute",
              top: 10,
            }}
          />
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── Tab Bar ── */
function TabBar({ activeTab, onTabChange, colors }) {
  const tabs = [
    { id: "diary", label: "Diary", icon: "D" },
    { id: "library", label: "Library", icon: "L" },
    { id: "circles", label: "Circles", icon: "C" },
    { id: "profile", label: "Profile", icon: "P" },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "12px 0 34px",
        borderTop: `1px solid ${colors.hairline}`,
        background: `${colors.bg}cc`,
        backdropFilter: "blur(20px)",
        flexShrink: 0,
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            padding: "4px 20px",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              border: `1.5px solid ${activeTab === tab.id ? colors.accentAube : colors.textSoft}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 500,
              color: activeTab === tab.id ? colors.accentAube : colors.textSoft,
              transition: "all 0.4s ease",
              background: activeTab === tab.id ? `${colors.accentAube}15` : "transparent",
            }}
          >
            {tab.icon}
          </div>
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.06em",
              color: activeTab === tab.id ? colors.accentAube : colors.textSoft,
              fontFamily: "'Inter', sans-serif",
              transition: "color 0.4s ease",
            }}
          >
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ── Onboarding Screen ── */
function OnboardingScreen({ colors, onComplete }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [subtextVisible, setSubtextVisible] = useState(false);
  const scene = onboardingScenes[sceneIndex];

  useEffect(() => {
    setTextVisible(false);
    setSubtextVisible(false);
    // Longer delay for silent scenes (just moon, no text)
    const textDelay = scene.text ? 1000 : 2000;
    const t1 = setTimeout(() => setTextVisible(true), textDelay);
    const t2 = setTimeout(() => setSubtextVisible(true), textDelay + 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [sceneIndex]);

  const handleNext = () => {
    if (transitioning) return;
    setTransitioning(true);
    // Cinematic fade between scenes (800ms)
    setTimeout(() => {
      if (sceneIndex < onboardingScenes.length - 1) setSceneIndex(sceneIndex + 1);
      else onComplete();
      setTimeout(() => setTransitioning(false), 100);
    }, 800);
  };

  return (
    <div
      onClick={handleNext}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 40px",
        cursor: "pointer",
        position: "relative",
        userSelect: "none",
        opacity: transitioning ? 0 : 1,
        transition: "opacity 0.8s ease",
      }}
    >
      {/* Next (only after scene 2, invisible during pure silence) */}
      <button
        onClick={function(e) { e.stopPropagation(); onComplete(); }}
        style={{
          position: "absolute", top: 20, right: 24,
          background: "none", border: "none",
          color: colors.textSoft, fontSize: 13,
          fontFamily: "'Inter', sans-serif",
          cursor: "pointer", letterSpacing: "0.04em",
          opacity: sceneIndex < 2 ? 0.25 : 0.5,
          transition: "opacity 0.6s ease",
        }}
      >
        {sceneIndex < 2 ? "I am ready" : "next"}
      </button>

      {/* NASA Moon */}
      <div style={{ marginBottom: 60, transition: "transform 0.8s ease" }}>
        <NasaMoon size={150} phase={scene.moonPhase} colors={colors} />
      </div>

      {/* Text (only appears from scene 3 onward) */}
      <div style={{ minHeight: 120, textAlign: "center" }}>
        {scene.text && (
          <p
            style={{
              fontFamily: "'Georgia', serif",
              fontStyle: "italic", fontSize: 22, lineHeight: 1.5,
              color: colors.accentAube,
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 1.5s ease, transform 1.5s ease",
              margin: "0 0 16px",
            }}
          >
            {scene.text}
          </p>
        )}
        {scene.subtext && (
          <p
            style={{
              fontFamily: "'Inter', sans-serif", fontSize: 14,
              color: colors.textSoft,
              opacity: subtextVisible ? 1 : 0,
              transform: subtextVisible ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 1.2s ease, transform 1.2s ease",
              margin: 0, letterSpacing: "0.02em",
            }}
          >
            {scene.subtext}
          </p>
        )}
        {scene.showSignup && subtextVisible && (
          <div style={{ marginTop: 32, opacity: subtextVisible ? 1 : 0, transition: "opacity 1.5s ease 0.5s" }}>
            <button
              onClick={(e) => { e.stopPropagation(); onComplete(); }}
              style={{
                background: "none",
                border: `1px solid ${colors.accentAube}55`,
                borderRadius: 100, padding: "14px 32px",
                color: colors.accentAube,
                fontFamily: "'Georgia', serif",
                fontStyle: "italic", fontSize: 15,
                cursor: "pointer", transition: "all 0.4s ease",
              }}
              onMouseEnter={(e) => { e.target.style.background = `${colors.accentAube}15`; e.target.style.borderColor = `${colors.accentAube}88`; }}
              onMouseLeave={(e) => { e.target.style.background = "none"; e.target.style.borderColor = `${colors.accentAube}55`; }}
            >
              Continue with Apple
            </button>
          </div>
        )}
      </div>

      {/* Progress: subtle moon phases instead of dots */}
      <div style={{ position: "absolute", bottom: 50, display: "flex", gap: 6, alignItems: "center" }}>
        {onboardingScenes.map((s, i) => (
          <div
            key={i}
            style={{
              width: i === sceneIndex ? 18 : 5,
              height: 5,
              borderRadius: 3,
              background: i <= sceneIndex ? colors.accentAube : colors.hairline,
              opacity: i === sceneIndex ? 1 : i < sceneIndex ? 0.4 : 0.2,
              transition: "all 0.8s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Quill writing animation component ── */
function QuillText({ text, color, delay = 0, onComplete, speed = 35 }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const [showQuill, setShowQuill] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => { setShowQuill(true); setStarted(true); }, delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started || !text) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setShowQuill(false);
        if (onComplete) onComplete();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  if (!text) return null;

  return (
    <div style={{ position: "relative" }}>
      {/* Quill icon */}
      {showQuill && (
        <span
          style={{
            position: "absolute",
            top: -18,
            left: 12,
            fontSize: 14,
            color,
            opacity: 0.7,
            animation: "quillBob 1.2s ease-in-out infinite",
          }}
        >
          &#9998;
        </span>
      )}
      <p
        style={{
          fontFamily: "'Georgia', serif",
          fontStyle: "italic",
          fontSize: 15,
          lineHeight: 1.65,
          color,
          margin: 0,
          minHeight: started ? "auto" : 0,
          opacity: started ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        {displayed}
        {showQuill && (
          <span style={{ opacity: 0.5, animation: "blink 0.8s step-end infinite" }}>|</span>
        )}
      </p>
    </div>
  );
}

/* ── Diary Screen ── */
function DiaryScreen({ colors }) {
  const [entries, setEntries] = useState(demoEntries);
  const [inputText, setInputText] = useState("");
  const [writingResponse, setWritingResponse] = useState(false);
  const [latestOzaiaText, setLatestOzaiaText] = useState(null);
  // Moon animation: "idle" | "ready" | "descending" | "writing" | "ascending"
  // "ready" = moon visible at top, then transitions to "descending" next frame
  const [moonAnim, setMoonAnim] = useState("idle");
  const pendingResponseRef = useRef(null);
  var quillSpeedRef = useRef(35);
  const moonRef = useRef(null);
  const scrollRef = useRef(null);
  // Ozaia initiates: gentle murmur after idle
  var [ozaiaMurmur, setOzaiaMurmur] = useState(null);
  var [murmurFading, setMurmurFading] = useState(false);
  var murmurTimerRef = useRef(null);
  var murmurFadeRef = useRef(null);
  var hasInteractedRef = useRef(false);

  // First visit welcome sequence
  var firstVisitState = useState(true);
  var firstVisit = firstVisitState[0];
  var setFirstVisit = firstVisitState[1];
  var welcomeLine1State = useState(false);
  var welcomeLine1 = welcomeLine1State[0];
  var setWelcomeLine1 = welcomeLine1State[1];
  var welcomeLine2State = useState(false);
  var welcomeLine2 = welcomeLine2State[0];
  var setWelcomeLine2 = welcomeLine2State[1];
  var entriesVisibleState = useState(false);
  var entriesVisible = entriesVisibleState[0];
  var setEntriesVisible = entriesVisibleState[1];

  useEffect(function() {
    if (!firstVisit) return;
    var t1 = setTimeout(function() { setWelcomeLine1(true); }, 1500);
    var t2 = setTimeout(function() { setWelcomeLine2(true); }, 3500);
    var t3 = setTimeout(function() {
      setEntriesVisible(true);
      setFirstVisit(false);
    }, 6500);
    return function() { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [firstVisit]);

  useEffect(function() {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [entries, writingResponse, latestOzaiaText]);

  // Track interaction to cancel murmur
  useEffect(function() {
    if (inputText.trim()) {
      hasInteractedRef.current = true;
      if (murmurTimerRef.current) { clearTimeout(murmurTimerRef.current); murmurTimerRef.current = null; }
      if (murmurFadeRef.current) { clearTimeout(murmurFadeRef.current); murmurFadeRef.current = null; }
      setOzaiaMurmur(null);
      setMurmurFading(false);
    }
  }, [inputText]);

  // Ozaia initiates after 8s of inactivity (50% chance)
  useEffect(function() {
    hasInteractedRef.current = false;
    var murmurs = [
      "You came back.",
      "Take your time.",
      "I noticed you were here yesterday too.",
      "You do not have to write anything.",
      "The silence is fine.",
    ];
    murmurTimerRef.current = setTimeout(function() {
      if (hasInteractedRef.current) return;
      if (Math.random() < 0.5) {
        var chosen = murmurs[Math.floor(Math.random() * murmurs.length)];
        setOzaiaMurmur(chosen);
        setMurmurFading(false);
        // Fade out after 6 seconds if no interaction
        murmurFadeRef.current = setTimeout(function() {
          setMurmurFading(true);
          setTimeout(function() {
            setOzaiaMurmur(null);
            setMurmurFading(false);
          }, 600);
        }, 6000);
      }
    }, 8000);
    return function() {
      if (murmurTimerRef.current) clearTimeout(murmurTimerRef.current);
      if (murmurFadeRef.current) clearTimeout(murmurFadeRef.current);
    };
  }, []);

  // Two-frame trick: when moonAnim becomes "ready", force reflow then go to "descending"
  useEffect(function() {
    if (moonAnim === "ready" && moonRef.current) {
      // Force browser to paint the element at top:8 first
      moonRef.current.getBoundingClientRect();
      // Then trigger the transition to bottom
      requestAnimationFrame(function() {
        setMoonAnim("descending");
      });
    }
  }, [moonAnim]);

  var handleSend = function() {
    if (!inputText.trim()) return;
    var now = new Date();
    var date = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    var newEntry = { date: date, text: inputText.trim(), ozaia: null };
    setEntries(function(prev) { return prev.concat([newEntry]); });
    setInputText("");

    var responses = [
      "What would feel good right now?",
      "We can just stay here too.",
      "I was thinking about what you left here. How is it today?",
      "There is something that weighs a little more than the rest.",
      "You do not have to understand it yet. Just let it stay.",
    ];
    pendingResponseRef.current = responses[Math.floor(Math.random() * responses.length)];

    // Controlled imperfection: random delay between 2000ms and 6000ms
    var thinkDelay = 2000 + Math.floor(Math.random() * 4000);
    // 30% chance of a hesitation pause
    var willHesitate = Math.random() < 0.3;
    // Random quill speed: 25ms (flowing) or 50ms (deliberate) or 35ms (normal)
    var speedOptions = [25, 35, 50];
    var chosenSpeed = speedOptions[Math.floor(Math.random() * speedOptions.length)];
    quillSpeedRef.current = chosenSpeed;

    // Phase 1: Show moon at header position, then it will auto-descend
    setTimeout(function() {
      setMoonAnim("ready");
      setWritingResponse(true);
    }, 400);

    // Phase 2: Moon arrived, start quill writing (with possible hesitation)
    if (willHesitate) {
      // Hesitation: dots disappear briefly at 60% of thinkDelay
      var hesitateAt = Math.floor(thinkDelay * 0.6);
      setTimeout(function() {
        setWritingResponse(false);
      }, hesitateAt);
      setTimeout(function() {
        setWritingResponse(true);
      }, hesitateAt + 500);
    }

    setTimeout(function() {
      setMoonAnim("writing");
      setWritingResponse(false);
      setLatestOzaiaText(pendingResponseRef.current);
    }, thinkDelay);
  };

  // When quill finishes, moon returns
  var handleOzaiaComplete = useCallback(function() {
    setMoonAnim("ascending");
    setTimeout(function() {
      setMoonAnim("idle");
      setEntries(function(prev) {
        var updated = prev.slice();
        var last = updated[updated.length - 1];
        if (last && !last.ozaia) {
          updated[updated.length - 1] = Object.assign({}, last, { ozaia: latestOzaiaText });
        }
        return updated;
      });
      setLatestOzaiaText(null);
    }, 800);
  }, [latestOzaiaText]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      {/* Traveling moon */}
      <div
        ref={moonRef}
        style={{
          position: "absolute",
          zIndex: 50,
          left: "50%",
          marginLeft: -12,
          pointerEvents: "none",
          top: (moonAnim === "descending" || moonAnim === "writing") ? "calc(100% - 130px)" : 8,
          opacity: (moonAnim === "idle") ? 0 : (moonAnim === "ascending") ? 0 : 1,
          transition: (moonAnim === "ready") ? "none" : "top 2s ease-in-out, opacity 0.6s ease",
        }}
      >
        <div style={{
          width: 24, height: 24, borderRadius: "50%",
          boxShadow: "0 0 12px 4px " + colors.accentAube + "40",
        }}>
          <MoonPhaseIcon size={24} phase={0.85} colors={colors} />
        </div>
      </div>

      {/* Header */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "8px 24px 12px", flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "'Georgia', serif", fontSize: 19,
            fontStyle: "italic", fontWeight: 400,
            color: colors.accentAube, letterSpacing: "0.04em",
          }}
        >
          Oza{"\u0131"}a
        </span>
      </div>

      {/* Diary entries */}
      <div
        ref={scrollRef}
        style={{
          flex: 1, overflowY: "auto", padding: "0 24px",
          display: "flex", flexDirection: "column", gap: 0,
        }}
      >
        {/* Moon at top */}
        <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 24px" }}>
          <NasaMoon size={80} phase={0.85} colors={colors} breathing={firstVisit ? true : true} mood={writingResponse ? "thinking" : inputText.trim() ? "attentive" : firstVisit ? "waiting" : "calm"} />
        </div>

        {/* First visit welcome messages */}
        {firstVisit && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0 30px", gap: 16 }}>
            {welcomeLine1 && (
              <p style={{
                fontFamily: "'Georgia', serif", fontStyle: "italic",
                fontSize: 17, color: colors.accentAube,
                textAlign: "center", margin: 0,
                animation: "welcomeFadeIn 1.2s ease forwards",
              }}>
                I have been waiting for you.
              </p>
            )}
            {welcomeLine2 && (
              <p style={{
                fontFamily: "'Georgia', serif", fontStyle: "italic",
                fontSize: 15, color: colors.accentAube,
                textAlign: "center", margin: 0, opacity: 0.7,
                animation: "welcomeFadeIn 1.2s ease forwards",
              }}>
                Whenever you are ready.
              </p>
            )}
          </div>
        )}

        {/* Diary entries (hidden during first visit, fade in after) */}
        <div style={{
          opacity: firstVisit ? 0 : 1,
          transition: "opacity 1.5s ease",
        }}>
        {entries.map((entry, i) => (
          <div key={i} style={{ marginBottom: 28 }}>
            {/* Date line */}
            <p
              style={{
                fontFamily: "'Inter', sans-serif", fontSize: 10,
                fontWeight: 500, letterSpacing: "0.14em",
                textTransform: "uppercase", color: colors.textSoft,
                margin: "0 0 10px", opacity: 0.6,
              }}
            >
              {entry.date}
            </p>

            {/* Morning reflection from Ozaia (next-day wisdom) */}
            {entry.morning && (
              <div
                style={{
                  padding: "14px 16px", marginBottom: 14,
                  borderRadius: 12,
                  background: `${colors.accentAube}08`,
                  border: `1px solid ${colors.accentAube}20`,
                }}
              >
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 10,
                    fontWeight: 500, letterSpacing: "0.12em",
                    textTransform: "uppercase", color: colors.accentAube,
                    margin: "0 0 8px", opacity: 0.7,
                  }}
                >
                  {entry.morning}
                </p>
                <p
                  style={{
                    fontFamily: "'Georgia', serif", fontStyle: "italic",
                    fontSize: 14, lineHeight: 1.6, color: colors.accentAube,
                    margin: 0, opacity: 0.85,
                  }}
                >
                  {entry.morningNote}
                </p>
              </div>
            )}

            {/* Her entry (full width, like writing in a journal) */}
            {entry.text && (
              <p
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 16, lineHeight: 1.7,
                  color: colors.textStrong, margin: 0,
                }}
              >
                {entry.text}
              </p>
            )}

            {/* Ozaia's murmur: indented, aube, italic, with vertical accent line */}
            {entry.ozaia && (
              <div
                style={{
                  display: "flex", gap: 12, marginTop: 14,
                  paddingLeft: 4,
                }}
              >
                {/* Vertical aube accent line */}
                <div
                  style={{
                    width: 2, minHeight: 20, borderRadius: 1,
                    background: colors.accentAube, opacity: 0.4,
                    flexShrink: 0,
                  }}
                />
                <p
                  style={{
                    fontFamily: "'Georgia', serif", fontStyle: "italic",
                    fontSize: 15, lineHeight: 1.65,
                    color: colors.accentAube, margin: 0,
                  }}
                >
                  {entry.ozaia}
                </p>
              </div>
            )}

            {/* Separator between entries */}
            {i < entries.length - 1 && (
              <div
                style={{
                  width: 40, height: 1, borderRadius: 1,
                  background: colors.hairline,
                  margin: "24px auto 0",
                }}
              />
            )}
          </div>
        ))}

        {/* Live writing: Ozaia composing after new entry */}
        {writingResponse && (
          <div style={{ display: "flex", gap: 12, paddingLeft: 4, marginBottom: 16 }}>
            <div
              style={{
                width: 2, minHeight: 20, borderRadius: 1,
                background: colors.accentAube, opacity: 0.4,
                flexShrink: 0,
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 0" }}>
              <span style={{ fontSize: 13, color: colors.accentAube, opacity: 0.6, animation: "quillBob 1.2s ease-in-out infinite" }}>&#9998;</span>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map((dot) => (
                  <div
                    key={dot}
                    style={{
                      width: 4, height: 4, borderRadius: "50%",
                      background: colors.accentAube,
                      opacity: 0.4,
                      animation: `breatheDot 1.8s ease-in-out ${dot * 0.3}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quill-written Ozaia response appearing */}
        {latestOzaiaText && (
          <div style={{ display: "flex", gap: 12, paddingLeft: 4, marginBottom: 16 }}>
            <div
              style={{
                width: 2, minHeight: 20, borderRadius: 1,
                background: colors.accentAube, opacity: 0.4,
                flexShrink: 0,
              }}
            />
            <QuillText
              text={latestOzaiaText}
              color={colors.accentAube}
              delay={200}
              onComplete={handleOzaiaComplete}
              speed={quillSpeedRef.current}
            />
          </div>
        )}

        <div style={{ height: 12 }} />
        </div>{/* end entries wrapper */}
      </div>

      {/* Ozaia murmur — gentle initiation */}
      {ozaiaMurmur && (
        <div
          style={{
            padding: "0 24px 6px",
            textAlign: "center",
            animation: murmurFading ? "ozaiaMurmurOut 0.6s ease forwards" : "ozaiaMurmurIn 0.8s ease forwards",
          }}
        >
          <span
            style={{
              fontFamily: "'Georgia', serif",
              fontStyle: "italic",
              fontSize: 13,
              color: colors.accentAube,
              opacity: 0.7,
              letterSpacing: "0.01em",
            }}
          >
            {ozaiaMurmur}
          </span>
        </div>
      )}

      {/* Input area */}
      <div style={{ padding: "12px 20px 8px", borderTop: `1px solid ${colors.hairline}`, flexShrink: 0 }}>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 10,
            background: colors.inputBg, border: `1px solid ${colors.inputBorder}`,
            borderRadius: 28, padding: "4px 6px 4px 20px",
          }}
        >
          <input
            type="text"
            className={firstVisit ? "diary-input diary-input-pulse" : "diary-input"}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="I am here."
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              color: colors.textStrong, fontFamily: "'Georgia', serif",
              fontStyle: "italic", fontSize: 15, padding: "10px 0",
              "--aube": colors.accentAube,
            }}
          />
          {inputText.trim() && (
            <button
              onClick={handleSend}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: colors.accentAube, border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: colors.bg, fontSize: 16, flexShrink: 0,
              }}
            >
              &#8593;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── QR Code with moon texture background ── */
function MoonQRCode({ size = 80, colors }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const s = size;
    canvas.width = s;
    canvas.height = s;

    // Moon-textured background
    const grad = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grad.addColorStop(0, "#b8b8b8");
    grad.addColorStop(0.6, "#a0a0a0");
    grad.addColorStop(1, "#888888");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, s, s);

    // Crater-like texture
    let seed = 77;
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(rand() * s, rand() * s, 1 + rand() * 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rand() > 0.5 ? 140 : 90},${rand() > 0.5 ? 140 : 90},${rand() > 0.5 ? 140 : 90},${0.15 + rand() * 0.15})`;
      ctx.fill();
    }

    // QR-like pattern overlay (simplified grid)
    ctx.fillStyle = "rgba(30,28,50,0.85)";
    const modules = 11;
    const modSize = s / (modules + 2);
    const offset = modSize;
    // Corner markers
    const drawCorner = (x, y) => {
      ctx.fillRect(x, y, modSize * 3, modSize * 3);
      ctx.clearRect(x + modSize * 0.5, y + modSize * 0.5, modSize * 2, modSize * 2);
      ctx.fillRect(x + modSize, y + modSize, modSize, modSize);
    };
    drawCorner(offset, offset);
    drawCorner(offset + modSize * 8, offset);
    drawCorner(offset, offset + modSize * 8);
    // Data dots
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        if (row < 3 && col < 3) continue;
        if (row < 3 && col > 7) continue;
        if (row > 7 && col < 3) continue;
        if (rand() > 0.45) {
          ctx.fillStyle = "rgba(30,28,50,0.82)";
          ctx.fillRect(offset + col * modSize, offset + row * modSize, modSize * 0.85, modSize * 0.85);
        }
      }
    }
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size, borderRadius: 6, opacity: 0.9 }}
    />
  );
}

/* ── Flip Card for QR + Details ── */
function FlipCard({ front, back, colors }) {
  const [flipped, setFlipped] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const handleFlip = () => {
    setSpinning(true);
    setTimeout(() => { setFlipped(!flipped); setSpinning(false); }, 600);
  };

  return (
    <div
      onClick={handleFlip}
      style={{
        perspective: "600px",
        cursor: "pointer",
        width: "100%",
      }}
    >
      <div
        style={{
          position: "relative",
          transformStyle: "preserve-3d",
          transition: spinning ? "transform 0.6s ease-in-out" : "transform 0.5s ease",
          transform: spinning
            ? "rotateY(720deg)"
            : flipped
            ? "rotateY(180deg)"
            : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div style={{ backfaceVisibility: "hidden" }}>
          {front}
        </div>
        {/* Back */}
        <div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}

/* ── Realistic Moon Phase Icon (canvas-drawn curved terminator) ── */
function MoonPhaseIcon({ size = 42, phase = 0.5, colors }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = size * 2; // retina
    canvas.width = res;
    canvas.height = res;
    const ctx = canvas.getContext("2d");
    const cx = res / 2;
    const cy = res / 2;
    const r = res / 2 - 2;

    ctx.clearRect(0, 0, res, res);

    // Determine if night or day theme from bg color
    const isNight = colors.bg === "#2B2940";
    const litColor = isNight ? "#d0ccc4" : "#e8e4dc";
    const darkColor = isNight ? "#1a1830" : "#b8b0c8";
    const midColor = isNight ? "#2a2642" : "#c8c0d4";

    // Draw lit moon disc with subtle surface texture
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // Base gradient for lit surface (slightly brighter on one side)
    const baseGrad = ctx.createRadialGradient(cx * 0.85, cy * 0.85, 0, cx, cy, r);
    baseGrad.addColorStop(0, litColor);
    baseGrad.addColorStop(0.6, isNight ? "#bbb8b0" : "#ddd8d0");
    baseGrad.addColorStop(1, isNight ? "#9a9690" : "#ccc6be");
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, res, res);

    // Add subtle crater texture
    let seed = 42 + Math.round(phase * 100);
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < 15; i++) {
      const crx = rand() * res, cry = rand() * res, crr = 1 + rand() * (r * 0.08);
      ctx.beginPath();
      ctx.arc(crx, cry, crr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${isNight ? "60,58,50" : "140,135,128"},${0.1 + rand() * 0.12})`;
      ctx.fill();
    }
    // Maria (dark patches)
    for (let i = 0; i < 5; i++) {
      const mx = (0.2 + rand() * 0.6) * res, my = (0.2 + rand() * 0.6) * res, mr = (0.05 + rand() * 0.12) * res;
      const mGrad = ctx.createRadialGradient(mx, my, 0, mx, my, mr);
      mGrad.addColorStop(0, `rgba(${isNight ? "80,78,72" : "160,155,148"},0.2)`);
      mGrad.addColorStop(1, "transparent");
      ctx.fillStyle = mGrad;
      ctx.fillRect(0, 0, res, res);
    }

    // Draw moon phase shadow using pixel-perfect column scanning
    // Phase 0 = new moon (all dark), 1 = full moon (all lit)
    const illum = Math.max(0, Math.min(1, phase));

    if (illum < 0.98) {
      // Terminator position: maps illumination to x-coordinate
      // illum 0 = terminator at far left (all shadow), illum 1 = far right (no shadow)
      // The terminator is an ellipse with radiusX that depends on illumination
      const tX = (illum * 2 - 1) * r; // -r (new) to +r (full)

      // Paint shadow column by column using imageData for reliability
      const imgData = ctx.getImageData(0, 0, res, res);
      const data = imgData.data;
      const dr = parseInt(darkColor.slice(1, 3), 16);
      const dg = parseInt(darkColor.slice(3, 5), 16);
      const db = parseInt(darkColor.slice(5, 7), 16);

      for (let py = 0; py < res; py++) {
        const dy = py - cy;
        const diskHalf = Math.sqrt(Math.max(0, r * r - dy * dy));
        if (diskHalf <= 0) continue;
        // Terminator x at this row: ellipse with radiusX = |tX|, radiusY = r
        const termHalf = r > 0 ? (Math.abs(tX) * Math.sqrt(Math.max(0, r * r - dy * dy)) / r) : 0;
        const termXAtRow = tX >= 0 ? termHalf : -termHalf;

        for (let px = 0; px < res; px++) {
          const dx = px - cx;
          // Check if inside moon disk
          if (dx * dx + dy * dy > r * r) continue;
          // Shadow condition: pixel is in shadow if it's on the dark side of terminator
          // For waxing (illum 0..0.5): shadow on the RIGHT of terminator
          // For waning (illum 0.5..1): shadow on the LEFT of terminator
          let inShadow;
          if (illum <= 0.5) {
            inShadow = dx > termXAtRow;
          } else {
            inShadow = dx < termXAtRow;
          }
          if (inShadow) {
            const idx = (py * res + px) * 4;
            // Blend shadow with soft edge near terminator
            const dist = Math.abs(dx - termXAtRow);
            const blend = dist < 3 ? (dist / 3) : 1;
            data[idx] = Math.round(data[idx] * (1 - blend) + dr * blend);
            data[idx + 1] = Math.round(data[idx + 1] * (1 - blend) + dg * blend);
            data[idx + 2] = Math.round(data[idx + 2] * (1 - blend) + db * blend);
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    ctx.restore();

    // Outer subtle rim
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(${isNight ? "245,240,230" : "43,41,64"},0.08)`;
    ctx.stroke();

  }, [size, phase, colors.bg]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size, borderRadius: "50%" }}
    />
  );
}

/* ── Profile Screen ── */
function ProfileScreen({ colors, theme, onToggleTheme, soundOn, onToggleSound }) {
  const [expandedAppt, setExpandedAppt] = useState(null);
  const [showAttentionFlow, setShowAttentionFlow] = useState(false);

  const appointments = [
    { label: "Something that matters", detail: "Dr. Moreau, gynecologist check-up", when: "In 3 days", color: colors.accentRose },
    { label: "A gentle rhythm to keep", detail: "Iron supplement, morning", when: "Every day", color: colors.accentAube },
    { label: "A moment for yourself", detail: "Prenatal yoga with Sarah", when: "Thursday", color: colors.accentAube },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
      {/* Header: "You" with mood moon */}
      <div style={{ textAlign: "center", padding: "20px 0 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <MoonPhaseIcon size={56} phase={0.6} colors={colors} />
        <h2
          style={{
            fontFamily: "'Georgia', serif", fontStyle: "italic", fontWeight: 300,
            fontSize: 24, color: colors.accentAube, margin: "14px 0 4px",
          }}
        >
          You
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: colors.textSoft, margin: 0 }}>
          Listening since April 2026
        </p>
      </div>

      {/* ── State Engine ── */}
      <div style={{ padding: "20px", borderRadius: 16, border: `1px solid ${colors.hairline}`, background: colors.cardBg, marginBottom: 16 }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: colors.accentRose, margin: "0 0 14px" }}>
          How you are
        </p>

        {/* State circles: 3 dimensions with visible crescents */}
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 16 }}>
          {[
            { label: "Energy", state: "Quietly tired", phase: 0.03 },
            { label: "Mood", state: "In passage", phase: 0.45 },
            { label: "Cycle", state: "Day 18", phase: 0.7 },
          ].map((dim, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <MoonPhaseIcon size={42} phase={dim.phase} colors={colors} />
              <p style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontSize: 11, color: colors.textStrong, margin: "8px 0 2px" }}>
                {dim.state}
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: colors.textSoft, margin: 0, opacity: 0.6 }}>
                {dim.label}
              </p>
            </div>
          ))}
        </div>

        {/* Ozaia's state observation */}
        <div style={{ display: "flex", gap: 10, paddingLeft: 2 }}>
          <div style={{ width: 2, minHeight: 16, borderRadius: 1, background: colors.accentAube, opacity: 0.3, flexShrink: 0 }} />
          <p style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.5, color: colors.accentAube, margin: 0, opacity: 0.8 }}>
            Your body is asking for rest more than usual. That is not weakness.
          </p>
        </div>
      </div>

      {/* ── Your journey timeline ── */}
      {(function() {
        var journeyData = [0.15, 0.12, 0.20, 0.25, 0.18, 0.30, 0.35, 0.28, 0.40, 0.45, 0.38, 0.50, 0.55, 0.45];
        var dayLabels = ["M", "T", "W", "T", "F", "S", "S", "M", "T", "W", "T", "F", "S", "S"];
        return (
          <div style={{ padding: "20px", borderRadius: 16, border: "1px solid " + colors.hairline, background: colors.cardBg, marginBottom: 16 }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: colors.accentAube, margin: "0 0 14px" }}>
              Your journey
            </p>
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <div style={{ display: "flex", gap: 6, minWidth: "max-content", justifyContent: "center" }}>
                {journeyData.map(function(phase, i) {
                  var isToday = i === journeyData.length - 1;
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{
                        borderRadius: "50%",
                        border: isToday ? "1.5px solid " + colors.accentAube : "1.5px solid transparent",
                        padding: 2,
                        boxShadow: isToday ? "0 0 8px " + colors.accentAube + "30" : "none",
                        transition: "all 0.3s ease",
                      }}>
                        <MoonPhaseIcon size={18} phase={phase} colors={colors} />
                      </div>
                      <span style={{
                        fontFamily: "'Inter', sans-serif", fontSize: 8,
                        color: isToday ? colors.accentAube : colors.textSoft,
                        opacity: isToday ? 1 : 0.5,
                        fontWeight: isToday ? 600 : 400,
                      }}>
                        {dayLabels[i]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <p style={{
              fontFamily: "'Georgia', serif", fontStyle: "italic",
              fontSize: 13, lineHeight: 1.5,
              color: colors.accentAube, margin: "14px 0 0",
              textAlign: "center", opacity: 0.8,
            }}>
              You have been finding your way back. Slowly, but you have.
            </p>
          </div>
        );
      })()}

      {/* ── Daily message from Ozaia (replaces Memory) ── */}
      <div style={{ padding: "20px", borderRadius: 16, border: `1px solid ${colors.accentAube}18`, background: `${colors.accentAube}06`, marginBottom: 16 }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: colors.accentAube, margin: "0 0 12px", opacity: 0.6 }}>
          From Oza&#305;a
        </p>
        <p style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontSize: 15, lineHeight: 1.6, color: colors.accentAube, margin: 0 }}>
          "What you hold in silence still speaks. And I hear it."
        </p>
      </div>

      {/* ── Medical info (important encart) ── */}
      <div style={{
        padding: "18px 20px", borderRadius: 16, marginBottom: 16,
        border: "1px solid " + colors.accentRose + "30",
        background: colors.accentRose + "08",
      }}>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 10,
          fontWeight: 500, letterSpacing: "0.12em",
          textTransform: "uppercase", color: colors.accentRose,
          margin: "0 0 14px", opacity: 0.7,
        }}>
          Medical
        </p>
        {[
          { label: "Blood type", value: "O+" },
          { label: "Allergies", value: "Penicillin" },
          { label: "Current treatment", value: "Iron supplement" },
          { label: "Cycle", value: "Day 18 of 28" },
          { label: "Emergency contact", value: "Maman" },
        ].map(function(item, i) {
          return (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "8px 0",
              borderBottom: i < 4 ? "1px solid " + colors.hairline : "none",
            }}>
              <span style={{
                fontFamily: "'Inter', sans-serif", fontSize: 12,
                color: colors.textSoft,
              }}>
                {item.label}
              </span>
              <span style={{
                fontFamily: "'Georgia', serif", fontStyle: "italic",
                fontSize: 13, color: colors.textStrong,
              }}>
                {item.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Upcoming moments (appointments as post-its) ── */}
      <div style={{ padding: "20px", borderRadius: 16, border: `1px solid ${colors.hairline}`, background: colors.cardBg, marginBottom: 16 }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: colors.accentAube, margin: "0 0 14px" }}>
          Upcoming moments
        </p>

        {appointments.map((appt, i) => (
          <div
            key={i}
            onClick={() => setExpandedAppt(expandedAppt === i ? null : i)}
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              background: expandedAppt === i ? `${appt.color}12` : `${appt.color}06`,
              border: `1px solid ${appt.color}${expandedAppt === i ? "30" : "15"}`,
              marginBottom: 8,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontSize: 14, color: colors.textStrong, margin: 0 }}>
                {appt.label}
              </p>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: colors.textSoft, opacity: 0.7 }}>
                {appt.when}
              </span>
            </div>
            {expandedAppt === i && (
              <p
                style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 12,
                  color: colors.text, margin: "8px 0 0", opacity: 0.7,
                  animation: "fadeSlideIn 0.3s ease",
                }}
              >
                {appt.detail}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ── Send an Attention ── */}
      <div style={{ padding: "20px", borderRadius: 16, border: `1px solid ${colors.hairline}`, background: colors.cardBg, marginBottom: 16 }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: colors.accentRose, margin: "0 0 14px" }}>
          Attentions
        </p>

        {!showAttentionFlow ? (
          <button
            onClick={() => setShowAttentionFlow(true)}
            style={{
              width: "100%", padding: "14px",
              borderRadius: 12,
              border: `1px dashed ${colors.accentAube}44`,
              background: `${colors.accentAube}06`,
              cursor: "pointer",
              transition: "all 0.4s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${colors.accentAube}12`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = `${colors.accentAube}06`; }}
          >
            <span style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontSize: 14, color: colors.accentAube }}>
              Send an attention
            </span>
          </button>
        ) : (
          <div style={{ animation: "fadeSlideIn 0.4s ease" }}>
            <p style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontSize: 14, color: colors.text, margin: "0 0 12px", lineHeight: 1.5 }}>
              Who is this for?
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {["For me", "For someone"].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setShowAttentionFlow(false)}
                  style={{
                    flex: 1, padding: "12px",
                    borderRadius: 10,
                    border: `1px solid ${colors.accentAube}33`,
                    background: `${colors.accentAube}08`,
                    cursor: "pointer",
                    fontFamily: "'Georgia', serif",
                    fontStyle: "italic", fontSize: 13,
                    color: colors.accentAube,
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${colors.accentAube}18`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = `${colors.accentAube}08`; }}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
              <MoonQRCode size={72} colors={colors} />
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: colors.textSoft, textAlign: "center", margin: "8px 0 0", opacity: 0.5 }}>
              Your signature
            </p>
          </div>
        )}
      </div>

      {/* ── Theme toggle ── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        {["day", "night"].map((mode) => (
          <button
            key={mode}
            onClick={() => onToggleTheme(mode)}
            style={{
              flex: 1, padding: "16px 14px", borderRadius: 14,
              border: `1px solid ${theme === mode ? colors.accentAube + "66" : colors.hairline}`,
              background: mode === "day" ? "#F4EFF5" : "#2B2940",
              cursor: "pointer", textAlign: "center",
              boxShadow: theme === mode ? `0 0 20px ${colors.accentAube}22` : "none",
              transition: "all 0.4s ease",
            }}
          >
            <span style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontSize: 15, color: mode === "day" ? "#2B2940" : "#F5F0E6", display: "block", marginBottom: 2 }}>
              {mode === "day" ? "Day" : "Night"}
            </span>
            <span style={{ fontSize: 10, color: mode === "day" ? "rgba(43,41,64,0.55)" : "rgba(245,240,230,0.55)" }}>
              {mode === "day" ? "Presence" : "Retreat"}
            </span>
          </button>
        ))}
      </div>

      {/* ── Soundscape: discreet inline toggle ── */}
      <div
        onClick={onToggleSound}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", borderRadius: 12,
          border: "1px solid " + colors.hairline,
          background: colors.cardBg, marginBottom: 16,
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14, opacity: 0.5 }}>&#9835;</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: colors.textSoft }}>
            432 Hz
          </span>
        </div>
        <div style={{
          width: 36, height: 20, borderRadius: 10,
          background: soundOn ? colors.accentAube : colors.hairline,
          position: "relative", opacity: 0.7,
          transition: "background 0.3s ease",
        }}>
          <div style={{
            width: 16, height: 16, borderRadius: "50%", background: "#fff",
            position: "absolute", top: 2,
            right: soundOn ? 2 : 18,
            transition: "right 0.3s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }} />
        </div>
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
}

/* ── Library Screen ── */
function LibraryScreen({ colors }) {
  var libraryContent = {
    articles: [
      { title: "When rest feels like failure", readTime: "8 min read", category: "Mindset", moonPhase: 0.2 },
      { title: "Your cycle is not your enemy", readTime: "6 min read", category: "Body", moonPhase: 0.45 },
      { title: "The invisible weight of being the one who remembers", readTime: "10 min read", category: "Relationships", moonPhase: 0.7 },
    ],
    podcasts: [
      { title: "Dr. Amara Osei on postpartum silence", duration: "34 min", guest: "Dr. Amara Osei", moonPhase: 0.35 },
      { title: "Sleep, hormones, and the 3 a.m. spiral", duration: "28 min", guest: "Panel", moonPhase: 0.6 },
    ],
    videos: [
      { title: "What to do when you cannot sleep", duration: "2 min", moonPhase: 0.15 },
      { title: "One breathing exercise that actually works", duration: "90 sec", moonPhase: 0.85 },
    ],
  };

  var activeFilter = useState("all");
  var filter = activeFilter[0];
  var setFilter = activeFilter[1];

  function renderCard(item, type, index) {
    var badge = type === "articles" ? item.category : type === "podcasts" ? "Podcast" : "Video";
    var meta = type === "articles" ? item.readTime : item.duration;
    var guestLine = type === "podcasts" && item.guest ? item.guest : null;

    return (
      <div
        key={type + "-" + index}
        style={{
          padding: "16px 18px",
          borderRadius: 14,
          border: "1px solid " + colors.hairline,
          background: colors.cardBg,
          marginBottom: 10,
          cursor: "pointer",
          transition: "all 0.4s ease",
          position: "relative",
        }}
        onMouseEnter={function(e) { e.currentTarget.style.boxShadow = "0 4px 20px " + colors.accentAube + "18"; e.currentTarget.style.borderColor = colors.accentAube + "40"; e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={function(e) { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = colors.hairline; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flexShrink: 0, marginTop: 2, opacity: 0.5 }}>
            <MoonPhaseIcon size={18} phase={item.moonPhase} colors={colors} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              fontFamily: "'Georgia', serif", fontStyle: "italic",
              fontSize: 14, lineHeight: 1.5,
              color: colors.textStrong, margin: "0 0 6px",
            }}>
              {item.title}
            </p>
            {guestLine && (
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 11,
                color: colors.textSoft, margin: "0 0 4px",
              }}>
                with {guestLine}
              </p>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                fontFamily: "'Inter', sans-serif", fontSize: 9,
                fontWeight: 500, letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "2px 7px", borderRadius: 6,
                background: colors.accentAube + "12",
                color: colors.accentAube, opacity: 0.8,
              }}>
                {badge}
              </span>
              <span style={{
                fontFamily: "'Inter', sans-serif", fontSize: 10,
                color: colors.textSoft, opacity: 0.6,
              }}>
                {meta}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  var filters = [
    { id: "all", label: "All" },
    { id: "articles", label: "Articles" },
    { id: "podcasts", label: "Podcasts" },
    { id: "videos", label: "Videos" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", padding: "20px 0 16px" }}>
        <h2 style={{
          fontFamily: "'Georgia', serif", fontStyle: "italic", fontWeight: 300,
          fontSize: 24, color: colors.accentAube, margin: "0 0 4px",
        }}>
          Library
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: colors.textSoft, margin: 0 }}>
          Words, voices, and breath
        </p>
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, justifyContent: "center" }}>
        {filters.map(function(f) {
          var isActive = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={function() { setFilter(f.id); }}
              style={{
                background: isActive ? colors.accentAube + "18" : "transparent",
                border: "1px solid " + (isActive ? colors.accentAube + "44" : colors.hairline),
                borderRadius: 20, padding: "5px 14px",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif", fontSize: 10,
                letterSpacing: "0.06em",
                color: isActive ? colors.accentAube : colors.textSoft,
                transition: "all 0.3s ease",
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Articles */}
      {(filter === "all" || filter === "articles") && (
        <div style={{ marginBottom: 16 }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 500,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: colors.accentRose, margin: "0 0 10px",
          }}>
            Articles
          </p>
          {libraryContent.articles.map(function(item, i) { return renderCard(item, "articles", i); })}
        </div>
      )}

      {/* Podcasts */}
      {(filter === "all" || filter === "podcasts") && (
        <div style={{ marginBottom: 16 }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 500,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: colors.accentRose, margin: "0 0 10px",
          }}>
            Podcasts
          </p>
          {libraryContent.podcasts.map(function(item, i) { return renderCard(item, "podcasts", i); })}
        </div>
      )}

      {/* Videos */}
      {(filter === "all" || filter === "videos") && (
        <div style={{ marginBottom: 16 }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 500,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: colors.accentRose, margin: "0 0 10px",
          }}>
            Short videos
          </p>
          {libraryContent.videos.map(function(item, i) { return renderCard(item, "videos", i); })}
        </div>
      )}

      <div style={{ height: 20 }} />
    </div>
  );
}

/* ── Circles Screen ── */
function CirclesScreen({ colors }) {
  const [selectedCircle, setSelectedCircle] = useState(null);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: colors.accentRose, margin: "0 0 8px" }}>
          Private circles
        </p>
        <h2 style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontWeight: 300, fontSize: 22, color: colors.textStrong, margin: "0 0 6px", lineHeight: 1.3 }}>
          Consent as a lunar cycle.
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: colors.textSoft, margin: 0, lineHeight: 1.5 }}>
          Invite someone into your Ozaia for a chosen cycle.
        </p>
      </div>

      {/* Invite button */}
      <button
        style={{
          width: "100%", padding: "16px", borderRadius: 16,
          border: `1px dashed ${colors.accentAube}55`,
          background: `${colors.accentAube}08`,
          cursor: "pointer", marginBottom: 20, marginTop: 16,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          transition: "all 0.4s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = `${colors.accentAube}15`; e.currentTarget.style.borderColor = `${colors.accentAube}88`; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = `${colors.accentAube}08`; e.currentTarget.style.borderColor = `${colors.accentAube}55`; }}
      >
        <span style={{ fontSize: 20, color: colors.accentAube }}>+</span>
        <span style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontSize: 15, color: colors.accentAube }}>
          Create a circle
        </span>
      </button>

      {/* Circle cards */}
      {demoCircles.map((circle, i) => (
        <div
          key={i}
          onClick={() => setSelectedCircle(selectedCircle === i ? null : i)}
          style={{
            padding: "20px", borderRadius: 16,
            border: `1px solid ${selectedCircle === i ? colors.accentAube + "55" : colors.hairline}`,
            background: selectedCircle === i ? `${colors.accentAube}08` : colors.cardBg,
            marginBottom: 12, cursor: "pointer", transition: "all 0.4s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <NasaMoon size={32} phase={circle.moonPhase} colors={colors} glow={false} breathing={false} />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontSize: 17, color: colors.textStrong, margin: "0 0 2px" }}>
                {circle.name}
              </p>
              <p style={{ fontSize: 12, color: colors.textSoft, margin: 0, fontFamily: "'Inter', sans-serif" }}>
                {circle.duration} cycle
              </p>
            </div>
            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <p style={{ fontSize: 11, color: colors.accentAube, margin: 0, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                {circle.hoursLeft !== undefined ? `${circle.hoursLeft}h left` : `${circle.daysLeft}d left`}
              </p>
              <MoonQRCode size={28} colors={colors} />
            </div>
          </div>
          <p style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontSize: 13, color: colors.text, margin: 0, lineHeight: 1.5, opacity: 0.8 }}>
            {circle.phase}
          </p>

          {selectedCircle === i && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${colors.hairline}` }}>
              <div style={{ height: 3, borderRadius: 2, background: colors.hairline, marginBottom: 10, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%", borderRadius: 2,
                    background: `linear-gradient(90deg, ${colors.accentAube}, ${colors.accentRose})`,
                    width: `${((1 - (circle.daysLeft || circle.hoursLeft / 24) / parseInt(circle.duration)) * 100).toFixed(0)}%`,
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
              <p style={{ fontSize: 11, color: colors.textSoft, fontFamily: "'Inter', sans-serif", margin: 0, textAlign: "center", fontStyle: "italic" }}>
                When the cycle ends, both presences gently forget.
              </p>
            </div>
          )}
        </div>
      ))}
      <div style={{ height: 20 }} />
    </div>
  );
}

/* ── Whisper Notification ── */
function WhisperNotification({ colors }) {
  const [visible, setVisible] = useState(false);
  const [currentNotif, setCurrentNotif] = useState(0);
  const timerRef = useRef(null);

  const notifications = [
    { text: "Something is on its way to you.", type: "attention" },
    { text: "Tomorrow, something that matters. You already know what it is.", type: "appointment" },
    { text: "A new voice just arrived. Someone who understands.", type: "content" },
    { text: "A gentle rhythm to keep, when you are ready.", type: "treatment" },
  ];

  useEffect(() => {
    // Show first notification after 8 seconds, then cycle
    const show = () => {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          setCurrentNotif((prev) => (prev + 1) % notifications.length);
        }, 600);
      }, 4500);
    };

    timerRef.current = setTimeout(show, 8000);
    const interval = setInterval(show, 18000);
    return () => { clearTimeout(timerRef.current); clearInterval(interval); };
  }, []);

  const notif = notifications[currentNotif];

  return (
    <div
      style={{
        position: "absolute",
        top: 56,
        left: 16,
        right: 16,
        zIndex: 100,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        style={{
          padding: "14px 18px",
          borderRadius: 16,
          background: `${colors.bg}ee`,
          backdropFilter: "blur(20px)",
          border: `1px solid ${colors.accentAube}25`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${colors.accentAube}10`,
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
        onClick={() => setVisible(false)}
      >
        {/* Small moon icon */}
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: `radial-gradient(circle at 40% 40%, ${colors.accentAube}40, ${colors.accentAube}10)`,
          border: `1px solid ${colors.accentAube}30`,
          flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginTop: 1,
        }}>
          <span style={{ fontSize: 12, opacity: 0.8 }}>&#9790;</span>
        </div>
        <div>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 9,
            fontWeight: 500, letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: colors.accentAube, margin: "0 0 4px", opacity: 0.6,
          }}>
            Oza&#305;a
          </p>
          <p style={{
            fontFamily: "'Georgia', serif", fontStyle: "italic",
            fontSize: 13, lineHeight: 1.5,
            color: colors.accentAube, margin: 0,
          }}>
            {notif.text}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Ambient Soundscape (same ambient.mp3 as the site) ── */
function AmbientSoundscape({ active }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    if (!audioRef.current) {
      const audio = new Audio("audio/ambient.mp3");
      audio.loop = true;
      audio.volume = 0;
      audioRef.current = audio;
    }

    const audio = audioRef.current;
    const playPromise = audio.play();
    if (playPromise) playPromise.catch(() => {});

    // Fade in over 3 seconds
    let vol = 0;
    const fadeIn = setInterval(() => {
      vol = Math.min(vol + 0.01, 0.35);
      audio.volume = vol;
      if (vol >= 0.35) clearInterval(fadeIn);
    }, 50);

    return function() {
      clearInterval(fadeIn);
      // Fast fade out (~300ms)
      var v = audio.volume;
      var fadeOut = setInterval(function() {
        v = Math.max(v - 0.05, 0);
        audio.volume = v;
        if (v <= 0) { clearInterval(fadeOut); audio.pause(); }
      }, 30);
    };
  }, [active]);

  return null;
}

/* ═══════════════════════════════════════════
   Main App
   ═══════════════════════════════════════════ */
export default function OzaiaPrototype() {
  const [theme, setTheme] = useState("night");
  const [screen, setScreen] = useState("onboarding");
  const [activeTab, setActiveTab] = useState("diary");
  const [soundscapeActive, setSoundscapeActive] = useState(false);
  const [soundStarted, setSoundStarted] = useState(false);
  const colors = palette[theme];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Fraunces:ital,wght@0,300;0,400;1,300;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #111; }
        @keyframes haloBreath {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.06); }
        }
        @keyframes ozaiaMurmurIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ozaiaMurmurOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-4px); }
        }
        @keyframes moonDescend {
          0% { top: 8px; opacity: 0.3; }
          70% { top: calc(100% - 130px); opacity: 1; }
          85% { top: calc(100% - 135px); opacity: 1; }
          100% { top: calc(100% - 130px); opacity: 1; }
        }
        @keyframes moonAscend {
          0% { top: calc(100% - 130px); opacity: 1; }
          100% { top: 8px; opacity: 0; }
        }
        @keyframes moonFloat {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-4px); }
        }
        @keyframes breatheDot {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes quillBob {
          0%, 100% { transform: translateY(0) rotate(-15deg); }
          50% { transform: translateY(-2px) rotate(-10deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes welcomeFadeIn {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes placeholderPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }
        input::placeholder { opacity: 0.6; }
        .diary-input::placeholder { color: var(--aube) !important; opacity: 0.7; }
        .diary-input-pulse::placeholder { animation: placeholderPulse 2.5s ease-in-out infinite; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>
      <AmbientSoundscape active={soundscapeActive} />
      <div onClick={function() { if (!soundStarted) { setSoundStarted(true); setSoundscapeActive(true); } }}>
        <PhoneFrame colors={colors}>
          {screen === "onboarding" ? (
            <OnboardingScreen colors={colors} onComplete={() => { setScreen("app"); setActiveTab("diary"); }} />
          ) : (
            <>
              {/* Whisper notifications overlay */}
              <WhisperNotification colors={colors} />
              {activeTab === "diary" && <DiaryScreen colors={colors} />}
              {activeTab === "library" && <LibraryScreen colors={colors} />}
              {activeTab === "circles" && <CirclesScreen colors={colors} />}
              {activeTab === "profile" && <ProfileScreen colors={colors} theme={theme} onToggleTheme={setTheme} soundOn={soundscapeActive} onToggleSound={function() { setSoundscapeActive(function(v) { return !v; }); }} />}
              <TabBar activeTab={activeTab} onTabChange={setActiveTab} colors={colors} />
            </>
          )}
        </PhoneFrame>
      </div>
    </>
  );
}
