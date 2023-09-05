// Liste des citations
const citations = [
    "Il atteint les limites de la souffrance humaine sans jamais trahir un seul secret, lui qui les savait tous (Soeur de Jean Moulin)",
    "L'impossible n'est pas francais (N. Bonaparte)",
    "L'histoire est une suite de mensonges sur lesquels on est d'accord (N. Bonaparte)",
    "Rien n'est plus puissant qu'une idee dont l'heure est venue (V. Hugo)",
    "La liberte commence ou l'ignorance finit (V. Hugo)",
    "Respecte le passe, crains le futur, mais agis dans le present avec clairvoyance et audace (V. Hugo)",
    "J'entends toutes les voix de ceux qui se sont tus (S. Veil)",
    "Les Francais sont des veaux (C. DeGaulle)",
];

// Fonction pour choisir une citation aléatoire
function choisirCitationAleatoire() {
    const indexAleatoire = Math.floor(Math.random() * citations.length);
    return citations[indexAleatoire];
}

// Afficher une citation aléatoire sur la page
const citationElement = document.getElementById("citation");
citationElement.textContent = choisirCitationAleatoire();