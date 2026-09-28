# Najem Flow

Pierwsza wersja aplikacji dla wynajmującego: mieszkania, dane stron, **zwykłe i okazjonalne umowy najmu**, generowanie PDF oraz symulacja podpisywania przez API Autenti.

**To wersja demonstracyjna.** Podpisy nie są prawnie skuteczne. Każdy PDF ma oznaczenie DEMO. Nie wpisuj prawdziwych danych osobowych. Nie jest potrzebne konto Autenti ani klucz API — podłączenie dostawcy jest zakresem kolejnej wersji.

## Logowanie i dostęp

Aplikacja używa przycisku **Zaloguj się przez ChatGPT**. Nie ma osobnego loginu ani wspólnego hasła demonstracyjnego. Każdy użytkownik loguje się własnym kontem i otrzymuje odrębną przestrzeń w bazie, początkowo z fikcyjnymi przykładami. Publiczny podgląd jest tylko do odczytu.

Repozytorium GitHub jest prywatne. Właściciel musi nadać współpracownikowi dostęp przez GitHub → Settings → Collaborators. Dostęp do repozytorium i aplikacji to dwa oddzielne uprawnienia. Adres aplikacji można przekazać koledze; zakaz indeksowania ogranicza widoczność w wyszukiwarkach, ale nie jest zabezpieczeniem dostępu.

## Co działa

- Panel z mieszkaniami, aktywnymi umowami, miesięczną sumą czynszów i kończącymi się umowami (60 dni).
- Dodawanie i edycja mieszkań, wynajmujących i najemców.
- Kreator: mieszkanie → wynajmujący → najemca → warunki → podgląd.
- Dwa szablony: zwykły najem i najem okazjonalny z warunkiem zawieszającym oraz checklistą załączników.
- PDF A4 z osadzoną czcionką obsługującą polskie znaki, automatycznym podziałem stron i oznaczeniem DEMO.
- Obieg: szkic → demonstracyjny podpis właściciela → link najemcy → demonstracyjny podpis najemcy.
- Niezmienna migawka danych dokumentu po rozpoczęciu obiegu. Zmiana osoby lub mieszkania nie zmienia wcześniej utworzonej umowy.
- Losowe linki najemcy z ważnością 7 dni, historią i anulowaniem obiegu. Link trzeba przekazać ręcznie.
- Propozycja przedłużenia jako osobny szkic i przygotowanie wiadomości w domyślnym programie pocztowym. Wiadomość nie jest automatycznie wysyłana.
- Rozdzielenie danych użytkowników na serwerze, walidacja, kontrola pochodzenia zapisu i wykrywanie konfliktów wersji.
- Przegląd pięciu dostawców podpisów i plan przyszłej integracji.

## Uruchomienie lokalne

Node.js 22.13+ (testowano z Node 24) i npm.

```sh
npm ci
npm run db:generate
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_misty_scourge.sql
npm run dev
```

Na świeżej bazie zastosuj migrację tylko raz. Kolejne zmiany schematu wymagają nowych migracji. `npm run db:generate` nie tworzy nowej migracji, jeśli schemat nie uległ zmianie.

Wejdź na adres wydrukowany przez serwer (domyślnie `http://127.0.0.1:5173`). W lokalnym trybie deweloperskim przycisk logowania tworzy wyłącznie lokalną sesję testową `seedy@sites.test`, bez hasła i bez połączenia z ChatGPT. Ten mechanizm **nie jest częścią produkcyjnego Workera**.

## Hosting i architektura

React 19 + TypeScript + Vinext, Cloudflare Workers, D1, Drizzle, pdf-lib. Binding bazy: `DB`. Konfiguracja logiczna w `.openai/hosting.json`, migracje w `drizzle/`. Repozytorium nie zawiera oryginalnego DOCX, danych użytkowników, bazy lokalnej ani sekretów.

Wdrożenie działa za zaufaną bramą Sites, która obsługuje logowanie ChatGPT i wstrzykuje nagłówki tożsamości. **Nie wystawiaj tego Workera bezpośrednio publicznie bez odpowiedniej bramy uwierzytelniającej**: same nagłówki `oai-authenticated-user-*` nie są samodzielnym systemem autoryzacji. Przy przenoszeniu na inny hosting potrzebny jest zweryfikowany mechanizm sesji po stronie serwera.

GitHub przechowuje kod. GitHub Pages jest hostingiem statycznym i nie uruchomi tej bazy ani backendu. [Dokumentacja GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

Stan użytkownika jest przechowywany jako ograniczony rozmiarem dokument JSON w D1 z kontrolą wersji; dane umowy zawierają migawkę stron i lokalu. To prosty model MVP. Przy rozbudowie należy wydzielić relacyjne tabele i migracje. PDF jest generowany na żądanie z migawki; wersja produkcyjna musi przechowywać oryginalne i podpisane pliki.

## Testy

```sh
npm run typecheck
npm run test:pdf
# Przy uruchomionym serwerze lokalnym i lokalnej bazie:
npm run test:integration
```

Test integracyjny dopisuje fikcyjne rekordy do lokalnego konta testowego. Nie uruchamia się dla adresów spoza localhost. Szczegóły i ograniczenia w [raporcie testów](docs/TESTY.md).

## Następna wersja

Rzeczywiste konto i API Autenti, bezpieczne webhooki, podpisane pliki oraz raporty audytowe, przegląd prawny szablonów, wielostronne umowy, eksport i usuwanie danych, kopie bezpieczeństwa, polityka retencji, obsługa zdarzeń błędów i limitów dostawcy. W tej wersji obsługiwany jest jeden wynajmujący i jeden najemca jako strony umowy oraz lista mieszkańców.

- [Porównanie dostawców i integracja API](docs/INTEGRACJE.md)
- [Szablony, źródła prawne i różnice](docs/SZABLONY.md)
- [Weryfikacja wersji 1](docs/TESTY.md)

Font DejaVu Sans użyty zgodnie z [dołączoną licencją](public/fonts/LICENSE-DejaVu.txt). Nie użyto logotypów ani materiałów sugerujących partnerstwo z dostawcami podpisów.
