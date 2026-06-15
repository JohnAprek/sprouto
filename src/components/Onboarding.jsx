import React, { useState } from 'react';
import { Sprout, Heart, BookOpen, Star } from 'lucide-react';
import { ONBOARDING } from '../i18n';

const ICONS = [<Sprout size={48} />, <Heart size={48} />, <BookOpen size={48} />, <Star size={48} />];

export default function Onboarding({ lang, setLang, onFinish, onSetName }) {
  const O = ONBOARDING[lang] || ONBOARDING.en;
  const STEPS = O.steps;
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');

  const isLast = step === STEPS.length;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'linear-gradient(160deg, #0f4c2a, #166534)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '32px', color: 'white', textAlign: 'center'
    }}>
      {setLang && (
        <button
          onClick={() => setLang(lang === 'en' ? 'id' : 'en')}
          style={{
            position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.15)',
            color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50px',
            padding: '6px 14px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
          }}
          aria-label="Switch language"
        >
          {lang === 'en' ? 'EN · ID' : 'ID · EN'}
        </button>
      )}
      {!isLast ? (
        <>
          <div style={{ fontSize: '80px', marginBottom: '24px', animation: 'fadeInUp 0.4s ease' }}>
            {STEPS[step].emoji}
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>
            {STEPS[step].title}
          </h2>
          <p style={{ opacity: 0.85, fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '280px', marginBottom: '40px' }}>
            {STEPS[step].desc}
          </p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === step ? '24px' : '8px', height: '8px',
                borderRadius: '4px', background: i === step ? 'white' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.3s'
              }} />
            ))}
          </div>
          <button onClick={() => setStep(s => s + 1)} style={{
            background: 'white', color: '#166534', border: 'none', borderRadius: '50px',
            padding: '14px 40px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', width: '100%', maxWidth: '280px'
          }}>
            {step === STEPS.length - 1 ? O.start_setup : O.next}
          </button>
          <button onClick={onFinish} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', marginTop: '16px', cursor: 'pointer', fontSize: '0.85rem' }}>
            {O.skip}
          </button>
        </>
      ) : (
        <>
          <div style={{ fontSize: '60px', marginBottom: '24px' }}>🌱</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>{O.ask_name}</h2>
          <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '32px' }}>{O.ask_name_sub}</p>
          <input
            type="text"
            placeholder={O.name_placeholder}
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              width: '100%', maxWidth: '280px', padding: '14px 20px', borderRadius: '50px',
              border: 'none', fontSize: '1rem', marginBottom: '16px', textAlign: 'center',
              outline: 'none', color: '#14532d', fontWeight: 600
            }}
          />
          <button onClick={() => { onSetName(name || O.default_name); onFinish(); }} style={{
            background: 'white', color: '#166534', border: 'none', borderRadius: '50px',
            padding: '14px 40px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', width: '100%', maxWidth: '280px'
          }}>
            {O.start}
          </button>
        </>
      )}
    </div>
  );
}
