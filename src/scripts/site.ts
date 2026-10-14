/**
 * Interactividad del sitio. Todo funciona por delegación de eventos sobre
 * `document`, así sigue funcionando cuando el editor visual de Tina
 * reemplaza una región de la página.
 */

/* ───────── Pestañas y selectores (data-switch) ───────── */
function activate(group: Element, index: number) {
  group.querySelectorAll<HTMLElement>('[data-switch-to]').forEach((el) => {
    const on = Number(el.dataset.switchTo) === index;
    el.classList.toggle('is-active', on);
    if (el.hasAttribute('aria-selected')) el.setAttribute('aria-selected', String(on));
    if (el.hasAttribute('aria-pressed')) el.setAttribute('aria-pressed', String(on));
  });
  group.querySelectorAll<HTMLElement>('[data-switch-item]').forEach((el) => {
    el.classList.toggle('is-active', Number(el.dataset.switchItem) === index);
  });
}

document.addEventListener('click', (e) => {
  const t = e.target as HTMLElement;

  const to = t.closest<HTMLElement>('[data-switch-to]');
  if (to) {
    const group = to.closest('[data-switch]');
    if (group) activate(group, Number(to.dataset.switchTo));
    return;
  }

  const step = t.closest<HTMLElement>('[data-switch-step]');
  if (step) {
    const group = step.closest('[data-switch]');
    if (!group) return;
    const triggers = [...group.querySelectorAll<HTMLElement>('[data-switch-to]')];
    const current = triggers.findIndex((el) => el.classList.contains('is-active'));
    const n = triggers.length;
    activate(group, (current + Number(step.dataset.switchStep) + n) % n);
    return;
  }

  /* Filtro de categorías del blog */
  const filter = t.closest<HTMLElement>('[data-filter]');
  if (filter) {
    const group = filter.closest('[data-filter-group]');
    if (!group) return;
    const cat = filter.dataset.filter ?? '';
    group.querySelectorAll<HTMLElement>('[data-filter]').forEach((b) => {
      const on = b === filter;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    group.querySelectorAll<HTMLElement>('[data-cat]').forEach((card) => {
      card.hidden = Boolean(cat) && card.dataset.cat !== cat;
    });
    return;
  }

  /* Reproductor de audio */
  const playBtn = t.closest<HTMLElement>('.player__btn');
  if (playBtn) {
    const player = playBtn.closest<HTMLElement>('[data-audio]');
    const audio = player?.querySelector('audio');
    if (!player || !audio) return;
    document.querySelectorAll('[data-audio] audio').forEach((a) => {
      if (a !== audio) (a as HTMLAudioElement).pause();
    });
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }
});

/* Estado visual del reproductor */
function syncPlayer(audio: HTMLAudioElement) {
  const player = audio.closest<HTMLElement>('[data-audio]');
  if (!player) return;
  const playing = !audio.paused;
  player.classList.toggle('is-playing', playing);
  player.querySelector('.player__btn')?.setAttribute('aria-label', playing ? 'Pausar episodio' : 'Reproducir episodio');
  const status = player.querySelector('.player__status');
  if (status) status.textContent = playing ? 'Reproduciendo' : audio.currentTime > 0 ? 'En pausa' : 'Escuchar episodio';
  const fill = player.querySelector<HTMLElement>('.player__fill');
  if (fill && audio.duration) fill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
  const time = player.querySelector('.player__time');
  if (time && audio.duration && audio.currentTime > 0) {
    const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    time.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
  }
}
['play', 'pause', 'timeupdate', 'ended'].forEach((ev) =>
  document.addEventListener(ev, (e) => {
    if (e.target instanceof HTMLAudioElement) syncPlayer(e.target);
  }, true),
);

/* ───────── Envío a un webhook (opcional) ───────── */
async function sendTo(url: string, payload: unknown) {
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    /* Sin conexión o URL inválida: no bloquea al visitante. */
  }
}

/* Formulario "Pregúntale al doctor" */
document.addEventListener('submit', async (e) => {
  const form = (e.target as HTMLElement).closest<HTMLFormElement>('[data-ask-form]');
  if (!form) return;
  e.preventDefault();
  const field = form.querySelector('textarea');
  const status = form.querySelector('[data-ask-status]');
  const question = field?.value.trim();
  if (!question) return;
  await sendTo(form.dataset.webhook ?? '', { tipo: 'pregunta-blog', pregunta: question, fecha: new Date().toISOString() });
  if (status) status.textContent = form.dataset.thanks || 'Recibida, gracias.';
  form.reset();
});

/* ───────── Cuestionario tarjeta por tarjeta ───────── */
type Option = { value: string; label: string; sub: string; exclusive: boolean; alarm: boolean; tf: string };
type Question = { key: string; title: string; hint: string; multiple: boolean; tf: { title: string; hint: string }; options: Option[] };
type Result = {
  motivo: string; title: string; body: string; guideName: string; guideFile: string;
  planName: string; planWhy: string; planHref: string; tf: { title: string; body: string };
};
type QuizConfig = {
  questions: Question[];
  contact: { eyebrow: string; title: string; body: string; consent: string; submitLabel: string; helper: string; webhookUrl: string; tf: Record<string, string> };
  results: Result[];
  longCase: { planName: string; planWhy: string };
  insights: { question: string; value: string; text: string }[];
  fallbackInsight: string;
  ui: Record<string, string>;
};

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const tfAttr = (id?: string) => (id ? ` data-tina-field="${esc(id)}"` : '');
const CHECK = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#0F1824" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
const BACK = '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
const TICK = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#FFB700" fill-opacity=".25"></circle><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#9A6500" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

function initQuiz(root: HTMLElement) {
  root.dataset.ready = '1';
  const cfgEl = root.querySelector('[data-quiz-config]');
  if (!cfgEl) return;
  const cfg: QuizConfig = JSON.parse(cfgEl.textContent || '{}');
  const Q = cfg.questions;
  const total = Q.length + 1;
  const stage = root.querySelector<HTMLElement>('[data-quiz-stage]')!;
  const introHTML = stage.innerHTML;
  const s = {
    phase: 'intro' as 'intro' | 'q' | 'data' | 'result',
    i: 0,
    ans: {} as Record<string, string | string[]>,
    name: '', phone: '', email: '', consent: false,
  };
  let timer: number | undefined;

  const progress = () => {
    const idx = s.phase === 'intro' ? 0 : s.phase === 'q' ? s.i + 1 : total;
    const pct = Math.round((idx / total) * 100);
    const label = s.phase === 'intro' ? 'Inicio' : s.phase === 'result' ? 'Listo' : `Paso ${idx} de ${total}`;
    root.querySelector('[data-quiz-step]')!.textContent = label;
    root.querySelector('[data-quiz-pct]')!.textContent = `${pct}%`;
    root.querySelector<HTMLElement>('[data-quiz-fill]')!.style.width = `${pct}%`;
  };

  const selectedOf = (q: Question): string[] => {
    const v = s.ans[q.key];
    return Array.isArray(v) ? v : v ? [v] : [];
  };

  const labelFor = (q: Question, value: string) => q.options.find((o) => o.value === value)?.label ?? value;

  const compute = () => {
    const motivo = String(s.ans.motivo ?? cfg.results[0]?.motivo ?? '');
    const res = cfg.results.find((r) => r.motivo === motivo) ?? cfg.results[0];
    const alarm = Q.some((q) => selectedOf(q).some((v) => q.options.find((o) => o.value === v)?.alarm));
    const insights: string[] = [];
    for (const rule of cfg.insights) {
      const q = Q.find((x) => x.key === rule.question);
      if (q && selectedOf(q).includes(rule.value) && !insights.includes(rule.text)) insights.push(rule.text);
    }
    if (!insights.length && cfg.fallbackInsight) insights.push(cfg.fallbackInsight);
    const long = s.ans.tiempo === 't3' || s.ans.tiempo === 't4';
    const useLong = long && motivo !== 'bariatrico' && cfg.longCase.planName;
    return {
      motivo, res, alarm,
      insights: insights.slice(0, 3),
      planName: useLong ? cfg.longCase.planName : res?.planName ?? '',
      planWhy: useLong ? cfg.longCase.planWhy : res?.planWhy ?? '',
    };
  };

  const render = () => {
    progress();
    if (s.phase === 'intro') {
      stage.innerHTML = introHTML;
      return;
    }
    if (s.phase === 'q') {
      const q = Q[s.i];
      const sel = selectedOf(q);
      stage.innerHTML = `
        <div class="qcard qcard--in" role="group" aria-labelledby="q-title">
          <div class="qcard__top">
            <button type="button" class="back" data-q="back">${BACK}Atrás</button>
            <p class="eyebrow">Pregunta ${s.i + 1} de ${Q.length}</p>
          </div>
          <h2 class="q" id="q-title" tabindex="-1"${tfAttr(q.tf.title)}>${esc(q.title)}</h2>
          ${q.hint ? `<p class="q-sub"${tfAttr(q.tf.hint)}>${esc(q.hint)}</p>` : ''}
          <div class="opts">
            ${q.options.map((o) => {
              const on = sel.includes(o.value);
              return `<button type="button" class="opt${on ? ' is-on' : ''}" aria-pressed="${on}" data-q="opt" data-value="${esc(o.value)}"${tfAttr(o.tf)}>
                <span class="opt__mark${q.multiple ? ' opt__mark--sq' : ''}">${on ? CHECK : ''}</span>
                <span class="opt__copy"><span class="opt__label">${esc(o.label)}</span>${o.sub ? `<span class="opt__sub">${esc(o.sub)}</span>` : ''}</span>
              </button>`;
            }).join('')}
          </div>
          ${q.multiple ? `<div class="qcard__foot"><span class="small">Puedes elegir varias.</span>
            <button type="button" class="btn btn--dark" data-q="next" ${sel.length ? '' : 'disabled'}>Continuar</button></div>` : ''}
        </div>`;
      stage.querySelector<HTMLElement>('#q-title')?.focus({ preventScroll: true });
      return;
    }
    if (s.phase === 'data') {
      const c = cfg.contact;
      const ok = Boolean(s.name.trim()) && Boolean(s.phone.trim() || s.email.trim()) && s.consent;
      stage.innerHTML = `
        <form class="qcard qcard--in" data-q="form" novalidate>
          <div class="qcard__top">
            <button type="button" class="back" data-q="back">${BACK}Atrás</button>
            <p class="eyebrow">${esc(c.eyebrow)}</p>
          </div>
          <h2 class="q" id="q-title" tabindex="-1"${tfAttr(c.tf.title)}>${esc(c.title)}</h2>
          <p class="q-sub"${tfAttr(c.tf.body)}>${esc(c.body)}</p>
          <div class="stack-8"><label class="label" for="qz-name">Nombre</label>
            <input id="qz-name" class="field" name="name" autocomplete="given-name" placeholder="¿Cómo te llamas?" value="${esc(s.name)}"></div>
          <div class="grid grid--240 grid--tight">
            <div class="stack-8"><label class="label" for="qz-phone">WhatsApp</label>
              <input id="qz-phone" class="field" name="phone" type="tel" autocomplete="tel" placeholder="300 000 0000" value="${esc(s.phone)}"></div>
            <div class="stack-8"><label class="label" for="qz-email">Correo</label>
              <input id="qz-email" class="field" name="email" type="email" autocomplete="email" placeholder="tu@correo.com" value="${esc(s.email)}"></div>
          </div>
          <label class="consent"><input type="checkbox" name="consent" ${s.consent ? 'checked' : ''}><span${tfAttr(c.tf.consent)}>${esc(c.consent)}</span></label>
          <button type="submit" class="btn btn--dark btn--start" data-q="submit" ${ok ? '' : 'disabled'}>${esc(c.submitLabel)}</button>
          <p class="small">${esc(c.helper)}</p>
        </form>`;
      stage.querySelector<HTMLElement>('#q-title')?.focus({ preventScroll: true });
      return;
    }
    /* Resultado */
    const r = compute();
    const ui = cfg.ui;
    const first = s.name.trim().split(/\s+/)[0];
    const contact = s.phone.trim() ? `WhatsApp ${s.phone.trim()}` : s.email.trim();
    const res = r.res;
    stage.innerHTML = `
      <div class="qcard qcard--in">
        ${r.alarm ? `<div class="alert" role="alert"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24"><path d="M12 3l10 18H2z" fill="none" stroke="#A1271B" stroke-width="2" stroke-linejoin="round"></path><path d="M12 10v5M12 18v.5" stroke="#A1271B" stroke-width="2" stroke-linecap="round"></path></svg><p>${esc(ui.alarm)}</p></div>` : ''}
        <p class="eyebrow">${esc(ui.eyebrow)}</p>
        <h2 class="q" id="q-title" tabindex="-1"${tfAttr(res?.tf.title)}>${esc((first ? first + ', ' : '') + (res?.title ?? ''))}</h2>
        <p class="q-sub q-sub--dark"${tfAttr(res?.tf.body)}>${esc(res?.body)}</p>
        <div class="stack-10">${r.insights.map((t) => `<div class="insight">${TICK}<span>${esc(t)}</span></div>`).join('')}</div>
        <div class="grid grid--240 grid--tight">
          <div class="result-card result-card--navy">
            <span class="result-card__label">${esc(ui.guideLabel)}</span>
            <span class="result-card__title">${esc(res?.guideName)}</span>
            <span class="result-card__meta">${contact ? `Enviada a ${esc(contact)}` : 'Lista para enviar'}</span>
            ${res?.guideFile ? `<a class="more more--yellow" href="${esc(res.guideFile)}" target="_blank" rel="noopener">Descargar ahora ›</a>` : ''}
          </div>
          <div class="result-card result-card--cream">
            <span class="result-card__label result-card__label--dark">${esc(ui.planLabel)}</span>
            <span class="result-card__title result-card__title--dark">${esc(r.planName)}</span>
            <span class="result-card__meta result-card__meta--dark">${esc(r.planWhy)}</span>
          </div>
        </div>
        <div class="actions">
          <a class="btn btn--yellow" href="${esc(ui.primaryHref)}">${esc(ui.primaryLabel)}</a>
          <a class="btn btn--ghost" href="${esc(res?.planHref ?? '/servicios')}">${esc(ui.detailsLabel)}</a>
          <button type="button" class="back back--end" data-q="restart">${esc(ui.restartLabel)}</button>
        </div>
        <p class="small">${esc(ui.disclaimer)}</p>
      </div>`;
    stage.querySelector<HTMLElement>('#q-title')?.focus({ preventScroll: true });
  };

  const advance = () => {
    if (s.i < Q.length - 1) s.i += 1;
    else s.phase = 'data';
    render();
  };

  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('[data-quiz-start]')) {
      s.phase = 'q'; s.i = 0; render(); return;
    }
    const act = t.closest<HTMLElement>('[data-q]');
    if (!act) return;
    const kind = act.dataset.q;
    if (kind === 'back') {
      if (s.phase === 'data') { s.phase = 'q'; s.i = Q.length - 1; }
      else if (s.i === 0) s.phase = 'intro';
      else s.i -= 1;
      render();
    } else if (kind === 'next') {
      advance();
    } else if (kind === 'restart') {
      Object.assign(s, { phase: 'intro', i: 0, ans: {}, consent: false });
      render();
    } else if (kind === 'opt') {
      const q = Q[s.i];
      const value = act.dataset.value ?? '';
      const opt = q.options.find((o) => o.value === value);
      if (q.multiple) {
        let sel = selectedOf(q);
        if (sel.includes(value)) sel = sel.filter((v) => v !== value);
        else if (opt?.exclusive) sel = [value];
        else sel = sel.filter((v) => !q.options.find((o) => o.value === v)?.exclusive).concat(value);
        s.ans[q.key] = sel;
        render();
      } else {
        s.ans[q.key] = value;
        render();
        window.clearTimeout(timer);
        timer = window.setTimeout(advance, 280);
      }
    }
  });

  const onField = (e: Event) => {
    const el = e.target as HTMLInputElement;
    if (s.phase !== 'data' || !el.name) return;
    if (el.name === 'consent') s.consent = el.checked;
    else if (el.name === 'name' || el.name === 'phone' || el.name === 'email') s[el.name] = el.value;
    const ok = Boolean(s.name.trim()) && Boolean(s.phone.trim() || s.email.trim()) && s.consent;
    const btn = root.querySelector<HTMLButtonElement>('[data-q="submit"]');
    if (btn) btn.disabled = !ok;
  };
  root.addEventListener('input', onField);
  root.addEventListener('change', onField);

  root.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = Boolean(s.name.trim()) && Boolean(s.phone.trim() || s.email.trim()) && s.consent;
    if (!ok) return;
    const r = compute();
    const respuestas: Record<string, string> = {};
    for (const q of Q) respuestas[q.title] = selectedOf(q).map((v) => labelFor(q, v)).join(', ');
    sendTo(cfg.contact.webhookUrl, {
      tipo: 'cuestionario',
      nombre: s.name.trim(),
      whatsapp: s.phone.trim(),
      correo: s.email.trim(),
      autorizaDatos: s.consent,
      motivo: r.motivo,
      guia: r.res?.guideName,
      planSugerido: r.planName,
      senalesDeAlarma: r.alarm,
      respuestas,
      fecha: new Date().toISOString(),
    });
    s.phase = 'result';
    render();
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  render();
}

function bootQuizzes() {
  document.querySelectorAll<HTMLElement>('[data-quiz]:not([data-ready])').forEach(initQuiz);
}
bootQuizzes();
/* Si el editor de Tina reemplaza el cuestionario, se vuelve a iniciar. */
new MutationObserver(bootQuizzes).observe(document.body, { childList: true, subtree: true });

/* Menú móvil */
document.addEventListener('click', (e) => {
  const t = e.target as HTMLElement;
  const toggle = t.closest<HTMLElement>('[data-nav-toggle]');
  const nav = document.querySelector<HTMLElement>('.nav');
  if (!nav) return;
  if (toggle) {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  } else if (t.closest('.nav__links a') || !t.closest('.nav')) {
    nav.classList.remove('is-open');
    nav.querySelector('[data-nav-toggle]')?.setAttribute('aria-expanded', 'false');
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.querySelector('.nav')?.classList.remove('is-open');
});
