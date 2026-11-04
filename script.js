// --- TVA ---
const selPays = document.getElementById("pays");
if (selPays) {
  const listePaysMonde = [
    { nom: "RDC (Congo-Kinshasa)", taux: 16 }, { nom: "Côte d'Ivoire", taux: 18 },
    { nom: "Sénégal", taux: 18 }, { nom: "France", taux: 20 }, { nom: "Autre", taux: 0 }
  ];
  listePaysMonde.forEach((p, i) => {
    const opt = document.createElement("option");
    opt.value = i; opt.textContent = `${p.nom} (${p.taux}%)`; selPays.appendChild(opt);
  });
  const inputMontantTVA = document.getElementById("montant-tva");
  const inputTauxTVA = document.getElementById("taux-tva");
  const resTVA = document.getElementById("res-tva");
  
  const calcTVA = () => {
    const m = parseFloat(inputMontantTVA.value); const t = parseFloat(inputTauxTVA.value);
    if (isNaN(m) || isNaN(t)) { resTVA.innerHTML = "Entrez un montant."; return; }
    const tva = m * (t / 100); resTVA.innerHTML = `TVA: <strong>${tva.toFixed(2)}</strong> <br> TTC: <strong>${(m+tva).toFixed(2)}</strong>`;
  };
  selPays.addEventListener("change", () => { inputTauxTVA.value = listePaysMonde[selPays.value].taux; calcTVA(); });
  inputMontantTVA.addEventListener("input", calcTVA); inputTauxTVA.addEventListener("input", calcTVA);
}

// --- DEVISE ---
const inputDevise = document.getElementById("montant-devise");
if (inputDevise) {
  let taux = {};
  const res = document.getElementById("res-devise");
  fetch("https://open.er-api.com/v6/latest/EUR").then(r => r.json()).then(data => {
    taux = data.rates; taux["XOF"] = 655.957; taux["EUR"] = 1;
    const conv = () => {
      const m = parseFloat(inputDevise.value); if(isNaN(m)) return;
      const final = (m / taux[document.getElementById("devise-source").value]) * taux[document.getElementById("devise-cible").value];
      res.innerHTML = `<strong>${final.toFixed(2)} ${document.getElementById("devise-cible").value}</strong>`;
    };
    inputDevise.addEventListener("input", conv);
    document.getElementById("devise-source").addEventListener("change", conv);
    document.getElementById("devise-cible").addEventListener("change", conv);
    conv();
  });
}

// --- POURCENTAGE ---
const px = document.getElementById("pourcent-x");
if (px) {
  const py = document.getElementById("pourcent-y"); const res = document.getElementById("res-pourcent");
  const calc = () => {
    const x = parseFloat(px.value); const y = parseFloat(py.value);
    if(isNaN(x) || isNaN(y)) { res.innerHTML = "Résultat ici..."; return; }
    res.innerHTML = `<strong>${((x/100)*y).toFixed(2)}</strong>`;
  };
  px.addEventListener("input", calc); py.addEventListener("input", calc);
}

// --- PRÊT (Fonctionne sur l'accueil et sur la page RDC) ---
const pretMontant = document.getElementById("pret-montant");
if (pretMontant) {
  const pTaux = document.getElementById("pret-taux");
  const pDuree = document.getElementById("pret-duree");
  const resPret = document.getElementById("res-pret");
  const calcPret = () => {
    const c = parseFloat(pretMontant.value); const tA = parseFloat(pTaux.value)/100; const m = parseFloat(pDuree.value);
    if(isNaN(c) || isNaN(tA) || isNaN(m) || m<=0) { resPret.innerHTML = "Remplissez les champs."; return; }
    const tM = tA / 12; let mensualite;
    if(tM === 0) mensualite = c/m; else mensualite = c * tM / (1 - Math.pow(1 + tM, -m));
    resPret.innerHTML = `Mensualité: <strong>${mensualite.toFixed(2)}</strong> <br> Total: ${(mensualite*m).toFixed(2)}`;
  };
  [pretMontant, pTaux, pDuree].forEach(el => el.addEventListener("input", calcPret));
}

// Année
const anneeActuelle = document.getElementById("annee");
if (anneeActuelle) anneeActuelle.textContent = new Date().getFullYear();
