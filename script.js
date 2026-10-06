const OPENING = {
  businessName: "مركز مدى",
  businessType: "مركز طبي",
  openingTitle: "وصلنا إلى عنواننا الجديد",
  tagline: "رعاية أقرب، ومساحة صُممت لراحتكم",
  startAt: "2027-04-22T17:00:00+03:00",
  endAt: "2027-04-22T21:00:00+03:00",
  timeZone: "Asia/Riyadh",
  venue: "مركز مدى الطبي",
  address: "شارع الأمير سلطان، حي الروضة",
  city: "جدة",
  country: "المملكة العربية السعودية",
  mapsUrl: "",
  websiteUrl: "",
  instagramUrl: "",
  whatsappUrl: "",
  shareUrl: "",
  guestName: ""
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function bindOpeningData() {
  $$('[data-bind]').forEach(el => { el.textContent = OPENING[el.dataset.bind] || ''; });
  const start = new Date(OPENING.startAt);
  $('[data-date]').textContent = new Intl.DateTimeFormat('ar-SA', {weekday:'long', day:'numeric', month:'long', year:'numeric', timeZone:OPENING.timeZone}).format(start);
  $('[data-time]').textContent = new Intl.DateTimeFormat('ar-SA', {hour:'numeric', minute:'2-digit', timeZone:OPENING.timeZone}).format(start);
  $('[data-year]').textContent = new Intl.DateTimeFormat('ar-SA', {year:'numeric'}).format(start);
  const guest = $('[data-guest]');
  if (OPENING.guestName.trim()) { guest.textContent = 'ضيفنا الكريم ' + OPENING.guestName; guest.hidden = false; }
}

function updateCountdown() {
  const now = Date.now(), start = new Date(OPENING.startAt).getTime(), end = new Date(OPENING.endAt).getTime();
  const remaining = Math.max(0, start - now);
  const values = {days:Math.floor(remaining/86400000),hours:Math.floor(remaining/3600000)%24,minutes:Math.floor(remaining/60000)%60,seconds:Math.floor(remaining/1000)%60};
  Object.entries(values).forEach(([key,value]) => { const el = document.querySelector('[data-unit="'+key+'"]'); if(el) el.textContent = String(value).padStart(2,'0'); });
  const status = $('[data-count-status]');
  if (now >= end) status.textContent = 'تم الافتتاح — أهلًا بكم دائمًا'; else if (now >= start) status.textContent = 'الافتتاح قائم الآن — ننتظركم'; else status.textContent = 'نترقّب حضوركم';
  const main = $('[data-status-main]'), arabic = $('[data-status-ar]');
  if(main){ const opened=now>=start; main.textContent=opened?'NOW OPEN':'OPENING SOON'; arabic.textContent=opened?'الآن مفتوح':'الافتتاح قريبًا'; }
}

function mapUrl() {
  if (OPENING.mapsUrl.trim()) return OPENING.mapsUrl;
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent([OPENING.venue,OPENING.address,OPENING.city,OPENING.country].filter(Boolean).join('، '));
}

function icsDate(value) { return new Date(value).toISOString().replace(/[-:]/g,'').replace(/.d{3}/,''); }
function downloadCalendar() {
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Opening Invitation//AR','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:'+Date.now()+'@opening-invitation','DTSTAMP:'+icsDate(new Date()),'DTSTART:'+icsDate(OPENING.startAt),'DTEND:'+icsDate(OPENING.endAt),'SUMMARY:'+OPENING.openingTitle+' — '+OPENING.businessName,'DESCRIPTION:'+OPENING.tagline,'LOCATION:'+OPENING.venue+'، '+OPENING.address+'، '+OPENING.city,'URL:'+mapUrl(),'END:VEVENT','END:VCALENDAR'];
  const blob=new Blob(['﻿'+lines.join('\r\n')],{type:'text/calendar;charset=utf-8'}), a=document.createElement('a');
  a.href=URL.createObjectURL(blob); a.download='افتتاح-'+OPENING.businessName+'.ics'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),500);
}

async function shareInvitation() {
  const url=OPENING.shareUrl.trim() || location.href, data={title:OPENING.openingTitle+' — '+OPENING.businessName,text:OPENING.tagline,url};
  try { if(navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(url); showToast('تم نسخ رابط الدعوة'); } } catch(error) { if(error.name!=='AbortError') showToast('تعذّرت المشاركة، انسخ الرابط من المتصفح'); }
}
function showToast(message){const toast=$('[data-toast]');toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2600)}
function loadOptionalImages(){ $$('[data-image]').forEach(slot=>{const img=new Image();img.onload=()=>{slot.style.backgroundImage='linear-gradient(0deg,rgba(0,0,0,.25),transparent),url("'+img.src+'")';slot.classList.add('has-image')};img.src=slot.dataset.image;}); }
function revealOnScroll(){ if(matchMedia('(prefers-reduced-motion: reduce)').matches){$$('.reveal').forEach(el=>el.classList.add('in'));return} const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});$$('.reveal').forEach(el=>io.observe(el)); }
function enhanceSignature(){
  if(window.gsap && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    
  }
}

document.addEventListener('DOMContentLoaded',()=>{bindOpeningData();updateCountdown();setInterval(updateCountdown,1000);$('[data-maps]').href=mapUrl();$('[data-calendar]').addEventListener('click',downloadCalendar);$('[data-share]').addEventListener('click',shareInvitation);loadOptionalImages();revealOnScroll();enhanceSignature();});
