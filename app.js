'use strict';
var RECEPTION_DATE = new Date('2026-11-23T17:00:00+05:30');

// ── ENVELOPE — tap the wax seal to open ──
var envSealWrap = document.getElementById('envSealWrap');
var waxSealFront = document.getElementById('waxSealFront');
var tapHint     = document.getElementById('tapHint');
var envWrap     = document.getElementById('envelopeWrap');
var envOverlay  = document.getElementById('envelope-overlay');
var mainWeb     = document.getElementById('main-website');
var sealOpened  = false;

function crackAndOpen() {
  if (sealOpened) return;
  sealOpened = true;

  // 1. Crack animation on the seal
  if (envSealWrap)  envSealWrap.classList.add('cracking');
  if (waxSealFront) waxSealFront.classList.add('cracking');

  // 2. Flap opens after crack finishes (~550ms)
  setTimeout(function() {
    if (envWrap) envWrap.classList.add('opening');
  }, 500);

  // 3. Overlay slides up
  setTimeout(function() {
    if (envOverlay) {
      envOverlay.style.transform  = 'translateY(-100%)';
      envOverlay.style.transition = 'transform .9s cubic-bezier(.4,0,.2,1)';
    }
  }, 1050);

  // 4. Show main website
  setTimeout(function() {
    if (mainWeb) {
      mainWeb.style.display = 'block';
      requestAnimationFrame(function() {
        mainWeb.classList.add('visible');
        initReveal();
        startSparkles();
        startParallax();
      });
    }
    document.body.style.overflow = 'auto';
  }, 1150);

  // 5. Remove overlay from DOM
  setTimeout(function() {
    if (envOverlay) envOverlay.style.display = 'none';
  }, 2100);

  // 6. Start typewriter
  setTimeout(function() {
    typeHeroQuote();
  }, 1900);
}

// Click or keyboard on the seal wrap
if (envSealWrap) {
  envSealWrap.addEventListener('click', crackAndOpen);
  envSealWrap.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); crackAndOpen(); }
  });
}

// ── TYPEWRITER HERO QUOTE ──
var heroQuoteEl = document.getElementById('heroQuote');
var quoteText   = '"A Celebration of Love, Blessings & New Beginnings"';
var qtIndex     = 0;
function typeHeroQuote() {
  if (!heroQuoteEl) return;
  var textSpan = heroQuoteEl.querySelector('.hero-quote-text') || heroQuoteEl;
  var cursor = heroQuoteEl.querySelector('.hero-quote-cursor');
  if (qtIndex <= quoteText.length) {
    textSpan.textContent = quoteText.slice(0, qtIndex);
    qtIndex++;
    setTimeout(typeHeroQuote, 40);
  } else if (cursor) {
    cursor.classList.add('cursor-idle');
  }
}

// ── COUNTDOWN ──
var elDays    = document.getElementById('cdDays');
var elHours   = document.getElementById('cdHours');
var elMinutes = document.getElementById('cdMinutes');
var elSeconds = document.getElementById('cdSeconds');
var cdWrap    = document.getElementById('countdownWrap');
var celebMsg  = document.getElementById('celebrationMsg');

function pad(n){ return String(n).padStart(2,'0'); }
function flip(el, val){
  var s = pad(val);
  if(el && el.textContent !== s){
    el.classList.remove('flip');
    void el.offsetWidth;
    el.classList.add('flip');
    el.textContent = s;
  }
}
function updateCountdown(){
  var diff = RECEPTION_DATE - new Date();
  if(diff <= 0){
    if(cdWrap)   cdWrap.style.display   = 'none';
    if(celebMsg) celebMsg.style.display = 'block';
    return;
  }
  var t = Math.floor(diff/1000);
  flip(elDays,    Math.floor(t/86400));
  flip(elHours,   Math.floor((t%86400)/3600));
  flip(elMinutes, Math.floor((t%3600)/60));
  flip(elSeconds, t%60);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ── SCROLL REVEAL ──
function initReveal(){
  var items = document.querySelectorAll('.js-reveal, .reveal-left, .reveal-right');
  if(!items.length) return;
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin:'0px 0px -25px 0px' });

  items.forEach(function(el){
    var r = el.getBoundingClientRect();
    if(r.top < window.innerHeight && r.bottom > 0){
      el.classList.add('revealed');
    } else {
      obs.observe(el);
    }
  });
}

// ── SCROLL INDICATOR ──
var scrollInd = document.getElementById('scrollIndicator');
window.addEventListener('scroll', function(){
  if(scrollInd){
    if(window.scrollY > 70){ scrollInd.classList.add('hidden'); }
    else { scrollInd.classList.remove('hidden'); }
  }
}, { passive:true });

