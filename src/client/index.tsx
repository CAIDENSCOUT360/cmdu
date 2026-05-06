import "./styles.css";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Tab = "exegesis" | "library";

interface BibleBook {
  name: string;
  chapters: number;
  testament: "OT" | "NT";
}

interface Denom {
  id: string;
  name: string;
  tradition: string;
  color: string;
}

interface VerseData {
  text: string;
  citation: string;
  rawRef: string;
}

interface ChapterVerse {
  verse: number;
  text: string;
}

// ─── BIBLE CANON ──────────────────────────────────────────────────────────────

const BOOKS: BibleBook[] = [
  { name: "Genesis", chapters: 50, testament: "OT" },
  { name: "Exodus", chapters: 40, testament: "OT" },
  { name: "Leviticus", chapters: 27, testament: "OT" },
  { name: "Numbers", chapters: 36, testament: "OT" },
  { name: "Deuteronomy", chapters: 34, testament: "OT" },
  { name: "Joshua", chapters: 24, testament: "OT" },
  { name: "Judges", chapters: 21, testament: "OT" },
  { name: "Ruth", chapters: 4, testament: "OT" },
  { name: "1 Samuel", chapters: 31, testament: "OT" },
  { name: "2 Samuel", chapters: 24, testament: "OT" },
  { name: "1 Kings", chapters: 22, testament: "OT" },
  { name: "2 Kings", chapters: 25, testament: "OT" },
  { name: "1 Chronicles", chapters: 29, testament: "OT" },
  { name: "2 Chronicles", chapters: 36, testament: "OT" },
  { name: "Ezra", chapters: 10, testament: "OT" },
  { name: "Nehemiah", chapters: 13, testament: "OT" },
  { name: "Esther", chapters: 10, testament: "OT" },
  { name: "Job", chapters: 42, testament: "OT" },
  { name: "Psalms", chapters: 150, testament: "OT" },
  { name: "Proverbs", chapters: 31, testament: "OT" },
  { name: "Ecclesiastes", chapters: 12, testament: "OT" },
  { name: "Song of Solomon", chapters: 8, testament: "OT" },
  { name: "Isaiah", chapters: 66, testament: "OT" },
  { name: "Jeremiah", chapters: 52, testament: "OT" },
  { name: "Lamentations", chapters: 5, testament: "OT" },
  { name: "Ezekiel", chapters: 48, testament: "OT" },
  { name: "Daniel", chapters: 12, testament: "OT" },
  { name: "Hosea", chapters: 14, testament: "OT" },
  { name: "Joel", chapters: 3, testament: "OT" },
  { name: "Amos", chapters: 9, testament: "OT" },
  { name: "Obadiah", chapters: 1, testament: "OT" },
  { name: "Jonah", chapters: 4, testament: "OT" },
  { name: "Micah", chapters: 7, testament: "OT" },
  { name: "Nahum", chapters: 3, testament: "OT" },
  { name: "Habakkuk", chapters: 3, testament: "OT" },
  { name: "Zephaniah", chapters: 3, testament: "OT" },
  { name: "Haggai", chapters: 2, testament: "OT" },
  { name: "Zechariah", chapters: 14, testament: "OT" },
  { name: "Malachi", chapters: 4, testament: "OT" },
  { name: "Matthew", chapters: 28, testament: "NT" },
  { name: "Mark", chapters: 16, testament: "NT" },
  { name: "Luke", chapters: 24, testament: "NT" },
  { name: "John", chapters: 21, testament: "NT" },
  { name: "Acts", chapters: 28, testament: "NT" },
  { name: "Romans", chapters: 16, testament: "NT" },
  { name: "1 Corinthians", chapters: 16, testament: "NT" },
  { name: "2 Corinthians", chapters: 13, testament: "NT" },
  { name: "Galatians", chapters: 6, testament: "NT" },
  { name: "Ephesians", chapters: 6, testament: "NT" },
  { name: "Philippians", chapters: 4, testament: "NT" },
  { name: "Colossians", chapters: 4, testament: "NT" },
  { name: "1 Thessalonians", chapters: 5, testament: "NT" },
  { name: "2 Thessalonians", chapters: 3, testament: "NT" },
  { name: "1 Timothy", chapters: 6, testament: "NT" },
  { name: "2 Timothy", chapters: 4, testament: "NT" },
  { name: "Titus", chapters: 3, testament: "NT" },
  { name: "Philemon", chapters: 1, testament: "NT" },
  { name: "Hebrews", chapters: 13, testament: "NT" },
  { name: "James", chapters: 5, testament: "NT" },
  { name: "1 Peter", chapters: 5, testament: "NT" },
  { name: "2 Peter", chapters: 3, testament: "NT" },
  { name: "1 John", chapters: 5, testament: "NT" },
  { name: "2 John", chapters: 1, testament: "NT" },
  { name: "3 John", chapters: 1, testament: "NT" },
  { name: "Jude", chapters: 1, testament: "NT" },
  { name: "Revelation", chapters: 22, testament: "NT" },
];

// ─── DENOMINATIONS ────────────────────────────────────────────────────────────

