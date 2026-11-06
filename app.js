(function () {
  'use strict';

  /* cień nagłówka */
  var top = document.getElementById('top');
  function cien() { top.classList.toggle('cien', window.scrollY > 8); }
  window.addEventListener('scroll', cien, { passive: true }); cien();

  /* menu mobilne */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu-mob');
  function zamknij() { menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Otwórz menu'); }
  burger.addEventListener('click', function () {
    var otw = menu.hidden;
    menu.hidden = !otw;
    burger.setAttribute('aria-expanded', String(otw));
    burger.setAttribute('aria-label', otw ? 'Zamknij menu' : 'Otwórz menu');
  });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) zamknij(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { zamknij(); burger.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 1180 && !menu.hidden) zamknij(); });

  /* przeciąganie myszą (palec działa natywnie) */
  function przeciagaj(el) {
    var sx = null, sl = 0, ruch = false;
    el.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || el.scrollWidth <= el.clientWidth + 2) return;
      e.stopPropagation();
      sx = e.clientX; sl = el.scrollLeft; ruch = false;
    });
    window.addEventListener('pointermove', function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 5) { ruch = true; el.style.scrollSnapType = 'none'; el.style.scrollBehavior = 'auto'; }
      if (ruch) el.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () {
      if (sx === null) return;
      sx = null;
      if (ruch) {
        var w = el.dataset.krok ? el.clientWidth : 0;
        el.style.scrollSnapType = ''; el.style.scrollBehavior = '';
        if (w) el.scrollTo({ left: Math.round(el.scrollLeft / w) * w, behavior: 'smooth' });
        setTimeout(function () { ruch = false; }, 0);
      }
    });
    el.addEventListener('click', function (e) { if (ruch) { e.preventDefault(); e.stopPropagation(); } }, true);
    el.addEventListener('dragstart', function (e) { e.preventDefault(); });
  }
  document.querySelectorAll('[data-tor]').forEach(przeciagaj);

  /* galerie w kartach */
  document.querySelectorAll('[data-gal]').forEach(function (g) {
    var tor = g.querySelector('.gal-tor'), n = tor.children.length, licz = g.querySelector('.gal-licz');
    tor.dataset.krok = '1';
    przeciagaj(tor);
    function idx() { return Math.round(tor.scrollLeft / tor.clientWidth); }
    function idz(i) { i = (i + n) % n; tor.scrollTo({ left: i * tor.clientWidth, behavior: 'smooth' }); }
    tor.addEventListener('scroll', function () { licz.textContent = (idx() + 1) + '/' + n; }, { passive: true });
    g.querySelector('.gal-l').addEventListener('click', function () { idz(idx() - 1); });
    g.querySelector('.gal-r').addEventListener('click', function () { idz(idx() + 1); });
    tor.tabIndex = 0;
    tor.setAttribute('aria-label', 'Zdjęcia, przewiń w bok');
    tor.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); idz(idx() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); idz(idx() - 1); }
    });
  });

  /* temat w formularzu z linków */
  var typ = document.getElementById('typ');
  document.querySelectorAll('[data-typ]').forEach(function (a) {
    a.addEventListener('click', function () { typ.value = a.dataset.typ; });
  });

  /* formularz (wizualizacja - bez wysyłki) */
  var form = document.getElementById('form');
  var info = document.getElementById('form-info');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nazwa = form.nazwa.value.trim(), tel = form.tel.value.trim(), mail = form.email.value.trim();
    if (!nazwa || (!tel && !mail)) {
      info.className = 'form-info pole-cale blad';
      info.textContent = 'Podaj imię i nazwisko (lub firmę) oraz telefon albo e-mail.';
      return;
    }
    info.className = 'form-info pole-cale ok';
    info.textContent = 'Dziękujemy. W docelowej stronie wiadomość trafi od razu na biuro@tp-brand.pl.';
    form.reset();
  });

  /* dolny pasek na telefonie: po przewinięciu za przycisk w hero */
  var pasek = document.getElementById('mob-pasek');
  var cta = document.getElementById('hero-cta');
  var kontakt = document.getElementById('kontakt');
  if ('IntersectionObserver' in window && pasek && cta) {
    var zaCta = false, wKontakcie = false;
    function ustaw() {
      var w = zaCta && !wKontakcie;
      pasek.classList.toggle('widac', w);
      pasek.setAttribute('aria-hidden', String(!w));
      pasek.querySelectorAll('a').forEach(function (a) { a.tabIndex = w ? 0 : -1; });
    }
    new IntersectionObserver(function (en) { zaCta = !en[0].isIntersecting && en[0].boundingClientRect.top < 0; ustaw(); }).observe(cta);
    new IntersectionObserver(function (en) { wKontakcie = en[0].isIntersecting; ustaw(); }, { threshold: 0.1 }).observe(kontakt);
  }
})();
