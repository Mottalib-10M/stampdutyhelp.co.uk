# Ajouter ou étoffer une page de Stamp Duty Help

Notice pour les agents qui prolongent le site. À lire en entier avant d'écrire, avec `~/Documents/GitHub/RECETTE-SITE.md` (§0, §6, §6.5, §7, §9.3, §11, §17.4, §21, §26).

Le site : taxes d'achat immobilier du Royaume-Uni, trois régimes. **Anglais britannique seul**, sous `/en/` (préfixe gardé de la trame pour la racine et les contrôleurs).

| Nation | Taxe | Autorité |
|---|---|---|
| Angleterre et Irlande du Nord | Stamp Duty Land Tax (SDLT) | HMRC |
| Écosse | Land and Buildings Transaction Tax (LBTT) + Additional Dwelling Supplement (ADS) | Revenue Scotland |
| Pays de Galles | Land Transaction Tax (LTT), taux principaux et taux majorés | Welsh Revenue Authority |

## Principe : une page = un fichier

Une page = **un fichier** `src/content/pages/<id>.ts` (type `PageDef`, `src/lib/page-types.ts`). Le cœur le lit seul : route `/en/<slug>/`, menus et pied de page (par `group`), sitemap, schémas `Article`, `WebPage`, `FAQPage`, `BreadcrumbList`, cartes « pages associées ». **Aucun fichier du cœur à toucher pour ajouter une page.**

Modèles à copier (la structure, jamais les phrases) :

| Type | Modèle | Particularité |
|---|---|---|
| Guide | `stamp-duty-first-time-buyer.ts` | `mini: '<kind>'` + un fichier `src/lib/minis/<kind>.ts` ; corps ≥ 850 mots de prose |
| Page outil | `sdlt-calculator.ts` | `tool: 'calc'` (+ `toolProps`) ; `data-outil` posé par le cœur, cible 500 mots |
| Page par prix | `stamp-duty-on-300000.ts` | slug `stamp-duty-on-<montant>`, `tool: 'calc'`, `toolProps: { price }`, un tableau au moins |
| Page de ville | `stamp-duty-manchester.ts` | `place: '<clé hpi>'`, `tool: 'calc'`, `toolProps: { lockNation: true }` |

Outils disponibles (`tool`) : `calc` (le calculateur des trois nations ; `toolProps` : `nation`, `lockNation`, `situation`, `price`, `company`, `nonResident`, `kind: 'nonresidential'`), `area` (toutes les collectivités), `joint` (achat à plusieurs), `shared` (propriété partagée), `refund` (remboursement de la surtaxe ; `toolProps.nation`), `transfer` (transfert de quote-part).

## Les champs

| Champ | Règle |
|---|---|
| `id` | = nom du fichier. |
| `group` | `calculators`, `england`, `scotland`, `wales`, `situations`, `prices`, `places`. |
| `order` | place dans le menu du groupe (pas de 10). |
| `slug` | minuscules et tirets, sans année. Un nombre de 3 chiffres ou plus fait de la page une page « par montant » (tableau exigé) : seulement pour `prices`. Éviter `contact`, `legal`, `method`, `about`, `terms`, `cookie`, `sources`, `privacy`, `editorial`, `updates` dans un slug (pages de service pour les contrôleurs). |
| `title` | 50 à 60 caractères, contient 2026. Terme-clé en tête (`Stamp Duty…`, `SDLT…`, `LBTT…`, `ADS…`, `Land Transaction Tax…`). Jamais en tête : un pays ou son adjectif (UK, United Kingdom, British, England, Scotland, Scottish, Wales, Welsh), un mot d'outil (Calculator, Calculate), une question (How, What, When), une rubrique. Pas de tiret cadratin. Unique sur le site. |
| `description` | 150 à 160 caractères, 2026 et un chiffre calculé. Unique. |
| `h1` | sans année. |
| `intro` | une phrase. |
| `resume` | **UN** paragraphe de 120 mots ou plus (viser 130 à 170), citable seul : la réponse à la requête, avec les chiffres (§21). Sur une page outil, il s'affiche replié avant l'outil : la première phrase doit porter le message. |
| `faqs` | guides 4 à 6, outils/prix/villes 3 ou 4. Réponses de **45 à 85 mots** (le contrôle compte 40-90 avec `split()`, on garde de la marge). La question s'écrit comme on la pose, propre à la page, jamais reprise d'une autre page du site (le test le vérifie). |
| `body` | `(h) => \`…\`` qui renvoie du HTML : `h2`, `h3`, `p`, `ul`, `ol`, tableaux via `h.table`, `h.bands`, `h.breakdown`. `<!--mini:<kind>-->` insère un mini-simulateur de plus. |
| `related` | 3 à 6 identifiants de pages existantes. |
| `sources` | 2 clés ou plus de `params-2026.json > sources`. |

