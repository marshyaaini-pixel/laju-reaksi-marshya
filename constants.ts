import { Module, Question } from './types';

export const MODULES: Module[] = [
  {
    id: 'mod-1',
    title: 'Konsep Laju Reaksi',
    description: 'Pengertian dasar laju reaksi dan pengukurannya (Molaritas/detik).',
    order: 1,
    content: `
# Pengertian Laju Reaksi

Laju reaksi kimia didefinisikan sebagai perubahan konsentrasi reaktan atau produk per satuan waktu.

### Konsep Dasar
- **Berkurangnya Reaktan:** Seiring berjalannya waktu, jumlah pereaksi (reaktan) akan berkurang.
- **Bertambahnya Produk:** Sebaliknya, jumlah hasil reaksi (produk) akan bertambah.

Rumus umum:
\`v = - Δ[R] / Δt = + Δ[P] / Δt\`

Dimana:
- **v** = Laju reaksi (M/s)
- **[R]** = Konsentrasi Reaktan
- **[P]** = Konsentrasi Produk
- **t** = Waktu
    `
  },
  {
    id: 'mod-2',
    title: 'Teori Tumbukan',
    description: 'Bagaimana reaksi terjadi pada tingkat partikel.',
    order: 2,
    content: `
# Teori Tumbukan (Collision Theory)

Reaksi kimia terjadi karena adanya tumbukan antar partikel pereaksi. Namun, tidak semua tumbukan menghasilkan reaksi.

### Syarat Tumbukan Efektif:
1. **Orientasi yang Tepat:** Partikel harus bertumbukan dengan posisi yang pas agar ikatan baru dapat terbentuk.
2. **Energi Aktivasi (Ea):** Partikel harus memiliki energi kinetik yang cukup untuk melampaui energi aktivasi, yaitu energi minimum yang diperlukan untuk memulai reaksi.

Gunakan simulasi di sebelah kanan untuk melihat bagaimana suhu dan konsentrasi mempengaruhi frekuensi tumbukan!
    `
  },
  {
    id: 'mod-3',
    title: 'Faktor Laju Reaksi',
    description: 'Suhu, Konsentrasi, Luas Permukaan, dan Katalis.',
    order: 3,
    content: `
# Faktor-Faktor yang Mempengaruhi

1. **Konsentrasi:** Semakin besar konsentrasi, semakin banyak partikel, sehingga peluang tumbukan semakin sering.
2. **Luas Permukaan:** Semakin halus ukuran partikel (serbuk), luas permukaan sentuh semakin besar, reaksi makin cepat.
3. **Suhu:** Suhu tinggi menaikkan energi kinetik partikel. Partikel bergerak lebih cepat dan tumbukan lebih energik.
4. **Katalis:** Zat yang mempercepat reaksi dengan cara menurunkan Energi Aktivasi (Ea), namun tidak ikut bereaksi secara permanen.
    `
  }
];

export const QUIZZES: Question[] = [
  {
    id: 'q1-m1',
    moduleId: 'mod-1',
    question: 'Satuan yang umum digunakan untuk menyatakan laju reaksi adalah...',
    options: ['Mol', 'Molaritas', 'Molaritas per detik', 'Detik per Molaritas'],
    correctIndex: 2,
    explanation: 'Laju reaksi menyatakan perubahan konsentrasi (Molaritas) per satuan waktu (detik).'
  },
  {
    id: 'q2-m1',
    moduleId: 'mod-1',
    question: 'Tanda negatif (-) pada rumus laju reaksi reaktan menunjukkan...',
    options: ['Reaksi berjalan lambat', 'Konsentrasi reaktan berkurang', 'Konsentrasi reaktan bertambah', 'Reaksi bersifat eksoterm'],
    correctIndex: 1,
    explanation: 'Tanda negatif menunjukkan pengurangan konsentrasi reaktan seiring waktu.'
  },
  {
    id: 'q1-m2',
    moduleId: 'mod-2',
    question: 'Energi minimum yang diperlukan agar tumbukan menghasilkan reaksi disebut...',
    options: ['Energi Potensial', 'Energi Kinetik', 'Energi Aktivasi', 'Entalpi'],
    correctIndex: 2,
    explanation: 'Energi Aktivasi adalah ambang batas energi yang harus dilampaui agar reaksi terjadi.'
  },
  {
    id: 'q1-m3',
    moduleId: 'mod-3',
    question: 'Mengapa kenaikan suhu dapat mempercepat laju reaksi?',
    options: ['Menurunkan energi aktivasi', 'Meningkatkan energi kinetik partikel', 'Memperbesar luas permukaan', 'Meningkatkan konsentrasi'],
    correctIndex: 1,
    explanation: 'Suhu tinggi membuat partikel bergerak lebih cepat (energi kinetik naik), sehingga tumbukan lebih sering dan lebih keras.'
  }
];
