// --- 1. GESTION DU CALCULATEUR DE TVA ---
const pays = [
  { nom: "RDC (Congo-Kinshasa)", taux: 16 },
  { nom: "Côte d'Ivoire", taux: 18 },
  { nom: "Sénégal", taux: 18 },
  { nom: "Cameroun", taux: 19.25 },
  { nom: "Gabon", taux: 18 },
  { nom: "Bénin", taux: 18 },
  { nom: "Burkina Faso", taux: 18 },
  { nom: "Mali", taux: 18 },
  { nom: "Togo", taux: 18 },
  { nom: "Niger", taux: 19 },
  { nom: "Guinée", taux: 18 },
  { nom: "Madagascar", taux: 20 },
  { nom: "France", taux: 20 },
  { nom: "Autre", taux: 0 }
];

const selPays = document.getElementById("pays");
const inputMontant = document.getElementById("montant");
const inputTaux = document.getElementById("taux");
const resultatTVA = document.getElementById("resultat-tva");

if (selPays) {
  pays.forEach((p, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${p.nom} — ${p.taux} %`;
    selPays.appendChild(opt);
  });

  selPays.addEventListener("change", () => {
    inputTaux.value = pays[selPays.value].taux;
    calculerTVA();
  });

  [inputMontant, inputTaux].forEach(el => el.addEventListener("input", calculerTVA));
  document.querySelectorAll('input[name="mode"]').forEach(r => r.addEventListener("change", calculerTVA));
}

function formatNombre(n) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calculerTVA() {
  if(!resultatTVA) return;
  const montant = parseFloat(inputMontant.value);
  const taux = parseFloat(inputTaux.value);
  const mode = document.querySelector('input[name="mode"]:checked').value;

  if (isNaN(montant) || montant <= 0 || isNaN(taux) || taux < 0) {
    resultatTVA.innerHTML = "<p>Entrez un montant et un taux valides.</p>";
    return;
  }

  let ht, tva, ttc;
  if (mode === "ht") {
    ht = montant;
    tva = ht * taux / 100;
    ttc = ht + tva;
  } else {
    ttc = montant;
    ht = ttc / (1 + taux / 100);
    tva = ttc - ht;
  }

  resultatTVA.innerHTML = `
    <p>Montant HT : <strong>${formatNombre(ht)}</strong></p>
    <p>TVA (${taux} %) : <strong>${formatNombre(tva)}</strong></p>
    <p>Montant TTC : <strong>${formatNombre(ttc)}</strong></p>
  `;
}

// --- 2. GESTION DU CONVERTISSEUR DE DEVISES ---
const inputDevise = document.getElementById("montant-devise");
const selectSource = document.getElementById("devise-source");
const selectCible = document.getElementById("devise-cible");
const resultatDevise = document.getElementById("resultat-devise");

let tauxDeChange = {};

// On récupère les vrais taux de change depuis une API gratuite (basée sur l'Euro)
async function chargerTaux() {
  if(!resultatDevise) return;
  try {
    const reponse = await fetch("https://open.er-api.com/v6/latest/EUR");
    const data = await reponse.json();
    
    // On ajoute le FCFA manuellement car il est fixé sur l'Euro (1 EUR = 655.957 FCFA)
    tauxDeChange = data.rates;
    tauxDeChange["XOF"] = 655.957; 
    tauxDeChange["XAF"] = 655.957;
    tauxDeChange["EUR"] = 1;
    
    convertirDevise();
  } catch (erreur) {
    resultatDevise.innerHTML = "Erreur de connexion pour charger les taux.";
  }
}

function convertirDevise() {
  if(!resultatDevise || Object.keys(tauxDeChange).length === 0) return;
  
  const montant = parseFloat(inputDevise.value);
  if (isNaN(montant) || montant < 0) {
    resultatDevise.innerHTML = "Entrez un montant valide.";
    return;
  }

  const source = selectSource.value;
  const cible = selectCible.value;

  // Calcul : (Montant / Taux de la source) * Taux de la cible
  const montantEnEuro = montant / tauxDeChange[source];
  const montantFinal = montantEnEuro * tauxDeChange[cible];

  resultatDevise.innerHTML = `
    <p>${formatNombre(montant)} ${source} = <br>
    <strong style="font-size:1.5rem;">${formatNombre(montantFinal)} ${cible}</strong></p>
  `;
}

if (inputDevise) {
  inputDevise.addEventListener("input", convertirDevise);
  selectSource.addEventListener("change", convertirDevise);
  selectCible.addEventListener("change", convertirDevise);
  chargerTaux(); // Lance le chargement dès l'ouverture de la page
}

// Année du footer
const anneeActuelle = document.getElementById("annee");
if (anneeActuelle) {
  anneeActuelle.textContent = new Date().getFullYear();
}
