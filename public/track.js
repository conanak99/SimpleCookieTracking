// Add iFrame to set cookie
const localStorage = window.localStorage;
if (!localStorage.getItem('iframe')) {
  var iframe = document.createElement('iframe');
  iframe.style.display = "none";
  iframe.src = "https://sleepy-fuel.glitch.me";
  document.body.appendChild(iframe);
  localStorage.setItem('iframe', 1);
}

setTimeout(() => {
  fetch('https://sleepy-fuel.glitch.me/logWrite', {
        method: 'GET',
        credentials: 'include'
  });
}, 1000);

