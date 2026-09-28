# Najem Flow

Aplikacja dla wynajmującego: mieszkania, osoby, **zwykłe i okazjonalne umowy najmu**, własne wzory, PDF i symulacja obiegu Autenti.

[Aplikacja](https://najem-flow-k7m9p2.pawelczerwinski.chatgpt.site) · [Kod](https://github.com/MrPawelCz/najem-flow)

## Dostęp do wersji demo

**Login: admin. Hasło: admin.** Nie jest potrzebne konto ChatGPT. Jest jeden wspólny panel administratora: wszystkie osoby korzystające z tych danych widzą i edytują te same mieszkania, umowy i wzory. To jawne dane dostępowe do demonstracji, nie zabezpieczenie rzeczywistych danych. Wpisuj wyłącznie fikcyjne dane.

Najemca otrzymuje od administratora osobny link do konkretnej umowy. Nie loguje się jako admin. Link jest ważny 7 dni, pokazuje wyłącznie tę umowę i pozwala ukończyć symulację podpisu. E-mail nie jest wysyłany automatycznie. Podpisy nie mają skutków prawnych, a PDF pozostaje oznaczony DEMO.

Kod w GitHub jest publiczny. Baza danych, sesje, linki podpisu i wpisane umowy nie są częścią repozytorium. Stare przestrzenie kont ChatGPT nie zostały upublicznione ani połączone z nowym panelem demo.

## Co działa

- Panel mieszkań, umów aktywnych i kończących się w ciągu 60 dni.
- Dodawanie i edycja lokali, wynajmujących oraz najemców.
- Kreator: mieszkanie → wynajmujący → najemca → warunki i wzór → podgląd.
- Dwa pełne wzory po 11 paragrafów opracowane na podstawie dostarczonego lokalnie DOCX, z osobną logiką najmu zwykłego i okazjonalnego.
- **Wzory umów:** tworzenie i edycja własnych wzorów, kopiowanie standardowego wzoru, wklejanie tekstu z Worda, przypisanie rodzaju najmu, podgląd na fikcyjnych danych i pobranie TXT.
- Pola takie jak `{{najemca}}`, `{{czynsz}}`, `{{adres_lokalu}}` uzupełniane z formularza. Edytor pokazuje wszystkie obsługiwane pola i odrzuca nieznane.
- Rabat za terminową wpłatę, OC i suma ubezpieczenia, częstotliwość przeglądów, godzina zwrotu, zwierzęta, palenie, zapasowe klucze i wymogi zgody do innego lokalu.
- PDF A4 z polskimi znakami, numeracją i automatycznym podziałem stron.
- Obieg: szkic → symulacja podpisu właściciela → link dla najemcy → symulacja podpisu najemcy.
- Zapisane umowy zawierają kopie danych stron, lokalu i użytego własnego wzoru. Zmiana wzoru nie zmienia zapisanej umowy. Edycja szkicu pobiera aktualną treść wybranego wzoru; rozpoczęty obieg blokuje edycję.
- Zachowana obsługa wzorów v1, aby nie przepisywać starych dokumentów przy aktualizacji.
- Propozycja przedłużenia jako nowy szkic i przygotowanie wiadomości w programie pocztowym.
- Serwerowa walidacja, ochrona zapisów przed obcym pochodzeniem, kontrola konfliktów wersji, losowe sesje z HttpOnly/SameSite i unieważnianie przy wylogowaniu.

Własne wzory mają postać tekstową; import formatu DOCX/PDF z zachowaniem układu nie jest zaimplementowany. Edytor nie ocenia zgodności własnych zapisów z prawem. Standardowe klauzule zależne od opcji formularza są dostępne jako pola, np. `{{postanowienie_oc}}`.

## Baza danych i hosting

Działa rzeczywista baza **Cloudflare D1**. Stan panelu, własne wzory, migawki umów, skróty tokenów sesji i zaproszenia są zapisywane po stronie serwera. Nie opieramy zapisu umów na localStorage. Sesja admina trwa 24 godziny; po ponownym zalogowaniu dane pozostają dostępne.

React 19, TypeScript, Vinext, Cloudflare Workers, D1, Drizzle, pdf-lib. `DB` to logiczna nazwa bazy; konfiguracja jest w `.openai/hosting.json`, a migracje w `drizzle/`. Tabela `guest_sessions` zachowała nazwę z etapu prototypu; aktualny kod używa jej wyłącznie do sesji wspólnego konta admin i odrzuca inne identyfikatory.

GitHub przechowuje kod. [GitHub Pages obsługuje statyczne strony](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), więc nie uruchomi tego backendu ani D1. Aktualna aplikacja działa osobno w Sites/Cloudflare. Przeniesienie na serwer ZEN wymaga najpierw ustalenia dostawcy, środowiska i bazy. Zwykły hosting PHP/MySQL nie uruchomi tego projektu bez dostosowania. Obecnie nie potrzebujemy dodatkowej bazy do działania demo.

Stan jest ograniczonym rozmiarem dokumentem JSON w D1 z kontrolą wersji (do 1,5 mln znaków, maks. 30 własnych wzorów po 65 tys. znaków). PDF powstaje z migawki; wersja produkcyjna powinna zachowywać oryginalne i podpisane pliki. Oryginał DOCX, lokalna baza, katalog outputs i sekrety są poza repozytorium.

## Uruchomienie lokalne

Node.js 22.13+ oraz npm:

```sh
npm ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_misty_scourge.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_handy_dust.sql
npm run dev
```

Migracje stosuj po jednym razie, w kolejności. Na istniejącej bazie stosuj tylko brakujące. Lokalny adres to zwykle `http://127.0.0.1:5173`. Dane demo: `admin / admin`, tak samo jak we wdrożeniu. Mechanizm lokalnego logowania Sites zawarty w narzędziach deweloperskich nie jest używany przez aplikację.

## Weryfikacja

```sh
npm run typecheck
npm run test:pdf
# Przy działającym serwerze i lokalnej bazie:
npm run test:integration
```

Test API dopisuje fikcyjne dane do lokalnej wspólnej przestrzeni admina i działa wyłącznie na adresie loopback. [Raport testów](docs/TESTY.md).

## Następna wersja

Rzeczywiste konta i uprawnienia, API wybranego dostawcy podpisu, webhooki i podpisane pliki, przegląd prawny, retencja, usuwanie i eksport danych oraz kopie bezpieczeństwa. Aktualnie jeden wynajmujący i jeden najemca podpisują umowę; dodatkowi mieszkańcy nie stają się automatycznie stronami.

- [Wzory i różnice względem dokumentu źródłowego](docs/SZABLONY.md)
- [Porównanie dostawców podpisów](docs/INTEGRACJE.md)
- [Licencja fontu](public/fonts/LICENSE-DejaVu.txt)
