// --- BASE DE DONNÉES DES PAYS ET TAUX DE TVA MONDIaux ---
const listePaysMonde = [
  // AFRIQUE
  { nom: "Afrique du Sud", taux: 15 }, { nom: "Algérie", taux: 19 }, { nom: "Bénin", taux: 18 },
  { nom: "Burkina Faso", taux: 18 }, { nom: "Cameroun", taux: 19.25 }, { nom: "Côte d'Ivoire", taux: 18 },
  { nom: "Égypte", taux: 14 }, { nom: "Gabon", taux: 18 }, { nom: "Guinée", taux: 18 },
  { nom: "Madagascar", taux: 20 }, { nom: "Mali", taux: 18 }, { nom: "Maroc", taux: 20 },
  { nom: "Mauritanie", taux: 16 }, { nom: "Niger", taux: 19 }, { nom: "Nigeria", taux: 7.5 },
  { nom: "RDC (Congo-Kinshasa)", taux: 16 }, { nom: "Sénégal", taux: 18 }, { nom: "Tchad", taux: 18 },
  { nom: "Togo", taux: 18 }, { nom: "Tunisie", taux: 19 },
  
  // EUROPE
  { nom: "Allemagne", taux: 19 }, { nom: "Autriche", taux: 20 }, { nom: "Belgique", taux: 21 },
  { nom: "Bulgarie", taux: 20 }, { nom: "Chypre", taux: 19 }, { nom: "Croatie", taux: 25 },
  { nom: "Danemark", taux: 25 }, { nom: "Espagne", taux: 21 }, { nom: "Estonie", taux: 22 },
  { nom: "Finlande", taux: 24 }, { nom: "France", taux: 20 }, { nom: "Grèce", taux: 24 },
  { nom: "Hongrie", taux: 27 }, { nom: "Irlande", taux: 23 }, { nom: "Italie", taux: 22 },
  { nom: "Lettonie", taux: 21 }, { nom: "Lituanie", taux: 21 }, { nom: "Luxembourg", taux: 17 },
  { nom: "Malte", taux: 18 }, { nom: "Pays-Bas", taux: 21 }, { nom: "Pologne", taux: 23 },
  { nom: "Portugal", taux: 23 }, { nom: "République Tchèque", taux: 21 }, { nom: "Roumanie", taux: 19 },
  { nom: "Royaume-Uni (UK)", taux: 20 }, { nom: "Slovaquie", taux: 20 }, { nom: "Slovénie", taux: 22 },
  { nom: "Suède", taux: 25 }, { nom: "Suisse", taux: 8.1 },

  // AMÉRIQUES
  { nom: "Argentine", taux: 21 }, { nom: "Brésil", taux: 17 }, { nom: "Canada (TVA standard)", taux: 5 },
  { nom: "Chili", taux: 19 }, { nom: "Colombie", taux: 19 }, { nom: "États-Unis (Moyenne)", taux: 0 },
  { nom: "Mexique", taux: 16 }, { nom: "Pérou", taux: 18 },

  // ASIE / OCÉANIE
  { nom: "Arabie Saoudite", taux: 15 }, { nom: "Australie (GST)", taux: 10 }, { nom: "Chine", taux: 13 },
  { nom: "Corée du Sud", taux: 10 }, { nom: "Émirats Arabes Unis", taux: 5 }, { nom: "Inde (GST moyen)", taux: 18 },
  { nom: "Indonésie", taux: 11 }, { nom: "Israël", taux: 17 }, { nom: "Japon", taux: 10 },
  { nom: "Nouvelle-Zélande (GST)", taux: 15 }, { nom: "Singapour (GST)", taux: 9 },
  { nom: "Thaïlande", taux: 7 }, { nom: "Turquie", taux: 20 }, { nom: "Vietnam", taux: 10 },
  
  // AUTRE
  { nom: "Autre (Taux manuel)", taux: 0 }
];

const selPays = document.getElementById("pays");
const inputRecherche = document.getElementById("recherche-pays");
const inputMontant = document.getElementById("montant");
const inputTaux = document.getElementById("taux");
const resultatTVA = document.getElementById("resultat-tva");

// Fonction pour afficher les pays dans la liste
function afficherPays(filtre = "") {
  if (!selPays) return;
  selPays.innerHTML = ""; // On vide la liste
  const filtreMinuscule = filtre.toLowerCase();

  listePaysMonde.forEach((p, index) => {
    if (p.nom.toLowerCase().includes(filtreMinuscule)) {
      const opt = document.createElement("option");
      opt.value = index; // On stocke l'index d'origine
      opt.textContent = `${p.nom} — ${p.taux} %`;
      selPays.appendChild(opt);
    }
  });

  // Si un seul pays correspond à la recherche, on le sélectionne
  if (selPays.options.length > 0) {
    selPays.selectedIndex = 0;
    inputTaux.value = listePaysMonde[selPays.value].taux;
    calculerTVA();
  }
}

// Initialisation
if (selPays) {
  afficherPays();

  // Écouteur pour la barre de recherche
  inputRecherche.addEventListener("input", (e) => afficherPays(e.target.value));

  // Changement de pays dans la liste
  selPays.addEventListener("change", () => {
    inputTaux.value = listePaysMonde[selPays.value].taux;
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
    resultatTVA.innerHTML = "<p>Entrez un montant valide.</p>";
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

// --- GESTION DU CONVERTISSEUR DE DEVISES ---
const inputDevise = document.getElementById("montant-devise");
const selectSource = document.getElementById("devise-source");
const selectCible = document.getElementById("devise-cible");
const resultatDevise = document.getElementById("resultat-devise");
let tauxDeChange = {};

async function chargerTaux() {
  if(!resultatDevise) return;
  try {
    const reponse = await fetch("https://open.er-api.com/v6/latest/EUR");
    const data = await reponse.json();
    tauxDeChange = data.rates;
    tauxDeChange["XOF"] = 655.957; 
    tauxDeChange["XAF"] = 655.957;
    tauxDeChange["EUR"] = 1;
    convertirDevise();
  } catch (erreur) {
    resultatDevise.innerHTML = "Erreur de connexion.";
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
  chargerTaux();
}

// Année du footer
const anneeActuelle = document.getElementById("annee");
if (anneeActuelle) anneeActuelle.textContent = new Date().getFullYear();
