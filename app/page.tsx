'use client'

import { useState, useCallback, useEffect } from 'react'

interface Position {
  id: string
  beschreibung: string
  menge: number
  einheit: string
  einzelpreis: number
}

interface FormData {
  firmaName: string
  firmaStrasse: string
  firmaPlzOrt: string
  firmaTel: string
  kundeName: string
  kundeStrasse: string
  kundePlzOrt: string
  auftragNr: string
  datum: string
  fahrtzeit: number
  fahrtkmEinfach: number
  arbeitsstunden: number
  stundenlohn: number
  kmPauschale: number
  materialAufschlag: number
  mwst: number
  positionen: Position[]
}

function calcErgebnis(d: FormData) {
  const fahrtkostenNetto = d.fahrtkmEinfach * 2 * d.kmPauschale
  const fahrtzeit_h      = d.fahrtzeit / 60
  const arbeitslohn      = (d.arbeitsstunden + fahrtzeit_h) * d.stundenlohn
  const materialNetto    = d.positionen.reduce((s, p) => s + p.menge * p.einzelpreis, 0)
  const materialMitAuf   = materialNetto * (1 + d.materialAufschlag / 100)
  const netto            = arbeitslohn + fahrtkostenNetto + materialMitAuf
  const mwstBetrag       = netto * (d.mwst / 100)
  const brutto           = netto + mwstBetrag
  return {
    fahrtkostenNetto: round2(fahrtkostenNetto),
    arbeitslohn:      round2(arbeitslohn),
    materialNetto:    round2(materialNetto),
    materialMitAuf:   round2(materialMitAuf),
    netto:            round2(netto),
    mwstBetrag:       round2(mwstBetrag),
    brutto:           round2(brutto),
  }
}

function round2(n: number) { return Math.round(n * 100) / 100 }
function fmtEur(n: number) {
  return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}
function todayStr() {
  return new Date().toLocaleDateString('de-DE', { day:'2-digit', month:'2-digit', year:'numeric' })
}

const INITIAL: FormData = {
  firmaName: '', firmaStrasse: '', firmaPlzOrt: '', firmaTel: '',
  kundeName: '', kundeStrasse: '', kundePlzOrt: '',
  auftragNr: `RG-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`,
  datum: new Date().toISOString().split('T')[0],
  fahrtzeit: 30, fahrtkmEinfach: 15, arbeitsstunden: 4,
  stundenlohn: 95, kmPauschale: 0.40, materialAufschlag: 15, mwst: 19,
  positionen: [
    { id: '1', beschreibung: 'NYM-J 3x1,5mm² Mantelleitung', menge: 20, einheit: 'm', einzelpreis: 1.20 },
    { id: '2', beschreibung: 'Unterputz-Steckdose mit Rahmen', menge: 3, einheit: 'Stk', einzelpreis: 8.50 },
  ]
}

