// Ask Holon: sends the question to POST /ask and shows the answer in the thread.
// The answer HTML is rendered (and escaped) on the server.
(function () {
  var form = document.getElementById('ask-form');
  if (!form) return;
  var box = document.getElementById('question');
  var thread = document.getElementById('thread');
  var status = document.getElementById('ask-status');
  var newBtn = document.getElementById('new-session');
  var sessionId = null;
  try { sessionId = sessionStorage.getItem('holonSession'); } catch (e) { /* storage unavailable */ }
  var busy = false;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function remember(id) {
    sessionId = id;
    try { if (id) sessionStorage.setItem('holonSession', id); else sessionStorage.removeItem('holonSession'); } catch (e) { /* ignore */ }
    newBtn.hidden = !id;
  }
  newBtn.hidden = !sessionId;

  function shareButton(id) {
    var b = el('button', 'secondary', 'Share this question with the commons');
    b.type = 'button';
    b.addEventListener('click', function () {
      b.disabled = true;
      fetch('/ask/share', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: id }) })
        .then(function (r) { return r.json(); })
        .then(function (d) { b.textContent = d.ok ? 'Shared. Thank you.' : 'Could not share'; });
    });
    return b;
  }

  function askQuestion(text) {
    if (busy || !text.trim()) return;
    busy = true;
    thread.appendChild(el('div', 'turn-q', text));
    var pending = el('div', 'turn-a');
    pending.appendChild(el('p', 'who-label', 'Holon (the commons’ AI agent)'));
    pending.appendChild(el('p', 'thinking', 'Searching the commons…'));
    thread.appendChild(pending);
    pending.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    status.textContent = '';
    box.value = '';

    fetch('/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: text, sessionId: sessionId }) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        pending.innerHTML = '';
        if (!res.ok) {
          pending.className = 'turn-a error';
          pending.textContent = res.d.error || 'Something went wrong.';
          return;
        }
        remember(res.d.sessionId);
        pending.appendChild(el('p', 'who-label', 'Holon (the commons’ AI agent)'));
        var body = el('div', 'answer');
        body.innerHTML = res.d.html; // server-rendered and escaped
        pending.appendChild(body);
        var meta = el('p', 'meta-line', res.d.meta + ' · ' + res.d.cited.entries.length + ' entries cited');
        pending.appendChild(meta);
        if (res.d.gaps > 0 && res.d.sessionId) {
          var note = el('p', 'muted', 'Holon recorded what the commons is missing for this question (not your words). You can also share the question itself:');
          pending.appendChild(note);
          pending.appendChild(shareButton(res.d.sessionId));
        }
      })
      .catch(function () {
        pending.className = 'turn-a error';
        pending.textContent = 'Could not reach Holon. Check your connection and try again.';
      })
      .finally(function () { busy = false; box.focus(); });
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); askQuestion(box.value); });
  box.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); askQuestion(box.value); }
  });
  Array.prototype.forEach.call(document.querySelectorAll('button.example'), function (b) {
    b.addEventListener('click', function () { askQuestion(b.getAttribute('data-q')); });
  });
  newBtn.addEventListener('click', function () { remember(null); thread.innerHTML = ''; box.focus(); });
})();
