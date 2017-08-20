// Add iFrame to set cookie
var iframe = document.createElement('iframe');
iframe.style.display = "none";
iframe.src = "https://sleepy-fuel.glitch.me";
document.body.appendChild(iframe);

setTimeout(() => {
  fetch('https://sleepy-fuel.glitch.me/logWrite', {
        method: 'GET',
        credentials: 'include'
  });
}, 1000);

