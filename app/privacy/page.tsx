export default function Privacy() {
  return (
    <main className="legal-page">
      <a href="/" className="btn">
        ← Wróć do aplikacji
      </a>
      <h1 className="mt-8">Prywatność i zakres demo</h1>
      <p>
        Najem Flow służy do testowania tworzenia i podpisywania umów. Używaj
        wyłącznie fikcyjnych danych. Przykłady nie pochodzą z rzeczywistych
        mieszkań ani wcześniejszych rozmów.
      </p>
      <h2>Wspólne konto administratora</h2>
      <p>
        Login admin i hasło admin są publicznymi danymi demonstracyjnymi.
        Wszyscy zalogowani nimi użytkownicy widzą i mogą edytować ten sam panel,
        mieszkania, umowy i własne wzory. Konto ChatGPT nie jest potrzebne.
        Poprzednie przestrzenie kont nie zostały połączone z tą przestrzenią.
      </p>
      <p>
        Dane zapisują się w bazie Cloudflare D1. Niezbędne cookie nf_admin
        przechowuje losowy identyfikator sesji przez 24 godziny. Wylogowanie
        unieważnia tę sesję na serwerze. Usunięcie cookie lub wylogowanie nie
        usuwa danych wspólnego panelu. Kod w publicznym repozytorium GitHub nie
        zawiera zawartości bazy ani zapisanych umów.
      </p>
      <h2>Link najemcy</h2>
      <p>
        Link ważny przez 7 dni udostępnia jedną konkretną umowę każdej osobie,
        która zna adres. Nie daje dostępu do panelu admina. Najemca nie
        potrzebuje konta ani hasła. Anulowanie obiegu unieważnia linki. Nie
        publikuj tych linków w publicznych miejscach. Aplikacja nie wysyła
        e-maili ani danych do Autenti.
      </p>
      <h2>Wzory i podpisy</h2>
      <p>
        Własne wzory, dane umów i historia symulacji są zapisywane na serwerze.
        Edycja wzoru nie aktualizuje zapisanych umów. Podpisy są wyłącznie
        symulacją. Status „Aktywna” oznacza zakończony obieg demo i trwający
        okres najmu. PDF nie zawiera podpisów kryptograficznych, a checklista
        nie potwierdza doręczenia załączników.
      </p>
      <h2>Przed rzeczywistym użyciem</h2>
      <p>
        Potrzebne są indywidualne konta z odpowiednią ochroną, prawna
        weryfikacja wzorów, rzeczywista integracja podpisu, określenie
        administratora danych, podstaw przetwarzania i okresów przechowywania,
        obsługa usuwania i eksportu oraz kopie bezpieczeństwa. Obecna informacja
        opisuje demonstrację, a nie gotową usługę do obsługi danych osobowych.
      </p>
      <p>
        Zakaz indeksowania zgłaszany wyszukiwarkom nie gwarantuje ukrycia
        adresu. Repozytorium GitHub i działająca aplikacja mają osobne zasady
        dostępu.
      </p>
    </main>
  );
}
