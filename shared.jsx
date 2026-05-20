/* global React */
// accompanyME — shared form components for the coming-soon landing
const { useState, useEffect, useRef, useMemo } = React;

// ---------- Mock postcode → suburb lookup (NSW-leaning) ----------
const POSTCODES = {
  "2000": "Sydney",
  "2007": "Ultimo",
  "2008": "Chippendale",
  "2010": "Surry Hills",
  "2015": "Alexandria",
  "2020": "Mascot",
  "2026": "Bondi",
  "2027": "Darling Point",
  "2031": "Randwick",
  "2034": "Coogee",
  "2037": "Glebe",
  "2040": "Leichhardt",
  "2041": "Balmain",
  "2042": "Newtown",
  "2050": "Camperdown",
  "2065": "St Leonards",
  "2067": "Chatswood",
  "2068": "Willoughby",
  "2070": "Lindfield",
  "2074": "Wahroonga",
  "2088": "Mosman",
  "2089": "Neutral Bay",
  "2090": "Cremorne",
  "2095": "Manly",
  "2099": "Dee Why",
  "2113": "Macquarie Park",
  "2114": "West Ryde",
  "2120": "Pennant Hills",
  "2122": "Eastwood",
  "2126": "Cherrybrook",
  "2134": "Burwood",
  "2135": "Strathfield",
  "2136": "Enfield",
  "2140": "Homebush",
  "2142": "Granville",
  "2150": "Parramatta",
  "2154": "Castle Hill",
  "2155": "Rouse Hill",
  "2170": "Liverpool",
  "2200": "Bankstown",
  "2204": "Marrickville",
  "2206": "Earlwood",
  "2207": "Bexley",
  "2208": "Kingsgrove",
  "2210": "Penshurst",
  "2217": "Kogarah",
  "2218": "Allawah",
  "2219": "Beverley Park",
  "2220": "Hurstville",
  "2223": "Oatley",
  "2226": "Como",
  "2229": "Cronulla",
  "2232": "Miranda",
  "2250": "Gosford",
};

const SUBURB_LIST = Object.entries(POSTCODES).map(([pc, name]) => `${name} ${pc}`).sort();

