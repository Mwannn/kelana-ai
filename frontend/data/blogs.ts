export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: 'Petualangan' | 'Budgeting' | 'Kuliner' | 'Budaya';
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  snippet: string;
  image: string;
  featured?: boolean;
  tags: string[];
  location: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string;
    }[];
    tips: string[];
    quote?: string;
  };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'hidden-gems-labuan-bajo',
    title: '5 Sudut Sunyi di Labuan Bajo yang Belum Ramai di Media Sosial',
    category: 'Petualangan',
    date: '4 Mar 2026',
    readTime: '6 menit',
    author: {
      name: 'Marwan Wisnu',
      role: 'Founder & AI Engineer',
      avatar: '/icon-192x192.png'
    },
    snippet: 'Lepaskan diri dari kerumunan kapal phinisi komersil. Kami merangkum teluk tersembunyi berpasir merah muda dan bukit savana tanpa suara deru mesin.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    tags: ['Labuan Bajo', 'Flores', 'Hidden Gems', 'Island Hopping'],
    location: 'Labuan Bajo, Nusa Tenggara Timur',
    content: {
      intro: 'Labuan Bajo telah bertransformasi menjadi magnet pariwisata internasional. Namun bagi para pejalan yang merindukan keheningan, keelokan Flores Barat yang sesungguhnya justru terselip di sudut-sudut pulau tak berpenghuni yang luput dari sorotan kamera turis umum.',
      sections: [
        {
          heading: '1. Teluk Sabolo: Suaka Karang Meja yang Sunyi',
          body: 'Terletak sekitar 45 menit perjalanan perahu kayu dari pelabuhan utama Labuan Bajo, Pulau Sabolo menyajikan gradasi laut toska dan terumbu karang meja yang masih sangat sehat. Tidak ada dermaga beton, perahu Anda hanya akan bersandar di atas hamparan pasir putih yang lembut.'
        },
        {
          heading: '2. Puncak Bukit Golo Mori saat Senja Merona',
          body: 'Bagi Anda yang ingin menikmati pemandangan perbukitan savana tanpa harus mendaki ratusan anak tangga seperti di Pulau Padar, kawasan Golo Mori menawarkan panorama lembah berbalut siluet gugusan kepulauan Komodo yang spektakuler saat matahari terbenam.'
        },
        {
          heading: '3. Gua Rangko dan Kolam Air Asin Alami',
          body: 'Gua Rangko adalah gua kapur tersembunyi yang menyimpan kolam air asin jernih di dalamnya. Ketika sinar matahari masuk melalui celah tebing tepat di siang hari, air gua akan berpendar biru safir alami yang sangat menenangkan untuk berenang.'
        }
      ],
      tips: [
        'Sewa kapal kayu lokal milik nelayan lokal di Tempat Pelelangan Ikan (TPI) untuk harga lebih adil dan dampak ekonomi langsung ke warga.',
        'Waktu terbaik mengunjungi teluk tersembunyi adalah pukul 07.00 - 10.00 WITA sebelum angin pasang naik.',
        'Gunakan tabir surya ramah terumbu karang (reef-safe sunscreen) untuk menjaga kelestarian biota laut Flores.'
      ],
      quote: 'Kemewahan terbesar di Flores bukan pada kamar resor bintang lima, melainkan saat Anda duduk sendirian di haluan kapal tanpa sinyal, hanya ditemani hembusan angin laut Sawu.'
    }
  },
  {
    id: '2',
    slug: 'panduan-budget-jogja-5-hari',
    title: 'Panduan Anggaran 5 Hari di Yogyakarta: Dari Gudeg Mbok Lindu Hingga Parangtritis',
    category: 'Budgeting',
    date: '28 Feb 2026',
    readTime: '8 menit',
    author: {
      name: 'Sarah L.',
      role: 'Travel Contributor',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+L&background=1A1612&color=F4EFE6&size=100'
    },
    snippet: 'Rincian pengeluaran realistis di bawah Rp 2.500.000 untuk menikmati warisan sejarah, kopi jos stasiun tugu, dan penginapan bernuansa Jawa kuno.',
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80',
    tags: ['Yogyakarta', 'Budget Travel', 'Kuliner Tradisional', 'Backpacking'],
    location: 'Daerah Istimewa Yogyakarta',
    content: {
      intro: 'Yogyakarta selalu menjadi pelukan hangat bagi pelancong beranggaran terbatas. Dengan strategi transportasi dan pemilihan warung makan yang tepat, Anda bisa menjelajahi keindahan budaya keraton dan pesisir selatan tanpa menguras tabungan.',
      sections: [
        {
          heading: 'Alokasi Anggaran Harian yang Realistis',
          body: 'Untuk durasi 5 hari 4 malam, bujet Rp 2.500.000 sudah mencakup sewa motor harian (Rp 80.000/hari), penginapan homestay di kawasan Prawirotaman (Rp 180.000/malam), serta eksplorasi kuliner legendaris yang lezat dan bersahabat.'
        },
        {
          heading: 'Jejak Kuliner Autentik yang Wajib Disambangi',
          body: 'Awali pagi dengan Gudeg Koyor di Sosrowijayan atau bubur gudeg legendaris. Menjelang malam, nikmati kopi jos arang membara di angkringan Lik Man dekat Stasiun Tugu sambil mendengarkan alunan pengamen jalanan yang berjiwa seni tinggi.'
        }
      ],
      tips: [
        'Manfaatkan kartu KRL Commuter Line Yogya-Solo jika ingin melakukan day-trip ke Solo dengan biaya hanya Rp 8.000.',
        'Sewa sepeda motor langsung di sekitar Stasiun Lempuyangan atau Tugu untuk mendapatkan tarif paling kompetitif.',
        'Kunjungi Candi Sambisari di Kalasan sebagai alternatif candi bawah tanah yang tenang dan tiket masuk hanya Rp 6.000.'
      ]
    }
  },
  {
    id: '3',
    slug: 'filosofi-kopi-tubruk-flores',
    title: 'Filosofi Kopi Juria & Kehangatan Dapur Rumah Adat Bajawa',
    category: 'Kuliner',
    date: '20 Feb 2026',
    readTime: '5 menit',
    author: {
      name: 'Andi Pratama',
      role: 'Cultural Documentarian',
      avatar: 'https://ui-avatars.com/api/?name=Andi+Pratama&background=0E4F4A&color=F4EFE6&size=100'
    },
    snippet: 'Menyusuri dataran tinggi Flores untuk menyesap seduhan kopi langka yang dipetik dari pohon berusia puluhan tahun oleh tangan mama-mama Ngada.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80',
    tags: ['Kopi Nusantara', 'Bajawa', 'Kuliner', 'Tradisi'],
    location: 'Ngada, Bajawa, Flores',
    content: {
      intro: 'Di lereng Gunung Inerie yang berselimut kabut, tradisi minum kopi bukan sekadar ritual pengusir kantuk pagi hari. Kopi Juria khas Bajawa adalah jembatan kekeluargaan yang disangrai di atas tungku tanah liat dapur tradisional.',
      sections: [
        {
          heading: 'Kopi Juria: Varietas Langka yang Dilestarikan Leluhur',
          body: 'Pohon Kopi Juria dapat tumbuh menjulang hingga 5 meter dan hanya bisa dipanen sekali dalam dua tahun. Biji kopi dipetik secara selektif oleh para mama suku Ngada dengan lantunan doa syukur kepada leluhur atas kesuburan tanah vulkanik.'
        },
        {
          heading: 'Kehangatan Dapur Sa’o Rumah Tradisional',
          body: 'Duduk beralas tikar pandan di dalam rumah panggung Sa’o Bena, Anda akan disuguhi secangkir kopi hitam kental tanpa gula beraroma cokelat hutan dan rempah jahe liar. Setiap tegukannya mengalirkan ketulusan hati masyarakat Flores yang menerima tamu layaknya saudara kandung.'
        }
      ],
      tips: [
        'Belilah biji kopi langsung dari petani sangrai di Kampung Tradisional Bena untuk mendukung langsung kesejahteraan keluarga penenun dan petani.',
        'Suhu di Bajawa bisa turun hingga 14°C di malam hari, selalu bawa jaket tebal atau jaket fleece.'
      ]
    }
  },
  {
    id: '4',
    slug: 'etika-berkunjung-ke-tana-toraja',
    title: 'Etika Berkunjung ke Tana Toraja: Panduan Menghargai Upacara Rambu Solo',
    category: 'Budaya',
    date: '15 Feb 2026',
    readTime: '7 menit',
    author: {
      name: 'Marwan Wisnu',
      role: 'Founder & AI Engineer',
      avatar: '/icon-192x192.png'
    },
    snippet: 'Memahami makna spiritual di balik upacara penghormatan leluhur, pakaian yang pantas, dan cara membawa buah tangan yang sopan saat bertamu ke desa Tongkonan.',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
    tags: ['Tana Toraja', 'Rambu Solo', 'Budaya Adat', 'Sulawesi Selatan'],
    location: 'Tana Toraja, Sulawesi Selatan',
    content: {
      intro: 'Tana Toraja adalah benteng peradaban agung di mana batas antara kehidupan dunia dan alam arwah (Puya) dirayakan dengan kehormatan tertinggi. Menghadiri upacara Rambu Solo adalah pengalaman batin yang mendalam asalkan dilandasi oleh rasa hormat yang tulus.',
      sections: [
        {
          heading: 'Memahami Esensi Upacara Rambu Solo',
          body: 'Bagi masyarakat Toraja, orang yang meninggal tidak serta merta dianggap wafat, melainkan "To Makula" (orang sakit) yang sedang bersiap melangkah ke alam baka. Upacara pemakaman ini merupakan wujud pengabdian anak cucu untuk mengantarkan arwah leluhur dengan kerbau belang Tedong Bonga.'
        },
        {
          heading: 'Tata Busana dan Sikap yang Santun',
          body: 'Kenakan pakaian berwarna hitam atau gelap yang tertutup dan sopan. Hindari mengenakan pakaian berwarna merah mencolok atau pakaian santai pantai. Jangan pernah melangkahi sesaji, peti jenazah Dibalun, atau tulang belulang leluhur di tebing batu Londa dan Kete Kesu.'
        },
        {
          heading: 'Membawa Buah Tangan Penghormatan',
          body: 'Sebagai tamu terhormat yang menghadiri upacara adat, membawakan buah tangan seperti slop rokok atau gula pasir kepada keluarga yang berduka adalah tanda tata krama yang sangat dihargai oleh tetua adat setempat.'
        }
      ],
      tips: [
        'Mintalah izin pemandu lokal atau keluarga pelaksana sebelum mengabadikan foto upacara dengan kamera.',
        'Waktu terselenggaranya upacara Rambu Solo paling ramai pada bulan Juli - Agustus dan Desember.',
        'Kunjungi kompleks pemakaman goa batu Lemo di pagi hari untuk pencahayaan terbaik patung Tau-Tau kayu.'
      ],
      quote: 'Kematian di Toraja bukanlah akhir yang getir, melainkan awal pesta kepulangan abadi yang dirajut dengan benang kasih sayang keluarga.'
    }
  },
  {
    id: '5',
    slug: 'packing-list-bromo-musim-dingin',
    title: 'Daftar Perlengkapan Wajib untuk Menembus Dinginnya Savana Bromo',
    category: 'Petualangan',
    date: '10 Feb 2026',
    readTime: '4 menit',
    author: {
      name: 'Sarah L.',
      role: 'Travel Contributor',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+L&background=1A1612&color=F4EFE6&size=100'
    },
    snippet: 'Suhu Bromo bisa menyentuh angka 5°C sebelum subuh. Berikut lapisan pakaian dan perlengkapan kamera agar tidak membeku saat berburu matahari terbit.',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80',
    tags: ['Gunung Bromo', 'Packing Tips', 'Pendakian', 'Jawa Timur'],
    location: 'Taman Nasional Bromo Tengger Semeru',
    content: {
      intro: 'Lautan pasir Bromo tampak ramah di siang hari, namun begitu malam turun di kawasan Penanjakan atau Bukit Kingkong, angin dingin dari lereng Semeru mampu mengikis stamina jika Anda tidak mempersiapkan pakaian secara berlapis (layering system).',
      sections: [
        {
          heading: 'Sistem Layering Tiga Lapis',
          body: 'Gunakan base layer berbahan thermal merino atau sintetis cepat kering, mid layer jaket fleece penghangat, dan outer jaket windproof/waterproof untuk menahan terpaan angin savana.'
        },
        {
          heading: 'Aksesoris Pelindung Ekstremitas',
          body: 'Sarung tangan polar, kupluk penutup telinga, dan syal atau buff masker adalah perlengkapan vital. Partikel debu vulkanik Bromo sangat halus dan dapat mengiritasi mata serta saluran pernapasan saat angin kencang bertiup.'
        }
      ],
      tips: [
        'Bawa baterai kamera cadangan di saku dalam jaket karena udara dingin mempercepat penurunan daya baterai lithium.',
        'Sewa selimut wol tradisional dari warga Tengger di warung kopi Pananjakan jika merasa pakaian kurang hangat.'
      ]
    }
  },
  {
    id: '6',
    slug: 'surga-bawah-laut-misool-raja-ampat',
    title: 'Menyelami Surga Bawah Laut Misool: Panduan Lengkap Raja Ampat Selatan',
    category: 'Petualangan',
    date: '8 Feb 2026',
    readTime: '9 menit',
    author: {
      name: 'Andi Pratama',
      role: 'Marine Conservation Specialist',
      avatar: 'https://ui-avatars.com/api/?name=Andi+Pratama&background=0E4F4A&color=F4EFE6&size=100'
    },
    snippet: 'Eksplorasi laguna toska Danau Cinta Karawapop, terowongan bawah air bawah tebing karst, serta suaka perlindungan hiu karang di jantung Papua Barat.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    tags: ['Raja Ampat', 'Misool', 'Diving', 'Papua Barat Daya'],
    location: 'Misool, Raja Ampat, Papua Barat Daya',
    content: {
      intro: 'Jika Raja Ampat Utara terkenal dengan gugusan pulau Wayag, maka Misool di bagian selatan adalah mahakarya bawah air dunia. Dikelilingi oleh No-Take Zone yang dijaga ketat oleh masyarakat adat dan ranger konservasi, biodiversitas karang Misool adalah yang terpadat di bumi.',
      sections: [
        {
          heading: 'Danau Karawapop dan Laguna Berbentuk Hati',
          body: 'Dari gardu pandang kayu di tebing karst, Anda dapat menyaksikan laguna laut alami yang membentuk siluet hati sempurna berpagar tebing karang prasejarah bertorehkan cap telapak tangan manusia purba berusia ribuan tahun.'
        },
        {
          heading: 'Penyelaman Berkelas Dunia di Magic Mountain',
          body: 'Titik selam Magic Mountain adalah panggung tarian pari manta oseanik raksasa dan kawanan hiu karang sirip hitam. Kejernihan air yang mencapai 30 meter membuat setiap jengkal karang lunak ungu dan oranye tampak berpendar memukau.'
        }
      ],
      tips: [
        'Pilihlah liveaboard atau homestay di Yellu untuk akses titik selam terjauh.',
        'Musim menyelam terbaik di Misool adalah Oktober hingga April saat laut tenang bagai kaca.'
      ]
    }
  },
  {
    id: '7',
    slug: 'jejak-kejayaan-pala-banda-neira',
    title: 'Jejak Kejayaan Pala di Banda Neira: Kota Tua Sunyi Berbalut Sejarah Dunia',
    category: 'Budaya',
    date: '3 Feb 2026',
    readTime: '7 menit',
    author: {
      name: 'Marwan Wisnu',
      role: 'Founder & AI Engineer',
      avatar: '/icon-192x192.png'
    },
    snippet: 'Mengapa segenggam pala di pulau kecil Maluku Tengah ini pernah ditukar dengan Pulau Manhattan New York? Kisah keteguhan rempah dan benteng Batavia kuno.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    tags: ['Banda Neira', 'Sejarah Rempah', 'Maluku', 'Kota Tua'],
    location: 'Banda Neira, Maluku Tengah',
    content: {
      intro: 'Banda Neira bukan sekadar pulau tropis berpasir putih. Di balik ketenangan lautnya yang dinaungi oleh kerucut Gunung Api Banda, tersimpan riwayat diplomasi, perang dagang rempah dunia, dan pengasingan para bapak bangsa seperti Bung Hatta dan Sutan Sjahrir.',
      sections: [
        {
          heading: 'Benteng Belgica: Mahkota Pertahanan VOC',
          body: 'Berdiri kokoh di atas bukit, Benteng Belgica berbentuk segi lima dengan menara pengawas yang mengarah langsung ke perairan Selat Neira. Dari puncaknya, semilir angin membawa aroma buah pala yang sedang dijemur warga di teras rumah kolonial.'
        },
        {
          heading: 'Perjanjian Breda dan Pertukaran dengan Manhattan',
          body: 'Pada tahun 1667 melalui Perjanjian Breda, bangsa Belanda rela menyerahkan koloni New Amsterdam (kini Manhattan, New York) kepada Inggris demi mempertahankan monopoli atas Pulau Run di Kepulauan Banda yang kala itu merupakan satu-satunya produsen pala dunia.'
        }
      ],
      tips: [
        'Akses ke Banda Neira paling nyaman menggunakan Kapal Pelni atau penerbangan perintis dari Ambon.',
        'Cicipi selai buah pala buatan ibu-ibu lokal dan sirup pala segar saat bersantai di sore hari.'
      ]
    }
  },
  {
    id: '8',
    slug: 'misteri-api-biru-kawah-ijen',
    title: 'Misteri Api Biru Kawah Ijen dan Perjuangan Para Penambang Belerang',
    category: 'Petualangan',
    date: '27 Jan 2026',
    readTime: '6 menit',
    author: {
      name: 'Sarah L.',
      role: 'Travel Contributor',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+L&background=1A1612&color=F4EFE6&size=100'
    },
    snippet: 'Fenomena langka yang hanya ada dua di muka bumi. Panduan mendaki kawah vulkanik dan menyaksikan pendar gas belerang biru sebelum fajar menyingsing.',
    image: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1200&q=80',
    tags: ['Kawah Ijen', 'Blue Fire', 'Banyuwangi', 'Vulkanik'],
    location: 'Banyuwangi & Bondowoso, Jawa Timur',
    content: {
      intro: 'Menyusuri jalan setapak menanjak Paltuding di tengah dinginnya malam Banyuwangi akan membawa Anda pada salah satu pemandangan paling surealis di planet bumi: nyala api biru (Blue Fire) yang menyembur dari rekahan kawah danau asam Ijen.',
      sections: [
        {
          heading: 'Proses Terjadinya Nyala Api Biru',
          body: 'Api biru bukanlah lava, melainkan gas belerang bertekanan tinggi yang keluar dari rongga bumi dengan suhu mencapai 600°C dan terbakar seketika saat bersentuhan dengan oksigen di atmosfer malam hari.'
        },
        {
          heading: 'Keteguhan Para Penambang Tradisional',
          body: 'Di balik keelokan fenomena alam ini, para penambang lokal memanggul beban belerang seberat 70 hingga 90 kilogram melintasi bibir kawah terjal setiap harinya. Menghormati jalur mereka dengan memberikan jalan adalah etika utama pejalan.'
        }
      ],
      tips: [
        'Wajib menggunakan masker respirator gas kimia standar (bukan masker bedah kain) untuk melindungi paru-paru dari gas belerang pekat.',
        'Mulailah pendakian pukul 01.30 WIB dari pos Paltuding agar tiba di dasar kawah sebelum api biru meredup saat fajar.'
      ]
    }
  },
  {
    id: '9',
    slug: 'savana-purukambera-kuda-liar-sumba',
    title: 'Menapaki Bukit Savana Purukambera dan Kuda Liar Sumba Timur',
    category: 'Petualangan',
    date: '22 Jan 2026',
    readTime: '6 menit',
    author: {
      name: 'Andi Pratama',
      role: 'Cultural Documentarian',
      avatar: 'https://ui-avatars.com/api/?name=Andi+Pratama&background=0E4F4A&color=F4EFE6&size=100'
    },
    snippet: 'Dataran savana kuning keemasan berlatar birunya Samudra Hindia tempat kawanan kuda sandelwood merumput bebas di bawah mentari timur Indonesia.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    tags: ['Sumba', 'Savana Purukambera', 'Kuda Sandelwood', 'NTT'],
    location: 'Sumba Timur, Nusa Tenggara Timur',
    content: {
      intro: 'Sumba memiliki karakter bentang alam yang unik dibanding pulau lain di Indonesia. Alih-alih hutan hujan tropis lebat, Sumba Timur didominasi oleh perbukitan batu kapur dan hamparan savana luas yang mengingatkan kita pada panorama padang rumput Afrika.',
      sections: [
        {
          heading: 'Kuda Sandelwood: Simbol Kehormatan Sumba',
          body: 'Kuda sandelwood hidup berdampingan erat dengan falsafah adat Marapu. Di padang Purukambera, kawanan kuda berlari kencang menerbangkan debu savana di bawah bayang-bayang pohon lontar yang berdiri tegak membisu.'
        },
        {
          heading: 'Desa Adat Prailiu dan Tenun Ikat Alami',
          body: 'Tak jauh dari padang savana, singgahlah di Kampung Raja Prailiu untuk menyaksikan para penenun perempuan meracik pewarna alami dari akar mengkudu dan daun nila untuk menghasilkan selembar kain tenun ikat bernilai seni tinggi.'
        }
      ],
      tips: [
        'Sewa mobil berpenggerak 4x4 atau pengemudi lokal yang memahami medan jalan berbatu di Sumba Timur.',
        'Musim kering (Mei-Oktober) menampilkan savana berwarna emas kecokelatan yang sangat eksotis untuk fotografi.'
      ]
    }
  },
  {
    id: '10',
    slug: 'eksplorasi-kaldera-rinjani-segara-anak',
    title: 'Eksplorasi Kaldera Rinjani dan Keindahan Danau Segara Anak',
    category: 'Petualangan',
    date: '17 Jan 2026',
    readTime: '8 menit',
    author: {
      name: 'Marwan Wisnu',
      role: 'Founder & AI Engineer',
      avatar: '/icon-192x192.png'
    },
    snippet: 'Catatan perjalanan menaklukkan punggungan tajam Letter E, bermalam di tepi danau kawah vulkanik, dan berendam air panas alami Aik Kalak.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Gunung Rinjani', 'Segara Anak', 'Pendakian', 'Lombok'],
    location: 'Lombok, Nusa Tenggara Barat',
    content: {
      intro: 'Bagi para pendaki gunung sejati, Gunung Rinjani (3.726 mdpl) adalah salah satu trek terindah di kawasan Asia Tenggara. Kehadiran danau kaldera Segara Anak di ketinggian 2.000 meter menjadi obat pelipur lelah paling manjur setelah menembus jalur terjal Sembalun.',
      sections: [
        {
          heading: 'Mendaki Savana Sembalun Menuju Pelawangan',
          body: 'Trek berawal dari padang rumput Sembalun dengan tujuh bukit penyesalan yang menguji tekad. Saat mencapai Pelawangan Sembalun di sore hari, kabut tipis tersibak memperlihatkan Danau Segara Anak yang berkilau toska bak zamrud raksasa.'
        },
        {
          heading: 'Relaksasi di Mata Air Panas Aik Kalak',
          body: 'Setelah turun ke bibir danau kawah, pendaki dapat memulihkan otot-otot yang tegang di pemandian air panas alami Aik Kalak yang dipercaya masyarakat Sasak memiliki khasiat penyembuhan raga dan jiwa.'
        }
      ],
      tips: [
        'Patuhi aturan Zero Waste Rinjani: bawa kembali seluruh bungkus logistik dan sampah ke pos registrasi.',
        'Gunakan jasa porter dan pemandu lokal berlisensi dari desa Senaru atau Sembalun untuk keamanan dan kenyamanan.'
      ]
    }
  },
  {
    id: '11',
    slug: 'ketenangan-dataran-tinggi-dieng',
    title: 'Menemukan Ketenangan di Dataran Tinggi Dieng: Negeri Para Dewa di Balik Kabut',
    category: 'Budaya',
    date: '12 Jan 2026',
    readTime: '6 menit',
    author: {
      name: 'Sarah L.',
      role: 'Travel Contributor',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+L&background=1A1612&color=F4EFE6&size=100'
    },
    snippet: 'Menyusuri kompleks candi Hindu tertua abad ke-7 di pulau Jawa, danau belerang Telaga Warna, serta fenomena embun upas yang membekukan rerumputan.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    tags: ['Dieng', 'Candi Arjuna', 'Telaga Warna', 'Jawa Tengah'],
    location: 'Wonosobo & Banjarnegara, Jawa Tengah',
    content: {
      intro: 'Diberi nama dari bahasa Sanskerta "Di-Hyang" yang berarti tempat tinggal para leluhur atau dewa, dataran tinggi vulkanik Dieng menyajikan perpaduan magis antara situs candi batu abad ke-7 dan kawah vulkanik Sikidang yang terus bergolak.',
      sections: [
        {
          heading: 'Candi Arjuna Berselimut Kabut Pagi',
          body: 'Di pagi hari yang dingin membekukan, kompleks Candi Arjuna tampak sunyi berdiri di tengah padang rumput hijau. Candi beraliran Siwa ini merupakan salah satu peninggalan arsitektur batu tertua di tanah Jawa.'
        },
        {
          heading: 'Pancaran Warna Telaga Warna dan Telaga Pengilon',
          body: 'Dua danau yang bersebelahan ini memiliki keunikan luar biasa: Telaga Warna berpendar hijau toska karena kandungan belerang tinggi, sedangkan Telaga Pengilon berair sangat jernih dan tenang tanpa bau belerang.'
        }
      ],
      tips: [
        'Cicipi kuliner khas Mi Ongklok berkuah kental gurih dan tempe kemul hangat di alun-alun Wonosobo.',
        'Jika datang di bulan Juli-Agustus, siapkan jaket tebal untuk menyaksikan kristal es embun upas di pagi hari.'
      ]
    }
  },
  {
    id: '12',
    slug: 'pesona-bawah-laut-derawan-kakaban',
    title: 'Pesona Bawah Laut Derawan & Sensasi Berenang Bersama Ubur-Ubur Kakaban',
    category: 'Petualangan',
    date: '8 Jan 2026',
    readTime: '7 menit',
    author: {
      name: 'Andi Pratama',
      role: 'Marine Conservation Specialist',
      avatar: 'https://ui-avatars.com/api/?name=Andi+Pratama&background=0E4F4A&color=F4EFE6&size=100'
    },
    snippet: 'Mengapa ubur-ubur di danau prasejarah Kakaban tidak menyengat? Eksplorasi suaka penyu hijau Derawan dan dinding karang vertikal Maratua.',
    image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Derawan', 'Kakaban', 'Ubur-ubur Tanpa Sengat', 'Kalimantan Timur'],
    location: 'Kepulauan Derawan, Berau, Kalimantan Timur',
    content: {
      intro: 'Kepulauan Derawan di Kabupaten Berau adalah salah satu surga bahari paling murni di perairan Kalimantan Timur. Titik puncaknya adalah Danau Kakaban, danau air payau terisolasi yang menampung jutaan ubur-ubur tanpa sengat yang berevolusi selama ribuan tahun.',
      sections: [
        {
          heading: 'Sensasi Magis Berenang di Danau Kakaban',
          body: 'Karena tidak memiliki predator alami di dalam danau tertutup ini, empat spesies ubur-ubur di Kakaban kehilangan sengat pertahanan mereka. Anda dapat melayang di antara kawanan ubur-ubur emas dan bulan dengan rasa aman sepenuhnya.'
        },
        {
          heading: 'Konservasi Penyu Hijau di Pulau Derawan',
          body: 'Di bawah jembatan kayu homestay terapung Derawan, penyu hijau berukuran raksasa hilir mudik mencari makan rumput laut. Warga lokal sangat aktif menjaga sarang telur penyu dari perburuan liar.'
        }
      ],
      tips: [
        'Dilarang menggunakan fins/kaki katak saat berenang di Danau Kakaban karena ayunan kaki dapat merobek tubuh ubur-ubur yang sangat lembut.',
        'Akses termudah adalah melalui Bandara Kalimarau di Berau lalu dilanjutkan dengan speedboat dari Pelabuhan Tanjung Batu.'
      ]
    }
  },
  {
    id: '13',
    slug: 'berlayar-danau-toba-jejak-batak',
    title: 'Berlayar di Danau Toba dan Menyusuri Jejak Leluhur Batak di Pulau Samosir',
    category: 'Budaya',
    date: '3 Jan 2026',
    readTime: '7 menit',
    author: {
      name: 'Marwan Wisnu',
      role: 'Founder & AI Engineer',
      avatar: '/icon-192x192.png'
    },
    snippet: 'Mempelajari kearifan arsitektur Rumah Bolon, ritual tarian Sigale-gale di Tomok, dan keindahan tebing kaldera supervolcano Danau Toba.',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80',
    tags: ['Danau Toba', 'Pulau Samosir', 'Budaya Batak', 'Sumatera Utara'],
    location: 'Danau Toba, Sumatera Utara',
    content: {
      intro: 'Letusan dahsyat supervolcano Toba 74.000 tahun silam meninggalkan danau vulkanik terbesar di dunia yang kini berdenyut dengan kehangatan peradaban Batak Toba di Pulau Samosir.',
      sections: [
        {
          heading: 'Desa Adat Tomok dan Misteri Boneka Sigale-gale',
          body: 'Di Tomok, Anda dapat menyaksikan pertunjukan boneka kayu Sigale-gale yang digerakkan dengan tali benang halus diiringi hentakan musik Gondang Sabangunan untuk menghormati arwah putra mahkota raja.'
        },
        {
          heading: 'Keagungan Filosofis Rumah Bolon',
          body: 'Atap melengkung runcing Rumah Bolon melambangkan tanduk kerbau pembawa kejayaan. Tiang kayu ulin tanpa paku dirancang tahan gempa dengan ukiran Gorga tiga warna: merah (keberanian), putih (kesucian), dan hitam (kematian).'
        }
      ],
      tips: [
        'Nikmati pemandangan Toba 360 derajat dari Menara Pandang Tele di perbatasan darat Samosir.',
        'Sewa sepeda motor untuk mengelilingi pesisir barat Samosir yang relatif sunyi dan berhawa sejuk.'
      ]
    }
  },
  {
    id: '14',
    slug: 'jelajah-granit-pantai-tanjung-tinggi-belitung',
    title: 'Jelajah Negeri Laskar Pelangi: Formasi Granit Raksasa Pantai Tanjung Tinggi',
    category: 'Petualangan',
    date: '28 Des 2025',
    readTime: '5 menit',
    author: {
      name: 'Sarah L.',
      role: 'Travel Contributor',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+L&background=1A1612&color=F4EFE6&size=100'
    },
    snippet: 'Menyusuri labirin celah batu granit purba raksasa di tepi laut berpasir putih selembut tepung dan mencicipi mi belitung kuah udang kental.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    tags: ['Belitung', 'Tanjung Tinggi', 'Laskar Pelangi', 'Pantai'],
    location: 'Belitung, Kepulauan Bangka Belitung',
    content: {
      intro: 'Pantai Tanjung Tinggi dan Tanjung Kelayang di Belitung Utara menawarkan pemandangan pesisir yang tiada duanya di Indonesia: formasi ratusan batuan granit berbobot ribuan ton yang terhampar alami di bibir pantai berair sebening kaca.',
      sections: [
        {
          heading: 'Labirin Batu Granit yang Berusia Jutaan Tahun',
          body: 'Batuan granit di Belitung terbentuk dari magma beku di bawah kerak bumi lebih dari 200 juta tahun lalu yang tersingkap akibat erosi bertahap. Celah di antara batu-batu raksasa ini membentuk lorong alami yang teduh untuk berenang.'
        },
        {
          heading: 'Island Hopping ke Mercusuar Pulau Lengkuas',
          body: 'Berlayar naik perahu cadik menuju Pulau Lengkuas, Anda dapat menaiki mercusuar peninggalan kolonial Belanda tahun 1882 yang masih berfungsi aktif memandu navigasi kapal di Selat Gaspar.'
        }
      ],
      tips: [
        'Cicipi Kopi Manggar (Kopi Kong Djie) yang diseduh dengan ceret panjang tradisional di warung kopi tertua Tanjung Pandan.',
        'Waktu terbaik mengambil foto di Tanjung Tinggi adalah saat air laut sedang surut di sore hari.'
      ]
    }
  },
  {
    id: '15',
    slug: 'pesona-tersembunyi-surga-karang-wakatobi',
    title: 'Pesona Tersembunyi Wakatobi: Titik Selam Kelas Dunia di Jantung Segitiga Karang',
    category: 'Petualangan',
    date: '20 Des 2025',
    readTime: '7 menit',
    author: {
      name: 'Andi Pratama',
      role: 'Marine Conservation Specialist',
      avatar: 'https://ui-avatars.com/api/?name=Andi+Pratama&background=0E4F4A&color=F4EFE6&size=100'
    },
    snippet: 'Mengapa Jacques Cousteau menyebut Wakatobi sebagai suaka bawah air terbaik di dunia? Kehidupan suku Bajo penjelajah samudra dan karang atol Tomia.',
    image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=1200&q=80',
    tags: ['Wakatobi', 'Suku Bajo', 'Coral Triangle', 'Sulawesi Tenggara'],
    location: 'Wakatobi, Sulawesi Tenggara',
    content: {
      intro: 'Wakatobi—akronim dari empat pulau utamanya: Wangi-Wangi, Kaledupa, Tomia, dan Binongko—merupakan episentrum keanekaragaman hayati laut dunia. Dari 850 spesies karang yang ada di bumi, 750 di antaranya dapat ditemukan di perairan kepulauan ini.',
      sections: [
        {
          heading: 'Kehidupan Suku Bajo di Desa Mola',
          body: 'Suku Bajo di Desa Mola telah mendirikan rumah panggung di atas laut selama ratusan tahun. Anak-anak Bajo belajar berenang sebelum bisa berjalan kaki, dan para penyelamnya mampu menyelam bebas hingga kedalaman puluhan meter tanpa tabung oksigen.'
        },
        {
          heading: 'Dinding Karang Vertikal Pulau Tomia',
          body: 'Titik selam Mari Mabuk dan Roma Reef menyajikan dinding karang vertikal yang dipadati anemone laut, kuda laut kerdil kerdil (pygmy seahorse), dan kawanan ikan barakuda yang berputar membentuk pusaran.'
        }
      ],
      tips: [
        'Kunjungi puncak bukit Kahianga di Tomia saat matahari terbit untuk melihat hamparan karang atol dari ketinggian.',
        'Penerbangan perintis tersedia dari Bandara Haluoleo Kendari langsung menuju Wangi-Wangi.'
      ]
    }
  },
  {
    id: '16',
    slug: 'senja-magis-tanah-lot-pesisir-bali',
    title: 'Menikmati Senja Magis di Pura Tanah Lot dan Harmoni Pesisir Tabanan',
    category: 'Budaya',
    date: '15 Des 2025',
    readTime: '5 menit',
    author: {
      name: 'Marwan Wisnu',
      role: 'Founder & AI Engineer',
      avatar: '/icon-192x192.png'
    },
    snippet: 'Menghindari keramaian turis untuk menyaksikan siluet pura karang pemujaan dewa laut yang berdiri anggun diterpa deburan ombak Samudra Hindia.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    tags: ['Bali', 'Tanah Lot', 'Pura Laut', 'Tabanan'],
    location: 'Tabanan, Bali',
    content: {
      intro: 'Di pesisir barat daya pulau Bali, Pura Tanah Lot berdiri tegak di atas bongkahan batu karang hitam pekat. Dibangun pada abad ke-16 oleh Dang Hyang Nirartha, pura ini didedikasikan bagi para dewa penjaga samudra.',
      sections: [
        {
          heading: 'Spiritualitas dan Ular Suci Penjaga Pura',
          body: 'Saat air laut surut, pejalan dapat menyeberang menuju gua di bawah tebing pura tempat bersemayamnya ular laut berbisa yang diyakini sebagai jelmaan selendang Dang Hyang Nirartha untuk melindungi pura dari marabahaya.'
        },
        {
          heading: 'Waktu Terbaik Menyaksikan Senja Tanpa Desak-desakan',
          body: 'Alih-alih berkumpul di pelataran utama yang padat turis, berjalanlah sedikit ke arah tebing Pura Batu Bolong untuk menyaksikan matahari terbenam tepat di lubang tebing karang laut yang megah.'
        }
      ],
      tips: [
        'Pakailah sarung bali dan selendang kuning (kamen) jika berniat mendapatkan percikan tirta suci dari pemangku adat.',
        'Waktu pasang laut biasanya terjadi menjelang magrib, pastikan kembali ke daratan utama sebelum air naik.'
      ]
    }
  },
  {
    id: '17',
    slug: 'titik-nol-kilometer-sabang-pulau-weh',
    title: 'Titik Nol Kilometer Indonesia di Sabang: Pesona Terumbu Karang & Lumba-lumba Pulau Weh',
    category: 'Petualangan',
    date: '10 Des 2025',
    readTime: '6 menit',
    author: {
      name: 'Sarah L.',
      role: 'Travel Contributor',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+L&background=1A1612&color=F4EFE6&size=100'
    },
    snippet: 'Mengunjungi monumen paling barat Nusantara, menyelam di gua bawah laut Pulau Rubiah, dan menikmati ketenangan kopi sanger Aceh.',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    tags: ['Sabang', 'Pulau Weh', 'Nol Kilometer', 'Aceh'],
    location: 'Sabang, Pulau Weh, Aceh',
    content: {
      intro: 'Berdiri di tebing Monumen Kilometer Nol Indonesia di ujung barat Pulau Weh adalah momen kebanggaan tersendiri. Di hadapan Anda terbentang luas Samudra Hindia tanpa batas, dengan udara laut yang bersih dan hutan hujan yang masih rimbun.',
      sections: [
        {
          heading: 'Taman Bawah Laut Pulau Rubiah',
          body: 'Hanya 10 menit menyeberang dari Pantai Iboih, perairan Pulau Rubiah bagaikan akuarium raksasa dengan terumbu karang yang tumbuh mulai kedalaman 1 meter. Ikan badut (clownfish) dan kerapu raksasa mudah dijumpai di sini.'
        },
        {
          heading: 'Menyesap Kopi Sanger Khas Tanah Rencong',
          body: 'Di malam hari, duduklah di kedai kopi tradisional Sabang untuk menikmati kopi sanger—perpaduan kopi saring robusta dengan susu kental manis yang ditarik hingga berbusa tebal.'
        }
      ],
      tips: [
        'Dapatkan sertifikat resmi Kilometer Nol bertandatangan Walikota Sabang di pos kantor pariwisata monumen.',
        'Kapal cepat dari Pelabuhan Ulee Lheue Banda Aceh menuju Balohan Sabang memakan waktu hanya 45 menit.'
      ]
    }
  },
  {
    id: '18',
    slug: 'gugusan-pulau-tropis-karimunjawa',
    title: 'Menjelajahi Karimunjawa: Gugusan Pulau Tropis Eksotis di Laut Jawa',
    category: 'Petualangan',
    date: '5 Des 2025',
    readTime: '6 menit',
    author: {
      name: 'Andi Pratama',
      role: 'Marine Conservation Specialist',
      avatar: 'https://ui-avatars.com/api/?name=Andi+Pratama&background=0E4F4A&color=F4EFE6&size=100'
    },
    snippet: 'Berenang di perairan tenang Pulau Menjangan Kecil, melintasi jembatan kayu hutan bakau, dan menikmati ikan bakar bumbu rempah di alun-alun malam.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    tags: ['Karimunjawa', 'Snorkeling', 'Jepara', 'Jawa Tengah'],
    location: 'Kepulauan Karimunjawa, Jepara, Jawa Tengah',
    content: {
      intro: 'Karimunjawa adalah surga tersembunyi di tengah Laut Jawa. Terdiri dari 27 pulau tropis, kawasan taman nasional ini menawarkan terumbu karang dangkal, air laut tenang tanpa ombak besar, dan keramahan warga multikultural Bugis, Jawa, dan Madura.',
      sections: [
        {
          heading: 'Snorkeling di Gosong Cemara dan Menjangan Kecil',
          body: 'Gosong Cemara adalah daratan pasir putih mini yang hanya muncul saat air laut surut di tengah samudra. Di sekelilingnya, terumbu karang tanduk rusa dan ikan kakatua warna-warni menyambut para penyelam snorkel.'
        },
        {
          heading: 'Pusat Kuliner Alun-alun Karimunjawa',
          body: 'Saat senja berganti malam, alun-alun utama berubah menjadi pasar kuliner laut segar. Anda bisa memilih langsung ikan kakap merah, cumi, atau lobster yang dibakar menggunakan sabut kelapa dengan olesan bumbu asam manis khas pesisir.'
        }
      ],
      tips: [
        'Kapal cepat Express Bahari berangkat dari Pelabuhan Kartini Jepara dengan waktu tempuh sekitar 2 jam.',
        'Bulan April hingga November adalah musim dengan kondisi laut paling tenang dan visibilitas terbaik.'
      ]
    }
  },
  {
    id: '19',
    slug: 'sensasi-ngarai-sianok-kuliner-bukittinggi',
    title: 'Sensasi Megahnya Ngarai Sianok dan Rahasia Rendang Legendaris Bukittinggi',
    category: 'Kuliner',
    date: '1 Des 2025',
    readTime: '7 menit',
    author: {
      name: 'Sarah L.',
      role: 'Travel Contributor',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+L&background=1A1612&color=F4EFE6&size=100'
    },
    snippet: 'Menatap tebing lembah hijau Ngarai Sianok berkedalaman 100 meter, menyusuri Lobang Jepang, dan mencicipi masakan Minangkabau autentik.',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    tags: ['Bukittinggi', 'Ngarai Sianok', 'Rendang Minang', 'Sumatera Barat'],
    location: 'Bukittinggi, Sumatera Barat',
    content: {
      intro: 'Bukittinggi di dataran tinggi Minangkabau memikat dengan udara pegunungan yang sejuk diapit oleh Gunung Singgalang dan Gunung Marapi. Di bibir kotanya, patahan tektonik raksasa Ngarai Sianok membentang megah bagai lembah dongeng.',
      sections: [
        {
          heading: 'Pemandangan Spektakuler Ngarai Sianok & Jam Gadang',
          body: 'Dari Taman Panorama, tebing kapur vertikal setinggi 100 meter yang dialiri aliran sungai kecil tampak sangat asri dengan kawanan monyet ekor panjang yang hidup bebas. Di pusat kota, menara Jam Gadang warisan Belanda tetap menjadi ikon perjumpaan warga.'
        },
        {
          heading: 'Filosofi Rendang Asli Dapur Kayu',
          body: 'Rendang Minang autentik dimasak perlahan menggunakan kayu manis dan santan kelapa tua selama lebih dari 8 jam hingga minyak kelapanya terpisah dan bumbu menghitam pekat. Cita rasa karamelisasi rempah inilah yang diakui sebagai hidangan terlezat di dunia.'
        }
      ],
      tips: [
        'Cicipi Nasi Kapau Uni Lis di Los Lambuang Pasar Ateh untuk sensasi gulai tambusu dan gulai tunjang otentik.',
        'Lewati jembatan gantung Janjang Koto Gadang yang dijuluki "Great Wall of Koto Gadang" untuk pemandangan lembah dari dekat.'
      ]
    }
  },
  {
    id: '20',
    slug: 'peninggalan-perang-dunia-pulau-morotai',
    title: 'Peninggalan Perang Dunia II di Pulau Morotai: Mutiara Bersejarah di Bibir Pasifik',
    category: 'Budaya',
    date: '25 Nov 2025',
    readTime: '6 menit',
    author: {
      name: 'Marwan Wisnu',
      role: 'Founder & AI Engineer',
      avatar: '/icon-192x192.png'
    },
    snippet: 'Mengapa Jenderal Douglas MacArthur memilih pulau terluar Maluku Utara ini sebagai pangkalan serbuan ke Filipina? Jejak bangkai pesawat perang di dasar laut.',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    tags: ['Morotai', 'Perang Dunia II', 'Wreck Diving', 'Maluku Utara'],
    location: 'Pulau Morotai, Maluku Utara',
    content: {
      intro: 'Menatap cakrawala Samudra Pasifik dari pantai pasir putih Morotai, sulit membayangkan bahwa pulau yang damai ini pernah menjadi pangkalan militer terbesar di Asia Pasifik dengan tujuh landasan pacu pesawat tempur Sekutu pada tahun 1944.',
      sections: [
        {
          heading: 'Wreck Diving: Pesawat Bristol Beaufort & Tank Amfibi',
          body: 'Bagi penyelam bawah air, perairan Morotai adalah museum sejarah hidup. Di kedalaman 18 meter hingga 40 meter, bangkai pesawat tempur Sekutu dan kendaraan lapis baja kini telah bertransformasi menjadi rumah bagi anemon dan ikan barakuda.'
        },
        {
          heading: 'Pulau Dodola: Keajaiban Pasir Timbul yang Membelah Laut',
          body: 'Pulau Dodola Besar dan Dodola Kecil dihubungkan oleh lidah pasir putih yang muncul saat air surut. Anda dapat berjalan kaki di antara dua pulau ini dengan air laut jernih berkilau di kedua sisi kaki Anda.'
        }
      ],
      tips: [
        'Kunjungi Museum Perang Dunia II Morotai untuk melihat koleksi amunisi, helm baja, dan mata uang kuno yang dikumpulkan warga.',
        'Sewa perahu nelayan dari Daruba untuk menjelajahi pulau-pulau kecil tak berpenghuni di sekitar Morotai.'
      ],
      quote: 'Di Morotai, ombak Pasifik berbisik tentang masa lalu, mengingatkan kita betapa berharganya kedamaian yang kita nikmati hari ini di bumi pertiwi.'
    }
  }
];
