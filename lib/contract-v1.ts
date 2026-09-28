import { type Contract, fmtDate, money } from "./model";
export const TEMPLATE_VERSION = "2026-09-28.v1-demo";
export function contractSections(
  c: Contract,
): { title: string; text: string }[] {
  const { property: p, owner: o, tenant: n, terms: t } = c;
  const occasional = t.kind === "occasional";
  return [
    {
      title: occasional
        ? "Umowa najmu okazjonalnego lokalu mieszkalnego pod warunkiem zawieszającym"
        : "Umowa najmu lokalu mieszkalnego",
      text: `Numer ${c.number}. Zawarta dnia ${fmtDate(t.signedDate)}. WERSJA DEMONSTRACYJNA — projekt do weryfikacji przed użyciem. Symulacja obiegu nie stanowi podpisu elektronicznego.`,
    },
    {
      title: "Strony umowy",
      text: `Wynajmujący: ${o.name}, adres: ${o.address}, identyfikacja: ${o.identity || "do uzupełnienia przed zawarciem"}, e-mail: ${o.email}, telefon: ${o.phone || "nie podano"}.\nNajemca: ${n.name}, adres: ${n.address}, identyfikacja: ${n.identity || "do uzupełnienia przed zawarciem"}, e-mail: ${n.email}, telefon: ${n.phone || "nie podano"}.`,
    },
    {
      title: "§ 1. Przedmiot i cel najmu",
      text: `Wynajmujący oświadcza, że przysługuje mu tytuł prawny (${p.title}) do lokalu pod adresem ${p.address}, ${p.postalCode} ${p.city}, o powierzchni ${p.area} m², liczba pokoi: ${p.rooms}, i jest uprawniony do oddania go w najem. Lokal jest przeznaczony wyłącznie na cele mieszkaniowe. Osoby zamieszkujące: ${t.occupants}.\nWyposażenie: ${p.equipment || "zgodnie z protokołem zdawczo-odbiorczym"}. Szczegółowy stan, ewentualne wady, liczniki i liczba kluczy zostaną opisane w protokole. Oświadczenia te wymagają potwierdzenia przez strony przed podpisaniem.`,
    },
    {
      title: "§ 2. Okres najmu i przekazanie lokalu",
      text: `Umowa zostaje zawarta na czas oznaczony od ${fmtDate(t.start)} do ${fmtDate(t.end)}. Przekazanie lokalu zaplanowano na ${fmtDate(t.handover)}, na podstawie protokołu podpisanego przez strony, po wpłacie kaucji.${occasional ? " Wydanie lokalu nastąpi po spełnieniu warunku opisanego w § 8." : ""}`,
    },
    {
      title: "§ 3. Czynsz i płatności",
      text: `Miesięczny czynsz wynosi ${money(t.rent)}, płatny z góry do ${t.paymentDay}. dnia miesiąca na rachunek Wynajmującego: ${o.bankAccount || "do uzupełnienia przed podpisaniem"}. Za niepełny miesiąc czynsz jest proporcjonalny do liczby dni najmu w tym miesiącu. Za dzień zapłaty przyjmuje się dzień uznania rachunku. W razie opóźnienia należą się odsetki ustawowe za opóźnienie.`,
    },
    {
      title: "§ 4. Opłaty eksploatacyjne",
      text: `Poza czynszem Najemca ponosi uzgodnione koszty mediów i opłaty eksploatacyjne związane z korzystaniem z lokalu. Miesięczna zaliczka wynosi ${money(t.fees)} i jest płatna razem z czynszem. Rozliczenie następuje na podstawie dokumentów administratora, dostawców i wskazań liczników, co najmniej raz w roku i po zakończeniu najmu. Wynajmujący udostępnia dokumenty rozliczenia. Nadpłaty są zwracane, a niedopłaty uzupełniane w ciągu 14 dni od otrzymania rozliczenia. Podatek od nieruchomości obciąża Wynajmującego.`,
    },
    {
      title: "§ 5. Kaucja",
      text: `Kaucja wynosi ${money(t.deposit)} i jest płatna przed przekazaniem lokalu. Zabezpiecza należności z tytułu najmu w granicach prawa. Nie zastępuje ostatniego czynszu. Podlega zwrotowi w ciągu miesiąca od opróżnienia lokalu, po potrąceniu należności Wynajmującego, z uwzględnieniem obowiązujących zasad waloryzacji. Potrącenia wymagają rozliczenia. Normalne zużycie wynikające z prawidłowego używania nie jest szkodą.`,
    },
    {
      title: "§ 6. Prawa i obowiązki stron",
      text: `Wynajmujący wydaje lokal w stanie przydatnym do umówionego użytku i wykonuje naprawy obciążające go zgodnie z prawem. Najemca dba o lokal, ponosi drobne nakłady związane ze zwykłym używaniem, przestrzega porządku domowego i niezwłocznie zgłasza awarie. Podnajem, oddanie do bezpłatnego używania oraz istotne zmiany w lokalu wymagają uprzedniej zgody Wynajmującego. Przeglądy odbywają się po uzgodnieniu terminu z Najemcą; dostęp w razie awarii następuje na zasadach ustawy o ochronie praw lokatorów.\n${t.insurance ? "Najemca zobowiązuje się posiadać ubezpieczenie OC najemcy w okresie najmu i przekazać Wynajmującemu potwierdzenie zawarcia polisy." : "Strony nie uzależniają umowy od ubezpieczenia OC najemcy."} Przekazanie świadectwa charakterystyki energetycznej zostanie odnotowane osobno; wygenerowanie umowy nie potwierdza jego otrzymania.`,
    },
    {
      title: "§ 7. Zakończenie najmu",
      text: `Umowa kończy się z upływem oznaczonego terminu. Może zostać zakończona wcześniej za porozumieniem stron lub w przypadkach przewidzianych przez obowiązujące przepisy, z zachowaniem wymaganych terminów, upomnień i formy. Postanowienie to nie przyznaje Wynajmującemu ogólnego prawa wypowiedzenia umowy na czas oznaczony. Lokal wraz z kluczami zostanie zwrócony na podstawie protokołu, z uwzględnieniem normalnego zużycia. Przedłużenie wymaga osobnego uzgodnienia; propozycja w systemie nie przedłuża umowy automatycznie.`,
    },
    ...(occasional
      ? [
          {
            title: "§ 8. Najem okazjonalny i warunek zawieszający",
            text: `Wynajmujący oświadcza, że jest osobą fizyczną nieprowadzącą działalności gospodarczej w zakresie wynajmowania lokali. Skuteczność umowy strony uzależniają od dostarczenia przez Najemcę, do ${fmtDate(t.conditionDeadline)}, oświadczenia w formie aktu notarialnego o poddaniu się egzekucji i zobowiązaniu do opróżnienia i wydania lokalu, wskazania innego lokalu oraz zgody właściciela lub osoby posiadającej tytuł prawny do tego lokalu. Niespełnienie warunku w terminie oznacza, że umowa nie wywołuje skutków przewidzianych dla najmu; strony rozliczą otrzymane wpłaty.\nWskazany inny lokal: ${t.alternativeAddress}. Osoba wyrażająca zgodę: ${t.alternativeOwner}. Na żądanie Wynajmującego podpis pod zgodą musi być notarialnie poświadczony. W razie utraty możliwości zamieszkania w tym lokalu Najemca wskazuje inny lokal i dostarcza zgodę w terminie 21 dni od uzyskania wiadomości. Wynajmujący zgłasza zawarcie umowy naczelnikowi właściwego urzędu skarbowego w ciągu 14 dni od rozpoczęcia najmu.\nUmowa i jej zmiany wymagają formy pisemnej pod rygorem nieważności. Elektroniczne zachowanie tej formy wymaga kwalifikowanych podpisów stron. Podpis kwalifikowany nie zastępuje aktu notarialnego.`,
          },
        ]
      : []),
    {
      title: occasional
        ? "§ 9. Postanowienia końcowe"
        : "§ 8. Postanowienia końcowe",
      text: `W sprawach nieuregulowanych stosuje się Kodeks cywilny oraz właściwe przepisy ustawy o ochronie praw lokatorów. Postanowienia umowy nie ograniczają bezwzględnie obowiązujących praw stron. Zmiany wymagają zachowania formy wymaganej przez prawo. Wybrany sposób podpisania: ${t.signature === "qes" ? "kwalifikowany podpis elektroniczny (QES)" : "zwykły podpis elektroniczny — forma dokumentowa"}. Przed zawarciem strony weryfikują treść i kompletność danych.\nDodatkowe uzgodnienia: ${t.notes || "brak"}.\nZałączniki: protokół zdawczo-odbiorczy, świadectwo charakterystyki energetycznej${t.insurance ? ", potwierdzenie polisy OC" : ""}${occasional ? ", akt notarialny Najemcy, wskazanie innego lokalu, zgoda osoby z tytułem prawnym do innego lokalu" : ""}. Załączniki są przygotowywane i przekazywane osobno; checklista nie stanowi dowodu ich doręczenia.`,
    },
    {
      title: "Podpisy stron",
      text: `Wynajmujący: ${o.name}\nNajemca: ${n.name}\nTen plik jest projektem demonstracyjnym bez podpisów kryptograficznych, także po zakończeniu symulacji. Wersja szablonu: ${TEMPLATE_VERSION}.`,
    },
  ];
}
