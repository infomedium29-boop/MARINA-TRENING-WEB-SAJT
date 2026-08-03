# Moje tijelo-moj saveznik — web projekt

Višestranični HR/EN web spreman za GitHub i Cloudflare Pages.

## Objava

1. Raspakirajte ZIP.
2. Prenesite **sav sadržaj mape `equilibrium-performance`** u korijen postojećeg GitHub repozitorija.
3. Ne uklanjajte mapu `functions` ni datoteku `wrangler.jsonc`.
4. Cloudflare Pages će nakon GitHub commita automatski pokrenuti novi deployment.
5. Framework preset ostaje **None**, a build command prazan.

## Kontakt forma

Kontakt forma šalje upite direktno na verificiranu adresu `marinamagas45@gmail.com` preko Cloudflare Pages Functiona i Cloudflare Email Servicea.

- `functions/api/contact.js` — obrada forme, validacija i slanje poruke
- `wrangler.jsonc` — `CONTACT_EMAIL` binding ograničen na verificirani Gmail i pošiljatelja s domene
- hrvatska i engleska forma šalju na `/api/contact`
- odgovor na primljeni e-mail automatski ide osobi koja je ispunila formu (`Reply-To`)
- uključena je osnovna zaštita od spama i validacija podataka

## Domena i SEO

Canonical, Open Graph, strukturirani podaci, `robots.txt` i `sitemap.xml` koriste produkcijsku domenu:

`https://mojetijelo-mojsaveznik.com`

## Fotografije i diplome

Fotografije i diplome u projektu optimizirane su u AVIF formatu. Diplome su prikazane na stranici **O pristupu / About** i mogu se otvoriti u većem prikazu.


## Kontakt forma
Kontakt forma koristi Web3Forms i šalje upite na verificiranu adresu povezanu s ugrađenim Access Keyem.