// ---------- Tiny icon helper (inline SVGs to avoid CDN dependencies in artboards) ----------
function I({ name, size = 16, stroke = 1.75, className = "", style }) {
  const paths = {
    arrow: <path d="M5 12h14M13 5l7 7-7 7" />,
    check: <path d="M5 12.5l4 4 10-10" />,
    spark: <><path d="M12 3v6m0 6v6M3 12h6m6 0h6"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/></>,
    phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2z"/>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    map: <><path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></>,
    coin: <><circle cx="12" cy="12" r="9"/><path d="M9 9h5a2 2 0 0 1 0 4H9m0 0h6a2 2 0 0 1 0 4H9m3-12v14"/></>,
    sparkle: <path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z"/>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/></>,
    close: <><path d="M6 6l12 12M18 6L6 18"/></>,
    music: <><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/><path d="M9 18V6l11-3v13"/></>,
    pin: <path d="M12 2L4 8v8l8 6 8-6V8z"/>,
    flame: <path d="M12 2c1 4 5 5 5 10a5 5 0 1 1-10 0c0-3 2-4 3-6 1 3 2 3 2-4z"/>,
    shield: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

// ---------- Logo (small, sized to context) ----------
function Wordmark({ size = 30, dark = false, className = "" }) {
  return (
    <span className={`wordmark ${dark ? 'wordmark--on-dark' : ''} ${className}`}>
      <img src="brand/assets/logo-monogram.png" alt="" style={{ height: size }} />
      <span>accompany<b>ME</b></span>
    </span>
  );
}

// ---------- Monogram SVG outline (clean, scaleable) — abstract loop shape ----------
// Pure decorative; the actual logo is the PNG above for the wordmark.
function MonogramShape({ size = 200, color = "#0F6E56", opacity = 1, style }) {
  return (
    <img
      src="brand/assets/logo-monogram-alpha.png"
      alt=""
      aria-hidden="true"
      style={{ width: size, height: "auto", opacity, ...style }}
    />
  );
}

// ---------- Postcode field with mocked suburb autofill ----------
function PostcodeField({ value, onChange, dark = false, fullWidth = false }) {
  // value shape: { postcode, suburb, manual }
  const [hint, setHint] = useState("");
  const update = (patch) => onChange({ ...value, ...patch });

  const onPostcode = (raw) => {
    const pc = raw.replace(/\D/g, "").slice(0, 4);
    update({ postcode: pc });
    if (pc.length === 4 && POSTCODES[pc] && !value.manual) {
      update({ postcode: pc, suburb: POSTCODES[pc] });
      setHint(POSTCODES[pc]);
    } else if (pc.length === 4 && !POSTCODES[pc]) {
      setHint("");
      if (!value.manual) update({ postcode: pc, suburb: "" });
    } else {
      setHint("");
    }
  };

  return (
    <div className={`field-block ${fullWidth ? 'field-block--full' : ''}`}>
      <label>Suburb &amp; postcode *</label>
      <div className="field-suburb-pair">
        <div className="field">
          <I name="pin" size={15} style={{ color: 'var(--am-ink-500)' }} />
          <input
            type="text"
            inputMode="numeric"
            placeholder="2000"
            value={value.postcode}
            onChange={(e) => onPostcode(e.target.value)}
            aria-label="Postcode"
            required
            pattern="\d{4}"
            title="Please enter a 4-digit Australian postcode"
          />
        </div>
        <div className="field">
          <input
            type="text"
            placeholder="Suburb"
            value={value.suburb}
            onChange={(e) => update({ suburb: e.target.value, manual: true })}
            aria-label="Suburb"
            required
          />
        </div>
      </div>
      {hint ? (
        <span className="suburb-hint on">
          <span className="tick">✓</span> Matched <strong style={{ color: dark ? '#9FE1CB' : 'var(--am-green-700)', marginLeft: 2 }}>{hint}, NSW</strong>
        </span>
      ) : null}
    </div>
  );
}

// ---------- Field primitives ----------
function TextField({ label, name, type = "text", placeholder, value, onChange, icon, required }) {
  return (
    <div className="field-block">
      <label htmlFor={name}>{label}{required && ' *'}</label>
      <div className="field">
        {icon && <I name={icon} size={15} style={{ color: 'var(--am-ink-500)' }} />}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      </div>
    </div>
  );
}

function MoneyField({ label, name, value, onChange, placeholder = "150" }) {
  return (
    <div className="field-block">
      <label htmlFor={name}>{label}</label>
      <div className="field">
        <span className="prefix">A$</span>
        <input
          id={name}
          name={name}
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ''))}
        />
        <span className="prefix" style={{ fontSize: 12 }}>per booking</span>
      </div>
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div className="field-block">
      <label htmlFor={name}>{label}</label>
      <div className="field">
        <select id={name} name={name} value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}

