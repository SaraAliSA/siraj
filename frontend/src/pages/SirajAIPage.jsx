import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Sparkles, History, X, Plus, Loader2, Check, Coins } from 'lucide-react';
import useSavings from '../hooks/useSavings';

const quickChips = [
  'وش وضعي المالي هذا الشهر؟',
  'افتح لي حصالة جديدة',
  'اقترح خطة ادخار',
  'كم باقي على هدف السفر؟',
];

const welcomeMessage = {
  role: 'assistant',
  text: 'أهلًا! أنا سراج، مستشارك المالي الذكي. اسألني عن وضعك المالي أو اطلب مني تنفيذ عملية.',
};

const initialSessions = [
  {
    id: 1,
    title: 'محادثة جديدة',
    date: 'اليوم',
    messages: [welcomeMessage],
  },
];

function buildReply(text) {
  if (text.includes('خطة ادخار') || text.includes('توازن ميزانيتي')) {
    return {
      tool: 'جاري تحليل ميزانيتك...',
      reply: 'بناءً على دخلك ومصروفاتك، أقترح تخصص 15% من دخلك الشهري للادخار — يعني حوالي 2,780 ر.س شهريًا. ابدأ بحصالة صغيرة وزود المبلغ تدريجيًا كل ما زاد دخلك.',
    };
  }
  if (text.includes('وضعي المالي') || text.includes('تحليل')) {
    return {
      tool: 'جاري تحليل معاملاتك...',
      reply: 'وضعك المالي هذا الشهر جيد 👍 دخلك 18,540 ر.س ومصروفاتك 11,280 ر.س، يعني نسبة ادخار حوالي 39%. أعلى مصروف عندك بند السكن.',
    };
  }
  if (text.includes('هدف') || text.includes('السفر')) {
    return {
      tool: 'جاري مراجعة أهدافك المالية...',
      reply: 'باقي لك 6,400 ر.س بس عشان توصل لهدف رحلة السفر (20,000 ر.س)، بمعدل ادخارك الحالي بتوصله خلال شهرين تقريبًا.',
    };
  }
  return {
    tool: 'جاري التفكير...',
    reply: 'تمام، خلني أساعدك بهذا. تقدر توضح لي أكثر وش تحتاج بالضبط؟',
  };
}

function CoinsForm({ onConfirm, onCancel }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <div className="siraj-pending-card">
      <div className="siraj-pending-header">
        <Coins size={16} />
        <span>إنشاء حصالة جديدة</span>
      </div>
      <div className="siraj-pending-form">
        <input
          className="siraj-pending-input"
          placeholder="اسم الحصالة (مثال: رحلة السفر)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="siraj-pending-input"
          type="number"
          placeholder="مبلغ الإيداع الشهري (ر.س)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="siraj-pending-actions">
        <button
          className="siraj-pending-confirm"
          disabled={!name || !amount}
          onClick={() => onConfirm(name, amount)}
        >
          <Check size={14} /> تأكيد
        </button>
        <button className="siraj-pending-cancel" onClick={onCancel}>
          <X size={14} /> إلغاء
        </button>
      </div>
    </div>
  );
}

