/* =========================================================
   NontongYuk — Katalog konten (embedding via Vidsrc player)
   Embed player: https://vidsrcme.ru/embed/movie/{id}
                 https://vidsrcme.ru/embed/tv/{id}/{s}/{e}
   (player custom dengan subtitle/CC bawaan, tanpa login)
   Poster diambil dari CDN TMDB (image.tmdb.org).
   ========================================================= */

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

/* =========================================================
   TMDB API KEY (untuk daftar film/series yang lebih lengkap)
   ---------------------------------------------------------
   Gratis & hanya perlu 1 menit:
   1. Daftar di https://www.themoviedb.org
   2. Buka Settings -> API -> Create API Key (isi form singkat)
   3. Salin "API Key" (read access) ke kolom di bawah
   Biarkan kosong untuk menggunakan katalog bawaan saja.
   ========================================================= */
const TMDB_API_KEY = '88f3f317200d490c36bacc3dfae8cc62';

/**
 * Bantu bikin item katalog.
 * @param {object} o { id, type, title, year, genre, match, poster, backdrop, seasons, desc }
 */
function item(o) {
  return Object.assign(
    {
      type: 'movie',
      year: '',
      genre: '',
      match: 95,
      poster: '',
      backdrop: '',
      seasons: 0,
      desc: '',
    },
    o
  );
}