const DENOMINATIONS: Denom[] = [
  {
    id: "roman-catholic",
    name: "Roman Catholic",
    tradition: "Latin Church",
    color: "#8B1A1A",
  },
  {
    id: "eastern-orthodox",
    name: "Eastern Orthodox",
    tradition: "Greek Tradition",
    color: "#1A3A6B",
  },
  {
    id: "lutheran",
    name: "Lutheran",
    tradition: "Reformation",
    color: "#1B4332",
  },
  {
    id: "reformed",
    name: "Reformed / Presbyterian",
    tradition: "Calvinist",
    color: "#1A3A5C",
  },
  {
    id: "anglican",
    name: "Anglican / Episcopal",
    tradition: "Via Media",
    color: "#3D2B1F",
  },
  {
    id: "methodist",
    name: "Methodist",
    tradition: "Wesleyan",
    color: "#4A2060",
  },
  {
    id: "baptist",
    name: "Baptist",
    tradition: "Free Church",
    color: "#1A3A1A",
  },
  {
    id: "pentecostal",
    name: "Pentecostal",
    tradition: "Spirit-Filled",
    color: "#7A3B0A",
  },
];

// ─── COMMENTARY ENGINE ────────────────────────────────────────────────────────

function getCommentary(denomId: string, ref: string): string {
  const templates: Record<string, string> = {
    "roman-catholic": `Within the Catholic tradition, ${ref} is read in light of the living Magisterium and the deposit of faith transmitted through apostolic succession. Sacred Tradition and Sacred Scripture together form "one sacred deposit of the Word of God" (Dei Verbum §10), and neither may be interpreted in isolation. The Church Fathers—particularly Augustine, Ambrose, and Aquinas—constitute the primary hermeneutical court. This passage finds its fullest resonance within the sacramental economy, where the written word becomes a living encounter with Christ present in the Church. The Catechism situates this text within salvation history, emphasizing the communal, liturgical context in which Scripture achieves its purpose. The sensus plenior—the deeper spiritual sense—supplements the literal meaning, guaranteed by the Church's interpretive authority.`,

    "eastern-orthodox": `The Orthodox Church approaches ${ref} through the lens of theosis (θέωσις)—the divine-human communion expressed by Athanasius: "God became man that man might become god." Patristic exegesis from Chrysostom, the Cappadocians, and Maximus the Confessor illuminates this passage as a synergistic encounter of divine grace (χάρις) and human freedom (αὐτεξούσιον). The apophatic tradition—knowing God through sacred negation—reminds us that the fullness of meaning always exceeds human formulation. Scripture is never read in isolation but always within the Divine Liturgy, where holy icons, the Eucharist, and the gathered ekklesia constitute the interpretive horizon. Holy Tradition—the living memory of the Spirit dwelling among the faithful—guards the authentic, patristic reading of this text against all heterodox innovation.`,

    "lutheran": `Luther's hermeneutical criterion of was Christum treibet—"what drives Christ forward"—governs the Lutheran reading of ${ref}. The Law/Gospel distinction is paramount: the Law exposes human sin and drives the conscience to despair of all self-righteousness; the Gospel announces the free, unconditional grace of God in Christ crucified. The theologia crucis confronts all theologies of glory. For Luther, Scripture interprets Scripture (analogia scripturae), and the external Word (verbum externum) grounds faith objectively. The Book of Concord provides the confessional framework. This text participates in the radical grace that justifies the ungodly (iustificatio impii) through faith alone (sola fide), apart from all works—the article by which the Church stands or falls.`,

    "reformed": `The Reformed tradition approaches ${ref} through the lens of covenant theology and the absolute sovereignty of divine grace. Calvin's hermeneutical principle of accommodatio—God's gracious self-disclosure in forms suited to human capacity—frames this text. The Westminster Confession affirms that "the infallible rule of interpretation of Scripture is the Scripture itself" (WCF I.9). The doctrines of grace illuminate every passage as part of God's eternal decree (decretum absolutum). The regulative principle extends to hermeneutics: Scripture alone (sola scriptura) governs all interpretation. This verse participates in the eternal covenant of grace established before the foundation of the world for the glory of God and the salvation of the elect.`,

    "anglican": `Anglican exegesis of ${ref} embodies the via media—the comprehensive middle way holding together Catholic order, Reformed doctrine, and evangelical piety. Richard Hooker's Laws of Ecclesiastical Polity establishes Scripture, Tradition, and Reason as the Anglican hermeneutical method. The Book of Common Prayer shapes interpretation, as Scripture is encountered primarily in the liturgical assembly of the gathered Church. The Caroline Divines—Andrewes, Herbert, Taylor—offer a richly devotional, patristically-informed commentary. The Thirty-Nine Articles provide confessional parameters while leaving room for theological breadth. This passage speaks to the whole person—intellect, affection, and will—within the ordered life of the Church under apostolic ministry.`,

    "methodist": `The Wesleyan Quadrilateral—Scripture (as primary authority), Tradition, Reason, and Experience—structures the Methodist engagement with ${ref}. Wesley's doctrine of prevenient grace holds that God's preventing love precedes all human response, rendering this text accessible to every soul. The via salutis (way of salvation) moves through prevenient grace, conviction, repentance, justification, regeneration, and entire sanctification (perfectio). Wesley's homiletical tradition emphasizes the practical application of Scripture: faith working through love (fides caritate formata) transforms individuals and society. Charles Wesley's 6,000+ hymns weave scriptural texts into congregational devotion. This passage invites the believer into progressive sanctification—the restoration of the image of God in which we were created.`,

    "baptist": `Baptist hermeneutics approaches ${ref} through the twin principles of sola scriptura and the priesthood of all believers. Soul competency—Roger Williams' foundational conviction—means every regenerate believer stands directly before the Word without ecclesiastical mediation. The Baptist tradition prioritizes grammatical-historical exegesis: the plain sense of the text in its original literary and historical context, interpreted by the analogy of faith. The Baptist Faith and Message affirms the Bible as "the supreme standard by which all human conduct, creeds, and religious opinions should be tried." Regenerate church membership shapes the community's interpretation. This verse speaks directly to the individual heart, requiring personal appropriation through repentance and faith.`,

    "pentecostal": `The Pentecostal tradition reads ${ref} through pneumatological immediacy—the living presence of the Holy Spirit illuminating the Word now. The Azusa Street Revival (1906) inaugurated the recovery of apostolic charismata: tongues, prophecy, healing, and signs described in Acts 2 and 1 Corinthians 12–14. For Pentecostals, the Bible is not merely a historical record but a rhema word—the Spirit's living speech-act to the gathered community in the present moment. Signs, wonders, and gifts of the Spirit provide the experiential matrix within which Scripture is interpreted. This passage carries present-tense power: God's promises are being fulfilled now, in the ongoing fullness of the Spirit's outpouring. The fivefold ministry (Ephesians 4) provides communal discernment of the Spirit's application of this text.`,
  };

  return (
    templates[denomId] ??
    `${ref} is received within this tradition's distinctive theological framework, bringing its particular hermeneutical lens to bear upon the eternal Word of God.`
  );
}

