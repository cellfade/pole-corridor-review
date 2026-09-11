import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Box,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Expand,
  Flag,
  Focus,
  Hexagon,
  Image,
  Info,
  Map as MapIcon,
  Maximize,
  Mouse,
  Ruler,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { PoleScene } from "./PoleScene.jsx";

const POLES = [
  { id: "101", distance: "315 ft", status: "reviewed", owner: "Rocky Mountain Power" },
  { id: "102", distance: "287 ft", status: "reviewed", owner: "Rocky Mountain Power" },
  { id: "103", distance: "324 ft", status: "suggested", owner: "CenturyLink" },
  { id: "104", distance: "301 ft", status: "active", owner: "COMMUNICATION > CATV" },
  { id: "105", distance: "290 ft", status: "unreviewed", owner: "Rocky Mountain Power" },
  { id: "106", distance: "276 ft", status: "unreviewed", owner: "Xcel Energy" },
];

const ACTIONS = [
  { id: "inspect", label: "Inspect", Icon: Search },
  { id: "measure", label: "Measure", Icon: Ruler },
  { id: "source", label: "Source", Icon: Image },
  { id: "accept", label: "Accept", Icon: Check },
  { id: "flag", label: "Flag", Icon: Flag },
];

function IKELogo() {
  return (
    <span className="ike-logo" aria-hidden="true">
      <Hexagon size={24} strokeWidth={2.4} />
      <span />
    </span>
  );
}

