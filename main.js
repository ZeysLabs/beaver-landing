/* Beaver landing — vanilla JS, no dependencies. */
(function () {
  'use strict';

  var SIGNUP_URL = 'https://app.b3aver.com/login?tab=signup';

  /* ------------------------------------------------------------------
     PLANS — single source of truth for the pricing section.
     Mirrors components/upgrade-dialog.tsx + lib/billing-limits.ts in the app.
     price.<period>.launch is what you pay today; .regular is the struck-through price.
     ------------------------------------------------------------------ */
  var PLANS = {
    starter: {
      name: 'Starter',
      blurb: 'For one person getting a project in order.',
      price: { monthly: { launch: 0, regular: null }, yearly: { launch: 0, regular: null } },
      featured: false,
      specs: [
        ['Users', '1'],
        ['Projects', '2'],
        ['Structures / project', '5'],
        ['Sections / structure', '5'],
        ['Tasks / section', '10'],
        ['Task assignment', false],
        ['AI Architect', false],
        ['File uploads', false],
        ['Themes', '1']
      ]
    },
    pro: {
      name: 'Pro',
      blurb: 'For a small team planning with AI.',
      price: { monthly: { launch: 10, regular: 15 }, yearly: { launch: 90, regular: 135 } },
      featured: false,
      specs: [
        ['Users', '3'],
        ['Projects', '10'],
        ['Structures / project', '25'],
        ['Sections / structure', '50'],
        ['Tasks / section', 'Unlimited'],
        ['Task assignment', true],
        ['AI Architect', '10 / month'],
        ['File uploads', '25 MB / file'],
        ['Storage', '5 GB'],
        ['Themes', '3']
      ]
    },
    business: {
      name: 'Business',
      blurb: 'For teams that work together inside each item.',
      price: { monthly: { launch: 20, regular: 30 }, yearly: { launch: 180, regular: 270 } },
      featured: true,
      flag: 'Recommended',
      specs: [
        ['Users', '10'],
        ['Projects', '50'],
        ['Structures / project', '100'],
        ['Sections / structure', '200'],
        ['Tasks / section', 'Unlimited'],
        ['Task assignment', true],
        ['Team collaboration', true],
        ['AI Architect', '20 / month'],
        ['Project chat', true],
        ['File uploads', '100 MB / file'],
        ['Storage', '10 GB'],
        ['Themes', '10']
      ]
    },
    enterprise: {
      name: 'Enterprise',
      blurb: 'For larger organisations with many projects.',
      price: { monthly: { launch: 80, regular: 120 }, yearly: { launch: 720, regular: 1080 } },
      featured: false,
      specs: [
        ['Users', 'Unlimited'],
        ['Projects', 'Unlimited'],
        ['Structures / project', 'Unlimited'],
        ['Sections / structure', 'Unlimited'],
        ['Tasks / section', 'Unlimited'],
        ['Task assignment', true],
        ['Team collaboration', true],
        ['AI Architect', '100 / month'],
        ['Project chat', true],
        ['File uploads', '500 MB / file'],
        ['Storage', '50 GB'],
        ['Themes', 'Unlimited']
      ]
    }
  };

  /* ---------------- mobile menu ---------------- */
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (menuBtn && nav) {
    var setMenu = function (open) {
      menuBtn.setAttribute('aria-expanded', String(open));
      nav.setAttribute('data-open', String(open));
      menuBtn.querySelector('.menu-btn__label').textContent = open ? 'Close' : 'Menu';
    };
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuBtn.focus();
      }
    });
  }

  /* ---------------- pricing ---------------- */
  var plansEl = document.getElementById('plans');
  var toggleBtns = document.querySelectorAll('.toggle__btn');

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function money(n) { return '$' + n.toLocaleString('en-US'); }

  function renderPlans(period) {
    if (!plansEl) return;
    var frag = document.createDocumentFragment();

    Object.keys(PLANS).forEach(function (key) {
      var plan = PLANS[key];
      var p = plan.price[period];
      var card = el('article', 'plan' + (plan.featured ? ' plan--featured' : ''));
      card.setAttribute('aria-labelledby', 'plan-' + key);

      var top = el('div', 'plan__top');
      var name = el('h3', 'plan__name', plan.name);
      name.id = 'plan-' + key;
      top.appendChild(name);
      if (plan.flag) top.appendChild(el('span', 'plan__flag', plan.flag));
      card.appendChild(top);

      card.appendChild(el('p', 'plan__blurb', plan.blurb));

      var price = el('p', 'plan__price');
      price.appendChild(el('span', 'plan__amount', money(p.launch)));
      price.appendChild(el('span', 'plan__per', period === 'monthly' ? '/ month' : '/ year'));
      var was = el('span', 'plan__was');
      if (p.regular != null) {
        was.appendChild(document.createTextNode('Regular '));
        var s = el('s', null, money(p.regular));
        s.setAttribute('aria-label', 'regular price ' + money(p.regular));
        was.appendChild(s);
      } else {
        was.textContent = ' ';
        was.setAttribute('aria-hidden', 'true');
      }
      price.appendChild(was);
      card.appendChild(price);

      var cta = el('a', 'btn ' + (plan.featured ? 'btn--primary' : 'btn--ghost'), p.launch === 0 ? 'Start free' : 'Choose ' + plan.name);
      cta.href = SIGNUP_URL;
      card.appendChild(cta);

      var dl = el('dl', 'specs');
      plan.specs.forEach(function (row) {
        var wrap = el('div');
        wrap.appendChild(el('dt', null, row[0]));
        var v = row[1];
        var dd;
        if (v === true) dd = el('dd', null, 'Included');
        else if (v === false) dd = el('dd', 'no', 'Not included');
        else dd = el('dd', null, v);
        wrap.appendChild(dd);
        dl.appendChild(wrap);
      });
      card.appendChild(dl);

      frag.appendChild(card);
    });

    plansEl.replaceChildren(frag);
  }

  toggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var period = btn.getAttribute('data-period');
      toggleBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      renderPlans(period);
    });
  });
  renderPlans('monthly');

  /* ---------------- hero illustration ---------------- */
  var demo = document.getElementById('demo');
  if (!demo) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var typed = document.getElementById('demo-typed');
  var rows = Array.prototype.slice.call(demo.querySelectorAll('.row'));
  var annotated = demo.querySelector('.row--annotated');
  var note = document.getElementById('demo-note');
  var ctl = document.getElementById('demo-ctl');
  var fullText = typed.textContent;

  // The markup already holds the final state; with reduced motion we simply leave it.
  if (reduce.matches) return;

  var steps = [];
  var cursor = 0;
  var timer = null;
  var state = 'idle'; // idle | playing | paused | done

  function build() {
    steps = [];
    steps.push({ wait: 500, run: function () { demo.classList.add('is-typing'); } });
    for (var i = 1; i <= fullText.length; i++) {
      (function (n) {
        steps.push({ wait: 38 + (fullText[n - 1] === ' ' ? 40 : 0), run: function () { typed.textContent = fullText.slice(0, n); } });
      })(i);
    }
    steps.push({ wait: 650, run: function () { demo.classList.remove('is-typing'); } });
    rows.forEach(function (row, idx) {
      steps.push({ wait: idx === 0 ? 260 : 170, run: function () { row.classList.remove('is-pending'); } });
    });
    steps.push({ wait: 900, run: function () { annotated.classList.remove('is-unjudged'); } });
    steps.push({ wait: 650, run: function () { note.classList.remove('is-pending'); } });
  }

  function reset() {
    typed.textContent = '';
    rows.forEach(function (r) { r.classList.add('is-pending'); });
    annotated.classList.add('is-unjudged');
    note.classList.add('is-pending');
    demo.classList.remove('is-typing');
    cursor = 0;
  }

  function finishToFinal() {
    clearTimeout(timer);
    typed.textContent = fullText;
    rows.forEach(function (r) { r.classList.remove('is-pending'); });
    annotated.classList.remove('is-unjudged');
    note.classList.remove('is-pending');
    demo.classList.remove('is-typing');
  }

  function setCtl(label) { ctl.textContent = label; }

  function tick() {
    if (state !== 'playing') return;
    if (cursor >= steps.length) {
      state = 'done';
      setCtl('Replay');
      return;
    }
    var step = steps[cursor];
    timer = setTimeout(function () {
      step.run();
      cursor++;
      tick();
    }, step.wait);
  }

  function play() {
    if (state === 'done' || state === 'idle') { reset(); build(); }
    state = 'playing';
    setCtl('Pause');
    tick();
  }

  function pause() {
    clearTimeout(timer);
    state = 'paused';
    demo.classList.remove('is-typing');
    setCtl('Resume');
  }

  ctl.hidden = false;
  ctl.addEventListener('click', function () {
    if (state === 'playing') pause();
    else play();
  });

  // If the user switches on reduced motion mid-play, snap to the final state.
  if (reduce.addEventListener) {
    reduce.addEventListener('change', function (e) {
      if (e.matches) { finishToFinal(); state = 'done'; ctl.hidden = true; }
    });
  }

  // Start when the figure is actually visible; pause politely if it scrolls away mid-play.
  if ('IntersectionObserver' in window) {
    var started = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !started) { started = true; play(); }
        else if (!entry.isIntersecting && state === 'playing') pause();
      });
    }, { threshold: 0.35 });
    reset();
    io.observe(demo);
  } else {
    play();
  }
})();
