import { useEffect, useRef, type CSSProperties } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useAppStore } from './store';
import { modulesData } from './data/modules';
import { ProgressBar } from './components/ProgressBar';
import { ModuleRenderer } from './components/ModuleRenderer';
import { Mascot } from './components/Mascot';
import { Volume2, VolumeX, Home, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { speakEnglish } from './components/SoundButton';

const showLegacyHome = false;

const footerGroups: Array<{ title: string; links: string[] }> = [
  { title: 'Tentang', links: ['Misi kelas', 'Relawan', 'Panti asuhan', 'Materi gratis'] },
  { title: 'Materi', links: ['Alphabet', 'Vocabulary', 'Speaking', 'Mini game'] },
  { title: 'Kelas', links: ['Proyektor', 'Audio practice', 'Latihan grup', 'Review bintang'] },
  { title: 'Bantuan', links: ['Panduan guru', 'Akses suara', 'Mode laptop', 'Kontak'] },
  { title: 'Sosial', links: ['Dokumentasi', 'Komunitas', 'Kolaborasi', 'Updates'] },
];

type RevealStyle = CSSProperties & { '--i'?: number };

const revealDelay = (index: number): RevealStyle => ({ '--i': index });
const easeOutExpo = [0.16, 1, 0.3, 1] as const;

function App() {
  const {
    currentModule,
    currentSceneIndex,
    audioMuted,
    setModule,
    nextScene,
    prevScene,
    toggleAudio,
    mascotState,
    mascotSpeech
  } = useAppStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const activeModuleData = modulesData.find(m => m.id === currentModule);
  const activeScene = activeModuleData?.scenes[currentSceneIndex];
  const totalScenes = activeModuleData?.scenes.length || 0;

  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!revealElements.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    revealElements.forEach((element) => element.classList.add('reveal-ready'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.16 }
    );

    revealElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [currentModule]);

  const handleStartModule = (moduleId: number) => {
    setModule(moduleId);
    const greetingText = moduleId === 1 
      ? "Let's learn the Alphabet!" 
      : moduleId === 2 
      ? "Let's count and see colors!" 
      : "Let's speak English!";
    setTimeout(() => speakEnglish(greetingText, audioMuted), 500);
  };

  const handleTestSpeech = () => {
    speakEnglish("Hello children! Welcome to PreEdu EngKids!", audioMuted);
  };

  const scrollToCurriculum = () => {
    const target = document.getElementById('curriculum-new');
    if (!target) return;
    const headerOffset = 64;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 180 : scrollLeft + 180;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const motionPop = (delay = 0) => reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.56, delay, ease: easeOutExpo }
      };

  const floatMotion = (delay = 0, lift = 12) => reducedMotion
    ? {}
    : {
        animate: { y: [0, -lift, 0], rotateZ: [-1, 1, -1] },
        transition: { duration: 4.2, delay, repeat: Infinity, ease: 'easeInOut' as const }
      };

  // Friendly 3D module card tones, kept as full-card treatments instead of side stripes.
  const moduleCardStyles = [
    {
      border: 'border-[#2563eb] hover:border-[#2563eb]',
      iconBg: 'bg-[#dbeafe] text-[#1e3a8a] border-[#93c5fd]',
      btnColor: 'btn-3d-green',
      surface: 'bg-[#eff6ff]'
    },
    {
      border: 'border-[#2563eb] hover:border-[#2563eb]',
      iconBg: 'bg-[#e0f2fe] text-[#1d4ed8] border-[#bfdbfe]',
      btnColor: 'btn-3d-green',
      surface: 'bg-[#f4f9ff]'
    },
    {
      border: 'border-[#2563eb] hover:border-[#2563eb]',
      iconBg: 'bg-[#eef2ff] text-[#1e40af] border-[#c7d2fe]',
      btnColor: 'btn-3d-green',
      surface: 'bg-[#f7faff]'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white w-full overflow-x-hidden">
      {/* Top Navigation Bar */}
      <header className="app-header">
        <div className="app-header-inner">
          
          {/* Logo / Brand Name */}
          <div 
            onClick={() => setModule(null)} 
            className="app-header-brand"
          >
            <span className="app-header-logo">
              predu engkids
            </span>
          </div>

          {/* Center: Scrollable Language/Topic selector bar (only on Home) */}
          {currentModule === null && (
            <div className="hidden">
              <button 
                onClick={() => scroll('left')}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 active:scale-95 transition-all"
                type="button"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div 
                ref={scrollRef}
                className="flex-1 flex gap-4 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap py-1 select-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <a 
                  href="#curriculum-new"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToCurriculum();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-transparent hover:border-cloud-gray hover:bg-gray-50 text-sm font-din font-bold text-gray-500 transition-all"
                >
                  🇬🇧 ENGLISH
                </a>
                <a 
                  href="#module-1"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('module-1')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-transparent hover:border-cloud-gray hover:bg-gray-50 text-sm font-din font-bold text-gray-500 transition-all"
                >
                  👦 ALFABET
                </a>
                <a 
                  href="#module-2"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('module-2')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-transparent hover:border-cloud-gray hover:bg-gray-50 text-sm font-din font-bold text-gray-500 transition-all"
                >
                  🌳 WARNA & ANGKA
                </a>
                <a 
                  href="#module-3"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('module-3')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-transparent hover:border-cloud-gray hover:bg-gray-50 text-sm font-din font-bold text-gray-500 transition-all"
                >
                  💬 PERCAKAPAN
                </a>
              </div>

              <button 
                onClick={() => scroll('right')}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 active:scale-95 transition-all"
                type="button"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Module Title / Progress Bar */}
          {currentModule !== null && activeModuleData && (
            <div className="app-progress-cluster">
              <span className="app-progress-title">
                {activeModuleData.title}
              </span>
              <ProgressBar value={currentSceneIndex} max={totalScenes} className="app-progress-bar" />
            </div>
          )}

          {/* Toolbar Actions */}
          <div className="app-header-actions">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`app-header-audio
                ${audioMuted 
                  ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-[0_3px_0_#fda4af]' 
                  : 'bg-sky-50 border-sky-200 text-sky-500 shadow-[0_3px_0_#bae6fd]'
                }`}
              title={audioMuted ? "Aktifkan Suara" : "Bisukan Suara"}
              type="button"
            >
              {audioMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            {/* Home routing */}
            {currentModule !== null ? (
              <button
                onClick={() => setModule(null)}
                className="btn-3d btn-3d-gray px-6 py-3 text-sm flex items-center gap-2"
                type="button"
              >
                <Home size={18} /> <span className="hidden sm:inline">Beranda</span>
              </button>
            ) : (
              <button
                onClick={scrollToCurriculum}
                className="btn-3d btn-3d-green app-header-cta"
                type="button"
              >
                Get Started
              </button>
            )}
          </div>
        </div>

        {/* Mobile progress viewport */}
        {currentModule !== null && activeModuleData && (
          <div className="app-mobile-progress">
            <ProgressBar value={currentSceneIndex} max={totalScenes} />
          </div>
        )}
      </header>

      {/* Main Content Arena */}
      <main className="flex-1 w-full flex flex-col">
        {currentModule === null ? (
          
          /* Redesigned language-learning homepage dashboard - full bleed modular layout */
          <div className="w-full flex flex-col">
            <section className="duo-hero">
              <div className="duo-hero-inner">
                <motion.div className="duo-hero-art" data-reveal="pop" aria-hidden="true" {...motionPop(0.04)}>
                  <motion.div
                    className="duo-art-orbit"
                  >
                    <div className="duo-orbit-glow" />
                    <motion.div className="duo-float-card duo-float-card-a" {...floatMotion(0.1, 16)}>A</motion.div>
                    <motion.div className="duo-float-card duo-float-card-b" {...floatMotion(0.35, 12)}>cat</motion.div>
                    <motion.div className="duo-float-card duo-float-card-c" {...floatMotion(0.2, 14)}>10</motion.div>
                    <Mascot state="idle" className="duo-hero-mascot duo-hero-mimo" />
                    <motion.div className="duo-lesson-badge" {...floatMotion(0.45, 8)}>
                      <span>Today's path</span>
                      <b>Alphabet &gt; Words &gt; Review</b>
                    </motion.div>
                  </motion.div>
                </motion.div>

                <motion.div className="duo-cta-panel" data-reveal="rise" {...motionPop(0.12)}>
                  <span className="duo-hero-kicker">Predu EngKids classroom</span>
                  <h1>Belajar English jadi berani, seru, dan terarah.</h1>
                  <p className="duo-hero-subcopy">
                    Lesson path untuk anak-anak: huruf, kata, suara, mini game, lalu review bareng di layar laptop.
                  </p>
                  <div className="duo-hero-progress" aria-hidden="true">
                    {['Alphabet', 'Words', 'Speaking'].map((item, idx) => (
                      <span key={item} style={revealDelay(idx)}>{item}</span>
                    ))}
                  </div>
                  <motion.button
                    onClick={scrollToCurriculum}
                    className="btn-3d btn-3d-green duo-main-cta"
                    type="button"
                    whileHover={reducedMotion ? undefined : { scale: 1.03, y: -2 }}
                    whileTap={reducedMotion ? undefined : { scale: 0.98, y: 2 }}
                  >
                    Get Started
                  </motion.button>
                  <motion.button
                    onClick={handleTestSpeech}
                    className="btn-3d btn-3d-outline duo-secondary-cta"
                    type="button"
                    whileHover={reducedMotion ? undefined : { scale: 1.02, y: -1 }}
                    whileTap={reducedMotion ? undefined : { scale: 0.98, y: 2 }}
                  >
                    Test Voice
                  </motion.button>
                </motion.div>
              </div>
            </section>

            <section className="duo-language-bar" aria-label="Lesson topics">
              <div className="duo-language-inner">
                <ChevronLeft size={20} className="text-[#afafaf]" />
                {[
                  ['US', 'English'],
                  ['AZ', 'Alphabet'],
                  ['CL', 'Colors'],
                  ['NU', 'Numbers'],
                  ['SP', 'Speaking']
                ].map(([code, label]) => (
                  <a
                    key={label}
                    href="#curriculum-new"
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToCurriculum();
                    }}
                  >
                    <span>{code}</span>
                    {label}
                  </a>
                ))}
                <ChevronRight size={20} className="text-[#afafaf]" />
              </div>
            </section>

            <section className="duo-feature-section">
              <div className="duo-feature-grid">
                <div className="duo-feature-copyblock" data-reveal="slide-left">
                  <div className="duo-section-label">Projector ready lessons</div>
                  <h2>free. fun. effective.</h2>
                  <p className="duo-feature-copy">
                    Learning with Predu EngKids is guided, visual, and ready for a laptop classroom.
                    Every section gives the facilitator a clear action and gives children a big moment to answer together.
                  </p>

                  <div className="duo-pill-row">
                    {['Bite-sized lessons', 'Teacher guided', 'Audio practice', '100% free'].map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>

                <div className="duo-feature-visual" data-reveal="slide-right" aria-label="Classroom learning metrics">
                  <div className="duo-feature-board">
                    <div className="duo-board-topline">
                      <span>Today</span>
                      <strong>45 min class</strong>
                    </div>
                    <div className="duo-board-path">
                      {[
                        ['1', 'Warm up'],
                        ['2', 'Listen'],
                        ['3', 'Play'],
                        ['4', 'Review']
                      ].map(([step, label], idx) => (
                        <motion.div
                          className="duo-board-step"
                          key={label}
                          {...floatMotion(idx * 0.08, idx % 2 === 0 ? 4 : 7)}
                        >
                          <b>{step}</b>
                          <span>{label}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="duo-stat-row">
                    {[
                      ['200+', 'basic words'],
                      ['3', 'class modules'],
                      ['HD', 'projector ready']
                    ].map(([value, label], idx) => (
                      <motion.div
                        className="duo-stat-card"
                        key={label}
                        {...motionPop(idx * 0.05)}
                        whileHover={reducedMotion ? undefined : { y: -4, rotateX: 4 }}
                      >
                        <strong>{value}</strong>
                        <span>{label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="duo-classroom-section">
              <div className="duo-classroom-inner">
                <div className="duo-classroom-stage" data-reveal="pop">
                  <div className="duo-classroom-screen" aria-hidden="true">
                    <div className="duo-screen-header">
                      <span>Live lesson</span>
                      <strong>Alphabet</strong>
                    </div>
                    <div className="duo-screen-letter">B</div>
                    <div className="duo-screen-answer">Book</div>
                  </div>
                  <motion.div
                    className="duo-classroom-token token-left"
                    {...floatMotion(0.2, 10)}
                    aria-hidden="true"
                  >
                    cat
                  </motion.div>
                  <motion.div
                    className="duo-classroom-token token-right"
                    {...floatMotion(0.5, 8)}
                    aria-hidden="true"
                  >
                    A+
                  </motion.div>
                </div>

                <div className="duo-classroom-copy" data-reveal="slide-right">
                  <span>Not just slides</span>
                  <h2>kelasnya bergerak, tapi tetap gampang dipandu</h2>
                  <p>
                    Landing scroll sekarang mengikuti alur kelas: lihat konsep, dengarkan suara, main mini game,
                    lalu review bareng. Motion dipakai untuk menunjukkan progres, bukan sekadar efek random.
                  </p>
                  <div className="duo-classroom-checks">
                    {['Big laptop controls', 'Audio pronunciation', 'Wrong-answer review'].map((item) => (
                      <b key={item}>{item}</b>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="duo-anywhere-section">
              <div className="duo-anywhere-float duo-anywhere-float-a" aria-hidden="true">A</div>
              <div className="duo-anywhere-float duo-anywhere-float-b" aria-hidden="true">10</div>
              <div className="duo-anywhere-float duo-anywhere-float-c" aria-hidden="true">Hi</div>
              <div className="duo-anywhere-device duo-anywhere-device-left" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="duo-anywhere-device duo-anywhere-device-right" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="duo-anywhere-inner" data-reveal="slide-left">
                <h2>learn anytime, anywhere</h2>
                <p>
                  Open it on a laptop, connect to a projector, and run the whole lesson with big controls
                  the class can follow from across the room.
                </p>
              </div>
              <div className="duo-mini-game-strip" data-reveal="slide-right">
                {[
                  ['A', 'Pick the first letter'],
                  ['🔊', 'Listen and repeat'],
                  ['3 / 3', 'Celebrate progress']
                ].map(([mark, label], idx) => (
                  <motion.div
                    className="duo-mini-game-card"
                    key={label}
                    {...motionPop(idx * 0.07)}
                    whileHover={reducedMotion ? undefined : { y: -6, rotate: idx === 1 ? 0 : idx === 0 ? -2 : 2 }}
                  >
                    <strong>{mark}</strong>
                    <span>{label}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            <section id="curriculum-new" className="duo-course-section">
              <div className="duo-course-inner">
                <div className="duo-course-header" data-reveal="rise">
                  <span>Learning path</span>
                  <h2>pilih jalur belajar</h2>
                  <p>
                    Tiga level utama untuk kelas tatap muka: mulai dari huruf, lanjut ke kosakata,
                    lalu latihan bicara sederhana.
                  </p>
                </div>

                <div className="duo-course-grid">
                  {modulesData.map((module, idx) => {
                    const style = moduleCardStyles[idx % moduleCardStyles.length];
                    const activityCount = Math.max(module.scenes.length - 2, 1);
                    return (
                      <motion.article
                        key={module.id}
                        id={`lesson-${module.id}`}
                        className={`duo-course-card duo-course-card-${idx + 1}`}
                        data-reveal="pop"
                        style={revealDelay(idx)}
                        {...motionPop(idx * 0.08)}
                        whileHover={reducedMotion ? undefined : { y: -8, rotateX: 2, rotateY: idx === 1 ? 0 : idx === 0 ? -2 : 2 }}
                        whileTap={reducedMotion ? undefined : { scale: 0.99 }}
                      >
                        <div className="duo-course-topline">
                          <div className={`duo-course-badge ${style.iconBg}`}>{module.id}</div>
                          <span>{module.scenes.length} scenes</span>
                        </div>

                        <p className="duo-course-topic">{module.topic}</p>
                        <h3>{module.title}</h3>
                        <p className="duo-course-description">{module.description}</p>

                        <div className="duo-course-meta">
                          <span>{activityCount} aktivitas</span>
                          <span>Audio + mini game</span>
                        </div>

                        <motion.button
                          onClick={() => handleStartModule(module.id)}
                          className={`btn-3d ${style.btnColor} duo-course-button`}
                          type="button"
                          whileHover={reducedMotion ? undefined : { scale: 1.02 }}
                          whileTap={reducedMotion ? undefined : { scale: 0.98, y: 2 }}
                        >
                          Mulai Belajar
                        </motion.button>
                      </motion.article>
                    );
                  })}
                </div>
              </div>
            </section>
            
            {showLegacyHome && (
              <>
            {/* 1. Hero Block Section */}
            <section className="hidden w-full bg-white bg-dots relative border-b border-cloud-gray">
              <div className="max-w-[1140px] mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-12 items-center justify-between py-16 md:py-28">
                
                {/* Left Column: Text heading & action buttons */}
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                  <h1 className="text-5xl md:text-6xl font-feather text-duo-green mb-6 tracking-tight leading-none">
                    free. fun. effective.
                  </h1>
                  <p className="text-lg md:text-xl text-gray-500 font-din leading-relaxed mb-8 max-w-xl">
                    Belajar Bahasa Inggris bersama PreEdu EngKids sangat menyenangkan! Dengan metode interaktif tatap muka, bantu anak-anak menguasai kosakata dasar dengan gembira.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button
                      onClick={() => document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })}
                      className="btn-3d btn-3d-green px-8 py-4 text-base font-bold uppercase tracking-wider w-full sm:w-64"
                      type="button"
                    >
                      Mulai Belajar
                    </button>
                    <button
                      onClick={handleTestSpeech}
                      className="btn-3d btn-3d-outline px-8 py-4 text-base font-bold uppercase tracking-wider w-full sm:w-64"
                      type="button"
                    >
                      Tes Suara Mimo
                    </button>
                  </div>
                </div>

                {/* Right Column: Styled frame with Mascot */}
                <div className="w-full md:w-1/2 flex justify-center relative mt-8 md:mt-0">
                  <div className="absolute w-72 h-72 bg-emerald-100/50 rounded-full filter blur-3xl -z-10 -top-6 -left-6"></div>
                  <div className="absolute w-72 h-72 bg-sky-100/50 rounded-full filter blur-3xl -z-10 -bottom-6 -right-6"></div>

                  <div className="relative border-8 border-cloud-gray rounded-[40px] bg-white p-6 w-[310px] shadow-[0_12px_24px_rgba(0,0,0,0.06)] border-b-[16px] select-none">
                    {/* Smartphone top details */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-cloud-gray rounded-full"></div>
                    
                    {/* Phone interior screen content */}
                    <div className="flex flex-col items-center py-4">
                      <div className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs px-2.5 py-0.5 rounded-full font-bold font-din mb-4">
                        <Sparkles size={10} /> TERAKREDITASI #1
                      </div>
                      <Mascot state={mascotState} speechText={mascotSpeech} />
                      <div className="mt-4 text-center">
                        <p className="text-xs text-gray-400 font-din font-bold uppercase tracking-wider">PRESCHOOL HERO</p>
                        <h4 className="text-lg font-feather text-gray-800">Mimo Si Kucing Kampus</h4>
                      </div>
                    </div>
                  </div>

                  {/* Floating badge */}
                  <div className="absolute -bottom-4 -left-4 bg-white border-2 border-cloud-gray rounded-2xl p-3 shadow-md flex items-center gap-3 anim-breathe">
                    <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center text-white text-xl font-bold">
                      ★
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800 font-din">METODE SERU</p>
                      <p className="text-[10px] text-gray-400 font-din">100% Ramah Anak</p>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* 2. Feature Section - Stats Grid & Pills */}
            <section className="hidden w-full bg-white">
              <div className="max-w-[1140px] mx-auto px-6 md:px-12 py-20 flex flex-col items-center text-center">
                
                <h2 className="text-4xl md:text-5xl font-feather text-duo-green mb-4">
                  free. fun. effective.
                </h2>
                <p className="text-lg text-gray-500 font-din max-w-2xl mb-12">
                  Belajar bahasa baru membutuhkan waktu, namun kami menjamin sesi belajar akan sangat interaktif dengan modul terstruktur dan permainan yang memancing respon aktif anak-anak!
                </p>
                
                {/* Stats Card Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mb-10">
                  <div className="border-2 border-cloud-gray rounded-xl p-8 bg-white flex flex-col items-center shadow-none">
                    <span className="text-5xl font-feather text-duo-green mb-3">200+</span>
                    <span className="text-xs text-gray-400 font-din font-bold uppercase tracking-wider">KOSA KATA DASAR</span>
                  </div>
                  <div className="border-2 border-cloud-gray rounded-xl p-8 bg-white flex flex-col items-center shadow-none">
                    <span className="text-5xl font-feather text-[#1cb0f6] mb-3">100%</span>
                    <span className="text-xs text-gray-400 font-din font-bold uppercase tracking-wider">GRATIS & INTERAKTIF</span>
                  </div>
                  <div className="border-2 border-cloud-gray rounded-xl p-8 bg-white flex flex-col items-center shadow-none">
                    <span className="text-5xl font-feather text-[#a570ff] mb-3">3</span>
                    <span className="text-xs text-gray-400 font-din font-bold uppercase tracking-wider">MODUL UTAMA</span>
                  </div>
                </div>

                {/* Styled Outline Pills */}
                <div className="flex flex-wrap justify-center gap-4">
                  <span className="border-2 border-[#2563eb] text-[#1e3a8a] bg-[#dbeafe]/20 px-5 py-2.5 rounded-full text-sm font-din font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2563eb]"></span> Pelajaran Pendek
                  </span>
                  <span className="border-2 border-[#2563eb] text-[#1e3a8a] bg-[#dbeafe]/20 px-5 py-2.5 rounded-full text-sm font-din font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2563eb]"></span> Dipandu Guru
                  </span>
                  <span className="border-2 border-[#2563eb] text-[#1e3a8a] bg-[#dbeafe]/20 px-5 py-2.5 rounded-full text-sm font-din font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2563eb]"></span> 100% Gratis
                  </span>
                  <span className="border-2 border-[#2563eb] text-[#1e3a8a] bg-[#dbeafe]/20 px-5 py-2.5 rounded-full text-sm font-din font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2563eb]"></span> Ramah Anak
                  </span>
                </div>

              </div>
            </section>

            {/* 3. Floating Mock Card Section */}
            <section className="hidden w-full bg-[#ddf4ff] border-t border-b border-[#84d8ff] overflow-hidden">
              <div className="max-w-[1140px] mx-auto px-6 md:px-12 py-20 md:py-28 text-center relative">
                <div className="absolute w-20 h-20 bg-sky-300/30 rounded-full -top-6 -left-6 blur-lg"></div>
                <div className="absolute w-32 h-32 bg-sky-300/20 rounded-full -bottom-10 -right-10 blur-xl"></div>
                
                <h2 className="text-4xl md:text-5xl font-feather text-[#1899d6] mb-4">
                  learn anytime, anywhere
                </h2>
                <p className="text-lg text-gray-600 font-din max-w-2xl mx-auto mb-10 leading-relaxed">
                  Hubungkan laptop ke proyektor kelas atau gunakan tablet secara langsung. Pembelajaran tatap muka di panti asuhan akan menjadi petualangan visual interaktif yang tidak membosankan bagi anak-anak!
                </p>

                {/* Floating game screen layouts */}
                <div className="flex flex-wrap justify-center gap-6 relative z-10 select-none">
                  <div className="bg-white border-2 border-cloud-gray rounded-2xl p-4 w-44 shadow-[0_4px_0_var(--color-cloud-gray)] transform -rotate-3 hover:rotate-0 transition-all cursor-default">
                    <p className="text-[10px] text-gray-400 font-din font-bold">GAME 1: CHOOSE PHOTO</p>
                    <div className="w-full h-24 bg-sky-50 rounded-xl my-2 flex items-center justify-center text-3xl">🍎</div>
                    <p className="text-xs font-bold text-gray-800 font-din">Apple = Apel</p>
                  </div>
                  <div className="bg-white border-2 border-cloud-gray rounded-2xl p-4 w-44 shadow-[0_4px_0_var(--color-cloud-gray)] transform rotate-3 hover:rotate-0 transition-all cursor-default mt-4 md:mt-0">
                    <p className="text-[10px] text-gray-400 font-din font-bold">GAME 2: WORD MATCH</p>
                    <div className="w-full h-24 bg-emerald-50 rounded-xl my-2 flex items-center justify-center text-3xl">🐶</div>
                    <p className="text-xs font-bold text-gray-800 font-din">Dog = Anjing</p>
                  </div>
                  <div className="bg-white border-2 border-cloud-gray rounded-2xl p-4 w-44 shadow-[0_4px_0_var(--color-cloud-gray)] transform -rotate-1 hover:rotate-0 transition-all cursor-default mt-4 md:mt-0">
                    <p className="text-[10px] text-gray-400 font-din font-bold">GAME 3: SOUND BOX</p>
                    <div className="w-full h-24 bg-yellow-50 rounded-xl my-2 flex items-center justify-center text-3xl">🔊</div>
                    <p className="text-xs font-bold text-gray-800 font-din">Klik dengar suara</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Curriculum Modul Path Grid */}
            <section id="curriculum" className="hidden w-full bg-white py-20 scroll-mt-20">
              <div className="max-w-[1140px] mx-auto px-6 md:px-12">
                
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 bg-[#dbeafe] text-[#1e3a8a] text-xs px-3 py-1 rounded-full font-bold font-din mb-3">
                    <Sparkles size={12} /> PILIH MATERI AJAR
                  </div>
                  <h2 className="text-4xl md:text-5xl font-feather text-duo-green mb-4">
                    pilih modul belajar
                  </h2>
                  <p className="text-lg text-gray-500 font-din max-w-xl mx-auto">
                    Modul di bawah ini dirancang terstruktur mulai dari alfabet dasar hingga percakapan sederhana.
                  </p>
                </div>

                {/* Module cards curriculum path list */}
                <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                  {modulesData.map((module, idx) => {
                    const style = moduleCardStyles[idx % moduleCardStyles.length];
                    return (
                      <div
                        key={module.id}
                        id={`module-${module.id}`}
                        className={`card-3d bg-white border-2 border-cloud-gray p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 cursor-default scroll-mt-24 ${style.border}`}
                      >
                        <div className="flex items-start gap-4 text-left">
                          {/* Round numeric badge medallion */}
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-feather text-2xl shadow-sm border border-black/5 shrink-0 ${style.iconBg}`}>
                            {module.id}
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-gray-400 font-din font-bold uppercase tracking-wider">
                                {module.topic}
                              </span>
                            </div>
                            <h3 className="text-2xl font-feather text-gray-800 mb-1.5">
                              {module.title}
                            </h3>
                            <p className="text-sm text-gray-500 font-din leading-relaxed">
                              {module.description}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleStartModule(module.id)}
                          className={`btn-3d ${style.btnColor} px-8 py-4 text-base whitespace-nowrap w-full sm:w-auto`}
                          type="button"
                        >
                          Mulai Belajar
                        </button>
                      </div>
                    );
                  })}
                </div>

              </div>
            </section>
              </>
            )}

          </div>
        ) : (
          /* Active Module Slide Render viewport */
          <div className="lesson-page">
            {activeScene && (
              <ModuleRenderer
                isFirst={currentSceneIndex === 0}
                moduleId={activeModuleData.id}
                moduleTitle={activeModuleData.title}
                nextScene={() => nextScene(totalScenes)}
                prevScene={prevScene}
                scene={activeScene}
                sceneIndex={currentSceneIndex}
                totalScenes={totalScenes}
              />
            )}
          </div>
        )}
      </main>

      {/* Curved wave transition divider to soft footer (homepage only) */}
      {currentModule === null && (
        <div className="w-full overflow-hidden leading-[0] bg-white select-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] fill-[#ffffff]">
            <path d="M0,0 C150,90 350,120 600,100 C850,80 1050,110 1200,90 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      )}

      {currentModule === null && (
        <footer className="duo-footer">
          <div className="duo-footer-inner">
            <div className="duo-footer-cta" data-reveal="rise">
              <div>
                <h2>predu engkids</h2>
                <p>
                  Materi Bahasa Inggris untuk kelas anak: jelas di laptop, mudah dipandu guru,
                  dan cukup ringan untuk sesi belajar bersama.
                </p>
              </div>
              <button
                onClick={scrollToCurriculum}
                className="btn-3d duo-footer-button"
                type="button"
              >
                Pilih Modul
              </button>
            </div>

            <div className="duo-footer-columns" aria-label="Footer navigation">
              {footerGroups.map(({ title, links }, idx) => (
                <div
                  className="duo-footer-column"
                  data-reveal="rise"
                  key={title}
                  style={revealDelay(idx)}
                >
                  <h3>{title}</h3>
                  <ul>
                    {links.map((link) => (
                      <li key={link}>{link}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="duo-footer-bottom">
              <span>2026 PreEdu EngKids</span>
              <span>Alphabet, kosakata, pronunciation, dan mini-game kelas.</span>
            </div>
          </div>
        </footer>
      )}

      {/* Footer System */}
      {currentModule === null ? (
        /* Full Deep Blue Footer Grid */
        <footer className="hidden bg-[#2563eb] text-white py-16 px-8 font-din">
          <div className="max-w-[1140px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-sm border-b border-white/20 pb-12">
            <div>
              <h5 className="font-bold text-base mb-4 uppercase tracking-wider">Tentang Kami</h5>
              <ul className="flex flex-col gap-2.5 text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Visi & Misi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Panti Asuhan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Relawan Pengajar</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-base mb-4 uppercase tracking-wider">Materi</h5>
              <ul className="flex flex-col gap-2.5 text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Alfabet A-Z</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Warna & Angka</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Percakapan</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-base mb-4 uppercase tracking-wider">Aplikasi</h5>
              <ul className="flex flex-col gap-2.5 text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Android App</a></li>
                <li><a href="#" className="hover:text-white transition-colors">iOS App</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Web PWA</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-base mb-4 uppercase tracking-wider">Bantuan</h5>
              <ul className="flex flex-col gap-2.5 text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Panduan Guru</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hubungi Kami</a></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start">
              <h5 className="font-bold text-base mb-4 uppercase tracking-wider">Mimo Mascot</h5>
              <div className="w-16 h-16 rounded-full bg-white text-duo-green flex items-center justify-center text-3xl font-feather shadow-md animate-bounce select-none">
                M
              </div>
            </div>
          </div>
          <div className="max-w-[1140px] mx-auto pt-6 text-center text-xs text-white/60">
            <p>© 2026 PreEdu EngKids — Dibuat dengan kasih untuk pendidikan bahasa Inggris anak-anak panti asuhan.</p>
          </div>
        </footer>
      ) : (
        /* Small Flat Footer inside quiz viewport */
        <footer className="hidden">
          <p>© 2026 PreEdu EngKids — Dibuat dengan kasih untuk pendidikan bahasa Inggris.</p>
        </footer>
      )}
    </div>
  );
}

export default App;
