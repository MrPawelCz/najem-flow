import {
  type Contract,
  detailedDefaults,
  fmtDate,
  money,
  TEMPLATE_VERSION,
} from "./model";
type Section = { title: string; text: string };
const numbered = (items: string[]) =>
  items.map((text, i) => `${i + 1}. ${text}`).join("\n");

// Each branch is a distinct agreement. Shared clauses preserve the source's §1–§11 structure.
export function fullContractSections(c: Contract): Section[] {
  const { property: p, owner: o, tenant: n } = c;
  const t = { ...detailedDefaults, ...c.terms };
  const occasional = t.kind === "occasional";
  const account = o.bankAccount || "[rachunek do uzupełnienia przed zawarciem]";
  const end = `${fmtDate(t.end)}, godz. ${t.returnTime}`;
  const form =
    occasional || t.signature === "qes"
      ? "formy pisemnej, której równoważna jest forma elektroniczna z kwalifikowanymi podpisami elektronicznymi obu Stron"
      : "co najmniej formy dokumentowej, chyba że dla danego oświadczenia ustawa wymaga formy pisemnej lub surowszej";
  return [
    {
      title: occasional
        ? "Umowa najmu okazjonalnego lokalu mieszkalnego pod warunkiem zawieszającym"
        : "Umowa najmu lokalu mieszkalnego na czas oznaczony",
      text: `Nr ${c.number} • zawarta dnia ${fmtDate(t.signedDate)}.\nDEMO — projekt do weryfikacji przed rzeczywistym użyciem. Symulacja w aplikacji nie składa podpisu elektronicznego. Wersja wzoru: ${TEMPLATE_VERSION}.`,
    },
    {
      title: "Strony umowy",
      text: `Wynajmujący: ${o.name}, adres zamieszkania i do doręczeń: ${o.address}, dane identyfikacyjne: ${o.identity || "[do uzupełnienia]"}, e-mail: ${o.email}, telefon: ${o.phone || "nie podano"}, zwany dalej „Wynajmującym”.\nNajemca: ${n.name}, adres zamieszkania i do doręczeń: ${n.address}, dane identyfikacyjne: ${n.identity || "[do uzupełnienia]"}, e-mail: ${n.email}, telefon: ${n.phone || "nie podano"}, zwany dalej „Najemcą”.\nWynajmujący i Najemca, zwani łącznie „Stronami”, ustalają następujące warunki. Osoby wymienione jako mieszkańcy w § 1 nie stają się przez samo wymienienie Stronami umowy.`,
    },
    {
      title: "§ 1. Przedmiot najmu",
      text: numbered([
        `Przedmiotem najmu jest lokal mieszkalny pod adresem: ${p.address}, ${p.postalCode} ${p.city}, o powierzchni ${p.area} m², liczba pokoi: ${p.rooms}, zwany dalej „Lokalem”. Wynajmujący oświadcza, że przysługuje mu tytuł prawny: ${p.title}, oraz uprawnienie do oddania Lokalu w najem.`,
        `Wynajmujący oddaje Najemcy Lokal wraz z wyposażeniem do używania w okresie określonym w § 3, a Najemca zobowiązuje się płacić czynsz i pozostałe należności określone w umowie. Wyposażenie objęte najmem: ${p.equipment || "według szczegółowego wykazu w protokole zdawczo-odbiorczym"}. Pomieszczenia przynależne i miejsce postojowe są objęte najmem tylko wtedy, gdy zostały wyraźnie wskazane w dodatkowych uzgodnieniach i protokole.`,
        `Lokal służy wyłącznie zaspokajaniu potrzeb mieszkaniowych. Uzgodnione osoby zamieszkujące: ${t.occupants}. Najemca informuje Wynajmującego o zmianach składu mieszkańców, z poszanowaniem praw wynikających z przepisów o ochronie lokatorów i stosunków rodzinnych. Zmiana przeznaczenia Lokalu wymaga uprzedniej pisemnej zgody Wynajmującego.`,
        "Wynajmujący oświadcza, że nie istnieją prawa osób trzecich ani inne znane mu przeszkody uniemożliwiające korzystanie z Lokalu zgodnie z umową. Przed podpisaniem Strony weryfikują tytuł prawny Wynajmującego oraz ewentualne zgody współwłaścicieli lub osób, których zgoda jest wymagana.",
        "Najemca zapoznaje się ze stanem technicznym, sanitarnym i wyposażeniem Lokalu. Stwierdzone wady, usterki i zastrzeżenia wpisuje się do protokołu. Podpisanie umowy nie oznacza potwierdzenia nieistniejących oględzin ani zrzeczenia się uprawnień związanych z wadami, w szczególności zagrażającymi zdrowiu. Usterki ujawnione później należy niezwłocznie zgłosić Wynajmującemu.",
        "Najemca zobowiązuje się zapewnić środki na terminowe wykonywanie zobowiązań wynikających z umowy. Umowa nie zawiera domniemania, że sprawdzono jego dochody, zadłużenie lub rejestry publiczne; dodatkowe oświadczenia finansowe wymagają osobnego, świadomego potwierdzenia.",
        "Bez odrębnej pisemnej zgody Wynajmującego nie wolno zmieniać Lokalu w siedzibę przedsiębiorstwa, prowadzić w nim działalności zmieniającej jego mieszkaniowe przeznaczenie ani zgłaszać jego adresu jako adresu wykonywania działalności gospodarczej. Zwykła praca zdalna bez zmiany przeznaczenia, przyjmowania klientów i uciążliwości dla sąsiadów nie narusza tego postanowienia.",
      ]),
    },
    {
      title: "§ 2. Wydanie przedmiotu najmu",
      text: numbered([
        `Przekazanie Lokalu nastąpi dnia ${fmtDate(t.handover)}, w godzinie uzgodnionej przez Strony. Następuje ono na podstawie protokołu zdawczo-odbiorczego podpisanego przez obie Strony albo ich należycie umocowanych przedstawicieli.`,
        "Protokół obejmuje co najmniej: opis pomieszczeń i ich stanu, wykaz wyposażenia, istniejące uszkodzenia, odczyty i numery liczników, liczbę przekazanych kluczy, pilotów i kart dostępu oraz dokumentację zdjęciową zaakceptowaną przez Strony. Każda Strona otrzymuje kopię protokołu i uzgodnionych zdjęć.",
        `Wydanie Lokalu wymaga wcześniejszego wpłacenia kaucji i czynszu za pierwszy okres najmu${t.insurance ? " oraz przekazania potwierdzenia polisy OC określonej w § 8" : ""}.${occasional ? " Dodatkowo muszą być spełnione warunki określone w § 3 i przekazane dokumenty najmu okazjonalnego wymienione w § 11." : " Terminy należności wynikają z § 4 i § 7. Sam brak wpłaty nie jest równoznaczny z nieważnością lub automatycznym rozwiązaniem umowy."}`,
        "Jeżeli Najemca nie odbierze Lokalu w uzgodnionym terminie z przyczyn leżących po jego stronie, mimo prawidłowego przygotowania Lokalu do wydania, Strony ustalą dodatkowy termin i udokumentują przyczynę opóźnienia. Nie uchyla to samo w sobie obowiązków płatniczych wynikających ze skutecznie obowiązującej umowy. Nie dotyczy to niewydania Lokalu z przyczyn obciążających Wynajmującego ani niespełnienia warunku zawieszającego.",
        t.spareKeys
          ? "Najemca zgadza się na przechowywanie przez Wynajmującego zapasowego kompletu kluczy. Liczbę i sposób zabezpieczenia kompletu opisuje protokół. Posiadanie kluczy nie uprawnia do swobodnego wejścia do Lokalu; dostęp wymaga zgody Najemcy lub przesłanek i trybu ustawowego wskazanego w § 8."
          : "Wynajmujący nie zachowuje zapasowego kompletu kluczy do Lokalu, chyba że Strony później uzgodnią to odrębnie na piśmie. Dostęp w sytuacji awaryjnej odbywa się zgodnie z § 8 i obowiązującymi przepisami.",
        "Wynajmujący przekazuje instrukcje obsługi udostępnianych urządzeń, znane zasady bezpieczeństwa oraz regulamin porządku domowego, jeżeli obowiązuje. Faktyczne przekazanie świadectwa charakterystyki energetycznej zostanie potwierdzone odrębnie, ze wskazaniem numeru i daty dokumentu; samo wygenerowanie umowy nie stanowi potwierdzenia jego odbioru.",
      ]),
    },
    {
      title: occasional
        ? "§ 3. Okres obowiązywania i warunek zawieszający"
        : "§ 3. Okres obowiązywania umowy",
      text: numbered([
        `Umowa zostaje zawarta na czas oznaczony od ${fmtDate(t.start)} do ${end}. Lokal podlega zwrotowi najpóźniej z końcem tego okresu, chyba że Strony uzgodnią wcześniejsze zakończenie lub przedłużenie w wymaganej formie.`,
        ...(occasional
          ? [
              "Wynajmujący oświadcza, że jest osobą fizyczną nieprowadzącą działalności gospodarczej w zakresie wynajmowania lokali. Strony zamierzają zawrzeć najem okazjonalny lokalu, a nie najem instytucjonalny. Ustalony czas trwania nie przekracza 10 lat.",
              `Powstanie obowiązku wydania Lokalu i świadczenia najmu jest uzależnione od łącznego spełnienia do ${fmtDate(t.conditionDeadline)} następujących warunków: wpłaty całej kaucji oraz dostarczenia aktu notarialnego Najemcy, wskazania innego lokalu i zgody osoby z tytułem prawnym do tego lokalu, opisanych w § 11. Wynajmujący potwierdza otrzymanie wpłaty i dokumentów w sposób umożliwiający zachowanie potwierdzenia.`,
              "Do czasu spełnienia warunku zawieszającego Lokal nie zostaje wydany. Jeżeli warunek nie zostanie spełniony w oznaczonym terminie, umowa nie wywoła skutków przewidzianych dla najmu. Wynajmujący zwróci otrzymane wpłaty w ciągu 7 dni od bezskutecznego upływu terminu; nie pobiera czynszu za okres, w którym najem nie powstał. Przesunięcie terminu wymaga zgodnego porozumienia Stron przed jego upływem, w formie wymaganej dla zmiany umowy.",
            ]
          : [
              "Jest to zwykła umowa najmu mieszkalnego. Jej zawarcie nie wymaga wskazania lokalu zastępczego, zgody jego właściciela ani oświadczenia Najemcy o poddaniu się egzekucji. Wpłata kaucji pozostaje zobowiązaniem umownym oraz warunkiem wydania Lokalu określonym w § 2; nie jest warunkiem zawieszającym skuteczność tej umowy.",
            ]),
        "Strony wyłączają domniemanie przedłużenia najmu na czas nieoznaczony wynikające z art. 674 Kodeksu cywilnego. Samo dalsze zajmowanie Lokalu po terminie nie oznacza zgody na przedłużenie. Propozycja przedłużenia przesłana za pomocą aplikacji pozostaje propozycją do czasu zawarcia odpowiedniego porozumienia.",
        "Sposoby wcześniejszego zakończenia najmu i obowiązki przy zwrocie Lokalu określa § 9. Umowa na czas oznaczony nie daje każdej ze Stron ogólnego, swobodnego prawa jej wypowiedzenia w dowolnej chwili.",
      ]),
    },
    {
      title: "§ 4. Czynsz najmu",
      text: numbered([
        `Czynsz za pełny miesiąc kalendarzowy wynosi ${money(t.rent)} brutto. Okresem rozliczeniowym jest miesiąc kalendarzowy. Za niepełny pierwszy lub ostatni miesiąc czynsz oblicza się proporcjonalnie do liczby dni najmu i liczby dni w danym miesiącu.`,
        `Czynsz płatny jest z góry do ${t.paymentDay}. dnia każdego miesiąca na rachunek Wynajmującego: ${account}. W tytule przelewu Najemca wskazuje numer umowy oraz miesiąc, którego dotyczy płatność. Czynsz za pierwszy, także niepełny, okres jest płatny najpóźniej w dniu przekazania Lokalu, przed wydaniem kluczy.`,
        t.discount > 0
          ? `Wynajmujący przyznaje rabat ${money(t.discount)} za miesiąc, jeżeli najpóźniej do ${t.discountDay}. dnia tego miesiąca na rachunku zostanie zaksięgowana pełna kwota czynszu pomniejszona o rabat oraz należna zaliczka na opłaty. Czynsz po rabacie wynosi ${money(t.rent - t.discount)}. Przy niepełnym miesiącu rabat oblicza się proporcjonalnie; termin rabatu dla pierwszego okresu przypada w dniu wydania Lokalu, jeżeli rozpoczyna się on po wskazanym dniu miesiąca. Niespełnienie warunku oznacza obowiązek dopłaty różnicy do pełnego czynszu w jego terminie płatności.`
          : "Strony nie przewidują rabatu za wcześniejszą lub terminową zapłatę czynszu. Kwota czynszu pozostaje taka sama niezależnie od daty wpłaty, z zastrzeżeniem odsetek za opóźnienie.",
        "Zmiana rachunku wymaga doręczenia Najemcy pisemnej informacji pochodzącej od Wynajmującego i nie zmienia pozostałych warunków umowy. W razie wątpliwości Najemca potwierdza zmianę dotychczasowym kanałem kontaktu. Wiadomość od osoby trzeciej nie jest samodzielną podstawą zmiany rachunku.",
        occasional
          ? "W okresie oznaczonym w umowie Strony nie przewidują jednostronnego podwyższenia czynszu. Zmiana jego wysokości wymaga zgodnego aneksu. Zmiana rzeczywistych kosztów mediów i uzgodnionych opłat z § 5 nie stanowi sama w sobie podwyższenia czynszu."
          : "Zmiana czynszu wymaga zgodnego aneksu albo skutecznej zmiany na zasadach i z zachowaniem formy, terminów oraz uprawnień Najemcy przewidzianych w ustawie o ochronie praw lokatorów. Samo przesłanie nowej kwoty w panelu nie zmienia umowy.",
      ]),
    },
    {
      title: "§ 5. Inne opłaty i rozliczenia",
      text: numbered([
        occasional
          ? "Podatek od nieruchomości i koszt ubezpieczenia samego Lokalu obciążają Wynajmującego i są uwzględnione w czynszu. Najemca pokrywa dodatkowo przypadające na Lokal opłaty za administrowanie i utrzymanie części wspólnych oraz koszty mediów wskazane poniżej, w zakresie faktycznie świadczonych usług. Opłaty te nie obejmują kredytu Wynajmującego ani nieuzgodnionych inwestycji."
          : "Czynsz obejmuje podatek od nieruchomości, ubezpieczenie Lokalu, koszty administracji i zarządu oraz utrzymania nieruchomości wspólnej obciążające właściciela. Oprócz czynszu Wynajmujący pobiera tylko opłaty niezależne od właściciela w granicach dopuszczonych ustawą. Opłaty administratora, fundusz remontowy lub rata kredytu nie są tu osobną zaliczką obciążającą Najemcę.",
        "Koszty mediów obejmują, odpowiednio do wyposażenia Lokalu i sposobu rozliczeń: energię elektryczną, gaz, ciepłą i zimną wodę, odprowadzanie ścieków, centralne ogrzewanie oraz odbiór odpadów. Najemca nie jest obciążany dwukrotnie tą samą usługą. Jeżeli umowę z dostawcą zawarł bezpośrednio Najemca, płaci dostawcy i dana pozycja nie wchodzi do rozliczenia Wynajmującego.",
        `Miesięczna zaliczka na opłaty rozliczane za pośrednictwem Wynajmującego wynosi ${money(t.fees)} i jest płatna w terminie i na rachunek wskazane dla czynszu. Za pierwszy niepełny okres stosuje się proporcję dni jako zaliczkę; ostateczne obciążenie wynika z rzeczywistych kosztów. Zaliczka nie jest stałym ryczałtem wyłączającym rozliczenie.`,
        "Koszty ustala się na podstawie dokumentów administratora i dostawców, obowiązujących taryf, wskazań liczników oraz zgodnych z prawem zasad rozliczenia nieruchomości. Wynajmujący przedstawia Najemcy zestawienie i umożliwia wgląd w dokumenty dotyczące naliczonych kwot. Zmianę wysokości zaliczki uzasadnia udokumentowaną zmianą kosztów lub zużycia, z zachowaniem wymaganych przepisami zasad zawiadomienia.",
        "Rozliczenie następuje po otrzymaniu dokumentów od dostawców, co najmniej raz w roku, oraz po zakończeniu najmu. Nadpłatę zwraca się Najemcy, a niedopłatę Najemca uiszcza w ciągu 14 dni od doręczenia prawidłowego rozliczenia. Późniejsze faktury można rozliczyć oddzielnie; nie wydłuża to ustawowego terminu zwrotu kaucji.",
        "Najemca może we własnym imieniu zawrzeć umowy na Internet, telewizję i telefon. Samodzielnie ponosi związane z nimi koszty oraz obowiązki rejestracji i abonamentu RTV, jeżeli wynikają z przepisów. Instalacje ingerujące w Lokal wymagają wcześniejszej zgody Wynajmującego, a zobowiązania Najemcy nie mogą zostać przeniesione na Wynajmującego bez jego zgody.",
        "Najemca wskazuje, jaki dług zaspokaja dokonywana wpłata. Jej zaliczenie następuje według art. 451 Kodeksu cywilnego, w tym z uwzględnieniem należności ubocznych związanych ze wskazanym długiem. Wynajmujący prowadzi czytelne rozliczenie czynszu, zaliczek i odsetek oraz na prośbę Najemcy wyjaśnia sposób zaksięgowania wpłaty.",
        "Ubezpieczenie Lokalu zawarte przez Wynajmującego nie oznacza ubezpieczenia rzeczy ruchomych Najemcy. Najemca może ubezpieczyć swoje mienie odrębnie. Postanowienie to nie wyłącza odpowiedzialności którejkolwiek ze Stron za szkody, za które odpowiada ona na podstawie przepisów.",
      ]),
    },
    {
      title: "§ 6. Opóźnienie w płatnościach",
      text: numbered([
        "Za dzień dokonania przelewu przyjmuje się dzień uznania właściwego rachunku bankowego. Terminy przypadające w sobotę lub dzień ustawowo wolny od pracy oblicza się zgodnie z Kodeksem cywilnym.",
        "Od wymagalnych i niezapłaconych w terminie należności pieniężnych Wynajmujący może naliczać odsetki ustawowe za opóźnienie, według stopy obowiązującej w danym okresie. Naliczanie odsetek nie wymaga stałego wpisywania do umowy stopy procentowej, która może się zmieniać.",
        "Wezwanie do zapłaty wskazuje zaległość, okres rozliczeniowy, sposób obliczenia odsetek i termin zapłaty. Kosztów windykacji nie dolicza się automatycznie według nieuzgodnionego cennika; ich zwrot może być dochodzony jedynie w granicach wynikających z przepisów i rzeczywistej odpowiedzialności Najemcy.",
        "Za samo opóźnienie w zapłacie nie nalicza się kary umownej. Zaległość nie uprawnia do samodzielnego odcięcia mediów, wymiany zamków ani usunięcia Najemcy lub jego rzeczy. Wypowiedzenie z powodu zaległości wymaga zachowania przesłanek i procedury z § 9.",
      ]),
    },
    {
      title: "§ 7. Kaucja",
      text: numbered([
        `Kaucja zabezpieczająca wynosi ${money(t.deposit)} i jest płatna na rachunek ${account}${occasional ? `, najpóźniej do ${fmtDate(t.conditionDeadline)}, jako element warunku zawieszającego` : ", najpóźniej w dniu przekazania Lokalu, przed wydaniem kluczy"}. Wynajmujący potwierdza jej otrzymanie.`,
        `Kaucja zabezpiecza należności z tytułu najmu przysługujące Wynajmującemu w dniu opróżnienia Lokalu${occasional ? " oraz ewentualne koszty egzekucji obowiązku opróżnienia Lokalu w granicach ustawy" : ""}. Jej wysokość nie może przekraczać ${occasional ? "sześciokrotności" : "dwunastokrotności"} miesięcznego czynszu przy zawarciu umowy.`,
        "Z kaucji można rozliczyć należny czynsz, uzgodnione opłaty, odsetki oraz udokumentowane szkody, za które odpowiada Najemca. Rozliczenie wskazuje podstawę i wysokość każdej potrąconej należności oraz dowody jej ustalenia. Normalne zużycie wynikające z prawidłowego korzystania z Lokalu nie jest szkodą.",
        "Kaucja nie jest zapłatą ostatniego czynszu ani opłat za końcowe miesiące. Najemca wykonuje bieżące zobowiązania do końca najmu. Nie uchybia to bezwzględnie obowiązującym przepisom o potrąceniu wymagalnych wierzytelności.",
        "Zwrot kaucji, po dopuszczalnych potrąceniach, następuje w ciągu miesiąca od dnia opróżnienia Lokalu na rachunek wskazany przez Najemcę. Nie uzależnia się upływu tego terminu od otrzymania wszystkich przyszłych rachunków od dostawców. Zwrot uwzględnia ustawową waloryzację: odpowiednią krotność czynszu obowiązującego w dniu zwrotu, nie mniej niż pobrana kwota, przed potrąceniami.",
        "Jeżeli wysokość udokumentowanych należności przewyższa kaucję, Wynajmujący może dochodzić pozostałej kwoty na zasadach ogólnych. Spór co do części rozliczenia nie uzasadnia zatrzymania bezspornej części kaucji po terminie jej zwrotu.",
        "Ustawowe prawo zastawu na wniesionych rzeczach, jeżeli przysługuje Wynajmującemu, może być wykonywane wyłącznie w zakresie i trybie przewidzianym prawem. Nie tworzy ono prawa do dowolnego przejęcia własności rzeczy lub wejścia do Lokalu bez podstawy prawnej.",
      ]),
    },
    {
      title: "§ 8. Prawa i obowiązki Stron",
      text: numbered([
        "Najemca utrzymuje Lokal i udostępnione pomieszczenia we właściwym stanie technicznym i higienicznym, używa urządzeń zgodnie z instrukcjami, wietrzy i ogrzewa pomieszczenia w sposób zapobiegający szkodom oraz dba o części wspólne: klatki schodowe, windy, korytarze, garaż i otoczenie budynku. Przestrzega regulaminu porządku domowego udostępnionego mu przez Wynajmującego.",
        "Najemcę obciążają bieżąca pielęgnacja i konserwacja oraz drobne naprawy związane ze zwykłym używaniem Lokalu: podłóg, posadzek i wykładzin; okien, drzwi i okuć; mebli wbudowanych; kuchni i urządzeń sanitarnych; baterii, syfonów i odpływów do pionu zbiorczego; osprzętu elektrycznego; a także drobne naprawy tynków, malowanie i odświeżenie konieczne w związku z używaniem. Czynności wymagające kwalifikacji wykonuje osoba uprawniona.",
        "W odniesieniu do urządzeń grzewczych i podgrzewaczy wody Najemca wykonuje bieżące czynności użytkowe zgodnie z instrukcją. Nie ingeruje samodzielnie w instalację gazową, elektryczną ani urządzenia podlegające obowiązkowym przeglądom. Wymiana przewodów, pionów instalacyjnych, całych urządzeń zużytych wskutek wieku oraz naprawy konstrukcyjne obciążają Wynajmującego, chyba że szkoda powstała z przyczyn, za które odpowiada Najemca.",
        "Strony przyjmują opisany w tym paragrafie podział obowiązków dla Lokalu poza publicznym zasobem mieszkaniowym, w zakresie dopuszczonym prawem. Samo wymienienie elementu wyposażenia nie oznacza obowiązku zastąpienia starego elementu nowym na koszt Najemcy w każdym przypadku. Przy ustalaniu odpowiedzialności uwzględnia się przyczynę szkody, wiek i dotychczasowe zużycie.",
        "Wynajmujący zapewnia przydatność Lokalu do umówionego użytku oraz sprawność instalacji i urządzeń obciążających go zgodnie z umową i prawem. Organizuje wymagane przeglądy i naprawy, współdziałając z administratorem budynku. Najemca niezwłocznie zawiadamia o awarii, przecieku, zagrożeniu i potrzebie naprawy oraz podejmuje dostępne, bezpieczne działania ograniczające szkodę.",
        "Jeżeli naprawa obciąża Wynajmującego, Najemca umożliwia jej wykonanie po uzgodnieniu terminu. W razie bezczynności Wynajmującego uprawnienia Najemcy, w tym do żądania naprawy, obniżenia czynszu lub zakończenia najmu, określają właściwe przepisy. Umowa nie wyłącza ochrony w razie wad zagrażających zdrowiu.",
        "Podnajem Lokalu lub jego części, oddanie go osobie trzeciej do bezpłatnego używania oraz przeniesienie praw z umowy wymagają uprzedniej pisemnej zgody Wynajmującego, z uwzględnieniem ustawowych wyjątków. Najemca odpowiada za działania osób, którym umożliwił korzystanie z Lokalu, w granicach wynikających z prawa.",
        "Ulepszenia, przebudowa, montaż stałych urządzeń i zmiana przeznaczenia pomieszczeń wymagają uprzedniego pisemnego uzgodnienia zakresu prac. Przed ich rozpoczęciem Strony określają koszty, wymagane zgody, sposób rozliczenia nakładów oraz obowiązek ewentualnego przywrócenia poprzedniego stanu. Zgoda na prace nie oznacza automatycznie zgody na ich finansowanie przez Wynajmującego.",
        "Jeżeli najem obejmuje miejsce w garażu, korzysta się z niego zgodnie z regulaminem i przepisami przeciwpożarowymi. Nie służy ono do przechowywania odpadów ani materiałów niebezpiecznych. Osoba odpowiedzialna za wyciek lub zabrudzenie niezwłocznie usuwa jego skutki w bezpieczny sposób i informuje administratora, gdy jest to konieczne.",
        t.smokingAllowed
          ? "Strony dopuszczają palenie w Lokalu, z obowiązkiem przestrzegania bezpieczeństwa przeciwpożarowego i niepowodowania uciążliwości. Zgoda nie zwalnia z odpowiedzialności za uszkodzenia, nadmierne zabrudzenie lub konieczne usunięcie zapachu wykraczające poza normalne zużycie."
          : "W Lokalu obowiązuje zakaz palenia tytoniu i innych substancji wytwarzających dym. Najemca informuje o zakazie gości. Ewentualne uszkodzenia i konieczne usunięcie następstw naruszenia rozlicza się na podstawie rzeczywiście uzasadnionych kosztów.",
        t.petsAllowed
          ? "Zwierzęta domowe są dozwolone pod warunkiem zapewnienia im właściwej opieki, utrzymania czystości i niepowodowania nadmiernych uciążliwości. Najemca odpowiada za wyrządzone przez nie szkody w granicach prawa."
          : "Utrzymywanie zwierząt domowych w Lokalu wymaga odrębnej pisemnej zgody Wynajmującego, z uwzględnieniem ustawowych uprawnień dotyczących zwierząt asystujących. Zgoda może określać zasady utrzymania czystości i ochrony wyposażenia.",
        "Nie wolno wykorzystywać Lokalu do działalności sprzecznej z prawem, uprawy substancji zakazanych, przechowywania nielegalnej broni lub materiałów niebezpiecznych, usług naruszających mieszkaniowe przeznaczenie ani instalowania urządzeń do wydobywania kryptowalut bez odrębnej zgody Wynajmującego. Naruszenia rozpatruje się z zachowaniem procedury i przesłanek wypowiedzenia; zakaz nie oznacza automatycznej eksmisji.",
        `Okresowy przegląd stanu Lokalu odbywa się co ${t.inspectionMonths} miesięcy, po uprzednim uzgodnieniu konkretnej daty i godziny, w obecności Najemcy albo wskazanego przez niego przedstawiciela. Wynajmujący przedstawia cel przeglądu i ogranicza jego zakres do niezbędnych czynności. Jeżeli uzgodniony termin nie może być dotrzymany, Strony niezwłocznie uzgadniają termin zastępczy.`,
        "Najemca udostępnia Lokal również w celu koniecznego przeglądu technicznego, ustalenia zakresu napraw i wykonania prac obciążających Wynajmującego. Dokumentacja zdjęciowa obejmuje stan techniczny i usterki; nie powinna obejmować dokumentów osobistych ani zbędnych informacji o prywatnym życiu mieszkańców.",
        "Planowaną wymianę zamków Najemca uzgadnia z Wynajmującym. W razie utraty kluczy, włamania lub zagrożenia może podjąć pilne działania zabezpieczające, niezwłocznie informując Wynajmującego. Koszt ponosi Strona odpowiedzialna za przyczynę wymiany. " +
          (t.spareKeys
            ? "Jeżeli pozostaje aktualna zgoda na zapasowy komplet, Najemca przekazuje go Wynajmującemu w ciągu 3 dni od wymiany, za potwierdzeniem."
            : "Nowy zapasowy klucz nie jest przekazywany Wynajmującemu bez odrębnej zgody Najemcy."),
        "W razie awarii powodującej szkodę lub bezpośrednio grożącej jej powstaniem Najemca niezwłocznie udostępnia Lokal w celu usunięcia awarii. Pod nieobecność Najemcy lub przy odmowie udostępnienia wejście następuje w obecności Policji lub straży gminnej (miejskiej), a gdy wymaga to pomocy straży pożarnej, także z jej udziałem, zgodnie z ustawą. Lokal i rzeczy zostają zabezpieczone, a z czynności sporządza się protokół.",
        t.insurance
          ? `Najemca zapewnia przez cały okres najmu ubezpieczenie OC w życiu prywatnym obejmujące odpowiedzialność najemcy za szkody w wynajmowanym Lokalu, z sumą gwarancyjną nie mniejszą niż ${money(t.insuranceSum)}. Przekazuje kopię polisy i potwierdzenie opłacenia składki przed wydaniem Lokalu. Odnowienie następuje bez przerwy w ochronie; dokument odnowienia należy przekazać w ciągu 7 dni od jego zawarcia. Zakres polisy powinien odpowiadać rzeczywistym ryzykom i liczbie mieszkańców.`
          : "Strony nie nakładają obowiązku zawarcia OC najemcy. Brak takiego ubezpieczenia nie zwalnia z odpowiedzialności za wyrządzoną szkodę. Dobrowolne ubezpieczenie i jego zakres Najemca wybiera samodzielnie.",
        "Strony współdziałają przy zgłoszeniu szkody do ubezpieczyciela i ustaleniu jej przyczyn. Najemca informuje Wynajmującego o szkodzie w Lokalu; uzgodnienia nie mogą opóźnić koniecznych działań ratunkowych ani zgłoszenia w terminie wynikającym z polisy. Wypłata odszkodowania nie może prowadzić do dwukrotnego naprawienia tej samej szkody.",
      ]),
    },
    {
      title: "§ 9. Rozwiązanie umowy i zwrot przedmiotu najmu",
      text: numbered([
        "Umowa wygasa z upływem czasu oznaczonego w § 3. Przed tym terminem może zostać rozwiązana za porozumieniem Stron lub wypowiedziana na podstawie ustawy albo wyraźnie przewidzianego w umowie przypadku, w granicach prawa. Oświadczenie o wypowiedzeniu wskazuje konkretną podstawę, przyczynę i termin zakończenia.",
        "Wynajmujący może wypowiedzieć najem nie później niż na miesiąc naprzód, na koniec miesiąca kalendarzowego, jeżeli Najemca mimo pisemnego upomnienia nadal używa Lokalu sprzecznie z umową lub przeznaczeniem, zaniedbuje obowiązki, dopuszczając do szkód, niszczy urządzenia wspólne albo rażąco lub uporczywie narusza porządek domowy i utrudnia korzystanie z innych lokali. Ta sama procedura ustawowa dotyczy podnajmu lub oddania Lokalu do bezpłatnego używania bez wymaganej zgody.",
        "Przy zaległości obejmującej co najmniej trzy pełne okresy płatności Wynajmujący najpierw uprzedza Najemcę na piśmie o zamiarze wypowiedzenia i wyznacza dodatkowy miesięczny termin do zapłaty zaległych i bieżących należności. Dopiero po bezskutecznym upływie tego terminu może dokonać wypowiedzenia z zachowaniem ustawowego terminu co najmniej miesiąca, ze skutkiem na koniec miesiąca kalendarzowego. Dotyczy to należności, które mogą stanowić ustawową podstawę wypowiedzenia.",
        "Najemca zachowuje ustawowe uprawnienia do wypowiedzenia, w szczególności w przypadkach wad uniemożliwiających umówione używanie oraz wad zagrażających zdrowiu. Zamiar sprzedaży Lokalu lub samo zgłoszenie takiego zamiaru przez Wynajmującego nie tworzy w tej umowie dodatkowej, samodzielnej podstawy wcześniejszego wypowiedzenia.",
        "Strony mogą uzgodnić wcześniejsze zakończenie najmu w związku ze wskazaniem przez Najemcę nowego kandydata. Wynajmujący rozpatruje kandydaturę, a przyjęcie nowej osoby i zwolnienie dotychczasowego Najemcy wymagają odrębnego porozumienia. Nie nalicza się automatycznej kary równej sumie przyszłych czynszów do końca umowy; ewentualne roszczenia ocenia się na zasadach ogólnych.",
        "W ostatnich dwóch miesiącach najmu Najemca umożliwia prezentację Lokalu potencjalnym kolejnym najemcom po każdorazowym uzgodnieniu terminu. Prezentacje odbywają się w rozsądnej częstotliwości, z poszanowaniem prywatności mieszkańców. Nie stanowi to zgody na wejście pod nieobecność Najemcy bez uzgodnienia.",
        `Najemca opróżnia i wydaje Lokal najpóźniej ${end}, wraz z osobami z nim zamieszkującymi, przekazując wszystkie otrzymane i dorobione klucze, piloty oraz karty. Jeżeli umowa kończy się wcześniej, Strony uzgadniają termin protokolarnego zwrotu nie później niż na dzień ustania najmu.`,
        "Lokal powinien być oddany uprzątnięty, z kompletnym wyposażeniem, w stanie wynikającym z prawidłowego używania, z uwzględnieniem normalnego zużycia. Najemca usuwa własne rzeczy, myje urządzenia sanitarne i kuchenne, podłogi, okna oraz inne zabrudzone powierzchnie i wykonuje obciążające go naprawy. Malowanie, wymiana tapet lub wyposażenia obciążają go w zakresie koniecznym do naprawienia szkód, za które odpowiada, a nie automatycznie po każdym najmie.",
        "Stan zwracanego Lokalu porównuje się z protokołem początkowym i dokumentacją. Protokół końcowy obejmuje odczyty liczników, wyposażenie, klucze, usterki i zastrzeżenia obu Stron. Gdy Strona nie stawi się mimo uzgodnienia terminu lub odmówi podpisu, druga może sporządzić opis i zdjęcia oraz przekazać je nieobecnej Stronie; jednostronny opis nie przesądza automatycznie o odpowiedzialności ani nie pozbawia prawa zakwestionowania rozliczenia.",
        "Uzasadnione naprawy szkód i sprzątanie niewykonane przez Najemcę mogą zostać rozliczone według udokumentowanych, rozsądnych kosztów, z uwzględnieniem wieku wyposażenia. Nie stosuje się automatycznej opłaty za sprzątanie niezależnej od stanu Lokalu. O rzeczach pozostawionych w Lokalu Wynajmujący zawiadamia Najemcę i wzywa do odbioru; nie przyjmuje się, że zostały porzucone ani że można je dowolnie usunąć.",
        "Zajmowanie Lokalu bez tytułu prawnego po zakończeniu najmu może skutkować obowiązkiem zapłaty odszkodowania odpowiadającego czynszowi możliwemu do uzyskania i odszkodowania uzupełniającego w granicach ustawy. Rozlicza się również rzeczywiste, prawnie należne koszty korzystania, bez podwójnego naliczania tych samych kwot. Samo powstanie roszczenia nie uprawnia do samowolnego opróżnienia Lokalu.",
        ...(occasional
          ? [
              "Przy braku dobrowolnego zwrotu Wynajmujący doręcza pisemne żądanie opróżnienia Lokalu z urzędowo poświadczonym podpisem, wskazujące Strony, tę umowę, przyczynę ustania najmu i termin co najmniej 7 dni od doręczenia. Po bezskutecznym upływie terminu może wystąpić do sądu o klauzulę wykonalności aktowi notarialnemu, załączając wymagane ustawą dokumenty, w tym potwierdzenie zgłoszenia najmu do urzędu skarbowego. Egzekucję prowadzi uprawniony komornik, nie Wynajmujący samodzielnie.",
            ]
          : [
              "Przy braku dobrowolnego zwrotu Wynajmujący dochodzi opróżnienia Lokalu we właściwym postępowaniu sądowym i egzekucyjnym, z uwzględnieniem ochrony przysługującej lokatorowi. Niniejsza umowa nie jest sama w sobie tytułem wykonawczym.",
            ]),
      ]),
    },
    {
      title: "§ 10. Dane kontaktowe i doręczenia",
      text: numbered([
        `Adres Wynajmującego do doręczeń: ${o.address}. E-mail do bieżącego kontaktu: ${o.email}; telefon: ${o.phone || "nie podano"}.`,
        `Adres Najemcy do doręczeń: ${n.address}. E-mail do bieżącego kontaktu: ${n.email}; telefon: ${n.phone || "nie podano"}.`,
        "Bieżące ustalenia organizacyjne, terminy przeglądów, zgłoszenia usterek i rozliczenia mogą być przekazywane e-mailem. Wypowiedzenia, wezwania i zmiany wymagające szczególnej formy doręcza się w tej formie, osobiście za potwierdzeniem albo pocztą, ewentualnie jako dokument elektroniczny opatrzony kwalifikowanym podpisem, gdy spełnia to wymagania prawa.",
        "Strona powiadamia drugą Stronę o zmianie adresu do doręczeń i danych kontaktowych w sposób umożliwiający zachowanie informacji. Skuteczność oświadczeń ocenia się według przepisów o dojściu oświadczenia do adresata; umowa nie wprowadza automatycznej fikcji doręczenia każdej nieodebranej przesyłki.",
        "Przekazanie obsługi najmu zarządcy wymaga poinformowania Najemcy o jego tożsamości, zakresie upoważnienia i kanale kontaktu. Przetwarzanie danych odbywa się na właściwej podstawie prawnej i w niezbędnym zakresie; sam ten zapis nie zastępuje obowiązku informacyjnego ani nie stanowi blankietowej zgody na dowolne udostępnianie danych.",
      ]),
    },
    {
      title: "§ 11. Postanowienia końcowe i załączniki",
      text: numbered([
        `Zmiany i uzupełnienia umowy oraz porozumienie o jej zakończeniu wymagają ${form}${occasional ? ", pod rygorem nieważności" : ""}. Dla wypowiedzenia i innych jednostronnych oświadczeń zachowuje się dodatkowo wymagania właściwych przepisów.`,
        `Wybrany docelowy sposób podpisania: ${t.signature === "qes" ? "kwalifikowany podpis elektroniczny (QES)" : "zwykły podpis elektroniczny (SES), służący zachowaniu formy dokumentowej"}. ${occasional ? "Umowa najmu okazjonalnego i jej zmiany wymagają formy pisemnej pod rygorem nieważności. Kwalifikowany podpis elektroniczny może zachować formę równoważną pisemnej, lecz nie zastępuje aktu notarialnego Najemcy." : "Przy najmie dłuższym niż rok niezachowanie formy pisemnej skutkuje uznaniem najmu za zawarty na czas nieoznaczony. Zwykłe kliknięcie lub SES nie są równoważne kwalifikowanemu podpisowi elektronicznemu."}`,
        "Nieskuteczność jednego postanowienia nie uchyla pozostałych w zakresie dopuszczonym prawem. Strony ustalą zgodne z prawem rozwiązanie odpowiadające celowi uzgodnienia; nie zastępują nieważnego postanowienia jednostronną decyzją którejkolwiek Strony. Bezwzględnie obowiązujące przepisy mają pierwszeństwo przed treścią umowy.",
        "W sprawach nieuregulowanych stosuje się Kodeks cywilny oraz odpowiednie przepisy ustawy o ochronie praw lokatorów i inne właściwe przepisy polskiego prawa. Strony w pierwszej kolejności podejmują próbę wyjaśnienia sporu i polubownego porozumienia. W razie braku porozumienia sprawę rozpoznaje sąd właściwy według przepisów.",
        `Załączniki wspólne: nr 1 — protokół zdawczo-odbiorczy z wykazem wyposażenia, odczytami liczników i uzgodnioną dokumentacją zdjęciową; nr 2 — świadectwo charakterystyki energetycznej lub jego kopia w wymaganej formie${t.insurance ? "; nr 3 — kopia polisy OC najemcy i potwierdzenie opłacenia składki" : "; nr 3 — polisa OC, jeżeli zostanie przekazana dobrowolnie"}. Załączniki sporządza się i doręcza osobno; lista w aplikacji nie potwierdza ich rzeczywistego dołączenia.`,
        ...(occasional
          ? [
              "Dodatkowe załączniki najmu okazjonalnego: nr 4 — oświadczenie Najemcy w formie aktu notarialnego o poddaniu się egzekucji i zobowiązaniu do opróżnienia i wydania Lokalu w ustawowym trybie; nr 5 — wskazanie innego lokalu, w którym Najemca będzie mógł zamieszkać wraz z mieszkańcami w razie wykonania obowiązku opróżnienia; nr 6 — zgoda właściciela lub innej osoby posiadającej tytuł prawny do wskazanego lokalu.",
              `Wskazany inny lokal: ${t.alternativeAddress}. Osoba posiadająca tytuł prawny i wyrażająca zgodę: ${t.alternativeOwner}. Zgoda musi obejmować Najemcę oraz osoby z nim zamieszkujące. ${t.notarialConsent ? "Wynajmujący żąda notarialnego poświadczenia podpisu pod zgodą." : "Wynajmujący na etapie zawarcia tej umowy nie żąda notarialnego poświadczenia podpisu pod zgodą; zachowuje ustawowe uprawnienie do jego żądania."} Wpisanie danych do formularza nie zastępuje uzyskania zgody.`,
              "W razie utraty możliwości zamieszkania we wskazanym innym lokalu Najemca w ciągu 21 dni od powzięcia wiadomości o tym wskazuje nowy lokal i przedstawia wymaganą zgodę. W razie niedopełnienia tego obowiązku Wynajmujący może wypowiedzieć umowę na piśmie z zachowaniem co najmniej siedmiodniowego okresu wypowiedzenia. Koszt sporządzenia oświadczenia Najemcy o poddaniu się egzekucji ponosi Najemca w granicach obowiązujących przepisów.",
              "Wynajmujący zgłasza zawarcie umowy naczelnikowi urzędu skarbowego właściwemu ze względu na swoje miejsce zamieszkania w ciągu 14 dni od rozpoczęcia najmu i na żądanie Najemcy okazuje potwierdzenie. Brak zgłoszenia wpływa na możliwość skorzystania ze szczególnego reżimu najmu okazjonalnego. Zaznaczenie pola w aplikacji nie dokonuje zgłoszenia do urzędu.",
            ]
          : []),
        `Dodatkowe indywidualne uzgodnienia Stron: ${t.notes || "brak"}. W razie dopisania uzgodnień Strony sprawdzają ich zgodność z pozostałymi postanowieniami i obowiązującymi przepisami.`,
        "Przed rzeczywistym zawarciem Strony weryfikują wszystkie dane, dokumenty i oświadczenia. Każda otrzymuje pełną treść umowy z załącznikami: w wariancie papierowym sporządza się dwa jednobrzmiące egzemplarze, a w wariancie elektronicznym każda otrzymuje ten sam podpisany dokument i możliwość jego zachowania.",
      ]),
    },
    {
      title: "Podpisy Stron",
      text: `Wynajmujący: ${o.name}\nNajemca: ${n.name}\nDEMO — ten PDF nie zawiera podpisów kryptograficznych, również po zakończeniu symulacji w aplikacji. Treść wzoru: ${TEMPLATE_VERSION}.`,
    },
  ];
}
