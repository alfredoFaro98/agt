"""Ricalcola in modo indipendente le risposte degli esercizi generati.

Uso:  node quiz/test/verifica.js   (scrive istanze.json)
      python quiz/test/verifica_generatori.py
"""
import itertools
import json
import math
import os
import sys
from fractions import Fraction

import numpy as np
from scipy.optimize import linprog

QUI = os.path.dirname(os.path.abspath(__file__))
ist = json.load(open(os.path.join(QUI, "istanze.json"), encoding="utf-8"))


def vicino(a, b, tol=1e-6):
    return abs(a - b) <= tol


# ---------------------------------------------------------------- lezione 1
def alphabeta(nodo, massimizza, alpha, beta, contatore):
    if not isinstance(nodo, list):
        contatore[0] += 1
        return nodo
    if massimizza:
        v = -math.inf
        for f in nodo:
            v = max(v, alphabeta(f, False, alpha, beta, contatore))
            alpha = max(alpha, v)
            if alpha >= beta:
                break
        return v
    v = math.inf
    for f in nodo:
        v = min(v, alphabeta(f, True, alpha, beta, contatore))
        beta = min(beta, v)
        if alpha >= beta:
            break
    return v


def g1_minimax(d, ok):
    return ok == max(min(g) for g in d["gruppi"])


def g1_alphabeta(d, ok):
    c = [0]
    v = alphabeta(d["gruppi"], True, -math.inf, math.inf, c)
    return ok == 9 - c[0] and v == max(min(g) for g in d["gruppi"])


def g1_mossa(d, ok):
    mins = [min(g) for g in d["gruppi"]]
    return mins.count(max(mins)) == 1 and ok == mins.index(max(mins))


# ---------------------------------------------------------------- lezione 2
def g2_valore_atteso(d, ok):
    return abs(sum(d["probs"]) - 1) < 1e-9 and vicino(ok, sum(p * x for p, x in zip(d["probs"], d["xs"])))


def g2_composta(d, ok):
    s, p1, p2 = d["s"], d["p1"], d["p2"]
    return vicino(ok, s * p1 + (1 - s) * p2)


def g2_equivalente_certo(d, ok):
    p, xs = d["p"], d["xs"]
    eu = p * math.sqrt(xs[0]) + (1 - p) * math.sqrt(xs[1])
    return vicino(ok, eu * eu if d["chiediCE"] else eu)


def g2_assicurazione(d, ok):
    X, q = d["X"], d["q"]
    eu = q * math.sqrt(X)
    # premio massimo: sqrt(X - P) = eu ; minimo: risarcimento atteso (1 - q) X
    return vicino(ok, X - eu ** 2 if d["chiediMax"] else (1 - q) * X)


def g2_continuita(d, ok):
    uL, uM, uN = d["uL"], d["uM"], d["uN"]
    return vicino(ok * uL + (1 - ok) * uN, uM)


def g2_bayes(d, ok):
    pk, qk, pj = d["pk"], d["qk"], d["pj"]
    # simulazione esatta con probabilità congiunte
    trovato_no_k = pk * (1 - qk)
    norm = 1 - pk * qk
    return vicino(ok, (pj if d["altra"] else trovato_no_k) / norm)


FUNZ = {
    "f(t) = t³": lambda t: t ** 3,
    "f(t) = 5t − 2": lambda t: 5 * t - 2,
    "f(t) = e<sup>t</sup>": math.exp,
    "f(t) = −2t": lambda t: -2 * t,
    "f(t) = t²": lambda t: t * t,
    "f(t) = |t|": abs,
}


def g2_trasformazione(d, ok):
    u = d["u"]
    v = [FUNZ[d["f"]](x) for x in u]
    ordine_conservato = all((u[i] > u[j]) == (v[i] > v[j]) for i in range(3) for j in range(3) if i != j)
    return ok == ordine_conservato


RISCHIO = {
    "u(x) = √x": math.sqrt, "u(x) = ln(1 + x)": lambda x: math.log(1 + x),
    "u(x) = 1 − e<sup>−x</sup>": lambda x: 1 - math.exp(-x), "u(x) = 3x + 2": lambda x: 3 * x + 2,
    "u(x) = x/10": lambda x: x / 10, "u(x) = x² (x ≥ 0)": lambda x: x * x, "u(x) = e<sup>x</sup>": math.exp,
}


def g2_rischio(d, ok):
    f = RISCHIO[d["u"]]
    a, b = 1.0, 3.0
    jensen = 0.5 * f(a) + 0.5 * f(b) - f(2.0)  # <0 concava, =0 lineare, >0 convessa
    atteso = 0 if jensen < -1e-9 else (1 if abs(jensen) <= 1e-9 else 2)
    return ok == atteso


