# Podpisy elektroniczne i plan integracji

Stan sprawdzenia: 28 września 2026. Wersja 1 korzysta wyłącznie z **symulacji Autenti**, zgodnie z zakresem zaakceptowanym przez właściciela projektu. Nie wysyła zapytań ani danych do zewnętrznych dostawców. Nie pobiera opłat i nie wysyła e-maili. Nazwa dostawcy opisuje planowaną integrację, nie partnerstwo lub certyfikację aplikacji.

## Porównanie pięciu rozwiązań

| Rozwiązanie        | Potwierdzone możliwości                                                                                              | Co potrzebne w kolejnej wersji                                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Autenti            | API do wysyłania dokumentów, obsługi podpisów i zarządzania dokumentami; platforma obsługuje także QES               | Konto z uprawnieniami API, uzgodniony plan i sandbox, aktualna specyfikacja autoryzacji i procesu QES, konfiguracja kolejności stron i statusów |
| SIGNIUS            | REST API, typ QUALIFIED, kolejność `signingOrder`, callback statusu, link podpisującego i pobranie podpisanego pliku | Konto API/sandbox, konfiguracja folderu i uczestników, uzgodnione uwierzytelnienie callbacku                                                    |
| Certum SimplySign  | Podpis kwalifikowany w chmurze; oferta SimplySign API                                                                | Uzgodnienie dostępu i zakresu API oraz sposobu autoryzowania podpisu przez każdą osobę; sam podpis nie jest całym obiegiem dokumentu            |
| KIR mSzafir        | Podpis kwalifikowany jednorazowy lub długoterminowy; udostępniona sekcja integracji                                  | Kontakt z KIR w sprawie specyfikacji, środowiska testowego, certyfikatów i procesu wielostronnego                                               |
| Yousign / Youtrust | API v3, żądania podpisu i poziom `qualified_electronic_signature`, sandbox QES                                       | Konto API z odpowiednim zakresem, potwierdzenie obsługiwanych dokumentów tożsamości i krajów, konfiguracja webhooków                            |

Źródła producentów:

- [Autenti — dostępność API](https://help.autenti.com/en/knowledge/does-autenti-provide-an-api), [dokumentacja techniczna](https://developers.autenti.com/), [funkcje platformy](https://autenti.com/en/).
- [SIGNIUS — obieg dokumentów](https://docs.signius.eu/api/document-handling), [poziomy podpisów](https://docs.signius.eu/api/key-concepts).
- [Certum SimplySign i SimplySign API](https://www.certum.pl/pl/simplysign/).
- [KIR mSzafir — podpisy i integracja](https://www.mszafir.pl/).
- [Youtrust — QES](https://developers.youtrust.com/docs/qualified-signature), [tworzenie żądania podpisu](https://developers.youtrust.com/reference/post-signature_requests-1), [sandbox](https://developers.youtrust.com/docs/using-qes-signature-requests-in-sandbox). Adres developers.yousign.com przekierowuje do developers.youtrust.com.

Nie zakładamy, że zwykły abonament internetowy obejmuje dostęp API ani że każdy podpis w Autenti jest kwalifikowany. Cennik, wymagania KYC, certyfikaty i dostępność dla konkretnych podpisujących należy potwierdzić przed zakupem. Nie ma jednej zamkniętej listy „pięciu podpisów”; powyżej porównano pięć możliwych rozwiązań.

## Rekomendowany kierunek

Autenti jest pierwszym kandydatem, bo odpowiada oczekiwanemu obiegowi właściciel → najemca i zostało wskazane w wymaganiach. SIGNIUS ma czytelnie udokumentowany podobny proces. To rekomendacja projektowa na podstawie dokumentacji, nie wynik testu komercyjnego API.

Przyszły adapter powinien mieć operacje: przygotowanie koperty z niezmiennym PDF i jego SHA-256, nadanie odbiorców i kolejności, pobranie linku podpisu, odczyt statusu, anulowanie oraz pobranie podpisanego PDF i raportu audytowego. Konkretnych endpointów Autenti nie zaimplementowano — muszą odpowiadać aktualnej specyfikacji udostępnionej dla konta.

Sekrety wyłącznie po stronie serwera i w konfiguracji hostingu. Webhook wymaga weryfikacji autentyczności, ochrony przed powtórzeniami i idempotencji; stan końcowy należy potwierdzić u dostawcy i pobrać plik przed oznaczeniem rzeczywistej umowy jako podpisanej. Oryginalny PDF musi zostać utrwalony przed pierwszym podpisem; podpisanego pliku nie wolno regenerować z szablonu. Pliki i raporty można przechowywać w R2, a identyfikatory, sumy kontrolne i statusy w D1.

## Obecna symulacja

`POST /api/workspace` obsługuje `owner-sign` i `invite`, a `POST /api/sign/:token` kończy symulację najemcy. Serwer pilnuje kolejności, zamraża treść po pierwszym kroku i zapisuje historię. Link zawiera losowe 256 bitów, w bazie przechowywany jest tylko jego skrót SHA-256. Link wygasa po 7 dniach. Anulowany obieg blokuje wszystkie linki. Powtórna akceptacja jest idempotentna.

PDF powstaje z zapisanej migawki danych, ma polskie znaki i oznaczenie DEMO. Nie zawiera podpisów kryptograficznych, także po zakończeniu symulacji. Przycisk propozycji przedłużenia tworzy nowy szkic, a „Przygotuj e-mail” otwiera edytor poczty użytkownika; sam nie wysyła wiadomości.