const CATALOG = [
  {
    title: 'Trending Sekarang',
    items: [
      item({ id: 872585, title: 'Oppenheimer', year: 2023, genre: 'Drama', match: 98, poster: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', backdrop: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg', desc: 'Kisah J. Robert Oppenheimer dan perannya dalam proyek Manhattan saat Perang Dunia II.' }),
      item({ id: 157336, title: 'Interstellar', year: 2014, genre: 'Sci-Fi', match: 98, poster: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', backdrop: '/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg', desc: 'Sekelompok astronot menjelajahi lubang cacing untuk mencari rumah baru bagi umat manusia.' }),
      item({ id: 66732, type: 'tv', title: 'Stranger Things', year: 2016, seasons: 4, genre: 'Sci-Fi', match: 97, poster: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', desc: 'Sekelompok anak-anak di Hawkins menghadapi makhluk misterius dari Dunia Terbalik.' }),
      item({ id: 414906, title: 'The Batman', year: 2022, genre: 'Aksi', match: 95, poster: '/74xTEgt7R36Fpooo50r9T25onhq.jpg', backdrop: '/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg', desc: 'Batman muda menyelidiki korupsi Gotham yang menyeretnya ke kasus misterius Riddler.' }),
      item({ id: 27205, title: 'Inception', year: 2010, genre: 'Sci-Fi', match: 96, poster: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', backdrop: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg', desc: 'Seorang pencuri yang ahli mencuri mimpi diberi misi menanamkan ide di alam bawah sadar.' }),
      item({ id: 346698, title: 'Barbie', year: 2023, genre: 'Komedi', match: 93, poster: '/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', desc: 'Barbie meninggalkan Barbie Land untuk menjelajahi dunia nyata dan menemukan jati dirinya.' }),
      item({ id: 93405, type: 'tv', title: 'Squid Game', year: 2021, seasons: 2, genre: 'Thriller', match: 96, poster: '/rwzxy5DgbpAEscbzjhJxay5Qvb7.jpg', desc: 'Peserta yang terlilit utang bertaruh nyawa dalam serangkaian permainan kanak-kanak yang mematikan.' }),
      item({ id: 438631, title: 'Dune', year: 2021, genre: 'Petualangan', match: 95, poster: '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', desc: 'Paul Atreides bertarung memperebutkan planet pasir Arrakis, sumber rempah paling berharga di alam semesta.' }),
      item({ id: 361743, title: 'Top Gun: Maverick', year: 2022, genre: 'Aksi', match: 94, poster: '/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', backdrop: '/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg', desc: 'Maverick kembali mengajar pilot muda menghadapi misi mustahil yang menuntut pengorbanan total.' }),
      item({ id: 533535, title: 'Deadpool & Wolverine', year: 2024, genre: 'Aksi', match: 98, poster: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg', backdrop: '/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg', desc: 'Deadpool direkrut Time Variance Authority dan harus mereuni Wolverine untuk menyelamatkan dunianya.' }),
    ],
  },

  {
    title: 'Film Populer',
    items: [
      item({ id: 634649, title: 'Spider-Man: No Way Home', year: 2021, genre: 'Aksi', match: 97, poster: '/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', backdrop: '/uyrOU4BDm2kbVxFsMiDFIHDhc4d.jpg', desc: 'Peter Parker meminta bantuan Doctor Strange, namun mantra yang salah membuka multiverse penuh musuh.' }),
      item({ id: 19995, title: 'Avatar', year: 2009, genre: 'Petualangan', match: 96, poster: '/gKY6q7SjCkAU6FqvqWybDYgUKIF.jpg', desc: 'Tentara yang bertugas di Pandora justru berpihak pada Na\'vi demi menyelamatkan planet itu.' }),
      item({ id: 299534, title: 'Avengers: Endgame', year: 2019, genre: 'Aksi', match: 97, poster: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg', backdrop: '/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg', desc: 'The Avengers melakukan perjalanan waktu untuk membalikkan kehancuran yang dibawa Thanos.' }),
      item({ id: 155, title: 'The Dark Knight', year: 2008, genre: 'Aksi', match: 98, poster: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', backdrop: '/9FE5eD92WfVCiivM9Pq9GVSrlWk.jpg', desc: 'Batman menghadapi Joker, penjahat anarki yang ingin membuktikan bahwa kota bisa hancur.' }),
      item({ id: 475557, title: 'Joker', year: 2019, genre: 'Kriminal', match: 95, poster: '/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', desc: 'Arthur Fleck, seorang pelawak gagal, perlahan berubah menjadi simbol kekacauan di Gotham.' }),
      item({ id: 496243, title: 'Parasite', year: 2019, genre: 'Thriller', match: 98, poster: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', backdrop: '/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg', desc: 'Keluaraga miskin menyusup ke rumah keluarga kaya, memicu kekacauan yang tak terduga.' }),
      item({ id: 603, title: 'The Matrix', year: 1999, genre: 'Sci-Fi', match: 95, poster: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', desc: 'Seorang hacker menemukan bahwa dunia yang ia tinggali hanyalah simulasi komputer.' }),
      item({ id: 597, title: 'Titanic', year: 1997, genre: 'Romantis', match: 96, poster: '/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg', desc: 'Cinta antara dua penumpang kelas sosial berbeda di kapal laut termewah yang karam.' }),
      item({ id: 98, title: 'Gladiator', year: 2000, genre: 'Aksi', match: 95, poster: '/wN2xWp1eIwCKOD0BHTcErTBv1Uq.jpg', desc: 'Jenderal Romawi yang dikhianati menjadi gladiator demi membalas dendam pada kaisar.' }),
      item({ id: 293660, title: 'Deadpool', year: 2016, genre: 'Aksi', match: 96, poster: '/3E53WEZJqP6aM84D8CckXx4pIHw.jpg', desc: 'Bocah truk sampah Wade Wilson berubah jadi anti-pahlawan Deadpool yang brutal tapi lucu.' }),
      item({ id: 450465, title: 'Deadpool 2', year: 2018, genre: 'Aksi', match: 96, poster: '/svIDTNUoajS8dLEo7EosxvyAsgJ.jpg', desc: 'Deadpool membentuk tim X-Force untuk melindungi remaja mutan Cable dan Russell.' }),
    ],
  },

  {
    title: 'Petualangan & Fantasi',
    items: [
      item({ id: 120, title: 'LOTR: The Fellowship of the Ring', year: 2001, genre: 'Fantasi', match: 97, poster: '/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', desc: 'Frodo memulai perjalanan menghancurkan Cincin Satu demi menyelamatkan Middle-earth.' }),
      item({ id: 121, title: 'LOTR: The Two Towers', year: 2002, genre: 'Fantasi', match: 97, poster: '/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg', desc: 'Fellowship terpecah sementara pasukan Saruman mendekati benteng Helm\'s Deep.' }),
      item({ id: 122, title: 'LOTR: The Return of the King', year: 2003, genre: 'Fantasi', match: 98, poster: '/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg', desc: 'Pertempuran terakhir memperebutkan Middle-earth dan nasib Cincin Satu.' }),
      item({ id: 671, title: 'Harry Potter & Batu Bertuah', year: 2001, genre: 'Fantasi', match: 96, poster: '/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg', desc: 'Harry Potter untuk pertama kalinya masuk ke dunia sihir di Sekolah Hogwarts.' }),
      item({ id: 812, title: 'The Lion King', year: 1994, genre: 'Animasi', match: 96, poster: '/eLFfl7vS8dkeG1hKp5mwbm37V83.jpg', desc: 'Singa muda Simba harus menemukan jalan pulang untuk merebut kembali singgasananya.' }),
      item({ id: 354912, title: 'Coco', year: 2017, genre: 'Animasi', match: 96, poster: '/6Ryitt95xrO8KXuqRGm1fUuNwqF.jpg', desc: 'Miguel tersesat di Tanah Orang Mati dan mencari kakek buyutnya yang legendaris.' }),
      item({ id: 766507, title: 'Avatar: The Way of Water', year: 2022, genre: 'Petualangan', match: 95, poster: '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', desc: 'Keluarga Sully bersembunyi di antara klan laut Pandora dari kejaran manusia.' }),
    ],
  },

  {
    title: 'Sci-Fi & Aksi',
    items: [
      item({ id: 76341, title: 'Mad Max: Fury Road', year: 2015, genre: 'Aksi', match: 95, poster: '/hA2ple9q4qnwxp3hKVNhroipsir.jpg', desc: 'Kejar-kejaran brutal di gurun pasca-apokaliptik bersama Furiosa dan Max.' }),
      item({ id: 374720, title: 'Dunkirk', year: 2017, genre: 'Perang', match: 94, poster: '/b4Oe15CGLL61Ped0RAS9JpqdmCt.jpg', desc: 'Evakuasi dramatis ribuan tentara Sekutu yang terjebak di pantai Dunkirk.' }),
      item({ id: 1726, title: 'Iron Man', year: 2008, genre: 'Aksi', match: 95, poster: '/78lPtwv72eTNqFW9COBYI0dWDJa.jpg', desc: 'Tony Stark menyempurnakan baju besi ciptaannya dan menjadi Iron Man.' }),
      item({ id: 24428, title: 'The Avengers', year: 2012, genre: 'Aksi', match: 95, poster: '/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg', desc: 'S.H.I.E.L.D. mengumpulkan para pahlawan super untuk melawan invasi alien Loki.' }),
      item({ id: 71912, type: 'tv', title: 'The Witcher', year: 2019, seasons: 3, genre: 'Fantasi', match: 94, poster: '/AoGsDM02UVt0npBA8OvpDcZbaMi.jpg', desc: 'Pemburu monster mutan Geralt of Rivia terjebak dalam politik kerajaan yang berbahaya.' }),
      item({ id: 82856, type: 'tv', title: 'The Mandalorian', year: 2019, seasons: 3, genre: 'Sci-Fi', match: 95, poster: '/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg', desc: 'Pemburu hadiah penyendiri di galaksi jauh melindungi makhluk kecil bernama Grogu.' }),
      item({ id: 60625, type: 'tv', title: 'Rick and Morty', year: 2013, seasons: 7, genre: 'Animasi', match: 96, poster: '/owhkU6KRqdXoUQpjV8uyZGPtX58.jpg', desc: 'Petualangan psikedelik seorang ilmuwan gila dan cucunya melintasi multiverse.' }),
    ],
  },

  {
    title: 'Animasi & Keluarga',
    items: [
      item({ id: 129, title: 'Spirited Away', year: 2001, genre: 'Animasi', match: 98, poster: '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', desc: 'Chihiro terjebak di dunia roh dan harus bekerja di pemandian para dewa.' }),
      item({ id: 372058, title: 'Your Name', year: 2016, genre: 'Animasi', match: 97, poster: '/q719jXXEzOoYaps6babgKnONONX.jpg', desc: 'Dua remaja yang tak saling kenal bertukar tubuh dan dihubungkan oleh takdir.' }),
      item({ id: 150540, title: 'Inside Out', year: 2015, genre: 'Animasi', match: 96, poster: '/2H1TmgdfNtsKlU9jKdeNyYL5y8T.jpg', desc: 'Emosi dalam diri Riley — Joy, Sadness, dan lainnya — memperebutkan kendali pikirannya.' }),
      item({ id: 862, title: 'Toy Story', year: 1995, genre: 'Animasi', match: 95, poster: '/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg', desc: 'Woody dan Buzz si ranger luar angkasa harus bekerja sama untuk pulang ke rumah.' }),
      item({ id: 324857, title: 'Spider-Man: Into the Spider-Verse', year: 2018, genre: 'Animasi', match: 97, poster: '/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg', desc: 'Miles Morales bertemu Spider-People dari dimensi lain dan belajar menjadi pahlawan.' }),
      item({ id: 569094, title: 'Spider-Man: Across the Spider-Verse', year: 2023, genre: 'Animasi', match: 98, poster: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', desc: 'Miles terjebak dalam konflik multiverse antar Spider-Man dari berbagai dimensi.' }),
      item({ id: 94605, type: 'tv', title: 'Arcane', year: 2021, seasons: 2, genre: 'Animasi', match: 98, poster: '/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg', desc: 'Saudari Jinx dan Vi terpisah oleh perang antara kota Piltover dan Zaun.' }),
    ],
  },

  {
    title: 'Series TV Populer',
    items: [
      item({ id: 1396, type: 'tv', title: 'Breaking Bad', year: 2008, seasons: 5, genre: 'Drama', match: 98, poster: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', desc: 'Guru kimia sekarat berubah menjadi raja sabu di New Mexico.' }),
      item({ id: 1399, type: 'tv', title: 'Game of Thrones', year: 2011, seasons: 8, genre: 'Fantasi', match: 96, poster: '/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg', desc: 'Sembilan keluarga bangsawan berperang memperebutkan Takhta Besi Westeros.' }),
      item({ id: 71446, type: 'tv', title: 'Money Heist', year: 2017, seasons: 5, genre: 'Aksi', match: 95, poster: '/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg', desc: 'Profesor menyusun perampokan terbesar dalam sejarah di Percetakan Uang Spanyol.' }),
      item({ id: 1668, type: 'tv', title: 'Friends', year: 1994, seasons: 10, genre: 'Komedi', match: 96, poster: '/2koX1xLkpTQM4IZebYvKysFW1Nh.jpg', desc: 'Kisah enam sahabat yang tinggal di New York bergulat dengan karier, cinta, dan lelucon.' }),
      item({ id: 2316, type: 'tv', title: 'The Office (US)', year: 2005, seasons: 9, genre: 'Komedi', match: 97, poster: '/dg9e5fPRRId8PoBE0F6jl5y85Eu.jpg', desc: 'Keseharian absurd karyawan kantor Dunder Mifflin dibalut gaya dokumenter.' }),
      item({ id: 60574, type: 'tv', title: 'Peaky Blinders', year: 2013, seasons: 6, genre: 'Kriminal', match: 95, poster: '/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg', desc: 'Keluarga Shelby memperluas kekuasaan geng Peaky Blinders di Birmingham pasca perang.' }),
      item({ id: 70523, type: 'tv', title: 'Dark', year: 2017, seasons: 3, genre: 'Misteri', match: 96, poster: '/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg', desc: 'Hilangnya anak-anak di kota kecil Winden membuka rahasia gelap lintas waktu.' }),
      item({ id: 1622, type: 'tv', title: 'Sherlock', year: 2010, seasons: 4, genre: 'Kriminal', match: 95, poster: '/8iixmfGx5EIFPdpNvB2JvI3VIqX.jpg', desc: 'Detektif jenius Sherlock Holmes memecahkan kasus dengan bantuan Dr. Watson di London modern.' }),
    ],
  },

  {
    title: 'Klasik & Legendaris',
    items: [
      item({ id: 278, title: 'The Shawshank Redemption', year: 1994, genre: 'Drama', match: 98, poster: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', backdrop: '/pNjh59JSxChQktamG3LMp9ZoQzp.jpg', desc: 'Seorang bankir yang dipenjara atas kejahatan yang tak ia lakukan membangun persahabatan abadi.' }),
      item({ id: 680, title: 'Pulp Fiction', year: 1994, genre: 'Kriminal', match: 96, poster: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', desc: 'Kisah kriminal yang saling terkait mengalir lewat non-linear storytelling khas Tarantino.' }),
      item({ id: 550, title: 'Fight Club', year: 1999, genre: 'Thriller', match: 96, poster: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', desc: 'Pria insomnia dan Tyler Durden mendirikan klub tinju rahasia yang berubah jadi gerakan.' }),
      item({ id: 13, title: 'Forrest Gump', year: 1994, genre: 'Drama', match: 96, poster: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', desc: 'Kisah hidup Forrest Gump yang sederhana namun terlibat dalam sejarah besar Amerika.' }),
      item({ id: 238, title: 'The Godfather', year: 1972, genre: 'Kriminal', match: 98, poster: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', desc: 'Keluarga Corleone berjuang mempertahankan kerajaan mafia di tengah perang antar keluarga.' }),
      item({ id: 244786, title: 'Whiplash', year: 2014, genre: 'Drama', match: 96, poster: '/7fn624j5lj3xTme2SgiLCeuedmO.jpg', desc: 'Drummer muda diperas habis-habisan oleh konduktor yang kejam demi kesempurnaan.' }),
      item({ id: 106646, title: 'The Wolf of Wall Street', year: 2013, genre: 'Komedi', match: 94, poster: '/kW9LmvYHAaS9iA0tHmZVq8hQYoq.jpg', desc: 'Raja saham Jordan Belfort hidup dalam pusaran harta, narkoba, dan kelebihan brutal.' }),
      item({ id: 313369, title: 'La La Land', year: 2016, genre: 'Musikal', match: 95, poster: '/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg', desc: 'Musisi dan aktris yang bercita-cita tinggi jatuh cinta di Los Angeles.' }),
    ],
  },
];

const FEATURED = [
  item({ id: 872585, title: 'Oppenheimer', year: 2023, genre: 'Drama', match: 98, backdrop: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg', desc: 'Kisah J. Robert Oppenheimer dan perannya dalam proyek Manhattan saat Perang Dunia II.' }),
  item({ id: 299534, title: 'Avengers: Endgame', year: 2019, genre: 'Aksi', match: 97, backdrop: '/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg', desc: 'The Avengers melakukan perjalanan waktu untuk membalikkan kehancuran yang dibawa Thanos.' }),
  item({ id: 27205, title: 'Inception', year: 2010, genre: 'Sci-Fi', match: 96, backdrop: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg', desc: 'Seorang pencuri yang ahli mencuri mimpi diberi misi menanamkan ide di alam bawah sadar.' }),
  item({ id: 66732, type: 'tv', title: 'Stranger Things', year: 2016, seasons: 4, genre: 'Sci-Fi', match: 97, backdrop: '/56v2KjBlU4XaOv9rVYEQypROD7P.jpg', desc: 'Sekelompok anak-anak di Hawkins menghadapi makhluk misterius dari Dunia Terbalik.' }),
  item({ id: 278, title: 'The Shawshank Redemption', year: 1994, genre: 'Drama', match: 98, backdrop: '/pNjh59JSxChQktamG3LMp9ZoQzp.jpg', desc: 'Seorang bankir yang dipenjara atas kejahatan yang tak ia lakukan membangun persahabatan abadi.' }),
  item({ id: 361743, title: 'Top Gun: Maverick', year: 2022, genre: 'Aksi', match: 94, backdrop: '/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg', desc: 'Maverick kembali mengajar pilot muda menghadapi misi mustahil yang menuntut pengorbanan total.' }),
];

/** Menggabungkan semua item untuk pencarian lokal. */
function allItems() {
  const flat = [];
  CATALOG.forEach((row) => row.items.forEach((it) => flat.push(it)));
  return flat;
}

/** Daftar sumber player. Kunci dipakai di <select id="sourceSelect">. */
const EMBED_SOURCES = ['vidsrc', 'multiembed', 'embed2', 'vsembed'];

/** Membangun URL player sesuai sumber. 'source' salah satu kunci EMBED_SOURCES. */
function embedUrl(item, season, episode, source) {
  source = source || 'vidsrc';
  const id = item.id;
  const isTv = item.type === 'tv';
  const s = season || 1;
  const e = episode || 1;

  if (source === 'multiembed') {
    const idPrefix = item.imdb ? '' : '&tmdb=1';
    let base = 'https://multiembed.mov/?video_id=' + id + idPrefix;
    if (isTv) base += '&s=' + s + '&e=' + e;
    return base;
  }

  if (source === 'embed2') {
    if (isTv) return 'https://www.2embed.cc/embedtv/' + id + '&s=' + s + '&e=' + e;
    return 'https://www.2embed.cc/embed/' + id;
  }

  const HOST =
    source === 'vsembed'
      ? 'https://vsembed.ru/embed/'
      : 'https://vidsrcme.ru/embed/';
  if (isTv) return HOST + 'tv/' + id + '/' + s + '/' + e;
  return HOST + 'movie/' + id;
}