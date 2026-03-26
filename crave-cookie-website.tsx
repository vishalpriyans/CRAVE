import {
  useState,
  useEffect,
  useRef,
  useCallback,
  Suspense,
  useMemo,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";

// ─── Data ────────────────────────────────────────────────────────────────────

const COOKIES = [
  {
    id: "choc-chip",
    name: "Original\nChocolate Chip",
    nameShort: "Choc Chip",
    desc: "The classic done right. Golden buttery dough loaded with melty chocolate chips and crispy edges. Simple, perfect, addictive.",
    price: "₹130",
    color: "#3E2723",
    bg: "#FFF3E0",
    accent: "#FF6F00",
    emoji: "🍪",
    cookieBase: "#C8A06E",
    cookieDark: "#8B5E3C",
    chipColor: "#2E1B0E",
    crackColor: "#9E6B3E",
    particleColor: "#FF6F00",
    modelPath: "/chocolate-chip.glb",
  },
  {
    id: "triple-choc",
    name: "Triple\nChocolate",
    nameShort: "Triple Choc",
    desc: "For the chocolate obsessed. Dark cocoa dough with milk and white chocolate chunks — three layers of rich, fudgy heaven.",
    price: "₹150",
    color: "#1B0E07",
    bg: "#F3E5F5",
    accent: "#7B1FA2",
    emoji: "🍫",
    cookieBase: "#4E342E",
    cookieDark: "#1B0E07",
    chipColor: "#F5F5F5",
    crackColor: "#3E2723",
    particleColor: "#7B1FA2",
    modelPath: "/triple.glb",
  },
  {
    id: "biscoff",
    name: "Biscoff",
    nameShort: "Biscoff",
    desc: "Crushed Biscoff cookies baked into spiced cinnamon dough with a molten speculoos butter core. Warm, caramelly, unreal.",
    price: "₹150",
    color: "#4E342E",
    bg: "#EFEBE9",
    accent: "#BF7840",
    emoji: "🔥",
    cookieBase: "#C9956B",
    cookieDark: "#8B5E2A",
    chipColor: "#E8D5B7",
    crackColor: "#A0724A",
    particleColor: "#BF7840",
    modelPath: "/biscoff.glb",
  },
];

// ─── 3D Cookie Model Component ──────────────────────────────────────────────────

function CookieModel({ modelPath, isActive }: { modelPath: string; isActive: boolean }) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<any>(null);
  const modelRef = useRef<any>(null);

  // Center the model once on mount
  useEffect(() => {
    if (!modelRef.current) return;
    const box = new THREE.Box3().setFromObject(modelRef.current);
    const center = box.getCenter(new THREE.Vector3());
    // Offset the model so its center sits at the group's origin
    modelRef.current.position.set(-center.x, -center.y, -center.z);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Fixed rotation on the GROUP — no spin
    groupRef.current.rotation.x = Math.PI / 2;
    groupRef.current.rotation.y = 0;
    groupRef.current.rotation.z = 0;

    // Gentle float on the GROUP
    groupRef.current.position.y = Math.sin(t * 1.0) * 0.08;

    // NO scale animation — always same size
  });

  return (
    <group ref={groupRef} scale={1.6}>
      <primitive ref={modelRef} object={scene} />
    </group>
  );
}

// ─── CSS Fallback Cookie Component ───────────────────────────────────────────

