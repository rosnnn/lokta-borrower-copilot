import React from 'react';
import { PERSONAS_LIST } from '../engine/personas';
import { PersonaDefinition, ConfidenceBreakdown } from '../engine/types';
import { ShieldCheck, Moon, Sun, Sparkles, SlidersHorizontal, BookOpen, Layers } from 'lucide-react';

interface HeaderProps {
  activePersonaId: string | null;
  onSelectPersona: (persona: PersonaDefinition | null) => void;
  confidence: ConfidenceBreakdown;
  activeTab: 'copilot' | 'negotiation' | 'stress' | 'personas' | 'rules';
  setActiveTab: (tab: 'copilot' | 'negotiation' | 'stress' | 'personas' | 'rules') => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePersonaId,
  onSelectPersona,
  confidence,
  activeTab,
  setActiveTab,
  theme,
  setTheme,
}) => {
  return (
    <header className="app-header no-print" style={{ borderBottom: '1px solid var(--rule)', background: 'var(--bg2)', padding: '1rem 1.25rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Top Brand Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-ink)',
              fontWeight: 700,
              fontSize: '1.2rem',
              fontFamily: 'var(--display)'
            }}>
              L
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem', fontFamily: 'var(--display)', fontWeight: 600, letterSpacing: '-0.01em' }}>
                  Lokta <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Borrower Copilot</em>
                </span>
                <span className="badge badge-purple" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                  v2.0
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>
                Prudential Self-Assessment &amp; Negotiation Engine for Indian Borrowers
              </p>
            </div>
          </div>

          {/* Right Controls: Confidence Score & Theme Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              title={`${confidence.answeredMustCount} Must questions, ${confidence.answeredAdditionalCount} Additional questions answered`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'var(--bg3)',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                border: '1px solid var(--rule)',
                fontSize: '0.82rem'
              }}
            >
              <ShieldCheck size={16} color="var(--accent)" />
              <span style={{ color: 'var(--muted)' }}>Confidence:</span>
              <span className="num" style={{ fontWeight: 600, color: confidence.scorePercent >= 80 ? 'var(--success)' : confidence.scorePercent >= 60 ? 'var(--warn)' : 'var(--danger)' }}>
                {confidence.scorePercent}%
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>({confidence.bandWidth})</span>
            </div>

            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              style={{
                background: 'var(--bg3)',
                border: '1px solid var(--rule)',
                borderRadius: '8px',
                padding: '0.45rem',
                cursor: 'pointer',
                color: 'var(--ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Toggle dark/light theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>

        {/* Persona Selector Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>
              Preset Borrowers:
            </span>
            {PERSONAS_LIST.map((p) => {
              const isSelected = activePersonaId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPersona(p)}
                  style={{
                    background: isSelected ? 'var(--accent)' : 'var(--bg3)',
                    color: isSelected ? 'var(--accent-ink)' : 'var(--ink)',
                    border: isSelected ? '1px solid var(--accent)' : '1px solid var(--rule)',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{p.name}</span>
                  <span style={{ opacity: 0.75, fontSize: '0.75rem' }}>({p.location})</span>
                </button>
              );
            })}

            <button
              onClick={() => onSelectPersona(null)}
              style={{
                background: activePersonaId === null ? 'var(--accent)' : 'var(--bg3)',
                color: activePersonaId === null ? 'var(--accent-ink)' : 'var(--ink)',
                border: activePersonaId === null ? '1px solid var(--accent)' : '1px solid var(--rule)',
                padding: '0.35rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Sparkles size={14} />
              <span>Custom Assessment</span>
            </button>
          </div>

          {/* Main Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg3)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--rule)' }}>
            <button
              onClick={() => setActiveTab('copilot')}
              style={{
                background: activeTab === 'copilot' ? 'var(--accent-soft)' : 'transparent',
                color: activeTab === 'copilot' ? 'var(--accent)' : 'var(--ink)',
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: activeTab === 'copilot' ? 600 : 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Sparkles size={15} />
              <span>Copilot (O1-O4)</span>
            </button>

            <button
              onClick={() => setActiveTab('negotiation')}
              style={{
                background: activeTab === 'negotiation' ? 'var(--accent-soft)' : 'transparent',
                color: activeTab === 'negotiation' ? 'var(--accent)' : 'var(--ink)',
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: activeTab === 'negotiation' ? 600 : 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <ShieldCheck size={15} />
              <span>Negotiation Card</span>
            </button>

            <button
              onClick={() => setActiveTab('stress')}
              style={{
                background: activeTab === 'stress' ? 'var(--accent-soft)' : 'transparent',
                color: activeTab === 'stress' ? 'var(--accent)' : 'var(--ink)',
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: activeTab === 'stress' ? 600 : 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <SlidersHorizontal size={15} />
              <span>Stress Tester</span>
            </button>

            <button
              onClick={() => setActiveTab('personas')}
              style={{
                background: activeTab === 'personas' ? 'var(--accent-soft)' : 'transparent',
                color: activeTab === 'personas' ? 'var(--accent)' : 'var(--ink)',
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: activeTab === 'personas' ? 600 : 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Layers size={15} />
              <span>3 Personas Run</span>
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              style={{
                background: activeTab === 'rules' ? 'var(--accent-soft)' : 'transparent',
                color: activeTab === 'rules' ? 'var(--accent)' : 'var(--ink)',
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: activeTab === 'rules' ? 600 : 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <BookOpen size={15} />
              <span>RULES.md</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
