/* global React, AccompanistForm, ClientForm, SuccessPanel, Wordmark, MonogramShape, I */
const { useState, useEffect } = React;

// ============================================================
// VARIANT 1 — EDITORIAL FIELD
// Typography-led; dual CTA cards; inline expanding form
// ============================================================
function V1Editorial({ device = "desktop", tweaks = {} }) {
  const accompCta = tweaks.accompanistCta || "Apply to founding cohort";
  const clientCta = tweaks.clientCta || "Get launch alert";
  const linkMode = tweaks.formMode === 'external';
  const externalUrl = tweaks.accompanistUrl || '#';
  const [activeAudience, setActiveAudience] = useState(null);
  const [submitted, setSubmitted] = useState(null);

  const submit = (kind, data) => setSubmitted({ kind, data });
  const reset = () => { setSubmitted(null); setActiveAudience(null); };

  const onAccompClick = (e) => {
    if (linkMode) {
      e.preventDefault?.();
      window.open(externalUrl, '_blank', 'noopener');
    } else {
      setActiveAudience('accompanist');
      setSubmitted(null);
    }
  };

  return (
    <div className="lp v1" data-device={device}>
      {/* Topbar */}
      <div className="topbar">
        <Wordmark size={32} />
        <span className="pill"><span className="dot" />Launching mid-2026 · NSW</span>
      </div>

      {/* Hero */}
      <section className="v1-hero">
        <div className="v1-hero-eye eyebrow">Waitlist now open · AMEB · ABRSM · ANZCA</div>
        <h1 className="v1-hero-head">
          The accompanist<br/>
          behind every <em>exam day</em>,<br/>
          booked in one place.
        </h1>
        <p className="v1-hero-sub">
          accompanyME pairs verified piano accompanists with the students, parents and music teachers who need them — for exams, eisteddfods and recitals. Funds release the day after the exam. The accompanist is paid in full. No platform fee on their rate, ever.
        </p>
        <div className="v1-hero-bar">
          <strong>Now collecting interest</strong>
          <span className="sep">·</span>
          <span>NSW launches mid-2026, through the October–November exam season</span>
          <span className="sep">·</span>
          <span>National rollout 2027</span>
        </div>
      </section>

      {/* Dual CTA cards */}
      <section className="v1-cards">
        <div className="v1-cards-grid">
          <button
            type="button"
            className="audience-card"
            data-tone="green"
            onClick={onAccompClick}
            style={{ textAlign: 'left', cursor: 'pointer', color: '#fff' }}
          >
            <MonogramShape size={220} style={{ position: 'absolute', right: -40, top: -40, opacity: 0.22, filter: 'brightness(0) invert(1)' }} />
            <div className="ac-body">
              <div className="ac-eye">For accompanists · supply side</div>
              <h3>Be paid your full rate. Never any platform fee.</h3>
              <p>Founding-cohort accompanists are listed first in search and keep their position for six months. Verification + your unique profile URL included.</p>
            </div>
            <div className="ac-foot">
              <span className="meta">2 min · {linkMode ? 'External form' : (activeAudience === 'accompanist' ? 'Form below' : 'Tap to apply')}</span>
              <span className="btn btn-on-dark btn-sm">
                {linkMode ? accompCta : (activeAudience === 'accompanist' ? 'Open' : accompCta)} <I name="arrow" size={14} className="arr" />
              </span>
            </div>
          </button>

          <button
            type="button"
            className="audience-card"
            data-tone="mint"
            onClick={() => { setActiveAudience('client'); setSubmitted(null); }}
            style={{ textAlign: 'left', cursor: 'pointer' }}
          >
            <MonogramShape size={220} style={{ position: 'absolute', right: -40, top: -40, opacity: 0.18 }} />
            <div className="ac-body">
              <div className="ac-eye">For students, parents &amp; teachers</div>
              <h3>Find the right accompanist — no chasing, no cash on the day.</h3>
              <p>Get told the moment we open bookings in your suburb. Founders get a 7-day head-start before public launch.</p>
            </div>
            <div className="ac-foot">
              <span className="meta" style={{ color: 'var(--am-ink-500)' }}>
                30 sec · {activeAudience === 'client' ? 'Form below' : 'Tap to sign up'}
              </span>
              <span className="btn btn-primary btn-sm">
                {activeAudience === 'client' ? 'Open' : clientCta} <I name="arrow" size={14} className="arr" />
              </span>
            </div>
          </button>
        </div>

        {/* Inline expanding form */}
        {activeAudience && (
          <div className="v1-form-panel">
            <button type="button" className="v1-form-close" onClick={reset}>
              <I name="close" size={14} /> Close
            </button>
            <div className="v1-form-side">
              {activeAudience === 'accompanist' ? (
                <>
                  <div className="eyebrow" style={{ marginBottom: 14 }}>Founding cohort · accompanists</div>
                  <h3>Tell us a little. We'll do the rest.</h3>
                  <p>Two minutes now — verified and live the day we launch.</p>
                  <ul>
                    <li>Paid your <strong>full rate</strong>, the day after each exam — never any cut.</li>
                    <li>WWCC verification &amp; a short call before your profile goes live.</li>
                    <li>Your unique URL — <code style={{ background: 'var(--am-green-100)', padding: '2px 6px', borderRadius: 6, fontSize: 12 }}>accompanyme.co/your-name</code></li>
                    <li>Listed first for the first six months as a founding member.</li>
                  </ul>
                </>
              ) : (
                <>
                  <div className="eyebrow" style={{ marginBottom: 14 }}>Launch alert · clients</div>
                  <h3>We'll email when we open in your suburb.</h3>
                  <p>One email. No spam. Plus a 7-day head-start on bookings.</p>
                  <ul>
                    <li>Search by exam date, suburb, instrument and grade.</li>
                    <li>Every accompanist is WWCC-verified.</li>
                    <li>Payment is held in escrow and released 24h after the exam.</li>
                    <li>Live for the AMEB October–November exam season.</li>
                  </ul>
                </>
              )}
            </div>
            <div className="v1-form-body">
                {submitted && submitted.kind === activeAudience ? (
                  <SuccessPanel kind={activeAudience} data={submitted.data} onReset={reset} />
                ) : activeAudience === 'accompanist' ? (
                  <AccompanistForm onSubmit={(d) => submit('accompanist', d)} ctaLabel={accompCta} />
                ) : (
                  <ClientForm onSubmit={(d) => submit('client', d)} ctaLabel={clientCta} />
                )}
            </div>
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="v1-how">
        <div className="v1-how-inner">
          <div className="v1-how-head">
            <div>
              <div className="eyebrow" style={{ marginBottom: 14 }}>How accompanyME works</div>
              <h2>Find. Book. Perform.<br/>One quiet workflow.</h2>
            </div>
            <p style={{ color: 'var(--am-ink-500)', maxWidth: 320, fontSize: 15 }}>
              No phone tag, no chasing fees, no awkward cash-in-an-envelope at the exam venue. Built around how an exam day actually works.
            </p>
          </div>
          <div className="v1-how-grid">
            <div className="v1-how-step">
              <span className="n">01 · FIND</span>
              <h4>Match on what matters.</h4>
              <p>Distance, exam experience, repertoire, rating and response rate — weighted so the right accompanist for your grade and suburb surfaces first.</p>
            </div>
            <div className="v1-how-step">
              <span className="n">02 · BOOK</span>
              <h4>Pay once, held in escrow.</h4>
              <p>Stripe holds the full amount. Accompanist sees the booking confirmed. You see their rehearsal slots, programme requirements and meeting point.</p>
            </div>
            <div className="v1-how-step">
              <span className="n">03 · PERFORM</span>
              <h4>Exam day, handled.</h4>
              <p>A what3words meeting point, the programme checklist, and a tap-to-confirm arrival. Funds release 24 hours after the exam completes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder note */}
      <section className="v1-founder">
        <div>
          <div className="eyebrow" style={{ marginBottom: 18 }}>From the founder</div>
          <blockquote>
            "I've been the accompanist at hundreds of AMEB exams. The students were always ready — but finding me, paying me, and getting me to the venue on time was always the wobbly bit. accompanyME is the fix."
          </blockquote>
          <p className="v1-founder-attr">
            <strong>Mark Lawrenson</strong> · Founder · Sydney, NSW
          </p>
        </div>
        <aside className="v1-founder-side">
          <span className="label">Building toward</span>
          <div className="stat">Oct 2026<span style={{ color: 'var(--am-amber-500)', fontSize: 22, marginLeft: 6 }}>·</span></div>
          <p style={{ color: 'var(--am-ink-700)', fontSize: 14, margin: '4px 0 8px' }}>NSW soft launch, in time for the AMEB practical exam season.</p>
          <ul>
            <li><span>Verified accompanists</span> <span>120+ goal</span></li>
            <li><span>Suburbs covered</span> <span>Greater Sydney</span></li>
            <li><span>Exam boards</span> <span>AMEB · ABRSM · ANZCA</span></li>
            <li><span>Platform fee on rate</span> <span>0%</span></li>
          </ul>
        </aside>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <Wordmark size={22} />
        <div className="links">
          <a href="#">About</a>
          <a href="#">For accompanists</a>
          <a href="#">For teachers</a>
          <a href="#">Contact</a>
        </div>
        <span>© 2026 accompanyME Pty Ltd · Sydney</span>
      </footer>
    </div>
  );
}

// ============================================================
// VARIANT 2 — SPLIT DECISION
// Two-half hero (green | mint); CTAs open form sheet
// ============================================================
function V2Split({ device = "desktop", tweaks = {} }) {
  const accompCta = tweaks.accompanistCta || "Apply to founding cohort";
  const clientCta = tweaks.clientCta || "Get launch alert";
  const linkMode = tweaks.formMode === 'external';
  const externalUrl = tweaks.accompanistUrl || '#';
  const [openSheet, setOpenSheet] = useState(null); // null | 'accompanist' | 'client'
  const [submitted, setSubmitted] = useState(null);

  const submit = (kind, data) => setSubmitted({ kind, data });
  const close = () => { setOpenSheet(null); setSubmitted(null); };

  const onAccompClick = () => {
    if (linkMode) {
      window.open(externalUrl, '_blank', 'noopener');
    } else {
      setOpenSheet('accompanist');
    }
  };

  return (
    <div className="lp v2" data-device={device}>
      {/* Brand bar */}
      <div className="v2-brand-bar">
        <span className="mark">
          <img src="brand/assets/logo-monogram-white.png" alt="" />
          <span>accompany<b>ME</b></span>
        </span>
        <span className="ann">
          <span className="dot" /> Mid-2026 · NSW · waitlist open
        </span>
      </div>

      {/* Split hero */}
      <section className="v2-split">
        <div className="v2-split-divider" />

        {/* Accompanist half */}
        <div className="v2-half v2-half--accomp">
          <MonogramShape size={360} style={{ position: 'absolute', bottom: -60, right: -60, opacity: 0.16, filter: 'brightness(0) invert(1)', width: device === 'mobile' ? 220 : 360 }} />
          <div className="v2-half-eye">For accompanists</div>
          <h2>
            You do the playing.<br/>
            <em>We do the admin.</em>
          </h2>
          <p className="v2-half-sub">
            Verified bookings, your full rate, paid the day after the exam.
          </p>
          <ul className="v2-half-list">
            <li><I name="check" size={16} style={{ color: 'var(--am-green-200)' }} /> Full rate paid to you — zero platform fee.</li>
            <li><I name="check" size={16} style={{ color: 'var(--am-green-200)' }} /> Founding members listed first for six months.</li>
            <li><I name="check" size={16} style={{ color: 'var(--am-green-200)' }} /> Your own <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, opacity: 0.85 }}>accompanyme.co/you</code> URL.</li>
          </ul>
          <button className="btn btn-on-dark btn-lg v2-half-cta" onClick={onAccompClick}>
            {accompCta} <I name="arrow" size={16} className="arr" />
          </button>
          <div className="v2-half-meta">2 min · WWCC required at verification</div>
        </div>

        {/* Client half */}
        <div className="v2-half v2-half--client">
          <MonogramShape size={360} style={{ position: 'absolute', bottom: -60, right: -60, opacity: 0.18, width: device === 'mobile' ? 220 : 360 }} />
          <div className="v2-half-eye">For students, parents &amp; teachers</div>
          <h2>
            Finding an accompanist<br/>
            <em>made simple.</em>
          </h2>
          <p className="v2-half-sub">
            One email when we open in your suburb — plus a 7-day head-start on bookings.
          </p>
          <ul className="v2-half-list">
            <li><I name="check" size={16} style={{ color: 'var(--am-green-700)' }} /> Every accompanist WWCC-verified.</li>
            <li><I name="check" size={16} style={{ color: 'var(--am-green-700)' }} /> Funds held until 24h after the exam.</li>
            <li><I name="check" size={16} style={{ color: 'var(--am-green-700)' }} /> AMEB · ABRSM · ANZCA · eisteddfods.</li>
          </ul>
          <button className="btn btn-primary btn-lg v2-half-cta" onClick={() => setOpenSheet('client')}>
            {clientCta} <I name="arrow" size={16} className="arr" />
          </button>
          <div className="v2-half-meta">30 sec · no spam · unsubscribe anytime</div>
        </div>
      </section>

      {/* How it works strip */}
      <section className="v2-how">
        <div className="v2-how-inner">
          <div className="v2-how-head">
            <h3>Find. Book. Perform.</h3>
            <p style={{ color: 'var(--am-ink-500)', fontSize: 15, maxWidth: 360 }}>
              Three steps, one calm exam day. No cash, no chasing, no last-minute scramble.
            </p>
          </div>
          <div className="v2-how-grid">
            <div className="v2-how-step">
              <span className="n">01 · FIND</span>
              <h4>The right accompanist.</h4>
              <p>Matched by distance, exam experience, repertoire and rating.</p>
            </div>
            <div className="v2-how-step">
              <span className="n">02 · BOOK</span>
              <h4>Pay once, held safely.</h4>
              <p>Secure payment held until after the exam. Your accompanist gets the details instantly.</p>
            </div>
            <div className="v2-how-step">
              <span className="n">03 · PERFORM</span>
              <h4>Exam day, sorted.</h4>
              <p>what3words meeting point, tap-to-confirm arrival, paid 24h later.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <Wordmark size={22} />
        <div className="links">
          <a href="#">About</a>
          <a href="#">For accompanists</a>
          <a href="#">For teachers</a>
          <a href="#">Contact</a>
        </div>
        <span>© 2026 accompanyME Pty Ltd · Sydney</span>
      </footer>

      {/* Sheet (form modal) */}
      {openSheet && (
        <div className="v2-sheet-scrim" onClick={close}>
          <div className="v2-sheet" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="v2-sheet-close" onClick={close}>
              <I name="close" size={14} /> Close
            </button>
            {submitted && submitted.kind === openSheet ? (
              <SuccessPanel kind={openSheet} data={submitted.data} onReset={close} />
            ) : openSheet === 'accompanist' ? (
              <>
                <div className="eyebrow" style={{ marginBottom: 12 }}>Founding cohort</div>
                <h3>Two minutes. We'll handle the rest.</h3>
                <p>Verified and live the day we launch.</p>
                <AccompanistForm onSubmit={(d) => submit('accompanist', d)} ctaLabel={accompCta} />
              </>
            ) : (
              <>
                <div className="eyebrow" style={{ marginBottom: 12 }}>Launch alert</div>
                <h3>We'll email when we open near you.</h3>
                <p>One email. Plus a 7-day head-start on bookings.</p>
                <ClientForm onSubmit={(d) => submit('client', d)} ctaLabel={clientCta} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// VARIANT 3 — MARQUEE MONOGRAM
// Big monogram bg, segmented audience picker, postcode-first
// ============================================================
function V3Marquee({ device = "desktop", tweaks = {} }) {
  const accompCta = tweaks.accompanistCta || "Apply to founding cohort";
  const clientCta = tweaks.clientCta || "Get launch alert";
  const linkMode = tweaks.formMode === 'external';
  const externalUrl = tweaks.accompanistUrl || '#';
  const [audience, setAudience] = useState('accompanist');
  const [submitted, setSubmitted] = useState(null);

  const submit = (kind, data) => setSubmitted({ kind, data });
  const reset = () => setSubmitted(null);

  const tickerItems = [
    'Hurstville 2220', 'Chatswood 2067', 'Burwood 2134', 'Mosman 2088', 'Parramatta 2150',
    'Coogee 2034', 'Manly 2095', 'Newtown 2042', 'Strathfield 2135', 'Castle Hill 2154',
    'Surry Hills 2010', 'Liverpool 2170', 'Dee Why 2099', 'Eastwood 2122', 'Kogarah 2217',
  ];

  return (
    <div className="lp v3" data-device={device}>
      <section className="v3-hero">
        <MonogramShape size={device === 'mobile' ? 600 : 920} className="v3-bg-monogram" />
        <div className="v3-hero-inner">
          <div className="v3-topbar">
            <Wordmark size={32} dark />
            <span className="pill pill--ghost"><span className="dot" /> Mid-2026 · NSW · waitlist open</span>
          </div>

          <div style={{ marginTop: device === 'mobile' ? 8 : 24 }}>
            <div className="eyebrow" style={{ color: 'var(--am-green-200)', marginBottom: 16 }}>
              AMEB · ABRSM · ANZCA · school assessments · eisteddfods
            </div>
            <h1 className="v3-hero-head">
              The accompanist<br/>
              behind every<br/>
              <em>exam day,</em> <span className="underline">booked.</span>
            </h1>
            <p className="v3-hero-sub">
              We're building a marketplace for piano accompanists in Australia. Verified, WWCC-checked, paid their full rate the day after the exam. NSW first — then the country.
            </p>
          </div>

          {/* Audience picker + form */}
          <div className="v3-picker">
            {submitted ? (
              <SuccessPanel kind={submitted.kind} data={submitted.data} onReset={reset} />
            ) : (
              <>
                <div className="v3-picker-label">I want to…</div>
                <div className="v3-picker-seg" role="tablist">
                  <button
                    role="tab"
                    aria-selected={audience === 'accompanist'}
                    className={audience === 'accompanist' ? 'on' : ''}
                    onClick={() => setAudience('accompanist')}
                  >
                    Join as an accompanist
                  </button>
                  <button
                    role="tab"
                    aria-selected={audience === 'client'}
                    className={audience === 'client' ? 'on' : ''}
                    onClick={() => setAudience('client')}
                  >
                    Get told at launch
                  </button>
                </div>

                {audience === 'accompanist'
                  ? (linkMode ? (
                      <div style={{ padding: '8px 0', color: 'rgba(255,255,255,0.85)' }}>
                        <p style={{ marginBottom: 18, lineHeight: 1.55, fontSize: 15 }}>
                          Applications are being handled externally for now. Tap the button to open the application form.
                        </p>
                        <a href={externalUrl} target="_blank" rel="noopener"
                          className="btn btn-primary btn-lg" style={{ display: 'inline-flex' }}>
                          {accompCta} <I name="arrow" size={16} className="arr" />
                        </a>
                      </div>
                    ) : <AccompanistForm dark onSubmit={(d) => submit('accompanist', d)} ctaLabel={accompCta} />)
                  : <ClientForm dark onSubmit={(d) => submit('client', d)} ctaLabel={clientCta} />
                }
              </>
            )}
          </div>

          {/* Stats */}
          <div className="v3-stats">
            <div className="v3-stat">
              <div className="n">$150<span className="unit"></span></div>
              <div className="lbl">Standard accompanist rate — paid in full, never a cut</div>
            </div>
            <div className="v3-stat">
              <div className="n">24<span className="unit">hrs</span></div>
              <div className="lbl">After the exam, funds release from Stripe escrow</div>
            </div>
            <div className="v3-stat">
              <div className="n">0<span className="unit">%</span></div>
              <div className="lbl">Platform fee taken from the accompanist's rate, ever</div>
            </div>
          </div>
        </div>
      </section>

      {/* Suburb ticker */}
      <div className="v3-ticker">
        <span className="ticker-label">Collecting interest from</span>
        <div className="v3-ticker-track">
          {[...tickerItems, ...tickerItems].map((s, i) => <span key={i}>{s}</span>)}
        </div>
      </div>

      {/* How it works */}
      <section className="v3-how">
        <div className="v3-how-inner">
          <div className="v3-how-head">
            <div className="eyebrow" style={{ marginBottom: 14 }}>How it works</div>
            <h3>Three quiet steps, one confident booking.</h3>
            <p>No phone tag. No cash on the day. No begging your teacher to find someone. Built around how the exam day actually works.</p>
          </div>
          <div className="v3-how-grid">
            <div className="v3-how-step">
              <div className="n">01</div>
              <div>
                <h4>Find</h4>
                <p>Search by exam date, suburb, instrument and grade. Every accompanist is WWCC-verified and rated by past clients.</p>
              </div>
              <div className="tag">For clients</div>
            </div>
            <div className="v3-how-step">
              <div className="n">02</div>
              <div>
                <h4>Book</h4>
                <p>Pay the full amount once — held in Stripe Connect escrow. Programme, rehearsal times and meeting point all locked in.</p>
              </div>
              <div className="tag">Escrow handled</div>
            </div>
            <div className="v3-how-step">
              <div className="n">03</div>
              <div>
                <h4>Perform</h4>
                <p>A what3words meeting point, a tap-to-confirm arrival, and the accompanist's full rate in their account 24 hours later.</p>
              </div>
              <div className="tag">For both sides</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.6)' }}>
          <img src="brand/assets/logo-monogram-white.png" style={{ height: 22 }} alt="" />
          <span style={{ fontWeight: 600 }}>accompany<b style={{ fontWeight: 800 }}>ME</b></span>
        </span>
        <div className="links">
          <a href="#">About</a>
          <a href="#">For accompanists</a>
          <a href="#">For teachers</a>
          <a href="#">Contact</a>
        </div>
        <span>© 2026 accompanyME Pty Ltd · Sydney</span>
      </footer>
    </div>
  );
}

Object.assign(window, { V1Editorial, V2Split, V3Marquee });