function buildSynthesis(denomIds: string[], ref: string): string {
  const names = denomIds.map(
    (id) => DENOMINATIONS.find((d) => d.id === id)?.name ?? id,
  );
  const emphases: Record<string, string> = {
    "roman-catholic": "sacramental mediation and Magisterial authority",
    "eastern-orthodox": "theosis and patristic consensus",
    lutheran: "the Law/Gospel distinction and justification by faith alone",
    reformed: "divine sovereignty and covenant theology",
    anglican: "the via media of Scripture, Tradition, and Reason",
    methodist:
      "prevenient grace and the way of salvation toward entire sanctification",
    baptist: "soul competency and direct individual access to Scripture",
    pentecostal: "pneumatological immediacy and the present activity of the Spirit",
  };

  const listStr =
    names.length === 1
      ? names[0]
      : names.slice(0, -1).join(", ") + ", and " + names[names.length - 1];

  const bullets = denomIds
    .map((id) => {
      const denom = DENOMINATIONS.find((d) => d.id === id);
      const em = emphases[id] ?? "its distinctive theological framework";
      return `• ${denom?.name ?? id}: Reads this passage through ${em}.`;
    })
    .join("\n\n");

  return (
    `Comparative Synthesis — ${ref}\n\n` +
    `A cross-traditional reading of ${ref} across the ${listStr} tradition${names.length > 1 ? "s" : ""} reveals both the unity and diversity of Christian interpretation.\n\n` +
    bullets +
    `\n\nDespite these distinct emphases, all traditions affirm the divine authority of this text and its power to transform the believing community. The diversity of interpretation enriches rather than diminishes the text's inexhaustible meaning. Together these traditions form a composite portrait of the Word of God that no single perspective could fully contain.`
  );
}

// ─── BIBLE API ────────────────────────────────────────────────────────────────

async function lookupVerse(ref: string): Promise<VerseData | null> {
  try {
    const enc = ref.trim().replace(/\s+/g, "+");
    const res = await fetch(
      `https://bible-api.com/${enc}?translation=kjv`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { text?: string; reference?: string };
    if (!data.text) return null;
    return {
      text: `"${data.text.trim().replace(/\n/g, " ")}"`,
      citation: data.reference ?? ref,
      rawRef: ref,
    };
  } catch {
    return null;
  }
}

async function loadChapter(
  book: string,
  ch: number,
): Promise<ChapterVerse[] | null> {
  try {
    const enc = `${book.replace(/\s+/g, "+")}+${ch}`;
    const res = await fetch(
      `https://bible-api.com/${enc}?translation=kjv`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      verses?: { verse: number; text: string }[];
    };
    return data.verses ?? null;
  } catch {
    return null;
  }
}

// ─── SOOTHING VOICE SELECTION ────────────────────────────────────────────────

// Ordered list of voice names known to be warm/resonant/soothing.
// The hook tries each in order and falls back to any available English voice.
const SOOTHING_VOICE_PREFS = [
  "Google UK English Female", // Chrome – clear, warm British female
  "Samantha",                 // macOS/iOS – calm, natural
  "Karen",                    // macOS/iOS – clear Australian female
  "Moira",                    // macOS – warm Irish female
  "Serena",                   // macOS – measured, soothing
  "Tessa",                    // macOS – South African female
  "Google UK English Male",   // Chrome – deep, resonant British male
  "Daniel",                   // macOS – calm British male
];

function useSoothingVoice(): SpeechSynthesisVoice | null {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    function pick(): SpeechSynthesisVoice | null {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return null;
      for (const name of SOOTHING_VOICE_PREFS) {
        const v = voices.find((v) => v.name === name);
        if (v) return v;
      }
      // Any English female voice (heuristic)
      const engFem = voices.find(
        (v) => v.lang.startsWith("en") && /female|woman/i.test(v.name),
      );
      if (engFem) return engFem;
      // Any English voice
      return voices.find((v) => v.lang.startsWith("en")) ?? voices[0] ?? null;
    }

    const v = pick();
    if (v) {
      setVoice(v);
    } else {
      const handler = () => {
        const picked = pick();
        if (picked) setVoice(picked);
      };
      window.speechSynthesis.addEventListener("voiceschanged", handler);
      return () =>
        window.speechSynthesis.removeEventListener("voiceschanged", handler);
    }
  }, []);

  return voice;
}

