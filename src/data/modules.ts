export interface AlphabetItem {
  letter: string;
  word: string;
  indonesian: string;
  emoji: string;
}

export interface PhraseItem {
  english: string;
  indonesian: string;
  audioText: string;
}

export interface QuizOption {
  text: string;
  indonesian?: string;
  emoji?: string;
  color?: string;
  isCorrect: boolean;
}

export interface Scene {
  type: 'intro' | 'presentation' | 'game-quiz' | 'game-word' | 'game-sentence' | 'outro';
  title: string;
  instruction?: string;
  mascotMessage?: string;
  
  // Presentation content
  alphabetGroup?: AlphabetItem[];
  phonicsVowels?: { vowel: string; sound: string; examples: string[] }[];
  phrases?: PhraseItem[];
  singleItem?: { english: string; indonesian: string; emoji: string; colorClass?: string };
  
  // Mini-game: Tebak Gambar / Quiz
  quizQuestion?: {
    question: string;
    isAudioOnly?: boolean;
    audioText?: string;
    options: QuizOption[];
  };

  // Mini-game: Word Builder
  wordBuilder?: {
    word: string;
    indonesian: string;
    emoji: string;
  };

  // Mini-game: Sentence Builder
  sentenceBuilder?: {
    targetSentence: string;
    indonesian: string;
    hintEmoji?: string;
  };
}

export interface ModuleData {
  id: number;
  title: string;
  topic: string;
  description: string;
  colorClass: string;
  scenes: Scene[];
}

