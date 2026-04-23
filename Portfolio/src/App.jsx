import { useState, useEffect, useRef } from "react";

// ─── MANDALA CANVAS ───────────────────────────────────────────────────────────
function MandalaCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let t = 0;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);

    function drawMandala(cx, cy, r, rot, alpha, petals = 8) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      for (let i = 0; i < petals; i++) {
        ctx.save();
        ctx.rotate((i / petals) * Math.PI * 2);
        ctx.beginPath();
        ctx.ellipse(r * 0.45, 0, r * 0.45, r * 0.11, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(176,90,32,0.5)";
        ctx.lineWidth = 0.9;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(r * 0.72, 0, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(210,140,60,0.45)";
        ctx.fill();
        ctx.restore();
      }
      [0.28, 0.52, 0.78, 1].forEach((f) => {
        ctx.beginPath();
        ctx.arc(0, 0, r * f, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(160,80,30,0.14)";
        ctx.lineWidth = 0.7;
        ctx.stroke();
      });
      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate((i / 6) * Math.PI * 2 + rot * 0.4);
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.58);
        ctx.lineTo(r * 0.17, r * 0.09);
        ctx.lineTo(-r * 0.17, r * 0.09);
        ctx.closePath();
        ctx.strokeStyle = "rgba(200,120,50,0.18)";
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      t += 0.003;
      drawMandala(W * 0.75, H * 0.45, Math.min(W, H) * 0.36, t, 0.16, 12);
      drawMandala(W * 0.75, H * 0.45, Math.min(W, H) * 0.21, -t * 1.4, 0.1, 8);
      drawMandala(W * 0.07, H * 0.09, 85, t * 0.8, 0.09, 8);
      drawMandala(W * 0.93, H * 0.93, 65, -t * 1.0, 0.07, 6);
      drawMandala(W * 0.08, H * 0.87, 50, t * 1.2, 0.06, 8);
      animRef.current = requestAnimationFrame(frame);
    }
    frame();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

// ─── EMBER PARTICLES ──────────────────────────────────────────────────────────
function EmberCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    const embers = Array.from({ length: 50 }, () => ({
      x: Math.random() * W, y: Math.random() * H + H,
      vx: (Math.random() - 0.5) * 0.5, vy: -(Math.random() * 0.7 + 0.3),
      r: Math.random() * 2 + 0.5, life: Math.random(), hue: 20 + Math.random() * 25,
    }));
    function frame() {
      ctx.clearRect(0, 0, W, H);
      embers.forEach((e) => {
        e.x += e.vx; e.y += e.vy; e.life -= 0.003;
        if (e.life <= 0 || e.y < -10) {
          e.x = Math.random() * W; e.y = H + 10;
          e.life = 0.6 + Math.random() * 0.4;
          e.vy = -(Math.random() * 0.7 + 0.3);
        }
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue},85%,62%,${e.life * 0.75})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${e.hue},90%,58%,0.55)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      animRef.current = requestAnimationFrame(frame);
    }
    frame();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.65 }} />;
}

// ─── SVG ELEMENTS ─────────────────────────────────────────────────────────────
const BowArrow = ({ style }) => (
  <svg viewBox="0 0 100 200" style={style} fill="none">
    <path d="M50 8 Q72 100 50 192" stroke="#b07030" strokeWidth="2.8" strokeLinecap="round" />
    <path d="M50 8 Q28 100 50 192" stroke="#b07030" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="50" y1="28" x2="50" y2="172" stroke="#d49040" strokeWidth="1.6" strokeDasharray="5 4" />
    <polygon points="50,6 45,22 50,17 55,22" fill="#e8a84a" />
    <line x1="46" y1="30" x2="42" y2="14" stroke="#e8a84a" strokeWidth="1.8" />
    <line x1="46" y1="30" x2="60" y2="24" stroke="#e8a84a" strokeWidth="1.8" />
  </svg>
);

