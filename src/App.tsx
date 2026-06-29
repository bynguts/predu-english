import { useRef } from 'react';
import { useAppStore } from './store';
import { modulesData } from './data/modules';
import { ProgressBar } from './components/ProgressBar';
import { ModuleRenderer } from './components/ModuleRenderer';
import { Mascot } from './components/Mascot';
import { Volume2, VolumeX, Home, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { speakEnglish } from './components/SoundButton';

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

  const activeModuleData = modulesData.find(m => m.id === currentModule);
  const activeScene = activeModuleData?.scenes[currentSceneIndex];
  const totalScenes = activeModuleData?.scenes.length || 0;

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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 180 : scrollLeft + 180;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Helper colors for module cards
  const moduleCardStyles = [
    { border: 'border-l-8 border-l-[#58cc02] hover:border-[#58cc02]', iconBg: 'bg-[#d7ffb8] text-[#3f8f01]', btnColor: 'btn-3d-green' },
    { border: 'border-l-8 border-l-[#1cb0f6] hover:border-[#1cb0f6]', iconBg: 'bg-[#eef8ff] text-[#1899d6]', btnColor: 'btn-3d-blue' },
    { border: 'border-l-8 border-l-[#a570ff] hover:border-[#a570ff]', iconBg: 'bg-[#f5eefc] text-[#8247df]', btnColor: 'btn-3d-purple' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 bg-white border-b-2 border-cloud-gray z-50 py-5 md:py-6 select-none">
        <div className="max-w-[1140px] mx-auto w-full px-6 md:px-12 flex items-center justify-between gap-6">
          
          {/* Logo / Brand Name */}
          <div 
            onClick={() => setModule(null)} 
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
          >
            <span className="text-4xl font-feather text-[#58cc02] tracking-tight hover:scale-105 transition-transform duration-100">
              predu engkids
            </span>
          </div>

          {/* Center: Scrollable Language/Topic selector bar (only on Home) */}
          {currentModule === null && (
            <div className="flex-1 max-w-xl mx-8 hidden md:flex items-center gap-2 border-l border-r border-cloud-gray px-4">
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
                  href="#curriculum"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' });
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
            <div className="flex-1 max-w-lg mx-6 hidden md:flex items-center gap-4">
              <span className="font-feather text-gray-400 text-sm whitespace-nowrap">
                {activeModuleData.title}
              </span>
              <ProgressBar value={currentSceneIndex} max={totalScenes} />
            </div>
          )}

          {/* Toolbar Actions */}
          <div className="flex items-center gap-4">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-3.5 rounded-2xl border-2 transition-all duration-100 relative top-0 active:top-0.5
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
                onClick={() => document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-3d btn-3d-green px-7 py-3.5 text-sm hidden md:inline-flex"
                type="button"
              >
                Mulai Belajar
              </button>
            )}
          </div>
        </div>

        {/* Mobile progress viewport */}
        {currentModule !== null && activeModuleData && (
          <div className="w-full mt-4 md:hidden px-2">
            <ProgressBar value={currentSceneIndex} max={totalScenes} />
          </div>
        )}
      </header>

      {/* Main Content Arena */}
      <main className="flex-1 w-full flex flex-col">
        {currentModule === null ? (
          
          /* Redesigned Duolingo Clone Homepage Dashboard - Full Bleed Modular Layout */
          <div className="w-full flex flex-col">
            
            {/* 1. Hero Block Section */}
            <section className="w-full bg-white">
              <div className="max-w-[1140px] mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-12 items-center justify-between py-12 md:py-20">
                
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
                      Tes Suara Duo
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
                        <h4 className="text-lg font-feather text-gray-800">Duo Si Burung Hantu</h4>
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
            <section className="w-full bg-white border-t border-cloud-gray">
              <div className="max-w-[1140px] mx-auto px-6 md:px-12 py-16 flex flex-col items-center text-center">
                
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
                  <span className="border-2 border-[#58cc02] text-[#3f8f01] bg-[#d7ffb8]/20 px-5 py-2.5 rounded-full text-sm font-din font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#58cc02]"></span> Pelajaran Pendek
                  </span>
                  <span className="border-2 border-[#58cc02] text-[#3f8f01] bg-[#d7ffb8]/20 px-5 py-2.5 rounded-full text-sm font-din font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#58cc02]"></span> Dipandu Guru
                  </span>
                  <span className="border-2 border-[#58cc02] text-[#3f8f01] bg-[#d7ffb8]/20 px-5 py-2.5 rounded-full text-sm font-din font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#58cc02]"></span> 100% Gratis
                  </span>
                  <span className="border-2 border-[#58cc02] text-[#3f8f01] bg-[#d7ffb8]/20 px-5 py-2.5 rounded-full text-sm font-din font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#58cc02]"></span> Ramah Anak
                  </span>
                </div>

              </div>
            </section>

            {/* 3. Floating Mock Card Section */}
            <section className="w-full bg-[#ddf4ff] border-t border-b border-[#84d8ff] overflow-hidden">
              <div className="max-w-[1140px] mx-auto px-6 md:px-12 py-16 md:py-24 text-center relative">
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
            <section id="curriculum" className="w-full bg-white py-16 scroll-mt-20">
              <div className="max-w-[1140px] mx-auto px-6 md:px-12">
                
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 bg-[#d7ffb8] text-[#3f8f01] text-xs px-3 py-1 rounded-full font-bold font-din mb-3">
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

          </div>
        ) : (
          /* Active Module Slide Render viewport */
          <div className="max-w-[1140px] w-full mx-auto p-4 md:p-8 flex-1 flex flex-col justify-center">
            {activeScene && (
              <ModuleRenderer
                isFirst={currentSceneIndex === 0}
                nextScene={() => nextScene(totalScenes)}
                prevScene={prevScene}
                scene={activeScene}
              />
            )}
          </div>
        )}
      </main>

      {/* Curved wave transition divider to green footer (homepage only) */}
      {currentModule === null && (
        <div className="w-full overflow-hidden leading-[0] bg-white select-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] fill-[#58cc02]">
            <path d="M0,0 C150,90 350,120 600,100 C850,80 1050,110 1200,90 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      )}

      {/* Footer System */}
      {currentModule === null ? (
        /* Full Deep Green Footer Grid */
        <footer className="bg-[#58cc02] text-white py-16 px-8 font-din">
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
              <h5 className="font-bold text-base mb-4 uppercase tracking-wider">Duo Mascot</h5>
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-4xl shadow-md animate-bounce select-none">
                🦉
              </div>
            </div>
          </div>
          <div className="max-w-[1140px] mx-auto pt-6 text-center text-xs text-white/60">
            <p>© 2026 PreEdu EngKids — Dibuat dengan kasih untuk pendidikan bahasa Inggris anak-anak panti asuhan.</p>
          </div>
        </footer>
      ) : (
        /* Small Flat Footer inside quiz viewport */
        <footer className="py-6 border-t border-cloud-gray bg-white text-center text-xs text-gray-400 font-din mt-auto">
          <p>© 2026 PreEdu EngKids — Dibuat dengan kasih untuk pendidikan bahasa Inggris.</p>
        </footer>
      )}
    </div>
  );
}

export default App;
