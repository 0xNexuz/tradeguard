'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Check, ChevronDown, CircleAlert, Gauge, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

type Phase = 'ready' | 'checking' | 'revised' | 'verified';

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);

export default function Home() {
  const [amount, setAmount] = useState(1500);
  const [budget, setBudget] = useState(1000);
  const [exposure, setExposure] = useState(25);
  const [phase, setPhase] = useState<Phase>('ready');
  const [intent, setIntent] = useState('Buy BTC while keeping my exposure within the limit.');

  const overage = Math.max(0, amount - budget);
  const revisedAmount = Math.min(amount, budget);
  const isSafe = amount <= budget;

  const status = useMemo(() => {
    if (phase === 'verified') return { label: 'Plan verified', detail: 'All configured limits passed.' };
    if (phase === 'checking') return { label: 'Reviewing plan', detail: 'Checking live constraints…' };
    if (phase === 'revised') return { label: 'Budget exceeded', detail: `${formatMoney(overage)} USDT over your limit` };
    return { label: 'Ready to check', detail: 'Your agent is waiting for an intent.' };
  }, [phase, overage]);

  function checkPlan() {
    setPhase('checking');
    window.setTimeout(() => setPhase(isSafe ? 'verified' : 'revised'), 850);
  }

  function applyRevision() {
    setAmount(revisedAmount);
    setPhase('verified');
  }

  function resetPlan() {
    setAmount(1500);
    setBudget(1000);
    setExposure(25);
    setPhase('ready');
  }

  return (
    <main className="app-shell">
      <div className="cosmic-backdrop" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#workspace" aria-label="TradeGuard home">
          <span className="brand-mark"><span /></span>
          <span>TRADEGUARD</span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a className="active" href="#workspace">Workspace</a>
          <a href="#guardrails">Guardrails</a>
          <a href="#activity">Activity</a>
        </nav>
        <div className="mode-pill"><span /> Simulation mode</div>
      </header>

      <section className="intro" aria-labelledby="page-title">
        <div className="intro-art" aria-hidden="true">
          <img src="/human-machine.png" alt="" />
          <span className="connection-glow" />
        </div>
        <div className="intro-copy">
          <p className="eyebrow">AGENT OS / CONTROL LAYER</p>
          <h1 id="page-title">Your intent.<br /><em>Under control.</em></h1>
          <p>Check a trading plan before it becomes a trade.</p>
        </div>
        <div className="intro-note">
          <ShieldCheck size={18} />
          <span>Human limits remain<br />part of every decision.</span>
        </div>
      </section>

      <section className="workspace" id="workspace" aria-label="Trading plan simulator">
        <div className="plan-panel glass-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-index">01 / INTENT</p>
              <h2>Plan a trade</h2>
            </div>
            <span className="data-pill"><Sparkles size={12} /> Simulated data</span>
          </div>

          <div className="fields-row">
            <label className="field-shell">
              <span>Trading pair</span>
              <strong>BTC / USDT</strong>
              <ChevronDown size={17} />
            </label>
            <label className="field-shell amount-field">
              <span>Order amount</span>
              <Input
                aria-label="Order amount in USDT"
                type="number"
                min={10}
                value={amount}
                onChange={(event) => {
                  setAmount(Number(event.target.value));
                  setPhase('ready');
                }}
              />
              <b>USDT</b>
            </label>
          </div>

          <label className="intent-field">
            <span>Trading intent</span>
            <Textarea value={intent} onChange={(event) => setIntent(event.target.value)} />
          </label>

          <div className="limits" id="guardrails">
            <div className="limit-copy">
              <span>Available budget</span>
              <strong>{formatMoney(budget)} USDT</strong>
            </div>
            <Slider
              aria-label="Available budget"
              min={250}
              max={2500}
              step={50}
              value={[budget]}
              onValueChange={(value) => {
                setBudget(value[0] ?? 1000);
                setPhase('ready');
              }}
            />
            <div className="limit-copy">
              <span>Maximum exposure</span>
              <strong>{exposure}%</strong>
            </div>
            <Slider
              aria-label="Maximum exposure"
              min={5}
              max={60}
              step={5}
              value={[exposure]}
              onValueChange={(value) => setExposure(value[0] ?? 25)}
            />
            <div className="micro-limit"><span>Slippage limit</span><strong>0.5%</strong></div>
          </div>

          <Button className="check-button" onClick={checkPlan} disabled={phase === 'checking'}>
            {phase === 'checking' ? 'Checking plan…' : 'Check plan'}
            {phase === 'checking' ? <span className="spinner" /> : <ArrowRight size={18} />}
          </Button>
        </div>

        <aside className={`agent-panel glass-panel phase-${phase}`} aria-live="polite">
          <img className="agent-figure" src="/liquid-agent.png" alt="Liquid chrome TradeGuard agent" />
          <div className="agent-scrim" />
          <div className="agent-content">
            <p className="panel-index">02 / AGENT REVIEW</p>
            <div className={`status-orb ${phase}`}>
              {phase === 'revised' ? <CircleAlert size={20} /> : phase === 'verified' ? <Check size={20} /> : <Gauge size={20} />}
            </div>
            <p className="status-label">{status.label}</p>
            <h2>{status.detail}</h2>

            <div className="checks">
              <div className="passed"><span><Check size={13} /></span><p>Market context checked<small>BTC / USDT</small></p></div>
              <div className={phase === 'revised' ? 'failed' : 'passed'}><span>{phase === 'revised' ? '!' : <Check size={13} />}</span><p>Budget limit {phase === 'revised' ? 'exceeded' : 'checked'}<small>{formatMoney(budget)} USDT ceiling</small></p></div>
              <div className={phase === 'revised' || phase === 'verified' ? 'passed' : ''}><span>{phase === 'revised' || phase === 'verified' ? <Check size={13} /> : '·'}</span><p>Revised plan {phase === 'revised' || phase === 'verified' ? 'available' : 'pending'}<small>{formatMoney(revisedAmount)} USDT order</small></p></div>
            </div>

            {phase === 'revised' && (
              <div className="revision-card">
                <span>Bounded revision</span>
                <strong>{formatMoney(amount)} → {formatMoney(revisedAmount)} USDT</strong>
                <Button className="revision-button" onClick={applyRevision}>Apply safer plan <ArrowRight size={16} /></Button>
              </div>
            )}
            {phase === 'verified' && (
              <div className="revision-card verified-card">
                <span>Ready for human approval</span>
                <strong>{formatMoney(amount)} USDT within all limits</strong>
                <Button className="revision-button" onClick={resetPlan}>Run another check <RotateCcw size={15} /></Button>
              </div>
            )}
          </div>
        </aside>

        <div className="process-strip" id="activity">
          <div className={`process-step ${phase !== 'ready' ? 'done' : 'active'}`}><span>01</span><div><b>CHECK</b><small>Read intent + limits</small></div></div>
          <div className={`process-line ${phase === 'revised' || phase === 'verified' ? 'lit' : ''}`} />
          <div className={`process-step ${phase === 'revised' ? 'active' : phase === 'verified' ? 'done' : ''}`}><span>02</span><div><b>REPLAN</b><small>Correct the constraint</small></div></div>
          <div className={`process-line ${phase === 'verified' ? 'lit' : ''}`} />
          <div className={`process-step ${phase === 'verified' ? 'active' : ''}`}><span>03</span><div><b>VERIFY</b><small>Prove the final state</small></div></div>
        </div>
      </section>

      <footer><span>TradeGuard / Agent OS</span><span>Simulation only. No real trades.</span></footer>
    </main>
  );
}
