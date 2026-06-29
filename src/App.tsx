import { useAppStore } from './store';
import { modulesData } from './data/modules';
import { ProgressBar } from './components/ProgressBar';
import { ModuleRenderer } from './components/ModuleRenderer';
import { Mascot } from './components/Mascot';
import { Volume2, VolumeX, Home, Sparkles } from 'lucide-react';
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

  // Helper colors for module cards
  const moduleCardStyles = [
    { border: 'border-l-8 border-l-[#58cc02] hover:border-[#58cc02]', iconBg: 'bg-[#d7ffb8] text-[#3f8f01]', btnColor: 'btn-3d-green' },
    { border: 'border-l-8 border-l-[#1cb0f6] hover:border-[#1cb0f6]', iconBg: 'bg-[#eef8ff] text-[#1899d6]', btnColor: 'btn-3d-blue' },
    { border: 'border-l-8 border-l-[#a570ff] hover:border-[#a570ff]', iconBg: 'bg-[#f5eefc] text-[#8247df]', btnColor: 'btn-3d-purple' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 bg-white border-b-2 border-cloud-gray z-50 px-6 py-4">
        <div className="max-w-[1140px] mx-auto flex items-center justify-between gap-4">
          
          {/* Logo / Brand Name */}
          <div 
            onClick={() => setModule(null)} 
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <span className="text-3xl font-feather text-[#58cc02] tracking-tight hover:scale-105 transition-transform duration-100">
              predu engkids
            </span>
          </div>

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
          <div className="flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-3 rounded-2xl border-2 transition-all duration-100 relative top-0 active:top-0.5
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
            {currentModule !== null && (
              <button
                onClick={() => setModule(null)}
                className="btn-3d btn-3d-gray px-5 py-2.5 text-sm flex items-center gap-2"
                type="button"
              >
                <Home size={16} /> <span>Beranda</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile progress viewport */}
        {currentModule !== null && activeModuleData && (
          <div className="max-w-[1140px] mx-auto mt-3 md:hidden px-2">
            <ProgressBar value={currentSceneIndex} max={totalScenes} />
          </div>
        )}
      </header>

      {/* Main Content Arena */}
      <main className="flex-1 max-w-[1140px] w-full mx-auto p-4 md:p-8 flex flex-col justify-center">
        {currentModule === null ? (
          
          /* Home Screen Dashboard */
          <div className="flex flex-col md:flex-row gap-10 items-center justify-between py-6">
            
            {/* Left Column: Mascot Greeting Box */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="bg-white border-2 border-cloud-gray rounded-xl p-6 flex flex-col items-center w-full relative">
                <Mascot state={mascotState} speechText={mascotSpeech} />
                <button
                  onClick={handleTestSpeech}
                  className="btn-3d btn-3d-blue mt-6 px-8 py-3 text-sm flex items-center gap-2"
                  type="button"
                >
                  🔊 Tes Suara Duo
                </button>
              </div>
            </div>

            {/* Right Column: Path & Modules List */}
            <div className="w-full md:w-2/3 flex flex-col gap-6">
              <div className="text-center md:text-left mb-2">
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold font-din mb-3">
                  <Sparkles size={12} /> INTERAKTIF & FUN
                </div>
                <h1 className="text-4xl md:text-5xl font-feather text-duo-green mb-3">
                  Mari Belajar Bahasa Inggris!
                </h1>
                <p className="text-lg text-gray-500 font-din leading-relaxed">
                  Pilih tingkat modul pelajaran di bawah ini. Sesi dirancang interaktif untuk dipandu oleh fasilitator menggunakan proyektor kelas.
                </p>
              </div>

              {/* Module Cards Grid */}
              <div className="flex flex-col gap-6">
                {modulesData.map((module, idx) => {
                  const style = moduleCardStyles[idx % moduleCardStyles.length];
                  return (
                    <div
                      key={module.id}
                      className={`card-3d bg-white border-2 border-cloud-gray p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 cursor-default ${style.border}`}
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

              {/* Tips block */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5 flex items-start gap-4 mt-2 text-left font-din text-sm text-yellow-900">
                <span className="text-3xl">💡</span>
                <div>
                  <h4 className="font-bold text-base mb-1 text-yellow-900">Tips Operasi Kelas:</h4>
                  <p className="leading-relaxed">
                    Hubungkan laptop ke proyektor / infokus di depan kelas. Fasilitator dapat mengklik kartu materi untuk mengeluarkan suara, dan mengundang anak-anak maju langsung saat mini-game interaktif!
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Active Module Slide Render viewport */
          activeScene && (
            <ModuleRenderer
              isFirst={currentSceneIndex === 0}
              nextScene={() => nextScene(totalScenes)}
              prevScene={prevScene}
              scene={activeScene}
            />
          )
        )}
      </main>

      {/* Small footer */}
      <footer className="py-6 border-t border-cloud-gray bg-white text-center text-xs text-gray-400 font-din mt-auto">
        <p>© 2026 PreEdu EngKids — Dibuat dengan kasih untuk pendidikan bahasa Inggris.</p>
      </footer>
    </div>
  );
}

export default App;
