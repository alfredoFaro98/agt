// Interfaccia del quiz: selezione, svolgimento, risultato e memoria degli errori.
(function () {
  "use strict";
  const Q = window.QUIZ;
  const $ = (s) => document.querySelector(s);
  const PDF = "https://github.com/alfredoFaro98/agt/blob/main/documentazione/pdf/";
  const K_ERR = "agt-quiz-errori-v1", K_RIS = "agt-quiz-risultati-v1", K_PREF = "agt-quiz-preferenze-v1";

  const memoria = {
    leggi(k, def) {
      try {
        const v = localStorage.getItem(k);
        return v ? JSON.parse(v) : def;
      } catch (e) {
        return def;
      }
    },
    scrivi(k, v) {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch (e) { /* memoria non disponibile: il quiz funziona lo stesso */ }
    },
  };

  const pref = memoria.leggi(K_PREF, {});
  const stato = {
    scelte: new Set(pref.scelte && pref.scelte.length ? pref.scelte : [Q.lezioni[0].numero]),
    modo: "completo",
    n: { rapido: pref.nRapido || 20, calcolo: pref.nCalcolo || 10 },
  };
  let sessione = null;

  const lezione = (n) => Q.lezioni.find((l) => l.numero === n);
  const seme = () => (Math.random() * 4294967296) >>> 0;
  const generatore = (id) => {
    for (const l of Q.lezioni) for (const g of l.generatori || []) if (g.id === id) return g;
    return null;
  };
  const domandaFissa = (id) => {
    for (const l of Q.lezioni) for (const d of l.domande) if (d.id === id) return d;
    return null;
  };

  function istanza(g) {
    const d = g.crea(Q.rng(seme()));
    return Object.assign(d, { lezione: g.lezione, sez: d.sez || g.sez, id: g.id, generata: true });
  }

  // Mescola le opzioni e riallinea gli indici giusti.
  function prepara(d) {
    const p = Object.assign({}, d);
    if ((d.tipo === "scelta" || d.tipo === "multi") && !d.ordine) {
      const perm = Q.rng(seme()).shuffle(d.o.map((_, i) => i));
      p.o = perm.map((i) => d.o[i]);
      p.ok = d.tipo === "scelta" ? perm.indexOf(d.ok) : d.ok.map((k) => perm.indexOf(k)).sort((a, b) => a - b);
    }
    return p;
  }

  // ------------------------------------------------------------ costruzione del quiz
  function lezioniScelte() {
    return Q.lezioni.filter((l) => stato.scelte.has(l.numero));
  }

  function erroriSalvati() {
    const err = memoria.leggi(K_ERR, {});
    return Object.keys(err).filter((id) => stato.scelte.has(err[id].lezione));
  }

  function costruisci(modo) {
    const lez = lezioniScelte();
    const r = Q.rng(seme());
    if (modo === "completo") {
      const out = [];
      lez.forEach((l) => {
        Object.keys(l.sezioni).forEach((s) => {
          l.domande.filter((d) => d.sez === s).forEach((d) => out.push(d));
          (l.generatori || []).filter((g) => g.sez === s).forEach((g) => out.push(istanza(g)));
        });
      });
      return out;
    }
    if (modo === "rapido") {
      const pool = [];
      lez.forEach((l) => {
        l.domande.forEach((d) => pool.push(() => d));
        (l.generatori || []).forEach((g) => pool.push(() => istanza(g)));
      });
      return r.shuffle(pool).slice(0, stato.n.rapido).map((f) => f());
    }
    if (modo === "calcolo") {
      const gens = [];
      lez.forEach((l) => (l.generatori || []).forEach((g) => gens.push(g)));
      const out = [];
      let giro = r.shuffle(gens);
      while (out.length < stato.n.calcolo && gens.length) {
        if (!giro.length) giro = r.shuffle(gens);
        out.push(istanza(giro.pop()));
      }
      return out;
    }
    // errori
    return r.shuffle(erroriSalvati()).map((id) => {
      const g = generatore(id);
      return g ? istanza(g) : domandaFissa(id);
    }).filter(Boolean);
  }

  // ------------------------------------------------------------ home
  function contaDomande(l) {
    return l.domande.length + " domande · " + (l.generatori || []).length + " esercizi generati";
  }

  function disegnaHome() {
    const ris = memoria.leggi(K_RIS, {});
    const box = $("#lezioni");
    box.innerHTML = "";
    Q.lezioni.forEach((l) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "lez";
      b.id = "lez-" + l.numero;
      b.setAttribute("aria-pressed", stato.scelte.has(l.numero) ? "true" : "false");
      const u = ris[l.numero];
      b.innerHTML =
        '<span class="num"><span>LEZIONE ' + l.numero + '</span><span class="spunta">✓</span></span>' +
        '<span class="tit">' + l.titolo + "</span>" +
        '<span class="info">' + contaDomande(l) + "</span>" +
        '<span class="ultimo">' + (u ? "Ultimo: " + u.perc + "% (" + u.modo + ", " + u.data + ")" : "Non ancora svolta") + "</span>";
      b.addEventListener("click", () => {
        if (stato.scelte.has(l.numero) && stato.scelte.size > 1) stato.scelte.delete(l.numero);
        else stato.scelte.add(l.numero);
        salvaPref();
        disegnaHome();
      });
      box.appendChild(b);
    });
    $("#tutte").textContent = stato.scelte.size === Q.lezioni.length ? "Solo la prima" : "Seleziona tutte";

    document.querySelectorAll(".quanti").forEach((el) => {
      const per = el.dataset.per;
      el.innerHTML = "";
      [10, 20, 30].forEach((n) => {
        const b = document.createElement("button");
        b.type = "button";
        b.id = "n-" + per + "-" + n;
        b.textContent = n;
        b.setAttribute("aria-pressed", stato.n[per] === n ? "true" : "false");
        b.addEventListener("click", (ev) => {
          ev.preventDefault();
          stato.n[per] = n;
          stato.modo = per;
          $("#modo-" + per).checked = true;
          salvaPref();
          disegnaHome();
        });
        el.appendChild(b);
      });
    });

    const nErr = erroriSalvati().length;
    $("#modo-errori").disabled = nErr === 0;
    $("#errori-info").textContent = nErr
      ? nErr + (nErr === 1 ? " domanda sbagliata" : " domande sbagliate") + " nei quiz precedenti, nelle lezioni scelte."
      : "Nessun errore salvato per le lezioni scelte.";
    if (stato.modo === "errori" && nErr === 0) stato.modo = "completo";
    $("#modo-" + stato.modo).checked = true;

    const lez = lezioniScelte();
    let n;
    if (stato.modo === "completo") n = lez.reduce((s, l) => s + l.domande.length + (l.generatori || []).length, 0);
    else if (stato.modo === "rapido") n = Math.min(stato.n.rapido, lez.reduce((s, l) => s + l.domande.length + (l.generatori || []).length, 0));
    else if (stato.modo === "calcolo") n = lez.some((l) => (l.generatori || []).length) ? stato.n.calcolo : 0;
    else n = nErr;
    $("#inizia").textContent = n ? "Inizia · " + n + " domande" : "Inizia";
    $("#inizia").disabled = n === 0;
    $("#inizia-nota").textContent = lez.map((l) => "L" + l.numero).join(", ");
  }

  function salvaPref() {
    memoria.scrivi(K_PREF, { scelte: [...stato.scelte], nRapido: stato.n.rapido, nCalcolo: stato.n.calcolo });
  }

  // ------------------------------------------------------------ svolgimento
  function avvia(modo, domande) {
    sessione = { modo, domande: domande.map(prepara), i: 0, risposte: [] };
    if (!sessione.domande.length) return;
    mostra("quiz");
    disegnaDomanda();
  }

  function mostra(vista) {
    ["home", "quiz", "risultato"].forEach((v) => ($("#" + v).hidden = v !== vista));
    window.scrollTo(0, 0);
  }

  function disegnaDomanda() {
    const d = sessione.domande[sessione.i];
    const tot = sessione.domande.length;
    const l = lezione(d.lezione);
    $("#prog-testo").textContent = "Domanda " + (sessione.i + 1) + " di " + tot;
    $("#prog-barra").style.width = (100 * sessione.i) / tot + "%";

    let chips = '<span class="chip">Lezione ' + d.lezione + "</span>" +
      '<span class="chip sez">§' + d.sez + " " + (l.sezioni[d.sez] || "") + "</span>";
    if (d.trappola) chips += '<span class="chip trappola">Trappola</span>';
    if (d.generata) chips += '<span class="chip gen">Esercizio generato</span>';
    $("#chips").innerHTML = chips;
    $("#testo").innerHTML = d.q;
    $("#esito").hidden = true;
    $("#esito").innerHTML = "";
    $("#conferma").hidden = false;
    $("#conferma").disabled = true;
    $("#avanti").hidden = true;

    const box = $("#risposta");
    box.innerHTML = "";
    sessione.scelta = d.tipo === "multi" ? new Set() : null;
    const sugg = {
      scelta: "Una sola risposta giusta.",
      multi: "Seleziona tutte le risposte giuste (possono essere più di una).",
      vf: "L'affermazione è vera o falsa?",
      numero: "Scrivi un numero: va bene la virgola (0,25) o una frazione (1/4).",
    };
    $("#suggerimento").textContent = sugg[d.tipo];

    if (d.tipo === "numero") {
      box.innerHTML = '<div class="numero-riga"><input id="valore" inputmode="decimal" autocomplete="off" aria-label="Risposta numerica"></div>';
      const inp = $("#valore");
      inp.addEventListener("input", () => ($("#conferma").disabled = inp.value.trim() === ""));
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !$("#conferma").disabled) {
          e.preventDefault();
          e.stopPropagation();
          conferma();
        }
      });
      setTimeout(() => inp.focus({ preventScroll: true }), 0);
      return;
    }
    const opz = d.tipo === "vf" ? ["Vero", "Falso"] : d.o;
    const lista = document.createElement("div");
    lista.className = "opzioni" + (d.tipo === "vf" ? " vf" : "");
    opz.forEach((testo, k) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "opz";
      b.id = "opz-" + k;
      b.dataset.k = k;
      b.setAttribute("aria-pressed", "false");
      const tasto = d.tipo === "vf" ? (k === 0 ? "V" : "F") : String(k + 1);
      b.innerHTML = '<span class="tasto">' + tasto + "</span><span>" + testo + "</span>";
      b.addEventListener("click", () => scegli(k));
      lista.appendChild(b);
    });
    box.appendChild(lista);
  }

  function scegli(k) {
    const d = sessione.domande[sessione.i];
    if (!$("#esito").hidden) return;
    const n = d.tipo === "vf" ? 2 : d.o.length;
    if (k < 0 || k >= n) return;
    if (d.tipo === "multi") {
      if (sessione.scelta.has(k)) sessione.scelta.delete(k);
      else sessione.scelta.add(k);
    } else {
      sessione.scelta = k;
    }
    document.querySelectorAll(".opz").forEach((b) => {
      const kk = Number(b.dataset.k);
      const on = d.tipo === "multi" ? sessione.scelta.has(kk) : sessione.scelta === kk;
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    $("#conferma").disabled = d.tipo === "multi" ? sessione.scelta.size === 0 : false;
  }

  function testoGiusto(d) {
    if (d.tipo === "scelta") return d.o[d.ok];
    if (d.tipo === "multi") return d.ok.map((k) => d.o[k]).join("; ");
    if (d.tipo === "vf") return d.ok ? "Vero" : "Falso";
    return Q.fmt(d.ok);
  }

  function conferma() {
    const d = sessione.domande[sessione.i];
    let giusto, data;
    if (d.tipo === "numero") {
      const inp = $("#valore");
      const x = Q.leggiNumero(inp.value);
      if (!isFinite(x)) {
        $("#suggerimento").textContent = "Non riesco a leggere “" + inp.value + "” come numero: usa per esempio 0,25 oppure 1/4.";
        return;
      }
      giusto = Q.numeroGiusto(x, d.ok, d.tol);
      data = inp.value.trim();
      inp.readOnly = true;
      inp.classList.add(giusto ? "giusta" : "sbagliata");
    } else if (d.tipo === "multi") {
      const sc = [...sessione.scelta].sort((a, b) => a - b);
      giusto = sc.length === d.ok.length && sc.every((k, i) => k === d.ok[i]);
      data = sc.map((k) => d.o[k]).join("; ");
    } else if (d.tipo === "vf") {
      giusto = (sessione.scelta === 0) === d.ok;
      data = sessione.scelta === 0 ? "Vero" : "Falso";
    } else {
      giusto = sessione.scelta === d.ok;
      data = d.o[sessione.scelta];
    }

    if (d.tipo !== "numero") {
      const giuste = d.tipo === "multi" ? new Set(d.ok) : new Set([d.tipo === "vf" ? (d.ok ? 0 : 1) : d.ok]);
      document.querySelectorAll(".opz").forEach((b) => {
        const k = Number(b.dataset.k);
        const scelta = d.tipo === "multi" ? sessione.scelta.has(k) : sessione.scelta === k;
        if (giuste.has(k)) b.classList.add("giusta");
        else if (scelta) b.classList.add("sbagliata");
        b.disabled = true;
      });
    }

    sessione.risposte[sessione.i] = { giusto, data };
    const l = lezione(d.lezione);
    const es = $("#esito");
    es.className = "esito " + (giusto ? "ok" : "no");
    es.innerHTML =
      "<h3>" + (giusto ? "Giusto" : "Sbagliato") + "</h3>" +
      (giusto ? "" : '<div class="corretta">Risposta giusta: ' + testoGiusto(d) + "</div>") +
      '<div class="perche">' + d.perche + "</div>" +
      '<div class="rimando">Negli appunti: Lezione ' + d.lezione + ", §" + d.sez + " " + (l.sezioni[d.sez] || "") +
      ' — <a href="' + PDF + l.pdf + '" target="_blank" rel="noopener">' + l.pdf + "</a></div>";
    es.hidden = false;
    $("#conferma").hidden = true;
    $("#avanti").hidden = false;
    $("#avanti").textContent = sessione.i + 1 < sessione.domande.length ? "Avanti" : "Vedi il risultato";
    $("#avanti").focus({ preventScroll: true });
    es.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function avanti() {
    if (sessione.i + 1 < sessione.domande.length) {
      sessione.i++;
      disegnaDomanda();
      window.scrollTo(0, 0);
    } else {
      fine();
    }
  }

  // ------------------------------------------------------------ risultato
  function fine() {
    const fatte = sessione.domande.map((d, i) => ({ d, r: sessione.risposte[i] })).filter((x) => x.r);
    const giuste = fatte.filter((x) => x.r.giusto).length;
    const perc = fatte.length ? Math.round((100 * giuste) / fatte.length) : 0;

    // memoria degli errori: si aggiunge ciò che è sbagliato, si toglie ciò che ora è giusto
    const err = memoria.leggi(K_ERR, {});
    fatte.forEach(({ d, r }) => {
      if (r.giusto) delete err[d.id];
      else err[d.id] = { lezione: d.lezione, sez: d.sez };
    });
    memoria.scrivi(K_ERR, err);

    const perLez = {};
    fatte.forEach(({ d, r }) => {
      perLez[d.lezione] = perLez[d.lezione] || { g: 0, t: 0 };
      perLez[d.lezione].t++;
      if (r.giusto) perLez[d.lezione].g++;
    });
    const nomiModo = { completo: "ripasso completo", rapido: "quiz rapido", calcolo: "esercizi", errori: "errori" };
    const ris = memoria.leggi(K_RIS, {});
    const oggi = new Date().toLocaleDateString("it-IT", { day: "numeric", month: "short" });
    Object.keys(perLez).forEach((n) => {
      ris[n] = { perc: Math.round((100 * perLez[n].g) / perLez[n].t), modo: nomiModo[sessione.modo], data: oggi };
    });
    memoria.scrivi(K_RIS, ris);

    $("#ris-numero").innerHTML = giuste + "<small> / " + fatte.length + " · " + perc + "%</small>";
    $("#ris-giudizio").textContent = !fatte.length ? "Nessuna risposta data."
      : perc >= 90 ? "Ottimo: questa parte la sai."
        : perc >= 70 ? "Buono: ripassa le sezioni qui sotto e rifai gli errori."
          : perc >= 50 ? "A metà strada: rileggi le sezioni indicate prima di riprovare."
            : "Conviene ripartire dagli appunti delle sezioni indicate, poi rifare il quiz.";

    const lezBox = $("#ris-lezioni");
    lezBox.innerHTML = "";
    Object.keys(perLez).sort((a, b) => a - b).forEach((n) => {
      const x = perLez[n];
      const p = Math.round((100 * x.g) / x.t);
      lezBox.insertAdjacentHTML("beforeend",
        '<div class="riga-lez"><span>Lezione ' + n + " · " + lezione(Number(n)).titolo + '</span><span class="val">' +
        x.g + "/" + x.t + " · " + p + '%</span><span class="barra"><i style="width:' + p + '%"></i></span></div>');
    });
    $("#ris-lezioni-blocco").hidden = Object.keys(perLez).length === 0;

    const sbagliate = fatte.filter((x) => !x.r.giusto);
    const perSez = {};
    sbagliate.forEach(({ d }) => {
      const k = d.lezione + "|" + d.sez;
      perSez[k] = (perSez[k] || 0) + 1;
    });
    const sezBox = $("#ris-sezioni");
    sezBox.innerHTML = "";
    Object.keys(perSez).sort((a, b) => {
      const [la, sa] = a.split("|"), [lb, sb] = b.split("|");
      return la - lb || sa.localeCompare(sb, undefined, { numeric: true });
    }).forEach((k) => {
      const [n, s] = k.split("|");
      sezBox.insertAdjacentHTML("beforeend",
        '<li><span><span class="s">§' + s + "</span>" + (lezione(Number(n)).sezioni[s] || "") + '</span><span class="c">' +
        perSez[k] + (perSez[k] === 1 ? " errore" : " errori") + "</span></li>");
    });
    $("#ris-sezioni-blocco").hidden = sbagliate.length === 0;

    const errBox = $("#ris-errori");
    errBox.innerHTML = "";
    sbagliate.forEach(({ d, r }) => {
      const det = document.createElement("details");
      det.className = "errore";
      det.innerHTML =
        '<summary><span class="s">§' + d.sez + "</span>" + riassunto(d.q) + "</summary>" +
        '<div class="corpo"><div>' + d.q + "</div><div><b>Hai risposto:</b> " + r.data + "</div><div><b>Risposta giusta:</b> " +
        testoGiusto(d) + "</div><div>" + d.perche + "</div></div>";
      errBox.appendChild(det);
    });
    $("#ris-errori-blocco").hidden = sbagliate.length === 0;
    $("#ripeti-errori").hidden = sbagliate.length === 0;
    sessione.sbagliate = sbagliate.map(({ d }) => d);
    mostra("risultato");
  }

  function riassunto(html) {
    const t = html.replace(/<div class="tab-scroll">[\s\S]*?<\/div>/g, " […] ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    return t.length > 110 ? t.slice(0, 107) + "…" : t;
  }

  // ------------------------------------------------------------ eventi
  $("#tutte").addEventListener("click", () => {
    if (stato.scelte.size === Q.lezioni.length) stato.scelte = new Set([Q.lezioni[0].numero]);
    else stato.scelte = new Set(Q.lezioni.map((l) => l.numero));
    salvaPref();
    disegnaHome();
  });
  document.querySelectorAll('input[name="modo"]').forEach((inp) =>
    inp.addEventListener("change", () => {
      stato.modo = inp.value;
      disegnaHome();
    }));
  $("#inizia").addEventListener("click", () => avvia(stato.modo, costruisci(stato.modo)));
  $("#conferma").addEventListener("click", conferma);
  $("#avanti").addEventListener("click", avanti);
  $("#termina").addEventListener("click", fine);
  $("#nuovo").addEventListener("click", () => {
    disegnaHome();
    mostra("home");
  });
  $("#ripeti-errori").addEventListener("click", () => {
    const lista = sessione.sbagliate.map((d) => (d.generata ? istanza(generatore(d.id)) : domandaFissa(d.id)));
    avvia("errori", lista);
  });

  document.addEventListener("keydown", (e) => {
    if ($("#quiz").hidden || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target && e.target.id === "valore") return;
    const d = sessione && sessione.domande[sessione.i];
    if (!d) return;
    if (e.key === "Enter") {
      if (!$("#avanti").hidden) { e.preventDefault(); avanti(); }
      else if (!$("#conferma").disabled) { e.preventDefault(); conferma(); }
      return;
    }
    if (d.tipo === "vf") {
      if (e.key === "v" || e.key === "V") scegli(0);
      if (e.key === "f" || e.key === "F") scegli(1);
      return;
    }
    if (/^[1-8]$/.test(e.key) && d.tipo !== "numero") scegli(Number(e.key) - 1);
  });

  disegnaHome();
})();
