#!/usr/bin/env python3
"""Jeu de données des prix moyens : UK House Price Index (HM Land Registry, ONS, Registers of
Scotland, Land & Property Services NI), par collectivité locale, pour un mois donné.

Rejouable : python3 scripts/data/build-hpi.py 2026-07  →  src/data/hpi.json
Source : point SPARQL public de HM Land Registry (https://landregistry.data.gov.uk/landregistry/query).
La nation vient du code GSS de la région (E, W, S, N) ; jamais déduite du nom.
"""
import csv, io, json, re, sys, urllib.parse, urllib.request, datetime, os

MONTH = sys.argv[1] if len(sys.argv) > 1 else '2026-07'
Q = f"""
PREFIX ukhpi: <http://landregistry.data.gov.uk/def/ukhpi/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
SELECT ?region ?label ?gss ?avg ?ftb ?foo ?flat ?det ?semi ?ter ?chg WHERE {{
  ?obs ukhpi:refMonth "{MONTH}"^^<http://www.w3.org/2001/XMLSchema#gYearMonth> ;
       ukhpi:refRegion ?region ; ukhpi:averagePrice ?avg .
  OPTIONAL {{ ?obs ukhpi:averagePriceFirstTimeBuyer ?ftb }}
  OPTIONAL {{ ?obs ukhpi:averagePriceFormerOwnerOccupier ?foo }}
  OPTIONAL {{ ?obs ukhpi:averagePriceFlatMaisonette ?flat }}
  OPTIONAL {{ ?obs ukhpi:averagePriceDetached ?det }}
  OPTIONAL {{ ?obs ukhpi:averagePriceSemiDetached ?semi }}
  OPTIONAL {{ ?obs ukhpi:averagePriceTerraced ?ter }}
  OPTIONAL {{ ?obs ukhpi:percentageAnnualChange ?chg }}
  ?region rdfs:label ?label .
  OPTIONAL {{ ?region rdfs:seeAlso ?gss . FILTER(STRSTARTS(STR(?gss), 'http://statistics.data.gov.uk/id/statistical-geography/')) }}
}}"""
req = urllib.request.Request('https://landregistry.data.gov.uk/landregistry/query',
                             data=urllib.parse.urlencode({'query': Q}).encode(), headers={'Accept': 'text/csv'})
rows = list(csv.DictReader(io.StringIO(urllib.request.urlopen(req, timeout=120).read().decode())))
NATION = {'E': 'england', 'W': 'wales', 'S': 'scotland', 'N': 'ni'}
# Chaque région porte deux libellés sans balise de langue (anglais et gallois) : on garde celui
# dont la forme en tirets redonne l'identifiant de la région (« city-of-edinburgh »).
slugify = lambda t: re.sub(r'[^a-z0-9]+', '-', t.lower()).strip('-')
rows.sort(key=lambda r: slugify(r['label']) != r['region'].rsplit('/', 1)[1])
out = {}
for r in rows:
    slug = r['region'].rsplit('/', 1)[1]
    gss = r['gss'].rsplit('/', 1)[1] if r['gss'] else ''
    # Collectivités locales seulement (E06–E09 : unitaires, districts, métropoles, Londres ;
    # W06, S12, N09) ; les régions et nations ont aussi leur ligne, utile aux comparaisons.
    level = 'la' if gss[:3] in ('E06', 'E07', 'E08', 'E09', 'W06', 'S12', 'N09') else ('nation' if gss[:3] in ('E92', 'W92', 'S92', 'N92', 'K02', 'K03', 'K04') else ('region' if gss[:3] == 'E12' else 'other'))
    if level == 'other' or slug in out:
        continue
    n = lambda k: int(round(float(r[k]))) if r.get(k) else None
    out[slug] = {'name': r['label'], 'gss': gss, 'nation': NATION.get(gss[:1], 'uk'), 'level': level,
                 'avg': n('avg'), 'ftb': n('ftb'), 'mover': n('foo'), 'flat': n('flat'), 'detached': n('det'),
                 'semi': n('semi'), 'terraced': n('ter'), 'change': float(r['chg']) if r.get('chg') else None}
data = {'month': MONTH, 'retrieved_at': datetime.date.today().isoformat(),
        'source': 'UK House Price Index, HM Land Registry (SPARQL endpoint landregistry.data.gov.uk)',
        'regions': dict(sorted(out.items()))}
dst = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'data', 'hpi.json')
json.dump(data, open(dst, 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(MONTH, len(out), Counter((v['nation'], v['level']) for v in out.values()))
