import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Sparkles, History, X, Plus, Loader2, Check, Coins } from 'lucide-react';
import useSavings from '../hooks/useSavings';
import apiClient from '../api/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const quickChips = [
  'وش وضعي المالي هذا الشهر؟',
  'افتح لي حصالة جديدة',
  'اقترح خطة ادخار',
  'كم باقي على هدف السفر؟',
];

const welcomeMessage = {
  id: 'welcome-msg',
  role: 'assistant',
  text: 'أهلًا! أنا سراج، مستشارك المالي الذكي. اسألني عن وضعك المالي أو اطلب مني تنفيذ عملية.',
};

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
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [input, setInput] = useState('');
  const [toolStatus, setToolStatus] = useState(null);
  const [typing, setTyping] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const endRef = useRef(null);
  const hasSentInitialPrompt = useRef(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages || [];

  // Init sessions on mount
  useEffect(() => {
    const initChat = async () => {
      try {
        const res = await apiClient.get('/chat/sessions');
        if (res.data && res.data.length > 0) {
          const sessList = res.data.map(s => ({
            id: s.id,
            title: s.title,
            date: new Date(s.created_at).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' }),
            messages: [welcomeMessage],
          }));
          setSessions(sessList);
          setActiveSessionId(sessList[0].id);
        } else {
          // Create initial session
          const createRes = await apiClient.post('/chat/sessions', { title: 'مستشار سراج' });
          const newSess = {
            id: createRes.data.id,
            title: createRes.data.title,
            date: 'الآن',
            messages: [welcomeMessage],
          };
          setSessions([newSess]);
          setActiveSessionId(createRes.data.id);
        }
      } catch (err) {
        console.error('Failed to init chat sessions:', err);
      }
    };
    initChat();
  }, []);

  // Fetch messages for active session when it changes
  useEffect(() => {
    if (!activeSessionId) return;
    const fetchMessages = async () => {
      try {
        const res = await apiClient.get(`/chat/sessions/${activeSessionId}/messages`);
        const mappedMsgs = res.data.map(m => ({
          id: m.id,
          role: m.role,
          text: m.content,
        }));
        
        setSessions(prev => prev.map(s => 
          s.id === activeSessionId 
            ? { ...s, messages: mappedMsgs.length > 0 ? mappedMsgs : [welcomeMessage] } 
            : s
        ));
      } catch (err) {
        console.error('Failed to load messages for session:', err);
      }
    };
    fetchMessages();
  }, [activeSessionId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, toolStatus, typing, pendingAction]);

  useEffect(() => {
    if (location.state?.initialPrompt && !hasSentInitialPrompt.current && sessions.length > 0) {
      hasSentInitialPrompt.current = true;
      const initialPromptText = location.state.initialPrompt;
      
      // If we have an active session, send it, otherwise create one
      let sessionId = activeSessionId;
      if (!sessionId && sessions.length > 0) {
        sessionId = sessions[0].id;
      }
      
      if (sessionId) {
        setTimeout(() => {
          send(initialPromptText, sessionId);
        }, 300);
      }
      window.history.replaceState({}, document.title);
    }
  }, [sessions]);

  const addMessage = (msg, targetSessionId) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === targetSessionId ? { ...s, messages: [...s.messages, msg] } : s))
    );
  };

  const updateMessageText = (tempId, newText, targetSessionId) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== targetSessionId) return s;
        const updatedMsgs = s.messages.map((m) =>
          m.id === tempId ? { ...m, text: newText } : m
        );
        return { ...s, messages: updatedMsgs };
      })
    );
  };

  const send = async (text, targetSessionId = activeSessionId) => {
    if (!text.trim()) return;

    addMessage({ id: Date.now().toString(), role: 'user', text }, targetSessionId);
    setInput('');
    setPendingAction(null);

    // Special case: creating a piggy bank requires confirmation
    if (text.includes('حصالة')) {
      setToolStatus('جاري تجهيز طلبك...');
      setTimeout(() => {
        setToolStatus(null);
        addMessage(
          { id: Date.now().toString(), role: 'assistant', text: 'تمام، عبّي التفاصيل التالية عشان أنشئ لك الحصالة 👇' },
          targetSessionId
        );
        setPendingAction({ type: 'create_piggybank', sessionId: targetSessionId });
      }, 1000);
      return;
    }

    setTyping(true);

    try {
      const token = localStorage.getItem('siraj_token');
      const response = await fetch(`${API_BASE_URL}/chat/sessions/${targetSessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to stream assistant reply');
      }

      setTyping(false);
      const assistantMessageId = Date.now().toString();
      addMessage({ id: assistantMessageId, role: 'assistant', text: '' }, targetSessionId);

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let accumulatedText = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunkStr = decoder.decode(value, { stream: true });
          const lines = chunkStr.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.substring(6).trim();
              if (dataStr) {
                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.content) {
                    accumulatedText += parsed.content;
                    updateMessageText(assistantMessageId, accumulatedText, targetSessionId);
                  }
                } catch (e) {
                  // Ignore parsing metadata or partial JSON lines
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setTyping(false);
      addMessage(
        { id: Date.now().toString(), role: 'assistant', text: 'عذراً، واجهت مشكلة في الاتصال بالخادم. يرجى المحاولة مرة أخرى.' },
        targetSessionId
      );
    }
  };

  const confirmCoins = async (name, amount) => {
    const sessionId = pendingAction.sessionId;
    setPendingAction(null);
    setToolStatus('جاري إنشاء الحصالة...');
    
    const res = await addPlan(name, amount, 12); // Default 12 months
    setToolStatus(null);
    if (res.success) {
      addMessage(
        {
          id: Date.now().toString(),
          role: 'assistant',
          text: `تم إنشاء حصالة "${name}" بنجاح ✅ بإيداع شهري ${Number(amount).toLocaleString()} ر.س. تقدر تتابعها من صفحة الادخار.`,
        },
        sessionId
      );
    } else {
      addMessage(
        {
          id: Date.now().toString(),
          role: 'assistant',
          text: `فشل إنشاء الحصالة: ${res.error}`,
        },
        sessionId
      );
    }
  };

  const cancelCoins = () => {
    const sessionId = pendingAction.sessionId;
    setPendingAction(null);
    addMessage({ id: Date.now().toString(), role: 'assistant', text: 'تمام، ألغيت العملية. أي شي ثاني أقدر أساعدك فيه؟' }, sessionId);
  };

  const startNewChat = async () => {
    try {
      const createRes = await apiClient.post('/chat/sessions', { title: 'محادثة استشارية' });
      const newSess = {
        id: createRes.data.id,
        title: createRes.data.title,
        date: 'الآن',
        messages: [welcomeMessage],
      };
      setSessions((prev) => [newSess, ...prev]);
      setActiveSessionId(newSess.id);
      setShowSessions(false);
    } catch (err) {
      console.error('Failed to create new session:', err);
    }
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
          <div key={m.id || i} className={`siraj-msg-row ${m.role === 'user' ? 'user' : 'assistant'}`}>
            <div className={`siraj-msg-bubble ${m.role === 'user' ? 'user' : 'assistant'}`} style={{ whiteSpace: 'pre-wrap' }}>
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