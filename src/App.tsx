import { renewalRecords } from "./data/renewals";
import { formatCurrency, rankRenewals } from "./lib/renewalPressure";

const renewals = rankRenewals(renewalRecords);
const topRenewal = renewals[0];

function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Synthetic renewal desk</p>
          <h1>Vendor Renewal Pressure Map</h1>
          <p className="lede">
            Rank renewal pressure before cancellation leverage disappears, then
            turn scattered contract clues into an owner-ready negotiation brief.
          </p>
        </div>
        <aside className="brief-panel" aria-label="Top negotiation brief">
          <span className={`status ${topRenewal.pressureLevel}`}>{topRenewal.pressureLevel}</span>
          <h2>{topRenewal.vendor}</h2>
          <p>{topRenewal.brief}</p>
        </aside>
      </section>

      <section className="summary-grid" aria-label="Renewal pressure summary">
        <div>
          <span>Highest pressure</span>
          <strong>{topRenewal.pressureScore}/100</strong>
        </div>
        <div>
          <span>Next cancellation window</span>
          <strong>{topRenewal.daysUntilCancellation} days</strong>
        </div>
        <div>
          <span>Largest proposed uplift</span>
          <strong>{Math.round(Math.max(...renewals.map((item) => item.priceIncreasePercent)))}%</strong>
        </div>
      </section>

      <section className="renewal-list" aria-label="Vendor renewal cards">
        {renewals.map((renewal) => (
          <article className="renewal-card" key={renewal.vendor}>
            <div className="card-header">
              <div>
                <p className="eyebrow">{renewal.category}</p>
                <h2>{renewal.vendor}</h2>
              </div>
              <div className="score-block">
                <span className={`status ${renewal.pressureLevel}`}>{renewal.pressureLevel}</span>
                <strong>{renewal.pressureScore}</strong>
              </div>
            </div>

            <div className="metric-row">
              <span>Renewal</span>
              <strong>{renewal.renewalDate}</strong>
              <span>Cancel by</span>
              <strong>{renewal.cancellationDeadline}</strong>
              <span>Owner</span>
              <strong>{renewal.owner}</strong>
            </div>

            <div className="spend-row">
              <span>{formatCurrency(renewal.currentAnnualSpend)} current</span>
              <span>{formatCurrency(renewal.proposedAnnualSpend)} proposed</span>
              <span>{renewal.priceIncreasePercent.toFixed(1)}% uplift</span>
            </div>

            <p className="impact">{renewal.businessImpact}</p>

            <div className="evidence-grid">
              <div>
                <h3>Pressure factors</h3>
                <ul>
                  {renewal.scoreFactors.map((factor) => (
                    <li key={factor}>{factor}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Source evidence</h3>
                <ul>
                  {renewal.evidence.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Next action</h3>
                <p>{renewal.nextAction}</p>
                <h3>Alternatives</h3>
                <p>{renewal.alternatives.join(" / ")}</p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;