// ── PARALLAX HERO ──
function startParallax(){
  var heroPhoto   = document.getElementById('heroPhoto');
  var heroContent = document.querySelector('.hero-content');
  var florals     = document.querySelectorAll('.corner-floral');
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', function(){
    var sy = window.scrollY;
    if(heroPhoto && sy < window.innerHeight){
      heroPhoto.style.transform = 'translateY(' + (sy * 0.22) + 'px)';
    }
  }, { passive:true });

  var heroSection = document.getElementById('hero');
  if(heroSection && window.innerWidth > 768){
    heroSection.addEventListener('mousemove', function(e){
      var rect = heroSection.getBoundingClientRect();
      var xRel = (e.clientX - rect.left) / rect.width - 0.5;
      var yRel = (e.clientY - rect.top) / rect.height - 0.5;
      if(heroContent){
        heroContent.style.transform = 'translate3d(' + (xRel * -10) + 'px, ' + (yRel * -8) + 'px, 0)';
      }
      florals.forEach(function(fl, idx){
        var f = (idx % 2 === 0 ? 1 : -1) * 6;
        fl.style.transform = 'translate3d(' + (xRel * f) + 'px, ' + (yRel * f) + 'px, 0)';
      });
    }, { passive:true });

    heroSection.addEventListener('mouseleave', function(){
      if(heroContent) heroContent.style.transform = '';
      florals.forEach(function(fl){ fl.style.transform = ''; });
    });
  }
}

// ── MINIMAL CLEAN GOLDEN STARDUST ENGINE ──
var canvas   = document.getElementById('sparkleCanvas');
var ctx      = canvas ? canvas.getContext('2d') : null;
var sparks   = [];
var confetti = [];
var rafId    = null;
var isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var lastPointerSpark = 0;

