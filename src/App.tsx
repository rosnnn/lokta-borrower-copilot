import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Questionnaire } from './components/Questionnaire';
import { ResultsDashboard } from './components/ResultsDashboard';
import { NegotiationCard } from './components/NegotiationCard';
import { StressTester } from './components/StressTester';
import { PersonaComparison } from './components/PersonaComparison';
import { RulesInspector } from './components/RulesInspector';
import { PERSONA_PRIYA, DEFAULT_CUSTOM_INPUTS } from './engine/personas';
import { BorrowerInputs, PersonaDefinition } from './engine/types';
import { runBorrowerAssessment } from './engine/assessor';

export const App: React.FC = () => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'copilot' | 'negotiation' | 'stress' | 'personas' | 'rules'>('copilot');

  // Active persona or custom
  const [activePersonaId, setActivePersonaId] = useState<string | null>('priya');
  const [inputs, setInputs] = useState<BorrowerInputs>(PERSONA_PRIYA.inputs);

  // Sync theme with HTML data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Handle switching personas
  const handleSelectPersona = (persona: PersonaDefinition | null) => {
    if (persona) {
      setActivePersonaId(persona.id);
      setInputs(persona.inputs);
    } else {
      setActivePersonaId(null);
      setInputs(DEFAULT_CUSTOM_INPUTS);
    }
  };

  // Run real-time assessment whenever inputs change
  const assessmentResult = useMemo(() => {
    return runBorrowerAssessment(inputs);
  }, [inputs]);

  return (
    <div className="app-container">
      {/* Top App Header */}
      <Header
        activePersonaId={activePersonaId}
        onSelectPersona={handleSelectPersona}
        confidence={assessmentResult.confidence}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Content Pane */}
      <main className="main-content">
        {activeTab === 'copilot' && (
          <div className="copilot-layout">
            <Questionnaire inputs={inputs} onChange={setInputs} />
            <ResultsDashboard
              result={assessmentResult}
              onOpenNegotiation={() => setActiveTab('negotiation')}
            />
          </div>
        )}

        {activeTab === 'negotiation' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <NegotiationCard result={assessmentResult} />
          </div>
        )}

        {activeTab === 'stress' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <StressTester result={assessmentResult} />
          </div>
        )}

        {activeTab === 'personas' && (
          <PersonaComparison
            onSelectPersona={(persona) => {
              handleSelectPersona(persona);
              setActiveTab('copilot');
            }}
          />
        )}

        {activeTab === 'rules' && (
          <RulesInspector />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print" style={{ borderTop: '1px solid var(--rule)', padding: '2rem 1.25rem', marginTop: 'auto', background: 'var(--bg2)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--muted)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--ink)', marginBottom: '0.5rem' }}>
            “Can you turn lending judgement into rules a borrower can see and a machine can run? That is the whole company.”
          </p>
          <p style={{ margin: 0 }}>
            Lokta Borrower Copilot · Built for Indian Borrowers · Zero Data Stored · Open Rules Engine
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
