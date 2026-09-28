# Umowy zwykłe i okazjonalne

Szablony to **uproszczone projekty do przeglądu prawnego**, nie gotowa porada prawna. Dane stron, kwoty, adresy i terminy są pobierane wyłącznie z formularza. Dane konta logowania nie są automatycznie przenoszone do umowy.

Materiałem odniesienia był dostarczony plik DOCX z umową najmu okazjonalnego pod warunkiem zawieszającym. Oryginał pozostaje poza repozytorium. Nie skopiowano żadnych danych właściciela ani rzeczywistych lokali. Zachowano strukturę: strony, lokal, wydanie, termin, czynsz, opłaty, kaucja, obowiązki, zakończenie i załączniki. W najmie okazjonalnym pozostawiono warunek dostarczenia wymaganych załączników w określonym terminie.

Nie przeniesiono automatycznie m.in. kar umownych, wyłączenia rękojmi, wypowiedzenia w związku ze sprzedażą, generalnego obowiązku odmalowania i zwrotu normalnego zużycia, ani domniemania otrzymania świadectwa energetycznego. Te klauzule wymagają oceny w konkretnym stanie faktycznym. Załączniki nie są tworzone przez aplikację; checklista jest notatką i nie potwierdza ich doręczenia.

## Rozróżnienia prawne wpływające na aplikację

- Najem okazjonalny dotyczy osoby fizycznej będącej właścicielem i nieprowadzącej działalności gospodarczej w zakresie wynajmowania lokali. Jest terminowy, maksymalnie na 10 lat. Umowa i zmiany wymagają formy pisemnej pod rygorem nieważności.
- Kwalifikowany podpis elektroniczny może zachować formę równoważną pisemnej. Zwykłe kliknięcie, podpis SES i autoryzacja SMS nie są automatycznie podpisem kwalifikowanym. Profil Zaufany nie jest uniwersalnym zamiennikiem QES przy prywatnych umowach.
- Oświadczenie najemcy o poddaniu się egzekucji wymaga aktu notarialnego. Potrzebne jest także wskazanie innego lokalu i zgoda osoby z tytułem prawnym; na żądanie wynajmującego jej podpis musi być notarialnie poświadczony. Aplikacja nie zastępuje notariusza.
- Najem okazjonalny podlega zgłoszeniu do właściwego urzędu skarbowego w ciągu 14 dni od rozpoczęcia najmu.
- Zwykły najem nieruchomości lub pomieszczenia na czas dłuższy niż rok powinien mieć formę pisemną; jej brak skutkuje traktowaniem umowy jako zawartej na czas nieoznaczony. Nie istnieje ogólna zasada, że „podpis online jest legalny tylko do roku”.
- Kreator dopuszcza SES przy zwykłym najmie do roku, a dla najmu okazjonalnego i dłuższych okresów wymaga wyboru QES. To polityka kreatora; symulacja nie spełnia żadnej z tych form.
- Kaucja jest walidowana względem limitu sześciokrotności czynszu przy najmie okazjonalnym i dwunastokrotności przy zwykłym najmie objętym odpowiednimi przepisami.

Źródła urzędowe sprawdzone 28.09.2026: [ustawa o ochronie praw lokatorów, art. 6 i 19a–19e](https://eli.gov.pl/api/acts/DU/2023/725/text.html) oraz [Kodeks cywilny, art. 78¹, 660 i 673](https://eli.gov.pl/api/acts/DU/2023/1610/text.html). Wdrożenie produkcyjne wymaga sprawdzenia aktualnego stanu prawnego, szczególnych przypadków i treści przez prawnika.

Wersja 1 obsługuje jednego wynajmującego i jednego najemcę jako strony dokumentu oraz listę osób zamieszkujących. Współwłaściciele, wielu najemców jako współsygnatariusze, pełnomocnictwa i najem instytucjonalny wymagają rozszerzenia modelu. Wersja 1 obsługuje wyłącznie najem terminowy.
