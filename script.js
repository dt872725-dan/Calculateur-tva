// --- 1. BASE DE DONNÉES TVA ---
const listePaysMonde = [
  { nom: "RDC (Congo-Kinshasa)", taux: 16 }, { nom: "Côte d'Ivoire", taux: 18 },
  { nom: "Sénégal", taux: 18 }, { nom: "Cameroun", taux: 19.25 },
  { nom: "France", taux: 20 }, { nom: "Belgique", taux: 21 },
  { nom: "Canada", taux: 5 }, { nom: "Suisse", taux: 8.1 },
  { nom: "USA", taux: 0 }, { nom: "Autre", taux: 0 }
];

const selPays = document.getElementById("pays");
const inputMontantTVA = document.getElementById("montant-tva");
const inputTauxTVA = document.getElementById("taux-tva");
const resTVA = document.getElementById("res-tva");

if (selPays) {
  listePaysMonde.forEach((p, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${p.nom} (${p.taux}%)`;
    selPays.appendChild(opt);
  });

  selPays.addEventListener("change", () => {
    inputTauxTVA.value = listePaysMonde[selPays.value].taux;
    calculerTVA();
  });
  inputMontantTVA.addEventListener("input", calculerTVA);
  inputTauxTVA.addEventListener("input", calculerTVA);
}

function calculerTVA() {
  const montant = parseFloat(inputMontantTVA.value);
  const taux = parseFloat(inputTauxTVA.value);
  if (isNaN(montant) || isNaN(taux)) { resTVA.innerHTML = "Entrez un montant."; return; }
  const tva = montant * (taux / 100);
  const ttc = montant + tva;
  resTVA.innerHTML = `TVA: <strong>${tva.toFixed(2)}</strong> <br> TTC: <strong>${ttc.toFixed(2)}</strong>`;
}

// --- 2. CONVERTISSEUR DEVISES ---
const inputDevise = document.getElementById("montant-devise");
const selectSource = document.getElementById("devise-source");
const selectCible = document.getElementById("devise-cible");
const resDevise = document.getElementById("res-devise");
let tauxDeChange = {};

async function chargerTaux() {
  if(!resDevise) return;
  try {
    const rep = await fetch("https://open.er-api.com/v6/latest/EUR");
    const data = await rep.json();
    tauxDeChange = data.rates;
    tauxDeChange["XOF"] = 655.957; // FCFA fixe
    tauxDeChange["EUR"] = 1;
    convertirDevise();
  } catch (e) { resDevise.innerHTML = "Erreur réseau."; }
}

function convertirDevise() {
  if(!inputDevise || Object.keys(tauxDeChange).length === 0) return;
  const m = parseFloat(inputDevise.value);
  if (isNaN(m)) return;
  const enEuro = m / tauxDeChange[selectSource.value];
  const final = enEuro * tauxDeChange[selectCible.value];
  resDevise.innerHTML = `<strong>${final.toFixed(2)} ${selectCible.value}</strong>`;
}

if (inputDevise) {
  inputDevise.addEventListener("input", convertirDevise);
  selectSource.addEventListener("change", convertirDevise);
  selectCible.addEventListener("change", convertirDevise);
  chargerTaux();
}

// --- 3. POURCENTAGE ---
const px = document.getElementById("pourcent-x");
const py = document.getElementById("pourcent-y");
const resPourcent = document.getElementById("res-pourcent");

function calcPourcent() {
  if(!px || !resPourcent) return;
  const x = parseFloat(px.value);
  const y = parseFloat(py.value);
  if (isNaN(x) || isNaN(y)) { resPourcent.innerHTML = "Résultat ici..."; return; }
  const res = (x / 100) * y;
  resPourcent.innerHTML = `<strong>${res.toFixed(2)}</strong>`;
}
if(px) { px.addEventListener("input", calcPourcent); py.addEventListener("input", calcPourcent); }

// --- 4. SIMULATEUR DE PRÊT ---
const pretMontant = document.getElementById("pret-montant");
const pretTaux = document.getElementById("pret-taux");
const pretDuree = document.getElementById("pret-duree");
const resPret = document.getElementById("res-pret");

function calcPret() {
  if(!pretMontant || !resPret) return;
  const capital = parseFloat(pretMontant.value);
  const tauxAnnuel = parseFloat(pretTaux.value) / 100;
  const mois = parseFloat(pretDuree.value);

  if (isNaN(capital) || isNaN(tauxAnnuel) || isNaN(mois) || mois <= 0) {
    resPret.innerHTML = "Remplissez les champs."; return;
  }

  const tauxMensuel = tauxAnnuel / 12;
  let mensualite;
  if (tauxMensuel === 0) {
    mensualite = capital / mois;
  } else {
    mensualite = capital * tauxMensuel / (1 - Math.pow(1 + tauxMensuel, -mois));
  }
  const totalRembourse = mensualite * mois;
  const interets = totalRembourse - capital;

  resPret.innerHTML = `Mensualité: <strong>${mensualite.toFixed(2)}</strong> <br>
                       Intérêts totaux: ${interets.toFixed(2)}`;
}
if(pretMontant) {
  [pretMontant, pretTaux, pretDuree].forEach(el => el.addEventListener("input", calcPret));
}

// --- 5. SALAIRE NET ---
const salaireBrut = document.getElementById("salaire-brut");
const resSalaire = document.getElementById("res-salaire");

function calcSalaire() {
  if(!salaireBrut || !resSalaire) return;
  const brut = parseFloat(salaireBrut.value);
  if (isNaN(brut)) { resSalaire.innerHTML = "Résultat ici..."; return; }
  // Estimation basique à 20% de charges (à adapter selon le pays)
  const net = brut * 0.80;
  resSalaire.innerHTML = `Net estimé: <strong>${net.toFixed(2)}</strong>`;
}
if(salaireBrut) salaireBrut.addEventListener("input", calcSalaire);

// Année footer
const anneeActuelle = document.getElementById("annee");
if (anneeActuelle) anneeActuelle.textContent = new Date().getFullYear();