const HanumanSilhouette = ({ style }) => (
  <svg viewBox="0 0 140 260" style={style} fill="none" opacity="0.12">
    <ellipse cx="70" cy="36" rx="20" ry="24" fill="#7a3c12" />
    <ellipse cx="70" cy="28" rx="12" ry="9" fill="#5a2c0a" />
    <path d="M50 58 Q34 85 30 122 Q27 152 40 167 L50 162 Q44 142 48 118 Q51 95 60 77Z" fill="#7a3c12" />
    <path d="M90 58 Q106 85 110 122 Q113 152 100 167 L90 162 Q96 142 92 118 Q89 95 80 77Z" fill="#7a3c12" />
    <path d="M60 77 Q70 90 80 77 Q80 135 76 167 L64 167 Q60 135 60 77Z" fill="#6b3410" />
    <path d="M40 162 Q26 182 30 210 Q33 224 44 224 L48 210 Q42 196 46 176Z" fill="#7a3c12" />
    <path d="M100 162 Q114 182 110 210 Q107 224 96 224 L92 210 Q98 196 94 176Z" fill="#7a3c12" />
    <path d="M70 167 Q57 176 53 218 L63 220 Q67 192 70 187 Q73 192 77 220 L87 218 Q83 176 70 167Z" fill="#6b3410" />
    <path d="M110 162 Q130 148 140 134 Q147 120 140 110 Q133 103 126 113 Q133 122 128 132 Q118 144 100 156Z" fill="#7a3c12" />
    <circle cx="64" cy="32" r="2.5" fill="#3d1a08" />
    <circle cx="76" cy="32" r="2.5" fill="#3d1a08" />
    <path d="M64 46 Q70 51 76 46" stroke="#3d1a08" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

const TempleTop = ({ style }) => (
  <svg viewBox="0 0 500 100" style={style} fill="none" preserveAspectRatio="none">
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
      <rect key={i} x={10 + i * 54} y={100 - (i % 2 === 0 ? 88 : 65)} width="20" height={i % 2 === 0 ? 88 : 65}
        fill={`rgba(150,80,30,${0.09 + i * 0.005})`} rx="2" />
    ))}
    <path d="M0 100 Q125 18 250 12 Q375 18 500 100Z" fill="rgba(130,65,22,0.07)" />
    {[35, 75, 115, 155, 195, 235, 275, 315, 355, 395, 435, 475].map((x, i) => (
      <circle key={i} cx={x} cy={92} r="2.5" fill="rgba(200,130,55,0.28)" />
    ))}
    <line x1="0" y1="97" x2="500" y2="97" stroke="rgba(170,90,35,0.22)" strokeWidth="1.5" />
  </svg>
);

