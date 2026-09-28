# Weryfikacja wersji 1

Wykonano lokalnie:

- TypeScript: `tsc --noEmit`.
- Kompilacja produkcyjna Vinext/Cloudflare Workers.
- Testy HTTP obu wariantów: szkic → właściciel → link → najemca → ukończona symulacja.
- Trwałość zapisu w D1, niezmienność dokumentu po pierwszym kroku, odrzucenie niepoprawnych dat i SES w najmie okazjonalnym.
- Brak dostępu anonimowego do przestrzeni konta, odrzucenie podstawionych nagłówków w lokalnym trybie logowania, obcych identyfikatorów encji i żądań z obcego pochodzenia.
- Ochrona przed nadpisaniem nowszej wersji danych, idempotentna ponowna akceptacja, odrzucenie błędnego tokenu i linku anulowanego obiegu.
- Generowanie zwykłego i okazjonalnego PDF, polskie znaki, numeracja, oznaczenia DEMO; renderowanie i kontrola stron PDF.

Przeglądarka dostępna w środowisku odrzuciła lokalny adres podglądu. Nie udało się wykonać wizualnego testu interfejsu ani testów WebMCP w działającej przeglądarce. Zamiast tego sprawdzono serwerowy render stron, kompilację i rzeczywiste wywołania HTTP. Responsywność jest zaimplementowana, ale nie została potwierdzona testem przeglądarkowym. Testy te nie zastępują audytu bezpieczeństwa ani przeglądu prawnego.

Testy API uruchamiaj tylko na lokalnym podglądzie, ponieważ tworzą fikcyjne rekordy testowe. Skrypt celowo odrzuca adresy spoza loopback.
