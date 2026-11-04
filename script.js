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
const resultat = document.getElementById("resultat");

pays.forEach((p, i) => {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = `${p.nom} — ${p.taux} %`;
  selPays.appendChild(opt);
});

document.getElementById("annee").textContent = new Date().getFullYear();

selPays.addEventListener("change", () => {
  inputTaux.value = pays[selPays.value].taux;
  calculer();
});

[inputMontant, inputTaux].forEach(el => el.addEventListener("input", calculer));
document.querySelectorAll('input[name="mode"]').forEach(r => r.addEventListener("change", calculer));

function formatNombre(n) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calculer() {
  const montant = parseFloat(inputMontant.value);
  const taux = parseFloat(inputTaux.value);
  const mode = document.querySelector('input[name="mode"]:checked').value;

  if (isNaN(montant) || montant <= 0 || isNaN(taux) || taux < 0) {
    resultat.innerHTML = "<p>Entrez un montant et un taux valides pour voir le résultat.</p>";
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

  resultat.innerHTML = `
    <p>Montant HT : <strong>${formatNombre(ht)}</strong></p>
    <p>TVA (${taux} %) : <strong>${formatNombre(tva)}</strong></p>
    <p>Montant TTC : <strong>${formatNombre(ttc)}</strong></p>
  `;
}

calculer();