const LotusIcon = () => (
  <svg viewBox="0 0 36 36" width="26" height="26" fill="none">
    <path d="M18 30 Q11 20 9 13 Q15 17 18 26 Q21 17 27 13 Q25 20 18 30Z" fill="#b05a20" opacity="0.85" />
    <path d="M18 30 Q7 18 5 9 Q13 15 18 26 Q23 15 31 9 Q29 18 18 30Z" fill="#c8802a" opacity="0.45" />
    <circle cx="18" cy="26" r="2.5" fill="#e8a84a" />
  </svg>
);

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let s = 0; const step = target / 60;
        const t = setInterval(() => {
          s += step;
          if (s >= target) { setVal(target); clearInterval(t); }
          else setVal(Math.floor(s));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── TYPEWRITER ───────────────────────────────────────────────────────────────
function Typewriter({ strings }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = strings[idx % strings.length];
    const timer = setTimeout(() => {
      if (!del) {
        setText(cur.slice(0, text.length + 1));
        if (text.length + 1 === cur.length) setTimeout(() => setDel(true), 1600);
      } else {
        setText(cur.slice(0, text.length - 1));
        if (text.length - 1 === 0) { setDel(false); setIdx(i => i + 1); }
      }
    }, del ? 45 : 85);
    return () => clearTimeout(timer);
  }, [text, del, idx, strings]);
  return <span>{text}<span className="cblink">|</span></span>;
}

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, from = "bottom" }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const tf = vis ? "none" : from === "left" ? "translateX(-42px)" : from === "right" ? "translateX(42px)" : "translateY(38px)";
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: tf, transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── 3D TILT ─────────────────────────────────────────────────────────────────
function TiltCard({ children, style = {} }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 15;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -15;
    ref.current.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.02,1.02,1.02)`;
  };
  const onLeave = () => { ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0)"; };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ ...style, transition: "transform 0.18s ease", transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SKILLS = [
  { cat: "Languages", icon: "📜", items: ["Python", "JavaScript"] },
  { cat: "Frontend", icon: "🌸", items: ["HTML5", "CSS3", "JavaScript"] },
  { cat: "Backend & Databases", icon: "🏛️", items: ["Django", "REST APIs", "MySQL", "SQL", "JSON"] },
  { cat: "Automation Testing", icon: "✨", items: ["Selenium"] },
  { cat: "Tools & Technologies", icon: "⚙️", items: ["Git", "GitHub", "VS Code", "Postman"] },
];

const PROJECTS = [
  {
    title: "OtoCircle", subtitle: "Full-Stack Automotive Platform", icon: "🚗",
    stack: ["HTML", "CSS", "JavaScript", "Django", "REST API", "MySQL"],
    metrics: ["Production live", "Desktop & mobile", "Secure auth", "Optimised DB"],
    desc: "Full-stack automotive platform connecting users with vehicle services and solutions. Built responsive UI components, RESTful APIs for user management, service listings and booking workflows, with secure authentication and structured database design.",
  },
];

const STATS = [
  { label: "Months Experience", val: 11, suffix: "+" },
  { label: "Production Projects", val: 2, suffix: "+" },
  { label: "Automation Tests Built", val: 50, suffix: "+" },
  { label: "Performance Improvement", val: 40, suffix: "%" },
];

const NAV = ["home", "about", "experience", "projects", "skills", "contact"];

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 55);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.32 }
    );
    NAV.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Yatra+One&family=Tiro+Devanagari+Hindi:ital@0;1&family=Lato:wght@300;400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg:    #f5ede0;
          --bg2:   #ede0cc;
          --bg3:   #e4cfb2;
          --light: #faf4ea;
          --terra: #b05a20;
          --rust:  #8b3a10;
          --gold:  #c07828;
          --gold2: #e8a84a;
          --forest:#3d5a2a;
          --fdk:   #2d4a1e;
          --stone: #b09070;
          --text:  #2a1a08;
          --muted: #7a5a3a;
          --border:rgba(160,100,40,0.2);
          --fhead: 'Yatra One', serif;
          --fsub:  'Tiro Devanagari Hindi', serif;
          --fbody: 'Lato', sans-serif;
        }
        html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--text); font-family: var(--fbody); overflow-x: hidden; }
        ::selection { background: var(--gold); color: #fff; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--bg2); }
        ::-webkit-scrollbar-thumb { background: var(--terra); border-radius: 3px; }

        /* noise texture */
        body::after {
          content:''; position:fixed; inset:0; z-index:0; pointer-events:none;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          opacity:0.6;
        }

        /* NAV */
        nav {
          position:fixed; top:0; left:0; right:0; z-index:200;
          display:flex; align-items:center; justify-content:space-between;
          padding:0 4rem; height:66px;
          transition: background 0.4s, box-shadow 0.4s, border-bottom 0.4s;
        }
        nav.scrolled {
          background:rgba(245,237,224,0.95); backdrop-filter:blur(16px);
          box-shadow:0 1px 0 var(--border);
        }
        .nav-logo { font-family:var(--fhead); font-size:1.3rem; color:var(--rust); display:flex; align-items:center; gap:0.5rem; }
        .nav-links { display:flex; gap:2.8rem; list-style:none; }
        .nav-links a {
          font-size:0.73rem; font-weight:700; letter-spacing:0.14em; text-transform:uppercase;
          color:var(--muted); text-decoration:none; transition:color 0.22s; position:relative;
        }
        .nav-links a::after { content:''; position:absolute; bottom:-3px; left:0; width:0; height:2px; background:var(--terra); transition:width 0.3s; border-radius:1px; }
        .nav-links a:hover, .nav-links a.active { color:var(--rust); }
        .nav-links a:hover::after, .nav-links a.active::after { width:100%; }
        .hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; padding:5px; }
        .hamburger span { width:24px; height:2px; background:var(--terra); display:block; }

        /* HERO */
        #home {
          min-height:100vh; display:flex; align-items:center; padding:6rem 5rem 4rem 6rem;
          gap:3rem; flex-wrap:wrap; position:relative; overflow:hidden;
        }
        .hero-left { flex:1; min-width:300px; max-width:580px; position:relative; z-index:2; }
        .hero-right { flex:0 0 420px; display:flex; align-items:center; justify-content:center; position:relative; z-index:1; }
        .hero-sanskrit {
          font-family:var(--fsub); font-style:italic; font-size:0.88rem; color:var(--gold);
          letter-spacing:0.08em; margin-bottom:1.2rem; display:flex; align-items:center; gap:1rem;
        }
        .hero-sanskrit::before, .hero-sanskrit::after { content:''; flex:1; max-width:45px; height:1px; background:linear-gradient(to right, transparent, var(--gold)); }
        h1.hero-name {
          font-family:var(--fhead); font-size:clamp(2.8rem,6.5vw,5.5rem); line-height:1.05;
          color:var(--rust); text-shadow:2px 3px 0 rgba(139,58,16,0.15); margin-bottom:0.5rem;
        }
        .hero-title {
          font-size:clamp(1rem,2.5vw,1.25rem); font-weight:300; color:var(--forest);
          letter-spacing:0.05em; margin-bottom:1.7rem; min-height:2rem;
        }
        .hero-desc { font-size:0.97rem; line-height:1.9; color:var(--muted); margin-bottom:2.8rem; max-width:490px; }
        .hero-cta { display:flex; gap:1rem; flex-wrap:wrap; }
        .btn {
          font-size:0.72rem; font-weight:700; letter-spacing:0.18em; text-transform:uppercase;
          padding:0.85rem 2.2rem; border-radius:3px; cursor:pointer; transition:all 0.24s;
          text-decoration:none; display:inline-block; font-family:var(--fbody);
        }
        .btn-pri { background:var(--terra); color:#fff; box-shadow:4px 4px 0 var(--rust), 0 6px 20px rgba(176,90,32,0.3); }
        .btn-pri:hover { background:var(--rust); transform:translate(-2px,-2px); box-shadow:7px 7px 0 #5a2008; }
        .btn-out { background:transparent; color:var(--forest); border:2px solid var(--forest); box-shadow:3px 3px 0 var(--fdk); }
        .btn-out:hover { background:var(--forest); color:#fff; transform:translate(-2px,-2px); box-shadow:6px 6px 0 var(--fdk); }

        /* medallion */
        .medallion {
          width:360px; height:360px; border-radius:50%; position:relative;
          background:radial-gradient(circle at 38% 38%, #f0dfc0, #d4a870, #a86030);
          border:4px solid rgba(200,160,70,0.4);
          box-shadow:0 0 0 14px rgba(180,110,40,0.07), 0 0 0 28px rgba(180,110,40,0.04),
            inset 0 0 70px rgba(100,50,15,0.2), 0 24px 70px rgba(120,60,20,0.28);
          display:flex; align-items:center; justify-content:center;
          animation:float 5.5s ease-in-out infinite;
        }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .medallion::before { content:''; position:absolute; inset:12px; border-radius:50%; border:1px solid rgba(220,170,80,0.35); }
        .medallion::after  { content:''; position:absolute; inset:26px; border-radius:50%; border:1px dashed rgba(220,170,80,0.2); }
        .med-text { text-align:center; position:relative; z-index:2; }
        .med-initials { font-family:var(--fhead); font-size:5rem; color:rgba(255,255,255,0.93); text-shadow:2px 5px 18px rgba(100,40,10,0.45); line-height:1; }
        .med-city { font-family:var(--fsub); font-style:italic; font-size:0.78rem; color:rgba(255,255,255,0.55); letter-spacing:0.1em; margin-top:0.4rem; }
        .temple-wrap { position:absolute; bottom:0; left:0; right:0; pointer-events:none; }

        /* STATS */
        .stats-row {
          display:grid; grid-template-columns:repeat(4,1fr);
          background:var(--light); border-top:2px solid var(--border); border-bottom:2px solid var(--border);
          position:relative; z-index:2;
        }
        .stat-cell { padding:2.8rem 1.5rem; text-align:center; border-right:1px solid var(--border); }
        .stat-cell:last-child { border-right:none; }
        .stat-val { font-family:var(--fhead); font-size:2.9rem; color:var(--terra); line-height:1; margin-bottom:0.4rem; }
        .stat-lbl { font-size:0.7rem; font-weight:700; letter-spacing:0.13em; text-transform:uppercase; color:var(--muted); }

        /* SECTION COMMON */
        .sec { padding:7rem 5rem; position:relative; z-index:1; max-width:1260px; margin:0 auto; }
        .eyebrow { display:flex; align-items:center; gap:1rem; margin-bottom:0.8rem; font-size:0.67rem; font-weight:700; letter-spacing:0.26em; text-transform:uppercase; color:var(--gold); }
        .eyebrow::before { content:''; width:36px; height:2px; background:var(--gold); flex-shrink:0; }
        .sec-title { font-family:var(--fhead); font-size:clamp(1.9rem,4.5vw,3.1rem); color:var(--rust); line-height:1.15; margin-bottom:3.5rem; }
        .bg-alt { background:var(--bg2); }
        .om-bg { position:absolute; font-family:var(--fsub); font-style:italic; color:rgba(176,90,32,0.07); font-size:14rem; line-height:1; pointer-events:none; user-select:none; }

        /* ABOUT */
        .about-grid { display:grid; grid-template-columns:1fr 1.55fr; gap:6rem; align-items:center; }
        .avatar-frame {
          aspect-ratio:1; border-radius:50%;
          background:radial-gradient(circle at 35% 35%, #f0d8a8, #c49042, #8a4e1e);
          border:4px solid var(--gold2); max-width:300px; margin:0 auto;
          box-shadow:0 0 0 9px rgba(200,128,42,0.1), 14px 18px 44px rgba(120,60,20,0.28);
          display:flex; align-items:center; justify-content:center;
        }
        .avatar-init { font-family:var(--fhead); font-size:5.5rem; color:rgba(255,255,255,0.92); text-shadow:2px 4px 14px rgba(100,40,10,0.4); }
        .about-p { font-size:0.95rem; line-height:1.9; color:var(--muted); margin-bottom:1.1rem; }
        .about-p strong { color:var(--rust); font-weight:700; }
        .edu-card { margin-top:0.8rem; padding:1.15rem 1.5rem; border-left:3px solid var(--gold); background:rgba(200,128,42,0.06); border-radius:0 6px 6px 0; }
        .edu-deg { font-weight:700; font-size:0.88rem; color:var(--text); margin-bottom:0.2rem; }
        .edu-school { font-size:0.8rem; color:var(--forest); }
        .edu-period { font-size:0.72rem; color:var(--stone); margin-top:0.2rem; }

        /* TIMELINE */
        .timeline { position:relative; padding-left:2.5rem; }
        .timeline::before { content:''; position:absolute; left:0; top:6px; bottom:0; width:2px; background:linear-gradient(to bottom, var(--terra), transparent); }
        .t-item { position:relative; margin-bottom:3.5rem; padding-left:2.2rem; }
        .t-dot { position:absolute; left:-2.73rem; top:6px; width:12px; height:12px; border-radius:50%; background:var(--terra); border:2px solid var(--gold2); box-shadow:0 0 10px rgba(176,90,32,0.45); }
        .t-role { font-family:var(--fhead); font-size:1.3rem; color:var(--rust); }
        .t-company { font-size:0.9rem; font-weight:700; color:var(--forest); margin:0.22rem 0; }
        .t-meta { font-size:0.73rem; color:var(--stone); letter-spacing:0.05em; margin-bottom:1.2rem; }
        .t-bullets { list-style:none; }
        .t-bullets li { font-size:0.9rem; line-height:1.78; color:var(--muted); padding:0.55rem 0 0.55rem 1.4rem; border-bottom:1px solid rgba(160,100,40,0.08); position:relative; }
        .t-bullets li::before { content:'❧'; position:absolute; left:0; color:var(--gold); font-size:0.8rem; }

        /* PROJECTS */
        .proj-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(350px,1fr)); gap:2.5rem; }
        .proj-card {
          background:var(--light); border:1px solid var(--border); border-radius:8px; padding:2.5rem;
          position:relative; overflow:hidden; box-shadow:6px 6px 0 rgba(160,100,40,0.1);
          transition:box-shadow 0.25s, transform 0.25s;
        }
        .proj-card:hover { box-shadow:10px 10px 0 rgba(160,100,40,0.18); }
        .proj-card::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg, var(--terra), var(--gold2), var(--terra)); }
        .proj-top { display:flex; align-items:flex-start; gap:1.2rem; margin-bottom:1.2rem; }
        .proj-icon { width:52px; height:52px; border-radius:8px; background:linear-gradient(135deg,var(--bg3),var(--bg2)); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:1.6rem; flex-shrink:0; }
        .proj-title { font-family:var(--fhead); font-size:1.4rem; color:var(--rust); }
        .proj-sub { font-size:0.78rem; color:var(--stone); margin-top:0.15rem; }
        .proj-desc { font-size:0.87rem; line-height:1.78; color:var(--muted); margin-bottom:1.4rem; }
        .metrics { display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1.4rem; }
        .metric { font-size:0.67rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding:0.3rem 0.85rem; border-radius:2px; background:rgba(176,90,32,0.09); border:1px solid rgba(176,90,32,0.22); color:var(--terra); }
        .stack { display:flex; flex-wrap:wrap; gap:0.4rem; }
        .stag { font-size:0.72rem; padding:0.25rem 0.75rem; border-radius:3px; background:rgba(61,90,42,0.07); border:1px solid rgba(61,90,42,0.17); color:var(--forest); }

        /* SKILLS */
        .skill-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(351px,1fr)); gap:0.8rem; }
        .sg { background:var(--light); border:1px solid var(--border); border-radius:6px; padding:0.8rem; box-shadow:4px 4px 0 rgba(160,100,40,0.07); }
        .sg-head { display:flex; align-items:center; gap:0.6rem; font-size:0.67rem; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:var(--terra); margin-bottom:1.1rem; }
        .chips { display:flex; flex-wrap:wrap; gap:0.5rem; }
        .chip { font-size:0.8rem; padding:0.35rem 0.9rem; border-radius:3px; background:var(--bg); border:1px solid var(--border); color:var(--text); transition:all 0.2s; cursor:default; }
        .chip:hover { background:var(--terra); color:#fff; border-color:var(--terra); transform:translateY(-2px); box-shadow:0 4px 12px rgba(176,90,32,0.28); }

        /* CONTACT */
        .contact-links { display:flex; flex-wrap:wrap; gap:1.2rem; justify-content:center; margin-top:3rem; }
        .clink { display:flex; align-items:center; gap:1rem; padding:1.2rem 2rem; background:var(--light); border:1px solid var(--border); border-radius:6px; text-decoration:none; color:var(--text); font-size:0.88rem; box-shadow:4px 4px 0 rgba(160,100,40,0.1); transition:all 0.25s; }
        .clink:hover { background:var(--terra); color:#fff; box-shadow:6px 6px 0 var(--rust); transform:translate(-2px,-2px); }

        /* FOOTER */
        footer { background:var(--rust); color:rgba(255,255,255,0.65); text-align:center; padding:2.8rem 2rem; font-size:0.75rem; letter-spacing:0.12em; position:relative; z-index:1; }
        footer .fn { font-family:var(--fhead); font-size:0.95rem; color:var(--gold2); }
        footer .shloka { font-family:var(--fsub); font-style:italic; opacity:0.5; margin-top:0.5rem; font-size:0.82rem; }

        /* DIVIDER */
        .divider { display:flex; align-items:center; gap:1.5rem; max-width:180px; margin:0 auto 3rem; color:var(--gold); font-size:1.1rem; }
        .divider::before, .divider::after { content:''; flex:1; height:1px; background:linear-gradient(to right,transparent,var(--gold),transparent); }

        /* misc */
        .cblink { animation:cblink 0.85s step-end infinite; color:var(--terra); }
        @keyframes cblink { 0%,100%{opacity:1} 50%{opacity:0} }

        /* MOBILE MENU */
        .mob-menu { position:fixed; inset:0; background:rgba(245,237,224,0.97); z-index:300; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2.5rem; }
        .mob-menu a { font-family:var(--fhead); font-size:1.5rem; color:var(--muted); text-decoration:none; }
        .mob-menu a:hover { color:var(--rust); }

        @media(max-width:900px){
          #home { padding:5rem 2rem 3rem; flex-direction:column; }
          .hero-right { flex:none; width:100%; }
          .medallion { width:260px; height:260px; margin:0 auto; }
          .about-grid { grid-template-columns:1fr; gap:3rem; }
          .sec { padding:5rem 1.8rem; }
          .stats-row { grid-template-columns:repeat(2,1fr); }
          nav { padding:0 1.5rem; }
          .nav-links { display:none; }
          .hamburger { display:flex; }
        }
      `}</style>

      <MandalaCanvas />
      <EmberCanvas />

      {/* NAV */}
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="nav-logo"><LotusIcon />Abhishek Patil</div>
        <ul className="nav-links">
          {NAV.map(s => (
            <li key={s}><a href={`#${s}`} className={active === s ? "active" : ""} onClick={e => { e.preventDefault(); scrollTo(s); }}>{s}</a></li>
          ))}
        </ul>
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </div>
      </nav>

      {menuOpen && (
        <div className="mob-menu">
          <div style={{ fontFamily: "var(--fhead)", fontSize: "1.6rem", color: "var(--rust)", marginBottom: "1rem" }}>🪔 Menu</div>
          {NAV.map(s => <a key={s} href={`#${s}`} onClick={e => { e.preventDefault(); scrollTo(s); }}>{s}</a>)}
        </div>
      )}

      {/* HERO */}
      <div id="home">
        <div className="temple-wrap">
          <TempleTop style={{ width: "100%", height: "100px" }} />
        </div>

        <div className="hero-left">
          <div className="hero-sanskrit">सॉफ्टवेयर इंजीनियर</div>
          <h1 className="hero-name">Abhishek<br />Patil</h1>
          <div className="hero-title">
            <Typewriter strings={["Software Engineer", "Full-Stack Developer", "Django Specialist", "Automation Tester", "OtoCircle Platform Builder"]} />
          </div>
          <p className="hero-desc">Building scalable web applications with Python and Django — from automotive platforms to RESTful API systems. Full-stack development shipped with reliability and precision.</p>
          <div className="hero-cta">
            <a href="#projects" className="btn btn-pri" onClick={e => { e.preventDefault(); scrollTo("projects"); }}>View My Work</a>
            <a href="#contact" className="btn btn-out" onClick={e => { e.preventDefault(); scrollTo("contact"); }}>Get In Touch</a>
          </div>
        </div>

        <div className="hero-right">
          <div style={{ position: "relative" }}>
            <TiltCard>
              <div className="medallion">
                <div className="med-text">
                  <div className="med-initials">AP</div>
                  <div className="med-city">Bengaluru, India</div>
                </div>
                <div style={{ position: "absolute", inset: "32px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.18)", pointerEvents: "none" }} />
              </div>
            </TiltCard>
            <BowArrow style={{ position: "absolute", right: "-52px", top: "50%", transform: "translateY(-50%)", width: "65px", height: "110px" }} />
            <HanumanSilhouette style={{ position: "absolute", bottom: "-28px", left: "-48px", width: "105px", height: "185px" }} />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-row">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 100}>
            <div className="stat-cell">
              <div className="stat-val"><Counter target={s.val} suffix={s.suffix} /></div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ABOUT */}
      <section id="about">
        <div className="sec">
          <div className="om-bg" style={{ top: "-2rem", right: "-1rem" }}>ॐ</div>
          <div className="eyebrow">01 — The Engineer</div>
          <h2 className="sec-title">Crafted by Curiosity,<br />Tempered by Production</h2>
          <div className="about-grid">
            <Reveal from="left">
              <TiltCard>
                <div className="avatar-frame">
                  <div className="avatar-init">AP</div>
                </div>
              </TiltCard>
            </Reveal>
            <Reveal from="right" delay={160}>
              <div>
                <p className="about-p">I'm a <strong>Software Engineer</strong> with hands-on production experience developing web applications using Python and Django, along with front-end technologies HTML, CSS, and JavaScript.</p>
                <p className="about-p">Currently contributing to live production applications at <strong>Vividhity Ventures Private Limited</strong>, including the development and maintenance of the OtoCircle platform — a full-stack automotive solution connecting users with vehicle services.</p>
                <p className="about-p">Skilled in <strong>automation testing using Selenium</strong> and passionate about building scalable, user-friendly solutions that perform reliably in production environments.</p>
                <div className="edu-card" style={{ marginTop: "2rem" }}>
                  <div className="edu-deg">BE — Bachelor of Engineering, Civil Engineering · CGPA: 7.5/10</div>
                  <div className="edu-school">Jain College of Engineering – VTU, Belgaum</div>
                  <div className="edu-period">Aug 2018 – Jun 2022</div>
                </div>
                <div className="edu-card">
                  <div className="edu-deg">Pre-University Education (PUE) · 75.16%</div>
                  <div className="edu-school">Gnyan Gangotri Independent Science PU College, Jamkhandi</div>
                  <div className="edu-period">2018</div>
                </div>
                <div className="edu-card">
                  <div className="edu-deg">SSLC – State Board · 61.92%</div>
                  <div className="edu-school">Acharya Sri 108 Vidyasagar Trust Kannada Medium High School, Kagwad</div>
                  <div className="edu-period">2016</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <div className="bg-alt" style={{ position: "relative", zIndex: 1 }}>
        <section id="experience">
          <div className="sec">
            <div className="eyebrow">02 — Battle-Tested</div>
            <h2 className="sec-title">Where I've Shipped<br />Production Systems</h2>
            <div className="timeline">
              <Reveal>
                <div className="t-item">
                  <div className="t-dot" />
                  <div className="t-role">Software Engineer</div>
                  <div className="t-company">Vividhity Ventures Private Limited</div>
                  <div className="t-meta">Jun 2025 – Present · Bengaluru, Karnataka, India</div>
                  <ul className="t-bullets">
                    <li>Developed and maintained production features for web applications using modern full-stack technologies including <strong>Python, Django, HTML, CSS and JavaScript</strong>.</li>
                    <li>Designed and implemented scalable <strong>backend APIs</strong> and optimized database queries to improve application performance and reduce load time.</li>
                    <li>Collaborated with cross-functional teams to gather requirements, fix bugs, and deploy feature updates across the complete <strong>SDLC</strong> — development, testing, deployment and support.</li>
                    <li>Improved application responsiveness and reduced load time through <strong>performance optimization techniques</strong> and code refactoring.</li>
                  </ul>
                </div>
              </Reveal>
              <Reveal>
                <div className="t-item">
                  <div className="t-dot" />
                  <div className="t-role">Software Engineer Intern</div>
                  <div className="t-company">Vividhity Ventures Private Limited</div>
                  <div className="t-meta">Nov 2024 – Jun 2025 · Bengaluru, Karnataka, India</div>
                  <ul className="t-bullets">
                    <li>Gained hands-on experience with production-grade web development, contributing to the <strong>OtoCircle</strong> automotive platform.</li>
                    <li>Worked on building responsive UI components and implementing RESTful APIs for user management and service workflows.</li>
                    <li>Supported automated testing efforts using <strong>Selenium</strong>, helping ensure application reliability before deployment.</li>
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </div>

      {/* PROJECTS */}
      <section id="projects">
        <div className="sec">
          <div className="om-bg" style={{ bottom: "2rem", left: "-2rem" }}>ॐ</div>
          <div className="eyebrow">03 — Proof of Work</div>
          <h2 className="sec-title">Systems That Move<br />the Needle</h2>
          <div className="proj-grid">
            {PROJECTS.map((p, i) => (
              <Reveal key={p.title} delay={i * 150}>
                <TiltCard>
                  <div className="proj-card">
                    <div className="proj-top">
                      <div className="proj-icon">{p.icon}</div>
                      <div><div className="proj-title">{p.title}</div><div className="proj-sub">{p.subtitle}</div></div>
                    </div>
                    <p className="proj-desc">{p.desc}</p>
                    <div className="metrics">{p.metrics.map(m => <span key={m} className="metric">{m}</span>)}</div>
                    <div className="stack">{p.stack.map(s => <span key={s} className="stag">{s}</span>)}</div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <div className="bg-alt" style={{ position: "relative", zIndex: 1 }}>
        <section id="skills">
          <div className="sec">
            <div className="eyebrow">04 — The Arsenal</div>
            <h2 className="sec-title">Tools &amp; Technologies<br />I Wield Daily</h2>
            <div className="skill-grid">
              {SKILLS.map((g, i) => (
                <Reveal key={g.cat} delay={i * 70}>
                  <div className="sg">
                    <div className="sg-head"><span>{g.icon}</span>{g.cat}</div>
                    <div className="chips">{g.items.map(item => <span key={item} className="chip">{item}</span>)}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* CONTACT */}
      <section id="contact" style={{ textAlign: "center" }}>
        <div className="sec">
          <div className="divider">🪔</div>
          <div className="eyebrow" style={{ justifyContent: "center" }}>05 — Connect</div>
          <h2 className="sec-title" style={{ textAlign: "center" }}>Open to Roles &amp;<br />Collaborations</h2>
          <p style={{ color: "var(--muted)", maxWidth: 460, margin: "0 auto", lineHeight: 1.88, fontSize: "0.96rem" }}>
            Whether you're building a product from scratch, scaling an existing system, or need someone who takes full ownership — let's connect.
          </p>
          <div className="contact-links">
            {[
              { icon: "✉️", label: "patilabhishek2157@gmail.com", href: "mailto:patilabhishek2157@gmail.com" },
              { icon: "💼", label: "linkedin/abhishek-patil-337bab1bb", href: "https://linkedin.com/in/abhishek-patil-337bab1bb" },
              { icon: "📱", label: "+91-9972952157", href: "tel:+919972952157" },
            ].map(c => (
              <Reveal key={c.label}>
                <a href={c.href} className="clink" target="_blank" rel="noopener noreferrer">
                  <span style={{ fontSize: "1.3rem" }}>{c.icon}</span><span>{c.label}</span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <div style={{ marginBottom: "0.4rem" }}>🏹 &nbsp;<span className="fn">Abhishek Patil</span>&nbsp; 🏹</div>
        <div>Bengaluru, India · Software Engineer · {new Date().getFullYear()}</div>
        <div className="shloka">सत्यमेव जयते — Truth alone triumphs</div>
      </footer>
    </>
  );
}