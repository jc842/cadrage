# Évolution des forfaits d'hébergement — cadrage du portefeuille

**LES4H · 14 sites · août 2026**
Document interne. À ne pas diffuser aux clients.

---

## 1. Avertissement sur la source

Je n'ai **pas pu lire le contenu de `tecalu.les4h.fr`** : le corps du questionnaire est injecté côté
JavaScript, seuls l'en-tête, le sceau « Confidentiel » et le pied de page sont accessibles à la
récupération. Ce que je livre n'est donc pas une copie de l'enquête Tecalu, mais une reconstruction
alignée sur ce qui est visible (positionnement « document de cadrage confidentiel », identité LES4H)
et sur les axes commerciaux de `presence.les4h.fr`.

Si vous me transmettez le questionnaire Tecalu (export HTML, capture, ou simple liste des questions),
j'aligne la structure en une passe.

---

## 2. Ce que les sites racontent déjà

Analyse des 14 sites : technologie détectée, fonction réelle, et signal commercial.

| Site | Socle actuel | Ce que le site fait vraiment | Signal |
|---|---|---|---|
| esperance-coaching.fr | WP · Slider Revolution · GTM | Vitrine d'activités. **La réservation part chez Resamania**, le planning est une image JPG | Le site ne capte aucune valeur transactionnelle |
| bellesrives-immobilier.com | WP · Elementor 3.34 | Landing VEFA, 13 lots, formulaire de contact. Discours « ultime chance » | **Fin de cycle** — la question est celle de l'après |
| greenlodgeguadeloupe.com | WP · Elementor 4.1.1 · moteur de réservation | Un bungalow, réservation en direct + blog local | Transactionnel réel, mais volume unitaire |
| atmosphere-deco.com | PrestaShop · thème custom | E-commerce à catalogue profond (réf. > 35 000), magasin Jarry, blog en sous-domaine | Le seul vrai e-commerce du lot avec Pulsat |
| cash-affaires.fr | Landing express | Présence minimale, assumée | Déjà au bon niveau |
| pulsatguadeloupe.com | PrestaShop 1.7 (migration Woo) | Boutique + magasin. **Historique de saturation PHP-FPM** | Coût technique disproportionné au CA en ligne |
| 123bonheur.fr | WP · Elementor | Marque personnelle, blog, réservation externe (Payhip) | Petit site, gros potentiel de conversion |
| alubat971 / 972 / 973 | WP · Avada | Catalogue de gammes, contact. 971 en migration Astro | Trois fois le même besoin |
| iris-fenetres.com | WP · Slider Rev · Zoho Forms | **4 agences, blog actif (article/mois), devis structurés** | Le plus mature commercialement |
| menuiseries-smt.com | WP | Site d'usine, adossé au réseau IRIS | Audience prescripteurs |
| ossegua.com | Statique | Page de mobilisation, formulaire | Déjà au bon niveau technique |
| tous-avec-chloe.fr | Publii (statique) | **Dormant.** Contenus 2017, doublons, libellés de thème en anglais | Décision à prendre : réactiver ou archiver |

**Trois constats qui commandent tout le reste.**

1. **Cinq sites n'ont aucun besoin dynamique** (alubat ×3, smt, bellesrives) et deux sont déjà
   statiques (ossegua, chloé). Sept sites sur quatorze relèvent du socle Astro, avec ou sans leur avis.
2. **Deux sites ne pourront jamais y aller** (atmosphere-deco, pulsat) : catalogue, panier, compte
   client. Ce sont eux qui doivent porter le haut de la grille tarifaire, pas les autres.
3. **Le groupe CPG achète cinq fois la même chose.** Alubat 971/972/973 + IRIS + SMT partagent le
   métier, la structure de contenu et le type de document technique. C'est votre effet de levier :
   un socle mutualisé facturé cinq fois, développé une fois et demie.

---

## 3. Segmentation en quatre profils

Les questionnaires sont taillés par profil — c'est ce qui pilote les blocs conditionnels.

**A · Socle statique** — alubat971, alubat972, alubat973, smt, ossegua, cash, bellesrives, chloé
Contenu quasi figé, pas de transaction. Astro + Cloudflare Pages. Maintenance proche de zéro,
marge élevée, aucun risque de vulnérabilité plugin.

**B · Hybride** — 123bonheur, iris, esperance
Un noyau statique + un ou deux modules dynamiques (blog fréquent, formulaire de devis, planning).
Astro + collection de contenus, ou WordPress headless si le client tient à son back-office.

**C · Transactionnel** — greenlodge, pulsat, atmosphere
Panier, stock, réservation, paiement. Reste sur CMS applicatif. C'est là que l'hébergement se paie.

