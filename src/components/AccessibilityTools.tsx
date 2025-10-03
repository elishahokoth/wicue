import React, { useEffect, useState } from 'react';
import { Eye, Type, Volume2, Moon, Sun, Monitor, X, Maximize2, Clock, MessageSquare, HelpCircle } from 'lucide-react';
const AccessibilityTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [contrast, setContrast] = useState('normal');
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [readingGuide, setReadingGuide] = useState(false);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  const [readingGuideSize, setReadingGuideSize] = useState(40);
  const [readingGuideColor, setReadingGuideColor] = useState('rgba(255, 255, 0, 0.2)');
  // Apply font size changes
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    return () => {
      document.documentElement.style.fontSize = '100%';
    };
  }, [fontSize]);
  // Apply contrast changes
  useEffect(() => {
    if (contrast === 'high') {
      document.body.classList.add('high-contrast');
      document.body.classList.remove('inverted');
    } else if (contrast === 'inverted') {
      document.body.classList.add('inverted');
      document.body.classList.remove('high-contrast');
    } else {
      document.body.classList.remove('high-contrast', 'inverted');
    }
    return () => {
      document.body.classList.remove('high-contrast', 'inverted');
    };
  }, [contrast]);
  // Apply dyslexic font
  useEffect(() => {
    if (dyslexicFont) {
      document.body.classList.add('dyslexic-font');
    } else {
      document.body.classList.remove('dyslexic-font');
    }
    return () => {
      document.body.classList.remove('dyslexic-font');
    };
  }, [dyslexicFont]);
  // Apply focus mode
  useEffect(() => {
    if (focusMode) {
      document.body.classList.add('focus-mode');
    } else {
      document.body.classList.remove('focus-mode');
    }
    return () => {
      document.body.classList.remove('focus-mode');
    };
  }, [focusMode]);
  // Track mouse position for reading guide
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (readingGuide) {
        setMousePosition({
          x: e.clientX,
          y: e.clientY
        });
      }
    };
    if (readingGuide) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [readingGuide]);
  // Text-to-speech functionality
  const speakSelectedText = () => {
    if (!textToSpeechEnabled) return;
    const selectedText = window.getSelection()?.toString();
    if (selectedText && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(selectedText);
      window.speechSynthesis.speak(utterance);
    }
  };
  useEffect(() => {
    if (textToSpeechEnabled) {
      document.addEventListener('mouseup', speakSelectedText);
    } else {
      document.removeEventListener('mouseup', speakSelectedText);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
    return () => {
      document.removeEventListener('mouseup', speakSelectedText);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [textToSpeechEnabled]);
  return <>
      {/* Reading Guide Overlay */}
      {readingGuide && <div style={{
      position: 'fixed',
      top: `${mousePosition.y - readingGuideSize / 2}px`,
      left: 0,
      width: '100%',
      height: `${readingGuideSize}px`,
      backgroundColor: readingGuideColor,
      pointerEvents: 'none',
      zIndex: 9998,
      transition: 'top 0.05s ease-out'
    }} />}
      {/* Accessibility Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-4 left-4 p-3 bg-indigo-600 text-white rounded-full shadow-lg z-50 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-label="Accessibility Tools">
        <HelpCircle className="h-6 w-6" />
      </button>
      {/* Accessibility Panel */}
      {isOpen && <div className="fixed bottom-20 left-4 bg-white rounded-lg shadow-xl border border-gray-200 w-80 z-50">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Accessibility Tools</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Text Size */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Type className="h-4 w-4 mr-2" />
                    Text Size
                  </label>
                  <span className="text-xs text-gray-500">{fontSize}%</span>
                </div>
                <input type="range" min="80" max="200" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between mt-1">
                  <button onClick={() => setFontSize(Math.max(80, fontSize - 10))} className="text-xs text-indigo-600 hover:text-indigo-800">
                    Smaller
                  </button>
                  <button onClick={() => setFontSize(100)} className="text-xs text-indigo-600 hover:text-indigo-800">
                    Reset
                  </button>
                  <button onClick={() => setFontSize(Math.min(200, fontSize + 10))} className="text-xs text-indigo-600 hover:text-indigo-800">
                    Larger
                  </button>
                </div>
              </div>
              {/* Contrast */}
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                  <Monitor className="h-4 w-4 mr-2" />
                  Display Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => setContrast('normal')} className={`p-2 text-xs rounded-md flex flex-col items-center ${contrast === 'normal' ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                    <Sun className="h-4 w-4 mb-1" />
                    Normal
                  </button>
                  <button onClick={() => setContrast('high')} className={`p-2 text-xs rounded-md flex flex-col items-center ${contrast === 'high' ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                    <Eye className="h-4 w-4 mb-1" />
                    High Contrast
                  </button>
                  <button onClick={() => setContrast('inverted')} className={`p-2 text-xs rounded-md flex flex-col items-center ${contrast === 'inverted' ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                    <Moon className="h-4 w-4 mb-1" />
                    Dark Mode
                  </button>
                </div>
              </div>
              {/* Reading Aids */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Reading Aids
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-600 flex items-center">
                      <Maximize2 className="h-4 w-4 mr-2" />
                      Focus Mode
                    </label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input type="checkbox" id="focus-mode" checked={focusMode} onChange={() => setFocusMode(!focusMode)} className="sr-only" />
                      <label htmlFor="focus-mode" className={`block overflow-hidden h-6 rounded-full cursor-pointer ${focusMode ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                        <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${focusMode ? 'translate-x-4' : 'translate-x-0'}`} />
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-600 flex items-center">
                      <Type className="h-4 w-4 mr-2" />
                      Dyslexia-friendly Font
                    </label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input type="checkbox" id="dyslexic-font" checked={dyslexicFont} onChange={() => setDyslexicFont(!dyslexicFont)} className="sr-only" />
                      <label htmlFor="dyslexic-font" className={`block overflow-hidden h-6 rounded-full cursor-pointer ${dyslexicFont ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                        <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${dyslexicFont ? 'translate-x-4' : 'translate-x-0'}`} />
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-600 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Reading Guide
                    </label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input type="checkbox" id="reading-guide" checked={readingGuide} onChange={() => setReadingGuide(!readingGuide)} className="sr-only" />
                      <label htmlFor="reading-guide" className={`block overflow-hidden h-6 rounded-full cursor-pointer ${readingGuide ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                        <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${readingGuide ? 'translate-x-4' : 'translate-x-0'}`} />
                      </label>
                    </div>
                  </div>
                  {readingGuide && <div className="pl-6 space-y-2">
                      <div>
                        <label className="text-xs text-gray-500">
                          Guide Height
                        </label>
                        <input type="range" min="20" max="100" value={readingGuideSize} onChange={e => setReadingGuideSize(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">
                          Guide Color
                        </label>
                        <div className="flex space-x-2 mt-1">
                          <button onClick={() => setReadingGuideColor('rgba(255, 255, 0, 0.2)')} className={`w-6 h-6 bg-yellow-200 rounded-full ${readingGuideColor === 'rgba(255, 255, 0, 0.2)' ? 'ring-2 ring-indigo-500' : ''}`} />
                          <button onClick={() => setReadingGuideColor('rgba(0, 255, 0, 0.2)')} className={`w-6 h-6 bg-green-200 rounded-full ${readingGuideColor === 'rgba(0, 255, 0, 0.2)' ? 'ring-2 ring-indigo-500' : ''}`} />
                          <button onClick={() => setReadingGuideColor('rgba(0, 0, 255, 0.2)')} className={`w-6 h-6 bg-blue-200 rounded-full ${readingGuideColor === 'rgba(0, 0, 255, 0.2)' ? 'ring-2 ring-indigo-500' : ''}`} />
                          <button onClick={() => setReadingGuideColor('rgba(128, 128, 128, 0.2)')} className={`w-6 h-6 bg-gray-200 rounded-full ${readingGuideColor === 'rgba(128, 128, 128, 0.2)' ? 'ring-2 ring-indigo-500' : ''}`} />
                        </div>
                      </div>
                    </div>}
                </div>
              </div>
              {/* Audio Features */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Text-to-Speech
                  </label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" id="text-to-speech" checked={textToSpeechEnabled} onChange={() => setTextToSpeechEnabled(!textToSpeechEnabled)} className="sr-only" />
                    <label htmlFor="text-to-speech" className={`block overflow-hidden h-6 rounded-full cursor-pointer ${textToSpeechEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                      <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${textToSpeechEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                    </label>
                  </div>
                </div>
                {textToSpeechEnabled && <p className="text-xs text-gray-500 mt-1">
                    Select any text to have it read aloud.
                  </p>}
              </div>
              {/* Additional Support */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Additional Support
                </h4>
                <button className="w-full flex items-center justify-between p-2 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                  <span className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-indigo-600" />
                    Request Assistance
                  </span>
                  <span className="text-indigo-600">→</span>
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 p-4">
            <button onClick={() => {
          setFontSize(100);
          setContrast('normal');
          setTextToSpeechEnabled(false);
          setFocusMode(false);
          setDyslexicFont(false);
          setReadingGuide(false);
        }} className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Reset All Settings
            </button>
          </div>
        </div>}
  <style>{`
        .high-contrast {
          filter: contrast(1.5);
          background-color: white !important;
          color: black !important;
        }
        .high-contrast * {
          background-color: white !important;
          color: black !important;
          border-color: black !important;
        }
        .inverted {
          filter: invert(1) hue-rotate(180deg);
        }
        .dyslexic-font * {
          font-family:
            'Open Sans', 'Comic Sans MS', 'Arial', sans-serif !important;
          letter-spacing: 0.05em !important;
          word-spacing: 0.1em !important;
          line-height: 1.5 !important;
        }
        .focus-mode p,
        .focus-mode h1,
        .focus-mode h2,
        .focus-mode h3,
        .focus-mode h4,
        .focus-mode h5,
        .focus-mode h6,
        .focus-mode li,
        .focus-mode td {
          transition: background-color 0.3s ease;
        }
        .focus-mode p:hover,
        .focus-mode h1:hover,
        .focus-mode h2:hover,
        .focus-mode h3:hover,
        .focus-mode h4:hover,
        .focus-mode h5:hover,
        .focus-mode h6:hover,
        .focus-mode li:hover,
        .focus-mode td:hover {
          background-color: rgba(79, 70, 229, 0.1) !important;
        }
      `}</style>
    </>;
};
export default AccessibilityTools;