function TopBar({ mode, setMode, reviewedCount }) {
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <IKELogo />
        <span className="brand-name">IKE Office</span>
        <span className="brand-separator" />
        <span className="product-name">Pole Corridor Review</span>
      </div>

      <div className="location-context">
        <MapIcon size={15} />
        <span>Lehi, UT</span>
        <span className="context-separator">/</span>
        <span>Maple St Corridor</span>
      </div>

      <div className="top-actions">
        <div className="mode-switch" aria-label="Spatial view">
          {[
            ["map", "Map"],
            ["satellite", "Satellite"],
            ["3d", "3D"],
          ].map(([value, label]) => (
            <button
              className={mode === value ? "active" : ""}
              key={value}
              onClick={() => setMode(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="review-progress" title={`${reviewedCount} of ${POLES.length} poles reviewed`}>
          <span>{reviewedCount}/{POLES.length}</span>
          <span className="progress-track"><span style={{ width: `${(reviewedCount / POLES.length) * 100}%` }} /></span>
        </div>
        <button className="icon-button top-icon" type="button" title="Help" aria-label="Help">
          <CircleHelp size={18} />
        </button>
        <span className="avatar" aria-label="Signed in as JD">JD</span>
      </div>
    </header>
  );
}

function PoleRail({ activeIndex, setActiveIndex, statuses }) {
  return (
    <aside className="pole-rail" aria-label="Corridor poles">
      <div className="rail-heading">
        <strong>Corridor</strong>
        <span>6 poles</span>
      </div>
      <div className="pole-route">
        {POLES.map((pole, index) => {
          const isActive = index === activeIndex;
          const status = statuses[pole.id] || pole.status;
          return (
            <button
              className={`pole-row ${isActive ? "active" : ""}`}
              key={pole.id}
              onClick={() => setActiveIndex(index)}
              type="button"
              aria-current={isActive ? "true" : undefined}
            >
              <span className={`route-node ${status}`} />
              <span className="pole-thumb" style={{ backgroundPosition: `${38 + index * 2}% 45%` }} />
              <span className="pole-copy">
                <strong>{pole.id}</strong>
                <span>{isActive ? "Selected" : pole.distance}</span>
              </span>
              {status === "reviewed" && <Check className="row-check" size={14} />}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function Inspector({ activePole, status, onAccept, onFlag, onClose }) {
  const accepted = status === "reviewed";
  const flagged = status === "flagged";

  return (
    <aside className="inspector" aria-label="Selected attachment details">
      <div className="inspector-head">
        <div>
          <span className="eyebrow">Pole {activePole.id}</span>
          <h2>Attachment {activePole.id}-3</h2>
        </div>
        <button className="icon-button" type="button" onClick={onClose} title="Close inspector" aria-label="Close inspector">
          <X size={19} />
        </button>
      </div>

      <div className={`ai-status ${accepted ? "accepted" : flagged ? "flagged" : ""}`}>
        {accepted ? <Check size={14} /> : flagged ? <Flag size={14} /> : <Sparkles size={14} />}
        <span>{accepted ? "Accepted measurement" : flagged ? "Issue flagged" : "AI measurement"}</span>
        {!flagged && <strong>92% confidence</strong>}
      </div>

      <div className="evidence-image" role="img" aria-label="Source photograph of selected pole attachment">
        <span>IKEphoto · 03</span>
        <button className="icon-button evidence-expand" type="button" title="Open source image" aria-label="Open source image">
          <Maximize size={16} />
        </button>
      </div>

      <section className="details-section">
        <div className="section-title">
          <h3>Asset details</h3>
          <Info size={14} />
        </div>
        <dl>
          <div><dt>Type</dt><dd>Fiber splice enclosure</dd></div>
          <div><dt>Manufacturer</dt><dd>CommScope</dd></div>
          <div><dt>Model</dt><dd>FOSC 450</dd></div>
          <div><dt>Owner</dt><dd>{activePole.owner}</dd></div>
        </dl>
      </section>

      <section className="details-section">
        <div className="section-title">
          <h3>Position</h3>
          <Info size={14} />
        </div>
        <dl>
          <div><dt>Height (AGL)</dt><dd>16.8 ft</dd></div>
          <div><dt>Latitude</dt><dd>39.9807391</dd></div>
          <div><dt>Longitude</dt><dd>-105.133978</dd></div>
          <div><dt>Elevation</dt><dd>1620.6 ft</dd></div>
        </dl>
      </section>

      <section className="details-section measurement-section">
        <div className="section-title">
          <h3>AI measurements</h3>
          <Info size={14} />
        </div>
        <dl>
          <div><dt>Enclosure length</dt><dd>25.0 in <em>±0.5 in</em></dd></div>
          <div><dt>Diameter</dt><dd>6.5 in <em>±0.3 in</em></dd></div>
        </dl>
      </section>

      <section className="details-section sources-section">
        <div className="section-title"><h3>Source evidence</h3></div>
        <div className="source-strip">
          {[0, 1, 2].map((item) => (
            <button className={item === 0 ? "active" : ""} type="button" key={item} aria-label={`View source ${item + 1}`}>
              <span style={{ backgroundPosition: `${52 + item * 6}% ${30 + item * 18}%` }} />
            </button>
          ))}
          <button className="source-next" type="button" title="More sources" aria-label="More sources"><ChevronRight size={18} /></button>
        </div>
      </section>

      <div className="inspector-actions">
        <button className={`primary-action ${accepted ? "accepted" : ""}`} type="button" onClick={onAccept}>
          <Check size={18} /> {accepted ? "Measurement accepted" : "Accept measurement"}
        </button>
        <div className="secondary-actions">
          <button type="button"><Image size={17} /> View source</button>
          <button className={flagged ? "is-flagged" : ""} type="button" onClick={onFlag}><Flag size={17} /> {flagged ? "Flagged" : "Flag issue"}</button>
        </div>
      </div>
    </aside>
  );
}

function SceneControls({ onReset, onFullscreen }) {
  return (
    <div className="scene-controls" aria-label="3D view controls">
      <button type="button" title="Frame selected asset" aria-label="Frame selected asset" onClick={onReset}><Focus size={18} /></button>
      <button type="button" title="Reset view" aria-label="Reset view" onClick={onReset}><Box size={18} /></button>
      <button type="button" title="Full screen" aria-label="Full screen" onClick={onFullscreen}><Expand size={18} /></button>
    </div>
  );
}

function MapSurface({ activeIndex, setActiveIndex, mode, onEnter3D }) {
  return (
    <div className={`map-surface ${mode}`}>
      <img src="/assets/ike-office-map-detail.png" alt="Map of Maple Street utility corridor" />
      <div className="map-wash" />
      <div className="map-route" aria-label="Corridor pole locations">
        {POLES.map((pole, index) => (
          <button
            key={pole.id}
            className={activeIndex === index ? "active" : ""}
            style={{ left: `${19 + index * 12.4}%`, top: `${64 - index * 7.8}%` }}
            type="button"
            onClick={() => setActiveIndex(index)}
            onDoubleClick={onEnter3D}
            aria-label={`Select pole ${pole.id}`}
          >
            <span>{pole.id}</span>
          </button>
        ))}
      </div>
      <div className="map-callout">
        <span className="callout-icon"><Box size={20} /></span>
        <div><strong>Pole {POLES[activeIndex].id}</strong><span>Double-click to enter 3D</span></div>
        <button type="button" onClick={onEnter3D}>Open 3D <ArrowRight size={16} /></button>
      </div>
    </div>
  );
}

function BottomNavigator({ activeIndex, setActiveIndex }) {
  const previous = POLES[Math.max(0, activeIndex - 1)];
  const next = POLES[Math.min(POLES.length - 1, activeIndex + 1)];
  return (
    <nav className="bottom-nav" aria-label="Move through corridor">
      <button type="button" onClick={() => setActiveIndex((value) => Math.max(0, value - 1))} disabled={activeIndex === 0}>
        <ChevronLeft size={19} />
        <span><small>Previous</small><strong>Pole {previous.id}</strong></span>
      </button>
      <span className="nav-divider" />
      <button type="button" onClick={() => setActiveIndex((value) => Math.min(POLES.length - 1, value + 1))} disabled={activeIndex === POLES.length - 1}>
        <span><small>Next</small><strong>Pole {next.id}</strong></span>
        <ChevronRight size={19} />
      </button>
    </nav>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return <div className="toast" role="status"><Check size={16} /> {message}</div>;
}

export function App() {
  const [mode, setMode] = useState("3d");
  const [activeIndex, setActiveIndex] = useState(3);
  const [menuOpen, setMenuOpen] = useState(true);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [activeAction, setActiveAction] = useState("inspect");
  const [statuses, setStatuses] = useState({ 101: "reviewed", 102: "reviewed" });
  const [resetToken, setResetToken] = useState(0);
  const [toast, setToast] = useState("");

  const activePole = POLES[activeIndex];
  const status = statuses[activePole.id] || activePole.status;
  const reviewedCount = useMemo(
    () => POLES.filter((pole) => (statuses[pole.id] || pole.status) === "reviewed").length,
    [statuses],
  );

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
      if (event.key === "ArrowRight") setActiveIndex((value) => Math.min(POLES.length - 1, value + 1));
      if (event.key === "ArrowLeft") setActiveIndex((value) => Math.max(0, value - 1));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleAction = useCallback((action) => {
    setActiveAction(action);
    setInspectorOpen(true);
    if (action === "accept") {
      setStatuses((current) => ({ ...current, [activePole.id]: "reviewed" }));
      setToast(`Pole ${activePole.id} measurement accepted`);
      setMenuOpen(false);
    }
    if (action === "flag") {
      setStatuses((current) => ({ ...current, [activePole.id]: "flagged" }));
      setToast(`Issue flagged on pole ${activePole.id}`);
      setMenuOpen(false);
    }
  }, [activePole.id]);

  return (
    <div className="app-shell">
      <TopBar mode={mode} setMode={setMode} reviewedCount={reviewedCount} />
      <div className={`workspace ${inspectorOpen ? "inspector-visible" : ""}`}>
        <PoleRail activeIndex={activeIndex} setActiveIndex={setActiveIndex} statuses={statuses} />
        <main className="spatial-stage">
          {mode === "3d" ? (
            <>
              <PoleScene
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                activeAction={activeAction}
                onAction={handleAction}
                actions={ACTIONS}
                resetToken={resetToken}
                status={status}
              />
              <div className="orientation-compass" aria-hidden="true"><strong>N</strong><span /></div>
              <SceneControls
                onReset={() => setResetToken((value) => value + 1)}
                onFullscreen={() => document.querySelector(".spatial-stage")?.requestFullscreen?.()}
              />
              <div className="gesture-help">
                <Mouse size={18} />
                <span><strong>Drag</strong> to orbit<br /><strong>Scroll</strong> to zoom<br /><strong>Click vertex</strong> for actions</span>
              </div>
              <div className="mini-map">
                <img src="/assets/ike-office-map-detail.png" alt="Corridor overview map" />
                <span className="mini-route" />
                <span className="mini-active" style={{ top: `${70 - activeIndex * 8}%` }} />
                <button type="button" title="Open map" aria-label="Open map" onClick={() => setMode("map")}><Expand size={14} /></button>
              </div>
            </>
          ) : (
            <MapSurface activeIndex={activeIndex} setActiveIndex={setActiveIndex} mode={mode} onEnter3D={() => setMode("3d")} />
          )}
          <BottomNavigator activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          <Toast message={toast} />
        </main>
        {inspectorOpen && (
          <Inspector
            activePole={activePole}
            status={status}
            onAccept={() => handleAction("accept")}
            onFlag={() => handleAction("flag")}
            onClose={() => setInspectorOpen(false)}
          />
        )}
        {!inspectorOpen && (
          <button className="reopen-inspector" type="button" onClick={() => setInspectorOpen(true)}>
            <Info size={17} /> Details
          </button>
        )}
      </div>
    </div>
  );
}