# ---------------------------------------------------------------- lezione 3
def nash_puri(A, B):
    A, B = np.array(A), np.array(B)
    return [(i, j) for i in range(A.shape[0]) for j in range(A.shape[1])
            if A[i, j] >= A[:, j].max() and B[i, j] >= B[i, :].max()]


def g3_equilibri_puri(d, ok):
    return ok == len(nash_puri(d["A"], d["B"]))


def g3_misto(d, ok):
    A, B = [[Fraction(x) for x in r] for r in d["A"]], [[Fraction(x) for x in r] for r in d["B"]]
    # q: colonna gioca C1 e rende indifferente la riga; p: riga gioca R1 e rende indifferente la colonna
    q = (A[1][1] - A[0][1]) / (A[0][0] - A[0][1] - A[1][0] + A[1][1])
    p = (B[1][1] - B[1][0]) / (B[0][0] - B[0][1] - B[1][0] + B[1][1])
    # verifica di indifferenza
    ur = [q * A[i][0] + (1 - q) * A[i][1] for i in range(2)]
    uc = [p * B[0][j] + (1 - p) * B[1][j] for j in range(2)]
    assert ur[0] == ur[1] and uc[0] == uc[1] and 0 < p < 1 and 0 < q < 1
    return vicino(ok, float(p if d["chiediRiga"] else q))


def g3_best_response(d, ok):
    u = np.array(d["A"]) @ np.array(d["s"])
    return ok == int(np.argmax(u)) and np.sum(np.isclose(u, u.max())) == 1


def g3_utilita_mista(d, ok):
    return vicino(ok, float(np.array(d["sr"]) @ np.array(d["A"]) @ np.array(d["sc"])))


def g3_dominata(d, ok):
    A = d["A"]
    dom = [i for i in range(3) if any(k != i and all(A[k][j] > A[i][j] for j in range(2)) for k in range(3))]
    return ok == (dom[0] if len(dom) == 1 else 3 if not dom else -1)


def valore_lp(A):
    A = np.array(A, float)
    m, n = A.shape
    res = linprog(np.r_[np.zeros(m), -1], A_ub=np.hstack([-A.T, np.ones((n, 1))]), b_ub=np.zeros(n),
                  A_eq=np.r_[np.ones(m), 0][None], b_eq=[1], bounds=[(0, None)] * m + [(None, None)], method="highs")
    return res.x[-1]


def g3_somma_zero(d, ok):
    return vicino(ok, valore_lp(d["A"]), 1e-6)


def g3_beni_comuni(d, ok):
    A, B = d["A"], d["B"]
    # equilibrio con iterazione delle best response
    x = [0.0, 0.0]
    for _ in range(200):
        x = [max(0.0, (A - B * x[1]) / (2 * B)), max(0.0, (A - B * x[0]) / (2 * B))]
    xs = x[0]
    X = 2 * xs
    # ottimo sociale per ricerca su griglia fine
    griglia = np.linspace(0, A / B, 200001)
    Xopt = griglia[np.argmax(griglia * (A - B * griglia))]
    valori = [xs, X, Xopt, xs * (A - B * X)]
    return vicino(ok, valori[d["caso"]], 1e-3 * max(1, valori[d["caso"]]))


# ---------------------------------------------------------------- lezione 4
def g4_verifica_ce(d, ok):
    A, B, p = np.array(d["A"]), np.array(d["B"]), np.array(d["p"])
    vero = True
    for i in range(2):
        for k in range(2):
            if np.sum(p[i, :] * (A[i, :] - A[k, :])) < -1e-9:
                vero = False
    for j in range(2):
        for l in range(2):
            if np.sum(p[:, j] * (B[:, j] - B[:, l])) < -1e-9:
                vero = False
    return abs(p.sum() - 1) < 1e-9 and (p >= 0).all() and ok == vero


def g4_rimpianto(d, ok):
    A = np.array(d["A"])
    R = A.max(axis=0) - A
    peggiore = R.max(axis=1)
    return ok == int(np.argmin(peggiore)) and np.sum(peggiore == peggiore.min()) == 1


def g4_fictitious(d, ok):
    P = np.array([[0, -1, 1], [1, 0, -1], [-1, 1, 0]])
    c = np.array(d["c"], float)
    u = P @ (c / c.sum())
    return ok == int(np.argmax(u)) and np.sum(np.isclose(u, u.max())) == 1


def g4_regret(d, ok):
    pos = [max(0, x) for x in d["R"]]
    return vicino(ok, pos[d["k"]] / sum(pos))


# ---------------------------------------------------------------- lezione 5
GIOC = "ABC"