export default function SirajAIPage() {
  const { addPlan } = useSavings();
  const location = useLocation();
  const [sessions, setSessions] = useState(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState(initialSessions[0].id);
  const [input, setInput] = useState('');
  const [toolStatus, setToolStatus] = useState(null);
  const [typing, setTyping] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const endRef = useRef(null);
  const hasSentInitialPrompt = useRef(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages || [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, toolStatus, typing, pendingAction]);

  useEffect(() => {
    if (location.state?.initialPrompt && !hasSentInitialPrompt.current) {
      hasSentInitialPrompt.current = true;

      const newSession = {
        id: Date.now(),
        title: 'محادثة جديدة',
        date: 'الآن',
        messages: [welcomeMessage],
      };
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSession.id);

      setTimeout(() => {
        send(location.state.initialPrompt, newSession.id);
      }, 0);

      window.history.replaceState({}, document.title);
    }
  }, []);

  const addMessage = (msg, targetSessionId) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === targetSessionId ? { ...s, messages: [...s.messages, msg] } : s))
    );
  };

  const send = (text, targetSessionId = activeSessionId) => {
    if (!text.trim()) return;

    addMessage({ role: 'user', text }, targetSessionId);
    setInput('');
    setPendingAction(null);

    // Special case: creating a piggy bank requires confirmation
    if (text.includes('حصالة')) {
      setToolStatus('جاري تجهيز طلبك...');
      setTimeout(() => {
        setToolStatus(null);
        addMessage(
          { role: 'assistant', text: 'تمام، عبّي التفاصيل التالية عشان أنشئ لك الحصالة 👇' },
          targetSessionId
        );
        setPendingAction({ type: 'create_piggybank', sessionId: targetSessionId });
      }, 1000);
      return;
    }

    const { tool, reply } = buildReply(text);

    setToolStatus(tool);
    setTimeout(() => {
      setToolStatus(null);
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        addMessage({ role: 'assistant', text: reply }, targetSessionId);
      }, 900);
    }, 1100);
  };

  const confirmCoins = (name, amount) => {
    const sessionId = pendingAction.sessionId;
    setPendingAction(null);
    setToolStatus('جاري إنشاء الحصالة...');
    setTimeout(() => {
      setToolStatus(null);
      addPlan(name, amount);
      addMessage(
        {
          role: 'assistant',
          text: `تم إنشاء حصالة "${name}" بنجاح ✅ بإيداع شهري ${Number(amount).toLocaleString()} ر.س. تقدر تتابعها من صفحة الادخار.`,
        },
        sessionId
      );
    }, 1000);
  };

  const cancelCoins = () => {
    const sessionId = pendingAction.sessionId;
    setPendingAction(null);
    addMessage({ role: 'assistant', text: 'تمام، ألغيت العملية. أي شي ثاني أقدر أساعدك فيه؟' }, sessionId);
  };

  const startNewChat = () => {
    const newSession = {
      id: Date.now(),
      title: 'محادثة جديدة',
      date: 'الآن',
      messages: [welcomeMessage],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setShowSessions(false);
  };

  const switchSession = (id) => {
    setActiveSessionId(id);
    setShowSessions(false);
  };

  return (
    <div className="siraj-chat-wrapper">
      {/* Header */}
      <div className="siraj-chat-header">
        <div className="siraj-chat-header-info">
          <div className="siraj-avatar">
            <Sparkles size={17} />
          </div>
          <div>
           <p className="siraj-chat-name">سراج</p>
           <p className="siraj-chat-status">متصل الآن</p>
          </div>
        </div>
        <button className="siraj-history-btn" onClick={() => setShowSessions(true)}>
          <History size={19} />
        </button>
      </div>

      {/* Messages */}
      <div className="siraj-chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`siraj-msg-row ${m.role === 'user' ? 'user' : 'assistant'}`}>
            <div className={`siraj-msg-bubble ${m.role === 'user' ? 'user' : 'assistant'}`}>
              {m.text}
            </div>
          </div>
        ))}

        {toolStatus && (
          <div className="siraj-msg-row assistant">
            <div className="siraj-tool-indicator">
              <Loader2 size={14} className="siraj-spin" />
              <span>{toolStatus}</span>
            </div>
          </div>
        )}

        {typing && (
          <div className="siraj-msg-row assistant">
            <div className="siraj-msg-bubble assistant siraj-typing">
              <span className="siraj-dot" />
              <span className="siraj-dot" />
              <span className="siraj-dot" />
            </div>
          </div>
        )}

        {pendingAction?.type === 'create_piggybank' && (
          <CoinsForm onConfirm={confirmCoins} onCancel={cancelCoins} />
        )}

        <div ref={endRef} />
      </div>

      {/* Quick Chips */}
      <div className="siraj-chips-row">
        {quickChips.map((chip) => (
          <button key={chip} className="siraj-chip" onClick={() => send(chip)}>
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="siraj-input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send(input)}
          placeholder="اكتب رسالتك..."
          className="siraj-input-field"
        />
        <button className="siraj-send-btn" onClick={() => send(input)}>
          <Send size={16} style={{ transform: 'rotate(-90deg)' }} />
        </button>
      </div>

      {/* Sessions Drawer */}
      {showSessions && (
        <div className="drawer-overlay" onClick={() => setShowSessions(false)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-handle"></div>
              <h3 className="drawer-title">سجل المحادثات</h3>
            </div>
            <button className="siraj-new-chat-btn" onClick={startNewChat}>
              <Plus size={16} /> محادثة جديدة
            </button>
            <div className="siraj-sessions-list">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  className={`siraj-session-item ${s.id === activeSessionId ? 'active' : ''}`}
                  onClick={() => switchSession(s.id)}
                >
                  <span className="siraj-session-title">{s.title}</span>
                  <span className="siraj-session-date">{s.date}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}