import "./styles.css";

import React, { useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import {
  Sunrise, Menu, Zap, X, Key, Info, Download,
  Terminal, Cpu, Database, Layers, ShieldAlert,
  BookOpen, Feather, Globe
} from "lucide-react";

// ─── DESIGN TOKENS & STYLES ──────────────────────────────────────────────────
// Merging tailwind.config.js tokens and index.css into a single high-fidelity block.
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Share+Tech+Mono&display=swap');

  :root {
    /* Core Diesel Palette */
    --diesel: #302828;
    --diesel-mid: #3A3030;
    --diesel-hi: #443838;
    --dreamless: #1E1A18;

    /* Champagne Accents */
    --igniting: #F8D8A0;
    --tiger: #C0A068;
    --champagne: #F0D098;
    --taupe: #B0A078;
    --fake-blonde: #F0E8C0;
    --pebble: #A09880;
    --caramel: #A89068;

    /* Semantic Mappings */
    --accent: var(--igniting);
    --text-hi: var(--fake-blonde);
    --text-mid: var(--champagne);
    --text-lo: var(--pebble);

    /* Shadows */
    --shadow-brutal: 4px 4px 0px var(--igniting);
    --shadow-brutal-gold: 4px 4px 0px var(--tiger);
    --shadow-brutal-white: 4px 4px 0px var(--fake-blonde);
  }

  body {
    background-color: var(--dreamless);
    color: var(--text-mid);
    font-family: 'Lora', serif;
    margin: 0;
    line-height: 1.6;
  }

  /* --- Terminal / Archival Overlays --- */
  .archive-grid {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(248, 216, 160, 0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(248, 216, 160, 0.015) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .scanlines {
    position: fixed; inset: 0; pointer-events: none; z-index: 100;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(48, 40, 40, 0.08) 2px, rgba(48, 40, 40, 0.08) 4px);
  }

  /* --- Typography --- */
  .t-heading { font-family: 'Cinzel', serif; letter-spacing: 0.12em; }
  .t-mono { font-family: 'Share Tech Mono', monospace; }
  .t-scripture { font-family: 'Lora', serif; line-height: 1.8; }

  /* --- Branded Components --- */
  .card-archival {
    background: rgba(160, 152, 128, 0.03);
    border: 1px solid var(--pebble);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }
  .card-archival:hover {
    border-color: var(--igniting);
    background: rgba(248, 216, 160, 0.02);
    box-shadow: var(--shadow-brutal);
    transform: translate(-2px, -2px);
  }

  .btn-brutal {
    font-family: 'Cinzel', serif;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    padding: 10px 20px;
    border: 1px solid currentColor;
    transition: all 0.1s;
    background: transparent;
    cursor: pointer;
  }
  .btn-brutal:active { transform: translate(2px, 2px); }

  .glitch-text::after {
    content: attr(data-text); position: absolute; left: 2px; text-shadow: -1px 0 var(--tiger);
    background: var(--dreamless); overflow: hidden; clip: rect(0, 900px, 0, 0);
    animation: noise 3s infinite linear alternate-reverse;
  }
  @keyframes noise { 0% { clip: rect(10px, 999px, 40px, 0); } 100% { clip: rect(70px, 999px, 90px, 0); } }

  .transition-page { animation: fadeIn 0.4s ease-out forwards; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--pebble); border-radius: 2px; }

  @media print {
    .no-print { display: none !important; }
    body { background: white !important; color: black !important; }
    .card-archival { border: 1px solid #ccc !important; box-shadow: none !important; }
  }
`;

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Page = 'home' | 'modules' | 'map' | 'programs' | 'legal' | 'manual' | 'involved';

// ─── DATA ────────────────────────────────────────────────────────────────────
const MANUAL_DATA = {
  pillars: {
    title: 'The Seven Pillars of Light',
    content: 'Unwavering Faith, Radical Love, Sacred Service, Earth Stewardship, Truthful Speech, Communal Harmony, and Joyful Spirit.'
  },
  shelter: {
    title: 'Creating Sacred Space',
    content: 'Your body is a temple; your shelter is its outer court. Seek high, dry ground. Build with gratitude.'
  },
  water: {
    title: 'The Living Water',
    content: 'Water is the lifeblood of Gaia. Listen for its song in transpiration; find its tears in morning dew.'
  },
  fire: {
    title: 'The Sacred Flame',
    content: 'Handle fire with reverence; it reflects the Great Spirit within. Return ashes to the soil with a blessing.'
  },
};

const VOWS = {
  oath: 'With Yahweh as my witness, I vow to walk this sacred path. My heart will be my compass, and love my only law. I will serve the unseen, the unheard, and the unloved.',
  law: [
    'A Warrior is a friend to the outcast.',
    'A Warrior is a voice for the voiceless.',
    'A Warrior honors all of Creation.',
    'A Warrior speaks truth with love.',
    'A Warrior is a light in the dark.'
  ]
};

const SYSTEM_MODULES: { module: string; framework: string; output: string; icon: React.ReactElement }[] = [
  { module: 'Exegesis Engine', framework: 'Nine Levels of Order Mastery', output: 'Contextual commentary across 9 major Christian traditions.', icon: <Database size={32} /> },
  { module: 'Philology Hook', framework: 'Linguistic Analysis', output: 'Original language anchoring for high-fidelity logging.', icon: <Terminal size={32} /> },
  { module: 'Synthesis Logic', framework: 'Code of Communal Standing', output: 'Comparative synthesis of converged traditional viewpoints.', icon: <Cpu size={32} /> },
  { module: 'UI Interface', framework: 'Brutalist-Archival', output: 'High-contrast, tactile interface optimized for navigation.', icon: <Layers size={32} /> }
];

const LEGAL_TOPICS = [
  'My rights in public spaces',
  'How to access a shelter',
  'How to recover my ID',
  'How to find food assistance'
];

// ─── APP COMPONENT ───────────────────────────────────────────────────────────
function App() {
  const [page, setPage] = useState<Page>('home');
  const [apiKey, setApiKey] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [legalQuestion, setLegalQuestion] = useState('');
  const [legalAnswer, setLegalAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Restore API key on mount
  useEffect(() => {
    const saved = localStorage.getItem('sct_api_v4');
    if (saved) { setApiKey(saved); setIsKeySet(true); }
  }, []);

  const saveKey = (val: string) => {
    const key = val.trim();
    if (key.length > 10) {
      localStorage.setItem('sct_api_v4', key);
      setApiKey(key);
      setIsKeySet(true);
    }
  };

  const clearKey = () => {
    localStorage.removeItem('sct_api_v4');
    setApiKey('');
    setIsKeySet(false);
  };

  const navigate = (p: Page) => {
    setPage(p);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const callGemini = useCallback(async (userPrompt: string) => {
    if (!apiKey) return;
    setIsLoading(true);
    setLegalAnswer('');

    const systemPrompt = [
      'You are a wise elder of the Covenant of the Rainbow.',
      'Tone: diesel-archival, academic, and compassionate.',
      'You are an expert in Societal Architecture, Philology, and the Algorithm of Operational Permittance.',
      'Focus on restoring communal standing for the marginalized.',
      'When discussing rights (parks, food, shelter), emphasize that human presence is not a transgression.',
      'Respond in semantic HTML (paragraphs, bold, italics).'
    ].join('\n');

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        }
      );
      const data = await res.json() as {
        candidates?: { content?: { parts?: { text?: string }[] } }[]
      };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
        || 'Communication with the archive failed.';
      setLegalAnswer(text);
    } catch {
      setLegalAnswer('<p style="color:#f87171">CRITICAL_CONNECTION_ERROR: UNABLE_TO_HANDSHAKE_WITH_GEMINI_NODE.</p>');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const PAGES: Page[] = ['home', 'modules', 'map', 'legal', 'manual', 'involved'];

  const navLabel = (p: Page): string => {
    const labels: Record<Page, string> = {
      home: 'INDEX', modules: 'SYSTEM', map: 'LEYLINES',
      legal: 'SHEPHERD', manual: 'SCROLLS', involved: 'ENLIST', programs: 'PROGRAMS'
    };
    return labels[p];
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <div className="scanlines no-print" />
      <div className="archive-grid" />

      {/* ── TERMINAL BANNER ── */}
      <div
        className="no-print"
        style={{
          padding: '8px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${isKeySet ? 'rgba(248,216,160,0.3)' : 'rgba(192,160,104,0.6)'
          }`,
          fontSize: '10px',
          zIndex: 60,
          position: 'relative',
          background: isKeySet ? 'rgba(248,216,160,0.05)' : 'rgba(192,160,104,0.1)',
          color: isKeySet ? 'var(--igniting)' : 'var(--tiger)',
          fontFamily: "'Share Tech Mono', monospace",
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Zap size={12} />
          <span>SYSTEM_STATUS :: {isKeySet ? 'ENGINES_ACTIVE' : 'OFFLINE_DEMO_MODE'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {!isKeySet ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key size={10} />
              <input
                type="password"
                placeholder="PASTE_API_KEY..."
                style={{
                  background: 'var(--diesel)',
                  border: '1px solid var(--pebble)',
                  padding: '2px 8px',
                  outline: 'none',
                  color: 'var(--fake-blonde)',
                  width: '128px',
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '10px',
                }}
                onBlur={(e) => saveKey(e.target.value)}
              />
            </div>
          ) : (
            <button
              onClick={clearKey}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'inherit', fontFamily: "'Share Tech Mono', monospace",
                fontSize: '10px', textTransform: 'uppercase',
              }}
            >
              [ DISCONNECT_NODE ]
            </button>
          )}
        </div>
      </div>

      {/* ── TOP NAV ── */}
      <nav
        className="no-print"
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(48,40,40,0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '2px solid var(--pebble)',
        }}
      >
        <div style={{
          maxWidth: '1280px', margin: '0 auto', padding: '0 24px',
          display: 'flex', justifyContent: 'space-between', height: '80px', alignItems: 'center'
        }}>
          {/* Brand */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
            onClick={() => navigate('home')}
          >
            <div style={{
              width: '40px', height: '40px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: 'var(--igniting)', color: 'var(--diesel)',
              boxShadow: 'var(--shadow-brutal)',
            }}>
              <Sunrise size={24} />
            </div>
            <div style={{ lineHeight: 1 }}>
              <h1 className="t-heading" style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--fake-blonde)', margin: 0 }}>
                SANCTUARY
              </h1>
              <p className="t-mono" style={{ fontSize: '9px', color: 'var(--igniting)', letterSpacing: '0.3em', margin: '4px 0 0', textTransform: 'uppercase' }}>
                Archive_Terminal v4.0
              </p>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="cotr-desktop-nav" style={{ display: 'none', alignItems: 'center', gap: '32px' }}>
            {PAGES.map(p => (
              <button
                key={p}
                onClick={() => navigate(p)}
                style={{
                  background: p === 'involved' ? 'var(--igniting)' : 'none',
                  border: 'none', cursor: 'pointer',
                  color: p === 'involved' ? 'var(--diesel)' : page === p ? 'var(--igniting)' : 'var(--pebble)',
                  padding: p === 'involved' ? '8px 24px' : '0',
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 'bold',
                  boxShadow: p === 'involved' ? 'var(--shadow-brutal)' : 'none',
                }}
              >
                {navLabel(p)}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="cotr-mobile-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ display: 'flex', color: 'var(--igniting)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      {isMenuOpen && (
        <div
          className="no-print"
          style={{
            position: 'fixed', inset: '80px 0 0 0', zIndex: 40,
            background: 'rgba(48,40,40,0.95)', backdropFilter: 'blur(12px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', paddingTop: '48px',
          }}
        >
          {PAGES.map(p => (
            <button
              key={p}
              onClick={() => navigate(p)}
              style={{
                background: p === 'involved' ? 'var(--igniting)' : 'none',
                border: 'none', cursor: 'pointer',
                color: p === 'involved' ? 'var(--diesel)' : 'var(--pebble)',
                padding: p === 'involved' ? '12px 32px' : '0',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 'bold',
                boxShadow: p === 'involved' ? 'var(--shadow-brutal)' : 'none',
                marginTop: p === 'involved' ? '16px' : '0',
              }}
            >
              {navLabel(p)}
            </button>
          ))}
        </div>
      )}

      {/* ── MAIN ── */}
      <main className="transition-page" style={{ position: 'relative', zIndex: 10, padding: '48px 24px' }}>

        {/* HOME */}
        {page === 'home' && (
          <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center', paddingTop: '40px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '12px',
              padding: '4px 16px', border: '1px solid var(--tiger)',
              background: 'rgba(192,160,104,0.05)', marginBottom: '40px',
            }}>
              <Zap size={12} style={{ color: 'var(--igniting)' }} />
              <span className="t-mono" style={{ fontSize: '10px', color: 'var(--igniting)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                Protocol_Active :: Restoration_Mode
              </span>
            </div>

            <h1
              className="t-heading glitch-text"
              data-text="Covenant of the Rainbow"
              style={{
                fontSize: 'clamp(48px, 10vw, 96px)', fontWeight: 'bold',
                color: 'var(--fake-blonde)', marginBottom: '40px',
                lineHeight: 1, textTransform: 'uppercase', position: 'relative'
              }}
            >
              Covenant of <br /><span style={{ color: 'var(--tiger)' }}>the Rainbow</span>
            </h1>

            <div className="card-archival" style={{
              maxWidth: '640px', margin: '0 auto 64px',
              borderLeft: '4px solid var(--tiger)', padding: '32px',
              textAlign: 'left', boxShadow: 'var(--shadow-brutal-gold)',
            }}>
              <p className="t-scripture" style={{ fontStyle: 'italic', fontSize: 'clamp(18px, 3vw, 24px)', color: 'var(--champagne)', lineHeight: 1.8 }}>
                "And they that shall be of thee shall build the old waste places... thou shalt be called,
                <span style={{ color: 'var(--igniting)' }}> The repairer of the breach, The restorer of paths to dwell in.</span>"
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px' }}>
                <span className="t-mono" style={{ fontSize: '10px', color: 'var(--tiger)', fontWeight: 'bold', letterSpacing: '0.2em' }}>
                  // ISAIAH 58:12 &middot; NETIBAH H5410
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <div key={n} style={{ width: '6px', height: '6px', background: 'rgba(192,160,104,0.3)', borderRadius: '50%' }} />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '32px' }}>
              <button
                onClick={() => navigate('involved')}
                className="btn-brutal"
                style={{ background: 'var(--igniting)', color: 'var(--diesel)', fontWeight: 'bold', boxShadow: 'var(--shadow-brutal)' }}
              >TAKE_THE_VOW</button>
              <button
                onClick={() => navigate('manual')}
                className="btn-brutal"
                style={{ borderColor: 'var(--champagne)', color: 'var(--champagne)' }}
              >WISDOM_SCROLLS</button>
            </div>
          </div>
        )}

        {/* MODULES */}
        {page === 'modules' && (
          <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
            <div style={{ marginBottom: '64px', borderBottom: '1px solid var(--pebble)', paddingBottom: '24px' }}>
              <h2 className="t-heading" style={{
                fontSize: '36px', fontWeight: 'bold', color: 'var(--fake-blonde)',
                textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '16px'
              }}>
                <Cpu style={{ color: 'var(--igniting)' }} /> Operational_Modules
              </h2>
              <p className="t-mono" style={{ fontSize: '11px', color: 'var(--tiger)', marginTop: '8px' }}>
                // ARCHIVAL_LOGISTICS :: NINE_ORDER_MASTERY_SYSTEM
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
              {SYSTEM_MODULES.map((m, i) => (
                <div key={i} className="card-archival" style={{ padding: '40px' }}>
                  <div style={{ marginBottom: '32px', color: 'var(--igniting)' }}>{m.icon}</div>
                  <h3 className="t-heading" style={{ fontSize: '22px', color: 'var(--fake-blonde)', marginBottom: '12px', textTransform: 'uppercase' }}>{m.module}</h3>
                  <div className="t-mono" style={{ fontSize: '10px', color: 'var(--tiger)', marginBottom: '24px', letterSpacing: '0.12em', borderLeft: '2px solid var(--tiger)', paddingLeft: '16px', textTransform: 'uppercase' }}>{m.framework}</div>
                  <p className="t-mono" style={{ fontSize: '13px', color: 'var(--pebble)', lineHeight: 1.6 }}>{m.output}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEGAL */}
        {page === 'legal' && (
          <div style={{ maxWidth: '896px', margin: '0 auto' }}>
            <div className="card-archival" style={{ padding: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
                <div style={{ padding: '16px', background: 'rgba(248,216,160,0.05)', border: '1px solid var(--igniting)' }}>
                  <Terminal size={48} style={{ color: 'var(--igniting)' }} />
                </div>
                <div>
                  <h2 className="t-heading" style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--fake-blonde)', textTransform: 'uppercase' }}>
                    {"The Shepherd's Crook"}
                  </h2>
                  <p className="t-mono" style={{ fontSize: '11px', color: 'var(--tiger)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '4px' }}>
                    Linguistic extraction for communal standing
                  </p>
                </div>
              </div>

              <p className="t-scripture" style={{ fontStyle: 'italic', fontSize: '18px', color: 'var(--pebble)', marginBottom: '48px', borderLeft: '2px solid var(--caramel)', paddingLeft: '32px' }}>
                Navigate the worldly legal apparatus through a high-density restorative framework.
                Extract mandates for dignity and public standing.
              </p>

              <div style={{ marginBottom: '48px' }}>
                <label className="t-mono" style={{ fontSize: '10px', color: 'var(--tiger)', display: 'block', marginBottom: '16px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.12em' }}>
                  // INPUT_QUERY_FOR_ARCHIVAL_ANALYSIS:
                </label>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }} className="no-print">
                  {LEGAL_TOPICS.map(t => (
                    <button
                      key={t}
                      onClick={() => setLegalQuestion(t)}
                      className="t-mono"
                      style={{ fontSize: '9px', border: '1px solid var(--pebble)', padding: '8px 12px', background: 'none', cursor: 'pointer', color: 'var(--pebble)', textTransform: 'uppercase' }}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  <input
                    type="text"
                    value={legalQuestion}
                    onChange={(e) => setLegalQuestion(e.target.value)}
                    style={{
                      flex: 1, minWidth: '200px', fontSize: '16px', padding: '20px',
                      background: 'rgba(48,40,40,0.5)', border: '1px solid var(--pebble)',
                      color: 'var(--fake-blonde)', outline: 'none',
                      fontFamily: "'Share Tech Mono', monospace",
                    }}
                    placeholder="> e.g. How to access food assistance..."
                  />
                  <button
                    onClick={() => void callGemini(legalQuestion)}
                    disabled={isLoading || !isKeySet}
                    className="btn-brutal"
                    style={{
                      background: 'var(--igniting)', color: 'var(--diesel)',
                      fontWeight: 'bold', boxShadow: 'var(--shadow-brutal)',
                      opacity: (isLoading || !isKeySet) ? 0.3 : 1,
                      cursor: (isLoading || !isKeySet) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isLoading ? 'PROCESSING...' : 'SEEK'}
                  </button>
                </div>
                {!isKeySet && (
                  <div className="t-mono" style={{ fontSize: '10px', color: 'var(--tiger)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                    <Info size={12} /> KEY_REQUIRED_FOR_LIVE_EXTRACTION
                  </div>
                )}
              </div>

              {legalAnswer && (
                <div className="transition-page" style={{ marginTop: '48px', paddingTop: '48px', borderTop: '1px solid rgba(160,152,128,0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div className="t-mono" style={{ fontSize: '10px', color: 'var(--tiger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Database size={10} /> ARCHIVE_RETRIEVAL_SUCCESS // STATUS: DECRYPTED
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="t-mono no-print"
                      style={{ fontSize: '10px', color: 'var(--igniting)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Download size={14} /> [ EXPORT_DOSSIER ]
                    </button>
                  </div>
                  <div style={{ background: 'rgba(248,216,160,0.05)', padding: '40px', borderLeft: '4px solid var(--igniting)' }}>
                    <div
                      className="t-scripture"
                      style={{ fontSize: '18px', color: 'var(--champagne)' }}
                      dangerouslySetInnerHTML={{ __html: legalAnswer }}
                    />
                  </div>
                  <p className="t-mono" style={{ fontSize: '10px', color: 'rgba(160,152,128,0.4)', marginTop: '48px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                    // RESTORATIVE_PEACE_ALGORITHM // MUNICIPAL_TITLE_26_ALIGNED
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MAP */}
        {page === 'map' && (
          <div style={{ maxWidth: '1152px', margin: '0 auto', height: '70vh', display: 'flex', flexDirection: 'column' }}>
            <h2 className="t-heading" style={{
              fontSize: '36px', fontWeight: 'bold', marginBottom: '40px',
              color: 'var(--fake-blonde)', textTransform: 'uppercase',
              borderBottom: '1px solid var(--pebble)', paddingBottom: '16px',
              display: 'flex', alignItems: 'center', gap: '16px'
            }}>
              <Globe style={{ color: 'var(--igniting)' }} /> Global_Leylines
            </h2>
            <div className="card-archival" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(48,40,40,0.5)', overflow: 'hidden' }}>
              <div style={{ textAlign: 'center', padding: '48px' }}>
                <ShieldAlert size={64} style={{ color: 'var(--tiger)', margin: '0 auto 32px', display: 'block' }} />
                <p className="t-heading" style={{ fontSize: '28px', color: 'var(--fake-blonde)', letterSpacing: '0.4em', marginBottom: '24px', textTransform: 'uppercase' }}>
                  Visualization_Offline
                </p>
                <p className="t-mono" style={{ fontSize: '11px', color: 'var(--pebble)', maxWidth: '300px', margin: '0 auto', lineHeight: 1.6 }}>
                  Awaiting hand-shake with regional governance nodes.<br />
                  Leyline sync pending for Lawrence Sector transition.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MANUAL */}
        {page === 'manual' && (
          <div style={{ maxWidth: '896px', margin: '0 auto' }}>
            <h2 className="t-heading" style={{
              fontSize: '36px', fontWeight: 'bold', color: 'var(--fake-blonde)',
              textTransform: 'uppercase', borderBottom: '1px solid var(--pebble)',
              paddingBottom: '16px', marginBottom: '48px',
              display: 'flex', alignItems: 'center', gap: '20px'
            }}>
              <BookOpen style={{ color: 'var(--tiger)' }} /> Wisdom_Scrolls
            </h2>
            <div style={{ display: 'grid', gap: '32px' }}>
              {Object.values(MANUAL_DATA).map((d, i) => (
                <div key={i} className="card-archival" style={{ padding: '40px', borderLeft: '4px solid var(--tiger)' }}>
                  <h3 className="t-heading" style={{ fontSize: '20px', color: 'var(--igniting)', marginBottom: '24px', textTransform: 'uppercase' }}>{d.title}</h3>
                  <p className="t-scripture" style={{ color: 'rgba(240,208,152,0.9)', fontSize: '20px' }}>{d.content}</p>
                </div>
              ))}
            </div>

            <div className="card-archival" style={{ border: '2px solid rgba(248,216,160,0.3)', padding: '48px', marginTop: '80px', boxShadow: 'var(--shadow-brutal)' }}>
              <h2 className="t-heading" style={{
                fontSize: '28px', fontWeight: 'bold', textAlign: 'center',
                color: 'var(--fake-blonde)', marginBottom: '48px',
                borderBottom: '1px solid rgba(248,216,160,0.1)', paddingBottom: '24px', textTransform: 'uppercase'
              }}>
                The_Covenant_Vows
              </h2>
              <div style={{ marginBottom: '64px' }}>
                <span className="t-mono" style={{ fontSize: '10px', color: 'var(--igniting)', fontWeight: 'bold', display: 'block', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  // THE_SACRED_OATH
                </span>
                <p className="t-scripture" style={{ fontStyle: 'italic', fontSize: '22px', color: 'var(--fake-blonde)', borderLeft: '2px solid var(--igniting)', paddingLeft: '40px', lineHeight: 1.8 }}>
                  "{VOWS.oath}"
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px', marginBottom: '64px', fontFamily: "'Share Tech Mono', monospace", fontSize: '12px', color: 'var(--pebble)' }}>
                {VOWS.law.map(l => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--tiger)', flexShrink: 0 }} />
                    {l.toUpperCase()}
                  </div>
                ))}
              </div>
              <div className="t-heading" style={{
                textAlign: 'center', fontSize: '48px', fontWeight: 'bold',
                color: 'var(--igniting)', letterSpacing: '0.4em', padding: '48px 0',
                borderTop: '1px solid rgba(248,216,160,0.1)', borderBottom: '1px solid rgba(248,216,160,0.1)'
              }}>
                BE_THE_LIGHT
              </div>
            </div>
          </div>
        )}

        {/* PROGRAMS / INVOLVED */}
        {(page === 'programs' || page === 'involved') && (
          <div style={{ paddingTop: '80px', paddingBottom: '80px', textAlign: 'center' }}>
            <div className="card-archival" style={{ padding: '80px', maxWidth: '640px', margin: '0 auto', borderColor: 'var(--igniting)', background: 'rgba(248,216,160,0.05)' }}>
              <Sunrise size={60} style={{ color: 'var(--igniting)', margin: '0 auto 40px', display: 'block' }} />
              <h2 className="t-heading" style={{ fontSize: '36px', color: 'var(--igniting)', textTransform: 'uppercase', marginBottom: '32px' }}>
                Registry_Closed
              </h2>
              <p className="t-mono" style={{ color: 'var(--pebble)', letterSpacing: '0.2em', textTransform: 'uppercase', lineHeight: 2 }}>
                The high-density registry is being calibrated for the April 2026 transition.<br />
                Anchor your intent and await dispatch.
              </p>
              <button
                onClick={() => navigate('home')}
                className="btn-brutal"
                style={{ marginTop: '64px', borderColor: 'var(--igniting)', color: 'var(--igniting)' }}
              >
                RETURN_TO_INDEX
              </button>
            </div>
          </div>
        )}

      </main>

      {/* ── FOOTER ── */}
      <footer
        className="no-print"
        style={{ marginTop: '80px', borderTop: '1px solid rgba(160,152,128,0.2)', padding: '96px 0', background: 'rgba(48,40,40,0.5)', position: 'relative', zIndex: 10 }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <Feather size={48} style={{ margin: '0 auto 40px', opacity: 0.3, color: 'var(--pebble)', display: 'block' }} />
          <p className="t-scripture" style={{ fontStyle: 'italic', fontSize: '28px', color: 'rgba(160,152,128,0.6)', maxWidth: '640px', margin: '0 auto 40px' }}>
            "I have set my rainbow in the clouds, and it will be the sign of the covenant between me and the earth."
          </p>
          <p className="t-mono" style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--tiger)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            GENESIS 9:13
          </p>
          <div style={{ marginTop: '80px', paddingTop: '48px', borderTop: '1px solid rgba(160,152,128,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
            <div className="t-mono" style={{ fontSize: '10px', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 'bold' }}>
              &copy; 2026 // COVENANT OF THE RAINBOW // Lawrence_Sector_Archive
            </div>
            <div style={{ display: 'flex', gap: '24px', opacity: 0.3 }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--igniting)' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--tiger)' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--pebble)' }} />
            </div>
          </div>
        </div>
      </footer>

      {/* Responsive nav */}
      <style>{`
        @media (min-width: 1024px) {
          .cotr-desktop-nav { display: flex !important; }
          .cotr-mobile-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(<App />);