const S = {
  page: { minHeight: '100vh', background: '#F5F0E8', fontFamily: "'Barlow', sans-serif", color: '#1A1A1A', paddingBottom: '6rem' } as React.CSSProperties,
  topbar: { background: '#1A1A1A', padding: '0.6rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as React.CSSProperties,
  topbarLogo: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#F5C518', letterSpacing: '0.15em', textTransform: 'uppercase' as const },
  topbarSub: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.7rem', color: '#666', letterSpacing: '0.12em', textTransform: 'uppercase' as const },
  hero: { background: '#1A1A1A', padding: '3.5rem 2rem 3rem', borderBottom: '4px solid #F5C518', position: 'relative' as const, overflow: 'hidden' },
  heroInner: { maxWidth: 900, margin: '0 auto', position: 'relative' as const, zIndex: 1 },
  heroEyebrow: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: '#F5C518', marginBottom: '0.75rem' },
  heroTitle: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 0.95, color: '#FFFFFF', letterSpacing: '-0.01em', marginBottom: '1rem' },
  heroSub: { fontSize: '1rem', fontWeight: 300, color: '#999', maxWidth: 540, lineHeight: 1.6, marginBottom: '1.5rem' },
  heroBadges: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const },
  badge: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '0.3rem 0.7rem', border: '1px solid #333', color: '#999' },
  main: { maxWidth: 900, margin: '0 auto', padding: '2.5rem 1.5rem' },
  section: { marginBottom: '2rem' },
  sectionHead: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: '#999', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #D8D0C4', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  sectionLine: { flex: 1, height: 1, background: '#D8D0C4' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' } as React.CSSProperties,
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' } as React.CSSProperties,
  grid4: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' } as React.CSSProperties,
  fieldWrap: { display: 'flex', flexDirection: 'column' as const, gap: '0.3rem' },
  label: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#888' },
  input: { background: '#FFFFFF', border: '1px solid #D8D0C4', padding: '0.6rem 0.75rem', fontSize: '0.9rem', fontFamily: "'Barlow', sans-serif", color: '#1A1A1A', outline: 'none', width: '100%', boxSizing: 'border-box' as const, transition: 'border-color 0.15s' },
  tableWrap: { border: '1px solid #D8D0C4', background: '#FFFFFF', overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: '1fr 80px 80px 90px 36px', gap: 0, background: '#1A1A1A', padding: '0.5rem 0.75rem' },
  tableHeadCell: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#999' },
  tableRow: { display: 'grid', gridTemplateColumns: '1fr 80px 80px 90px 36px', gap: 0, padding: '0.5rem 0.75rem', borderBottom: '1px solid #EDE8E0', alignItems: 'center' },
  tableInput: { background: 'transparent', border: 'none', outline: 'none', fontSize: '0.85rem', fontFamily: "'Barlow', sans-serif", color: '#1A1A1A', width: '100%', padding: '0.2rem 0' },
  tableNumInput: { background: 'transparent', border: 'none', outline: 'none', fontSize: '0.85rem', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, color: '#1A1A1A', width: '100%', padding: '0.2rem 0', textAlign: 'right' as const },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#CCC', fontSize: '1rem', padding: '0.1rem 0.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  addBtn: { background: 'none', border: '1px dashed #C0B8B0', cursor: 'pointer', color: '#888', fontSize: '0.78rem', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '0.6rem 1rem', width: '100%', textAlign: 'left' as const },
  resultPanel: { background: '#1A1A1A', padding: '2rem', position: 'sticky' as const, top: '1rem' },
  resultTitle: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: '#666', marginBottom: '1.25rem' },
  resultRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0.4rem 0', borderBottom: '1px solid #2A2A2A' },
  resultLabel: { fontSize: '0.8rem', color: '#888', fontWeight: 300 },
  resultValue: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1rem', fontWeight: 600, color: '#CCC', letterSpacing: '0.02em' },
  resultTotal: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '1rem 0 0', marginTop: '0.5rem' },
  resultTotalLabel: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#F5C518' },
  resultTotalValue: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' },
  btnPrimary: { display: 'block', width: '100%', background: '#F5C518', border: 'none', padding: '1rem', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#1A1A1A', cursor: 'pointer', marginTop: '1.5rem' },
  btnSecondary: { display: 'block', width: '100%', background: 'none', border: '1px solid #333', padding: '0.75rem', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#666', cursor: 'pointer', marginTop: '0.5rem' },
  priceNote: { textAlign: 'center' as const, fontSize: '0.72rem', color: '#555', marginTop: '0.75rem', lineHeight: 1.5 },
  overlay: { position: 'fixed' as const, inset: 0, background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  modal: { background: '#1A1A1A', border: '1px solid #333', maxWidth: 460, width: '100%', padding: '2.5rem' },
  modalAccent: { width: '3rem', height: '3px', background: '#F5C518', marginBottom: '1.5rem' },
  modalTitle: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1, marginBottom: '0.75rem' },
  modalSub: { fontSize: '0.85rem', color: '#888', lineHeight: 1.6, marginBottom: '1.5rem' },
  checkList: { listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' },
  checkItem: { display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.82rem', color: '#CCC' },
  checkMark: { color: '#F5C518', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0, marginTop: '0.05rem' },
  modalPrice: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#555', marginBottom: '0.5rem' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' } as React.CSSProperties,
}

export default function ElektroRegiezettel() {
  const [data, setData]                       = useState<FormData>(INITIAL)
  const [hasUsedFree, setHasUsedFree]         = useState(false)
  const [showPaywall, setShowPaywall]         = useState(false)
  const [loadingPDF, setLoadingPDF]           = useState(false)
  const [loadingCheckout, setLoadingCheckout] = useState(false)
  const [paid, setPaid]                       = useState(false)

  // FIX: paid-Status aus URL-Param UND localStorage lesen
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const paidViaUrl = params.get('paid') === 'true'
    const paidViaStorage = localStorage.getItem('rz_paid') === 'true'
    if (paidViaUrl || paidViaStorage) {
      setPaid(true)
    }
  }, [])

  const ergebnis = calcErgebnis(data)

  const set = useCallback((key: keyof FormData, val: any) => {
    setData(prev => ({ ...prev, [key]: val }))
  }, [])

  const setPos = useCallback((id: string, key: keyof Position, val: any) => {
    setData(prev => ({
      ...prev,
      positionen: prev.positionen.map(p => p.id === id ? { ...p, [key]: val } : p)
    }))
  }, [])

  const addPos = () => {
    setData(prev => ({
      ...prev,
      positionen: [...prev.positionen, { id: Date.now().toString(), beschreibung: '', menge: 1, einheit: 'Stk', einzelpreis: 0 }]
    }))
  }

  const removePos = (id: string) => {
    setData(prev => ({ ...prev, positionen: prev.positionen.filter(p => p.id !== id) }))
  }

  const handleVorschau = () => {
    setHasUsedFree(true)
    setTimeout(() => setShowPaywall(true), 1500)
  }

  // FIX: Fehlerbehandlung verbessert + console.error für Debugging
  const handleCheckout = async () => {
    setLoadingCheckout(true)
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData: { ...data, brutto: ergebnis.brutto } }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || `HTTP ${res.status}`)
      }

      const json = await res.json()
      if (json.url) {
        window.location.href = json.url
      } else {
        throw new Error('Keine Checkout-URL erhalten')
      }
    } catch (e: any) {
      console.error('[CHECKOUT]', e)
      alert(`Fehler beim Checkout: ${e.message}\n\nBitte erneut versuchen.`)
    } finally {
      setLoadingCheckout(false)
    }
  }

  const handlePDFDownload = async () => {
    setLoadingPDF(true)
    const { jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const W = 210, margin = 18

    doc.setFillColor(245, 240, 232)
    doc.rect(0, 0, W, 297, 'F')
    doc.setFillColor(26, 26, 26)
    doc.rect(0, 0, W, 28, 'F')
    doc.setFillColor(245, 197, 24)
    doc.rect(0, 28, W, 2, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(245, 197, 24)
    doc.text(data.firmaName || 'Ihre Firma', margin, 12)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(153, 153, 153)
    doc.text([data.firmaStrasse, data.firmaPlzOrt, data.firmaTel].filter(Boolean).join('  ·  '), margin, 20)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text('REGIEZETTEL', W - margin, 12, { align: 'right' })
    doc.setFontSize(7)
    doc.text(`Nr. ${data.auftragNr}`, W - margin, 19, { align: 'right' })
    doc.text(`Datum: ${data.datum ? new Date(data.datum).toLocaleDateString('de-DE') : todayStr()}`, W - margin, 24, { align: 'right' })

    let y = 40
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(136, 136, 136)
    doc.text('AUFTRAGGEBER', margin, y)
    doc.text('AUSFÜHRENDES UNTERNEHMEN', W/2 + 4, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.setTextColor(26, 26, 26)
    doc.text(data.kundeName || '—', margin, y)
    doc.text(data.firmaName || '—', W/2 + 4, y)
    doc.setFontSize(8.5)
    doc.setTextColor(80, 80, 80)
    if (data.kundeStrasse) doc.text(data.kundeStrasse, margin, y + 5)
    if (data.kundePlzOrt)  doc.text(data.kundePlzOrt, margin, y + 10)

    y += 22
    doc.setDrawColor(216, 208, 196)
    doc.setLineWidth(0.4)
    doc.line(margin, y, W - margin, y)

    y += 8
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(136, 136, 136)
    doc.text('ARBEITSZEIT & FAHRT', margin, y)
    y += 6

    autoTable(doc, {
      startY: y, head: [],
      body: [
        ['Arbeitsstunden', `${data.arbeitsstunden} h`],
        ['Fahrtzeit', `${data.fahrtzeit} Min.`],
        ['Fahrtstrecke (einfach)', `${data.fahrtkmEinfach} km`],
        ['Stundenlohn (netto)', `${data.stundenlohn.toFixed(2)} €/h`],
        ['km-Pauschale', `${data.kmPauschale.toFixed(2)} €/km`],
      ],
      theme: 'plain', margin: { left: margin, right: margin },
      styles: { fontSize: 8.5, cellPadding: 1.8, textColor: [26, 26, 26] },
      columnStyles: { 0: { cellWidth: 60, textColor: [80, 80, 80] }, 1: { cellWidth: 40, fontStyle: 'bold', halign: 'right' } },
    })

    y = (doc as any).lastAutoTable.finalY + 8
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(136, 136, 136)
    doc.text('MATERIAL & LIEFERUNGEN', margin, y)
    y += 4

    autoTable(doc, {
      startY: y,
      head: [['Bezeichnung', 'Menge', 'Einheit', 'EP netto', 'GP netto']],
      body: data.positionen.map(p => [p.beschreibung, p.menge.toString(), p.einheit, fmtEur(p.einzelpreis), fmtEur(p.menge * p.einzelpreis)]),
      theme: 'striped', margin: { left: margin, right: margin },
      headStyles: { fillColor: [26, 26, 26], textColor: [153, 153, 153], fontSize: 7, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8.5, textColor: [26, 26, 26] },
      columnStyles: { 0: { cellWidth: 'auto' }, 1: { halign: 'right', cellWidth: 18 }, 2: { cellWidth: 18 }, 3: { halign: 'right', cellWidth: 25 }, 4: { halign: 'right', cellWidth: 28, fontStyle: 'bold' } },
    })

    y = (doc as any).lastAutoTable.finalY + 8
    autoTable(doc, {
      startY: y, head: [],
      body: [
        ['Arbeitslohn (netto)', fmtEur(ergebnis.arbeitslohn)],
        ['Fahrtkosten (netto)', fmtEur(ergebnis.fahrtkostenNetto)],
        [`Material inkl. ${data.materialAufschlag}% Aufschlag`, fmtEur(ergebnis.materialMitAuf)],
        ['Nettobetrag', fmtEur(ergebnis.netto)],
        [`MwSt. ${data.mwst}%`, fmtEur(ergebnis.mwstBetrag)],
      ],
      theme: 'plain', margin: { left: W/2, right: margin },
      styles: { fontSize: 9, cellPadding: 1.8 },
      columnStyles: { 0: { textColor: [100, 100, 100] }, 1: { halign: 'right', fontStyle: 'bold', textColor: [26, 26, 26] } },
    })

    y = (doc as any).lastAutoTable.finalY + 2
    doc.setFillColor(26, 26, 26)
    doc.rect(W/2, y, W/2 - margin, 10, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(245, 197, 24)
    doc.text('RECHNUNGSBETRAG', W/2 + 3, y + 6.5)
    doc.setTextColor(255, 255, 255)
    doc.text(fmtEur(ergebnis.brutto), W - margin - 1, y + 6.5, { align: 'right' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(180, 180, 180)
    doc.text('Erstellt mit flow-gen.ai/handwerk/elektro-regiezettel', margin, 290)
    doc.text(todayStr(), W - margin, 290, { align: 'right' })

    doc.save(`Regiezettel_${data.auftragNr}.pdf`)
    setLoadingPDF(false)
  }

  return (
    <div style={S.page}>

      {showPaywall && (
        <div style={S.overlay} onClick={() => setShowPaywall(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={S.modalAccent} />
            <div style={S.modalTitle}>Regiezettel als<br />PDF exportieren</div>
            <div style={S.modalSub}>
              Dein Regiezettel ist fertig berechnet. Für den druckfertigen PDF-Export einmalig 7 € —
              kein Abo, keine versteckten Kosten.
            </div>
            <ul style={S.checkList}>
              {[
                'DIN A4, druckoptimiert, sofort versendbar',
                'Alle Positionen, MwSt-Ausweis, Firmenlogo-Bereich',
                'Unbegrenzte Downloads des generierten PDFs',
                'Auftragsnummer & Datum automatisch eingetragen',
              ].map((item, i) => (
                <li key={i} style={S.checkItem}>
                  <span style={S.checkMark}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div style={S.modalPrice}>Einmaliger Preis</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.25rem' }}>
              7,00 €
              <span style={{ fontSize: '1rem', fontWeight: 400, color: '#666', marginLeft: '0.5rem' }}>inkl. MwSt.</span>
            </div>
            <button style={{ ...S.btnPrimary, fontSize: '1rem' }} onClick={handleCheckout} disabled={loadingCheckout}>
              {loadingCheckout ? 'Weiterleitung...' : 'Jetzt kaufen & PDF herunterladen →'}
            </button>
            <button style={S.btnSecondary} onClick={() => setShowPaywall(false)}>
              Zurück zum Rechner
            </button>
            <p style={S.priceNote}>Sichere Zahlung via Stripe · Visa, Mastercard, PayPal, Klarna</p>
          </div>
        </div>
      )}

      <div style={S.topbar}>
        <div style={S.topbarLogo}>flow-gen.ai</div>
        <div style={S.topbarSub}>Werkzeuge für Handwerker</div>
      </div>

      <div style={S.hero}>
        <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', fontSize: '14rem', fontWeight: 900, color: 'rgba(245,197,24,0.05)', fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>⚡</div>
        <div style={S.heroInner}>
          <div style={S.heroEyebrow}>⚡ Elektro · Handwerk · Abrechnung</div>
          <h1 style={S.heroTitle}>Regiezettel<br />Generator</h1>
          <p style={S.heroSub}>Fahrtzeit, Stundenlohn, Material-Aufschlag und MwSt automatisch kalkuliert. Einmal eingeben — druckfertiges PDF in Sekunden.</p>
          <div style={S.heroBadges}>
            {['Kein Abo', 'Sofort-Download', 'DIN A4 PDF', '7 € Einmalkauf'].map(b => (
              <span key={b} style={S.badge}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={S.main}>
        <div style={S.twoCol}>
          <div>
            <div style={S.section}>
              <div style={S.sectionHead}>Ihr Betrieb<div style={S.sectionLine} /></div>
              <div style={{ ...S.grid2, marginBottom: '0.75rem' }}>
                <Field label="Firmenname" value={data.firmaName} onChange={v => set('firmaName', v)} placeholder="Elektro Muster GmbH" />
                <Field label="Telefon" value={data.firmaTel} onChange={v => set('firmaTel', v)} placeholder="+49 30 123456" />
              </div>
              <div style={S.grid2}>
                <Field label="Straße & Nr." value={data.firmaStrasse} onChange={v => set('firmaStrasse', v)} placeholder="Musterstraße 12" />
                <Field label="PLZ & Ort" value={data.firmaPlzOrt} onChange={v => set('firmaPlzOrt', v)} placeholder="10115 Berlin" />
              </div>
            </div>

            <div style={S.section}>
              <div style={S.sectionHead}>Auftraggeber<div style={S.sectionLine} /></div>
              <div style={{ ...S.grid2, marginBottom: '0.75rem' }}>
                <Field label="Name / Firma" value={data.kundeName} onChange={v => set('kundeName', v)} placeholder="Max Mustermann" />
                <div style={S.fieldWrap}>
                  <label style={S.label}>Auftragsdatum</label>
                  <input type="date" style={S.input} value={data.datum} onChange={e => set('datum', e.target.value)} />
                </div>
              </div>
              <div style={S.grid2}>
                <Field label="Straße & Nr." value={data.kundeStrasse} onChange={v => set('kundeStrasse', v)} placeholder="Kundenstraße 5" />
                <Field label="PLZ & Ort" value={data.kundePlzOrt} onChange={v => set('kundePlzOrt', v)} placeholder="12345 Musterstadt" />
              </div>
            </div>

            <div style={S.section}>
              <div style={S.sectionHead}>Arbeitszeit & Fahrt<div style={S.sectionLine} /></div>
              <div style={S.grid3}>
                <NumField label="Arbeitsstunden (h)" value={data.arbeitsstunden} onChange={v => set('arbeitsstunden', v)} step={0.5} />
                <NumField label="Fahrtzeit (Min.)" value={data.fahrtzeit} onChange={v => set('fahrtzeit', v)} step={5} />
                <NumField label="Fahrtstrecke einfach (km)" value={data.fahrtkmEinfach} onChange={v => set('fahrtkmEinfach', v)} step={1} />
              </div>
            </div>

            <div style={S.section}>
              <div style={S.sectionHead}>Kalkulationssätze<div style={S.sectionLine} /></div>
              <div style={S.grid4}>
                <NumField label="Stundenlohn (€/h)" value={data.stundenlohn} onChange={v => set('stundenlohn', v)} step={5} />
                <NumField label="km-Pauschale (€)" value={data.kmPauschale} onChange={v => set('kmPauschale', v)} step={0.05} />
                <NumField label="Material-Aufschlag (%)" value={data.materialAufschlag} onChange={v => set('materialAufschlag', v)} step={1} />
                <NumField label="MwSt. (%)" value={data.mwst} onChange={v => set('mwst', v)} step={1} />
              </div>
            </div>

            <div style={S.section}>
              <div style={S.sectionHead}>Material & Lieferungen<div style={S.sectionLine} /></div>
              <div style={S.tableWrap}>
                <div style={S.tableHeader}>
                  <span style={S.tableHeadCell}>Bezeichnung</span>
                  <span style={{ ...S.tableHeadCell, textAlign: 'right' }}>Menge</span>
                  <span style={S.tableHeadCell}>Einh.</span>
                  <span style={{ ...S.tableHeadCell, textAlign: 'right' }}>EP netto</span>
                  <span />
                </div>
                {data.positionen.map(p => (
                  <div key={p.id} style={S.tableRow}>
                    <input style={S.tableInput} value={p.beschreibung} onChange={e => setPos(p.id, 'beschreibung', e.target.value)} placeholder="Materialbezeichnung..." />
                    <input style={S.tableNumInput} type="number" value={p.menge} onChange={e => setPos(p.id, 'menge', parseFloat(e.target.value) || 0)} />
                    <input style={{ ...S.tableInput, fontSize: '0.8rem' }} value={p.einheit} onChange={e => setPos(p.id, 'einheit', e.target.value)} />
                    <input style={S.tableNumInput} type="number" step="0.01" value={p.einzelpreis} onChange={e => setPos(p.id, 'einzelpreis', parseFloat(e.target.value) || 0)} />
                    <button style={S.deleteBtn} onClick={() => removePos(p.id)}>×</button>
                  </div>
                ))}
                <button style={S.addBtn} onClick={addPos}>+ Position hinzufügen</button>
              </div>
            </div>
          </div>

          <div>
            <div style={S.resultPanel}>
              <div style={S.resultTitle}>Kalkulation</div>
              {[
                ['Arbeitslohn', fmtEur(ergebnis.arbeitslohn)],
                ['Fahrtkosten', fmtEur(ergebnis.fahrtkostenNetto)],
                ['Material (netto)', fmtEur(ergebnis.materialNetto)],
                [`Material +${data.materialAufschlag}%`, fmtEur(ergebnis.materialMitAuf)],
                ['Nettobetrag', fmtEur(ergebnis.netto)],
                [`MwSt. ${data.mwst}%`, fmtEur(ergebnis.mwstBetrag)],
              ].map(([l, v]) => (
                <div key={l} style={S.resultRow}>
                  <span style={S.resultLabel}>{l}</span>
                  <span style={S.resultValue}>{v}</span>
                </div>
              ))}
              <div style={S.resultTotal}>
                <span style={S.resultTotalLabel}>Gesamt brutto</span>
                <span style={S.resultTotalValue}>{fmtEur(ergebnis.brutto)}</span>
              </div>

              {paid ? (
                <>
                  <button style={S.btnPrimary} onClick={handlePDFDownload} disabled={loadingPDF}>
                    {loadingPDF ? 'PDF wird erstellt...' : '↓ PDF herunterladen'}
                  </button>
                  <p style={{ ...S.priceNote, color: '#F5C518', marginTop: '0.5rem' }}>
                    Zahlung bestätigt ✓
                  </p>
                </>
              ) : (
                <>
                  <button style={S.btnPrimary} onClick={handleVorschau}>
                    {hasUsedFree ? 'PDF kaufen — 7,00 €' : 'Kostenlose Vorschau'}
                  </button>
                  {!hasUsedFree && (
                    <button style={S.btnSecondary} onClick={() => setShowPaywall(true)}>
                      PDF kaufen — 7,00 €
                    </button>
                  )}
                  <p style={S.priceNote}>
                    {hasUsedFree
                      ? 'Kalkulation ist fertig — PDF für 7 € freischalten'
                      : '1× kostenlose Vorschau · PDF-Export für 7 €\neinmalig, kein Abo'
                    }
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>{label}</label>
      <input
        style={{ background: '#FFFFFF', border: `1px solid ${focused ? '#F5C518' : '#D8D0C4'}`, padding: '0.6rem 0.75rem', fontSize: '0.9rem', fontFamily: "'Barlow', sans-serif", color: '#1A1A1A', outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
        value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder={placeholder}
      />
    </div>
  )
}

function NumField({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', lineHeight: 1.3 }}>{label}</label>
      <input
        type="number" step={step}
        style={{ background: '#FFFFFF', border: `1px solid ${focused ? '#F5C518' : '#D8D0C4'}`, padding: '0.6rem 0.75rem', fontSize: '1rem', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, color: '#1A1A1A', outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
        value={value} onChange={e => onChange(parseFloat(e.target.value) || 0)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      />
    </div>
  )
}