**D · À arbitrer avant toute dépense** — chloé, bellesrives
Sites en fin de vie ou dormants. Le questionnaire doit produire une **décision**, pas une proposition.

---

## 4. Grille de forfaits proposée

Adossée à `presence.les4h.fr` (19 / 39 / 79 €/mois) mais recalibrée pour un parc existant,
plus lourd que des landings neuves. À valider ou corriger — ce sont vos prix, pas les miens.

| | **Socle** | **Suivi** | **Performance** | **Croissance** |
|---|---|---|---|---|
| **Prix** | 24 €/mois | 49 €/mois | 99 €/mois | 179 €/mois |
| **Cible** | Profil A | Profil B | Profil C petit | Profil C à enjeu |
| Technologie | Astro / statique | Hybride ou WP managé | CMS applicatif | E-commerce, multi-entités |
| Hébergement | Cloudflare Pages | Hetzner + Cloudflare | Pool PHP dédié | Pool dédié + staging |
| Sauvegardes | Git (versionné) | Quotidiennes, 30 j | Quotidiennes, 90 j | Quotidiennes + restauration testée |
| Surveillance | Disponibilité | Disponibilité + santé | Toutes les 5 min | 5 min + alerte astreinte |
| Mises à jour | Sans objet | Supervisées | Supervisées + staging | Staging obligatoire |
| Intervention | 2 modifs/an | 1 h/mois | 2 h/mois | 4 h/mois |
| Délai incident | Jour ouvré | Jour ouvré | 4 h ouvrées | 4 h ouvrées, 6j/7 |
| Rapport | — | Trimestriel | Mensuel | Mensuel + revue semestrielle |

**Options transversales**

| Option | Prix | Déclenchée par |
|---|---|---|
| Tableau de bord de performance | 29 €/mois | Demande explicite de mesure |
| Visibilité IA (AIO/GEO) | 39 €/mois | `ia_volonte` = prioritaire ou à terme |
| Assistant documentaire (RAG) | à partir de 79 €/mois | `corpus` volumineux/dispersé + `assistant` favorable |
| Posts locaux | selon volume | Canaux sociaux déjà actifs |
| SEA piloté | budget + 20 % | Budget publicitaire déjà engagé |
| Archivage propre + redirections | 190 € une fois | Fin de cycle (bellesrives, chloé) |

**Le point commercial à ne pas rater.** Le passage à Astro fait *baisser* votre coût de production
et *monter* votre marge. Ne vendez pas la baisse de prix : vendez la vitesse, la sécurité et la
disponibilité, et gardez l'écart. Un site statique qui ne tombe jamais vaut plus cher à maintenir
qu'un WordPress qui tombe — pour le client, c'est le résultat qui compte.

---

## 5. Règle de décision (appliquée automatiquement par le questionnaire)

Le formulaire calcule quatre scores en silence, sans jamais les montrer au client :

- **dynamisme** = fréquence de mise à jour + qui édite + envie d'autonomie + présence d'un blog
- **transaction** = rôle principal + fonctions cochées + module e-commerce/réservation + ambition
- **criticité** = coût d'une indisponibilité de 4 h
- **clarté** = part des questions clés répondues, les « je ne sais pas » ne comptant que pour 30 %

L'arbitrage qui en découle :

```
transaction ≥ 5                       → Croissance / Performance (CMS applicatif)
dynamisme ≥ 4  ou  criticité ≥ 3      → Suivi (hybride ou WP managé)
sinon                                 → Socle (Astro)
clarté < 40 %                         → Socle (Astro) imposé par défaut
```

**C'est exactement la consigne que vous avez donnée** : à défaut de positionnement clair, on oriente
vers Astro simplifié. Le formulaire le fait, et il le dit au client pendant qu'il répond — la jauge
« Signal de positionnement » affiche noir sur blanc que sans réponses précises, le socle simplifié
s'appliquera. C'est le seul levier honnête pour obtenir des réponses complètes.

**Les drapeaux remontés dans le paquet JSON** : `AIO`, `corpus RAG`, `assistant`,
`correction IA urgente`, `risque de résiliation`, `candidat migration Astro`, `fin de cycle`,
`incidents signalés`, `mutualisation groupe`.

---

## 6. Positionnement RAG et AIO

Le questionnaire ne vend rien sur ces sujets, il **qualifie**. Quatre questions en section 06 :

1. Souhait de figurer dans les réponses des IA → intention
2. Test déjà réalisé et résultat → urgence (informations fausses = urgence réelle)
3. Existence d'un fonds documentaire → faisabilité technique du RAG
4. Appétence pour un assistant 24/7 → maturité