function resizeCanvas(){
  if(!canvas) canvas = document.getElementById('sparkleCanvas');
  if(!canvas) return;
  if(!ctx) ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Minimal Clean Golden Particle
function CleanSpark(x, y, isPointer){
  this.isPointer = !!isPointer;
  this.x     = x !== undefined ? x : Math.random() * window.innerWidth;
  this.y     = y !== undefined ? y : Math.random() * window.innerHeight;
  this.size  = this.isPointer ? (Math.random() * 1.2 + 0.6) : (Math.random() * 1.1 + 0.6);
  this.vx    = this.isPointer ? ((Math.random() - .5) * 1.4) : ((Math.random() - .5) * .35);
  this.vy    = this.isPointer ? ((Math.random() - .5) * 1.4) : (-(Math.random() * 0.5 + .2));
  this.alpha = 1;
  this.maxAlpha = this.isPointer ? 0.75 : (Math.random() * 0.35 + 0.25);
  this.decay = this.isPointer ? (Math.random() * .04 + .025) : (Math.random() * .006 + .003);
  var cleanPalette = ['#e0c06a', '#f5e4b3', '#d4af37', '#ffffff'];
  this.color = cleanPalette[Math.floor(Math.random() * cleanPalette.length)];
}
CleanSpark.prototype.update = function(){
  this.x += this.vx;
  this.y += this.vy;
  this.alpha -= this.decay;
};
CleanSpark.prototype.draw = function(){
  if(!ctx) return;
  var currentAlpha = Math.max(0, this.alpha * this.maxAlpha);
  ctx.save();
  ctx.globalAlpha = currentAlpha;
  ctx.fillStyle   = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

// Subtle Clean Celebration Burst
function CleanConfetti(x, y){
  this.x       = x;
  this.y       = y;
  var speed    = Math.random() * 6 + 3;
  var angle    = Math.random() * Math.PI * 2;
  this.vx      = Math.cos(angle) * speed;
  this.vy      = Math.sin(angle) * speed - 2;
  this.gravity = 0.22;
  this.drag    = 0.94;
  this.size    = Math.random() * 3 + 2;
  this.alpha   = 1;
  this.decay   = Math.random() * 0.025 + 0.015;
  this.color   = Math.random() > 0.4 ? '#e0c06a' : '#ffffff';
}
CleanConfetti.prototype.update = function(){
  this.vx *= this.drag;
  this.vy = this.vy * this.drag + this.gravity;
  this.x += this.vx;
  this.y += this.vy;
  this.alpha -= this.decay;
};
CleanConfetti.prototype.draw = function(){
  if(!ctx) return;
  ctx.save();
  ctx.globalAlpha = Math.max(0, this.alpha * 0.85);
  ctx.fillStyle   = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

function celebrateConfetti(x, y){
  if(isReducedMotion) return;
  var cx = (x !== undefined) ? x : (window.innerWidth / 2);
  var cy = (y !== undefined) ? y : (window.innerHeight / 2);
  for(var i = 0; i < 30; i++){
    confetti.push(new CleanConfetti(cx, cy));
  }
}

function sparkLoop(){
  if(!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if(!isReducedMotion){
    if(sparks.length < 14 && Math.random() < 0.18){
      sparks.push(new CleanSpark());
    }
  }

  sparks = sparks.filter(function(s){
    s.update();
    s.draw();
    return s.alpha > 0 && s.y > -10 && s.y < canvas.height + 10;
  });

  confetti = confetti.filter(function(c){
    c.update();
    c.draw();
    return c.alpha > 0 && c.y < canvas.height + 30;
  });

  rafId = requestAnimationFrame(sparkLoop);
}

function startSparkles(){
  if(!canvas) canvas = document.getElementById('sparkleCanvas');
  if(!canvas) return;
  ctx = canvas.getContext('2d');
  resizeCanvas();
  canvas.classList.add('active');
  if(!rafId) sparkLoop();

  window.addEventListener('resize', resizeCanvas, { passive:true });

  function addPointerSpark(e){
    if(isReducedMotion) return;
    var now = performance.now();
    if(now - lastPointerSpark < 90) return;
    lastPointerSpark = now;
    var x = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
    var y = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : null);
    if(x != null && y != null && sparks.length < 28){
      sparks.push(new CleanSpark(x, y, true));
    }
  }
  window.addEventListener('mousemove', addPointerSpark, { passive:true });
  window.addEventListener('touchmove', addPointerSpark, { passive:true });

  document.addEventListener('visibilitychange', function(){
    if(document.hidden){
      if(rafId){ cancelAnimationFrame(rafId); rafId = null; }
    } else {
      if(!rafId) sparkLoop();
    }
  });
}

// ── RIPPLE EFFECT ON BUTTONS ──
document.addEventListener('click', function(e){
  var btn = e.target.closest('.ripple-btn');
  if(!btn) return;
  var rect   = btn.getBoundingClientRect();
  var ripple = document.createElement('span');
  ripple.className = 'ripple-effect';
  var size = Math.max(rect.width, rect.height) * 2;
  ripple.style.cssText = 'width:'+size+'px;height:'+size+'px;left:'+(e.clientX-rect.left-size/2)+'px;top:'+(e.clientY-rect.top-size/2)+'px';
  btn.appendChild(ripple);
  setTimeout(function(){ ripple.remove(); }, 650);
});

// ── BACK TO TOP BUTTON ──
var backToTop = document.getElementById('backToTop');
if(backToTop){
  window.addEventListener('scroll', function(){
    if(window.scrollY > 380){
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive:true });

  backToTop.addEventListener('click', function(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── LANGUAGE TOGGLE (English / മലയാളം) ──
var currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  var btnEn = document.getElementById('btnLangEn');
  var btnMl = document.getElementById('btnLangMl');

  if (btnEn && btnMl) {
    if (lang === 'en') {
      btnEn.classList.add('active');
      btnMl.classList.remove('active');
    } else {
      btnMl.classList.add('active');
      btnEn.classList.remove('active');
    }
  }

  // Toggle visible elements according to lang
  var enElements = document.querySelectorAll('[data-lang="en"]');
  var mlElements = document.querySelectorAll('[data-lang="ml"]');

  enElements.forEach(function(el) {
    el.style.display = (lang === 'en') ? '' : 'none';
  });
  mlElements.forEach(function(el) {
    el.style.display = (lang === 'ml') ? '' : 'none';
  });

  // Also toggle any font class on the card
  var card = document.querySelector('.inv-card');
  if (card) {
    if (lang === 'ml') {
      card.classList.add('ml-mode');
    } else {
      card.classList.remove('ml-mode');
    }
  }
}

// ── CARD MODAL (View Original Physical Invitation Card) ──
function openCardModal() {
  var modal = document.getElementById('cardModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCardModal() {
  var modal = document.getElementById('cardModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// ── SAVE THE DATE ─.ICS ──
function downloadInvitationCard(e){
  if(e && typeof celebrateConfetti === 'function'){
    var target = e.currentTarget || e.target;
    var r = target && target.getBoundingClientRect ? target.getBoundingClientRect() : null;
    var cx = r ? (r.left + r.width / 2) : (window.innerWidth / 2);
    var cy = r ? (r.top + r.height / 2) : (window.innerHeight / 2);
    celebrateConfetti(cx, cy);
  }

  // Offer instant download of high-resolution original invitation or render
  var link = document.createElement('a');
  link.download = 'Athulkrishna_Akshara_Reception_Invitation.jpg';
  link.href = 'assets/reception-invitation.jpg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  var btn = document.getElementById('downloadInvitationBtn');
  if(btn){
    var orig = btn.innerHTML;
    btn.innerHTML = '&#10003; Card Downloaded!';
    btn.style.background = 'linear-gradient(135deg,#2d7a4f,#3a9e68)';
    setTimeout(function(){ btn.innerHTML = orig; btn.style.background = ''; }, 3000);
  }
}

function downloadCalendar(e){
  if(e && typeof celebrateConfetti === 'function'){
    var target = e.currentTarget || e.target;
    var r = target && target.getBoundingClientRect ? target.getBoundingClientRect() : null;
    var cx = r ? (r.left + r.width / 2) : (window.innerWidth / 2);
    var cy = r ? (r.top + r.height / 2) : (window.innerHeight / 2);
    celebrateConfetti(cx, cy);
  }

  var ics = [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Athulkrishna Akshara Reception//EN',
    'CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT',
    'UID:athulkrishna-akshara-reception-2026@invitation',
    'DTSTAMP:'+fmtICS(new Date()),
    'DTSTART;TZID=Asia/Kolkata:20261123T170000',
    'DTEND;TZID=Asia/Kolkata:20261123T210000',
    'SUMMARY:Wedding Reception of Athulkrishna & Akshara',
    'DESCRIPTION:You are cordially invited with family for the Wedding Reception of Athulkrishna & Akshara. Hosted by Mr. Unnikrishnan V & Mrs. Sunitha Unnikrishnan. Timing: 05:00 PM to 09:00 PM IST.',
    'LOCATION:Thevarcad Convention Centre\\, Nemmara Road\\, Valliyode\\, Vadakkencherry\\, Palakkad\\, Kerala 678682',
    'STATUS:CONFIRMED','TRANSP:OPAQUE',
    'BEGIN:VALARM','TRIGGER:-P1D','ACTION:DISPLAY',
    'DESCRIPTION:Wedding Reception of Athulkrishna & Akshara is tomorrow!','END:VALARM',
    'BEGIN:VALARM','TRIGGER:-PT2H','ACTION:DISPLAY',
    'DESCRIPTION:Wedding Reception of Athulkrishna & Akshara starts in 2 hours!','END:VALARM',
    'END:VEVENT','END:VCALENDAR'
  ].join('\r\n');
  var blob = new Blob([ics], { type:'text/calendar;charset=utf-8' });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a');
  a.href   = url;
  a.download = 'Athulkrishna_Akshara_Reception_23Nov2026.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  var btn = document.getElementById('saveDateBtn');
  if(btn){
    var orig = btn.innerHTML;
    btn.innerHTML = '&#10003; Downloaded!';
    btn.style.background = 'linear-gradient(135deg,#2d7a4f,#3a9e68)';
    setTimeout(function(){ btn.innerHTML = orig; btn.style.background = ''; }, 3000);
  }
}

function fmtICS(d){
  function p(n){ return String(n).padStart(2,'0'); }
  return d.getUTCFullYear()+p(d.getUTCMonth()+1)+p(d.getUTCDate())+'T'+p(d.getUTCHours())+p(d.getUTCMinutes())+p(d.getUTCSeconds())+'Z';
}

// ── WHATSAPP ──
function shareWhatsApp(){
  var msg = encodeURIComponent(
    'With immense joy, Mr. Unnikrishnan V & Mrs. Sunitha Unnikrishnan cordially invite you with family for the Wedding Reception of their son\n\n' +
    '*ATHULKRISHNA* With *AKSHARA*\n' +
    '(D/o Sri. Sivadas N & Smt. Shereena)\n\n' +
    '🎉 *WEDDING RECEPTION PARTY*\n' +
    '📅 Date: Monday, 23rd November 2026\n' +
    '⏰ Time: 05:00 PM – 09:00 PM IST\n' +
    '📍 Venue: Thevarcad Convention Centre, Valliyode, Palakkad\n\n' +
    '💍 Marriage Solemnisation: Sunday, 22nd Nov 2026 at R.K. Mahal Kalyanamandapam, Annur Road, Mettupalayam.\n\n' +
    '✨ View Invitation, Venue Location & Save the Date:\n' +
    window.location.href
  );
  window.open('https://wa.me/?text='+msg,'_blank','noopener,noreferrer');
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', function(){
  document.body.style.overflow = 'hidden';

  // Modal backdrop click
  var modal = document.getElementById('cardModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeCardModal();
      }
    });
  }

  // Escape key closes modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeCardModal();
    }
  });

  // Default to English
  setLanguage('en');
});

window.setLanguage          = setLanguage;
window.openCardModal        = openCardModal;
window.closeCardModal       = closeCardModal;
window.downloadCalendar     = downloadCalendar;
window.downloadInvitationCard = downloadInvitationCard;
window.shareWhatsApp        = shareWhatsApp;
window.celebrateConfetti    = celebrateConfetti;
