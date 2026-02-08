import { useState } from 'react';
import { BrainCircuit, X, Send, Loader2 } from 'lucide-react';
import { callGemini } from '../../utils/geminiApi';
import { useAppStore } from '../../store/useAppStore';

/**
 * AI助教组件
 * 从原App.jsx迁移 (lines 2365-2487)
 */
const AiTutor = ({ lessonContext = '' }) => {
  const { geminiApiKey } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputValue.trim() || !geminiApiKey) {
      if (!geminiApiKey) alert('AI 助教需要配置 Gemini API Key。');
      return;
    }

    const userMessage = { role: 'user', content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const contextSlice = lessonContext.slice(0, 1500);
      const prompt = `学生问题: "${inputValue}"

基于当前课程内容回答学生的问题。课程内容：
${contextSlice}

请提供清晰、易懂的解释，如果问题与当前课程相关，要结合课程内容。如果问题超出课程范围，可以适当扩展但要说明。`;

      const systemInstruction =
        '你是一个友善的Web3教育助教。用中文回答，语言要通俗易懂，可以使用表情符号让回答更生动。';

      const response = await callGemini(prompt, systemInstruction);

      const assistantMessage = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `抱歉，我遇到了一些问题：${error.message}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white p-4 rounded-full shadow-2xl shadow-purple-500/20 transition-all transform hover:scale-105"
        >
          <BrainCircuit className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 max-h-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-cyan-500/10">
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-white">AI 助教</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-slate-400 text-sm text-center py-8">
            👋 你好！我是AI助教，有任何关于课程的问题都可以问我哦~
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg text-sm ${message.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-200'}`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-200 p-3 rounded-lg text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              思考中...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="问我任何问题..."
            className="flex-1 bg-slate-800 border border-slate-600 text-slate-200 text-sm rounded px-3 py-2 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 text-white p-2 rounded transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiTutor;