**Qui va probablement ressortir positif, et pourquoi :**

- **IRIS Fenêtres** — le meilleur candidat du parc. Notices Schüco, Bubendorff, Profalux,
  certifications, quatre agences avec des zones de chalandise distinctes. Un assistant qui répond
  « quelle est la garantie sur un volet Bubendorff posé par vous ? » a une valeur immédiate.
- **Groupe Alubat / SMT** — documentation technique menuiserie, PV d'essais, notices de pose.
  Le corpus existe déjà chez eux ; il est dispersé. Le RAG se vend sur ce désordre.
- **Atmosphère Déco / Pulsat** — assistant conseil produit sur catalogue. Plus complexe (le corpus
  bouge), à ne proposer qu'après stabilisation du socle.
- **Espérance Coaching / Green Lodge** — l'AIO local a du sens (« aquabike aux Abymes »,
  « gîte nature Sainte-Rose »), le RAG non.

**L'argument statique tient toujours** : les robots des moteurs de réponse n'exécutent pas le
JavaScript. Un site Astro est structurellement mieux lu qu'un Elementor. C'est votre différenciateur
et il est vérifiable devant le client — faites la démonstration en direct sur son propre site.

---

## 7. Ce qui est livré

Trois fichiers, un seul déploiement, quatorze sous-domaines.

**`index.html`** — coquille et styles. Aucune ressource externe : polices système uniquement,
donc **pas d'appel Google Fonts** (conformité CNIL, cohérent avec votre pratique Matomo).
Seule exception : le logo servi depuis `les4h.fr`.

**`clients.js`** — les 14 configurations. Le client est déduit du sous-domaine
(`iris.les4h.fr` → clé `iris`), avec repli sur `?c=iris` pour vos tests. Chaque entrée porte
sa raison sociale, son secteur, ses modules conditionnels et une accroche écrite pour lui.

**`questionnaire.js`** — banque de questions, rendu, scoring, transmission.
8 sections, 42 à 49 questions selon le profil, **seuls le nom et l'e-mail sont obligatoires**.

**`_headers`** — en-têtes de sécurité et `noindex` pour Cloudflare Pages.

### Structure des 8 sections

| # | Section | Ce qu'elle sert à décider |
|---|---|---|
| 01 | Qui répond, et à quel titre | Le circuit de décision |
| 02 | Ce que votre site doit faire | Le rôle unique — la question qui structure tout |
| 03 | Vos objectifs et leur mesure | L'existence d'un KPI, donc d'un budget défendable |
| 04 | Votre contenu et votre autonomie | **Le pivot technique : Astro ou CMS** |
| 05 | Les fonctions attendues | Le périmètre, et les blocs conditionnels par profil |
| 06 | Votre visibilité, y compris auprès des IA | Le déclenchement AIO / RAG |
| 07 | Vos exigences de service | Le niveau de forfait, calibré sur le coût d'une panne |
| 08 | Budget, calendrier et décision | La faisabilité et le tempo |

### Blocs conditionnels par module

`ecommerce` · `reservation` · `pointdevente` · `b2b` · `groupe` · `association` · `campagne`

Exemple : IRIS affiche `b2b` + `groupe` + `pointdevente` (49 questions) ; Cash Affaires n'affiche
que `pointdevente` (42 questions).

### L'élément qui fait le travail

La jauge « Signal de positionnement », dans la colonne de gauche. Elle monte à mesure que les
réponses se précisent, redescend quand le client coche « je ne sais pas », et affiche en clair :
*« Signal faible. En l'état, nous appliquerons par défaut un socle d'hébergement simplifié. »*

Le client comprend que l'imprécision a une conséquence. C'est plus efficace qu'une barre de
progression, et parfaitement honnête : c'est bien ce qui va se passer.

---

## 8. Déploiement

### Un seul projet Cloudflare Pages

Le client étant résolu par le nom d'hôte, **un seul déploiement sert les quatorze sous-domaines**.
Une mise à jour du questionnaire les met tous à jour.

```
1. Dépôt GitHub  les4h/cadrage  →  Cloudflare Pages, projet "cadrage"
   Build : aucun (fichiers statiques). Répertoire de sortie : /
2. Custom domains, un par client :
   esperance · bellesrives · greenlodge · atmosphere · cash · pulsat · 123bonheur
   alubat971 · alubat972 · alubat973 · iris · smt · ossegua · chloe    (.les4h.fr)
3. DNS : CNAME <sous-domaine> → cadrage.pages.dev, proxifié (orange)
```