def v_di(v, S):
    k = "".join(sorted(S))
    return 0 if not k else v[k]


def shapley_perm(v):
    phi = {g: Fraction(0) for g in GIOC}
    for o in itertools.permutations(GIOC):
        prima = ""
        for g in o:
            phi[g] += Fraction(v_di(v, prima + g) - v_di(v, prima))
            prima += g
    return {g: phi[g] / 6 for g in GIOC}


def g5_shapley(d, ok):
    return vicino(ok, float(shapley_perm(d["v"])[d["g"]]))


def nel_core(v, x):
    if any(x[g] < 0 for g in GIOC) or x["A"] + x["B"] + x["C"] != v["ABC"]:
        return False
    for r in (1, 2):
        for S in itertools.combinations(GIOC, r):
            if sum(x[g] for g in S) < v_di(v, S):
                return False
    return True


def g5_core(d, ok):
    return ok == nel_core(d["v"], d["x"])


def g5_eccesso(d, ok):
    v, x, S = d["v"], d["x"], d["S"]
    return ok == v_di(v, S) - sum(x[g] for g in S)


def g5_superadditivo(d, ok):
    v = d["v"]
    insiemi = [frozenset(c) for r in (1, 2, 3) for c in itertools.combinations(GIOC, r)]
    sa = all(v_di(v, a | b) >= v_di(v, a) + v_di(v, b) for a in insiemi for b in insiemi if not (a & b) and len(a | b) <= 3)
    return ok == sa


def partizioni(elementi):
    if not elementi:
        yield []
        return
    primo, resto = elementi[0], elementi[1:]
    for p in partizioni(resto):
        for i in range(len(p)):
            yield p[:i] + [p[i] + primo] + p[i + 1:]
        yield p + [primo]


def g5_struttura(d, ok):
    v = d["v"]
    parts = list(partizioni(list(GIOC)))
    assert len(parts) == 5
    return ok == max(sum(v_di(v, S) for S in p) for p in parts)


def g5_core_vuoto(d, ok):
    v = d["v"]
    righe, b = [], []
    for r in (1, 2):
        for S in itertools.combinations(range(3), r):
            riga = np.zeros(3)
            riga[list(S)] = -1
            righe.append(riga)
            b.append(-v_di(v, "".join(GIOC[i] for i in S)))
    res = linprog(np.zeros(3), A_ub=np.array(righe), b_ub=b, A_eq=np.ones((1, 3)), b_eq=[v["ABC"]],
                  bounds=[(0, None)] * 3, method="highs")
    vuoto = res.status != 0
    return ok == vuoto


CONTROLLI = {
    "G1-minimax": g1_minimax, "G1-alphabeta": g1_alphabeta, "G1-mossa": g1_mossa,
    "G2-valore-atteso": g2_valore_atteso, "G2-composta": g2_composta, "G2-equivalente-certo": g2_equivalente_certo,
    "G2-assicurazione": g2_assicurazione, "G2-continuita": g2_continuita, "G2-bayes-ricerca": g2_bayes,
    "G2-trasformazione": g2_trasformazione, "G2-rischio": g2_rischio,
    "G3-equilibri-puri": g3_equilibri_puri, "G3-misto-2x2": g3_misto, "G3-best-response": g3_best_response,
    "G3-utilita-mista": g3_utilita_mista, "G3-dominata": g3_dominata, "G3-somma-zero-2x2": g3_somma_zero,
    "G3-beni-comuni": g3_beni_comuni,
    "G4-verifica-ce": g4_verifica_ce, "G4-minimo-rimpianto": g4_rimpianto, "G4-fictitious-play": g4_fictitious,
    "G4-regret-matching": g4_regret,
    "G5-shapley": g5_shapley, "G5-core": g5_core, "G5-eccesso": g5_eccesso, "G5-superadditivo": g5_superadditivo,
    "G5-struttura": g5_struttura, "G5-core-vuoto": g5_core_vuoto,
}

errori = 0
mancanti = set(ist) - set(CONTROLLI)
if mancanti:
    print("Generatori senza controllo:", sorted(mancanti))
    errori += len(mancanti)
for gid, f in CONTROLLI.items():
    lista = ist.get(gid, [])
    sbagliate = [k for k, x in enumerate(lista) if not f(x["dati"], x["ok"])]
    print(f"{gid:24s} {len(lista):4d} istanze  " + ("OK" if not sbagliate else f"{len(sbagliate)} SBAGLIATE, es. {lista[sbagliate[0]]}"))
    errori += len(sbagliate) + (0 if lista else 1)
print("\nTutte le risposte confermate." if not errori else f"\n{errori} PROBLEMI")
sys.exit(1 if errori else 0)