const CSSCookie = ({ cookie, isActive }: { cookie: typeof COOKIES[0]; isActive: boolean }) => {
  const chips = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * 360 + i * 40;
      const r = 18 + (i % 3) * 22;
      positions.push({
        top: `${42 + Math.sin((angle * Math.PI) / 180) * r}%`,
        left: `${42 + Math.cos((angle * Math.PI) / 180) * r}%`,
        width: 16 + (i % 3) * 8,
        height: 12 + (i % 2) * 6,
        rotation: i * 45,
      });
    }
    return positions;
  }, []);

  return (
    <div
      style={{
        width: 280,
        height: 280,
        margin: "0 auto",
        perspective: 900,
        transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        transform: `scale(${isActive ? 1 : 0.6})`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          animation: "gentleFloat 3s ease-in-out infinite",
        }}
      >
        {/* Shadow */}
        <div
          style={{
            position: "absolute",
            bottom: -20,
            left: "12%",
            width: "76%",
            height: 30,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.15)",
            filter: "blur(14px)",
          }}
        />

        {/* Cookie body */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: `radial-gradient(circle at 32% 32%, ${cookie.cookieBase}, ${cookie.cookieDark})`,
            boxShadow: `
              inset -10px -10px 24px rgba(0,0,0,0.35),
              inset 5px 5px 12px rgba(255,255,255,0.15),
              0 24px 48px rgba(0,0,0,0.22),
              0 8px 20px rgba(0,0,0,0.12)
            `,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Chips */}
          {chips.map((chip, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: chip.width,
                height: chip.height,
                borderRadius: "42%",
                background: cookie.chipColor,
                top: chip.top,
                left: chip.left,
                boxShadow: "inset -1px -2px 4px rgba(0,0,0,0.25)",
                transform: `rotate(${chip.rotation}deg)`,
              }}
            />
          ))}

          {/* Top sheen */}
          <div
            style={{
              position: "absolute",
              top: "6%",
              left: "12%",
              width: "38%",
              height: "28%",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(255,255,255,0.22) 0%, transparent 70%)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Cookie 3D Component (with GLB model) ────────────────────────────────────

const Cookie3D = ({ cookie, isActive }: { cookie: typeof COOKIES[0]; isActive: boolean }) => {
  // If this cookie has a GLB model, render 3D canvas
  if (cookie.modelPath) {
    return (
      <div
        style={{
          width: 320,
          height: 320,
          margin: "0 auto",
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, -10, -5]} intensity={0.3} />
          
          <Suspense fallback={null}>
            <CookieModel modelPath={cookie.modelPath} isActive={isActive} />
            <Environment preset="studio" />
          </Suspense>
        </Canvas>
      </div>
    );
  }

  // No GLB model — render CSS cookie fallback
  return <CSSCookie cookie={cookie} isActive={isActive} />;
};

// ─── Floating Particles (DOM-based) ──────────────────────────────────────────

const Particles = ({ color, count = 20, isActive }: { color: string; count?: number; isActive: boolean }) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 8 + Math.random() * 4,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
    }));
  }, [count]);

  if (!isActive) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: color,
            opacity: 0.17,
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
};


// ─── Progress Bar ─────────────────────────────────────────────────────────────

const ProgressBar = ({ progress, color }: { progress: number; color: string }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: `${Math.min(progress, 1) * 100}%`,
      height: 3,
      background: `linear-gradient(90deg, ${color}, ${color}88)`,
      zIndex: 300,
      transition: "width 0.1s linear, background 0.5s ease",
    }}
  />
);

// ─── Hero Section ─────────────────────────────────────────────────────────────

