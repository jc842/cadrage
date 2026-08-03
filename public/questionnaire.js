/* ─────────────────────────────────────────────────────────────
   LES4H · Cadrage digital — moteur du questionnaire
   Aucune dépendance externe. Rendu dynamique depuis BANQUE.
   ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* Webhook de collecte par défaut (n8n / Zoho Flow).
     Peut être surchargé par client dans clients.js. */
  var ENDPOINT_DEFAUT = '';

  /* ═══ 1. Résolution du client ═══════════════════════════════ */

  function resoudreClient() {
    var cles = Object.keys(window.LES4H_CLIENTS || {});
    var params = new URLSearchParams(location.search);
    var force = params.get('c');
    if (force && window.LES4H_CLIENTS[force]) {
      return { cle: force, cfg: window.LES4H_CLIENTS[force] };
    }
    var label = location.hostname.split('.')[0].toLowerCase();
    if (window.LES4H_CLIENTS[label]) {
      return { cle: label, cfg: window.LES4H_CLIENTS[label] };
    }
    for (var i = 0; i < cles.length; i++) {
      if (label.indexOf(cles[i]) === 0) return { cle: cles[i], cfg: window.LES4H_CLIENTS[cles[i]] };
    }
    return { cle: 'demo', cfg: window.LES4H_CLIENT_DEFAUT };
  }

  var C = resoudreClient();
  var CLIENT = C.cfg;
  var CLE = C.cle;
  var MODULES = CLIENT.modules || [];
  var a = function (m) { return MODULES.indexOf(m) !== -1; };

  /* ═══ 2. Banque de questions ════════════════════════════════ */
  /* type : text | email | tel | textarea | radio | check | echelle
     poids : question clé pour le signal de positionnement
     flou  : option qui traduit une absence de position                */

  var BANQUE = [
    {
      id: 'reperes',
      titre: 'Qui répond, et à quel titre',
      intro: 'Seule cette section est obligatoire. Tout le reste peut rester vide si la réponse ne vous vient pas — ' +
             'une case non cochée est aussi une information.',
      questions: [
        { id: 'contact_nom', type: 'text', libelle: 'Nom et fonction', requis: true, placeholder: 'Ex. Marie Dupont — gérante' },
        { id: 'contact_email', type: 'email', libelle: 'E-mail', requis: true, placeholder: 'vous@exemple.fr' },
        { id: 'contact_tel', type: 'tel', libelle: 'Téléphone', aide: 'Facultatif — utile si un point de 15 minutes suffit à trancher.' },
        {
          id: 'decision_role', type: 'radio', libelle: 'Sur ce sujet, vous êtes',
          options: [
            { v: 'decideur', t: 'Le décideur — vous validez le budget' },
            { v: 'codecideur', t: 'Co-décideur — la décision se prend à plusieurs' },
            { v: 'relais', t: 'Relais — vous préparez la décision de quelqu\'un d\'autre' }
          ]
        }
      ]
    },

    {
      id: 'role',
      titre: 'Ce que votre site doit faire',
      intro: 'Un site qui doit tout faire ne fait rien correctement. Nous cherchons ici la fonction principale, ' +
             'celle qui justifie à elle seule que le site existe.',
      questions: [
        {
          id: 'role_principal', type: 'radio', poids: 3,
          libelle: 'Si votre site ne devait servir qu\'à une seule chose, ce serait',
          options: [
            { v: 'vitrine', t: 'Exister et rassurer', s: 'Prouver que l\'entreprise est sérieuse quand on la cherche' },
            { v: 'leads', t: 'Générer des demandes', s: 'Devis, contacts, appels entrants qualifiés' },
            { v: 'vente', t: 'Vendre en ligne', s: 'Encaisser directement sur le site' },
            { v: 'reservation', t: 'Prendre des réservations ou des rendez-vous' },
            { v: 'fideliser', t: 'Informer et fidéliser', s: 'Une audience ou des adhérents déjà acquis' },
            { v: 'recruter', t: 'Recruter', s: 'Attirer des candidats et des partenaires' },
            { v: 'indecis', t: 'Je ne sais pas encore', s: 'À définir ensemble', flou: true }
          ]
        },
        {
          id: 'role_secondaires', type: 'check', max: 3,
          libelle: 'Et en second rideau, jusqu\'à trois rôles utiles',
          colonnes: 2,
          options: [
            { v: 'vitrine', t: 'Exister et rassurer' }, { v: 'leads', t: 'Générer des demandes' },
            { v: 'vente', t: 'Vendre en ligne' }, { v: 'reservation', t: 'Réservations / rendez-vous' },
            { v: 'fideliser', t: 'Informer et fidéliser' }, { v: 'recruter', t: 'Recruter' },
            { v: 'sav', t: 'Répondre aux questions du service après-vente' },
            { v: 'documentation', t: 'Mettre de la documentation à disposition' }
          ]
        },
        {
          id: 'audience', type: 'check', max: 3, colonnes: 2,
          libelle: 'À qui parlez-vous en priorité',
          options: [
            { v: 'part_local', t: 'Particuliers du territoire' },
            { v: 'part_ext', t: 'Particuliers hors du territoire' },
            { v: 'pros', t: 'Entreprises et professionnels' },
            { v: 'prescripteurs', t: 'Prescripteurs', s: 'Architectes, bureaux d\'études, agences' },
            { v: 'institutions', t: 'Institutions et collectivités' },
            { v: 'visiteurs', t: 'Touristes et visiteurs' },
            { v: 'candidats', t: 'Candidats à l\'embauche' },
            { v: 'adherents', t: 'Adhérents, donateurs, bénéficiaires' }
          ]
        },
        {
          id: 'utilite_actuelle', type: 'echelle', poids: 2,
          libelle: 'Aujourd\'hui, votre site vous rapporte-t-il quelque chose de concret',
          bornes: ['Rien de mesurable', 'Un flux régulier et identifié']
        },
        {
          id: 'reference', type: 'textarea',
          libelle: 'Un site que vous trouvez efficace, et pourquoi',
          aide: 'Concurrent ou non, peu importe le secteur. C\'est souvent la réponse la plus utile du questionnaire.',
          placeholder: 'Ex. celui de X : on comprend en 5 secondes ce qu\'ils font et on trouve le prix.'
        }
      ]
    },

    {
      id: 'objectifs',
      titre: 'Vos objectifs et leur mesure',
      intro: 'Un objectif sans chiffre reste un souhait. Même une estimation approximative nous suffit pour calibrer.',
      questions: [
        {
          id: 'objectifs_12m', type: 'check', max: 3, poids: 2, colonnes: 2,
          libelle: 'Vos trois priorités pour les douze prochains mois',
          options: [
            { v: 'demandes', t: 'Recevoir plus de demandes entrantes' },
            { v: 'ventes', t: 'Vendre davantage en ligne' },
            { v: 'remplissage', t: 'Remplir un planning ou un taux d\'occupation' },
            { v: 'temps', t: 'Passer moins de temps au téléphone et en mails' },
            { v: 'credibilite', t: 'Gagner en crédibilité face à la concurrence' },
            { v: 'marche', t: 'Ouvrir un nouveau marché ou territoire' },
            { v: 'recrutement', t: 'Recruter' },
            { v: 'couts', t: 'Réduire ce que me coûte mon site' },
            { v: 'aucun', t: 'Aucun objectif chiffré à ce stade', flou: true }
          ]
        },
        {
          id: 'kpi', type: 'radio', poids: 2,
          libelle: 'Comment saurez-vous que ça marche',
          options: [
            { v: 'contacts', t: 'Au nombre d\'appels et de mails reçus' },
            { v: 'devis', t: 'Au nombre de devis signés' },
            { v: 'ca', t: 'Au chiffre d\'affaires réalisé en ligne' },
            { v: 'resa', t: 'Au nombre de réservations' },
            { v: 'trafic', t: 'Au nombre de visites' },
            { v: 'position', t: 'À ma position sur Google' },
            { v: 'rien', t: 'Je ne mesure rien aujourd\'hui', flou: true }
          ]
        },
        {
          id: 'volume_actuel', type: 'radio',
          libelle: 'Combien de contacts le site vous apporte-t-il par mois aujourd\'hui',
          options: [
            { v: '0', t: 'Aucun, ou je n\'en ai pas conscience' }, { v: '1-5', t: '1 à 5' },
            { v: '6-20', t: '6 à 20' }, { v: '21-50', t: '21 à 50' }, { v: '50+', t: 'Plus de 50' },
            { v: 'nsp', t: 'Je ne sais pas', flou: true }
          ]
        },
        {
          id: 'volume_cible', type: 'text',
          libelle: 'Et dans douze mois, ce serait bien d\'arriver à',
          placeholder: 'Ex. 15 demandes de devis par mois, dont 3 signées'
        },
        {
          id: 'saisonnalite', type: 'textarea',
          libelle: 'Vos pics et vos creux dans l\'année',
          aide: 'Facultatif. Détermine quand il faut pousser, et quand on peut intervenir sans risque.',
          placeholder: 'Ex. forte activité de novembre à mars, très calme en septembre.'
        }
      ]
    },

    {
      id: 'contenu',
      titre: 'Votre contenu et votre autonomie',
      intro: 'C\'est la section qui décide de la technologie. Un site qui bouge tous les jours et un site ' +
             'qui bouge trois fois par an ne demandent ni les mêmes outils, ni le même budget.',
      questions: [
        {
          id: 'frequence_maj', type: 'radio', poids: 3,
          libelle: 'À quelle fréquence le contenu de votre site doit-il changer',
          options: [
            { v: 'rare', t: 'Presque jamais', s: 'Quelques corrections par an' },
            { v: 'trimestre', t: 'Une fois par trimestre' },
            { v: 'mois', t: 'Une fois par mois' },
            { v: 'semaine', t: 'Toutes les semaines' },
            { v: 'quotidien', t: 'Plusieurs fois par semaine' },
            { v: 'nsp', t: 'Je ne sais pas', flou: true }
          ]
        },
        {
          id: 'qui_edite', type: 'radio', poids: 2,
          libelle: 'Qui met le site à jour',
          options: [
            { v: 'les4h', t: 'Personne en interne', s: 'Je préfère demander à LES4H' },
            { v: 'occasionnel', t: 'Quelqu\'un en interne, de temps en temps' },
            { v: 'dedie', t: 'Une personne dédiée en interne' },
            { v: 'externe', t: 'Un prestataire ou une agence' },
            { v: 'nsp', t: 'Ce n\'est pas encore défini', flou: true }
          ]
        },
        {
          id: 'autonomie', type: 'echelle', poids: 2,
          libelle: 'Votre envie de modifier le site vous-même',
          bornes: ['Je délègue entièrement', 'Je veux tout pouvoir modifier']
        },
        {
          id: 'types_contenu', type: 'check', colonnes: 2,
          libelle: 'Ce que le site doit héberger',
          options: [
            { v: 'actus', t: 'Actualités, articles, blog' },
            { v: 'catalogue', t: 'Catalogue de produits ou de gammes' },
            { v: 'realisations', t: 'Réalisations, chantiers, références' },
            { v: 'tarifs', t: 'Tarifs' },
            { v: 'planning', t: 'Plannings et horaires' },
            { v: 'emploi', t: 'Offres d\'emploi' },
            { v: 'docs', t: 'Documents à télécharger', s: 'PDF, notices, fiches techniques' },
            { v: 'medias', t: 'Photos et vidéos en quantité' },
            { v: 'avis', t: 'Avis et témoignages clients' }
          ]
        },
        {
          id: 'volume_pages', type: 'radio',
          libelle: 'La taille approximative du site',
          options: [
            { v: '<10', t: 'Moins de 10 pages' }, { v: '10-30', t: '10 à 30 pages' },
            { v: '30-100', t: '30 à 100 pages' }, { v: '100+', t: 'Plus de 100 pages' },
            { v: 'nsp', t: 'Aucune idée', flou: true }
          ]
        },
        {
          id: 'douleurs', type: 'check', colonnes: 2,
          libelle: 'Ce qui vous agace aujourd\'hui',
          options: [
            { v: 'lent', t: 'Il est lent' }, { v: 'edition', t: 'Il est pénible à modifier' },
            { v: 'obsolete', t: 'Il n\'est plus à jour' }, { v: 'vieilli', t: 'Il a mal vieilli visuellement' },
            { v: 'invisible', t: 'On ne le trouve pas sur Google' }, { v: 'mobile', t: 'Il est mal adapté au mobile' },
            { v: 'pannes', t: 'Il tombe ou devient inaccessible' }, { v: 'cout', t: 'Il me coûte trop cher' },
            { v: 'rien', t: 'Rien à signaler, il me convient' }
          ]
        }
      ]
    },

    {
      id: 'fonctions',
      titre: 'Les fonctions attendues',
      intro: 'Cochez ce dont vous avez réellement besoin. Chaque fonction ajoutée a un coût de maintenance ' +
             'et une surface de risque : mieux vaut en assumer trois que d\'en subir douze.',
      questions: [
        {
          id: 'fonctions', type: 'check', colonnes: 2,
          libelle: 'Ce que le site doit permettre',
          options: [
            { v: 'contact', t: 'Formulaire de contact' },
            { v: 'devis', t: 'Demande de devis structurée' },
            { v: 'rdv', t: 'Prise de rendez-vous en ligne' },
            { v: 'paiement', t: 'Paiement en ligne' },
            { v: 'espace', t: 'Espace client ou espace pro' },
            { v: 'cataloguecons', t: 'Catalogue consultable et filtrable' },
            { v: 'recherche', t: 'Moteur de recherche interne' },
            { v: 'multilingue', t: 'Version anglaise ou espagnole' },
            { v: 'whatsapp', t: 'Chat ou bouton WhatsApp' },
            { v: 'newsletter', t: 'Newsletter' },
            { v: 'avisint', t: 'Collecte d\'avis clients' },
            { v: 'carte', t: 'Carte et itinéraire vers vos points de vente' }
          ]
        },

        /* ── Bloc e-commerce ─────────────────────────────── */
        {
          bloc: 'ecommerce', modules: ['ecommerce'], mention: 'Vente en ligne',
          questions: [
            {
              id: 'ec_references', type: 'radio', libelle: 'Nombre de références à publier',
              options: [
                { v: '<50', t: 'Moins de 50' }, { v: '50-500', t: '50 à 500' },
                { v: '500-5000', t: '500 à 5 000' }, { v: '5000+', t: 'Plus de 5 000' },
                { v: 'nsp', t: 'Je ne sais pas', flou: true }
              ]
            },
            {
              id: 'ec_part_ca', type: 'radio', libelle: 'Part de votre chiffre d\'affaires réalisée en ligne aujourd\'hui',
              options: [
                { v: '0', t: 'Nulle ou négligeable' }, { v: '<5', t: 'Moins de 5 %' },
                { v: '5-20', t: '5 à 20 %' }, { v: '20+', t: 'Plus de 20 %' },
                { v: 'nsp', t: 'Je ne sais pas', flou: true }
              ]
            },
            {
              id: 'ec_cible', type: 'radio', libelle: 'Ce que vous visez dans deux ans',
              options: [
                { v: 'stable', t: 'La même chose, le site sert surtout de vitrine' },
                { v: 'double', t: 'Doubler la part réalisée en ligne' },
                { v: 'canal', t: 'Faire de la vente en ligne un canal majeur' },
                { v: 'arret', t: 'Arrêter la vente en ligne' },
                { v: 'nsp', t: 'À arbitrer', flou: true }
              ]
            },
            {
              id: 'ec_stock', type: 'radio', libelle: 'Gestion des stocks',
              options: [
                { v: 'manuel', t: 'Saisie manuelle dans le site' },
                { v: 'caisse', t: 'Synchronisation souhaitée avec la caisse ou l\'ERP' },
                { v: 'aucun', t: 'Pas de gestion de stock, tout est sur commande' },
                { v: 'nsp', t: 'À définir', flou: true }
              ]
            },
            {
              id: 'ec_logistique', type: 'check', colonnes: 2, libelle: 'Modes de livraison à gérer',
              options: [
                { v: 'retrait', t: 'Retrait en magasin' }, { v: 'local', t: 'Livraison locale' },
                { v: 'iles', t: 'Livraison inter-îles' }, { v: 'hexagone', t: 'Expédition vers l\'Hexagone' },
                { v: 'transporteur', t: 'Transporteur pour produits volumineux' }
              ]
            }
          ]
        },

        /* ── Bloc réservation ────────────────────────────── */
        {
          bloc: 'reservation', modules: ['reservation'], mention: 'Réservation & rendez-vous',
          questions: [
            {
              id: 're_canal', type: 'radio', libelle: 'Par où passent les réservations aujourd\'hui',
              options: [
                { v: 'tel', t: 'Téléphone et WhatsApp' },
                { v: 'plateforme', t: 'Une plateforme externe', s: 'Airbnb, Booking, logiciel de réservation…' },
                { v: 'formulaire', t: 'Un formulaire sur le site, traité à la main' },
                { v: 'site', t: 'Directement en ligne sur le site' }
              ]
            },
            {
              id: 're_direct', type: 'radio', libelle: 'Part des réservations en direct, hors plateformes',
              options: [
                { v: '<25', t: 'Moins d\'un quart' }, { v: '25-50', t: 'Un quart à la moitié' },
                { v: '50+', t: 'Plus de la moitié' }, { v: 'nsp', t: 'Je ne sais pas', flou: true }
              ]
            },
            {
              id: 're_ambition', type: 'radio', libelle: 'Ce que vous voulez changer',
              options: [
                { v: 'reprendre', t: 'Reprendre la main sur les plateformes et leurs commissions' },
                { v: 'automatiser', t: 'Automatiser ce qui est traité à la main aujourd\'hui' },
                { v: 'remplir', t: 'Remplir les périodes creuses' },
                { v: 'rien', t: 'Rien, l\'organisation actuelle me convient' }
              ]
            },
            {
              id: 're_paiement', type: 'radio', libelle: 'Acompte ou paiement à la réservation',
              options: [
                { v: 'oui', t: 'Oui, c\'est indispensable' }, { v: 'souhaitable', t: 'Souhaitable, sans plus' },
                { v: 'non', t: 'Non, le paiement se fait sur place' }
              ]
            }
          ]
        },

        /* ── Bloc point de vente ─────────────────────────── */
        {
          bloc: 'pointdevente', modules: ['pointdevente'], mention: 'Points de vente & accueil physique',
          questions: [
            {
              id: 'pv_nombre', type: 'radio', libelle: 'Nombre de lieux ouverts au public',
              options: [
                { v: '1', t: 'Un seul' }, { v: '2-4', t: 'Deux à quatre' },
                { v: '5+', t: 'Cinq ou plus' }, { v: '0', t: 'Aucun, activité sans accueil physique' }
              ]
            },
            {
              id: 'pv_fiche', type: 'radio', libelle: 'Votre fiche Google Business',
              options: [
                { v: 'ajour', t: 'À jour et animée' }, { v: 'existe', t: 'Elle existe, mais je ne la touche jamais' },
                { v: 'incertain', t: 'Je ne sais pas si elle est juste', flou: true },
                { v: 'aucune', t: 'Je n\'en ai pas' }
              ]
            },
            {
              id: 'pv_trafic', type: 'echelle',
              libelle: 'Part de vos visiteurs en magasin qui viennent après avoir consulté le web',
              bornes: ['Négligeable', 'La majorité']
            }
          ]
        },

        /* ── Bloc B2B / technique ────────────────────────── */
        {
          bloc: 'b2b', modules: ['b2b'], mention: 'Prescription & documentation technique',
          questions: [
            {
              id: 'b2b_docs', type: 'check', colonnes: 2,
              libelle: 'Documents que vos clients ou vos équipes réclament le plus souvent',
              options: [
                { v: 'fiches', t: 'Fiches produits et gammes' }, { v: 'notices', t: 'Notices de pose et d\'entretien' },
                { v: 'certifs', t: 'Certifications, avis techniques, PV d\'essais' },
                { v: 'plans', t: 'Plans, DWG, détails de menuiserie' },
                { v: 'tarifs_pro', t: 'Tarifs professionnels' }, { v: 'garanties', t: 'Garanties et conditions de SAV' }
              ]
            },
            {
              id: 'b2b_etat_docs', type: 'radio', libelle: 'État de cette documentation',
              options: [
                { v: 'structure', t: 'Complète, à jour, bien rangée' },
                { v: 'disperse', t: 'Existante mais dispersée', s: 'Mails, Drive, classeurs, têtes de personnes' },
                { v: 'lacunaire', t: 'Lacunaire, il faudrait la reconstituer' },
                { v: 'nsp', t: 'Je ne sais pas', flou: true }
              ]
            },
            {
              id: 'b2b_espace', type: 'radio', libelle: 'Un espace réservé aux professionnels',
              options: [
                { v: 'oui', t: 'Oui, avec accès contrôlé' },
                { v: 'libre', t: 'Non, tout doit rester en accès libre' },
                { v: 'nsp', t: 'À étudier', flou: true }
              ]
            },
            {
              id: 'b2b_prescripteurs', type: 'radio', libelle: 'Poids des prescripteurs dans votre activité',
              options: [
                { v: 'majeur', t: 'Majeur — ils décident de nos affaires' },
                { v: 'complement', t: 'Réel mais complémentaire' },
                { v: 'faible', t: 'Faible, nous travaillons surtout en direct' }
              ]
            }
          ]
        },

        /* ── Bloc groupe ─────────────────────────────────── */
        {
          bloc: 'groupe', modules: ['groupe'], mention: 'Cohérence de groupe',
          questions: [
            {
              id: 'gr_modele', type: 'radio', poids: 2,
              libelle: 'Le modèle qui vous paraît juste pour les sites du groupe',
              options: [
                { v: 'independant', t: 'Chaque entité garde son site, indépendant' },
                { v: 'socle', t: 'Un socle commun, décliné par territoire', s: 'Même structure, contenus locaux' },
                { v: 'unique', t: 'Un seul site multi-territoires' },
                { v: 'nsp', t: 'Ce n\'est pas arbitré', flou: true }
              ]
            },
            {
              id: 'gr_coherence', type: 'echelle',
              libelle: 'Cohérence perçue aujourd\'hui entre les sites du groupe',
              bornes: ['Chacun fait à sa façon', 'Parfaitement homogène']
            },
            {
              id: 'gr_decision', type: 'radio', libelle: 'Qui tranche sur le site de votre entité',
              options: [
                { v: 'local', t: 'La direction locale' },
                { v: 'siege', t: 'Le siège du groupe' },
                { v: 'partage', t: 'Les deux, selon le sujet' },
                { v: 'nsp', t: 'Pas clair', flou: true }
              ]
            }
          ]
        },

        /* ── Bloc association ────────────────────────────── */
        {
          bloc: 'association', modules: ['association'], mention: 'Vie associative',
          questions: [
            {
              id: 'as_priorite', type: 'radio', poids: 2, libelle: 'Ce que le site doit servir en premier',
              options: [
                { v: 'adhesion', t: 'Recruter des adhérents' },
                { v: 'dons', t: 'Collecter des dons' },
                { v: 'plaidoyer', t: 'Peser dans le débat public', s: 'Presse, élus, institutions' },
                { v: 'info', t: 'Informer les bénéficiaires et les familles' },
                { v: 'evenements', t: 'Mobiliser autour d\'événements' },
                { v: 'nsp', t: 'À définir en bureau', flou: true }
              ]
            },
            {
              id: 'as_paiement', type: 'radio', libelle: 'Adhésions et dons en ligne',
              options: [
                { v: 'oui', t: 'Oui, avec reçu fiscal automatique' },
                { v: 'simple', t: 'Oui, sans reçu automatique' },
                { v: 'non', t: 'Non, tout se fait hors ligne' },
                { v: 'nsp', t: 'À étudier', flou: true }
              ]
            },
            {
              id: 'as_animation', type: 'radio', libelle: 'Qui peut animer le site dans la durée',
              options: [
                { v: 'benevole', t: 'Un bénévole identifié et disponible' },
                { v: 'irregulier', t: 'Un bénévole, mais de façon irrégulière' },
                { v: 'personne', t: 'Personne, il faut que ça tourne seul' }
              ]
            },
            {
              id: 'as_budget', type: 'radio', libelle: 'Budget annuel mobilisable pour le numérique',
              options: [
                { v: '<200', t: 'Moins de 200 €' }, { v: '200-600', t: '200 à 600 €' },
                { v: '600-1500', t: '600 à 1 500 €' }, { v: '1500+', t: 'Plus de 1 500 €' },
                { v: 'subvention', t: 'Conditionné à une subvention' }
              ]
            }
          ]
        },

        /* ── Bloc campagne ───────────────────────────────── */
        {
          bloc: 'campagne', modules: ['campagne'], mention: 'Cycle de vie du programme',
          questions: [
            {
              id: 'ca_horizon', type: 'radio', poids: 2, libelle: 'Horizon de commercialisation restant',
              options: [
                { v: '<6', t: 'Moins de 6 mois' }, { v: '6-12', t: '6 à 12 mois' },
                { v: '12+', t: 'Plus de 12 mois' }, { v: 'nsp', t: 'Indéterminé', flou: true }
              ]
            },
            {
              id: 'ca_apres', type: 'radio', poids: 2, libelle: 'Une fois le programme vendu, le site doit',
              options: [
                { v: 'archive', t: 'Être archivé et coupé' },
                { v: 'redirige', t: 'Rediriger vers le site de la structure' },
                { v: 'vitrine', t: 'Rester en ligne comme référence de réalisation' },
                { v: 'recycle', t: 'Servir de socle au programme suivant' },
                { v: 'nsp', t: 'Non décidé', flou: true }
              ]
            },
            {
              id: 'ca_audience', type: 'radio', libelle: 'L\'audience et les contacts déjà collectés',
              options: [
                { v: 'reutiliser', t: 'Doivent être conservés et réutilisés' },
                { v: 'transferer', t: 'Doivent être transférés à l\'agence commerciale' },
                { v: 'purger', t: 'Peuvent être purgés' },
                { v: 'nsp', t: 'À trancher', flou: true }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'visibilite',
      titre: 'Votre visibilité, y compris auprès des IA',
      intro: 'Une part croissante des recherches n\'aboutit plus à un clic : le client pose sa question à une IA ' +
             'et lit la réponse. Être présent dans cette réponse relève d\'un travail différent du référencement classique.',
      questions: [
        {
          id: 'canaux', type: 'check', colonnes: 2,
          libelle: 'D\'où viennent vos clients aujourd\'hui',
          options: [
            { v: 'bouche', t: 'Bouche-à-oreille' }, { v: 'google', t: 'Recherche Google' },
            { v: 'gbp', t: 'Fiche Google Business' }, { v: 'facebook', t: 'Facebook' },
            { v: 'instagram', t: 'Instagram' }, { v: 'linkedin', t: 'LinkedIn' },
            { v: 'whatsapp', t: 'WhatsApp' }, { v: 'pub', t: 'Publicité payante' },
            { v: 'annuaires', t: 'Annuaires et plateformes' }, { v: 'presse', t: 'Presse et radio locales' }
          ]
        },
        {
          id: 'seo_position', type: 'radio',
          libelle: 'Quand on cherche votre métier suivi de votre ville, vous apparaissez',
          options: [
            { v: 'top3', t: 'Dans les trois premiers résultats' },
            { v: 'p1', t: 'Sur la première page' },
            { v: 'audela', t: 'Au-delà de la première page' },
            { v: 'nsp', t: 'Je n\'ai jamais vérifié', flou: true }
          ]
        },
        {
          id: 'ia_volonte', type: 'radio', poids: 2,
          libelle: 'Souhaitez-vous que votre entreprise figure dans les réponses des IA',
          aide: 'ChatGPT, Gemini, Copilot, et le résumé qui s\'affiche désormais en haut des résultats Google.',
          options: [
            { v: 'prioritaire', t: 'Oui, c\'est une priorité' },
            { v: 'terme', t: 'Oui, mais à terme' },
            { v: 'sceptique', t: 'Je n\'y crois pas beaucoup' },
            { v: 'decouvre', t: 'Je découvre le sujet', flou: true }
          ]
        },
        {
          id: 'ia_test', type: 'radio',
          libelle: 'Avez-vous déjà demandé à une IA ce qu\'elle sait de votre entreprise',
          options: [
            { v: 'juste', t: 'Oui, et les informations sont justes' },
            { v: 'faux', t: 'Oui, et il y a des erreurs ou des informations périmées' },
            { v: 'absent', t: 'Oui, et je n\'apparais pas du tout' },
            { v: 'jamais', t: 'Jamais testé' }
          ]
        },
        {
          id: 'corpus', type: 'radio', poids: 2,
          libelle: 'Disposez-vous d\'un fonds documentaire que l\'on vous réclame régulièrement',
          aide: 'Fiches, notices, tarifs, procédures, réponses aux questions récurrentes.',
          options: [
            { v: 'volumineux', t: 'Oui, volumineux et tenu à jour' },
            { v: 'disperse', t: 'Oui, mais dispersé et difficile à retrouver' },
            { v: 'peu', t: 'Peu de choses' },
            { v: 'aucun', t: 'Rien de formalisé' }
          ]
        },
        {
          id: 'assistant', type: 'radio',
          libelle: 'Un assistant qui répondrait 24h/24 aux questions courantes à partir de vos documents',
          options: [
            { v: 'utile', t: 'Très utile, ça me libérerait du temps' },
            { v: 'tester', t: 'À tester sur un périmètre limité' },
            { v: 'plustard', t: 'Pas une priorité cette année' },
            { v: 'non', t: 'Non, je préfère le contact humain' }
          ]
        },
        {
          id: 'pub_budget', type: 'radio',
          libelle: 'Votre budget publicitaire actuel',
          options: [
            { v: 'aucun', t: 'Aucun' }, { v: 'ponctuel', t: 'Ponctuel, sur des campagnes' },
            { v: '<200', t: 'Moins de 200 € par mois' }, { v: '200-500', t: '200 à 500 € par mois' },
            { v: '500-2000', t: '500 à 2 000 € par mois' }, { v: '2000+', t: 'Plus de 2 000 € par mois' }
          ]
        }
      ]
    },

    {
      id: 'service',
      titre: 'Vos exigences de service',
      intro: 'Le niveau d\'hébergement se calibre sur le coût d\'une panne, pas sur la taille du site.',
      questions: [
        {
          id: 'criticite', type: 'radio', poids: 2,
          libelle: 'Votre site est indisponible quatre heures, un mardi matin. Que se passe-t-il',
          options: [
            { v: 'rien', t: 'Rien, personne ne s\'en apercevrait' },
            { v: 'genant', t: 'C\'est gênant, sans plus' },
            { v: 'contacts', t: 'Je perds des demandes que je ne rattraperai pas' },
            { v: 'ca', t: 'Je perds du chiffre d\'affaires immédiatement' },
            { v: 'arret', t: 'Une partie de mon activité s\'arrête' }
          ]
        },
        {
          id: 'reactivite', type: 'radio',
          libelle: 'Délai d\'intervention acceptable en cas d\'incident',
          options: [
            { v: '4h', t: 'Quatre heures ouvrées' }, { v: '1j', t: 'Le jour ouvré suivant' },
            { v: '72h', t: 'Deux à trois jours' }, { v: 'semaine', t: 'Dans la semaine' }
          ]
        },
        {
          id: 'exigences', type: 'check', colonnes: 2,
          libelle: 'Ce que vous attendez explicitement de l\'hébergement',
          options: [
            { v: 'sauvegardes', t: 'Sauvegardes quotidiennes' },
            { v: 'restauration', t: 'Restauration rapide en cas de problème' },
            { v: 'surveillance', t: 'Surveillance permanente du site' },
            { v: 'securite', t: 'Protection contre les attaques' },
            { v: 'rgpd', t: 'Conformité RGPD et mentions légales tenues à jour' },
            { v: 'europe', t: 'Hébergement des données en Europe' },
            { v: 'accessibilite', t: 'Accessibilité aux personnes handicapées' },
            { v: 'perf', t: 'Garantie de performance et de vitesse' }
          ]
        },
        {
          id: 'rapport', type: 'radio',
          libelle: 'Un rapport d\'activité sur votre site',
          options: [
            { v: 'mensuel', t: 'Mensuel' }, { v: 'trimestriel', t: 'Trimestriel' },
            { v: 'demande', t: 'À la demande seulement' }, { v: 'inutile', t: 'Inutile, je vous fais confiance' }
          ]
        },
        {
          id: 'canal_contact', type: 'radio',
          libelle: 'Comment préférez-vous nous joindre',
          options: [
            { v: 'whatsapp', t: 'WhatsApp' }, { v: 'mail', t: 'E-mail ou ticket de support' },
            { v: 'tel', t: 'Téléphone' }, { v: 'reunion', t: 'Un point planifié régulier' }
          ]
        }
      ]
    },

    {
      id: 'cadre',
      titre: 'Budget, calendrier et décision',
      intro: 'Dernière ligne droite. Ces réponses évitent de vous présenter une solution hors de portée — ' +
             'ou sous-dimensionnée.',
      questions: [
        {
          id: 'budget_mensuel', type: 'radio', poids: 2,
          libelle: 'Ce que vous êtes prêt à consacrer chaque mois à l\'hébergement et à la maintenance',
          options: [
            { v: '<25', t: 'Moins de 25 € par mois' }, { v: '25-50', t: '25 à 50 € par mois' },
            { v: '50-100', t: '50 à 100 € par mois' }, { v: '100-250', t: '100 à 250 € par mois' },
            { v: '250+', t: 'Plus de 250 € par mois' },
            { v: 'valeur', t: 'À définir selon ce que ça rapporte', flou: true }
          ]
        },
        {
          id: 'budget_projet', type: 'radio',
          libelle: 'Enveloppe pour une évolution ou une refonte ponctuelle',
          options: [
            { v: 'aucune', t: 'Aucune cette année' }, { v: '<1000', t: 'Moins de 1 000 €' },
            { v: '1000-3000', t: '1 000 à 3 000 €' }, { v: '3000-8000', t: '3 000 à 8 000 €' },
            { v: '8000+', t: 'Plus de 8 000 €' }, { v: 'evaluer', t: 'À évaluer au vu de la proposition', flou: true }
          ]
        },
        {
          id: 'horizon', type: 'radio',
          libelle: 'Quand voulez-vous que ce soit fait',
          options: [
            { v: 'immediat', t: 'Le plus vite possible' }, { v: 'trimestre', t: 'Ce trimestre' },
            { v: 'annee', t: 'Dans l\'année' }, { v: 'pasurgent', t: 'Sans urgence particulière' },
            { v: 'evenement', t: 'Conditionné à un événement' }
          ]
        },
        {
          id: 'declencheur', type: 'textarea',
          libelle: 'Une échéance qui commande le calendrier',
          aide: 'Salon, saison touristique, lancement de gamme, fin de programme, audit, contrôle réglementaire…',
          placeholder: 'Ex. le site doit être prêt avant le salon de novembre.'
        },
        {
          id: 'arbitrage', type: 'radio', poids: 3,
          libelle: 'Si vous ne pouviez obtenir qu\'une seule chose cette année',
          options: [
            { v: 'sobriete', t: 'Un site plus rapide et moins cher à entretenir' },
            { v: 'demandes', t: 'Davantage de demandes entrantes' },
            { v: 'vente', t: 'Vendre en ligne, vraiment' },
            { v: 'ia', t: 'Être visible sur Google et dans les réponses des IA' },
            { v: 'image', t: 'Un site dont je n\'ai plus honte' },
            { v: 'statuquo', t: 'Rien de plus, la situation actuelle me convient' }
          ]
        },
        {
          id: 'libre', type: 'textarea',
          libelle: 'Ce que ce questionnaire ne vous a pas demandé',
          placeholder: 'Une contrainte, une inquiétude, une idée, un désaccord.'
        }
      ]
    }
  ];

  /* ═══ 3. Rendu ══════════════════════════════════════════════ */

  var elSections = document.getElementById('sections');
  var elEpine = document.getElementById('epine');
  var visibles = [];   /* questions réellement affichées */

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function moduleActif(q) {
    if (!q.modules) return true;
    for (var i = 0; i < q.modules.length; i++) if (a(q.modules[i])) return true;
    return false;
  }

  function rendreQuestion(q) {
    visibles.push(q);
    var d = document.createElement('div');
    d.className = 'champ';
    d.dataset.qid = q.id;

    var saisie = (q.type === 'text' || q.type === 'email' || q.type === 'tel' || q.type === 'textarea');
    var html = '<label class="libelle" id="' + q.id + '-lab"' + (saisie ? ' for="' + q.id + '"' : '') + '>' +
      esc(q.libelle) + (q.requis ? ' <span class="obl" title="obligatoire">*</span>' : '') + '</label>';
    if (q.aide) html += '<span class="aide">' + esc(q.aide) + '</span>';
    if (q.max) html += '<span class="aide compteur">' + q.max + ' choix maximum</span>';

    if (q.type === 'text' || q.type === 'email' || q.type === 'tel') {
      html += '<input type="' + q.type + '" id="' + q.id + '" name="' + q.id + '" placeholder="' +
        esc(q.placeholder || '') + '"' + (q.requis ? ' required' : '') + '>';
    } else if (q.type === 'textarea') {
      html += '<textarea id="' + q.id + '" name="' + q.id + '" placeholder="' + esc(q.placeholder || '') + '"></textarea>';
    } else if (q.type === 'radio' || q.type === 'check') {
      var t = q.type === 'radio' ? 'radio' : 'checkbox';
      html += '<div class="options" data-colonnes="' + (q.colonnes || 1) + '" role="group" aria-labelledby="' + q.id + '-lab">';
      q.options.forEach(function (o) {
        html += '<label class="option"><input type="' + t + '" name="' + q.id + '" value="' + o.v + '"' +
          (o.flou ? ' data-flou="1"' : '') + '><span>' + esc(o.t) +
          (o.s ? '<i>' + esc(o.s) + '</i>' : '') + '</span></label>';
      });
      html += '</div>';
    } else if (q.type === 'echelle') {
      html += '<div class="echelle" role="radiogroup" aria-labelledby="' + q.id + '-lab">';
      for (var n = 1; n <= 5; n++) {
        html += '<label><input type="radio" name="' + q.id + '" value="' + n + '">' + n + '</label>';
      }
      html += '</div><div class="echelle-bornes"><span>' + esc(q.bornes[0]) + '</span><span>' + esc(q.bornes[1]) + '</span></div>';
    }

    html += '<p class="msg-erreur">Cette réponse est nécessaire pour vous recontacter.</p>';
    d.innerHTML = html;
    return d;
  }

  BANQUE.forEach(function (sec, i) {
    var s = document.createElement('section');
    s.className = 'section';
    s.id = 'sec-' + sec.id;
    var num = String(i + 1).padStart(2, '0');
    s.innerHTML = '<div class="section-tete"><div class="section-num">Section ' + num + ' / ' +
      String(BANQUE.length).padStart(2, '0') + '</div><h2>' + esc(sec.titre) + '</h2>' +
      '<p class="section-intro">' + esc(sec.intro) + '</p></div>';

    sec.questions.forEach(function (q) {
      if (q.bloc) {
        if (!moduleActif(q)) return;
        var b = document.createElement('div');
        b.className = 'bloc-conditionnel';
        b.innerHTML = '<span class="mention">' + esc(q.mention) + '</span>';
        q.questions.forEach(function (sq) { b.appendChild(rendreQuestion(sq)); });
        s.appendChild(b);
      } else {
        s.appendChild(rendreQuestion(q));
      }
    });

    elSections.appendChild(s);

    var li = document.createElement('li');
    li.className = 'noeud';
    li.dataset.cible = 'sec-' + sec.id;
    li.dataset.etat = i === 0 ? 'cours' : 'attente';
    li.innerHTML = '<b>' + num + '</b>' + esc(sec.titre);
    li.addEventListener('click', function () {
      document.getElementById('sec-' + sec.id).scrollIntoView({ block: 'start' });
    });
    elEpine.appendChild(li);
  });

  /* En-tête client */
  document.getElementById('tete-client').textContent = CLIENT.domaine;
  document.getElementById('rep-domaine').textContent = CLIENT.domaine;
  document.getElementById('ouv-secteur').textContent = CLIENT.secteur;
  document.getElementById('pied-ref').textContent = 'Document de cadrage · ' + CLIENT.domaine;
  document.title = 'Cadrage digital — ' + CLIENT.domaine + ' · LES4H';
  if (CLIENT.accroche) {
    document.getElementById('ouv-chapeau').innerHTML =
      esc(CLIENT.accroche) + '<br><br>Comptez 10 à 15 minutes. Vos réponses sont enregistrées au fur et à mesure sur votre appareil.';
  }

  /* ═══ 4. État, brouillon, jauge ═════════════════════════════ */

  var form = document.getElementById('formulaire');
  var CLEF = 'les4h.cadrage.' + CLE;

  var coffre = (function () {
    try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); return localStorage; }
    catch (e) { return null; }
  })();

  function lire() {
    var d = {};
    visibles.forEach(function (q) {
      var els = form.querySelectorAll('[name="' + q.id + '"]');
      if (!els.length) return;
      if (q.type === 'check') {
        var v = [];
        els.forEach(function (e) { if (e.checked) v.push(e.value); });
        if (v.length) d[q.id] = v;
      } else if (q.type === 'radio' || q.type === 'echelle') {
        els.forEach(function (e) { if (e.checked) d[q.id] = e.value; });
      } else if (els[0].value.trim()) {
        d[q.id] = els[0].value.trim();
      }
    });
    return d;
  }

  function ecrire(d) {
    Object.keys(d || {}).forEach(function (k) {
      var els = form.querySelectorAll('[name="' + k + '"]');
      if (!els.length) return;
      if (Array.isArray(d[k])) {
        els.forEach(function (e) { e.checked = d[k].indexOf(e.value) !== -1; });
      } else if (els[0].type === 'radio' || els[0].type === 'checkbox') {
        els.forEach(function (e) { e.checked = (e.value === d[k]); });
      } else {
        els[0].value = d[k];
      }
    });
  }

  /* Signal de positionnement : pondéré, pénalisé par les réponses « je ne sais pas ». */
  function signal(d) {
    var total = 0, obtenu = 0;
    visibles.forEach(function (q) {
      var p = q.poids || (q.requis ? 0 : 1);
      if (!p) return;
      total += p;
      var v = d[q.id];
      if (v === undefined) return;
      var flou = false;
      if (q.options) {
        var vals = Array.isArray(v) ? v : [v];
        var f = q.options.filter(function (o) { return o.flou && vals.indexOf(o.v) !== -1; });
        flou = f.length > 0 && (!Array.isArray(v) || v.length === f.length);
      }
      obtenu += flou ? p * 0.3 : p;
    });
    return total ? Math.round(obtenu / total * 100) : 0;
  }

  var elBarre = document.getElementById('jauge-barre');
  var elVal = document.getElementById('jauge-valeur');
  var elNote = document.getElementById('jauge-note');

  function majJauge(d) {
    var s = signal(d);
    elBarre.style.width = s + '%';
    elVal.textContent = s + ' %';
    if (s < 35) {
      elNote.textContent = 'Signal faible. En l\'état, nous appliquerons par défaut un socle d\'hébergement simplifié : ' +
        'rapide, économe, mais sans fonction avancée.';
    } else if (s < 65) {
      elNote.textContent = 'Signal partiel. Les grandes lignes se dessinent ; quelques réponses de plus ' +
        'permettraient de trancher entre plusieurs formules.';
    } else if (s < 90) {
      elNote.textContent = 'Signal net. Nous avons de quoi construire une proposition argumentée et chiffrée.';
    } else {
      elNote.textContent = 'Signal précis. La proposition sera taillée au plus juste, sans marge d\'incertitude.';
    }
  }

  function majNoeuds() {
    BANQUE.forEach(function (sec, i) {
      var el = document.getElementById('sec-' + sec.id);
      var champs = el.querySelectorAll('.champ');
      var faits = 0;
      champs.forEach(function (c) {
        var els = c.querySelectorAll('input, textarea, select');
        var ok = false;
        els.forEach(function (e) {
          if (e.type === 'radio' || e.type === 'checkbox') { if (e.checked) ok = true; }
          else if (e.value.trim()) ok = true;
        });
        if (ok) faits++;
      });
      var noeud = elEpine.children[i];
      if (noeud.dataset.etat !== 'cours') {
        noeud.dataset.etat = (champs.length && faits / champs.length >= 0.7) ? 'fait' : 'attente';
      }
      noeud.dataset.fait = faits;
    });
  }

  var minuteur;
  function surChangement() {
    var d = lire();
    majJauge(d);
    majNoeuds();
    clearTimeout(minuteur);
    minuteur = setTimeout(function () {
      if (!coffre) return;
      try {
        coffre.setItem(CLEF, JSON.stringify({ d: d, t: Date.now() }));
        var h = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('rail-brouillon').textContent = 'Brouillon enregistré à ' + h;
      } catch (e) { /* quota */ }
    }, 500);
  }

  form.addEventListener('input', surChangement);
  form.addEventListener('change', function (e) {
    /* plafonnement des cases à cocher */
    var q = visibles.filter(function (x) { return x.id === e.target.name; })[0];
    if (q && q.max && e.target.type === 'checkbox') {
      var els = form.querySelectorAll('[name="' + q.id + '"]');
      var n = 0; els.forEach(function (x) { if (x.checked) n++; });
      els.forEach(function (x) {
        x.disabled = (!x.checked && n >= q.max);
        x.closest('.option').classList.toggle('desactive', x.disabled);
      });
    }
    surChangement();
  });

  /* Reprise du brouillon */
  if (coffre) {
    try {
      var brut = coffre.getItem(CLEF);
      if (brut) {
        var sauv = JSON.parse(brut);
        ecrire(sauv.d);
        document.getElementById('rail-brouillon').textContent =
          'Brouillon repris du ' + new Date(sauv.t).toLocaleDateString('fr-FR');
      }
    } catch (e) { /* ignore */ }
  }
  surChangement();

  /* Section courante */
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = BANQUE.map(function (s) { return 'sec-' + s.id; }).indexOf(en.target.id);
        Array.prototype.forEach.call(elEpine.children, function (n, j) {
          if (n.dataset.etat === 'cours') n.dataset.etat = 'attente';
          if (j === i) n.dataset.etat = 'cours';
        });
        majNoeuds();
      });
    }, { rootMargin: '-25% 0px -60% 0px' });
    BANQUE.forEach(function (s) { obs.observe(document.getElementById('sec-' + s.id)); });
  }

  /* ═══ 5. Lecture technique (silencieuse) ════════════════════ */

  function analyse(d) {
    var n = function (v, table) { return table[v] || 0; };
    var dynamisme = n(d.frequence_maj, { rare: 0, trimestre: 1, mois: 2, semaine: 3, quotidien: 4 }) +
      n(d.qui_edite, { les4h: 0, occasionnel: 1, externe: 2, dedie: 3 }) +
      (parseInt(d.autonomie, 10) >= 4 ? 2 : 0) +
      ((d.types_contenu || []).indexOf('actus') !== -1 ? 1 : 0);

    var f = d.fonctions || [];
    var transaction =
      (d.role_principal === 'vente' ? 4 : 0) +
      (d.role_principal === 'reservation' ? 3 : 0) +
      (f.indexOf('paiement') !== -1 ? 2 : 0) +
      (f.indexOf('espace') !== -1 ? 2 : 0) +
      (f.indexOf('cataloguecons') !== -1 ? 1 : 0) +
      (f.indexOf('rdv') !== -1 ? 1 : 0) +
      (a('ecommerce') ? 2 : 0) +
      n(d.ec_cible, { canal: 3, double: 2 }) +
      n(d.re_ambition, { reprendre: 2, automatiser: 2 });

    var criticite = n(d.criticite, { rien: 0, genant: 1, contacts: 2, ca: 3, arret: 4 });
    var budget = n(d.budget_mensuel, { '<25': 0, '25-50': 1, '50-100': 2, '100-250': 3, '250+': 4 });
    var clarte = signal(d);

    var socle;
    if (transaction >= 5 || budget >= 3 && transaction >= 3) socle = 'Croissance — plateforme transactionnelle managée';
    else if (dynamisme >= 4 || criticite >= 3) socle = 'Performance — CMS managé ou hybride Astro + CMS';
    else socle = 'Socle — statique Astro, maintenance réduite';
    if (clarte < 40) socle = 'Socle — statique Astro (par défaut, positionnement non tranché)';

    var drapeaux = [];
    if (['prioritaire', 'terme'].indexOf(d.ia_volonte) !== -1) drapeaux.push('AIO');
    if (['volumineux', 'disperse'].indexOf(d.corpus) !== -1) drapeaux.push('corpus RAG');
    if (['utile', 'tester'].indexOf(d.assistant) !== -1) drapeaux.push('assistant');
    if (d.ia_test === 'faux' || d.ia_test === 'absent') drapeaux.push('correction IA urgente');
    if (d.arbitrage === 'statuquo' || d.budget_mensuel === '<25') drapeaux.push('risque de résiliation');
    if (d.arbitrage === 'sobriete') drapeaux.push('candidat migration Astro');
    if (d.ca_apres === 'archive' || d.ca_apres === 'redirige') drapeaux.push('fin de cycle');
    if ((d.douleurs || []).indexOf('pannes') !== -1) drapeaux.push('incidents signalés');
    if (d.gr_modele === 'socle' || d.gr_modele === 'unique') drapeaux.push('mutualisation groupe');

    return {
      dynamisme: dynamisme, transaction: transaction, criticite: criticite,
      budget: budget, clarte: clarte, socle_recommande: socle, drapeaux: drapeaux
    };
  }

  /* ═══ 6. Transmission ═══════════════════════════════════════ */

  var debut = Date.now();
  var elStatut = document.getElementById('statut');
  var btn = document.getElementById('btn-envoyer');

  function reference() {
    var d = new Date();
    var j = d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    var r = Math.random().toString(36).slice(2, 6).toUpperCase();
    return 'L4H-' + CLE.toUpperCase() + '-' + j + '-' + r;
  }

  function paquet() {
    var d = lire();
    return {
      reference: reference(),
      client: { cle: CLE, nom: CLIENT.nom, domaine: CLIENT.domaine, modules: MODULES },
      horodatage: new Date().toISOString(),
      duree_minutes: Math.round((Date.now() - debut) / 60000),
      reponses: d,
      lecture: analyse(d)
    };
  }

  function fichier(p) {
    try {
      var b = new Blob([JSON.stringify(p, null, 2)], { type: 'application/json' });
      var u = URL.createObjectURL(b);
      var l = document.createElement('a');
      l.href = u; l.download = 'cadrage-' + CLE + '-' + p.reference + '.json';
      document.body.appendChild(l); l.click(); l.remove();
      setTimeout(function () { URL.revokeObjectURL(u); }, 2000);
      return true;
    } catch (e) { return false; }
  }

  function valider() {
    var ok = true;
    visibles.filter(function (q) { return q.requis; }).forEach(function (q) {
      var champ = form.querySelector('[data-qid="' + q.id + '"]');
      var el = form.querySelector('[name="' + q.id + '"]');
      var vide = !el.value.trim() || (q.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value));
      el.classList.toggle('erreur', vide);
      champ.querySelector('.msg-erreur').classList.toggle('actif', vide);
      if (vide && ok) { champ.scrollIntoView({ block: 'center' }); el.focus(); }
      if (vide) ok = false;
    });
    return ok;
  }

  function confirmer(p) {
    document.getElementById('bloc-envoi').style.display = 'none';
    var m = document.getElementById('bloc-merci');
    m.classList.add('actif');
    document.getElementById('ref-envoi').textContent = p.reference;
    if (coffre) { try { coffre.removeItem(CLEF); } catch (e) {} }
    document.getElementById('btn-fichier-2').onclick = function () { fichier(p); };
    try { m.scrollIntoView({ block: 'center' }); } catch (e) {}
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!valider()) {
      elStatut.dataset.ton = 'ko';
      elStatut.textContent = 'Il manque votre nom ou votre e-mail — sans eux, impossible de vous répondre.';
      return;
    }
    var p = paquet();
    var url = CLIENT.endpoint || ENDPOINT_DEFAUT;
    btn.disabled = true;
    elStatut.dataset.ton = '';
    elStatut.textContent = 'Envoi en cours…';

    if (!url) { fichier(p); confirmer(p); return; }

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p)
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      confirmer(p);
    }).catch(function () {
      btn.disabled = false;
      elStatut.dataset.ton = 'ko';
      elStatut.innerHTML = 'L\'envoi n\'a pas abouti. Vos réponses viennent d\'être téléchargées : ' +
        'transmettez le fichier à <a href="mailto:support@les4h.fr">support@les4h.fr</a>, ' +
        'nous le traiterons de la même façon.';
      fichier(p);
    });
  });

  document.getElementById('btn-fichier').addEventListener('click', function () { fichier(paquet()); });

  document.getElementById('btn-vider').addEventListener('click', function () {
    if (!confirm('Effacer toutes vos réponses ? Cette action est définitive.')) return;
    form.reset();
    if (coffre) { try { coffre.removeItem(CLEF); } catch (e) {} }
    document.getElementById('rail-brouillon').textContent = '';
    surChangement();
  });

})();