## La règle des chiffres (non négociable, RECETTE §17.4 point 7)

**Aucun taux, seuil, montant ou délai n'est tapé en dur**, ni dans le corps, ni dans `title`, `description`, `resume`, `faqs`. Tout vient des paramètres ou du moteur :

```ts
import { P, gbp, pct, t, top, compute, place } from '../../lib/kit';
title: `Stamp Duty First-Time Buyer Relief 2026: ${gbp(top(P.sdlt.first_time_buyer, 0))} Rule`,
a: `… costs ${gbp(t('england', 400000, 'first'))} instead of ${gbp(t('england', 400000))} …`
```

Un **prix d'exemple** (« a £400,000 flat ») est une hypothèse, pas un paramètre : il peut s'écrire `gbp(400000)`. Le **résultat** se calcule toujours. Les dates de réforme (1 April 2025, 5 December 2024, 11 December 2024…) s'écrivent en clair.

Dans le corps, `h` fournit : `h.a(id, texte)` (lien interne ; un id inconnu fait échouer le test), `h.gbp`, `h.pct` (5%, 7.5%), `h.num`, `h.date(iso)`, `h.t(nation, prix, situation?, extra?)`, `h.tax(input)` (résultat complet : `surcharge`, `refundable`, `ftbSaving`, `nonResidentSurcharge`…), `h.table(entêtes, lignes, légende, alignements)`, `h.bands('sdlt' | 'sdltFtb' | 'sdltHigher' | 'sdltNonRes' | 'lbtt' | 'lbttFtb' | 'lbttNonRes' | 'ltt' | 'lttHigher' | 'lttNonRes')`, `h.breakdown(input, légende)` (détail tranche par tranche), `h.place('<clé hpi>')` (prix moyens UK HPI), `h.src(clé, texte)` (lien vers une source officielle), `h.P` (les paramètres).

Situations du moteur : `'first'` (tous les acheteurs primo-accédants), `'home'` (un seul logement à la fin de la journée, ou remplacement de la résidence principale vendue au plus tard le jour même), `'additional'` (deux logements ou plus à la fin de la journée). Options : `company`, `companyRelief`, `nonResident` (SDLT seulement), `kind: 'nonresidential'`.

## Le mini-simulateur (`src/lib/minis/<kind>.ts`)

```ts
import { compute } from '../engine/tax';
import { gbp, nationOptions, NATIONS } from './_kit';
export default () => ({
  title: '…', cta: 'Full calculator with every situation',
  inputs: [{ id: 'p', label: 'Purchase price', def: 350000, unit: '£', max: 100_000_000 }, { id: 'n', label: 'Nation', def: 0, options: nationOptions }],
  run: ({ p, n }: Record<string, number>) => ({ head: ['…', gbp(…)], rows: [['…', gbp(…)]], note: '…' }),
});
```

Un ou deux champs, le chiffre du sujet en grand, deux à quatre lignes. **Un sujet, un calcul** : le mini de l'ADS calcule l'ADS, celui du non-résident la surtaxe. Il appelle le moteur, jamais un calcul refait. Valeur par défaut réaliste. Pas d'année dans un `NumberField`.

## Ton et langue

