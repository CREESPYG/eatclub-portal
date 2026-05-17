export default function YellowAI() {
  return (
    <div className="page-content">
      <h1 className="page-title">Yellow.ai / tawk.to Reference</h1>
      <p className="page-subtitle">Bot platform overview, agent workspace, and chat resolution guidelines</p>

      {/* DASHBOARD OVERVIEW */}
      <h2 className="section-title">Yellow.ai Cloud Platform</h2>
      <div className="grid-2 mb-32">
        <div className="card">
          <h3 style={{fontWeight:700,color:'var(--md-primary)',marginBottom:12}}>Site Map & Chat Workspace</h3>
          <div className="col-gap-8">
            <div className="card-sm mb-12">
              <div style={{fontSize:12,color:'var(--md-on-surface-var)',marginBottom:4}}>Platform URL</div>
              <a href="https://cloud.yellow.ai/" target="_blank" rel="noopener noreferrer" className="mono" style={{fontSize:13,color:'var(--md-primary)',textDecoration:'none'}}>https://cloud.yellow.ai/</a>
            </div>
            
            <ul style={{fontSize:13,color:'var(--md-on-surface)',paddingLeft:20,marginBottom:12}}>
              <li style={{marginBottom:8}}><strong>Inbox / Engage Module:</strong> This is where all active chats are routed when bot hands off to an agent.</li>
              <li style={{marginBottom:8}}><strong>Left Pane:</strong> Shows active chat queues (My Chats, Unassigned, Resolved).</li>
              <li style={{marginBottom:8}}><strong>Center Pane:</strong> The main chat window where you converse and see the bot history.</li>
              <li><strong>Right Pane:</strong> Displays <strong>Customer Details</strong> (Name, Phone, Order ID#, Tags) extracted from the bot session.</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <h3 style={{fontWeight:700,color:'var(--md-secondary)',marginBottom:12}}>Reference: Resolved Chat</h3>
          <p style={{fontSize:13,color:'var(--md-on-surface-var)',marginBottom:16}}>
            Review this example to understand how a completed interaction looks, how customer details are captured, and how the closing was handled.
          </p>

          <div style={{
            position: 'relative',
            width: '100%',
            height: '400px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid var(--md-outline)',
            background: 'var(--md-surface-2)'
          }}>
            <iframe 
              src="https://cloud.yellow.ai/public/messages/aadad01c99eaebbeb9b4df88d3713dd17516adfc6a074c364582c0eb3d6f2d907b3300d322c5aaeaa4362248d81c762b0153a538ac50739e0dfc8df3032bd3d8f1083959e1e58eb98feb66a1dbe2778a95b3d8e197" 
              width="100%" 
              height="100%" 
              style={{ border: 'none' }}
              title="Resolved Chat Example"
            />
          </div>

          <div className="mt-16 card-sm" style={{background:'rgba(255,143,0,0.1)',borderColor:'rgba(255,143,0,0.3)'}}>
             <div style={{fontSize:12,color:'var(--md-on-surface)'}}>
                <strong>Key Takeaway:</strong> Notice how the chat transitions smoothly from Bot validation to Agent resolution, with final tagging applied.
             </div>
          </div>
        </div>
      </div>

      {/* CANNED RESPONSES & RESOLUTION */}
      <h2 className="section-title">Using Canned Responses & Resolving Queries</h2>
      <div className="grid-2 mb-32">
        <div className="card">
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
            <div className="flow-num" style={{width:28,height:28,fontSize:14}}><span className="material-symbols-outlined" style={{fontSize:16}}>keyboard</span></div>
            <h3 style={{fontWeight:700,color:'var(--md-on-surface)',margin:0}}>Canned Responses (Drilling Replies)</h3>
          </div>
          <p style={{fontSize:12,color:'var(--md-on-surface-var)',marginBottom:16}}>
            Use pre-saved replies to ensure accuracy, professionalism, and fast response times.
          </p>
          <div className="flow-step">
            <div className="flow-num" style={{width:24,height:24,fontSize:12}}>1</div>
            <div className="flow-content"><div className="flow-desc">During a chat, click on the text input box at the bottom.</div></div>
          </div>
          <div className="flow-step">
            <div className="flow-num" style={{width:24,height:24,fontSize:12}}>2</div>
            <div className="flow-content">
              <div className="flow-desc">
                Type the hashtag symbol <strong><code style={{fontSize:14,color:'var(--md-primary)'}}>#</code></strong> to open the Canned Responses menu.
              </div>
            </div>
          </div>
          <div className="flow-step">
            <div className="flow-num" style={{width:24,height:24,fontSize:12}}>3</div>
            <div className="flow-content">
              <div className="flow-desc">
                Start typing keywords from the <strong>Hash Library</strong> to filter responses.
                <div style={{marginTop:8,padding:'8px 12px',background:'var(--md-surface-2)',borderRadius:8,borderLeft:'3px solid var(--md-tertiary)'}}>
                  <div style={{fontSize:11,color:'var(--md-on-surface-var)',marginBottom:4}}>Example:</div>
                  <code style={{color:'var(--md-on-surface)'}}>#Hello</code> → <span style={{color:'var(--md-on-surface-var)'}}>Filters to:</span> "Hello! I am [Name], I need a quick minute..."<br/>
                  <code style={{color:'var(--md-on-surface)',marginTop:4,display:'inline-block'}}>#10 Mins</code> → <span style={{color:'var(--md-on-surface-var)'}}>Filters to delay template</span><br/>
                  <code style={{color:'var(--md-on-surface)',marginTop:4,display:'inline-block'}}>#Refund</code> → <span style={{color:'var(--md-on-surface-var)'}}>Filters to refund initiated message</span><br/>
                  <code style={{color:'var(--md-on-surface)',marginTop:4,display:'inline-block'}}>#Closing Rating</code> → <span style={{color:'var(--md-on-surface-var)'}}>Filters to rating request prior to closing</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flow-step border-none pb-0">
            <div className="flow-num" style={{width:24,height:24,fontSize:12}}>4</div>
            <div className="flow-content">
              <div className="flow-desc">
                Press Enter to select. <strong>Important:</strong> Always customize placeholders like <code>[name]</code> or <code>[time]</code> before sending.
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
            <div className="flow-num" style={{width:28,height:28,fontSize:14,background:'var(--md-tertiary)'}}><span className="material-symbols-outlined" style={{fontSize:16}}>check_circle</span></div>
            <h3 style={{fontWeight:700,color:'var(--md-on-surface)',margin:0}}>Resolving & Closing Chats</h3>
          </div>
          <p style={{fontSize:12,color:'var(--md-on-surface-var)',marginBottom:16}}>
            Steps to successfully conclude an interaction on Yellow.ai platform.
          </p>
          <div className="flow-step">
            <div className="flow-num" style={{width:24,height:24,fontSize:12,background:'var(--md-surface-3)'}}>1</div>
            <div className="flow-content"><div className="flow-desc">Send closing canned response: <code>#3 Closing Rating</code> → wait for reply → <code>#4 Closing Final</code>.</div></div>
          </div>
          <div className="flow-step">
            <div className="flow-num" style={{width:24,height:24,fontSize:12,background:'var(--md-surface-3)'}}>2</div>
            <div className="flow-content"><div className="flow-desc">Locate the <strong>Resolve</strong> button located on the top right area of the chat view.</div></div>
          </div>
          <div className="flow-step border-none pb-0">
            <div className="flow-num" style={{width:24,height:24,fontSize:12,background:'var(--md-surface-3)'}}>3</div>
            <div className="flow-content">
              <div className="flow-desc">
                Select the correct disposition or tag related to the customer's query (e.g., Food Quality, Late Delivery) before confirming resolution to ensure accurate KPI tracking.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHAT EXAMPLE SIMULATION */}
      <h3 className="section-title">Example Live Chat Using Canned Responses</h3>
      <div className="card mb-32" style={{padding:0, overflow:'hidden', border:'1px solid var(--md-outline)'}}>
        <div style={{background:'var(--md-surface-2)', padding:'12px 16px', borderBottom:'1px solid var(--md-outline)', display:'flex', alignItems:'center', gap:12}}>
          <div className="contact-avatar" style={{width:32, height:32, fontSize:16, border:'none', background:'var(--md-primary-container)'}}>👤</div>
          <div>
            <div style={{fontSize:13, fontWeight:600, color:'var(--md-on-surface)'}}>Customer</div>
            <div style={{fontSize:11, color:'var(--md-tertiary)'}}>● Online</div>
          </div>
          <div style={{marginLeft:'auto', display:'flex', gap:8}}>
            <span className="chip chip-orange">Late Delivery</span>
            <span className="chip chip-gray">Id: ODR-8921</span>
          </div>
        </div>
        
        <div style={{padding:'20px', background:'var(--md-surface)', display:'flex', flexDirection:'column', gap:16, height:300, overflowY:'auto'}}>
          <div style={{alignSelf:'flex-start', background:'var(--md-surface-variant)', padding:'10px 14px', borderRadius:'16px 16px 16px 4px', maxWidth:'80%'}}>
            <div style={{fontSize:13, color:'var(--md-on-surface)'}}>My order is 30 mins late and cold!</div>
            <div style={{fontSize:10, color:'var(--md-on-surface-dim)', marginTop:4}}>10:41 AM</div>
          </div>
          
          <div style={{alignSelf:'flex-end', background:'var(--md-primary-container)', color:'var(--md-on-primary-cont)', padding:'10px 14px', borderRadius:'16px 16px 4px 16px', maxWidth:'80%', position:'relative'}}>
            <div style={{position:'absolute', top:-16, right:4, fontSize:10, color:'var(--md-primary)', fontWeight:600}}>Agent (via #Hello Custom)</div>
            <div style={{fontSize:13}}>Hello! I am Arif, I need a quick minute to go through the details you shared.</div>
            <div style={{fontSize:10, color:'rgba(62,11,0,0.6)', marginTop:4, textAlign:'right'}}>10:42 AM</div>
          </div>
          
          <div style={{alignSelf:'flex-end', background:'var(--md-primary-container)', color:'var(--md-on-primary-cont)', padding:'10px 14px', borderRadius:'16px 16px 4px 16px', maxWidth:'80%', position:'relative'}}>
            <div style={{position:'absolute', top:-16, right:4, fontSize:10, color:'var(--md-primary)', fontWeight:600}}>Agent (via #Refund)</div>
            <div style={{fontSize:13}}>I deeply apologize for the delay. We are initiating a Rs.100 Eatclub wallet refund for the inconvenience.</div>
            <div style={{fontSize:10, color:'rgba(62,11,0,0.6)', marginTop:4, textAlign:'right'}}>10:44 AM</div>
          </div>

          <div style={{alignSelf:'flex-start', background:'var(--md-surface-variant)', padding:'10px 14px', borderRadius:'16px 16px 16px 4px', maxWidth:'80%'}}>
            <div style={{fontSize:13, color:'var(--md-on-surface)'}}>Okay, thank you.</div>
            <div style={{fontSize:10, color:'var(--md-on-surface-dim)', marginTop:4}}>10:45 AM</div>
          </div>
          
          <div style={{alignSelf:'flex-end', background:'var(--md-primary-container)', color:'var(--md-on-primary-cont)', padding:'10px 14px', borderRadius:'16px 16px 4px 16px', maxWidth:'80%', position:'relative'}}>
             <div style={{position:'absolute', top:-16, right:4, fontSize:10, color:'var(--md-primary)', fontWeight:600}}>Agent (via #Closing Rating)</div>
             <div style={{fontSize:13}}>As our chat comes to an end, please drop a rating on the chat. Your feedabck is very crucial. Have a good day!</div>
             <div style={{fontSize:10, color:'rgba(62,11,0,0.6)', marginTop:4, textAlign:'right'}}>10:46 AM</div>
          </div>
        </div>
        
        <div style={{padding:'12px 16px', background:'var(--md-surface-2)', borderTop:'1px solid var(--md-outline)', display:'flex', gap:12, alignItems:'center'}}>
          <div style={{flex:1, background:'var(--md-surface-variant)', border:'1px solid var(--md-primary)', borderRadius:24, padding:'8px 16px', fontSize:13, color:'var(--md-primary)', display:'flex', alignItems:'center'}}>
            <span style={{opacity:0.7}}>/</span><span style={{marginLeft:2}}>Closing</span>|
          </div>
          <button className="btn btn-primary" style={{borderRadius:'50%', width:36, height:36, padding:0, justifyContent:'center'}}>
            <span className="material-symbols-outlined" style={{fontSize:18}}>send</span>
          </button>
        </div>
      </div>

      <h2 className="section-title">Bot Handoff Triggers & Legacy Info</h2>
      <div className="grid-2 mb-32">
        <div className="card">
          <h3 style={{fontWeight:700,color:'var(--md-on-surface)',marginBottom:12}}>Common Handoff Conditions</h3>
          <ul style={{fontSize:12,color:'var(--md-on-surface-var)',paddingLeft:20}}>
            <li style={{marginBottom:6}}>Customer says "human", "agent", "representative", "person"</li>
            <li style={{marginBottom:6}}>Complaint about BIG4 (VegNonVeg / InsectFound / ExternalElement / HairFound)</li>
            <li style={{marginBottom:6}}>Order value dispute &gt; ₹500</li>
            <li style={{marginBottom:6}}>Customer escalates 3 consecutive times</li>
            <li>Specific flow paths in bot script reach agent handoff node</li>
          </ul>
        </div>
        <div className="card">
          <h3 style={{fontWeight:700,color:'var(--md-on-surface)',marginBottom:12}}>Legacy Platform (tawk.to)</h3>
          <div className="col-gap-8">
            <div className="card-sm" style={{padding:12}}>
              <div style={{fontSize:11,color:'var(--md-on-surface-dim)'}}>URL</div>
              <div className="mono" style={{fontSize:12}}>dashboard.tawk.to</div>
            </div>
            <div className="card-sm" style={{padding:12}}>
              <div style={{fontSize:11,color:'var(--md-on-surface-dim)'}}>Credentials</div>
              <div className="mono" style={{fontSize:12}}>pooja.box8@gmail.com / Pooja@123</div>
            </div>
          </div>
        </div>
      </div>

      {/* WHATSAPP PROCESS */}
      <h2 className="section-title">WhatsApp Customer Not Reachable Process</h2>
      <div className="card mb-16">
        <div style={{fontSize:12,color:'var(--md-on-surface-var)',marginBottom:12}}>Use Very Critical Assets Deactivation Sheet → Customer-DM Message tab</div>
        {['First row: Enter Customer\'s number','Second row: Enter DM\'s number','WhatsApp link generates → Click to open customer\'s WhatsApp','Copy text from below the link → Paste and send to customer','This notifies customer that DM is waiting at their location'].map((s,i)=>(
          <div key={i} className="flow-step">
            <div className="flow-num">{i+1}</div>
            <div className="flow-content"><div className="flow-desc">{s}</div></div>
          </div>
        ))}
        <div className="mt-16">
          <a href="https://docs.google.com/spreadsheets/d/1InH8gyVW2VImP2LRrmv5XQMAVXX9Z6fIFVYoeftULUU/edit" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            <span className="material-symbols-outlined">open_in_new</span>
            Open Critical Assets Sheet
          </a>
        </div>
      </div>
    </div>
  );
}
