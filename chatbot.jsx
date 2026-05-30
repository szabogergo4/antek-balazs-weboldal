/* global React */
/* AI Chatbot — Horváth Milán Pénzügyi Tanácsadó
   Illeszkedik az oldal dark/editorial designjához.
   Anthropic API-t használ, Claude-on keresztül.
   Beépítés: <script type="text/babel" src="chatbot.jsx?v=1"></script>
             és az app.jsx-ben: <window.AIChatbot/>
*/

(function () {

  // ── Rendszer prompt — Milán "személyiségét" és tudását definiálja ──────────
  const SYSTEM_PROMPT = `Te Horváth Milán pénzügyi tanácsadó weboldalának AI asszisztense vagy.
Segítesz az érdeklődőknek megérteni az Allianz Bónusz Életprogramot és Milán szolgáltatásait.

FONTOS SZABÁLYOK:
- Mindig udvariasan, de közvetlenül kommunikálj — tegező forma az oldal stílusához illik
- Soha ne adj konkrét pénzügyi tanácsot, ajánlattételt, vagy pontos hozamgaranciát
- Ha konkrét kérdés merül fel ami személyes tanácsadást igényel, mindig ajánld fel hogy Milánnal egyeztessen
- Rövid, lényegre törő válaszokat adj — max 3-4 mondat
- Magyarul válaszolj mindig

AMIT TUDSZ A TERMÉKRŐL:
- Allianz Bónusz Életprogram: unit-linked életbiztosítási megtakarítás
- Minimum futamidő: 10 év
- Kamatadó- és szochó-mentes hozam a futamidő végén (törvényi kedvezmény)
- Hűségbónusz a futamidő végén
- Ingyenes baleseti biztosítás jár mellé
- Rugalmas feltételek: szüneteltethető, részösszeg kivehető
- Átlagos hozam: 7,2% évente (nem garantált, eszközalapoktól függ)
- Havi minimum befizetés: 10 000 Ft
- Adminisztrációs díj: 990 Ft/hó (3. évtől)
- Alapkezelési díj: 1,19%/év
- Elérhetőség: Debrecen és Budapest, személyesen
- Email: milan.horvath@allianztanacsado.hu
- Az első konzultáció díjmentes és kötelezettségmentes

Ha valaki időpontot szeretne foglalni vagy személyesen érdeklődne, küldd a Kapcsolat szekcióhoz (#kapcsolat).`;

  // ── Üdvözlő üzenet ────────────────────────────────────────────────────────
  const WELCOME = "Szia! Horváth Milán asszisztense vagyok. Segíthetek bármilyen kérdésben a Bónusz Életprogrammal vagy a megtakarítási lehetőségekkel kapcsolatban. Miben segíthetek?";

  // ── Gyors kérdések ────────────────────────────────────────────────────────
  const QUICK_QUESTIONS = [
    "Miben különbözik a bankbetéttől?",
    "Mennyi a minimum befizetés?",
    "Kamatadót kell fizetni?",
    "Hogyan foglalhatok időpontot?",
  ];

  // ── API hívás a saját proxyn keresztül ───────────────────────────────────
  async function callClaude(messages) {
    let res;
    try {
      res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: messages,
        }),
      });
    } catch (networkErr) {
      throw new Error("Hálózati hiba: a szerver nem érhető el. Győződj meg róla, hogy a szerver fut (node server.js).");
    }
    if (!res.ok) {
      let detail = "";
      try {
        const d = await res.json();
        if (d.error && d.error.message) detail = d.error.message;
        else if (typeof d.error === "string") detail = d.error;
        else detail = JSON.stringify(d);
      } catch {}
      throw new Error("API hiba " + res.status + (detail ? ": " + detail : ""));
    }
    const data = await res.json();
    return data.content?.[0]?.text || "Sajnálom, nem tudtam feldolgozni a kérdést.";
  }

  // ── Küldés ikon ───────────────────────────────────────────────────────────
  function SendIcon() {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4 20-7z"/>
        <path d="M22 2 11 13"/>
      </svg>
    );
  }

  function CloseIcon() {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18M6 6l12 12"/>
      </svg>
    );
  }

  function ChatIcon() {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    );
  }

  // ── Gépelő animáció ───────────────────────────────────────────────────────
  function TypingDots() {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: "4px",
        padding: "12px 16px",
      }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: "var(--accent)",
            display: "inline-block",
            animation: `chatDot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}/>
        ))}
      </div>
    );
  }

  // ── Fő chatbot komponens ──────────────────────────────────────────────────
  function AIChatbot() {
    const [open, setOpen]       = React.useState(false);
    const [input, setInput]     = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [unread, setUnread]   = React.useState(1);
    const [messages, setMessages] = React.useState([
      { role: "assistant", content: WELCOME }
    ]);
    const bottomRef = React.useRef(null);
    const inputRef  = React.useRef(null);

    // Auto-scroll az aljára
    React.useEffect(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages, loading]);

    // Focus input megnyitáskor
    React.useEffect(() => {
      if (open && inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 200);
        setUnread(0);
      }
    }, [open]);

    async function send(text) {
      const userText = (text || input).trim();
      if (!userText || loading) return;
      setInput("");

      const newMessages = [...messages, { role: "user", content: userText }];
      setMessages(newMessages);
      setLoading(true);

      try {
        // Csak user/assistant üzeneteket küldünk az API-nak
        const apiMessages = newMessages.map(m => ({
          role: m.role,
          content: m.content,
        }));
        const reply = await callClaude(apiMessages);
        setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      } catch (e) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "⚠️ " + (e.message || "Ismeretlen hiba") + "\n\nHa a probléma tartósan fennáll, keressen közvetlenül: milan.horvath@allianztanacsado.hu",
        }]);
      } finally {
        setLoading(false);
      }
    }

    function handleKey(e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    }

    const styles = getChatStyles();

    return (
      <>
        {/* CSS animációk */}
        <style>{`
          @keyframes chatDot {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-6px); opacity: 1; }
          }
          @keyframes chatSlideUp {
            from { opacity: 0; transform: translateY(16px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes chatFadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes chatPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(201,169,110,0.4); }
            50%       { box-shadow: 0 0 0 10px rgba(201,169,110,0); }
          }
          .chat-msg-bubble { animation: chatFadeIn 0.3s ease forwards; }
          .chat-quick-btn:hover {
            background: rgba(201,169,110,0.12) !important;
            border-color: var(--accent) !important;
            color: var(--accent) !important;
          }
          .chat-send-btn:hover:not(:disabled) {
            background: var(--accent-soft) !important;
          }
          .chat-toggle-btn:hover {
            transform: scale(1.06);
          }
        `}</style>

        {/* Chat ablak */}
        {open && (
          <div style={styles.window}>
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.headerLeft}>
                <div style={styles.avatar}>HM</div>
                <div>
                  <div style={styles.headerName}>Horváth Milán</div>
                  <div style={styles.headerSub}>
                    <span style={styles.onlineDot}/>
                    AI Asszisztens · Online
                  </div>
                </div>
              </div>
              <button style={styles.closeBtn} onClick={() => setOpen(false)}>
                <CloseIcon/>
              </button>
            </div>

            {/* Üzenetek */}
            <div style={styles.messages}>
              {messages.map((m, i) => (
                <div key={i} className="chat-msg-bubble" style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: "10px",
                }}>
                  {m.role === "assistant" && (
                    <div style={styles.botAvatar}>HM</div>
                  )}
                  <div style={m.role === "user" ? styles.userBubble : styles.botBubble}>
                    {m.content}
                  </div>
                </div>
              ))}

              {/* Gyors kérdések az első üzenet után */}
              {messages.length === 1 && !loading && (
                <div style={{ marginTop: "4px", marginLeft: "36px" }}>
                  {QUICK_QUESTIONS.map((q, i) => (
                    <button key={i} className="chat-quick-btn"
                      onClick={() => send(q)}
                      style={styles.quickBtn}>
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Gépelő animáció */}
              {loading && (
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <div style={styles.botAvatar}>HM</div>
                  <div style={{ ...styles.botBubble, padding: "2px 8px" }}>
                    <TypingDots/>
                  </div>
                </div>
              )}
              <div ref={bottomRef}/>
            </div>

            {/* Input */}
            <div style={styles.inputArea}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Írja be kérdését..."
                rows={1}
                disabled={loading}
                style={styles.textarea}
              />
              <button
                className="chat-send-btn"
                onClick={() => send()}
                disabled={loading || !input.trim()}
                style={styles.sendBtn}>
                <SendIcon/>
              </button>
            </div>
            <div style={styles.footer}>
              Az AI asszisztens tájékoztató jellegű válaszokat ad — nem minősül tanácsadásnak.
            </div>
          </div>
        )}

        {/* Lebegő gomb */}
        <button
          className="chat-toggle-btn"
          onClick={() => setOpen(o => !o)}
          style={styles.toggleBtn}
          aria-label="Chat megnyitása">
          {open ? <CloseIcon/> : <ChatIcon/>}
          {!open && unread > 0 && (
            <span style={styles.badge}>{unread}</span>
          )}
        </button>
      </>
    );
  }

  // ── Stílusok ──────────────────────────────────────────────────────────────
  function getChatStyles() {
    return {
      window: {
        position: "fixed",
        bottom: "88px",
        right: "24px",
        width: "360px",
        maxWidth: "calc(100vw - 32px)",
        maxHeight: "520px",
        background: "#111111",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: "4px",
        display: "flex",
        flexDirection: "column",
        zIndex: 9998,
        boxShadow: "0 24px 60px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.04) inset",
        animation: "chatSlideUp 0.28s cubic-bezier(0.22,1,0.36,1) forwards",
        overflow: "hidden",
      },
      header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "#161616",
        flexShrink: 0,
      },
      headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
      },
      avatar: {
        width: "36px",
        height: "36px",
        borderRadius: "2px",
        background: "var(--accent)",
        color: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--sans-body)",
        fontWeight: 700,
        fontSize: "11px",
        letterSpacing: "0.05em",
        flexShrink: 0,
      },
      headerName: {
        fontFamily: "var(--serif-display)",
        fontSize: "15px",
        fontWeight: 500,
        color: "var(--fg-0)",
        lineHeight: 1.2,
      },
      headerSub: {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        fontFamily: "var(--sans-body)",
        fontSize: "11px",
        color: "var(--fg-3)",
        marginTop: "2px",
      },
      onlineDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "#8aab7c",
        display: "inline-block",
        flexShrink: 0,
      },
      closeBtn: {
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--fg-3)",
        padding: "4px",
        display: "flex",
        alignItems: "center",
        transition: "color 0.18s",
      },
      messages: {
        flex: 1,
        overflowY: "auto",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        scrollbarWidth: "none",
      },
      botAvatar: {
        width: "26px",
        height: "26px",
        borderRadius: "2px",
        background: "rgba(201,169,110,0.15)",
        color: "var(--accent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--sans-body)",
        fontWeight: 700,
        fontSize: "9px",
        letterSpacing: "0.05em",
        flexShrink: 0,
        marginRight: "8px",
        marginTop: "2px",
      },
      botBubble: {
        background: "#1d1d1d",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "2px 12px 12px 2px",
        padding: "10px 14px",
        fontFamily: "var(--sans-body)",
        fontSize: "13.5px",
        lineHeight: 1.6,
        color: "var(--fg-1)",
        maxWidth: "82%",
        whiteSpace: "pre-wrap",
      },
      userBubble: {
        background: "rgba(201,169,110,0.15)",
        border: "1px solid rgba(201,169,110,0.25)",
        borderRadius: "12px 2px 2px 12px",
        padding: "10px 14px",
        fontFamily: "var(--sans-body)",
        fontSize: "13.5px",
        lineHeight: 1.6,
        color: "var(--fg-0)",
        maxWidth: "82%",
        whiteSpace: "pre-wrap",
      },
      quickBtn: {
        display: "block",
        width: "100%",
        textAlign: "left",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: "2px",
        padding: "8px 12px",
        marginBottom: "6px",
        fontFamily: "var(--sans-body)",
        fontSize: "12.5px",
        color: "var(--fg-2)",
        cursor: "pointer",
        transition: "all 0.18s ease",
      },
      inputArea: {
        display: "flex",
        alignItems: "flex-end",
        gap: "8px",
        padding: "12px 14px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        background: "#0f0f0f",
        flexShrink: 0,
      },
      textarea: {
        flex: 1,
        background: "#1d1d1d",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "2px",
        padding: "9px 12px",
        fontFamily: "var(--sans-body)",
        fontSize: "13.5px",
        color: "var(--fg-0)",
        outline: "none",
        resize: "none",
        lineHeight: 1.5,
        maxHeight: "100px",
        overflowY: "auto",
      },
      sendBtn: {
        width: "36px",
        height: "36px",
        borderRadius: "2px",
        background: "var(--accent)",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#0a0a0a",
        flexShrink: 0,
        transition: "background 0.18s",
      },
      footer: {
        padding: "8px 14px",
        fontFamily: "var(--sans-body)",
        fontSize: "10px",
        color: "var(--fg-4)",
        textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        background: "#0a0a0a",
        lineHeight: 1.4,
        flexShrink: 0,
      },
      toggleBtn: {
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "52px",
        height: "52px",
        borderRadius: "2px",
        background: "var(--accent)",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#0a0a0a",
        zIndex: 9999,
        transition: "transform 0.22s cubic-bezier(0.22,1,0.36,1)",
        animation: "chatPulse 2.5s ease-in-out 1s 3",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      },
      badge: {
        position: "absolute",
        top: "-6px",
        right: "-6px",
        width: "18px",
        height: "18px",
        borderRadius: "50%",
        background: "#c97a6e",
        color: "#fff",
        fontSize: "10px",
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--sans-body)",
      },
    };
  }

  window.AIChatbot = AIChatbot;
})();