const HeroSection = ({ onScrollDown }: { onScrollDown: () => void }) => {
  return (
    <section
      style={{
        height: "100vh",
        scrollSnapAlign: "start",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={onScrollDown}
    >
      <video
        src="/images/hero video.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          display: "block",
        }}
      />

      {/* Scroll hint */}
      <div
        style={{
          position: "absolute",
          bottom: 36,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          animation: "bounce 2s ease-in-out infinite",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: "#5D4037",
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5v14M5 12l7 7 7-7"
            stroke="#5D4037"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
};

// ─── Cookie Section ───────────────────────────────────────────────────────────

const CookieSection = ({ cookie, index, total, isActive }: { cookie: typeof COOKIES[0]; index: number; total: number; isActive: boolean }) => {
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
        } else {
          setRevealed(false);
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const show = revealed && isActive;

  return (
    <section
      ref={sectionRef}
      style={{
        height: "100vh",
        scrollSnapAlign: "start",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: cookie.bg,
        position: "relative",
        overflow: "hidden",
        padding: "0 24px",
        transition: "background 0.6s ease",
      }}
    >
      {/* Floating particles */}
      <Particles color={cookie.particleColor} count={18} isActive={isActive} />

      {/* Section counter */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          fontSize: 13,
          fontWeight: 800,
          color: cookie.accent,
          opacity: 0.7,
          letterSpacing: 1,
          zIndex: 1,
        }}
      >
        {String(index + 1).padStart(2, "0")} /{" "}
        {String(total).padStart(2, "0")}
      </div>

      {/* Background giant emoji */}
      <div
        style={{
          position: "absolute",
          fontSize: "clamp(100px, 18vw, 160px)",
          opacity: 0.055,
          top: "8%",
          right: -16,
          userSelect: "none",
          lineHeight: 1,
          filter: "blur(1px)",
          transform: `rotate(${8 + index * 5}deg)`,
        }}
      >
        {cookie.emoji}
      </div>

      {/* Subtle corner blob */}
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: cookie.accent,
          opacity: 0.07,
          filter: "blur(40px)",
        }}
      />

      {/* Cookie + Text as ONE centered group */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Cookie3D
          cookie={cookie}
          isActive={isActive}
        />

        {/* Text Content */}
        <div
          style={{
            textAlign: "center",
            marginTop: 16,
            maxWidth: 380,
            padding: "0 8px",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "4px",
              color: cookie.accent,
              display: "block",
              marginBottom: 6,
              opacity: show ? 1 : 0,
              transform: show ? "translateY(0)" : "translateY(30px)",
              filter: show ? "blur(0px)" : "blur(4px)",
              transition: "all 0.6s ease 0s",
            }}
          >
            {cookie.emoji} Flavor {String(index + 1).padStart(2, "0")}
          </span>

          <h2
            style={{
              fontSize: "clamp(30px, 8vw, 46px)",
              fontWeight: 900,
              color: cookie.color,
              margin: "4px 0 8px",
              lineHeight: 1.05,
              letterSpacing: "-1px",
              whiteSpace: "pre-line",
              opacity: show ? 1 : 0,
              transform: show ? "translateY(0)" : "translateY(30px)",
              filter: show ? "blur(0px)" : "blur(4px)",
              transition: "all 0.65s ease 0.1s",
            }}
          >
            {cookie.name}
          </h2>

          <p
            style={{
              fontSize: "clamp(13px, 3vw, 15px)",
              color: cookie.color,
              opacity: show ? 0.7 : 0,
              lineHeight: 1.7,
              margin: "0 0 20px",
              transform: show ? "translateY(0)" : "translateY(30px)",
              filter: show ? "blur(0px)" : "blur(4px)",
              transition: "all 0.65s ease 0.2s",
            }}
          >
            {cookie.desc}
          </p>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 16,
              opacity: show ? 1 : 0,
              transform: show ? "translateY(0)" : "translateY(30px)",
              filter: show ? "blur(0px)" : "blur(4px)",
              transition: "all 0.65s ease 0.3s",
            }}
          >
          <span
            style={{
              fontSize: "clamp(26px, 6vw, 34px)",
              fontWeight: 900,
              color: cookie.color,
            }}
          >
            {cookie.price}
          </span>
          <button
            style={{
              padding: "13px 30px",
              background: cookie.color,
              color: "#FFF",
              borderRadius: 50,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
              boxShadow: `0 4px 20px ${cookie.color}55`,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              letterSpacing: 0.3,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.07)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Add to Box
          </button>
        </div>
        </div>
      </div>
    </section>
  );
};

// ─── Order / Footer Section ───────────────────────────────────────────────────

