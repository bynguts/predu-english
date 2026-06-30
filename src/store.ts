import { create } from 'zustand';

export type MascotState = 'idle' | 'happy' | 'sad' | 'talking' | 'achievement';

export interface IncorrectReview {
  id: string;
  moduleId: number;
  sceneIndex: number;
  sceneTitle: string;
  prompt: string;
  submittedAnswer: string;
  correctAnswer: string;
  reflection: string;
}

type IncorrectReviewInput = Omit<IncorrectReview, 'id'>;

interface Score {
  correct: number;
  incorrect: number;
  stars: number;
}

interface AppState {
  currentModule: number | null;
  currentSceneIndex: number;
  sessionScore: Score;
  audioMuted: boolean;
  mascotState: MascotState;
  mascotSpeech: string | null;
  confettiActive: boolean;
  incorrectReviews: IncorrectReview[];
  
  // Actions
  setModule: (moduleNum: number | null) => void;
  setSceneIndex: (index: number) => void;
  nextScene: (totalScenes: number) => void;
  prevScene: () => void;
  addCorrect: () => void;
  addIncorrect: (review?: IncorrectReviewInput) => void;
  toggleAudio: () => void;
  setMascot: (state: MascotState, speech?: string | null) => void;
  triggerConfetti: (active: boolean) => void;
  resetSession: () => void;
  calculateStars: (totalGameScenes: number) => number;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentModule: null,
  currentSceneIndex: 0,
  sessionScore: { correct: 0, incorrect: 0, stars: 0 },
  audioMuted: false,
  mascotState: 'idle',
  mascotSpeech: 'Halo! Mari belajar Bahasa Inggris bersama!',
  confettiActive: false,
  incorrectReviews: [],

  setModule: (moduleNum) => {
    let welcomeMessage = 'Halo! Mari belajar Bahasa Inggris bersama!';
    if (moduleNum === 1) welcomeMessage = 'Yuk, belajar Alphabet & Perkenalan diri!';
    if (moduleNum === 2) welcomeMessage = 'Ayo kita temukan dunia di sekitar kita!';
    if (moduleNum === 3) welcomeMessage = 'Mari kita belajar berbicara kalimat sederhana!';
    
    set({
      currentModule: moduleNum,
      currentSceneIndex: 0,
      sessionScore: { correct: 0, incorrect: 0, stars: 0 },
      incorrectReviews: [],
      mascotState: 'talking',
      mascotSpeech: moduleNum === null ? 'Halo! Mari belajar Bahasa Inggris bersama!' : welcomeMessage,
      confettiActive: false
    });
  },

  setSceneIndex: (index) => set({ currentSceneIndex: index }),

  nextScene: (totalScenes) => {
    const nextIndex = get().currentSceneIndex + 1;
    if (nextIndex < totalScenes) {
      set({ 
        currentSceneIndex: nextIndex,
        mascotState: 'idle',
        mascotSpeech: null
      });
    }
  },

  prevScene: () => {
    const prevIndex = get().currentSceneIndex - 1;
    if (prevIndex >= 0) {
      set({ 
        currentSceneIndex: prevIndex,
        mascotState: 'idle',
        mascotSpeech: null
      });
    }
  },

  addCorrect: () => {
    set((state) => ({
      sessionScore: {
        ...state.sessionScore,
        correct: state.sessionScore.correct + 1
      },
      mascotState: 'happy',
      mascotSpeech: 'Luar biasa! Benar!'
    }));
  },

  addIncorrect: (review) => {
    set((state) => ({
      sessionScore: {
        ...state.sessionScore,
        incorrect: state.sessionScore.incorrect + 1
      },
      incorrectReviews: review
        ? [
            ...state.incorrectReviews,
            {
              ...review,
              id: `${Date.now()}-${state.incorrectReviews.length}`
            }
          ].slice(-6)
        : state.incorrectReviews,
      mascotState: 'sad',
      mascotSpeech: 'Aduh, coba lagi ya! Kamu pasti bisa!'
    }));
  },

  toggleAudio: () => set((state) => ({ audioMuted: !state.audioMuted })),

  setMascot: (state, speech = null) => set({ mascotState: state, mascotSpeech: speech }),

  triggerConfetti: (active) => set({ confettiActive: active }),

  resetSession: () => set({
    currentSceneIndex: 0,
    sessionScore: { correct: 0, incorrect: 0, stars: 0 },
    incorrectReviews: [],
    mascotState: 'idle',
    mascotSpeech: null,
    confettiActive: false
  }),

  calculateStars: (totalGameScenes) => {
    if (totalGameScenes <= 0) return 3;
    const { correct, incorrect } = get().sessionScore;
    const totalAnswered = correct + incorrect;
    if (totalAnswered === 0) return 3;
    const accuracy = correct / totalAnswered;
    
    let stars = 1;
    if (accuracy >= 0.8) {
      stars = 3;
    } else if (accuracy >= 0.5) {
      stars = 2;
    }
    return stars;
  }
}));
