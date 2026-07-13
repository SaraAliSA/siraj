import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, History, X, Plus, Loader2 } from 'lucide-react';

const quickChips = [
  'وش وضعي المالي هذا الشهر؟',
  'افتح لي حصالة جديدة',
  'اقترح خطة ادخار',
  'كم باقي على هدف السفر؟',
];

const mockSessions = [
  { id: 1, title: 'خطة ادخار السفر', date: 'اليوم' },
  { id: 2, title: 'استفسار عن التمويل العقاري', date: 'أمس' },
  { id: 3, title: 'تحليل المصروفات الشهرية', date: 'قبل 3 أيام' },
];

function buildReply(text) {
  if (text.includes('حصالة')) {
    return {
      tool: 'جاري إنشاء حصالة ادخار...',
      reply: 'تم! أنشأت لك حصالة جديدة. تقدر تحدد اسمها والمبلغ المستهدف من صفحة الادخار.',
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

export default function SirajAIPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'أهلًا! أنا سراج، مستشارك المالي الذكي. اسألني عن وضعك المالي أو اطلب مني تنفيذ عملية.' },
  ]);
  const [input, setInput] = useState('');
  const [toolStatus, setToolStatus] = useState(null);
  const [typing, setTyping] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, toolStatus, typing]);

  const send = (text) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');

    const { tool, reply } = buildReply(text);

    setToolStatus(tool);
    setTimeout(() => {
      setToolStatus(null);
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((m) => [...m, { role: 'assistant', text: reply }]);
      }, 900);
    }, 1100);
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
          <Send size={16} style={{ transform: 'rotate(180deg)' }} />
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
            <button className="siraj-new-chat-btn">
              <Plus size={16} /> محادثة جديدة
            </button>
            <div className="siraj-sessions-list">
              {mockSessions.map((s) => (
                <button key={s.id} className="siraj-session-item">
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