- **Anglais britannique** : « organise », « licence » (nom), « completion », « conveyancer », « solicitor », « flat », « semi-detached », « buy-to-let », « council ». Montants en livres, `£` devant, virgule des milliers (le formateur le fait).
- Voix humaine, phrases de longueur variable, **le chiffre d'abord**. Pas de « it's important to note », « dive into », « whether you're… », « Moreover / Additionally / Furthermore », ni triplets en série, ni conclusion qui résume, ni émoji. **Jamais le tiret cadratin « — »** (le test le refuse).
- **Local réel** : organismes, textes et cas du Royaume-Uni (HMRC, Revenue Scotland, WRA, Finance Act 2003, conveyancer, Land Registry, council tax…). Un exemple chiffré est un vrai cas d'acheteur (« a couple selling a terrace in Leeds… »).
- **Unicité** (§6) : `check-unique` compare toutes les pages, chiffres neutralisés, seuil 30 %. Écrire ce qui n'appartient qu'au sujet, avec un vocabulaire propre ; aucune tournure reprise d'une autre page, aucun paragraphe repris d'un autre site du portefeuille (§6.5, `check-portefeuille`).
- **Pas de réseau** : aucun lien vers un autre site du portefeuille (`_trame/domaines-ovh.txt`). Liens externes : seulement les sources officielles, via `h.src`.
- **Vérité** : seuls les faits ci-dessous, ou lus sur la source officielle et ajoutés au fichier de paramètres avec leur source. Un point incertain ne se publie pas. Pas de chiffre de marché non sourcé (« most buyers… », « a large share… »).

## Les faits vérifiés (lus le 2026-10-05)

Tous sont dans `src/data/params-2026.json` (valeurs) et ses `sources` (URL). Rappel lisible :

