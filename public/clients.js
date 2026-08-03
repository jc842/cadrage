/* ─────────────────────────────────────────────────────────────
   LES4H · Cadrage digital — configuration des clients
   Le client est déduit du sous-domaine (esperance.les4h.fr → "esperance"),
   avec repli sur ?c=cle pour les tests en local.

   Champs :
     nom        : raison sociale affichée
     domaine    : site concerné
     secteur    : eyebrow affiché en ouverture
     modules    : blocs de questions conditionnels activés
                  ("ecommerce" | "reservation" | "pointdevente" | "b2b"
                   | "groupe" | "association" | "campagne")
     accroche   : phrase d'introduction propre au client (optionnelle)
     endpoint   : webhook de collecte (n8n / Zoho Flow). Laisser vide
                  pour utiliser ENDPOINT_DEFAUT défini dans questionnaire.js
   ───────────────────────────────────────────────────────────── */

window.LES4H_CLIENTS = {

  /* ── Commerces & services ──────────────────────────────── */

  esperance: {
    nom: "Espérance Coaching",
    domaine: "esperance-coaching.fr",
    secteur: "Remise en forme & balnéothérapie · Les Abymes",
    modules: ["reservation", "pointdevente"],
    accroche: "Votre site présente vos activités, mais les réservations partent aujourd'hui vers un outil externe. " +
              "Ce questionnaire doit nous dire ce que le site doit porter demain : le planning, l'inscription, la fidélisation — ou rester une vitrine."
  },

  bellesrives: {
    nom: "Belles Rives — Oikos",
    domaine: "bellesrives-immobilier.com",
    secteur: "Promotion immobilière VEFA · Saint-François",
    modules: ["campagne"],
    accroche: "Le programme approche de sa commercialisation finale. La question centrale est celle de l'après : " +
              "on arrête, on archive, ou on recycle l'audience acquise vers un prochain programme."
  },

  greenlodge: {
    nom: "Green Lodge Guadeloupe",
    domaine: "greenlodgeguadeloupe.com",
    secteur: "Hébergement touristique · Sainte-Rose",
    modules: ["reservation"],
    accroche: "Votre site gère aujourd'hui les disponibilités et la réservation en direct. " +
              "L'enjeu : savoir quelle part de vos nuitées doit passer par lui plutôt que par les plateformes."
  },

  atmosphere: {
    nom: "Atmosphère Déco",
    domaine: "atmosphere-deco.com",
    secteur: "Home concept store · Jarry, Baie-Mahault",
    modules: ["ecommerce", "pointdevente"],
    accroche: "Boutique en ligne et magasin physique se nourrissent l'un l'autre. " +
              "Ce cadrage sert à décider où placer l'effort : le catalogue, la conversion, ou le trafic en magasin."
  },

  cash: {
    nom: "Cash Affaires",
    domaine: "cash-affaires.fr",
    secteur: "Commerce & bonnes affaires · Guadeloupe",
    modules: ["pointdevente"],
    accroche: "Votre présence en ligne est volontairement légère et rapide. " +
              "La question est de savoir si elle doit le rester, ou passer à l'étape suivante."
  },

  pulsat: {
    nom: "Pulsat Guadeloupe",
    domaine: "pulsatguadeloupe.com",
    secteur: "Électroménager & multimédia · Guadeloupe",
    modules: ["ecommerce", "pointdevente"],
    accroche: "Votre boutique en ligne a connu des épisodes de saturation liés à sa technologie actuelle. " +
              "Avant de trancher techniquement, il faut savoir ce que la vente en ligne doit peser dans votre activité."
  },

  "123bonheur": {
    nom: "Peggy Prince — 123bonheur",
    domaine: "123bonheur.fr",
    secteur: "Accompagnement de dirigeants · Guadeloupe",
    modules: ["reservation"],
    accroche: "Votre site porte une marque personnelle et un discours. " +
              "L'enjeu est la conversion : combien de séances découvertes il doit générer, et par quel chemin."
  },

  /* ── Groupe CPG · menuiserie ───────────────────────────── */

  alubat971: {
    nom: "Alubat Guadeloupe",
    domaine: "alubat971.com",
    secteur: "Menuiserie aluminium · Guadeloupe · Groupe CPG",
    modules: ["b2b", "groupe"],
    accroche: "Votre site est le premier du groupe à être refondu sur une base plus rapide et plus économe. " +
              "Vos réponses détermineront ce que ce nouveau socle doit savoir faire — pour vous, puis pour les autres sites du groupe."
  },

  alubat972: {
    nom: "Alubat Martinique",
    domaine: "alubat972.com",
    secteur: "Menuiserie aluminium · Martinique · Groupe CPG",
    modules: ["b2b", "groupe"],
    accroche: "Le groupe engage une refonte progressive de ses sites. " +
              "Ce questionnaire sert à savoir ce qui doit rester commun à toutes les entités, et ce qui doit rester propre à la Martinique."
  },

  alubat973: {
    nom: "Alubat Guyane",
    domaine: "alubat973.com",
    secteur: "Menuiserie aluminium · Guyane · Groupe CPG",
    modules: ["b2b", "groupe"],
    accroche: "Le groupe engage une refonte progressive de ses sites. " +
              "Ce questionnaire sert à savoir ce qui doit rester commun à toutes les entités, et ce qui doit rester propre à la Guyane."
  },

  iris: {
    nom: "IRIS Fenêtres",
    domaine: "iris-fenetres.com",
    secteur: "Menuiseries & pose · Paris et Île-de-France · Groupe CPG",
    modules: ["b2b", "groupe", "pointdevente"],
    accroche: "Quatre agences, un blog actif, des demandes de devis en continu : votre site est déjà un outil commercial. " +
              "L'enjeu est d'en mesurer le rendement et de décider où pousser."
  },

  smt: {
    nom: "Menuiseries SMT",
    domaine: "menuiseries-smt.com",
    secteur: "Fabrication de menuiseries · Troyes · Groupe CPG",
    modules: ["b2b", "groupe"],
    accroche: "Site d'usine et de savoir-faire, adossé à un réseau. " +
              "Ce cadrage doit dire à qui il parle en priorité : prescripteurs, clients finaux, ou candidats."
  },

  /* ── Associations ──────────────────────────────────────── */

  ossegua: {
    nom: "OSSEGUA",
    domaine: "ossegua.com",
    secteur: "Association environnementale · Guadeloupe",
    modules: ["association"],
    accroche: "Votre site est aujourd'hui une page de mobilisation. " +
              "La question est de savoir s'il doit rester un manifeste, ou devenir un outil d'adhésion et de plaidoyer."
  },

  chloe: {
    nom: "Tous avec Chloé",
    domaine: "tous-avec-chloe.fr",
    secteur: "Association · Autisme · Guadeloupe",
    modules: ["association"],
    accroche: "Le site n'a plus été alimenté depuis plusieurs années. " +
              "Avant toute dépense, il faut décider ensemble : on réactive, on archive proprement, ou on repart d'une page unique."
  }
};

/* Client par défaut si le sous-domaine n'est pas reconnu (démonstration). */
window.LES4H_CLIENT_DEFAUT = {
  nom: "Votre entreprise",
  domaine: "—",
  secteur: "Enquête de positionnement",
  modules: [],
  accroche: ""
};