// ─── AUDIO PLAYER HOOK ────────────────────────────────────────────────────────

function useAudioPlayer(
  verses: ChapterVerse[],
  voice: SpeechSynthesisVoice | null,
) {
  const [playing, setPlaying] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  // Default rate 0.88 — slightly slower than natural speech feels meditative
  const [rate, setRateState] = useState(0.88);

  const activeRef = useRef(false);
  const activeIdxRef = useRef(-1);
  const rateRef = useRef(0.88);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Keep voice ref in sync with latest resolved voice
  useEffect(() => {
    voiceRef.current = voice;
  }, [voice]);

  const cancel = useCallback(() => {
    activeRef.current = false;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const stop = useCallback(() => {
    cancel();
    setPlaying(false);
    setActiveIdx(-1);
    activeIdxRef.current = -1;
  }, [cancel]);

  const speakFrom = useCallback(
    (startIdx: number) => {
      cancel();
      activeRef.current = true;
      setPlaying(true);

      function next(idx: number) {
        if (!activeRef.current || idx >= verses.length) {
          activeRef.current = false;
          setPlaying(false);
          setActiveIdx(-1);
          activeIdxRef.current = -1;
          return;
        }
        activeIdxRef.current = idx;
        setActiveIdx(idx);

        const utt = new SpeechSynthesisUtterance(verses[idx].text);
        // Soothing voice settings: slower rate, slightly lower pitch
        utt.rate = rateRef.current;
        utt.pitch = 0.92;
        utt.volume = 1.0;
        if (voiceRef.current) utt.voice = voiceRef.current;

        utt.onend = () => {
          if (activeRef.current) next(idx + 1);
        };
        utt.onerror = () => {
          if (activeRef.current) next(idx + 1);
        };
        window.speechSynthesis.speak(utt);
      }

      next(startIdx);
    },
    [cancel, verses],
  );

  const togglePlay = useCallback(() => {
    if (playing) {
      stop();
    } else {
      speakFrom(activeIdxRef.current >= 0 ? activeIdxRef.current : 0);
    }
  }, [playing, stop, speakFrom]);

  const changeRate = useCallback(
    (newRate: number) => {
      rateRef.current = newRate;
      setRateState(newRate);
      // Restart from current verse at new rate if already playing
      if (activeRef.current) {
        const idx = activeIdxRef.current;
        cancel();
        setTimeout(() => {
          if (idx >= 0) speakFrom(idx);
        }, 50);
      }
    },
    [cancel, speakFrom],
  );

  // Stop playback whenever the verse list changes (new chapter/book loaded)
  useEffect(() => {
    stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verses]);

  // Cancel on unmount
  useEffect(() => {
    return () => {
      activeRef.current = false;
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  return { playing, activeIdx, rate, togglePlay, stop, speakFrom, changeRate };
}

// ─── QUICK REFS ───────────────────────────────────────────────────────────────

const QUICK_REFS = [
  { label: "Ps 23:1", ref: "Psalm 23:1" },
  { label: "Isa 40:31", ref: "Isaiah 40:31" },
  { label: "Mt 6:33", ref: "Matthew 6:33" },
  { label: "Ph 4:13", ref: "Philippians 4:13" },
  { label: "Jn 3:16", ref: "John 3:16" },
  { label: "Jn 14:27", ref: "John 14:27" },
  { label: "Rv 21:4", ref: "Revelation 21:4" },
  { label: "Rom 8:28", ref: "Romans 8:28" },
];

// ─── TILT HOOK — mouse-tracking 3D card tilt ─────────────────────────────────

function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotY = (x - 0.5) * 18;   // -9..+9 deg
    const rotX = (0.5 - y) * 12;   // -6..+6 deg
    el.style.setProperty("--tilt-x", `${rotX}deg`);
    el.style.setProperty("--tilt-y", `${rotY}deg`);
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

// ── Top Navigation ────────────────────────────────────────────────────────────

function Nav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <nav className="sticky-nav shadow-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center py-3">
          {/* Brand */}
          <div className="flex items-center gap-2 md:gap-3 text-white">
            <div className="w-8 h-8 md:w-9 md:h-9 border-2 border-white rounded flex items-center justify-center flex-shrink-0 bg-[#C8102E] relative overflow-hidden cross-logo">
              <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[#003366]" />
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                className="relative z-10"
              >
                <path d="M12 3v18M5 10h14" />
              </svg>
            </div>
            <div>
              <h1 className="cinzel text-base md:text-lg font-bold tracking-widest leading-none">
                Trinity Parish
              </h1>
              <p className="text-[7px] md:text-[8px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mt-0.5">
                High-Density Scriptural Exegesis
              </p>
            </div>
          </div>

          {/* Desktop tab buttons (hidden on mobile — use bottom nav instead) */}
          <div className="hidden md:flex items-center gap-6 cinzel text-[10px] font-bold tracking-widest uppercase">
            <button
              onClick={() => setTab("exegesis")}
              className={`nav-tab pb-1 ${tab === "exegesis" ? "active" : ""}`}
            >
              Exegesis
            </button>
            <button
              onClick={() => setTab("library")}
              className={`nav-tab pb-1 ${tab === "library" ? "active" : ""}`}
            >
              Library
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ── Mobile Bottom Navigation ──────────────────────────────────────────────────

function MobileBottomNav({
  tab,
  setTab,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
}) {
  return (
    <nav className="mobile-bottom-nav md:hidden" aria-label="Main navigation">
      <button
        onClick={() => setTab("exegesis")}
        className={`mobile-bottom-tab ${tab === "exegesis" ? "active" : ""}`}
        aria-current={tab === "exegesis" ? "page" : undefined}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 3v18M5 10h14" />
        </svg>
        <span>Exegesis</span>
      </button>
      <button
        onClick={() => setTab("library")}
        className={`mobile-bottom-tab ${tab === "library" ? "active" : ""}`}
        aria-current={tab === "library" ? "page" : undefined}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
        <span>Library</span>
      </button>
    </nav>
  );
}

// ── Audio Controls ────────────────────────────────────────────────────────────

function AudioControls({
  playing,
  activeIdx,
  rate,
  voiceName,
  bookName,
  chapter,
  onTogglePlay,
  onStop,
  onRateChange,
}: {
  playing: boolean;
  activeIdx: number;
  rate: number;
  voiceName: string;
  bookName: string;
  chapter: number;
  onTogglePlay: () => void;
  onStop: () => void;
  onRateChange: (r: number) => void;
}) {
  const RATES: [number, string][] = [
    [0.75, "¾×"],
    [0.88, "1×"],
    [1.1, "1¼×"],
    [1.35, "1½×"],
  ];

  const statusText = playing
    ? `Reading ${bookName} ${chapter}:${activeIdx + 1}`
    : activeIdx >= 0
      ? `Paused — verse ${activeIdx + 1}`
      : `Audio Bible · ${bookName} ${chapter}`;

  return (
    <div className="audio-player flex items-center gap-3 px-4 py-2.5 flex-wrap">
      {/* Play / Pause */}
      <button
        onClick={onTogglePlay}
        className="audio-play-btn"
        aria-label={playing ? "Pause reading" : "Play chapter"}
      >
        {playing ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>

      {/* Stop */}
      <button
        onClick={onStop}
        disabled={!playing && activeIdx < 0}
        className="audio-stop-btn"
        aria-label="Stop reading"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>
      </button>

      {/* Status */}
      <div className="flex-1 min-w-0">
        <p className="cinzel text-[9px] uppercase tracking-widest text-[#C5A059] truncate">
          {statusText}
        </p>
        {voiceName && (
          <p className="sans text-[8px] text-white/45 truncate mt-0.5">
            {voiceName}
          </p>
        )}
      </div>

      {/* Speed selector */}
      <div className="flex items-center gap-1" aria-label="Playback speed">
        {RATES.map(([r, label]) => (
          <button
            key={r}
            onClick={() => onRateChange(r)}
            className={`cinzel text-[8px] font-bold px-2 py-1 rounded transition-colors min-h-[28px] ${
              Math.abs(rate - r) < 0.01
                ? "bg-[#C5A059] text-[#003366]"
                : "text-white/55 hover:text-white"
            }`}
            aria-pressed={Math.abs(rate - r) < 0.01}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Denomination Card ─────────────────────────────────────────────────────────

function DenomCard({
  denom,
  compareMode,
  selected,
  onToggle,
  onStudy,
  verseRef,
}: {
  denom: Denom;
  compareMode: boolean;
  selected: boolean;
  onToggle: () => void;
  onStudy: () => void;
  verseRef: string;
}) {
  const excerpt = getCommentary(denom.id, verseRef).slice(0, 150) + "…";
  const tilt = useTilt<HTMLDivElement>();

  return (
    <div className="card-3d-wrap">
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className={`card-3d denom-card bg-white border border-[#E5E0D8] border-t-4 ${selected ? "ring-2 ring-[#C5A059]" : ""}`}
        style={{ borderTopColor: denom.color }}
      >
        <div className="card-inner p-4">
          <div className="card-top-bar flex items-start justify-between mb-3 gap-2">
            <div className="min-w-0">
              <h4 className="cinzel text-[11px] font-bold text-[#1A1A1A] tracking-wide uppercase leading-tight">
                {denom.name}
              </h4>
              <p className="sans text-[9px] text-[#888] uppercase tracking-[0.15em] mt-0.5">
                {denom.tradition}
              </p>
            </div>
            {compareMode && (
              <button
                onClick={onToggle}
                className={`compare-checkbox flex-shrink-0 ${selected ? "checked" : ""}`}
                aria-label={selected ? "Deselect tradition" : "Select tradition"}
              >
                {selected && (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                  >
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                )}
              </button>
            )}
          </div>

          <p className="sans text-[11px] text-[#555] leading-relaxed line-clamp-3">
            {excerpt}
          </p>

          {!compareMode && (
            <button
              onClick={onStudy}
              className="mt-3 cinzel text-[9px] font-bold uppercase tracking-widest text-[#003366] hover:text-[#C8102E] transition-colors flex items-center gap-1 min-h-[36px]"
            >
              Study
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Study Modal ───────────────────────────────────────────────────────────────

function StudyModal({
  open,
  onClose,
  denom,
  verseRef,
  verseText,
  synthesisContent,
  isSynthesis,
}: {
  open: boolean;
  onClose: () => void;
  denom: Denom | null;
  verseRef: string;
  verseText: string;
  synthesisContent: string;
  isSynthesis: boolean;
}) {
  const touchStartY = useRef(0);

  // Swipe-down to close on mobile
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches[0].clientY - touchStartY.current > 80) onClose();
  };

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const content = isSynthesis
    ? synthesisContent
    : denom
      ? getCommentary(denom.id, verseRef)
      : "";

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1A1A1A]/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — right side on desktop, bottom sheet on mobile */}
      <div
        className="study-panel"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Mobile drag handle */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#003366]/30" />
        </div>

        <div className="p-6 md:p-10">
          <button
            onClick={onClose}
            className="mb-6 text-[#003366] hover:text-[#C8102E] transition-colors flex items-center gap-2 text-[10px] cinzel font-bold uppercase tracking-widest min-h-[44px]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Return
          </button>

          {isSynthesis ? (
            <div>
              <p className="cinzel text-[9px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-1">
                Comparative Synthesis
              </p>
              <h2 className="cinzel text-xl font-bold text-[#003366] mb-3">
                {verseRef}
              </h2>
              {verseText && (
                <p className="serif text-base italic text-[#444] mb-6 leading-relaxed border-l-2 border-[#C5A059] pl-4">
                  {verseText}
                </p>
              )}
              <div className="sans text-sm text-[#333] leading-relaxed whitespace-pre-line">
                {content}
              </div>
            </div>
          ) : denom ? (
            <div>
              <p className="cinzel text-[9px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-1">
                {denom.tradition}
              </p>
              <h2
                className="cinzel text-xl font-bold mb-1"
                style={{ color: denom.color }}
              >
                {denom.name}
              </h2>
              <p className="cinzel text-[10px] uppercase tracking-widest text-[#003366] mb-4">
                {verseRef}
              </p>
              {verseText && (
                <p className="serif text-base italic text-[#444] mb-6 leading-relaxed border-l-2 border-[#C5A059] pl-4">
                  {verseText}
                </p>
              )}
              <p className="sans text-sm text-[#333] leading-relaxed">
                {content}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── Exegesis Section ──────────────────────────────────────────────────────────

function ExegesisSection({
  verse,
  setVerse,
  onOpenStudy,
}: {
  verse: VerseData;
  setVerse: (v: VerseData) => void;
  onOpenStudy: (
    denom: Denom | null,
    isSynthesis: boolean,
    synthesis: string,
  ) => void;
}) {
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [synthLoading, setSynthLoading] = useState(false);
  const soothingVoice = useSoothingVoice();

  const listenToVerse = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(
      verse.text.replace(/[\u201c\u201d"]/g, ""),
    );
    utt.rate = 0.88;
    utt.pitch = 0.92;
    if (soothingVoice) utt.voice = soothingVoice;
    window.speechSynthesis.speak(utt);
  };

  const search = useCallback(
    async (ref: string) => {
      if (!ref.trim()) return;
      setLoading(true);
      setError("");
      const result = await lookupVerse(ref);
      setLoading(false);
      if (result) {
        setVerse(result);
      } else {
        setError(`Could not find "${ref}". Check the reference and try again.`);
      }
    },
    [setVerse],
  );

  const quickSearch = (ref: string) => {
    setInputVal(ref);
    void search(ref);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const runComparison = () => {
    if (selected.size < 2) return;
    setSynthLoading(true);
    const syn = buildSynthesis([...selected], verse.citation);
    setSynthLoading(false);
    onOpenStudy(null, true, syn);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-8">
      {/* Quick search tags — horizontally scrollable on mobile */}
      <div className="quick-tags-scroll mb-5">
        <div className="flex gap-1.5 w-max">
          {QUICK_REFS.map((qr) => (
            <button
              key={qr.ref}
              onClick={() => quickSearch(qr.ref)}
              className="ref-tag"
            >
              {qr.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void search(inputVal)}
            className="flex-1 py-3 px-4 text-base outline-none cinzel search-input-3d"
            placeholder="Scripture Reference (e.g. John 3:16)"
            aria-label="Scripture reference"
          />
          <button
            onClick={() => void search(inputVal)}
            disabled={loading}
            className="btn-3d bg-[#C5A059] text-[#003366] px-6 py-3 text-[11px] cinzel font-bold uppercase tracking-widest hover:bg-[#003366] hover:text-white transition-colors shadow-md disabled:opacity-60 whitespace-nowrap min-h-[50px]"
          >
            {loading ? "Seeking…" : "Seek"}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-[#C8102E] text-xs cinzel" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* Hero verse display */}
      <section className="hero-emboss mb-8 max-w-4xl mx-auto border-y border-[#003366]/20 py-6 px-5 text-center">
        <h2 className="serif text-xl md:text-2xl italic leading-relaxed text-[#1A1A1A] mb-3 verse-text-shadow">
          {verse.text}
        </h2>
        <p className="cinzel text-[11px] font-bold text-[#C8102E] tracking-[0.2em] uppercase mb-3">
          {verse.citation}
        </p>
        {"speechSynthesis" in window && (
          <button
            onClick={listenToVerse}
            className="inline-flex items-center gap-1.5 cinzel text-[9px] font-bold uppercase tracking-widest text-[#003366] hover:text-[#C8102E] transition-colors min-h-[36px]"
            aria-label="Listen to this verse"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[#C5A059]"
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
            Listen
          </button>
        )}
      </section>

      {/* Compare bar */}
      {compareMode && (
        <div className="max-w-4xl mx-auto mb-5">
          <div className="bg-[#003366] text-white py-2.5 px-4 flex items-center justify-between shadow-md gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="cinzel text-[10px] tracking-widest text-[#C5A059]">
                {selected.size} Selected
              </span>
              <button
                onClick={() =>
                  setSelected(new Set(DENOMINATIONS.map((d) => d.id)))
                }
                className="sans text-[9px] uppercase font-bold text-white/70 hover:text-white underline"
              >
                Compare All
              </button>
            </div>
            <button
              onClick={runComparison}
              disabled={selected.size < 2 || synthLoading}
              className="bg-[#C8102E] text-white px-4 py-1.5 text-[9px] cinzel font-bold uppercase tracking-widest disabled:opacity-50 whitespace-nowrap min-h-[36px]"
            >
              {synthLoading ? "…" : "Synthesize"}
            </button>
          </div>
        </div>
      )}

      {/* Traditions header */}
      <div className="flex items-center justify-between mb-4 border-b border-[#003366]/10 pb-1">
        <h3 className="cinzel text-[11px] text-[#003366] font-bold tracking-widest uppercase">
          Traditions
        </h3>
        <button
          onClick={() => {
            setCompareMode((m) => !m);
            setSelected(new Set());
          }}
          className={`sans text-[8px] uppercase font-bold tracking-widest border px-3 py-1 transition-all min-h-[36px] ${
            compareMode
              ? "bg-[#003366] text-white border-[#003366]"
              : "border-[#003366]/30 text-[#003366] hover:bg-[#003366] hover:text-white"
          }`}
        >
          {compareMode ? "Exit Comparison" : "Comparison Mode"}
        </button>
      </div>

      {/* Denominations grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DENOMINATIONS.map((denom) => (
          <DenomCard
            key={denom.id}
            denom={denom}
            compareMode={compareMode}
            selected={selected.has(denom.id)}
            onToggle={() => toggleSelect(denom.id)}
            onStudy={() => onOpenStudy(denom, false, "")}
            verseRef={verse.citation || verse.rawRef}
          />
        ))}
      </div>
    </main>
  );
}

// ── Library Section ───────────────────────────────────────────────────────────

function LibrarySection() {
  const [activeBook, setActiveBook] = useState<BibleBook>(BOOKS[0]);
  const [activeChapter, setActiveChapter] = useState(1);
  const [verses, setVerses] = useState<ChapterVerse[]>([]);
  const [chapterLoading, setChapterLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchChapter = useCallback(
    async (book: BibleBook, ch: number) => {
      setChapterLoading(true);
      setVerses([]);
      const result = await loadChapter(book.name, ch);
      setChapterLoading(false);
      if (result) setVerses(result);
    },
    [],
  );

  useEffect(() => {
    void fetchChapter(activeBook, activeChapter);
  }, [activeBook, activeChapter, fetchChapter]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const selectBook = (book: BibleBook) => {
    setActiveBook(book);
    setActiveChapter(1);
    setDrawerOpen(false);
  };

  const otBooks = BOOKS.filter((b) => b.testament === "OT");
  const ntBooks = BOOKS.filter((b) => b.testament === "NT");

  function BookList() {
    return (
      <>
        <div className="px-3 py-2 border-b bg-[#FDFBFC]">
          <p className="cinzel text-[8px] uppercase tracking-[0.2em] text-[#C8102E] font-bold">
            Old Testament
          </p>
        </div>
        {otBooks.map((b) => (
          <button
            key={b.name}
            onClick={() => selectBook(b)}
            className={`w-full text-left px-3 py-2 text-[12px] cinzel transition-colors min-h-[40px] ${
              activeBook.name === b.name
                ? "bg-[#003366] text-white font-bold"
                : "text-[#333] hover:bg-[#F0EDE8]"
            }`}
          >
            {b.name}
          </button>
        ))}
        <div className="px-3 py-2 border-b border-t mt-1 bg-[#FDFBFC]">
          <p className="cinzel text-[8px] uppercase tracking-[0.2em] text-[#C8102E] font-bold">
            New Testament
          </p>
        </div>
        {ntBooks.map((b) => (
          <button
            key={b.name}
            onClick={() => selectBook(b)}
            className={`w-full text-left px-3 py-2 text-[12px] cinzel transition-colors min-h-[40px] ${
              activeBook.name === b.name
                ? "bg-[#003366] text-white font-bold"
                : "text-[#333] hover:bg-[#F0EDE8]"
            }`}
          >
            {b.name}
          </button>
        ))}
      </>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-8">
      {/* Mobile: book picker trigger button */}
      <div className="md:hidden mb-3">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 bg-white border border-[#E5E0D8] px-4 py-3 w-full text-left shadow-sm min-h-[50px]"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#003366"
            strokeWidth="2"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z" />
          </svg>
          <span className="cinzel text-[11px] font-bold text-[#003366] uppercase tracking-wide flex-1">
            {activeBook.name}
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#666"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Desktop sidebar */}
        <div className="hidden md:flex w-full lg:w-1/4 bg-white border border-[#E5E0D8] border-t-4 border-t-[#003366] flex-col h-[70vh] sticky top-16 shadow-sm overflow-hidden">
          <div className="p-3 border-b bg-[#FDFBFC]">
            <h3 className="cinzel font-bold text-[#C8102E] text-sm tracking-wide uppercase">
              The Holy Canon
            </h3>
          </div>
          <div className="overflow-y-auto flex-1">
            <BookList />
          </div>
        </div>

        {/* Reading pane */}
        <div className="w-full lg:w-3/4 bg-white border border-[#E5E0D8] min-h-[50vh] flex flex-col shadow-sm">
          <div className="p-4 border-b bg-[#FDFBFC]">
            <h2 className="cinzel text-lg font-bold text-[#003366] uppercase tracking-wide mb-2">
              {activeBook.name}
            </h2>
            {/* Chapter selector */}
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {Array.from({ length: activeBook.chapters }, (_, i) => i + 1).map(
                (ch) => (
                  <button
                    key={ch}
                    onClick={() => setActiveChapter(ch)}
                    className={`chapter-btn ${activeChapter === ch ? "active" : ""}`}
                  >
                    {ch}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="p-5 md:p-8 flex-1 overflow-y-auto">
            {chapterLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="cinzel text-[11px] text-[#888] uppercase tracking-widest">
                  Loading…
                </p>
              </div>
            ) : verses.length > 0 ? (
              <div className="space-y-1">
                {verses.map((v) => (
                  <p
                    key={v.verse}
                    className="text-[15px] md:text-base leading-relaxed text-[#2A2A2A]"
                  >
                    <sup className="cinzel text-[9px] font-bold text-[#C8102E] mr-1">
                      {v.verse}
                    </sup>
                    {v.text.trim()}
                  </p>
                ))}
              </div>
            ) : (
              <p className="cinzel text-[11px] text-[#aaa] uppercase tracking-widest text-center py-12">
                No content available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile book drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Select a book"
        >
          <div
            className="absolute inset-0 bg-[#1A1A1A]/60"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] flex flex-col shadow-xl animate-[slideInUp_0.28s_ease_forwards]">
            <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
              <h3 className="cinzel font-bold text-[#C8102E] uppercase tracking-wide text-sm">
                The Holy Canon
              </h3>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-[#666] hover:text-[#C8102E] min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close book list"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto flex-1 pb-6">
              <BookList />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

function App() {
  const [tab, setTab] = useState<Tab>("exegesis");
  const [verse, setVerse] = useState<VerseData>({
    text: "\u201cIn the beginning was the Word, and the Word was with God, and the Word was God.\u201d",
    citation: "The Gospel According to John 1:1",
    rawRef: "John 1:1",
  });
  const [studyOpen, setStudyOpen] = useState(false);
  const [studyDenom, setStudyDenom] = useState<Denom | null>(null);
  const [isSynthesis, setIsSynthesis] = useState(false);
  const [synthesisContent, setSynthesisContent] = useState("");

  const handleOpenStudy = (
    denom: Denom | null,
    synthesis: boolean,
    synContent: string,
  ) => {
    setStudyDenom(denom);
    setIsSynthesis(synthesis);
    setSynthesisContent(synContent);
    setStudyOpen(true);
  };

  return (
    // Extra bottom padding on mobile so content clears the fixed bottom nav
    <div className="min-h-screen pb-16 md:pb-0">
      <Nav tab={tab} setTab={setTab} />

      {tab === "exegesis" && (
        <ExegesisSection
          verse={verse}
          setVerse={setVerse}
          onOpenStudy={handleOpenStudy}
        />
      )}

      {tab === "library" && <LibrarySection />}

      {/* Fixed bottom nav — visible only on mobile */}
      <MobileBottomNav tab={tab} setTab={setTab} />

      {/* Study panel */}
      <StudyModal
        open={studyOpen}
        onClose={() => setStudyOpen(false)}
        denom={studyDenom}
        verseRef={verse.citation}
        verseText={verse.text}
        synthesisContent={synthesisContent}
        isSynthesis={isSynthesis}
      />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(<App />);