function RadioChips({ label, value, onChange, options }) {
  return (
    <div className="field-block">
      <label>{label}</label>
      <div className="radio-row">
        {options.map(o => (
          <button
            key={o.value}
            type="button"
            className={`radio-chip ${value === o.value ? 'on' : ''}`}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Accompanist form ----------
function AccompanistForm({ onSubmit, ctaLabel = "Join the founding cohort", compact = false, dark = false }) {
  const [data, setData] = useState({
    name: "", email: "", mobile: "",
    location: { postcode: "", suburb: "", manual: false },
    heard: "",
  });
  const set = (patch) => setData(d => ({ ...d, ...patch }));

  return (
    <form className="form" onSubmit={(e) => { e.preventDefault(); onSubmit(data); }}>
      <div className="form-row">
        <TextField label="Your name" name="ac-name" placeholder="Margaret Chen"
          icon="user" value={data.name} onChange={v => set({ name: v })} required />
        <TextField label="Email" name="ac-email" type="email" placeholder="margaret@example.com"
          icon="mail" value={data.email} onChange={v => set({ email: v })} required />
      </div>
      <div className="form-row">
        <TextField label="Mobile" name="ac-mob" type="tel" placeholder="0412 345 678"
          icon="phone" value={data.mobile} onChange={v => set({ mobile: v })} required />
        <SelectField label="How did you hear about us?" name="ac-heard"
          value={data.heard} onChange={v => set({ heard: v })}
          options={[
            { value: "", label: "Select an option" },
            { value: "teacher", label: "From a music teacher" },
            { value: "studio", label: "From a fellow accompanist" },
            { value: "conservatorium", label: "Conservatorium / AMEB" },
            { value: "social", label: "Social media" },
            { value: "search", label: "Google search" },
            { value: "other", label: "Other" },
          ]} />
      </div>
      <PostcodeField dark={dark} fullWidth value={data.location} onChange={loc => set({ location: loc })} />
      <div className="form-foot">
        <p className="form-disclaimer">
          You'll never pay a platform fee. We'll send your founding-cohort invite as soon as NSW opens.
        </p>
        <button type="submit" className="btn btn-primary btn-lg">
          {ctaLabel} <I name="arrow" size={16} className="arr" />
        </button>
      </div>
    </form>
  );
}

// ---------- Client form ----------
function ClientForm({ onSubmit, ctaLabel = "Notify me at launch", compact = false, dark = false }) {
  const [data, setData] = useState({
    name: "", email: "",
    location: { postcode: "", suburb: "", manual: false },
    bookingFor: "child",
  });
  const set = (patch) => setData(d => ({ ...d, ...patch }));

  return (
    <form className="form" onSubmit={(e) => { e.preventDefault(); onSubmit(data); }}>
      <div className="form-row">
        <TextField label="Your name" name="cl-name" placeholder="Sam Patel"
          icon="user" value={data.name} onChange={v => set({ name: v })} required />
        <TextField label="Email" name="cl-email" type="email" placeholder="sam@example.com"
          icon="mail" value={data.email} onChange={v => set({ email: v })} required />
      </div>
      <PostcodeField dark={dark} fullWidth value={data.location} onChange={loc => set({ location: loc })} />
      <RadioChips
        label="Who are you booking for?"
        value={data.bookingFor}
        onChange={v => set({ bookingFor: v })}
        options={[
          { value: "myself", label: "Myself" },
          { value: "child", label: "My child" },
          { value: "student", label: "My student" },
        ]}
      />
      <div className="form-foot">
        <p className="form-disclaimer">
          One email when we open in your suburb. Unsubscribe anytime. We never share your details.
        </p>
        <button type="submit" className="btn btn-primary btn-lg">
          {ctaLabel} <I name="arrow" size={16} className="arr" />
        </button>
      </div>
    </form>
  );
}

// ---------- Success state ----------
function SuccessPanel({ kind, data, onReset }) {
  const isAccomp = kind === "accompanist";
  const firstName = (data && data.name) ? data.name.split(' ')[0] : "there";
  return (
    <div className="success">
      <div className="success-disc">
        <I name="check" size={28} stroke={2.4} />
      </div>
      <div>
        <h3>
          {isAccomp
            ? `You're on the list, ${firstName}.`
            : `Thanks ${firstName} — we'll be in touch.`}
        </h3>
        <p style={{ marginTop: 10 }}>
          {isAccomp
            ? "We'll review your details and invite you to verification (WWCC + a short call) ahead of launch."
            : `We'll email the moment accompanyME opens for bookings in ${(data && data.location && data.location.suburb) || 'your suburb'}.`}
        </p>
      </div>
      <ul>
        {isAccomp ? (
          <>
            <li>Founding-cohort accompanists are listed first in search and keep their position for the first six months.</li>
            <li>You'll always be paid your full rate the day after each exam — never any platform fee.</li>
            <li>Watch your inbox for next steps within 2 business days.</li>
          </>
        ) : (
          <>
            <li>NSW launches mid-2026 in time for the AMEB October–November exam season.</li>
            <li>You'll get one email when we open — and a 7-day head-start on bookings.</li>
            <li>Forward to a friend who's chasing an accompanist this season.</li>
          </>
        )}
      </ul>
      {onReset && (
        <button type="button" className="btn btn-ghost btn-sm" onClick={onReset} style={{ marginTop: 4 }}>
          Add another
        </button>
      )}
    </div>
  );
}

Object.assign(window, {
  I, Wordmark, MonogramShape,
  PostcodeField, TextField, MoneyField, SelectField, RadioChips,
  AccompanistForm, ClientForm, SuccessPanel,
  POSTCODES, SUBURB_LIST,
});
