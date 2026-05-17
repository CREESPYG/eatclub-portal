export default function Ratings({ navigate }) {
  return (
    <div className="flex-1 p-6 md:p-8 animate-[fadeIn_0.18s_ease]">
      <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Rating Logic Guide</h1>
      <p className="text-base text-on-surface-var mb-8 leading-relaxed">Complete rating rules for food and experience scores</p>

      <div className="flex items-start gap-3 p-4 bg-primary/8 rounded-2xl border border-primary/20 mb-5 animate-[gravityDrop_0.4s_ease_both]">
        <span className="material-symbols-outlined text-primary flex-shrink-0">new_releases</span>
        <div className="flex-1">
          <strong className="text-sm">Rating rules updated — Refund Master Sheet</strong>
          <div className="text-xs text-on-surface-var mt-1">3★/4★ nahi deni · CX 2/3/4★ di → Agent 1★ · Last 2 refunds → Fake</div>
        </div>
        {navigate && (
          <button className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity" onClick={() => navigate('refunds-master')}>View →</button>
        )}
      </div>

      <div className="flex gap-2.5 items-start p-3.5 bg-error/10 text-error rounded-xl border border-error/30 mb-8 text-sm">
        <span className="material-symbols-outlined flex-shrink-0">error</span>
        <span><strong>GOLDEN RULE — MEMORIZE THIS:</strong> NEVER INCREASE RATING above what customer gave. You can DECREASE or MATCH — but NEVER INCREASE. Customer gave 3★ → You can give 1★, 2★, or 3★ — never 4★ or 5★.</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="bg-surface-variant rounded-2xl p-5 border border-outline animate-[gravityDrop_0.3s_ease_both]">
          <h3 className="text-sm font-bold text-primary mb-4">⚠️ Blank Feedback Rules</h3>
          <div className="text-sm font-semibold mb-3">IF FOOD ISSUE (blank feedback):</div>
          <div className="p-2.5 bg-success/8 rounded-lg mb-2 text-sm text-tertiary border-l-[3px] border-tertiary">High intensity complaint → 1★ Food</div>
          <div className="p-2.5 bg-surface-2 rounded-lg mb-2 text-sm text-on-surface border-l-[3px] border-outline">Low intensity complaint → 3★ Food</div>
          <div className="p-2.5 bg-success/8 rounded-lg mb-4 text-sm text-tertiary border-l-[3px] border-tertiary">No food issue → 5★ Food</div>
          <div className="text-sm font-semibold mb-3">IF EXPERIENCE ISSUE (blank feedback):</div>
          <div className="p-2.5 bg-error/8 rounded-lg mb-2 text-sm text-error border-l-[3px] border-error">Experience issue exists → 1★ Experience</div>
          <div className="p-2.5 bg-success/8 rounded-lg text-sm text-tertiary border-l-[3px] border-tertiary">No experience issue → 5★ Experience</div>
          <div className="p-2.5 bg-secondary/8 rounded-lg mt-4 text-sm text-on-surface border-l-[3px] border-secondary">Default (no issues at all): 5★ Food + 5★ Experience</div>
        </div>
        <div className="bg-surface-variant rounded-2xl p-5 border border-outline animate-[gravityDrop_0.3s_ease_both]">
          <h3 className="text-sm font-bold text-error mb-3">BIG4 + BadHandling → ALWAYS 1★ Food + 1★ Experience</h3>
          {['VegNonVeg [Maker1000+Manager1000]','InsectFound [Maker1000]','ExternalElement [Maker1000]','HairFound [Maker300]','BadHandling [DM250]'].map(t=>(
            <div key={t} className="p-2.5 bg-error/8 rounded-lg mb-2 text-sm text-error border-l-[3px] border-error">{t}</div>
          ))}
        </div>
      </div>

      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">1★ Food Triggers <span className="flex-1 h-px bg-outline" /></h2>
      <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-6 animate-[gravityDrop_0.3s_ease_both]">
        <p className="text-xs text-on-surface-var mb-3">Any of these food tags → AUTOMATICALLY 1★ Food rating:</p>
        <div className="flex flex-wrap gap-2">
          {['Paratha [Maker300]','MealRice [Maker300]','PanTossedBase [Maker300]','ThinCrustBase [Maker300]','SGBS_GBS [Maker300]','Wrap [Maker300]','ChocoLava [Maker300]','Stale [Maker300]','WrongProductMade [Maker300]','Add-on/Ingredient_Missing [Maker300]','PizzaSaver_Cutting [Maker300]','Surely_Maker_Mistake [Maker300]','ColdFood [Manager400]','Stone/Bone/Masala [Kitchen]','Salty/Spicy_Gravy [Kitchen]','Cold Itminaan [Maker300]','IceCreamComplaint','Not Fresh [Maker] — HIGH intensity only'].map(t=>(
            <span key={t} className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-primary/15 text-primary">{t}</span>
          ))}
        </div>
      </div>

      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">1★ Experience — DM Fault Triggers <span className="flex-1 h-px bg-outline" /></h2>
      <div className="bg-surface-variant rounded-2xl p-5 border border-outline mb-6 animate-[gravityDrop_0.3s_ease_both]">
        <div className="flex flex-wrap gap-2">
          {['EarlyAssigning [DM250] (dispatched state)','ProductMissing [DM250]','CutlerySeasoningMissing [DM250]','BadHandling [DM250]','FreebieMissing [DM250]','DM_RudeBehavior [DM250]','DM_WrongProductDelivered [DM250]','General_OrderLate_50+ (DISPATCHED state)','General_OrderLate_60+ (DISPATCHED state)'].map(t=>(
            <span key={t} className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-500/15 text-[#2196F3]">{t}</span>
          ))}
        </div>
      </div>

      <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2.5">3★ Experience — Outlet Fault Triggers <span className="flex-1 h-px bg-outline" /></h2>
      <div className="bg-surface-variant rounded-2xl p-5 border border-outline animate-[gravityDrop_0.3s_ease_both]">
        <div className="flex flex-wrap gap-2">
          {['General_OrderLate_50+ (PREPARED state)','General_OrderLate_60+ (PREPARED state)','General_Order_Out_of_Stock','General_StickerMismatch','TC_Tech Error','Outlet_RudeBehavior [Manager400]','General_OtherServiceIssues'].map(t=>(
            <span key={t} className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-warning/15 text-warning">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
