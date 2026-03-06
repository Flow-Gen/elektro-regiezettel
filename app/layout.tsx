import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Elektro Regiezettel Generator – Regie­arbeiten korrekt abrechnen | flow-gen.ai',
  description: 'Regiezettel für Elektriker in 60 Sekunden erstellen. Fahrtzeit, Stundenlohn, Material-Aufschlag und MwSt automatisch berechnet. Druckfertig als PDF – 7 €.',
  keywords: 'Elektro Regiezettel, Regiearbeiten abrechnen, Elektriker Stundenzettel, Regie Rechner, Elektro Auftragszettel',
  openGraph: {
    title: 'Elektro Regiezettel Generator',
    description: 'Regiearbeiten in 60 Sekunden korrekt abrechnen. Direkt als PDF.',
    url: 'https://flow-gen.ai/handwerk/elektro-regiezettel',
    siteName: 'flow-gen.ai',
    locale: 'de_DE',
    type: 'website',
  },
  alternates: {
    canonical: 'https://flow-gen.ai/handwerk/elektro-regiezettel',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&family=Barlow:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Elektro Regiezettel Generator",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "description": "Regiezettel für Elektriker automatisch berechnen und als PDF exportieren",
              "offers": {
                "@type": "Offer",
                "price": "7.00",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock"
              },
              "provider": {
                "@type": "Organization",
                "name": "flow-gen.ai",
                "url": "https://flow-gen.ai"
              }
            })
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#F5F0E8' }}>
        {children}
      </body>
    </html>
  )
}