export const modulesData: ModuleData[] = [
  {
    id: 1,
    title: "Modul 1 — Who Are You?",
    topic: "Alphabet, Salam & Perkenalan",
    description: "Mengenal huruf A-Z, bunyi vokal dasar (phonics), dan cara memperkenalkan diri dalam Bahasa Inggris.",
    colorClass: "btn-3d-green",
    scenes: [
      {
        type: 'intro',
        title: "Perkenalan Kelas",
        mascotMessage: "Hello! My name is Mimo. Selamat datang di kelas Bahasa Inggris! Ayo kita mulai petualangan kita!",
        instruction: "Klik tombol 'Lanjut' di bawah untuk memulai pelajaran pertama."
      },
      {
        type: 'presentation',
        title: "Mengenal Alphabet: A sampai D",
        alphabetGroup: [
          { letter: "A", word: "Apple", indonesian: "Apel", emoji: "🍎" },
          { letter: "B", word: "Book", indonesian: "Buku", emoji: "📘" },
          { letter: "C", word: "Cat", indonesian: "Kucing", emoji: "🐱" },
          { letter: "D", word: "Dog", indonesian: "Anjing", emoji: "🐶" }
        ],
        mascotMessage: "Klik kartu huruf untuk mendengarkan suaranya!"
      },
      {
        type: 'presentation',
        title: "Mengenal Alphabet: E sampai H",
        alphabetGroup: [
          { letter: "E", word: "Egg", indonesian: "Telur", emoji: "🥚" },
          { letter: "F", word: "Fish", indonesian: "Ikan", emoji: "🐟" },
          { letter: "G", word: "Giraffe", indonesian: "Jerapah", emoji: "🦒" },
          { letter: "H", word: "Hat", indonesian: "Topi", emoji: "🎩" }
        ],
        mascotMessage: "Hebat! Ayo lanjut mendengarkan huruf berikutnya."
      },
      {
        type: 'presentation',
        title: "Mengenal Alphabet: I sampai L",
        alphabetGroup: [
          { letter: "I", word: "Ice Cream", indonesian: "Es Krim", emoji: "🍦" },
          { letter: "J", word: "Juice", indonesian: "Jus", emoji: "🥤" },
          { letter: "K", word: "Key", indonesian: "Kunci", emoji: "🔑" },
          { letter: "L", word: "Lion", indonesian: "Singa", emoji: "🦁" }
        ],
        mascotMessage: "Bagus! Sekarang klik huruf I, J, K, dan L satu per satu."
      },
      {
        type: 'presentation',
        title: "Mengenal Alphabet: M sampai P",
        alphabetGroup: [
          { letter: "M", word: "Monkey", indonesian: "Monyet", emoji: "🐵" },
          { letter: "N", word: "Nest", indonesian: "Sarang Burung", emoji: "🪹" },
          { letter: "O", word: "Orange", indonesian: "Jeruk", emoji: "🍊" },
          { letter: "P", word: "Pencil", indonesian: "Pensil", emoji: "✏️" }
        ],
        mascotMessage: "Lanjut! Dengarkan bunyi huruf M, N, O, dan P."
      },
      {
        type: 'presentation',
        title: "Mengenal Alphabet: Q sampai T",
        alphabetGroup: [
          { letter: "Q", word: "Queen", indonesian: "Ratu", emoji: "👸" },
          { letter: "R", word: "Rabbit", indonesian: "Kelinci", emoji: "🐰" },
          { letter: "S", word: "Sun", indonesian: "Matahari", emoji: "☀️" },
          { letter: "T", word: "Tree", indonesian: "Pohon", emoji: "🌳" }
        ],
        mascotMessage: "Keren! Sekarang kita dengarkan Q, R, S, dan T."
      },
      {
        type: 'presentation',
        title: "Mengenal Alphabet: U sampai X",
        alphabetGroup: [
          { letter: "U", word: "Umbrella", indonesian: "Payung", emoji: "☂️" },
          { letter: "V", word: "Violin", indonesian: "Biola", emoji: "🎻" },
          { letter: "W", word: "Water", indonesian: "Air", emoji: "💧" },
          { letter: "X", word: "Xylophone", indonesian: "Kolintang", emoji: "🎼" }
        ],
        mascotMessage: "Hampir selesai! Klik U, V, W, dan X ya."
      },
      {
        type: 'presentation',
        title: "Mengenal Alphabet: Y sampai Z",
        alphabetGroup: [
          { letter: "Y", word: "Yo-yo", indonesian: "Yoyo", emoji: "\uD83E\uDE80" },
          { letter: "Z", word: "Zebra", indonesian: "Zebra", emoji: "\uD83E\uDD93" }
        ],
        mascotMessage: "Terakhir, kita dengarkan huruf Y dan Z bersama Mimo!"
      },
      {
        type: 'presentation',
        title: "Bunyi Huruf Vokal (Phonics)",
        instruction: "Huruf vokal memiliki bunyi khas. Klik masing-masing huruf vokal di bawah ini:",
        phonicsVowels: [
          { vowel: "A", sound: "ah / æ", examples: ["Apple (Apel)", "Cat (Kucing)"] },
          { vowel: "E", sound: "eh / e", examples: ["Egg (Telur)", "Pen (Pena)"] },
          { vowel: "I", sound: "ee / i:", examples: ["Fish (Ikan)", "Ice (Es)"] },
          { vowel: "O", sound: "oh / ɒ", examples: ["Orange (Jeruk)", "Dog (Anjing)"] },
          { vowel: "U", sound: "uh / ʌ", examples: ["Umbrella (Payung)", "Sun (Matahari)"] }
        ]
      },
      {
        type: 'presentation',
        title: "Salam & Perkenalan (Greetings)",
        instruction: "Mari pelajari cara menyapa dan memperkenalkan diri dalam Bahasa Inggris!",
        phrases: [
          { english: "Hello!", indonesian: "Halo!", audioText: "Hello!" },
          { english: "What is your name?", indonesian: "Siapa namamu?", audioText: "What is your name?" },
          { english: "My name is Mimo.", indonesian: "Nama saya Mimo.", audioText: "My name is Mimo." },
          { english: "How are you?", indonesian: "Apa kabar?", audioText: "How are you?" },
          { english: "Nice to meet you.", indonesian: "Senang bertemu denganmu.", audioText: "Nice to meet you." },
          { english: "I am fine, thank you.", indonesian: "Kabar saya baik, terima kasih.", audioText: "I am fine, thank you." }
        ]
      },
      {
        type: 'game-quiz',
        title: "Mini Game: Tebak Gambar!",
        instruction: "Ayo tebak gambar di bawah ini! Huruf depan dari kata ini apa ya?",
        quizQuestion: {
          question: "Huruf depan dari kata ini (Buku / Book) adalah...",
          options: [
            { text: "A", isCorrect: false },
            { text: "B", isCorrect: true },
            { text: "C", isCorrect: false },
            { text: "D", isCorrect: false }
          ]
        },
        mascotMessage: "Ayo bantu menjawab! Gambar ini adalah sebuah BUKU (Book)."
      },
      {
        type: 'game-quiz',
        title: "Mini Game: Tebak Suara!",
        instruction: "Fasilitator akan menyalakan suara, tebak kata apa yang diucapkan!",
        quizQuestion: {
          question: "Dengarkan suara yang diputar fasilitator:",
          isAudioOnly: true,
          audioText: "Hello",
          options: [
            { text: "Hello", indonesian: "Halo", emoji: "👋", isCorrect: true },
            { text: "Goodbye", indonesian: "Selamat tinggal", emoji: "🚶", isCorrect: false },
            { text: "Thank you", indonesian: "Terima kasih", emoji: "🙏", isCorrect: false }
          ]
        },
        mascotMessage: "Klik tombol suara di kartu soal, lalu pilih kata yang tepat!"
      },
      {
        type: 'game-word',
        title: "Mini Game: Susun Kata!",
        instruction: "Klik huruf-huruf di bawah secara berurutan untuk menyusun kata yang tepat!",
        wordBuilder: {
          word: "CAT",
          indonesian: "Kucing",
          emoji: "🐱"
        },
        mascotMessage: "Ayo kita susun kata C - A - T (Kucing)!"
      },
      {
        type: 'outro',
        title: "Modul 1 Selesai!",
        mascotMessage: "Amazing! Kamu sudah menyelesaikan pelajaran pertama. Kamu luar biasa! Let's clap together!"
      }
    ]
  },
  {
    id: 2,
    title: "Modul 2 — The World Around You",
    topic: "Angka, Warna, Hewan & Benda Sekitar",
    description: "Mengenal angka 1-10, berbagai warna dasar, hewan lucu, dan nama-nama benda di sekitar kelas.",
    colorClass: "btn-3d-blue",
    scenes: [
      {
        type: 'intro',
        title: "Mari Mengenal Dunia Sekitar",
        mascotMessage: "Welcome back! Hari ini kita akan menjelajahi angka, warna-warni, hewan lucu, dan benda-benda di sekitar kita!",
        instruction: "Ayo klik 'Lanjut' untuk mulai petualangan Modul 2."
      },
      {
        type: 'presentation',
        title: "Mengenal Angka (Numbers 1-5)",
        instruction: "Klik angka-angka di bawah ini untuk mendengar cara pengucapannya:",
        phrases: [
          { english: "One (1)", indonesian: "Satu", audioText: "One" },
          { english: "Two (2)", indonesian: "Dua", audioText: "Two" },
          { english: "Three (3)", indonesian: "Tiga", audioText: "Three" },
          { english: "Four (4)", indonesian: "Empat", audioText: "Four" },
          { english: "Five (5)", indonesian: "Lima", audioText: "Five" }
        ],
        mascotMessage: "Sambil mendengarkan, hitung lingkaran kecilnya ya!"
      },
      {
        type: 'presentation',
        title: "Mengenal Angka (Numbers 6-10)",
        instruction: "Ayo lanjutkan menghitung sampai sepuluh!",
        phrases: [
          { english: "Six (6)", indonesian: "Enam", audioText: "Six" },
          { english: "Seven (7)", indonesian: "Tujuh", audioText: "Seven" },
          { english: "Eight (8)", indonesian: "Delapan", audioText: "Eight" },
          { english: "Nine (9)", indonesian: "Sembilan", audioText: "Nine" },
          { english: "Ten (10)", indonesian: "Sepuluh", audioText: "Ten" }
        ]
      },
      {
        type: 'presentation',
        title: "Mengenal Warna (Colors - Bagian 1)",
        instruction: "Warna-warni membuat dunia indah! Klik warna berikut:",
        phrases: [
          { english: "Red", indonesian: "Merah (🔴)", audioText: "Red" },
          { english: "Yellow", indonesian: "Kuning (🟡)", audioText: "Yellow" },
          { english: "Blue", indonesian: "Biru (🔵)", audioText: "Blue" }
        ],
        mascotMessage: "Merah seperti apel, Kuning seperti pisang, Biru seperti langit!"
      },
      {
        type: 'presentation',
        title: "Mengenal Warna (Colors - Bagian 2)",
        instruction: "Ayo pelajari warna lainnya:",
        phrases: [
          { english: "Green", indonesian: "Hijau (🟢)", audioText: "Green" },
          { english: "Orange", indonesian: "Jingga/Oranye (🟠)", audioText: "Orange" },
          { english: "Purple", indonesian: "Ungu (🟣)", audioText: "Purple" }
        ],
        mascotMessage: "Hijau seperti daun, Oranye seperti buah jeruk, Ungu seperti anggur!"
      },
      {
        type: 'presentation',
        title: "Mengenal Warna (Colors - Bagian 3)",
        instruction: "Tiga warna terakhir untuk hari ini:",
        phrases: [
          { english: "Black", indonesian: "Hitam (⚫)", audioText: "Black" },
          { english: "White", indonesian: "Putih (⚪)", audioText: "White" },
          { english: "Pink", indonesian: "Merah Muda (🌸)", audioText: "Pink" }
        ]
      },
      {
        type: 'presentation',
        title: "Hewan Lucu (Animals - Bagian 1)",
        instruction: "Mari menyapa teman-teman berbulu kita! Klik untuk suara:",
        alphabetGroup: [
          { letter: "Kucing", word: "Cat", indonesian: "Kucing", emoji: "🐱" },
          { letter: "Anjing", word: "Dog", indonesian: "Anjing", emoji: "🐶" },
          { letter: "Kelinci", word: "Rabbit", indonesian: "Kelinci", emoji: "🐰" }
        ]
      },
      {
        type: 'presentation',
        title: "Hewan Lucu (Animals - Bagian 2)",
        instruction: "Ayo lihat hewan di langit dan di air!",
        alphabetGroup: [
          { letter: "Burung", word: "Bird", indonesian: "Burung", emoji: "🐦" },
          { letter: "Ikan", word: "Fish", indonesian: "Ikan", emoji: "🐟" }
        ]
      },
      {
        type: 'presentation',
        title: "Benda di Sekitar Kita (Objects - Bagian 1)",
        instruction: "Benda-benda yang sering kita pakai saat belajar. Klik untuk mendengar kata Inggrisnya:",
        alphabetGroup: [
          { letter: "Buku", word: "Book", indonesian: "Buku", emoji: "\uD83D\uDCD6" },
          { letter: "Tas", word: "Bag", indonesian: "Tas", emoji: "\uD83C\uDF92" },
          { letter: "Pensil", word: "Pencil", indonesian: "Pensil", emoji: "\u270F\uFE0F" },
          { letter: "Meja", word: "Table", indonesian: "Meja", emoji: "\uD83E\uDEB5" }
        ],
        mascotMessage: "Klik benda kelas ini: Book, Bag, Pencil, dan Table."
      },
      {
        type: 'presentation',
        title: "Benda di Sekitar Kita (Objects - Bagian 2)",
        instruction: "Sekarang lanjut ke benda kelas lainnya. Klik kartu untuk mendengar kata Inggrisnya:",
        alphabetGroup: [
          { letter: "Kursi", word: "Chair", indonesian: "Kursi", emoji: "\uD83E\uDE91" },
          { letter: "Papan", word: "Board", indonesian: "Papan", emoji: "\u2B1C" },
          { letter: "Penghapus", word: "Eraser", indonesian: "Penghapus", emoji: "\u25FB\uFE0F" },
          { letter: "Penggaris", word: "Ruler", indonesian: "Penggaris", emoji: "\uD83D\uDCCF" }
        ],
        mascotMessage: "Bagus! Sekarang dengarkan Chair, Board, Eraser, dan Ruler."
      },
      {
        type: 'game-quiz',
        title: "Mini Game: Tebak Warna!",
        instruction: "Lihat warna balon di bawah ini. Bahasa Inggrisnya warna ini apa ya?",
        quizQuestion: {
          question: "Apa bahasa Inggris dari warna MERAH (🔴)?",
          options: [
            { text: "Blue", color: "#1cb0f6", isCorrect: false },
            { text: "Red", color: "#ff4b4b", isCorrect: true },
            { text: "Green", color: "#58cc02", isCorrect: false },
            { text: "Yellow", color: "#ffc700", isCorrect: false }
          ]
        }
      },
      {
        type: 'game-quiz',
        title: "Mini Game: Tebak Gambar Hewan!",
        instruction: "Lihat gambar hewan berikut, lalu pilih kata yang tepat!",
        quizQuestion: {
          question: "Hewan apakah ini? 🐰",
          options: [
            { text: "Cat", indonesian: "Kucing", emoji: "🐱", isCorrect: false },
            { text: "Dog", indonesian: "Anjing", emoji: "🐶", isCorrect: false },
            { text: "Rabbit", indonesian: "Kelinci", emoji: "🐰", isCorrect: true }
          ]
        }
      },
      {
        type: 'game-word',
        title: "Mini Game: Susun Kata Angka!",
        instruction: "Ayo susun huruf membentuk angka TIGA (3) dalam Bahasa Inggris!",
        wordBuilder: {
          word: "THREE",
          indonesian: "Tiga (3)",
          emoji: "3️⃣"
        }
      },
      {
        type: 'outro',
        title: "Modul 2 Selesai!",
        mascotMessage: "Excellent! Kamu pintar sekali! Sekarang kamu tahu angka, warna, hewan, dan benda sekitar. Kita dapat Bintang 3!"
      }
    ]
  },
  {
    id: 3,
    title: "Modul 3 — Let's Talk!",
    topic: "Belajar Kalimat Sederhana",
    description: "Mempelajari cara menyusun kalimat sederhana seperti kepemilikan benda, menunjuk benda, dan mendeskripsikan warna.",
    colorClass: "btn-3d-blue",
    scenes: [
      {
        type: 'intro',
        title: "Mari Belajar Membuat Kalimat",
        mascotMessage: "Wah, kalian hebat! Di pelajaran terakhir ini, kita akan belajar menggabungkan kata menjadi kalimat agar kita bisa bicara Bahasa Inggris!",
        instruction: "Klik 'Lanjut' untuk mempelajari pola kalimat sederhana."
      },
      {
        type: 'presentation',
        title: "Menyatakan Kepemilikan (I have a...)",
        instruction: "Pola 'I have a [benda]' digunakan untuk bilang 'Saya punya [benda]'. Klik kalimatnya:",
        phrases: [
          { english: "I have a book.", indonesian: "Saya punya buku.", audioText: "I have a book" },
          { english: "I have a pencil.", indonesian: "Saya punya pensil.", audioText: "I have a pencil" },
          { english: "I have a bag.", indonesian: "Saya punya tas.", audioText: "I have a bag" }
        ],
        mascotMessage: "Ayo tirukan suara Mimo: I have a book!"
      },
      {
        type: 'presentation',
        title: "Menunjuk Benda (This is a...)",
        instruction: "Pola 'This is a [benda]' digunakan untuk bilang 'Ini adalah [benda]'. Klik untuk mendengar:",
        phrases: [
          { english: "This is a cat.", indonesian: "Ini adalah kucing.", audioText: "This is a cat" },
          { english: "This is a chair.", indonesian: "Ini adalah kursi.", audioText: "This is a chair" },
          { english: "This is a table.", indonesian: "Ini adalah meja.", audioText: "This is a table" }
        ]
      },
      {
        type: 'presentation',
        title: "Menyatakan Sifat/Warna (The... is...)",
        instruction: "Pola 'The [benda/hewan] is [warna]' menyatakan warna atau sifat benda. Klik untuk mendengar:",
        phrases: [
          { english: "The apple is red.", indonesian: "Apel itu berwarna merah.", audioText: "The apple is red" },
          { english: "The fish is blue.", indonesian: "Ikan itu berwarna biru.", audioText: "The fish is blue" },
          { english: "The sun is yellow.", indonesian: "Matahari itu berwarna kuning.", audioText: "The sun is yellow" }
        ]
      },
      {
        type: 'presentation',
        title: "Percakapan Pendek (Short Dialogue)",
        instruction: "Perhatikan percakapan perkenalan singkat berikut ini:",
        phrases: [
          { english: "A: Hello! What is your name?", indonesian: "A: Halo! Siapa namamu?", audioText: "Hello! What is your name?" },
          { english: "B: Hi! My name is Budi. I have a book.", indonesian: "B: Hai! Nama saya Budi. Saya punya buku.", audioText: "Hi! My name is Budi. I have a book" },
          { english: "A: Nice to meet you, Budi!", indonesian: "A: Senang bertemu denganmu, Budi!", audioText: "Nice to meet you, Budi" }
        ]
      },
      {
        type: 'game-sentence',
        title: "Mini Game: Susun Kalimat!",
        instruction: "Klik kartu-kartu kata di bawah secara berurutan agar membentuk kalimat: 'Saya punya tas'!",
        sentenceBuilder: {
          targetSentence: "I HAVE A BAG",
          indonesian: "Saya punya tas",
          hintEmoji: "🎒"
        },
        mascotMessage: "Ayo susun kata-katanya agar rapi!"
      },
      {
        type: 'game-sentence',
        title: "Mini Game: Susun Kalimat Warna!",
        instruction: "Susun kata-kata untuk membentuk arti kalimat: 'Kucing itu berwarna hitam'!",
        sentenceBuilder: {
          targetSentence: "THE CAT IS BLACK",
          indonesian: "Kucing itu berwarna hitam",
          hintEmoji: "🐈‍⬛"
        }
      },
      {
        type: 'game-quiz',
        title: "Mini Game: Kuis Campuran!",
        instruction: "Ayo uji ingatanmu dari pelajaran-pelajaran sebelumnya!",
        quizQuestion: {
          question: "Apa arti dari kalimat: 'This is a dog'? 🐶",
          options: [
            { text: "Saya punya anjing", isCorrect: false },
            { text: "Ini adalah seekor anjing", isCorrect: true },
            { text: "Anjing itu berwarna hitam", isCorrect: false }
          ]
        }
      },
      {
        type: 'outro',
        title: "Selamat! Kelas Selesai!",
        mascotMessage: "Hooray! Kita telah menyelesaikan semua pelajaran Bahasa Inggris! Kalian semua adalah murid terhebat! Keep learning!",
        instruction: "Semua modul selesai. Fasilitator dapat merayakan dengan anak-anak!"
      }
    ]
  }
];
