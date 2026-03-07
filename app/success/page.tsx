'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SuccessContent() {
  const params    = useSearchParams()
  const sessionId = params.get('session_id')

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('rz_paid', 'true')
      localStorage.setItem('rz_session', sessionId)
    }
  }, [sessionId])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F0E8',
      fontFamily: "'Barlow', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        background: '#1A1A1A',
        width: '100%',
        position: 'fixed',
        top: 0, left: 0,
        padding: '0.6rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
      }}>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700, fontSize: '1rem',
          color: '#F5C518', letterSpacing: '0.15em', textTransform: 'uppercase',
        }}>flow-gen.ai</span>
      </div>

      <div style={{
        maxWidth: 520,
        width: '100%',
        background: '#1A1A1A',
        borderTop: '3px solid #F5C518',
        padding: '3rem',
        marginTop: '4rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>

        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '2rem', fontWeight: 800,
          color: '#FFFFFF', marginBottom: '0.75rem', lineHeight: 1.1,
        }}>
          Zahlung erfolgreich!
        </h1>

        <p style={{
          fontSize: '0.9rem', color: '#888',
          lineHeight: 1.7, marginBottom: '2.5rem',
        }}>
          Danke für deinen Kauf. Gehe zurück zum Rechner um dein PDF zu generieren.
          Der Button ist jetzt freigeschaltet.
        </p>

        
          href="/?paid=true"
          style={{
            display: 'block',
            background: '#F5C518',
            border: 'none',
            padding: '1rem',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '1rem', fontWeight: 800,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#1A1A1A', cursor: 'pointer', textDecoration: 'none',
          }}
        >
          ← Zurück zum Regiezettel & PDF erstellen
        </a>

        {sessionId && (
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '0.62rem', color: '#444',
            marginTop: '1.5rem', letterSpacing: '0.08em',
          }}>
            Bestellnummer: {sessionId.slice(-12).toUpperCase()}
          </p>
        )}
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ background: '#F5F0E8', minHeight: '100vh' }} />}>
      <SuccessContent />
    </Suspense>
  )
}