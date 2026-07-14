import React, { useState, useEffect, useRef } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Send, Sparkles, MessageSquare, Plus, Bot, User, Cpu } from 'lucide-react';

const SirajAIPage = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, isStreaming]);

  // Load chat sessions
  const fetchSessions = async (autoSelect = true) => {
    try {
      const res = await client.get('/chat/sessions');
      setSessions(res.data);
      if (autoSelect && res.data.length > 0 && !activeSessionId) {
        setActiveSessionId(res.data[0].id);
      } else if (autoSelect && res.data.length === 0) {
        // Create a default session if list is empty
        handleCreateSession("محادثة استشارية");
      }
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Fetch history when active session changes
  useEffect(() => {
    if (!activeSessionId) return;

    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const res = await client.get(`/chat/sessions/${activeSessionId}/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [activeSessionId]);

  const handleCreateSession = async (title = "محادثة جديدة") => {
    try {
      const res = await client.post('/chat/sessions', { title });
      setSessions(prev => [res.data, ...prev]);
      setActiveSessionId(res.data.id);
      setMessages([]);
    } catch (err) {
      console.error("Failed to create session:", err);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || !activeSessionId || isStreaming) return;

    if (!textToSend) setInputText('');

    // Append user message locally
    const userMsg = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);
    setStreamingText('');

    try {
      const token = localStorage.getItem('siraj_token');
      // Use fetch directly to handle the text/event-stream
      const response = await fetch(`/api/v1/chat/sessions/${activeSessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: text })
      });

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // Keep the last partial line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.substring(6).trim();
            try {
              const data = JSON.parse(dataStr);
              if (data.content) {
                setStreamingText(prev => prev + data.content);
              }
            } catch (e) {
              // Ignore partial JSON blocks or metadata chunks
            }
          }
        }
      }

      // Finish streaming and persist in local state list
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '-ai',
        role: 'assistant',
        content: streamingText || 'تم الاستلام بنجاح.'
      }]);
    } catch (err) {
      console.error("Error streaming:", err);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '-err',
        role: 'assistant',
        content: 'عذراً، حدث خطأ أثناء الاتصال بسراج. يرجى المحاولة لاحقاً.'
      }]);
    } finally {
      setIsStreaming(false);
      setStreamingText('');
      // Refresh session list to show updated title if needed
      fetchSessions(false);
    }
  };

  const handleQuickAction = (text) => {
    handleSendMessage(text);
  };

  const quickActions = [
    { label: 'ما هو وضعي المالي الحالي؟', query: 'ما هو وضعي المالي الحالي؟' },
    { label: 'أبي أقدم على تمويل شخصي', query: 'أبي أقدم على تمويل شخصي' },
    { label: 'كيف يمكنني الادخار للعمرة؟', query: 'كيف يمكنني الادخار للعمرة؟' },
    { label: 'ما هي الفرص الاستثمارية المتاحة؟', query: 'ما هي الفرص الاستثمارية المتاحة؟' },
  ];

  return (
    <div style={styles.container}>
      {/* Session Sidebar */}
      <div style={styles.sidebar}>
        <button 
          style={styles.newChatBtn} 
          onClick={() => handleCreateSession()}
        >
          <Plus size={18} />
          <span>جلسة استشارية جديدة</span>
        </button>

        <div style={styles.sessionList}>
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              style={{
                ...styles.sessionItem,
                backgroundColor: activeSessionId === session.id ? 'var(--surface-hover)' : 'transparent',
                borderColor: activeSessionId === session.id ? 'var(--accent-color)' : 'transparent'
              }}
            >
              <MessageSquare size={16} style={{ color: 'var(--accent-color)' }} />
              <span style={styles.sessionTitle}>{session.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div style={styles.chatArea}>
        <div style={styles.chatHeader}>
          <div style={styles.headerTitle}>
            <Bot size={22} color="var(--accent-color)" />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>المستشار الذكي سراج</h3>
          </div>
          <span style={styles.headerStatus}>
            <Cpu size={14} style={{ color: 'var(--success-color)' }} />
            متصل ونشط
          </span>
        </div>

        {/* Message Feed */}
        <div style={styles.feed}>
          {loadingHistory ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p>جاري تحميل المحادثة...</p>
            </div>
          ) : messages.length === 0 && !isStreaming ? (
            <div style={styles.welcomeState}>
              <div style={styles.welcomeIcon}>
                <Sparkles size={36} color="var(--accent-color)" />
              </div>
              <h2>أهلاً بك، أنا سراج مستشارك المالي الذكي</h2>
              <p>أنا هنا لمساعدتك في اتخاذ قرارات مالية حكيمة، تحليل مصروفاتك، وتخطيط أهدافك الادخارية أو الاستثمارية المتوافقة مع الشريعة.</p>
              <div style={styles.quickGrid}>
                {quickActions.map((action, idx) => (
                  <button 
                    key={idx} 
                    style={styles.quickBtn}
                    onClick={() => handleQuickAction(action.query)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  style={{
                    ...styles.msgRow,
                    justifyContent: msg.role === 'user' ? 'flex-start' : 'flex-end',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                  }}
                >
                  <div style={{
                    ...styles.avatar,
                    backgroundColor: msg.role === 'user' ? 'var(--primary-color)' : 'var(--accent-color)'
                  }}>
                    {msg.role === 'user' ? <User size={16} color="#ffffff" /> : <Bot size={16} color="#ffffff" />}
                  </div>
                  <div style={{
                    ...styles.bubble,
                    backgroundColor: msg.role === 'user' ? 'var(--surface-color)' : 'rgba(var(--accent-rgb), 0.08)',
                    borderColor: msg.role === 'user' ? 'var(--border-color)' : 'rgba(var(--accent-rgb), 0.15)',
                    borderTopRightRadius: msg.role === 'user' ? '0' : '16px',
                    borderTopLeftRadius: msg.role === 'user' ? '16px' : '0',
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Streaming Bubble */}
              {isStreaming && streamingText && (
                <div style={{ ...styles.msgRow, justifyContent: 'flex-end', flexDirection: 'row' }}>
                  <div style={{ ...styles.avatar, backgroundColor: 'var(--accent-color)' }}>
                    <Bot size={16} color="#ffffff" />
                  </div>
                  <div style={{
                    ...styles.bubble,
                    backgroundColor: 'rgba(var(--accent-rgb), 0.08)',
                    borderColor: 'rgba(var(--accent-rgb), 0.15)',
                    borderTopRightRadius: '16px',
                    borderTopLeftRadius: '0',
                  }}>
                    {streamingText}
                  </div>
                </div>
              )}

              {/* Streaming Loading Indicator */}
              {isStreaming && !streamingText && (
                <div style={{ ...styles.msgRow, justifyContent: 'flex-end', flexDirection: 'row' }}>
                  <div style={{ ...styles.avatar, backgroundColor: 'var(--accent-color)' }}>
                    <Bot size={16} color="#ffffff" />
                  </div>
                  <div style={{
                    ...styles.bubble,
                    backgroundColor: 'rgba(var(--accent-rgb), 0.08)',
                    borderColor: 'rgba(var(--accent-rgb), 0.15)',
                    borderTopRightRadius: '16px',
                    borderTopLeftRadius: '0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span className="dot-blink">.</span>
                    <span className="dot-blink" style={{ animationDelay: '0.2s' }}>.</span>
                    <span className="dot-blink" style={{ animationDelay: '0.4s' }}>.</span>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
          style={styles.inputForm}
        >
          <input
            type="text"
            placeholder="اسأل سراج عن التمويل، الادخار، ميزانيتك..."
            className="form-control"
            style={styles.chatInput}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isStreaming}
          />
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={styles.sendBtn}
            disabled={isStreaming || !inputText.trim()}
          >
            <Send size={18} style={{ transform: 'rotate(180deg)' }} />
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: 'calc(100vh - 120px)',
    backgroundColor: 'var(--surface-color)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    overflow: 'hidden',
  },
  sidebar: {
    width: '260px',
    borderLeft: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(var(--primary-rgb), 0.01)',
  },
  newChatBtn: {
    margin: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    border: '1px dashed var(--accent-color)',
    backgroundColor: 'rgba(193, 122, 58, 0.05)',
    color: 'var(--accent-color)',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  sessionList: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 0.5rem',
    gap: '0.25rem',
  },
  sessionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    border: '1px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'right',
    color: 'var(--text-primary)',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
  },
  sessionTitle: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flex: 1,
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--surface-color)',
  },
  chatHeader: {
    height: '60px',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1.5rem',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  headerStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  feed: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    backgroundColor: 'rgba(var(--primary-rgb), 0.01)',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'var(--text-secondary)',
  },
  spinner: {
    width: '35px',
    height: '35px',
    border: '3px solid var(--border-color)',
    borderTop: '3px solid var(--accent-color)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  welcomeState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    maxWidth: '600px',
    margin: 'auto',
    gap: '1rem',
    padding: '2rem',
  },
  welcomeIcon: {
    width: '70px',
    height: '70px',
    borderRadius: '20px',
    backgroundColor: 'rgba(193, 122, 58, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.5rem',
  },
  quickGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '0.75rem',
    width: '100%',
    marginTop: '1.5rem',
  },
  quickBtn: {
    padding: '0.75rem 1rem',
    backgroundColor: 'var(--surface-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    fontWeight: '600',
    fontSize: '0.85rem',
    textAlign: 'right',
    transition: 'all 0.2s ease',
  },
  quickBtnHover: {
    borderColor: 'var(--accent-color)',
    backgroundColor: 'var(--surface-hover)',
  },
  msgRow: {
    display: 'flex',
    gap: '0.75rem',
    width: '100%',
    maxWidth: '80%',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  bubble: {
    padding: '0.85rem 1.2rem',
    borderRadius: '16px',
    fontSize: '0.95rem',
    color: 'var(--text-primary)',
    fontWeight: '500',
    lineHeight: '1.6',
    border: '1px solid',
    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
  },
  inputForm: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    borderRadius: '12px',
    padding: '0.85rem 1.2rem',
  },
  sendBtn: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// Add blinking dots animation inside head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes blink {
      0% { opacity: 0.2; }
      20% { opacity: 1; }
      100% { opacity: 0.2; }
    }
    .dot-blink {
      animation: blink 1.4s infinite both;
      font-size: 1.5rem;
      line-height: 0.5;
    }
  `;
  document.head.appendChild(style);
}

export default SirajAIPage;
