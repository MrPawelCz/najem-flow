# Dwa pełne wzory i edytor umów

Wersja `2026-09-28.v2-full` rozwija oba wzory do **11 paragrafów**, w układzie dokumentu DOCX dostarczonego przez użytkownika. Treść jest projektem do przeglądu prawnego. Oryginał pozostaje poza repozytorium. Żadne dane osobowe, adresy, daty najmu i kwoty konkretnej umowy źródłowej nie są wartościami domyślnymi aplikacji.

## Powiązanie z dokumentem źródłowym

| Paragraf | Zakres obu wzorów |
|---|---|
| 1 | Przedmiot, tytuł prawny, wyposażenie, mieszkańcy, cel mieszkaniowy i wady |
| 2 | Protokół, liczniki, klucze, dokumenty i warunki wydania |
| 3 | Termin i brak automatycznego przedłużenia; w okazjonalnym warunek zawieszający |
| 4 | Czynsz, rachunek, pierwszy miesiąc, opcjonalny rabat i zasady zmiany |
| 5 | Media, zaliczki, dokumenty rozliczeń, nadpłaty, Internet i ubezpieczenie mienia |
| 6 | Dzień wpłaty, odsetki i rozliczenie zaległości |
| 7 | Kaucja, zakres zabezpieczenia, potrącenia, zwrot i waloryzacja |
| 8 | Szczegółowy podział napraw, części wspólne, podnajem, ulepszenia, kontrole, awarie, zamki, OC i zasady korzystania |
| 9 | Wypowiedzenie, zaległości, prezentacje, zwrot, sprzątanie, szkody i dalsze zajmowanie |
| 10 | Kontakt, doręczenia i obsługa przez zarządcę |
| 11 | Forma, prawo właściwe, załączniki, własne uzgodnienia i egzemplarze |

Najem okazjonalny dodatkowo obejmuje osobę fizyczną wynajmującą poza działalnością, termin do 10 lat, wpłatę kaucji i załączniki jako warunek zawieszający, akt notarialny, inny lokal i zgodę dysponenta, termin 21 dni na wskazanie nowego lokalu, co najmniej 7-dniowe wypowiedzenie przy braku nowych dokumentów, zgłoszenie do urzędu skarbowego w ciągu 14 dni oraz ustawowy tryb opróżnienia. W zwykłym najmie nie nałożono tych obowiązków.

## Świadome zmiany względem oryginału

Zachowano zakres zagadnień, nie skopiowano bezrefleksyjnie wszystkich sankcji. Zmiany są widoczne w pełnej treści:

- Termin zwrotu kaucji liczony od opróżnienia lokalu, bez uzależniania go od otrzymania wszystkich końcowych rachunków.
- Uwzględnienie normalnego zużycia; brak automatycznego obowiązku wymiany starych rzeczy na nowe i malowania po każdym najmie.
- Sprzątanie i naprawy rozliczane według uzasadnionych kosztów zamiast stałej opłaty niezależnej od szkody.
- Usunięto automatyczną karę równą wszystkim przyszłym czynszom, kary pieniężne za brak polisy, kontroli i prezentacji oraz domyślną karę za działalność gospodarczą.
- Zastosowano odsetki ustawowe za opóźnienie zamiast domyślnych odsetek maksymalnych.
- Brak generalnego wyłączenia praw z tytułu wad, fikcji doręczenia oraz domniemanego potwierdzenia otrzymania świadectwa energetycznego.
- Brak dodatkowego prawa wypowiedzenia tylko z powodu planowanej sprzedaży; zachowano ustawowe procedury wypowiedzenia.
- Rozróżniono opłaty: przy zwykłym najmie koszty administracji i części wspólnych są w czynszu, a dodatkowa zaliczka obejmuje dopuszczalne opłaty niezależne. W okazjonalnym opisano uzgodnione dodatkowe koszty.
- OC, rabat, zwierzęta, palenie, zapasowe klucze, częstotliwość kontroli, godzina zwrotu i notarialne poświadczenie zgody są parametrami formularza.
- Nie wpisano niezweryfikowanych deklaracji o braku zadłużenia i postępowań najemcy ani blankietowej zgody na przetwarzanie danych przez dowolnego zarządcę.

To nie jest potwierdzenie prawnej poprawności całego wzoru. Nietypowe przypadki, współwłasność, najem instytucjonalny i szczególne regulacje wymagają osobnej oceny.

## Własne wzory w panelu

W **Wzory umów** właściciel dodaje lub edytuje tekst, nadaje nazwę i wybiera rodzaj najmu. Może skopiować standardowy wzór, wkleić tekst z Worda i pobrać TXT. Nie jest to import oryginalnego formatowania DOCX ani edycja załączonego PDF.

Pola `{{najemca}}`, `{{wynajmujacy}}`, `{{czynsz}}`, `{{adres_lokalu}}` itd. są zastępowane wartościami z umowy. Pełną listę pokazuje edytor. Nieznane pola i niedomknięte nawiasy są odrzucane. Pola klauzul, np. `{{postanowienie_oc}}`, uzupełniają akapit zgodny z opcjami kreatora. Można zastąpić je własnym tekstem. Samo przypisanie wzoru do innego rodzaju najmu nie przepisuje jego postanowień.

Kreator pokazuje wzory pasujące do wybranego rodzaju. Przy zapisie umowy kopiuje treść wzoru i dane stron. Późniejsza edycja źródłowego wzoru nie zmienia dokumentu. Ponowne zapisanie edytowanego szkicu używa aktualnej wybranej wersji. Po rozpoczęciu podpisywania edycja umowy jest zablokowana. Stare dokumenty bez oznaczenia wersji nadal korzystają z archiwalnego rendererera v1.

## Podpisy, załączniki i źródła

Symulacja nie składa podpisu elektronicznego. Dla okazjonalnego i zwykłego najmu dłuższego niż rok kreator wymaga docelowego QES. Zwykły podpis elektroniczny nie jest automatycznie równoważny formie pisemnej. QES nie zastępuje aktu notarialnego. Nie istnieje ogólna zasada, że podpis online jest legalny tylko do roku.

Załączniki sporządza i doręcza się osobno. Checklista nie tworzy aktu notarialnego, nie doręcza polisy i nie zgłasza umowy do urzędu skarbowego.

Źródła urzędowe użyte przy opracowaniu: [ustawa o ochronie praw lokatorów, szczególnie art. 6, 9, 10, 11 i 19a–19e](https://eli.gov.pl/api/acts/DU/2023/725/text.html), [Kodeks cywilny, art. 78¹, 451, 483, 660, 673–675 i 682](https://eli.gov.pl/api/acts/DU/2023/1610/text.html). Aktualny wykaz tekstów i zmian jest w [ELI dla Kodeksu cywilnego](https://eli.gov.pl/eli/DU/1964/93) i [ELI dla ustawy o ochronie praw lokatorów](https://eli.gov.pl/eli/DU/2001/733). Przed wdrożeniem rzeczywistych podpisów wymagana jest ponowna ocena aktualnego stanu prawnego.

Obsługa obejmuje jednego wynajmującego i jednego najemcę jako sygnatariuszy oraz osobną listę mieszkańców. Najem na czas nieoznaczony i wielu sygnatariuszy nie są zaimplementowane.
