# ⚡ Elektro-Regiezettel Generator
**flow-gen.ai/handwerk/elektro-regiezettel**

Vollständiges Next.js 14 Micro-Tool — Regiezettel für Elektriker kalkulieren & als PDF exportieren.

---

## 🚀 In 10 Minuten live auf Vercel

### Schritt 1 — Stripe-Produkt anlegen (2 Min.)

Gehe zu https://dashboard.stripe.com/products/create

```
Name:        Elektro Regiezettel PDF
Preis:       7,00 EUR
Preismodell: Einmalig
```

→ Kopiere die **Price ID** (beginnt mit `price_...`)

### Schritt 2 — Stripe Webhook einrichten (2 Min.)

https://dashboard.stripe.com/webhooks/create

```
Endpoint URL:  https://DEINE-URL.vercel.app/api/webhook
Events:        checkout.session.completed
               charge.refunded
```

→ Kopiere den **Webhook Secret** (beginnt mit `whsec_...`)

### Schritt 3 — Auf Vercel deployen (3 Min.)

```bash
# Projekt auf GitHub pushen
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/DEIN-USER/elektro-regiezettel
git push -u origin main

# Dann auf vercel.com: "Add New Project" → GitHub-Repo wählen
```

### Schritt 4 — Environment Variables in Vercel (2 Min.)

Im Vercel Dashboard unter Settings → Environment Variables:

```
STRIPE_SECRET_KEY              sk_live_XXXX
STRIPE_WEBHOOK_SECRET          whsec_XXXX
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  pk_live_XXXX
NEXT_PUBLIC_STRIPE_PRICE_ID    price_XXXX
NEXT_PUBLIC_BASE_URL           https://flow-gen.ai
```

### Schritt 5 — Custom Domain (1 Min.)

Vercel Dashboard → Settings → Domains:
```
flow-gen.ai/handwerk/elektro-regiezettel
```

→ **Done. Tool ist live.**

---

## 📁 Projektstruktur

```
app/
├── layout.tsx              # SEO-Metadaten, Schema.org, Fonts
├── page.tsx                # Das Tool + Kalkulator + Paywall
├── success/
│   └── page.tsx            # Danke-Seite nach Zahlung
└── api/
    ├── create-checkout/
    │   └── route.ts        # Stripe Checkout Session erstellen
    └── webhook/
        └── route.ts        # Stripe Webhook (Zahlung bestätigt)
```

---

## 💳 Payment Flow

```
User füllt Formular aus
        ↓
"Kostenlose Vorschau" → Brutto angezeigt → 2s → Paywall erscheint
        ↓
"Jetzt kaufen" → POST /api/create-checkout → Stripe Checkout
        ↓
Zahlung erfolgreich → /success?session_id=...
        ↓
Stripe sendet Webhook → /api/webhook → checkout.session.completed
        ↓
User klickt "Zurück" → PDF-Button ist freigeschaltet → jsPDF generiert lokal
```

---

## 🔧 Lokale Entwicklung

```bash
npm install
cp .env.local.example .env.local
# Stripe Test-Keys eintragen (sk_test_... / pk_test_...)
npm run dev
# → http://localhost:3000
```

Für lokale Webhook-Tests:
```bash
npm install -g stripe
stripe listen --forward-to localhost:3000/api/webhook
```

---

## 📊 Flywheel-Metriken

- **Ziel-MRR Monat 1:** 50–150 € (7–21 Verkäufe)
- **API-Kosten:** ~0 € (PDF wird client-seitig generiert, keine KI nötig)
- **Flywheel-Ratio:** Theoretisch ∞ (keine laufenden API-Kosten)
- **Break-Even:** 1 Verkauf = ROI positiv

---

## 🗺️ pSEO-Erweiterung (nächster Schritt)

URL-Struktur für 200 weitere Pages:
```
/handwerk/elektro-regiezettel/berlin
/handwerk/elektro-regiezettel/münchen
/handwerk/elektro-regiezettel/hamburg
/handwerk/elektro-regiezettel/kleinbetrieb
/handwerk/elektro-regiezettel/excel-alternative
/handwerk/elektro-regiezettel/kostenlos
```
→ Jede Page lädt dasselbe Tool, andere Meta-Title/Description

---

Gebaut mit: Next.js 14 · Stripe · jsPDF · flow-gen.ai
