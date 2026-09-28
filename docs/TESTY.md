# Weryfikacja aktualizacji — 28.09.2026

Wykonano lokalnie:

- TypeScript `tsc --noEmit` i kompilacja produkcyjna Vinext/Cloudflare Workers.
- Logowanie admin/admin, błędne hasło, brak dostępu anonimowego do panelu API, dwa niezależne tokeny sesji ze wspólną zawartością panelu, wylogowanie unieważniające tylko daną sesję.
- Cookie HttpOnly/SameSite, odrzucenie podstawionych nagłówków tożsamości i zapisów z obcego pochodzenia.
- Najem zwykły i okazjonalny: zapis → podpis właściciela → osobny link → akceptacja najemcy bez sesji admina.
- Link zwraca tylko konkretną umowę i termin ważności. Nie daje dostępu do listy osób, innych umów lub własnych wzorów.
- Zapis i edycja własnego wzoru, walidacja pól, odrzucenie niezgodnego rodzaju najmu oraz zachowanie migawki wcześniej zapisanej umowy.
- Blokada edycji po rozpoczęciu podpisywania, kontrola wersji zapisu, odrzucenie błędnych danych, nieistniejących encji i błędnego tokenu, idempotentna akceptacja oraz unieważnienie linku po anulowaniu.
- PDF zwykły i okazjonalny, każdy z 11 paragrafami. Przykładowe pliki mają po 9 stron. Polskie znaki, stopki, numeracja i kontrola renderów stron.
- Kopia pełnego wzoru w edytorze po podstawieniu pól jest identyczna treściowo ze wzorem standardowym. Brak pozostawionych znaczników i danych technicznych generatora.
- Archiwalny wzór v1 zachowuje tekst poprzednich umów.
- Test przeglądarkowy lokalnego logowania, zakładki Wzory umów, otwarcia pełnego edytora, zapisu własnej kopii i nawigacji WebMCP.

Testy HTTP dopisują fikcyjne dane do lokalnej bazy i nie uruchamiają się poza loopback. Dane testów nie są wysyłane do produkcyjnej bazy ani do repozytorium. Testy nie obejmują rzeczywistych podpisów, wysyłki e-maili, przeglądu prawnego, audytu bezpieczeństwa ani pełnej macierzy przeglądarek i urządzeń.
