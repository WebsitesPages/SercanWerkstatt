export const COMPANY = {
  name: 'Renginal',
  fullName: 'Inal Unfallinstandsetzung + Fahrzeuglackierung',
  address: 'Tagetesstraße 7',
  zip: '80935',
  city: 'München',
  fullAddress: 'Tagetesstraße 7, 80935 München',
  phone: '+498935657285',
  phoneDisplay: '089 356 572 85',
  email: 'rengin-al@gmx.de',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Tagetesstra%C3%9Fe+7%2C+80935+M%C3%BCnchen',
} as const

export const SERVICES = [
  {
    title: 'Unfallinstandsetzung',
    description:
      'Professionelle Schadensbeseitigung nach Unfall. Präzise Karosseriearbeit für ein Ergebnis wie ab Werk.',
  },
  {
    title: 'Fahrzeuglackierung',
    description:
      'Hochwertige Lackierungen in Original-Qualität. Perfekter Farbton, perfektes Finish.',
  },
  {
    title: 'Felgenservice',
    description:
      'Reparatur und Aufbereitung Ihrer Felgen — von Bordsteinschäden bis zur Komplettlackierung.',
  },
  {
    title: 'Gutachten',
    description:
      'Professionelle Fahrzeugbegutachtung und Schadensanalyse für Ihre Versicherungsabwicklung.',
  },
  {
    title: 'Achsvermessung',
    description:
      'Präzise Achsvermessung mit modernster Technik für optimales Fahrverhalten und gleichmäßigen Reifenverschleiß.',
  },
  {
    title: 'Wartung & Reparatur',
    description:
      'Zuverlässige Wartung und Reparatur aller Marken. Damit Ihr Fahrzeug in bestem Zustand bleibt.',
  },
] as const

export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Kontakt',
    description:
      'Rufen Sie an oder kommen Sie vorbei — wir beraten Sie direkt und unkompliziert.',
  },
  {
    number: '02',
    title: 'Begutachtung',
    description:
      'Wir begutachten Ihr Fahrzeug und erstellen einen detaillierten Reparaturplan.',
  },
  {
    number: '03',
    title: 'Reparatur',
    description:
      'Fachgerechte Ausführung mit Liebe zum Detail und höchstem Qualitätsanspruch.',
  },
  {
    number: '04',
    title: 'Übergabe',
    description:
      'Ihr Fahrzeug — wie neu. Qualitätsgeprüft und bereit für die Straße.',
  },
] as const

export const WHY_REASONS = [
  {
    title: 'Saubere Arbeit',
    description:
      'Jedes Fahrzeug verlässt unsere Werkstatt in einwandfreiem Zustand.',
  },
  {
    title: 'Klare Kommunikation',
    description:
      'Sie wissen jederzeit, was gemacht wird und was es kostet.',
  },
  {
    title: 'Präzise Umsetzung',
    description:
      'Arbeiten nach Herstellerstandards mit professionellem Anspruch.',
  },
  {
    title: 'Persönlicher Kontakt',
    description:
      'Direkte Ansprechpartner statt anonymer Servicehotline.',
  },
] as const

/* Gallery placeholders – jeder Eintrag beschreibt das Bild das dort eingefügt werden soll */
export const GALLERY_ITEMS = [
  {
    label: 'Lackierung — Vorher / Nachher',
    gradient: 'from-red-950/40 via-carbon-900 to-carbon-950',
  },
  {
    label: 'Karosseriearbeit im Detail',
    gradient: 'from-carbon-800 via-amber-950/20 to-carbon-950',
  },
  {
    label: 'Felgenaufbereitung',
    gradient: 'from-carbon-900 via-orange-950/20 to-carbon-800',
  },
  {
    label: 'Werkstatt-Impression',
    gradient: 'from-carbon-800 via-carbon-900 to-carbon-950',
  },
  {
    label: 'Detailarbeit Lack',
    gradient: 'from-red-950/30 via-carbon-800 to-carbon-900',
  },
  {
    label: 'Fahrzeugübergabe',
    gradient: 'from-carbon-700/50 via-carbon-900 to-carbon-950',
  },
] as const