**Confidentialité.** Les pages portent `noindex` et une règle `X-Robots-Tag`. Si vous voulez
verrouiller franchement, une politique Cloudflare Access avec code à usage unique par e-mail
suffit — mais elle ajoute une friction qui coûtera des réponses. Sur ce contenu, le `noindex`
et l'URL non devinable me paraissent proportionnés.

### Collecte des réponses

Définissez `ENDPOINT_DEFAUT` en tête de `questionnaire.js` :

```js
var ENDPOINT_DEFAUT = 'https://n8n.les4h.fr/webhook/cadrage';
```

Le flux n8n que je recommande :

```
Webhook POST
  → Fonction : dédoublonnage sur reference + email
  → Zoho Desk : création de ticket, sujet "Cadrage — {client.domaine} — {lecture.socle_recommande}"
                étiquettes = lecture.drapeaux
  → Zoho Sheet ou base : une ligne par réponse, pour comparer les 14
  → Notification WhatsApp ou mail à vous, avec le socle recommandé et les drapeaux
```

**Deux pièges à éviter, tirés de vos incidents précédents :** l'IP de la VM n8n doit être en
liste sûre dans le WAF Cloudflare (règle « 00 Safelist »), **IPv6 comprise**, et l'endpoint doit
figurer dans la directive `connect-src` du fichier `_headers` — il y est déjà pour
`n8n.les4h.fr` et `flow.zoho.eu`, à ajuster si vous changez de domaine.

**Sans endpoint configuré**, le formulaire ne casse pas : il télécharge le JSON sur le poste du
client et affiche la confirmation avec la consigne de vous l'envoyer. C'est le filet de sécurité,
pas le mode nominal.

---

## 9. Séquence d'envoi recommandée

N'envoyez pas les quatorze le même jour. Vous voulez pouvoir corriger le questionnaire après
les premiers retours.

**Vague 1 — les deux qui vous répondront bien (semaine 1).**
IRIS et Alubat 971. Le premier parce qu'il est mature et qu'il a un intérêt commercial évident à
répondre ; le second parce que la migration est déjà en cours et que ses réponses valident le
template de tout le groupe. Vous ajustez le questionnaire sur ces deux-là.

**Vague 2 — le groupe et les transactionnels (semaine 2).**
Alubat 972/973, SMT, Atmosphère Déco, Pulsat, Green Lodge. Pour le groupe CPG, envoyez aussi une
copie à l'échelon qui arbitre : la question `gr_modele` (indépendant / socle commun / site unique)
n'a de sens que si elle remonte au bon niveau.

**Vague 3 — les petits comptes (semaine 3).**
Espérance, 123bonheur, Cash Affaires, OSSEGUA.

**Traitement à part — les deux décisions.**
Belles Rives et Tous avec Chloé ne méritent pas un e-mail de campagne mais un appel de cinq minutes.
Le questionnaire sert à formaliser la décision, pas à la provoquer.

**Relance.** À J+7, un seul rappel, court, avec l'argument qui marche : *« sans vos réponses, je
vous positionnerai sur le socle simplifié — c'est peut-être exactement ce qu'il vous faut, mais
autant le vérifier. »*

---

## 10. Ce qu'il me faut de vous

1. **Le questionnaire Tecalu** (ou sa liste de questions) si vous voulez un alignement strict.
2. **Validation ou correction de la grille tarifaire** du point 4 — j'ai proposé 24/49/99/179,
   c'est une hypothèse.
3. **L'URL du webhook n8n**, pour que je la place dans le fichier.
4. **Confirmation des couples clé/sous-domaine** : j'ai retenu `cash`, `123bonheur`, `chloe`,
   `iris`, `smt`, `atmosphere` — à ajuster si vous préférez d'autres libellés.
5. **Le statut réel de Belles Rives et Tous avec Chloé** : si la décision est déjà prise, on retire
   ces deux entrées et on économise deux conversations.

---

## 11. Deux réserves

**Sur la longueur.** 42 à 49 questions, c'est 10 à 15 minutes. C'est long pour un commerçant,
normal pour une direction industrielle. Si le taux de réponse déçoit sur la vague 3, je peux
produire une variante courte (18 questions, sections 02/04/07/08 uniquement) pour les petits
comptes — le scoring reste valide, avec une clarté plafonnée plus bas.

**Sur le scoring.** Les seuils du point 5 sont calibrés à l'estime, pas sur des données. Après les
cinq premières réponses, comparez la recommandation automatique à votre propre jugement : si l'écart
est systématique, les coefficients se corrigent en trois lignes dans `analyse()`.
