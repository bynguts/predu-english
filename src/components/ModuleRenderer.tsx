import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, useReducedMotion } from 'framer-motion';
import { RotateCcw, Check, X, Star, Award, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store';
import type { Scene, QuizOption } from '../data/modules';
import { SoundButton, speakEnglish, playCorrectSound, playIncorrectSound } from './SoundButton';
import { Mascot } from './Mascot';

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

interface ModuleRendererProps {
  scene: Scene;
  nextScene: () => void;
  prevScene: () => void;
  isFirst: boolean;
  moduleId: number;
  moduleTitle: string;
  sceneIndex: number;
  totalScenes: number;
}

export const ModuleRenderer: React.FC<ModuleRendererProps> = ({
  scene,
  nextScene,
  prevScene,
  isFirst,
  moduleId,
  moduleTitle,
  sceneIndex,
  totalScenes
}) => {
  const reducedMotion = useReducedMotion();
  const { 
    audioMuted, 
    addCorrect, 
    addIncorrect, 
    setSceneIndex,
    setMascot, 
    mascotState, 
    mascotSpeech,
    sessionScore,
    incorrectReviews,
    calculateStars
  } = useAppStore();

  const achievementPop = (delay = 0) => reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.52, delay, ease: easeOutExpo }
      };

  // Local game states
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [incorrectSelections, setIncorrectSelections] = useState<number[]>([]);
  const [shakeActive, setShakeActive] = useState(false);

  // Word Builder states
  const [wordLetters, setWordLetters] = useState<{ id: number; letter: string; used: boolean }[]>([]);
  const [builtWord, setBuiltWord] = useState<string[]>([]);
  const [wordSuccess, setWordSuccess] = useState(false);

  // Sentence Builder states
  const [sentenceWords, setSentenceWords] = useState<{ id: number; word: string; used: boolean }[]>([]);
  const [builtSentence, setBuiltSentence] = useState<string[]>([]);
  const [sentenceSuccess, setSentenceSuccess] = useState(false);
  const nextActivationLock = useRef(false);

  // Styling helper lists
  const backgroundTints = [
    'bg-emerald-50/30 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50',
    'bg-blue-50/30 border-blue-200 hover:border-blue-400 hover:bg-blue-50/50',
    'bg-amber-50/30 border-amber-200 hover:border-amber-400 hover:bg-amber-50/50',
    'bg-purple-50/30 border-purple-200 hover:border-purple-400 hover:bg-purple-50/50',
    'bg-rose-50/30 border-rose-200 hover:border-rose-400 hover:bg-rose-50/50',
    'bg-sky-50/30 border-sky-200 hover:border-sky-400 hover:bg-sky-50/50'
  ];

  const vowelStyles = [
    { bg: 'bg-[#fff5e6]/40', border: 'border-[#ff9600]', text: 'text-[#ff9600]', badge: 'bg-[#ff9600]/10' }, // A
    { bg: 'bg-[#ffebf5]/40', border: 'border-[#cc348d]', text: 'text-[#cc348d]', badge: 'bg-[#cc348d]/10' }, // E
    { bg: 'bg-[#eef8ff]/40', border: 'border-[#1cb0f6]', text: 'text-[#1cb0f6]', badge: 'bg-[#1cb0f6]/10' }, // I
    { bg: 'bg-[#f5eefc]/40', border: 'border-[#a570ff]', text: 'text-[#a570ff]', badge: 'bg-[#a570ff]/10' }, // O
    { bg: 'bg-[#eff6ff]/40', border: 'border-[#2563eb]', text: 'text-[#2563eb]', badge: 'bg-[#2563eb]/10' }  // U
  ];

  const moduleThemes = {
    1: {
      name: 'Start speaking',
      description: 'Alphabet, greetings, and first introductions.',
      tokens: ['A', 'B', 'Hi']
    },
    2: {
      name: 'Explore words',
      description: 'Numbers, colors, animals, and classroom objects.',
      tokens: ['1', '5', 'red']
    },
    3: {
      name: 'Build sentences',
      description: 'Simple patterns for speaking in complete sentences.',
      tokens: ['I', 'am', 'OK']
    }
  } as const;

  const moduleTheme = moduleThemes[(moduleId as 1 | 2 | 3)] || moduleThemes[1];
  const nextModuleTitles: Record<number, string> = {
    2: 'The World Around You',
    3: "Let's Talk!"
  };

  const sceneTypeNames: Record<Scene['type'], string> = {
    intro: 'Warm up',
    presentation: 'Lesson',
    'game-quiz': 'Quiz',
    'game-word': 'Word game',
    'game-sentence': 'Sentence game',
    outro: 'Reward'
  };

  const getDefaultMascotMessage = (currentScene: Scene) => {
    if (currentScene.mascotMessage) return currentScene.mascotMessage;
    if (currentScene.alphabetGroup) {
      const labels = currentScene.alphabetGroup.slice(0, 4).map((item) => item.letter).join(', ');
      const isAlphabetLesson = currentScene.title.toLowerCase().includes('alphabet');
      return isAlphabetLesson
        ? `Ayo klik kartu huruf ${labels} dan dengarkan suaranya!`
        : `Ayo klik kartu ${labels} dan dengarkan kata Inggrisnya!`;
    }
    if (currentScene.phonicsVowels) return 'Klik huruf vokal untuk mendengar bunyinya.';
    if (currentScene.phrases) return 'Klik kartu percakapan, lalu tirukan bersama-sama.';
    if (currentScene.type === 'intro') return 'Mari kita mulai pertemuan kali ini!';
    if (currentScene.type === 'outro') return 'Kerja bagus semuanya! Sesi telah selesai.';
    return 'Ikuti instruksi di layar, lalu tekan Lanjut saat sudah siap.';
  };

  // Reset local state on scene change
  useEffect(() => {
    setSelectedOption(null);
    setAnsweredCorrectly(false);
    setIncorrectSelections([]);
    setShakeActive(false);

    // Initialize Word Builder
    if (scene.type === 'game-word' && scene.wordBuilder) {
      const word = scene.wordBuilder.word.toUpperCase();
      const scrambled = word.split('').map((letter, index) => ({
        id: index,
        letter,
        used: false
      })).sort(() => Math.random() - 0.5);
      
      setWordLetters(scrambled);
      setBuiltWord([]);
      setWordSuccess(false);
    }

    // Initialize Sentence Builder
    if (scene.type === 'game-sentence' && scene.sentenceBuilder) {
      const target = scene.sentenceBuilder.targetSentence.toUpperCase();
      const words = target.split(' ').map((word, index) => ({
        id: index,
        word,
        used: false
      })).sort(() => Math.random() - 0.5);

      setSentenceWords(words);
      setBuiltSentence([]);
      setSentenceSuccess(false);
    }

    const defaultMessage = getDefaultMascotMessage(scene);
    setMascot(scene.type === 'outro' ? 'happy' : 'talking', defaultMessage);
  }, [scene, setMascot]);

  // Trigger confetti effect
  const triggerConfettiEffect = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const formatQuizAnswer = (option?: QuizOption) => {
    if (!option) return '-';
    return [option.text, option.indonesian].filter(Boolean).join(' - ');
  };

  // Handle option selection in Quiz
  const handleOptionClick = (index: number, option: QuizOption) => {
    if (answeredCorrectly) return;
    if (incorrectSelections.includes(index)) return;

    setSelectedOption(index);

    if (option.isCorrect) {
      setAnsweredCorrectly(true);
      addCorrect();
      playCorrectSound(audioMuted);
      triggerConfettiEffect();
      setMascot('happy', 'Hore! Jawabanmu betul!');
      speakEnglish(option.text, audioMuted);
    } else {
      const correctOption = scene.quizQuestion?.options.find((item) => item.isCorrect);
      setIncorrectSelections([...incorrectSelections, index]);
      addIncorrect({
        moduleId,
        sceneIndex,
        sceneTitle: scene.title,
        prompt: scene.quizQuestion?.question || scene.title,
        submittedAnswer: formatQuizAnswer(option),
        correctAnswer: formatQuizAnswer(correctOption),
        reflection: 'Ulangi kata kuncinya bersama-sama, lalu minta anak menyebutkan jawaban benar.'
      });
      playIncorrectSound(audioMuted);
      setShakeActive(true);
      setMascot('sad', 'Oh no! Coba lagi yuk!');
      setTimeout(() => setShakeActive(false), 500);
    }
  };

  // Word Builder letter click
  const handleLetterClick = (letterObj: { id: number; letter: string; used: boolean }) => {
    if (wordSuccess || letterObj.used) return;

    setWordLetters(prev => prev.map(item => item.id === letterObj.id ? { ...item, used: true } : item));
    const newBuilt = [...builtWord, letterObj.letter];
    setBuiltWord(newBuilt);

    speakEnglish(letterObj.letter, audioMuted);

    const targetWord = scene.wordBuilder!.word.toUpperCase();
    if (newBuilt.length === targetWord.length) {
      const joined = newBuilt.join('');
      if (joined === targetWord) {
        setWordSuccess(true);
        addCorrect();
        playCorrectSound(audioMuted);
        triggerConfettiEffect();
        setMascot('happy', `Hebat! Kamu berhasil menyusun kata ${targetWord}!`);
        speakEnglish(targetWord, audioMuted);
      } else {
        const wordLabel = scene.wordBuilder?.indonesian
          ? `${scene.wordBuilder.indonesian} / ${targetWord}`
          : targetWord;
        setShakeActive(true);
        playIncorrectSound(audioMuted);
        addIncorrect({
          moduleId,
          sceneIndex,
          sceneTitle: scene.title,
          prompt: `Susun kata untuk ${wordLabel}`,
          submittedAnswer: joined,
          correctAnswer: targetWord,
          reflection: `Ajak anak mengeja pelan: ${targetWord.split('').join(' - ')}.`
        });
        setMascot('sad', 'Tatanan hurufnya belum tepat, ayo coba lagi!');
        setTimeout(() => {
          setShakeActive(false);
          setBuiltWord([]);
          setWordLetters(prev => prev.map(item => ({ ...item, used: false })));
        }, 800);
      }
    }
  };

  // Reset Word Builder
  const resetWordBuilder = () => {
    setBuiltWord([]);
    setWordLetters(prev => prev.map(item => ({ ...item, used: false })));
    setWordSuccess(false);
    setMascot('idle', 'Mari susun ulang hurufnya!');
  };

  // Sentence Builder word click
  const handleWordClick = (wordObj: { id: number; word: string; used: boolean }) => {
    if (sentenceSuccess || wordObj.used) return;

    setSentenceWords(prev => prev.map(item => item.id === wordObj.id ? { ...item, used: true } : item));
    const newBuilt = [...builtSentence, wordObj.word];
    setBuiltSentence(newBuilt);

    speakEnglish(wordObj.word, audioMuted);

    const targetSentence = scene.sentenceBuilder!.targetSentence.toUpperCase();
    const targetLength = targetSentence.split(' ').length;

    if (newBuilt.length === targetLength) {
      const joined = newBuilt.join(' ');
      if (joined === targetSentence) {
        setSentenceSuccess(true);
        addCorrect();
        playCorrectSound(audioMuted);
        triggerConfettiEffect();
        setMascot('happy', 'Mantap! Kalimat yang kamu susun sempurna!');
        speakEnglish(targetSentence, audioMuted);
      } else {
        setShakeActive(true);
        playIncorrectSound(audioMuted);
        addIncorrect({
          moduleId,
          sceneIndex,
          sceneTitle: scene.title,
          prompt: scene.sentenceBuilder?.indonesian || 'Susun kalimat yang benar',
          submittedAnswer: joined,
          correctAnswer: targetSentence,
          reflection: 'Baca pola kalimatnya bersama-sama dari kiri ke kanan sebelum mencoba lagi.'
        });
        setMascot('sad', 'Kalimatnya belum tepat. Yuk kita susun ulang!');
        setTimeout(() => {
          setShakeActive(false);
          setBuiltSentence([]);
          setSentenceWords(prev => prev.map(item => ({ ...item, used: false })));
        }, 800);
      }
    }
  };

  // Reset Sentence Builder
  const resetSentenceBuilder = () => {
    setBuiltSentence([]);
    setSentenceWords(prev => prev.map(item => ({ ...item, used: false })));
    setSentenceSuccess(false);
    setMascot('idle', 'Mari susun ulang kata-katanya!');
  };

  const handleReviewJump = (targetSceneIndex: number) => {
    setMascot('talking', 'Ayo kita lihat lagi soalnya dan bahas bersama-sama.');
    setSceneIndex(targetSceneIndex);
  };

  // Render components according to scene type
  const renderSceneContent = () => {
    switch (scene.type) {
      case 'intro':
        return (
          <div className="lesson-intro-scene scene-fade-in">
            <span className="lesson-kicker">{moduleTheme.name}</span>
            <h2>{scene.title}</h2>
            {scene.instruction && (
              <p>
                {scene.instruction}
              </p>
            )}
            <div className="lesson-intro-visual legacy-intro-visual" data-module={moduleId}>
              <span className="text-8xl animate-bounce">🎒</span>
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-md animate-pulse">⭐</div>
              <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-sky-400 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md">🔔</div>
            </div>
          </div>
        );

      case 'presentation':
        return (
          <div className="flex flex-col gap-6 py-2 scene-fade-in">
            <h2 className="text-3xl text-gray-800 text-center font-feather">{scene.title}</h2>
            {scene.instruction && (
              <p className="text-base text-gray-500 text-center -mt-2 mb-2 font-din">{scene.instruction}</p>
            )}

            {/* Alphabet presentation cards */}
            {scene.alphabetGroup && (
              <div className="lesson-card-grid lesson-alphabet-grid grid grid-cols-2 md:grid-cols-4 gap-6 max-h-[440px] overflow-y-auto p-3">
                {scene.alphabetGroup.slice(0, 4).map((item, idx) => {
                  const tint = backgroundTints[idx % backgroundTints.length];
                  return (
                    <div
                      key={idx}
                      onClick={() => speakEnglish(item.word, audioMuted)}
                      className={`card-3d flex flex-col items-center justify-center p-6 text-center select-none active:scale-95 ${tint}`}
                    >
                      {/* Medallion letter holder */}
                      <div className="w-16 h-16 rounded-full flex items-center justify-center font-feather text-3xl bg-white border-2 border-gray-100 shadow-sm text-gray-800 mb-2">
                        {item.letter}
                      </div>
                      
                      {/* Emoji illustration frame */}
                      <div className="w-24 h-24 rounded-xl bg-white/80 flex items-center justify-center text-6xl my-2 border-2 border-gray-100/30">
                        {item.emoji}
                      </div>
                      
                      <span className="text-xl font-extrabold font-din text-gray-800 mt-2">{item.word}</span>
                      <span className="text-sm font-din text-gray-500 font-bold italic">({item.indonesian})</span>
                      
                      <div className="mt-4">
                        <SoundButton textToSpeak={item.word} size="sm" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Phonics vowels */}
            {scene.phonicsVowels && (
              <div className="lesson-card-grid lesson-vowel-grid grid grid-cols-2 md:grid-cols-5 gap-4 py-2">
                {scene.phonicsVowels.map((item, idx) => {
                  const style = vowelStyles[idx % vowelStyles.length];
                  return (
                    <div
                      key={idx}
                      onClick={() => speakEnglish(item.vowel, audioMuted)}
                      className={`card-3d lesson-vowel-card active:scale-95 ${style.bg} ${style.border}`}
                    >
                      <div className={`lesson-vowel-letter ${style.text}`}>
                        {item.vowel}
                      </div>
                      <span className={`lesson-vowel-sound ${style.text} ${style.badge}`}>
                        {item.sound}
                      </span>
                      <div className="lesson-vowel-examples">
                        <p>Contoh</p>
                        {item.examples.map((ex, exIdx) => (
                          <p key={exIdx} className="text-xs truncate font-semibold text-gray-700 mt-1">✨ {ex}</p>
                        ))}
                      </div>
                      <div className="lesson-vowel-audio">
                        <SoundButton textToSpeak={item.vowel} size="sm" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Greetings / Phrases Alternating Dialogues */}
            {scene.phrases && (
              <div className="lesson-phrase-panel">
                <div className="lesson-phrase-label">
                  Kartu Percakapan
                </div>
                
                {scene.phrases.map((phrase, idx) => {
                  const isA = phrase.english.startsWith('A:');
                  const isB = phrase.english.startsWith('B:');
                  const displayEnglish = phrase.english.replace(/^[AB]:\s*/, '');
                  const displayIndonesian = phrase.indonesian.replace(/^[AB]:\s*/, '');
                  
                  return (
                    <div
                      key={idx}
                      onClick={() => speakEnglish(phrase.audioText, audioMuted)}
                      className={`lesson-phrase-card
                        ${isA 
                          ? 'dialogue-left' 
                          : isB 
                          ? 'dialogue-right' 
                          : ''
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold font-din">{displayEnglish}</span>
                        <span className="opacity-60 text-xs">🔊</span>
                      </div>
                      <span className="text-xs font-din opacity-80 border-t border-current/20 pt-0.5 mt-0.5">
                        {displayIndonesian}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'game-quiz':
        if (!scene.quizQuestion) return null;
        const q = scene.quizQuestion;
        return (
          <div className={`flex flex-col gap-5 py-2 scene-fade-in ${shakeActive ? 'anim-shake' : ''}`}>
            <h2 className="text-3xl text-gray-800 text-center font-feather">{scene.title}</h2>
            <p className="text-base text-gray-500 text-center font-din -mt-2 mb-2">{scene.instruction}</p>

            <div className="card-3d lesson-quiz-card">
              {q.isAudioOnly ? (
                <div className="lesson-quiz-prompt lesson-quiz-audio">
                  <p className="text-lg font-bold font-din text-sky-600 uppercase tracking-wider">Dengar dan Tebak Katanya</p>
                  <SoundButton textToSpeak={q.audioText || ""} size="lg" className="scale-125 my-4" />
                  <p className="text-xs font-din text-gray-400">Klik tombol speaker untuk memutar ulang suara</p>
                </div>
              ) : (
                <div className="lesson-quiz-prompt">
                  <h3>{q.question}</h3>
                  {/* Visual Icons to match question context */}
                  {q.question.includes("(Buku / Book)") && <span className="text-8xl mb-2 animate-bounce">📘</span>}
                  {q.question.includes("🐰") && <span className="text-8xl mb-2 animate-[wiggle_1.5s_infinite]">🐰</span>}
                  {q.question.includes("MERAH") && <span className="text-8xl mb-2 text-rose-500 animate-pulse">🎈</span>}
                </div>
              )}

              {/* Options */}
              <div className="lesson-quiz-options">
                {q.options.map((option, idx) => {
                  const isIncorrect = incorrectSelections.includes(idx);
                  const isCorrect = answeredCorrectly && option.isCorrect;
                  const isSelected = selectedOption === idx;
                  
                  let cardClass = "";
                  if (isCorrect) cardClass = "correct";
                  else if (isIncorrect) cardClass = "incorrect";
                  else if (isSelected) cardClass = "selected";

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(idx, option)}
                      disabled={answeredCorrectly || isIncorrect}
                      className={`card-3d text-left p-4 flex items-center justify-between font-din w-full ${cardClass}`}
                      style={option.color ? { borderColor: option.color, backgroundColor: `${option.color}12` } : undefined}
                      type="button"
                    >
                      <div className="flex items-center gap-4">
                        {/* 3D Keycap block marker */}
                        <span className="w-10 h-10 rounded-xl border-b-4 border-2 border-gray-200 bg-white flex items-center justify-center font-bold text-gray-400 font-feather text-base shadow-sm">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <div>
                          <p className="text-xl font-extrabold text-gray-800">{option.text}</p>
                          {option.indonesian && (
                            <p className="text-sm text-gray-500 font-semibold">{option.indonesian}</p>
                          )}
                        </div>
                      </div>
                      
                      {option.emoji && <span className="text-4xl mr-1">{option.emoji}</span>}
                      {isCorrect && <Check className="text-emerald-500 stroke-[3]" size={24} />}
                      {isIncorrect && <X className="text-rose-500 stroke-[3]" size={24} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'game-word':
        if (!scene.wordBuilder) return null;
        const wb = scene.wordBuilder;
        return (
          <div className={`flex flex-col gap-5 py-2 scene-fade-in ${shakeActive ? 'anim-shake' : ''}`}>
            <h2 className="text-3xl text-gray-800 text-center font-feather">{scene.title}</h2>
            <p className="text-base text-gray-500 text-center font-din -mt-2 mb-2">{scene.instruction}</p>

            <div className="card-3d max-w-2xl mx-auto w-full p-8 bg-white border-2 border-gray-200 shadow-none cursor-default hover:border-gray-200 hover:transform-none hover:shadow-none flex flex-col items-center">
              {/* Image Hint Container */}
              <div className="flex flex-col items-center mb-6 bg-amber-50/30 p-5 rounded-xl border border-amber-100/50 w-full max-w-sm">
                <span className="text-8xl mb-2 animate-[wiggle_2s_infinite]">{wb.emoji}</span>
                <h3 className="text-2xl font-feather text-gray-700">{wb.indonesian}</h3>
              </div>

              {/* Built Word Slots (puzzle boxes) */}
              <div className="flex gap-3 mb-8 items-center justify-center">
                {wb.word.split('').map((_, idx) => {
                  const filledLetter = builtWord[idx];
                  return (
                    <div
                      key={idx}
                      className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center text-3xl font-feather transition-all duration-200 shadow-inner
                        ${filledLetter 
                          ? 'border-[#2563eb] bg-[#dbeafe]/30 text-[#1e3a8a]' 
                          : 'border-dashed border-gray-300 bg-gray-50/50 text-transparent'
                        }`}
                    >
                      {filledLetter || ''}
                    </div>
                  );
                })}
              </div>

              {/* Letter Pool (3D raised keycaps) */}
              <div className="flex gap-4 mb-8 flex-wrap justify-center">
                {wordLetters.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleLetterClick(item)}
                    disabled={item.used || wordSuccess}
                    className="btn-3d btn-3d-outline w-16 h-16 text-3xl font-feather flex items-center justify-center disabled:opacity-10 disabled:top-1 disabled:box-shadow-none"
                    type="button"
                  >
                    {item.letter}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={resetWordBuilder}
                  disabled={wordSuccess || builtWord.length === 0}
                  className="btn-3d btn-3d-gray px-6 py-2.5 text-sm flex items-center gap-2"
                  type="button"
                >
                  <RotateCcw size={16} /> Reset
                </button>
              </div>
            </div>
          </div>
        );

      case 'game-sentence':
        if (!scene.sentenceBuilder) return null;
        const sb = scene.sentenceBuilder;
        return (
          <div className={`flex flex-col gap-5 py-2 scene-fade-in ${shakeActive ? 'anim-shake' : ''}`}>
            <h2 className="text-3xl text-gray-800 text-center font-feather">{scene.title}</h2>
            <p className="text-base text-gray-500 text-center font-din -mt-2 mb-2">{scene.instruction}</p>

            <div className="card-3d max-w-3xl mx-auto w-full p-8 bg-white border-2 border-gray-200 shadow-none cursor-default hover:border-gray-200 hover:transform-none hover:shadow-none flex flex-col items-center">
              
              {/* Target Phrase Box */}
              <div className="flex items-center gap-5 bg-sky-50/50 rounded-xl px-8 py-5 border border-sky-100/50 mb-8 max-w-md w-full justify-center">
                {sb.hintEmoji && <span className="text-6xl animate-pulse">{sb.hintEmoji}</span>}
                <div className="text-left">
                  <p className="text-[10px] text-sky-500 font-din font-bold uppercase tracking-wider mb-0.5">Bahasa Indonesia</p>
                  <p className="text-2xl font-extrabold font-din text-gray-700 leading-tight">"{sb.indonesian}"</p>
                </div>
              </div>

              {/* Built Sentence Slots */}
              <div className="flex flex-wrap gap-3 mb-8 items-center justify-center min-h-[64px] w-full border-b-2 border-dashed border-gray-200 pb-4">
                {builtSentence.length === 0 ? (
                  <span className="text-gray-300 font-din font-semibold italic text-base">Klik kata di bawah untuk menyusun kalimat...</span>
                ) : (
                  builtSentence.map((word, idx) => (
                    <div
                      key={idx}
                      className="bg-[#dbeafe] border-2 border-[#2563eb] text-[#1e3a8a] font-extrabold font-din rounded-xl px-5 py-3 text-lg shadow-sm"
                    >
                      {word}
                    </div>
                  ))
                )}
              </div>

              {/* Word Blocks Pool */}
              <div className="flex gap-4 mb-8 flex-wrap justify-center">
                {sentenceWords.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleWordClick(item)}
                    disabled={item.used || sentenceSuccess}
                    className="btn-3d btn-3d-outline text-xl font-extrabold font-din px-6 py-3 disabled:opacity-10 disabled:top-1 disabled:box-shadow-none"
                    type="button"
                  >
                    {item.word}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={resetSentenceBuilder}
                  disabled={sentenceSuccess || builtSentence.length === 0}
                  className="btn-3d btn-3d-gray px-6 py-2.5 text-sm flex items-center gap-2"
                  type="button"
                >
                  <RotateCcw size={16} /> Susun Ulang
                </button>
              </div>
            </div>
          </div>
        );

      case 'outro': {
        const stars = calculateStars(3);
        const hasNextModule = moduleId < 3;
        const nextModuleTitle = nextModuleTitles[moduleId + 1];
        const achievementTitle = hasNextModule
          ? `Modul ${moduleId} selesai!`
          : 'Semua modul selesai!';
        const achievementCopy = hasNextModule
          ? `Kamu sudah siap lanjut ke Modul ${moduleId + 1}: ${nextModuleTitle}.`
          : 'Kelas Bahasa Inggris hari ini selesai. Rayakan hasil belajar bersama-sama.';
        const reviewItems = incorrectReviews.filter((item) => item.moduleId === moduleId).slice(-3);
        const primaryCtaLabel = hasNextModule ? `Lanjut Modul ${moduleId + 1}` : 'Kembali Beranda';

        return (
          <motion.div className="lesson-achievement lesson-achievement-full scene-fade-in" {...achievementPop(0)}>
            <motion.div className="lesson-achievement-badge" {...achievementPop(0.04)}>
              <Award size={30} />
              <span>Achievement unlocked</span>
            </motion.div>

            <motion.div className="lesson-achievement-copy" {...achievementPop(0.1)}>
              <h2>{achievementTitle}</h2>
              <p>{achievementCopy}</p>
            </motion.div>

            <motion.div
              className="lesson-achievement-showcase"
              aria-label={`${stars} dari 3 bintang`}
              {...achievementPop(0.16)}
              animate={reducedMotion ? undefined : { rotateX: [0, 2.5, 0], rotateY: [-1.5, 1.5, -1.5] }}
              transition={reducedMotion ? undefined : { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                className="lesson-showcase-rays"
                animate={reducedMotion ? undefined : { rotate: 360, scale: [1, 1.04, 1] }}
                transition={reducedMotion ? undefined : { rotate: { duration: 10, repeat: Infinity, ease: 'linear' }, scale: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' } }}
              />
              <div className="lesson-showcase-floor" />

              <div className="lesson-showcase-orbit" aria-hidden="true">
                <motion.span className="lesson-reward-token token-a" animate={reducedMotion ? undefined : { y: [0, -13, 0], rotate: [-12, -4, -12] }} transition={{ duration: 3.4, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut' }}>XP</motion.span>
                <motion.span className="lesson-reward-token token-b" animate={reducedMotion ? undefined : { y: [0, -11, 0], rotate: [10, 3, 10] }} transition={{ duration: 3.1, delay: 0.3, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut' }}>A+</motion.span>
                <motion.span className="lesson-reward-token token-c" animate={reducedMotion ? undefined : { y: [0, -9, 0], rotate: [8, 14, 8] }} transition={{ duration: 3.6, delay: 0.15, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut' }}>WOW</motion.span>
                <motion.span className="lesson-reward-coin coin-a" animate={reducedMotion ? undefined : { y: [0, -16, 0], rotate: [0, 18, 0] }} transition={{ duration: 3, delay: 0.1, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut' }} />
                <motion.span className="lesson-reward-coin coin-b" animate={reducedMotion ? undefined : { y: [0, -13, 0], rotate: [0, -18, 0] }} transition={{ duration: 3.3, delay: 0.45, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut' }} />
              </div>

              <div className="lesson-showcase-mascot">
                <motion.div
                  animate={reducedMotion ? undefined : { y: [0, -10, 0], scale: [1, 1.03, 1] }}
                  transition={{ duration: 2.6, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
                >
                  <Mascot state="happy" className="lesson-achievement-mascot" />
                </motion.div>
              </div>

              <div className="lesson-showcase-stars">
                {[1, 2, 3].map((starIdx) => {
                  const isActive = starIdx <= stars;
                  return (
                    <motion.div
                      key={starIdx}
                      className={isActive ? 'is-active' : 'is-inactive'}
                      style={{ animationDelay: `${starIdx * 0.18}s` }}
                      initial={reducedMotion ? false : { opacity: 0, y: 20, scale: 0.7, rotate: -12 }}
                      animate={{ opacity: isActive ? 1 : 0.26, y: 0, scale: isActive ? 1 : 0.86, rotate: isActive ? 0 : -8 }}
                      transition={{ duration: 0.48, delay: 0.24 + starIdx * 0.13, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Star
                        fill={isActive ? "#ffc700" : "none"}
                        stroke={isActive ? "#d0a200" : "#afafaf"}
                        size={starIdx === 2 ? 62 : 48}
                      />
                    </motion.div>
                  );
                })}
              </div>

              <div className="lesson-showcase-podium">
                <span>Great job!</span>
              </div>
            </motion.div>

            <motion.div className="lesson-achievement-stats" aria-label="Statistik belajar" {...achievementPop(0.24)}>
              <div className="lesson-achievement-stat">
                <span>Jawaban Betul</span>
                <strong>{sessionScore.correct}</strong>
              </div>
              <div className="lesson-achievement-stat">
                <span>Jawaban Salah</span>
                <strong>{sessionScore.incorrect}</strong>
              </div>
              <div className="lesson-achievement-stat">
                <span>Bintang</span>
                <strong>{stars} / 3</strong>
              </div>
            </motion.div>

            <motion.div className="lesson-achievement-actions" {...achievementPop(0.3)}>
              <motion.div className="lesson-achievement-next" whileHover={reducedMotion ? undefined : { y: -3 }}>
                <div className="lesson-achievement-next-copy">
                  <span>{hasNextModule ? 'Siap lanjut?' : 'Sesi lengkap'}</span>
                  <strong>
                    {hasNextModule
                      ? `Modul ${moduleId + 1}: ${nextModuleTitle}`
                      : 'Semua latihan utama sudah selesai.'}
                  </strong>
                </div>

                <motion.button
                  onClick={() => hasNextModule ? useAppStore.getState().setModule(moduleId + 1) : useAppStore.getState().setModule(null)}
                  className="btn-3d btn-3d-green lesson-achievement-cta"
                  type="button"
                  whileHover={reducedMotion ? undefined : { scale: 1.03 }}
                  whileTap={reducedMotion ? undefined : { scale: 0.98, y: 2 }}
                >
                  {primaryCtaLabel}
                  {hasNextModule && <ArrowRight size={18} />}
                </motion.button>
              </motion.div>

              <div className="lesson-achievement-secondary-actions">
                <motion.button
                  onClick={() => useAppStore.getState().setModule(null)}
                  className="btn-3d btn-3d-gray lesson-achievement-secondary-button"
                  type="button"
                  whileHover={reducedMotion ? undefined : { scale: 1.02 }}
                  whileTap={reducedMotion ? undefined : { scale: 0.98, y: 2 }}
                >
                  Selesai Kelas
                </motion.button>

                {reviewItems.length > 0 ? (
                  <div className="lesson-achievement-review" aria-label="Review jawaban salah">
                    <div className="lesson-achievement-review-heading">
                      <span>Review salah tadi</span>
                      <strong>Masuk lagi ke soalnya</strong>
                    </div>

                    <div className="lesson-achievement-review-list">
                      {reviewItems.map((item, index) => (
                        <motion.button
                          key={item.id}
                          onClick={() => handleReviewJump(item.sceneIndex)}
                          className="lesson-achievement-review-item"
                          type="button"
                          initial={reducedMotion ? false : { opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.28, delay: index * 0.05 }}
                          whileHover={reducedMotion ? undefined : { x: 4 }}
                        >
                          <div>
                            <span>Soal {index + 1}</span>
                            <strong>{item.sceneTitle}</strong>
                          </div>
                          <p>{item.prompt}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="lesson-achievement-review lesson-achievement-review-empty">
                    <div className="lesson-achievement-review-heading">
                      <span>Review salah tadi</span>
                      <strong>Tidak ada jawaban salah</strong>
                    </div>
                    <p>Semua mini game sudah dikerjakan dengan benar.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        );
      }

      default:
        return null;
    }
  };

  const isGameScene = scene.type === 'game-quiz' || scene.type === 'game-word' || scene.type === 'game-sentence';
  const isGameSolved = 
    (scene.type === 'game-quiz' && answeredCorrectly) ||
    (scene.type === 'game-word' && wordSuccess) ||
    (scene.type === 'game-sentence' && sentenceSuccess);
  
  const canGoNext = !isGameScene || isGameSolved;
  const nextButtonLabel = canGoNext
    ? 'Lanjut'
    : scene.type === 'game-quiz'
      ? 'Pilih Jawaban'
      : 'Selesaikan Dulu';
  const handleNextActivation = () => {
    if (!canGoNext) return;
    if (nextActivationLock.current) return;
    nextActivationLock.current = true;
    nextScene();
    window.setTimeout(() => {
      nextActivationLock.current = false;
    }, 250);
  };

  const handleNextKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    handleNextActivation();
  };

  if (scene.type === 'outro') {
    return (
      <div className={`lesson-shell lesson-achievement-shell lesson-module-${moduleId} lesson-scene-${scene.type}`}>
        <section className="lesson-achievement-page">
          {renderSceneContent()}
        </section>
      </div>
    );
  }

  return (
    <div className={`lesson-shell lesson-module-${moduleId} lesson-scene-${scene.type}`}>
      <aside className="lesson-coach-panel">
        <div className="lesson-coach-card">
          <div className="lesson-coach-heading">
            <span>Mimo coach</span>
            <strong>{sceneTypeNames[scene.type]}</strong>
          </div>
          <Mascot state={mascotState} speechText={mascotSpeech} className="lesson-coach-mascot" />
        </div>
        <div className="lesson-module-note">
          <span>Module {moduleId}</span>
          <strong>{moduleTitle.replace(/^Modul\s*\d+\s*[—-]\s*/, '')}</strong>
          <p>{moduleTheme.description}</p>
        </div>
      </aside>

      <section className="lesson-stage-panel">
        <div className="lesson-stage-topline">
          <div>
            <span>{sceneTypeNames[scene.type]}</span>
            <strong>{scene.title}</strong>
          </div>
          <em>{Math.min(sceneIndex + 1, totalScenes)} / {totalScenes}</em>
        </div>

        <div className="lesson-stage-card">
          <div className="lesson-stage-content">
            {renderSceneContent()}
          </div>

          <div className="lesson-stage-nav">
            <button
              onClick={prevScene}
              disabled={isFirst || answeredCorrectly || wordSuccess || sentenceSuccess}
              className="btn-3d btn-3d-gray lesson-nav-button"
              type="button"
            >
              Kembali
            </button>

            <button
              onClick={handleNextActivation}
              onKeyDown={handleNextKeyDown}
              disabled={!canGoNext}
              className={`btn-3d lesson-nav-button lesson-next-button ${canGoNext ? (isGameScene ? 'btn-3d-green' : 'btn-3d-blue') : 'btn-3d-gray'}`}
              type="button"
            >
              {nextButtonLabel}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