const OrderSection = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const tags = [
    "🏠 Homemade",
    "🌅 Baked Fresh Daily",
    "🚀 Campus Delivery",
    "💛 Made with Love",
  ];

  return (
    <section
      ref={sectionRef}
      style={{
        height: "100vh",
        scrollSnapAlign: "start",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 30% 30%, #5D4037 0%, #3E2723 40%, #1B0E07 100%)",
        padding: "0 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow spots */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "15%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "#FF6F00",
          opacity: 0.07,
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "#7B1FA2",
          opacity: 0.08,
          filter: "blur(60px)",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            fontSize: "clamp(40px,10vw,56px)",
            marginBottom: 16,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.6s ease 0s",
          }}
        >
          📦
        </div>

        <h2
          style={{
            fontSize: "clamp(34px, 9vw, 56px)",
            fontWeight: 900,
            color: "#FFF",
            margin: "0 0 12px",
            lineHeight: 1.05,
            letterSpacing: "-1px",
            fontFamily: "'Georgia', serif",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.6s ease 0.1s",
          }}
        >
          Build Your Box
        </h2>

        <p
          style={{
            fontSize: "clamp(14px, 3.5vw, 17px)",
            color: "rgba(255,255,255,0.65)",
            maxWidth: 340,
            margin: "0 auto 32px",
            lineHeight: 1.65,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease 0.2s",
          }}
        >
          Pick your favorites. We bake fresh every morning and deliver straight
          to campus.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 44,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease 0.3s",
          }}
        >
          <button
            style={{
              padding: "15px 36px",
              background: "#FF6F00",
              color: "#FFF",
              borderRadius: 50,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
              boxShadow: "0 6px 24px rgba(255,111,0,0.45)",
              transition: "transform 0.2s ease",
              letterSpacing: 0.3,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.06)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            Order on WhatsApp 💬
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 48,
            opacity: visible ? 1 : 0,
            transition: "all 0.5s ease 0.4s",
          }}
        >
          {tags.map((tag, i) => (
            <span
              key={i}
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.45)",
                fontWeight: 600,
                letterSpacing: 0.3,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <p
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: 0.5,
            opacity: visible ? 1 : 0,
            transition: "all 0.5s ease 0.5s",
          }}
        >
          © 2026 Crave. All rights reserved.
        </p>
      </div>
    </section>
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function CraveWebsite() {
  const [scrollY, setScrollY] = useState(0);
  const [vh, setVh] = useState(700);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVh(window.innerHeight);
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  }, []);

  const totalSections = COOKIES.length + 2;
  const currentSection = Math.min(
    Math.floor(scrollY / vh),
    totalSections - 1
  );


  const scrollToSection = useCallback(
    (idx: number) => {
      const container = containerRef.current;
      container?.scrollTo({
        top: idx * vh,
        behavior: "smooth",
      });
    },
    [vh]
  );

  const totalScrollProgress = scrollY / (vh * (totalSections - 1));
  const currentAccent =
    currentSection === 0
      ? "#FF6F00"
      : currentSection <= COOKIES.length
      ? COOKIES[currentSection - 1].accent
      : "#FF6F00";

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        scrollSnapType: "y mandatory",
        fontFamily:
          "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
        position: "relative",
      }}
    >
      <ProgressBar progress={totalScrollProgress} color={currentAccent} />

      <HeroSection onScrollDown={() => scrollToSection(1)} />

      {COOKIES.map((cookie, i) => (
        <CookieSection
          key={cookie.id}
          cookie={cookie}
          index={i}
          total={COOKIES.length}
          isActive={currentSection === i + 1}
        />
      ))}

      <OrderSection />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }

        @keyframes floatBlob {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-22px) scale(1.04); }
        }

        @keyframes particleFloat {
          0% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-30px) scale(0.7); opacity: 0.15; }
        }

        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        button { font-family: inherit; }
      `}</style>
    </div>
  );
}