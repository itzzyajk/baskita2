import { CircularNotice } from '@/types';

export const INITIAL_CIRCULARS: CircularNotice[] = [
  {
    id: 'circ-01',
    title: 'Notis Cuaca Hujan Lebat & Kawalan Kelajuan Laluan Monfort',
    date: 'Hari ini, 06:15 AM',
    category: 'weather',
    message: 'Hujan renyai melanda TTDI Jaya & Glenmarie pagi ini. Pemandu Bas 01 & 04 telah diarahkan mengekalkan had laju berhati-hati 30-40 km/j. Dijangka kelewatan 5-7 minit bagi memastikan keselamatan murid terjamin.',
    author: 'Pengurusan BasKita TTDI Jaya',
    stickyColor: 'yellow',
  },
  {
    id: 'circ-02',
    title: 'Peringatan Yuran Bulanan Perkhidmatan Bas Sesi Mac 2026',
    date: '3 hari lepas',
    category: 'reminder',
    message: 'Peringatan mesra kepada ibu bapa dan penjaga: Invois yuran perkhidmatan bas bagi bulan Mac telah dijana. Sila jelaskan sebelum 10hb Mac untuk memastikan tempat duduk anak anda kekal aktif.',
    author: 'Bahagian Kewangan BasKita',
    stickyColor: 'teal',
  },
  {
    id: 'circ-03',
    title: 'Cuti Peristiwa & Penyelarasan Jadual Sempena Hari Keputeraan Sultan',
    date: '1 Mac 2026',
    category: 'holiday',
    message: 'Harap maklum bahawa semua perkhidmatan bas sekolah akan bercuti bersempena cuti peristiwa negeri Selangor. Tiada trip bas sekolah beroperasi pada tarikh berkenaan.',
    author: 'Pengarah Operasi',
    stickyColor: 'slate',
  },
];
