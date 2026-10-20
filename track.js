/* Brew & Boba: tracking setup
   1. Paste your Meta Pixel ID below (leave empty to only log events to the console).
   2. Optional: paste your GTM container ID; every event is also pushed to window.dataLayer. */
var META_PIXEL_ID = '';   // e.g. '123456789012345'
var GTM_ID = '';          // e.g. 'GTM-XXXXXXX'

window.dataLayer = window.dataLayer || [];

// Custom header code saved from the site editor (admin.html), e.g. a pasted Meta Pixel snippet.
// Stored in this browser only, so it is injected into <head> on every page load.
var CUSTOM_HEAD = '';
try { CUSTOM_HEAD = localStorage.getItem('bb_head_code') || ''; } catch (e) {}
if (CUSTOM_HEAD && location.pathname.indexOf('admin') === -1) {
  var box = document.createElement('div');
  box.innerHTML = CUSTOM_HEAD;
  Array.prototype.forEach.call(box.childNodes, function (node) {
    if (node.nodeName === 'SCRIPT') {
      var s = document.createElement('script');
      Array.prototype.forEach.call(node.attributes, function (a) { s.setAttribute(a.name, a.value); });
      s.text = node.textContent;
      document.head.appendChild(s);   // inline scripts run immediately
    } else if (node.nodeType === 1 && node.nodeName !== 'NOSCRIPT') {
      document.head.appendChild(node.cloneNode(true));
    }
  });
}

if (META_PIXEL_ID) {
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', META_PIXEL_ID);
}
if (GTM_ID) {
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;
  j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',GTM_ID);
}

// Standard events (PageView, ViewContent, AddToCart, InitiateCheckout, Purchase) use fbq('track');
// anything else is sent as a custom event via fbq('trackCustom').
var STANDARD = ['PageView','ViewContent','AddToCart','InitiateCheckout','AddPaymentInfo','Purchase','Lead','Contact'];
function track(name, params) {
  params = params || {};
  window.dataLayer.push(Object.assign({ event: name }, params));
  // A pasted pixel snippet already sends its own PageView, so don't send a second one.
  if (window.fbq && !(name === 'PageView' && CUSTOM_HEAD)) fbq(STANDARD.indexOf(name) > -1 ? 'track' : 'trackCustom', name, params);
  console.log('%c[track] ' + name, 'color:#b07a4a;font-weight:bold', params);
}

track('PageView', { page: location.pathname.split('/').pop() || 'index.html' });

// Any element with data-track="Label" fires a ButtonClick event.
document.addEventListener('click', function (e) {
  var el = e.target.closest('[data-track]');
  if (el) track('ButtonClick', { label: el.dataset.track, page: location.pathname.split('/').pop() || 'index.html' });
});
