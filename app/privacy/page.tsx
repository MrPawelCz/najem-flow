export default function Privacy() {
  return (
    <main className="legal-page">
      <a href="/" className="btn">
        ← Wróć do aplikacji
      </a>
      <h1 className="mt-8">Prywatność i zakres wersji demo</h1>
      <p>
        Najem Flow to prototyp do testowania tworzenia i obiegu umów najmu. W
        tej wersji należy używać wyłącznie fikcyjnych danych. Dane
        demonstracyjne nie pochodzą z rzeczywistych mieszkań ani wcześniejszych
        rozmów użytkownika.
      </p>
      <h2>Logowanie i przechowywanie</h2>
      <p>
        Logowanie odbywa się przez ChatGPT. Dane mieszkań, osób, warunki umów i
        historia symulacji są przechowywane w bazie przypisanej do stabilnego
        identyfikatora zalogowanego użytkownika. Każde konto ma własną
        przestrzeń. Aplikacja nie pobiera ani nie zapisuje hasła do ChatGPT.
        Identyfikator konta nie jest automatycznie przepisywany do danych
        wynajmującego.
      </p>
      <p>
        Publiczny podgląd pokazuje tylko fikcyjne przykłady. Link najemcy jest
        tajnym adresem ważnym przez 7 dni, który udostępnia treść konkretnej
        umowy każdemu posiadaczowi linku. Nie wklejaj takich linków w
        publicznych miejscach. Anulowanie obiegu blokuje linki. Wersja demo nie
        wysyła danych do Autenti ani innych dostawców podpisu.
      </p>
      <h2>Co oznacza podpis w tej wersji</h2>
      <p>
        Wszystkie podpisy są symulowane. Status „Aktywna” oznacza ukończony
        demonstracyjny obieg i trwający okres najmu, a nie potwierdzenie prawnej
        skuteczności umowy. Każdy PDF jest oznaczony jako demo i nie zawiera
        podpisu kryptograficznego. Lista kontrolna załączników jest notatką
        użytkownika.
      </p>
      <h2>Przed uruchomieniem rzeczywistej usługi</h2>
      <p>
        Potrzebne są: zweryfikowane prawnie wzory, rzeczywista integracja
        podpisów i walidacja podpisanego PDF, ustalenie administratora danych
        oraz podstaw przetwarzania, umowy powierzenia z dostawcami, okresy
        retencji, mechanizmy usunięcia i eksportu danych, kopie bezpieczeństwa i
        audyt bezpieczeństwa. Obecna informacja opisuje prototyp; nie jest
        polityką prywatności gotowej usługi komercyjnej.
      </p>
      <p>
        Aplikacja zgłasza wyszukiwarkom zakaz indeksowania. To nie jest kontrola
        dostępu ani gwarancja ukrycia adresu. Prywatne repozytorium GitHub jest
        oddzielone od dostępu do działającej aplikacji.
      </p>
    </main>
  );
}
