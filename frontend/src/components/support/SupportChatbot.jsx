import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Form, Badge, Collapse } from 'react-bootstrap';
import { BiChat, BiX, BiSend, BiPlus, BiBot } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { setModal } from '../../store/slices/supportSlice';

const SupportChatbot = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Predefined responses and quick actions
  const quickActions = [
    { label: 'Create Ticket', action: 'create_ticket', variant: 'primary' },
    { label: 'View FAQs', action: 'view_faqs', variant: 'info' },
    { label: 'Contact Support', action: 'contact_support', variant: 'success' },
    { label: 'System Status', action: 'system_status', variant: 'warning' }
  ];

  const commonQuestions = [
    'How do I create a tender?',
    'How do I upload documents?',
    'How do I evaluate tenders?',
    'How do I generate reports?',
    'How do I manage users?'
  ];

  const responses = {
    'hello': 'Hello! I\'m your support assistant. How can I help you today?',
    'hi': 'Hi there! I\'m here to help. What can I assist you with?',
    'help': 'I can help you with creating support tickets, answering questions, and guiding you through the platform. What do you need help with?',
    'tender': 'To create a tender, go to the Tender Intelligence page and click "New Tender". You can also upload documents which will automatically create tender records.',
    'document': 'You can upload documents in the Document Management section. The system will automatically extract information and create tender records.',
    'evaluate': 'Tender evaluation is done in the Qualification & Evaluation section. You can use the AI-powered scoring system or create custom evaluation matrices.',
    'report': 'Reports are available in the Reporting & Analytics section. You can generate custom reports, view KPIs, and export data in various formats.',
    'user': 'User management is handled in the Admin & Config section (Admin only). You can create, edit, and manage user accounts and permissions.',
    'create_ticket': 'I\'ll help you create a support ticket. Let me open the ticket creation form for you.',
    'view_faqs': 'I\'ll show you the FAQ section where you can find answers to common questions.',
    'contact_support': 'You can contact our support team by creating a ticket or emailing support@tender360.com. Our team typically responds within 24 hours.',
    'system_status': 'All systems are currently operational. If you\'re experiencing issues, please create a support ticket and we\'ll investigate.',
    'default': 'I\'m not sure I understand. Could you please rephrase your question or choose one of the quick actions below?'
  };

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          type: 'bot',
          content: 'Hello! I\'m your AI support assistant. I can help you with common questions, create support tickets, and guide you through the platform. How can I help you today?',
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage.trim().toLowerCase());
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateBotResponse = (message) => {
    // Check for exact matches first
    for (const [key, response] of Object.entries(responses)) {
      if (message.includes(key)) {
        return response;
      }
    }

    // Check for partial matches
    if (message.includes('tender')) return responses.tender;
    if (message.includes('document') || message.includes('upload')) return responses.document;
    if (message.includes('evaluate') || message.includes('scoring')) return responses.evaluate;
    if (message.includes('report') || message.includes('analytics')) return responses.report;
    if (message.includes('user') || message.includes('admin')) return responses.user;

    return responses.default;
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'create_ticket':
        dispatch(setModal({ modal: 'showCreateTicket', show: true }));
        setIsOpen(false);
        break;
      case 'view_faqs':
        // Navigate to FAQ section (you can implement this based on your routing)
        window.location.hash = '#faqs';
        setIsOpen(false);
        break;
      case 'contact_support':
        dispatch(setModal({ modal: 'showCreateTicket', show: true }));
        setIsOpen(false);
        break;
      case 'system_status':
        const statusMessage = {
          id: Date.now(),
          type: 'bot',
          content: responses.system_status,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, statusMessage]);
        break;
      default:
        break;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        variant="primary"
        size="lg"
        className="chat-toggle-btn position-fixed"
        style={{
          bottom: '20px',
          right: '20px',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <BiX size={24} /> : <BiChat size={24} />}
      </Button>

      {/* Chat Window */}
      <Collapse in={isOpen}>
        <Card
          className="chat-window position-fixed"
          style={{
            bottom: '90px',
            right: '20px',
            width: '350px',
            height: '500px',
            zIndex: 1000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }}
        >
          <Card.Header className="bg-primary text-white d-flex align-items-center">
            <BiBot className="me-2" />
            <span className="fw-medium">Support Assistant</span>
            <Button
              variant="link"
              className="text-white ms-auto p-0"
              onClick={() => setIsOpen(false)}
            >
              <BiX size={20} />
            </Button>
          </Card.Header>

          <Card.Body className="p-0 d-flex flex-column">
            {/* Messages Area */}
            <div className="flex-grow-1 p-3" style={{ height: '350px', overflowY: 'auto' }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`d-flex mb-3 ${message.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  <div
                    className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
                    style={{
                      maxWidth: '80%',
                      padding: '8px 12px',
                      borderRadius: '18px',
                      backgroundColor: message.type === 'user' ? '#007bff' : '#f8f9fa',
                      color: message.type === 'user' ? 'white' : '#212529',
                      border: message.type === 'bot' ? '1px solid #dee2e6' : 'none'
                    }}
                  >
                    <div className="message-content">{message.content}</div>
                    <small
                      className="message-time d-block mt-1"
                      style={{
                        opacity: 0.7,
                        fontSize: '0.75rem'
                      }}
                    >
                      {formatTime(message.timestamp)}
                    </small>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="d-flex justify-content-start mb-3">
                  <div
                    className="message bot-message"
                    style={{
                      maxWidth: '80%',
                      padding: '8px 12px',
                      borderRadius: '18px',
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #dee2e6'
                    }}
                  >
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-3 pb-2">
              <div className="mb-2">
                <small className="text-muted">Quick Actions:</small>
              </div>
              <div className="d-flex flex-wrap gap-1">
                {quickActions.map((action) => (
                  <Button
                    key={action.action}
                    variant={action.variant}
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Common Questions */}
            <div className="px-3 pb-2">
              <div className="mb-2">
                <small className="text-muted">Common Questions:</small>
              </div>
              <div className="d-flex flex-wrap gap-1">
                {commonQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setInputMessage(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 border-top">
              <Form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isTyping}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!inputMessage.trim() || isTyping}
                  >
                    <BiSend />
                  </Button>
                </div>
              </Form>
            </div>
          </Card.Body>
        </Card>
      </Collapse>

      {/* CSS for typing indicator */}
      <style>{`
        .typing-indicator {
          display: flex;
          gap: 4px;
        }
        
        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #6c757d;
          animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default SupportChatbot;
