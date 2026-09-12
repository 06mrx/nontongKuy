/* =========================================================
   NontongYuk — logic utama
   ========================================================= */
(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
  const TMDB_BASE = 'https://api.themoviedb.org/3';
  const SEARCH_API = 'https://seapi.link/?type=search&query=';

  let CURRENT_CATALOG = CATALOG;

  const state = {
    filter: 'all',
    heroIndex: 0,
    heroTimer: null,
    currentOpen: null,
    source: 'vidsrc',
  };

  /* ---------------- helpers ---------------- */
  const esc = (str) =>
    String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[c]));

  function posterUrl(it) {
    if (it.poster) return IMG_BASE + it.poster;
    return '';
  }

  function backdropUrl(it) {
    if (it.backdrop) return 'https://image.tmdb.org/t/p/original' + it.backdrop;
    return '';
  }

  /* ------------ NAVBAR ------------ */
  function initNav() {
    const navbar = $('#navbar');
    const searchBox = $('#searchBox');
    const btnSearch = $('#btnSearch');
    const searchInput = $('#searchInput');
    const btnMenu = $('#btnMenu');
    const navLinks = $('#navLinks');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });

    btnSearch.addEventListener('click', () => {
      searchBox.classList.toggle('open');
      if (searchBox.classList.contains('open')) {
        searchInput.focus();
      } else {
        searchInput.value = '';
        resetHome();
      }
    });

    btnMenu.addEventListener('click', () => navLinks.classList.toggle('open'));

    navLinks.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.classList.remove('open');
        setFilter(link.dataset.filter);
      });
    });

    $('#searchClear').addEventListener('click', () => {
      searchInput.value = '';
      resetHome();
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = searchInput.value.trim();
        if (q) {
          runSearch(q);
          navLinks.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
          $('#searchBox').classList.remove('open');
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  function setFilter(filter) {
    state.filter = filter;
    $$('.nav-link').forEach((l) =>
      l.classList.toggle('active', l.dataset.filter === filter)
    );

    const section = $('#searchSection');
    section.classList.add('hidden');
    $('#searchGrid').innerHTML = '';
    $$('#mainContent .row').forEach((r) => r.classList.remove('hidden'));

    const rows = $$('#mainContent .row');
    rows.forEach((row) => {
      const moviesOnly = row.classList.contains('is-tv');
      const show =
        filter === 'all' ||
        (filter === 'movie' && !moviesOnly) ||
        (filter === 'tv' && moviesOnly);
      row.style.display = show ? '' : 'none';
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------------- TMDB ---------------- */
  function tmdbUrl(path, params) {
    const p = new URLSearchParams(
      Object.assign({ api_key: TMDB_API_KEY, language: 'id-ID' }, params || {})
    );
    return TMDB_BASE + '/' + path + '?' + p.toString();
  }

  function tmdbToItem(t, forcedType) {
    const isTv =
      forcedType === 'tv' ||
      t.media_type === 'tv' ||
      Boolean(t.first_air_date && !t.release_date);
    const dateStr = t.release_date || t.first_air_date || '';
    return item({
      id: t.id,
      type: isTv ? 'tv' : 'movie',
      title: t.title || t.name || t.original_name || 'Tanpa Judul',
      year: Number(String(dateStr).slice(0, 4)) || '',
      genre: t.genres && t.genres[0] ? t.genres[0].name : '',
      match: t.vote_average ? Math.round(t.vote_average * 10) : 80,
      poster: t.poster_path || '',
      backdrop: t.backdrop_path || '',
      seasons: isTv && t.number_of_seasons ? t.number_of_seasons : 0,
      desc: t.overview || '',
    });
  }

  function tmdbFetch(path, params) {
    return fetch(tmdbUrl(path, params))
      .then((res) => (res.ok ? res.json() : { results: [] }))
      .catch(() => ({ results: [] }));
  }

  function fetchTMDCRows() {
    if (!TMDB_API_KEY) return Promise.resolve([]);

    const calls = [
      tmdbFetch('trending/all/week').then((j) => ({
        title: 'Trending Pekan Ini',
        items: (j.results || [])
          .filter((t) => t.media_type !== 'person')
          .map((t) => tmdbToItem(t)),
      })),
      tmdbFetch('movie/popular').then((j) => ({
        title: 'Film Populer',
        items: (j.results || []).map((t) => tmdbToItem(t, 'movie')),
      })),
      tmdbFetch('tv/popular').then((j) => ({
        title: 'Series TV Populer',
        items: (j.results || []).map((t) => tmdbToItem(t, 'tv')),
      })),
      tmdbFetch('discover/movie', {
        with_genres: '28,12,878',
        sort_by: 'popularity.desc',
        page: 1,
      }).then((j) => ({
        title: 'Aksi & Petualangan',
        items: (j.results || []).map((t) => tmdbToItem(t, 'movie')),
      })),
      tmdbFetch('discover/movie', {
        with_genres: '16,10751',
        sort_by: 'popularity.desc',
        page: 1,
      }).then((j) => ({
        title: 'Animasi & Keluarga',
        items: (j.results || []).map((t) => tmdbToItem(t, 'movie')),
      })),
    ];

    return Promise.all(calls).then((rows) =>
      rows.filter((r) => r.items.length > 0)
    );
  }

  /* ---------------- ROWS ---------------- */
  function renderRows() {
    const main = $('#mainContent');
    const rows = $$('#mainContent .row');
    rows.forEach((r) => r.remove());

    CURRENT_CATALOG.forEach((cat, i) => {
      const isTv = cat.items.some((it) => it.type === 'tv');
      const section = document.createElement('section');
      section.className = 'row' + (isTv ? ' is-tv' : '');

      let title = esc(cat.title);
      const genreParts = cat.items
        .map((it) => it.genre)
        .filter((g, idx, arr) => g && arr.indexOf(g) === idx);
      if (genreParts.length === 1) title += ' - ' + esc(genreParts[0]);

      section.innerHTML =
        '<div class="row-header"><h2 class="row-title">' + title + '</h2></div>' +
        '<div class="row-track-wrap">' +
        '<button class="row-btn prev" aria-label="Sebelumnya">&#8249;</button>' +
        '<div class="cards-row"></div>' +
        '<button class="row-btn next" aria-label="Berikutnya">&#8250;</button>' +
        '</div>';

      const cardsRow = section.querySelector('.cards-row');
      cat.items.forEach((it) => cardsRow.appendChild(makeCard(it)));

      main.insertBefore(section, $('#searchSection'));

      const prev = section.querySelector('.row-btn.prev');
      const next = section.querySelector('.row-btn.next');
      prev.addEventListener('click', () => (cardsRow.scrollLeft -= 360));
      next.addEventListener('click', () => (cardsRow.scrollLeft += 360));

      if (state.filter === 'movie' && isTv) section.style.display = 'none';
      if (state.filter === 'tv' && !isTv) section.style.display = 'none';
    });
  }

  function makeCard(it) {
    const div = document.createElement('div');
    div.className = 'card';
    div.setAttribute('role', 'button');
    div.setAttribute('tabindex', '0');
    div.setAttribute('aria-label', it.title);

    let posterHtml;
    if (it.poster) {
      posterHtml =
        '<img class="card-poster" loading="lazy" src="' + posterUrl(it) + '" alt="' + esc(it.title) + '" ' +
        'onerror="this.classList.add(\'fallback\');this.removeAttribute(\'src\');' +
        'this.dataset.initial=\'\';this.innerHTML=\'<span>' +
        esc(it.title).replace(/'/g, '\\\'') + '</span>\';">';
    } else {
      posterHtml =
        '<div class="card-poster fallback" data-initial="' + esc(it.title.charAt(0).toUpperCase()) + '">' +
        '<span>' + esc(it.title) + '</span></div>';
    }

    div.innerHTML =
      '<div class="card-poster-area">' + posterHtml + '</div>' +
      '<span class="card-type">' + (it.type === 'tv' ? 'Series' : 'Film') + '</span>' +
      '<div class="card-info">' +
      '<div class="card-title">' + esc(it.title) + '</div>' +
      '<div class="card-sub"><span class="match">' + it.match + '% Cocok</span>' +
      '<span>' + esc(it.year) + '</span></div>' +
      '</div>' +
      '<div class="card-overlay-click"></div>';

    const open = () => openPlayer(it);
    div.querySelector('.card-overlay-click').addEventListener('click', open);
    div.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
    return div;
  }

  /* ---------------- HERO ---------------- */
  function initHero() {
    const content = $('#heroContent');
    const dotsWrap = $('#heroDots');
    const backdrop = $('#heroBackdrop');

    FEATURED.forEach((it, i) => {
      const dot = document.createElement('button');
      dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Tampilkan ' + it.title);
      dot.addEventListener('click', () => showHero(i));
      dotsWrap.appendChild(dot);
    });

    function showHero(i) {
      state.heroIndex = i;
      const it = FEATURED[i];
      backdrop.style.backgroundImage = 'url("' + backdropUrl(it) + '")';
      content.innerHTML =
        '<span class="hero-badge">' + (it.type === 'tv' ? 'Series Original' : 'Pilihan NontongYuk') + '</span>' +
        '<h1 class="hero-title">' + esc(it.title) + '</h1>' +
        '<div class="hero-meta">' +
        '<span class="match">' + it.match + '% Cocok</span>' +
        '<span>' + esc(it.year) + '</span>' +
        '<span>' + esc(it.genre) + '</span>' +
        '<span class="hd">HD</span>' +
        '</div>' +
        '<p class="hero-desc">' + esc(it.desc) + '</p>' +
        '<div class="hero-buttons">' +
        '<button class="btn-play" id="heroPlay">' +
        '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>Putar</button>' +
        '<button class="btn-info" id="heroInfo">' +
        '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>Info</button>' +
        '</div>';

      $('#heroPlay').addEventListener('click', () => openPlayer(it));
      $('#heroInfo').addEventListener('click', () => openPlayer(it, true));

      $$('.hero-dot').forEach((d, idx) => d.classList.toggle('active', idx === state.heroIndex));

      if (state.heroTimer) clearInterval(state.heroTimer);
      state.heroTimer = setInterval(() => showHero((state.heroIndex + 1) % FEATURED.length), 6000);
    }

    showHero(0);
  }

  /* ---------------- PLAYER MODAL ---------------- */
  const modalEl = $('#modal');
  const modalBackdrop = $('#modalBackdrop');
  const playerWrap = $('#modalPlayer');

  function openPlayer(it, forceInfo) {
    const isTv = it.type === 'tv';

    state.currentOpen = { item: it };
    state.source = 'vidsrc';
    $('#sourceSelect').value = 'vidsrc';

    $('#modalTitle').textContent = it.title;
    $('#modalMeta').innerHTML =
      '<span class="match">' + it.match + '% Cocok</span>' +
      '<span>' + esc(it.year) + '</span>' +
      '<span>' + esc(it.genre) + '</span>' +
      (isTv ? '<span>' + it.seasons + ' Musim</span>' : '') +
      '<span class="hd">HD</span>';
    $('#modalDesc').textContent = it.desc || '';

    const picker = $('#episodePicker');
    if (isTv && !forceInfo) {
      picker.classList.remove('hidden');
      const sSel = $('#seasonSelect');
      const eSel = $('#episodeSelect');
      sSel.innerHTML = '';
      eSel.innerHTML = '';
      const seasons = Math.max(1, it.seasons || 1);
      for (let s = 1; s <= seasons; s++) {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = 'Musim ' + s;
        sSel.appendChild(opt);
      }
      for (let e = 1; e <= 12; e++) {
        const opt = document.createElement('option');
        opt.value = e;
        opt.textContent = 'Episode ' + e;
        eSel.appendChild(opt);
      }
      $('#btnPlayEpisode').onclick = () => loadPlayer(it, sSel.value, eSel.value);
      loadPlayer(it, sSel.value, eSel.value);
    } else {
      picker.classList.add('hidden');
      loadPlayer(it);
    }

    modalEl.classList.remove('hidden');
    modalBackdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function playerSrc(it, season, episode) {
    return embedUrl(it, season, episode, state.source);
  }

  function loadPlayer(it, season, episode) {
    playerWrap.innerHTML =
      '<div class="modal-player-placeholder"><div class="player-loader"></div>' +
      '<p>Memuat pemutar ' + esc(it.title) + ' ...</p></div>';

    const iframe = document.createElement('iframe');
    iframe.src = playerSrc(it, season, episode);
    iframe.setAttribute('allow', 'autoplay; fullscreen; encrypted-media; picture-in-picture; web-share');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('webkitallowfullscreen', '');
    iframe.setAttribute('mozallowfullscreen', '');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    iframe.classList.add('player-frame');

    let loaded = false;
    iframe.addEventListener('load', () => {
      if (loaded) return;
      loaded = true;
      playerWrap.innerHTML = '';
      playerWrap.appendChild(iframe);
    });

    setTimeout(() => {
      if (!loaded) {
        playerWrap.innerHTML = '';
        playerWrap.appendChild(iframe);
      }
    }, 1500);
  }

  function closeModal() {
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitFullscreenElement && document.webkitExitFullscreen) document.webkitExitFullscreen();
    modalEl.classList.add('hidden');
    modalBackdrop.classList.add('hidden');
    playerWrap.innerHTML = '';
    document.body.style.overflow = '';
  }

  function bindModalEvents() {
    $('#modalClose').addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);

    const fsBtn = $('#btnFullscreen');
    fsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFullscreen();
    });
    document.addEventListener('fullscreenchange', updateFsLabel);
    document.addEventListener('webkitfullscreenchange', updateFsLabel);

    const srcSel = $('#sourceSelect');
    srcSel.addEventListener('change', () => {
      if (!state.currentOpen) return;
      state.source = srcSel.value;
      const it = state.currentOpen.item;
      const sSel = $('#seasonSelect');
      const eSel = $('#episodeSelect');
      const hasPicker = sSel && !sSel.closest('.hidden');
      loadPlayer(
        it,
        hasPicker ? Number(sSel.value) || 1 : undefined,
        hasPicker ? Number(eSel.value) || 1 : undefined
      );
    });
  }

  function toggleFullscreen() {
    const wrap = playerWrap.parentElement || playerWrap;
    if (!document.fullscreenElement) {
      if (wrap.requestFullscreen) {
        wrap.requestFullscreen().catch(() => {});
      } else if (wrap.webkitRequestFullscreen) {
        wrap.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  }

  function updateFsLabel() {
    const isFs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
    $('#btnFullscreenText').textContent = isFs ? 'Keluar Layar Penuh' : 'Layar Penuh';
  }

  function currentItems() {
    const flat = [];
    CURRENT_CATALOG.forEach((row) => row.items.forEach((it) => flat.push(it)));
    return flat;
  }

  /* ---------------- SEARCH ---------------- */
  function runSearch(q) {
    const section = $('#searchSection');
    const grid = $('#searchGrid');
    const loader = $('#searchLoader');
    const empty = $('#searchEmpty');

    section.classList.remove('hidden');
    $('#searchTitle').textContent = 'Hasil untuk "' + q + '"';
    $$('#mainContent .row').forEach((r) => r.classList.add('hidden'));

    grid.classList.add('hidden');
    empty.classList.add('hidden');
    loader.classList.remove('hidden');
    grid.innerHTML = '';

    const localHits = currentItems().filter(
      (it) => it.title.toLowerCase().indexOf(q.toLowerCase()) !== -1
    );

    Promise.all([localHits, fetchRemote(q)])
      .then(([local, remote]) => {
        loader.classList.add('hidden');
        grid.innerHTML = '';

        local.forEach((it) => grid.appendChild(makeCard(it)));

        remote.forEach((r, idx) => grid.appendChild(makeSearchCard(r, idx)));

        if (!grid.children.length) {
          empty.classList.remove('hidden');
        } else {
          grid.classList.remove('hidden');
        }
      })
      .catch(() => {
        loader.classList.add('hidden');
        if (!grid.children.length) empty.classList.remove('hidden');
        else grid.classList.remove('hidden');
      });
  }

  function fetchRemote(q) {
    if (TMDB_API_KEY) {
      return tmdbFetch('search/multi', { query: q })
        .then((j) =>
          (j.results || [])
            .filter((t) => t.media_type !== 'person')
            .map((t) => tmdbToItem(t))
            .filter((t) => t.id && t.title && t.title !== 'Tanpa Judul')
        );
    }
    return fetch(SEARCH_API + encodeURIComponent(q) + '&max_results=10')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => normalizeRemote(data))
      .catch(() => []);
  }

  function normalizeRemote(data) {
    if (!Array.isArray(data)) return [];
    const seen = {};
    return data
      .map((r) => {
        const id = r.tmdbid || r.tmdb_id || r.id;
        const title = r.title || r.name || r.original_title || '';
        const year = (r.year || r.release_date || r.first_air_date || '').toString().slice(0, 4);
        const vod = (r.vod || r.type || r.media_type || 'movie').toString().toLowerCase();
        const type = vod.indexOf('tv') !== -1 || vod.indexOf('show') !== -1 || r.s !== undefined ? 'tv' : 'movie';
        if (!id && r.imdbid) {
          return {
            id: r.imdbid,
            tmdbId: 0,
            title,
            year,
            genre: '',
            match: 80,
            type,
            imdb: true,
          };
        }
        if (!id || !title || seen[id]) return null;
        seen[id] = true;
        return {
          id: id,
          title,
          year,
          genre: '',
          match: 80,
          type,
        };
      })
      .filter(Boolean);
  }

  function makeSearchCard(r) {
    const div = document.createElement('div');
    div.className = 'search-card';
    div.setAttribute('role', 'button');
    div.setAttribute('tabindex', '0');
    div.setAttribute('aria-label', r.title);

    const itemForEmbed = Object.assign({}, r, {
      poster: '',
      seasons: r.type === 'tv' ? 1 : 0,
      desc: r.type === 'tv' ? 'Nonton serial ini via SuperEmbed.' : 'Nonton film ini via SuperEmbed.',
      backdrop: '',
    });

    let posterHtml;
    if (r.poster) {
      posterHtml =
        '<img class="card-poster" loading="lazy" src="' + posterUrl(r) + '" alt="' + esc(r.title) + '" ' +
        'onerror="this.classList.add(\'fallback\');this.removeAttribute(\'src\');' +
        'this.dataset.initial=\'\';this.innerHTML=\'<span>' +
        esc(r.title).replace(/'/g, '\\\'') + '</span>\';">';
    } else {
      posterHtml =
        '<div class="card-poster fallback" data-initial="' + esc(r.title.charAt(0).toUpperCase()) + '">' +
        '<span>' + esc(r.title) + '</span></div>';
    }

    div.innerHTML =
      posterHtml +
      '<div class="card-info">' +
      '<div class="card-title">' + esc(r.title) + '</div>' +
      '<div class="card-sub"><span class="match">' + r.match + '% Cocok</span>' +
      (r.year ? '<span>' + esc(r.year) + '</span>' : '') +
      '</div></div>';

    const open = () => openPlayer(itemForEmbed);
    div.addEventListener('click', open);
    div.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
    return div;
  }

  function resetHome() {
    state.filter = 'all';
    $$('.nav-link').forEach((l) => l.classList.toggle('active', l.dataset.filter === 'all'));
    const section = $('#searchSection');
    section.classList.add('hidden');
    $('#searchGrid').innerHTML = '';
    $$('#mainContent .row').forEach((r) => r.classList.remove('hidden'));
    $$('#mainContent .row').forEach((r) => (r.style.display = ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  $('#btnBackHome').addEventListener('click', resetHome);

  /* ---------------- init ---------------- */
  function init() {
    initNav();
    bindModalEvents();

    fetchTMDCRows().then((rows) => {
      if (rows.length) CURRENT_CATALOG = rows.concat(CATALOG);
      renderRows();
      initHero();
      setFilter(state.filter);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();