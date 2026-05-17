export default function Ratings({ navigate }) {
  return (
    <div className="page-content">
      <h1 className="page-title">Rating Logic Guide</h1>
      <p className="page-subtitle">Complete rating rules for food and experience scores</p>

      <div className="rm-xref-banner" style={{ animation: 'gravityDrop .4s ease both', marginBottom: 20 }}>
        <span className="material-symbols-outlined">new_releases</span>
        <div>
          <strong>Rating rules updated — Refund Master Sheet</strong>
          <div style={{ fontSize: 11, marginTop: 4, color: 'var(--md-on-surface-var)' }}>
            3★/4★ nahi deni · CX 2/3/4★ di → Agent 1★ · Last 2 refunds → Fake
          </div>
        </div>
        {navigate && <button className="btn rm-xref-btn" onClick={() => navigate('refunds-master')}>View →</button>}
      </div>

      <div className="alert alert-error mb-24">
        <span className="alert-icon">error</span>
        <div><strong>GOLDEN RULE — MEMORIZE THIS:</strong> NEVER INCREASE RATING above what customer gave. You can DECREASE or MATCH — but NEVER INCREASE. Customer gave 3★ → You can give 1★, 2★, or 3★ — never 4★ or 5★.</div>
      </div>

      <div className="grid-2 mb-32">
        <div className="card">
          <h3 style={{fontWeight:700,color:'var(--md-primary)',marginBottom:16}}>⚠️ Blank Feedback Rules</h3>
          <div style={{fontWeight:600,marginBottom:12,fontSize:13}}>IF FOOD ISSUE (blank feedback):</div>
          <div className="dt-node yes mb-8">High intensity complaint → 1★ Food</div>
          <div className="dt-node mb-8">Low intensity complaint → 3★ Food</div>
          <div className="dt-node yes mb-16">No food issue → 5★ Food</div>
          <div style={{fontWeight:600,marginBottom:12,fontSize:13}}>IF EXPERIENCE ISSUE (blank feedback):</div>
          <div className="dt-node no mb-8">Experience issue exists → 1★ Experience</div>
          <div className="dt-node yes">No experience issue → 5★ Experience</div>
          <div className="dt-node action" style={{marginTop:16}}>Default (no issues at all): 5★ Food + 5★ Experience</div>
        </div>
        <div className="card">
          <h3 style={{fontWeight:700,color:'var(--md-error)',marginBottom:12}}>BIG4 + BadHandling → ALWAYS 1★ Food + 1★ Experience</h3>
          {['VegNonVeg [Maker1000+Manager1000]','InsectFound [Maker1000]','ExternalElement [Maker1000]','HairFound [Maker300]','BadHandling [DM250]'].map(t=>(
            <div key={t} className="dt-node no" style={{marginBottom:8}}>{t}</div>
          ))}
        </div>
      </div>

      <h2 className="section-title">1★ Food Triggers</h2>
      <div className="card mb-24">
        <p style={{fontSize:12,color:'var(--md-on-surface-var)',marginBottom:12}}>Any of these food tags → AUTOMATICALLY 1★ Food rating:</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
          {['Paratha [Maker300]','MealRice [Maker300]','PanTossedBase [Maker300]','ThinCrustBase [Maker300]','SGBS_GBS [Maker300]','Wrap [Maker300]','ChocoLava [Maker300]','Stale [Maker300]','WrongProductMade [Maker300]','Add-on/Ingredient_Missing [Maker300]','PizzaSaver_Cutting [Maker300]','Surely_Maker_Mistake [Maker300]','ColdFood [Manager400]','Stone/Bone/Masala [Kitchen]','Salty/Spicy_Gravy [Kitchen]','Cold Itminaan [Maker300]','IceCreamComplaint','Not Fresh [Maker] — HIGH intensity only'].map(t=>(
            <span key={t} className="chip chip-primary" style={{fontSize:11}}>{t}</span>
          ))}
        </div>
      </div>

      <h2 className="section-title">1★ Experience — DM Fault Triggers</h2>
      <div className="card mb-24">
        <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
          {['EarlyAssigning [DM250] (dispatched state)','ProductMissing [DM250]','CutlerySeasoningMissing [DM250]','BadHandling [DM250]','FreebieMissing [DM250]','DM_RudeBehavior [DM250]','DM_WrongProductDelivered [DM250]','General_OrderLate_50+ (DISPATCHED state)','General_OrderLate_60+ (DISPATCHED state)'].map(t=>(
            <span key={t} className="chip chip-blue" style={{fontSize:11}}>{t}</span>
          ))}
        </div>
      </div>

      <h2 className="section-title">3★ Experience — Outlet Fault Triggers</h2>
      <div className="card">
        <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
          {['General_OrderLate_50+ (PREPARED state)','General_OrderLate_60+ (PREPARED state)','General_Order_Out_of_Stock','General_StickerMismatch','TC_Tech Error','Outlet_RudeBehavior [Manager400]','General_OtherServiceIssues'].map(t=>(
            <span key={t} className="chip chip-orange" style={{fontSize:11}}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
