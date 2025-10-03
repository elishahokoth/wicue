import React, { useState } from 'react';
import { Bot, Sparkles, Send, X, Loader, Download, Copy, Check } from 'lucide-react';
type AIAssistantProps = {
  onClose: () => void;
};
const AIAssistant: React.FC<AIAssistantProps> = ({
  onClose
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
  }>>([]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    // Add user message to history
    setHistory(prev => [...prev, {
      role: 'user',
      content: prompt
    }]);
    // Simulate AI response
    setIsGenerating(true);
    // Mock AI generation with delayed response
    setTimeout(() => {
      const responses = ["I've created a comprehensive lesson plan on this topic. It includes learning objectives, key concepts, assessment strategies, and interactive activities.", "Here's an engaging quiz with a mix of multiple-choice, short answer, and interactive questions to test understanding of the material.", "I've generated a detailed explanation with examples and visual cues to help students understand this complex topic.", 'Based on your course content, I recommend dividing this material into three separate modules to improve student comprehension and engagement.', "I've analyzed your course structure and identified potential gaps in the curriculum. Consider adding content about these related topics to provide a more comprehensive learning experience."];
      const generatedResponse = responses[Math.floor(Math.random() * responses.length)];
      setGeneratedContent(generatedResponse);
      setHistory(prev => [...prev, {
        role: 'assistant',
        content: generatedResponse
      }]);
      setIsGenerating(false);
      setPrompt('');
    }, 2000);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return <div className="fixed bottom-4 right-4 w-96 bg-white shadow-xl rounded-lg border border-gray-200 flex flex-col z-50">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Bot className="h-5 w-5 text-indigo-600 mr-2" />
          <h3 className="font-medium text-gray-900">AI Course Assistant</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto max-h-80 bg-gray-50">
        {history.length === 0 ? <div className="text-center py-8">
            <Sparkles className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              AI Course Assistant
            </h4>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Ask me to generate course content, create assessments, suggest
              improvements, or help with instructional design.
            </p>
          </div> : <div className="space-y-4">
            {history.map((message, index) => <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user' ? 'bg-indigo-100 text-indigo-900' : 'bg-white border border-gray-200 text-gray-800'}`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>)}
            {isGenerating && <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-white border border-gray-200 text-gray-800">
                  <div className="flex items-center">
                    <Loader className="h-4 w-4 text-indigo-500 animate-spin mr-2" />
                    <p className="text-sm text-gray-500">
                      Generating response...
                    </p>
                  </div>
                </div>
              </div>}
          </div>}
      </div>
      {generatedContent && !isGenerating && <div className="p-3 border-t border-gray-200 bg-indigo-50">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-medium text-indigo-700">
              Generated Content
            </h4>
            <div className="flex space-x-2">
              <button onClick={handleCopy} className="text-xs flex items-center text-indigo-600 hover:text-indigo-800">
                {copied ? <>
                    <Check className="h-3 w-3 mr-1" />
                    Copied
                  </> : <>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </>}
              </button>
              <button className="text-xs flex items-center text-indigo-600 hover:text-indigo-800">
                <Download className="h-3 w-3 mr-1" />
                Save
              </button>
            </div>
          </div>
        </div>}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200">
        <div className="flex items-center">
          <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Ask the AI to help with your course..." className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-black" disabled={isGenerating} />
          <button type="submit" disabled={isGenerating || !prompt.trim()} className={`inline-flex items-center px-3 py-2 border border-transparent rounded-r-md text-sm font-medium text-white ${isGenerating || !prompt.trim() ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>;
};
export default AIAssistant;