**SDLT, Angleterre et Irlande du Nord** (HMRC ; Finance Act 2003)
- Taux depuis le 1er avril 2025 : 0 % jusqu'à 125 000 £, 2 % jusqu'à 250 000 £, 5 % jusqu'à 925 000 £, 10 % jusqu'à 1,5 M£, 12 % au-delà. Exemple HMRC : 295 000 £ → 4 750 £. Le Budget du 26 novembre 2025 n'a pas changé ces taux (OOTLAR, Annex A).
- Primo-accédant (Sch 6ZA) : 0 % jusqu'à 300 000 £, 5 % jusqu'à 500 000 £ ; au-delà de 500 000 £, aucun allègement, barème normal sur tout le prix. Tous les acheteurs doivent n'avoir jamais possédé de logement nulle part dans le monde (héritage et donation comptent ; bail de moins de 21 ans ne compte pas) et y habiter. Si un seul conjoint achète, le passé de l'autre n'est pas examiné pour cet allègement (SDLTM29845). Exemple HMRC : 500 000 £ → 10 000 £.
- Taux majorés (Sch 4ZA) : +5 points sur chaque tranche depuis le 31 octobre 2024 (3 points avant) si un acheteur possède à la fin de la journée plus d'un logement de 40 000 £ ou plus, n'importe où dans le monde, sans remplacer sa résidence principale. Les conjoints (non séparés) comptent comme un seul acheteur ; à plusieurs acheteurs, un seul suffit pour toute l'opération. Pas de majoration sous 40 000 £, ni sur un bien mixte, ni sur un mobil-home. Exemple HMRC : 300 000 £ → 20 000 £.
- Remplacement de résidence principale : pas de majoration si l'ancienne est vendue au plus tard le jour de l'achat ; sinon majoration puis remboursement si vente dans les 3 ans ; demande dans les 12 mois suivant la vente ou la date limite de dépôt de la déclaration (la plus tardive). Pas de remboursement si un conjoint garde une part de l'ancienne. Circonstances exceptionnelles (restrictions publiques) prévues.
- Héritage : une part héritée de 50 % ou moins (avec le conjoint) est ignorée pendant 3 ans pour la majoration (SDLTM09795).
- Non-résidents (Sch 9A, depuis le 1er avril 2021) : +2 points sur toutes les tranches résidentielles, y compris primo-accédant, majorées et 17 %. Non-résident = moins de 183 jours au Royaume-Uni dans les 12 mois avant l'achat. Un seul acheteur non-résident suffit, sauf conjoint vivant avec un résident britannique (traité comme résident, SDLTM09885). Remboursement si 183 jours atteints dans une période continue de 365 jours entre 364 jours avant et 365 jours après ; amendement de la déclaration dans les 2 ans suivant le lendemain de l'achat (SDLTM09960). Ne s'applique pas au non-résidentiel.
- Sociétés : 17 % sur tout le prix au-delà de 500 000 £ (15 % avant le 31 octobre 2024), sauf allègement (location, promotion, négoce, ouverture au public, logement d'employés, ferme…) ; sinon taux majorés dès 40 000 £. Peut aussi être soumise à l'ATED.
- Non-résidentiel et mixte : 0 % jusqu'à 150 000 £, 2 % jusqu'à 250 000 £, 5 % au-delà. Exemple : 275 000 £ → 3 250 £. 6 logements ou plus en une opération : barème non résidentiel depuis le 1er juin 2024 (allègement multiple supprimé en SDLT).
- Baux neufs résidentiels : 1 % de la valeur actuelle nette des loyers au-delà de 125 000 £.
- Propriété partagée : choix entre « market value election » (impôt une fois sur la valeur totale ; exemple 280 000 £ → 4 000 £) et paiement par étapes (sur le prix de la part ; rien ensuite jusqu'à 80 % ; au-delà, impôt sur le total payé × part de cette tranche : 260 000 £ → 3 000 £, tranche de 65 000 £ → 750 £). Allègement primo-accédant possible dans les deux cas si la valeur de marché ≤ 500 000 £ (450 000 £ avec élection → 7 500 £).
- Transfert : l'assiette comprend l'argent versé et la part de prêt reprise. Exonérés et sans déclaration : don sans contrepartie, héritage, transfert sur divorce ou dissolution, achat d'un freehold sous 40 000 £.
- Déclaration et paiement : 14 jours après l'achat (completion). Pénalité fixe de 100 £ jusqu'à 3 mois de retard, 200 £ au-delà, et pénalité proportionnelle possible après 12 mois ; intérêts de retard.
- Taux du 23 septembre 2022 au 31 mars 2025 : 0 % jusqu'à 250 000 £, puis 5 %, 10 %, 12 % ; primo-accédant 0 % jusqu'à 425 000 £, 5 % jusqu'à 625 000 £.

**LBTT, Écosse** (Revenue Scotland ; LBTT (Scotland) Act 2013, depuis le 1er avril 2015)
- Taux depuis le 1er avril 2021 : 0 % jusqu'à 145 000 £, 2 % jusqu'à 250 000 £, 5 % jusqu'à 325 000 £, 10 % jusqu'à 750 000 £, 12 % au-delà. Exemples : 235 000 £ → 1 800 £ ; 875 000 £ → 63 350 £.
- Primo-accédant (Sch 4A, LBTT3048) : tranche à 0 % portée à 175 000 £, gain maximal 600 £, à tout prix ; tous les acheteurs, jamais propriétaires nulle part (héritage compris), résidence principale, pas d'ADS.
- ADS (Sch 2A) : 8 % du prix total en plus de la LBTT pour les opérations conclues à partir du 5 décembre 2024 (6 % depuis le 16 décembre 2022, 4 % depuis le 25 janvier 2019, 3 % avant ; transition : contrat avant le 5 décembre 2024 → 6 %). Dès 40 000 £. Les sociétés la paient sur tout logement, même le premier. Le couple, le partenaire de PACS britannique et le concubin, avec les enfants de moins de 16 ans, forment une unité économique. Depuis le 1er avril 2024, une part détenue de moins de 40 000 £ ne compte pas.
- Remplacement : pas d'ADS si l'ancienne résidence principale a été vendue dans les 36 mois avant l'achat (18 mois avant le 1er avril 2024). Remboursement si vente dans les 36 mois après ; l'ancienne doit avoir été résidence principale dans les 36 mois avant l'achat, et le nouveau logement occupé comme résidence principale. Pour un achat depuis le 1er avril 2024, un seul acheteur doit avoir vendu, tous doivent habiter le nouveau. Aucune circonstance exceptionnelle (affaire MacQuarrie v Revenue Scotland). Demande : amendement dans les 12 mois de la date de dépôt, sinon demande de trop-perçu dans les 5 ans de la date limite. Traitement visé : 10 jours ouvrés, avec intérêts.
- Héritage : un logement hérité compte pour l'ADS ; depuis le 1er avril 2024, allègement s'il est reçu entre la signature du contrat et la date d'achat (para 9B).
- Pas de surtaxe non-résident. Non-résidentiel : 0 % jusqu'à 150 000 £, 1 % jusqu'à 250 000 £, 5 % au-delà. Déclaration et paiement : 30 jours.

**LTT, pays de Galles** (WRA ; LTT and Anti-avoidance of Devolved Taxes (Wales) Act 2017, depuis le 1er avril 2018)
- Taux principaux depuis le 10 octobre 2022 : 0 % jusqu'à 225 000 £, 6 % jusqu'à 400 000 £, 7,5 % jusqu'à 750 000 £, 10 % jusqu'à 1,5 M£, 12 % au-delà. Exemple : 280 000 £ → 3 300 £.
- Taux majorés depuis le 11 décembre 2024 (barème séparé) : 5 % jusqu'à 180 000 £, 8,5 % jusqu'à 250 000 £, 10 % jusqu'à 400 000 £, 12,5 % jusqu'à 750 000 £, 15 % jusqu'à 1,5 M£, 17 % au-delà. Exemple : résidence secondaire à 260 000 £ → 15 950 £. Barème précédent (22 décembre 2020 – 10 décembre 2024) : 4 %, 7,5 %, 9 %, 11,5 %, 14 %, 16 %.
- Aucun allègement primo-accédant. Pas de surtaxe non-résident. Sociétés : taux majorés dès 40 000 £. Majoration si un acheteur possède un autre logement, conjoints ensemble, à plusieurs un seul suffit ; exemples officiels : parent co-acheteur → taux majorés ; prêt « joint borrower, sole proprietor » → pas de majoration.
- Remplacement : main rates si l'ancienne résidence principale est vendue dans les 3 ans avant ou après ; remboursement = taux majorés − taux principaux ; amendement dans les 12 mois de la date de dépôt, sinon demande dans les 4 ans à compter du lendemain de la date de dépôt ; traitement 15 à 20 jours ouvrés.
- Héritage : part héritée de 50 % ou moins ignorée pendant 3 ans.
- Non-résidentiel : 0 % jusqu'à 225 000 £, 1 % jusqu'à 250 000 £, 5 % jusqu'à 1 M£, 6 % au-delà. Déclaration et paiement : 30 jours. Allègement pour logements multiples existant au pays de Galles (non modélisé).

**Prix moyens** : `src/data/hpi.json`, UK House Price Index de juillet 2026 (HM Land Registry, publié en septembre 2026), par collectivité : `avg`, `ftb` (prix moyen des primo-accédants), `mover` (anciens propriétaires occupants), `flat`, `terraced`, `semi`, `detached`, `change` (variation annuelle en %). L'Irlande du Nord ne publie que `avg` par district. Régénérer : `python3 scripts/data/build-hpi.py 2026-07`. Clés des villes : `london` (région), `manchester`, `birmingham`, `leeds`, `city-of-bristol`, `liverpool`, `sheffield`, `newcastle-upon-tyne`, `brighton-and-hove`, `oxford`, `belfast`, `city-of-edinburgh`, `city-of-glasgow`, `city-of-aberdeen`, `cardiff`, `swansea`.

**Ce qu'on ne publie pas** (non vérifié) : règles de propriété partagée en Écosse et au pays de Galles, allègement pour logements multiples écossais et gallois chiffré, pénalités écossaises et galloises chiffrées, toute statistique de marché hors UK HPI.

## Module « après l'achat » (ajouté le 2026-10-11)

Impôts des particuliers liés au patrimoine, année fiscale 2026-27 : Capital Gains Tax, Inheritance Tax, dividendes, revenus locatifs. 18 pages dans deux groupes : `gains` (CGT, dividendes, loyers) et `inheritance` (IHT). Dans l'en-tête, les deux groupes partagent un seul menu « Other taxes » (`src/i18n/nav.ts`, `MERGED`) ; le pied de page garde une colonne par groupe.

- **Paramètres** : `params-2026.json > wealth` (`income_tax`, `cgt`, `prr`, `dividends`, `rental`, `iht`), lus sur GOV.UK le 2026-10-11 ; sources `govCgt`, `govCgtRates`, `cg10245`, `govTaxSellHome`, `hs283`, `govCgtReport`, `govDividends`, `govRatesChange2025`, `govRentingTax`, `govS24`, `govMtd`, `govPropertyAllowance`, `govRentARoom`, `govIht`, `govIhtThresholds`, `govRnrb`, `govIhtPay`, `govIhtPensions`, `govApr`, `govBpr`, `govIncomeTaxRates`, `govScottishIncomeTax`, `govWelshIncomeTax`. Les bandes d'impôt sur le revenu sont en revenu **imposable** (après Personal Allowance).
- **Moteur** : `src/lib/engine/wealth.ts` (`cgt`, `prrShare`, `propertyGain`, `cgtDeadline`, `dividendTax`, `incomeTax`, `rentalTax`, `mtdStart`, `iht`, `giftTax`). Tests : `wealth.test.ts` rejoue les exemples GOV.UK/HMRC (CGT 1 728 £ et 10 842 £ ; PRR 54 000 £ ; dividendes 268,75 £ ; Section 24 Sophia, John, Brian sur les barèmes 2016-17 de HMRC via `S24_TEST_PARAMS` ; IHT 70 000 £, exemples RNRB, taper, Sally).
- **Outils** (`tool`) : `cgt` (`toolProps.cgtMode: 'any' | 'property'`), `iht`, `dividend`, `rental` (`src/components/calc/*Tool.tsx`). Minis : `cgtRates`, `cgtAllowance`, `prrShare`, `cgt60`, `dividendRates`, `s24Cost`, `mtdStart`, `rentARoom`, `ihtSimple`, `ihtThreshold`, `rnrbTaper`, `giftTaper`, `ihtPension` (`src/lib/minis/_wkit.ts`).
- **Hypothèses publiées** : PRR suppose « habité d'abord, loué ensuite » ; l'IHT ne modélise ni BPR/APR ni le taux de 36 % ; pas de revenus d'épargne. Pas de chiffre écossais sur la CGT au-delà de la tranche UK.
- **À surveiller** : Budget (taux CGT, dividendes, taux fonciers de 2027, seuils MTD), table HMRC des seuils IHT (NRB figé au 5 avril 2031, RNRB affiché au 5 avril 2030), budget écossais (bandes).
- `pct()` affiche désormais deux décimales quand le taux en a (10,75 %).

## Étapes

1. Vérifier que le sujet n'existe pas : `ls src/content/pages`.
2. Écrire le fichier de la page (et son mini si c'est un guide).
3. Valider la page seule : `PAGE_FILES=<id> npx vitest run tests/pages.test.ts` (snippets, bloc citable, FAQ, liens, sources, mini, mots interdits, longueur).
4. Tous les contrôles (ci-dessous), puis commit local en français, dernière ligne `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Pas de push.

## Contrôles (tous à 0)

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/uk-stamp-duty
export NODE_PATH=$(npm root -g):$PWD/node_modules
npm run build                         # inclut typo-nbsp et check-snippets (bloquant)
npx vitest run
python3 scripts/check-seo.py . ; python3 scripts/check-trame.py . ; python3 scripts/check-unique.py dist
python3 scripts/check-simulateurs.py . ; python3 scripts/check-regles.py . ; python3 scripts/check-portefeuille.py .
node scripts/check-sources.mjs . ; node scripts/check-legal.mjs .
node scripts/check-contraste.mjs dist ; node scripts/check-saisie.mjs dist --max=60 ; node scripts/check-nombres.mjs dist
node scripts/typo-nbsp.mjs dist --check ; python3 scripts/check-liens.py .
node scripts/check-layout.mjs dist > /tmp/layout-ukstamp.log 2>&1 &   # long : en arrière-plan
```

Arrêter un serveur par son port (`lsof -ti tcp:4361 | xargs kill`), jamais `pkill -f`.

## Mise à jour annuelle

Créer `params-2027.json` (ou modifier les blocs concernés), relire chaque valeur sur sa source, mettre `retrieved_at` à jour, relancer `build-hpi.py` sur le dernier mois publié, puis `npx vitest run` : les exemples officiels doivent toujours passer. Surveiller : Budget britannique (SDLT), budget écossais (LBTT, ADS), budget gallois (LTT).

## Ce qu'on ne fait pas

- Pas de dépôt GitHub, pas de push, pas de DNS sans validation de l'éditeur.
- Ne toucher ni à `_trame` ni à la RECETTE : les suggestions vont dans le compte rendu.
- Aucune identité personnelle : l'éditeur est Radif Partners. Publicité désactivée (aucun `AdSlot`).
