import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare, Users, Settings, MoreHorizontal, Shield, Maximize, X, Cpu, HandMetal, Gauge, ScreenShare, Sparkles } from 'lucide-react';
type MeetingMode = 'audio' | 'video' | 'screen';
type LayoutMode = 'grid' | 'spotlight' | 'immersive' | 'holographic';
type ParticipantRole = 'host' | 'co-host' | 'presenter' | 'attendee';
interface Participant {
  id: string;
  name: string;
  role: ParticipantRole;
  audioOn: boolean;
  videoOn: boolean;
  speaking: boolean;
  avatar: string;
  connection: 'excellent' | 'good' | 'fair' | 'poor';
  raisingHand: boolean;
  sharing: boolean;
}
const ChambersPage = () => {
  const {
    currentUser
  } = useAuth();
  const {
    theme
  } = useTheme();
  const [meetingMode, setMeetingMode] = useState<MeetingMode>('video');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid');
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [isJoiningMeeting, setIsJoiningMeeting] = useState(false);
  const [meetingCode, setMeetingCode] = useState('');
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRaisingHand, setIsRaisingHand] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  // const [isControlsVisible, setIsControlsVisible] = useState(true); // unused
  // const [isFullscreen, setIsFullscreen] = useState(false); // unused
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // const [isReactionsOpen, setIsReactionsOpen] = useState(false); // unused
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
  const [aiAssistantActive, setAiAssistantActive] = useState(false);
  const [networkQuality, setNetworkQuality] = useState<number>(95);
  const [meetingDuration, setMeetingDuration] = useState<number>(0);
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: string;
    message: string;
    timestamp: Date;
  }>>([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'participants' | 'settings'>('chat');
  const [virtualBackground, setVirtualBackground] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Mock participants
  const [participants, setParticipants] = useState<Participant[]>([{
    id: '1',
    name: 'You',
    role: 'host',
    audioOn: isAudioOn,
    videoOn: isVideoOn,
    speaking: false,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    connection: 'excellent',
    raisingHand: false,
    sharing: false
  }, {
    id: '2',
    name: 'Alex Johnson',
    role: 'presenter',
    audioOn: true,
    videoOn: true,
    speaking: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    connection: 'good',
    raisingHand: false,
    sharing: false
  }, {
    id: '3',
    name: 'Maria Garcia',
    role: 'attendee',
    audioOn: false,
    videoOn: true,
    speaking: false,
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    connection: 'excellent',
    raisingHand: true,
    sharing: false
  }, {
    id: '4',
    name: 'James Smith',
    role: 'attendee',
    audioOn: true,
    videoOn: false,
    speaking: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    connection: 'fair',
    raisingHand: false,
    sharing: false
  }, {
    id: '5',
    name: 'Emma Wilson',
    role: 'co-host',
    audioOn: true,
    videoOn: true,
    speaking: false,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    connection: 'good',
    raisingHand: false,
    sharing: false
  }, {
    id: '6',
    name: 'Sophia Lee',
    role: 'attendee',
    audioOn: true,
    videoOn: true,
    speaking: false,
    avatar: 'https://images.unsplash.com/photo-1592124549776-a7f0cc973b24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    connection: 'poor',
    raisingHand: false,
    sharing: false
  }]);
  // Virtual backgrounds
  const virtualBackgrounds = [{
    id: 'bg1',
    name: 'Nairobi Skyline',
    thumbnail: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    url: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'
  }, {
    id: 'bg2',
    name: 'Serengeti Plains',
    thumbnail: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'
  }, {
    id: 'bg3',
    name: 'Mount Kilimanjaro',
    thumbnail: 'https://images.unsplash.com/photo-1589723933517-8dbab8987eab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    url: 'https://images.unsplash.com/photo-1589723933517-8dbab8987eab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'
  }, {
    id: 'bg4',
    name: 'Futuristic Office',
    thumbnail: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'
  }, {
    id: 'bg5',
    name: 'Neural Network',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'
  }];
  // Timer for meeting duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMeetingActive) {
      interval = setInterval(() => {
        setMeetingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMeetingActive]);
  // Simulate network quality fluctuation
  useEffect(() => {
    if (isMeetingActive) {
      const interval = setInterval(() => {
        const fluctuation = Math.random() * 10 - 5; // Random value between -5 and 5
        setNetworkQuality(prev => {
          const newValue = prev + fluctuation;
          return Math.min(Math.max(newValue, 60), 100); // Keep between 60 and 100
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isMeetingActive]);
  // Simulate participants speaking
  useEffect(() => {
    if (isMeetingActive) {
      const interval = setInterval(() => {
        setParticipants(prev => prev.map(p => ({
          ...p,
          speaking: p.audioOn && Math.random() > 0.7 // 30% chance of speaking if audio is on
        })));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isMeetingActive]);
  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  // Start a meeting
  const startMeeting = () => {
    // Generate a random meeting code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setMeetingCode(code);
    setIsMeetingActive(true);
    // Add some initial chat messages
    setChatMessages([{
      id: '1',
      sender: 'System',
      message: `Meeting started. Meeting code: ${code}`,
      timestamp: new Date()
    }, {
      id: '2',
      sender: 'System',
      message: 'You are the host of this meeting.',
      timestamp: new Date()
    }]);
  };
  // Join a meeting
  const joinMeeting = () => {
    if (meetingCode.trim()) {
      setIsMeetingActive(true);
      setChatMessages([{
        id: '1',
        sender: 'System',
        message: `You joined the meeting with code: ${meetingCode}`,
        timestamp: new Date()
      }]);
    }
  };
  // End the meeting
  const endMeeting = () => {
  setIsMeetingActive(false);
  setMeetingDuration(0);
  setChatMessages([]);
  setIsScreenSharing(false);
  setIsChatOpen(false);
  setIsParticipantsOpen(false);
  setIsSettingsOpen(false);
  };
  // Send a chat message
  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChatMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: 'You',
        message: newChatMessage,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, newMessage]);
      setNewChatMessage('');
    }
  };
  // Toggle participant audio (for host)
  const toggleParticipantAudio = (id: string) => {
    setParticipants(prev => prev.map(p => p.id === id ? {
      ...p,
      audioOn: !p.audioOn
    } : p));
  };
  // Toggle participant video (for host)
  const toggleParticipantVideo = (id: string) => {
    setParticipants(prev => prev.map(p => p.id === id ? {
      ...p,
      videoOn: !p.videoOn
    } : p));
  };
  // Set a virtual background
  const setBackground = (url: string | null) => {
    setVirtualBackground(url);
    setIsBackgroundBlurred(false);
  };
  // Render the meeting controls
  const renderMeetingControls = () => {
  return <div className={`fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-lg transition-transform duration-300 ease-in-out p-4 rounded-t-2xl border-t border-white/10 z-30`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-white text-sm font-medium">
                <span className="mr-2">{formatTime(meetingDuration)}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700">
                  {meetingCode}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <button onClick={() => setIsAudioOn(!isAudioOn)} className={`control-button ${!isAudioOn ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
                {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>
              <button onClick={() => setIsVideoOn(!isVideoOn)} className={`control-button ${!isVideoOn ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
                {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </button>
              <button onClick={() => setIsScreenSharing(!isScreenSharing)} className={`control-button ${isScreenSharing ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
                <ScreenShare className="h-5 w-5" />
              </button>
              <button onClick={() => setIsRaisingHand(!isRaisingHand)} className={`control-button ${isRaisingHand ? 'bg-yellow-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
                <HandMetal className="h-5 w-5" />
              </button>
              <button onClick={() => {
              setIsChatOpen(!isChatOpen);
              if (!isChatOpen) {
                setActiveTab('chat');
                setIsParticipantsOpen(false);
                setIsSettingsOpen(false);
              }
            }} className={`control-button ${isChatOpen && activeTab === 'chat' ? 'bg-indigo-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
                <MessageSquare className="h-5 w-5" />
              </button>
              <button onClick={() => {
              setIsParticipantsOpen(!isParticipantsOpen);
              if (!isParticipantsOpen) {
                setActiveTab('participants');
                setIsChatOpen(false);
                setIsSettingsOpen(false);
              }
            }} className={`control-button ${isParticipantsOpen && activeTab === 'participants' ? 'bg-indigo-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
                <Users className="h-5 w-5" />
              </button>
              <button onClick={() => {
              setIsSettingsOpen(!isSettingsOpen);
              if (!isSettingsOpen) {
                setActiveTab('settings');
                setIsChatOpen(false);
                setIsParticipantsOpen(false);
              }
            }} className={`control-button ${isSettingsOpen && activeTab === 'settings' ? 'bg-indigo-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
                <Settings className="h-5 w-5" />
              </button>
              <button onClick={endMeeting} className="control-button bg-red-600 hover:bg-red-700">
                <Phone className="h-5 w-5 transform rotate-135" />
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-white text-xs">Layout:</span>
                <select value={layoutMode} onChange={e => setLayoutMode(e.target.value as LayoutMode)} className="bg-gray-800 text-white text-xs rounded-md border border-white/10 py-1 px-2">
                  <option value="grid">Grid</option>
                  <option value="spotlight">Spotlight</option>
                  <option value="immersive">Immersive</option>
                  <option value="holographic">Holographic</option>
                </select>
              </div>
              <button onClick={toggleFullscreen} className="control-button bg-gray-800 hover:bg-gray-700">
                <Maximize className="h-5 w-5" />
              </button>
              <div className="flex items-center">
                <div className="h-2 w-12 bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full ${networkQuality > 80 ? 'bg-green-500' : networkQuality > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{
                  width: `${networkQuality}%`
                }}></div>
                </div>
                <span className="ml-1 text-white text-xs">
                  {Math.round(networkQuality)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>;
  };
  // Render the side panel (chat, participants, settings)
  const renderSidePanel = () => {
    if (!isChatOpen && !isParticipantsOpen && !isSettingsOpen) return null;
    return <div className="absolute top-0 right-0 bottom-0 w-80 bg-black/60 backdrop-blur-lg border-l border-white/10 z-20 transform transition-transform duration-300 ease-in-out">
        <div className="flex border-b border-white/10">
          <button onClick={() => {
          setActiveTab('chat');
          setIsChatOpen(true);
          setIsParticipantsOpen(false);
          setIsSettingsOpen(false);
        }} className={`flex-1 py-3 text-sm font-medium ${activeTab === 'chat' ? 'text-white border-b-2 border-indigo-500' : 'text-gray-400'}`}>
            Chat
          </button>
          <button onClick={() => {
          setActiveTab('participants');
          setIsParticipantsOpen(true);
          setIsChatOpen(false);
          setIsSettingsOpen(false);
        }} className={`flex-1 py-3 text-sm font-medium ${activeTab === 'participants' ? 'text-white border-b-2 border-indigo-500' : 'text-gray-400'}`}>
            Participants
          </button>
          <button onClick={() => {
          setActiveTab('settings');
          setIsSettingsOpen(true);
          setIsChatOpen(false);
          setIsParticipantsOpen(false);
        }} className={`flex-1 py-3 text-sm font-medium ${activeTab === 'settings' ? 'text-white border-b-2 border-indigo-500' : 'text-gray-400'}`}>
            Settings
          </button>
        </div>
        <div className="h-full overflow-hidden flex flex-col">
          {activeTab === 'chat' && <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map(msg => <div key={msg.id} className={`${msg.sender === 'You' ? 'ml-auto bg-indigo-600' : msg.sender === 'System' ? 'bg-gray-700' : 'bg-gray-800'} rounded-lg p-3 max-w-[85%]`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-white">
                        {msg.sender}
                      </span>
                      <span className="text-xs text-gray-300">
                        {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                      </span>
                    </div>
                    <p className="text-sm text-white">{msg.message}</p>
                  </div>)}
              </div>
              <div className="p-4 border-t border-white/10">
                <form onSubmit={sendChatMessage} className="flex">
                  <input type="text" value={newChatMessage} onChange={e => setNewChatMessage(e.target.value)} placeholder="Type a message..." className="flex-1 bg-gray-800 text-white rounded-l-md border border-white/10 py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  <button type="submit" className="bg-indigo-600 text-white rounded-r-md px-4 hover:bg-indigo-700">
                    Send
                  </button>
                </form>
              </div>
            </>}
          {activeTab === 'participants' && <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-4">
                <h3 className="text-white text-sm font-medium mb-2">
                  In this meeting ({participants.length})
                </h3>
                <div className="space-y-3">
                  {participants.map(p => <div key={p.id} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center">
                        <div className="relative">
                          {p.videoOn ? <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center overflow-hidden">
                              <img src={p.avatar} alt={p.name} className="h-full w-full object-cover" />
                            </div> : <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                              {p.name.charAt(0)}
                            </div>}
                          {p.speaking && <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full h-3 w-3 border-2 border-gray-800"></div>}
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <span className="text-white text-sm font-medium">
                              {p.name}
                            </span>
                            {p.role !== 'attendee' && <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-gray-700 text-gray-300">
                                {p.role}
                              </span>}
                          </div>
                          <div className="flex items-center mt-1">
                            {p.audioOn ? <Mic className="h-3 w-3 text-green-500 mr-1" /> : <MicOff className="h-3 w-3 text-red-500 mr-1" />}
                            <div className="h-1.5 w-6 bg-gray-700 rounded-full ml-1 mr-2">
                              <div className={`h-full rounded-full ${p.connection === 'excellent' ? 'bg-green-500' : p.connection === 'good' ? 'bg-green-500' : p.connection === 'fair' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{
                          width: p.connection === 'excellent' ? '100%' : p.connection === 'good' ? '75%' : p.connection === 'fair' ? '50%' : '25%'
                        }}></div>
                            </div>
                            {p.raisingHand && <HandMetal className="h-3 w-3 text-yellow-500" />}
                          </div>
                        </div>
                      </div>
                      {p.id !== '1' && (currentUser?.role === 'admin' || participants.find(part => part.id === '1')?.role === 'host') && <div className="flex items-center space-x-2">
                            <button onClick={() => toggleParticipantAudio(p.id)} className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600">
                              {p.audioOn ? <Mic className="h-3 w-3 text-white" /> : <MicOff className="h-3 w-3 text-white" />}
                            </button>
                            <button onClick={() => toggleParticipantVideo(p.id)} className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600">
                              {p.videoOn ? <Video className="h-3 w-3 text-white" /> : <VideoOff className="h-3 w-3 text-white" />}
                            </button>
                            <button className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600">
                              <MoreHorizontal className="h-3 w-3 text-white" />
                            </button>
                          </div>}
                    </div>)}
                </div>
              </div>
              {(currentUser?.role === 'admin' || participants.find(p => p.id === '1')?.role === 'host') && <div>
                  <h3 className="text-white text-sm font-medium mb-2">
                    Host Controls
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-700 rounded-lg p-3 text-white text-sm">
                      <span>Mute all participants</span>
                      <MicOff className="h-4 w-4" />
                    </button>
                    <button className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-700 rounded-lg p-3 text-white text-sm">
                      <span>Disable all videos</span>
                      <VideoOff className="h-4 w-4" />
                    </button>
                    <button className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-700 rounded-lg p-3 text-white text-sm">
                      <span>Lock meeting</span>
                      <Shield className="h-4 w-4" />
                    </button>
                  </div>
                </div>}
            </div>}
          {activeTab === 'settings' && <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-6">
                <h3 className="text-white text-sm font-medium mb-3">
                  Audio & Video
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                    <span className="text-white text-sm">Microphone</span>
                    <select className="bg-gray-700 text-white text-xs rounded-md border border-white/10 py-1 px-2">
                      <option>Default Microphone</option>
                      <option>Headset Microphone</option>
                      <option>External Microphone</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                    <span className="text-white text-sm">Speaker</span>
                    <select className="bg-gray-700 text-white text-xs rounded-md border border-white/10 py-1 px-2">
                      <option>Default Speaker</option>
                      <option>Headset</option>
                      <option>External Speaker</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                    <span className="text-white text-sm">Camera</span>
                    <select className="bg-gray-700 text-white text-xs rounded-md border border-white/10 py-1 px-2">
                      <option>Default Camera</option>
                      <option>External Webcam</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-white text-sm font-medium mb-3">
                  Background
                </h3>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <button onClick={() => setBackground(null)} className={`relative h-16 rounded-lg overflow-hidden ${!virtualBackground && !isBackgroundBlurred ? 'ring-2 ring-indigo-500' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
                      None
                    </div>
                  </button>
                  <button onClick={() => {
                setIsBackgroundBlurred(true);
                setVirtualBackground(null);
              }} className={`relative h-16 rounded-lg overflow-hidden ${isBackgroundBlurred ? 'ring-2 ring-indigo-500' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 backdrop-blur"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
                      Blur
                    </div>
                  </button>
                  {virtualBackgrounds.map(bg => <button key={bg.id} onClick={() => setBackground(bg.url)} className={`relative h-16 rounded-lg overflow-hidden ${virtualBackground === bg.url ? 'ring-2 ring-indigo-500' : ''}`}>
                      <img src={bg.thumbnail} alt={bg.name} className="h-full w-full object-cover" />
                    </button>)}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-white text-sm font-medium mb-3">
                  AI Features
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                    <div>
                      <span className="text-white text-sm">AI Assistant</span>
                      <p className="text-gray-400 text-xs mt-1">
                        Get real-time meeting insights and suggestions
                      </p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" id="ai-toggle" className="sr-only" checked={aiAssistantActive} onChange={() => setAiAssistantActive(!aiAssistantActive)} />
                      <div className={`block w-10 h-6 rounded-full ${aiAssistantActive ? 'bg-indigo-600' : 'bg-gray-600'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${aiAssistantActive ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                    <div>
                      <span className="text-white text-sm">
                        Noise Suppression
                      </span>
                      <p className="text-gray-400 text-xs mt-1">
                        Reduce background noise automatically
                      </p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" id="noise-toggle" className="sr-only" defaultChecked />
                      <div className="block w-10 h-6 rounded-full bg-indigo-600"></div>
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                    <div>
                      <span className="text-white text-sm">Auto-Framing</span>
                      <p className="text-gray-400 text-xs mt-1">
                        Keep you centered in the video
                      </p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" id="framing-toggle" className="sr-only" defaultChecked />
                      <div className="block w-10 h-6 rounded-full bg-indigo-600"></div>
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
        </div>
      </div>;
  };
  // Render the video grid
  const renderVideoGrid = () => {
    const gridClass = () => {
      const count = participants.length;
      if (count <= 1) return 'grid-cols-1';
      if (count <= 4) return 'grid-cols-2';
      if (count <= 9) return 'grid-cols-3';
      return 'grid-cols-4';
    };
    return <div className={`h-full w-full ${layoutMode === 'grid' ? `grid ${gridClass()} gap-2 p-2` : 'relative'}`}>
    {participants.map((participant, index) => <div key={participant.id} className={`
      ${layoutMode === 'grid' ? 'relative' : layoutMode === 'spotlight' ? index === 0 ? 'absolute inset-0' : `absolute h-1/4 w-1/4 bottom-4 right-4 z-10` : layoutMode === 'immersive' ? `absolute ${getImmersivePosition(index)}` : layoutMode === 'holographic' ? `absolute ${getHolographicPosition(index)}` : ''}
              rounded-xl overflow-hidden
              ${participant.speaking && layoutMode !== 'spotlight' ? 'ring-2 ring-green-500' : ''}
              ${participant.raisingHand ? 'ring-2 ring-yellow-500' : ''}
              ${layoutMode === 'holographic' ? 'border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/30' : ''}
            `}>
            {participant.videoOn ? <div className="h-full w-full bg-gray-900 relative">
                <img src={participant.avatar} alt={participant.name} className="h-full w-full object-cover" />
                {/* Holographic effect */}
                {layoutMode === 'holographic' && <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent pointer-events-none"></div>}
                {/* Immersive background */}
                {layoutMode === 'immersive' && virtualBackground && <div className="absolute inset-0 -z-10">
                    <img src={virtualBackground} alt="Background" className="h-full w-full object-cover" />
                  </div>}
              </div> : <div className="h-full w-full flex items-center justify-center bg-gray-800">
                <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-medium">
                  {participant.name.charAt(0)}
                </div>
              </div>}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-white text-sm truncate max-w-[150px]">
                  {participant.name}
                </span>
                {participant.role !== 'attendee' && <span className="ml-1 text-xs px-1 py-0.5 rounded-full bg-gray-700 text-gray-300">
                    {participant.role.charAt(0).toUpperCase()}
                  </span>}
              </div>
              <div className="flex items-center space-x-1">
                {!participant.audioOn && <MicOff className="h-3 w-3 text-red-500" />}
                {participant.sharing && <ScreenShare className="h-3 w-3 text-green-500" />}
              </div>
            </div>
          </div>)}
      </div>;
  };
  // Helper for immersive layout positioning
  const getImmersivePosition = (index: number): string => {
    if (index === 0) return 'inset-0 z-0'; // Main presenter
    const positions = ['top-4 left-4', 'top-4 right-4', 'bottom-4 right-4', 'bottom-4 left-4', 'top-1/2 left-4 -translate-y-1/2', 'top-1/2 right-4 -translate-y-1/2', 'left-1/2 top-4 -translate-x-1/2', 'left-1/2 bottom-4 -translate-x-1/2'];
    const i = (index - 1) % positions.length;
    return `${positions[i]} h-1/5 w-1/5 z-10`;
  };
  // Helper for holographic layout positioning
  const getHolographicPosition = (index: number): string => {
    if (index === 0) return 'bottom-8 left-1/2 -translate-x-1/2 h-1/2 w-1/3 z-10'; // Main presenter
    const angle = (index - 1) * (Math.PI / 7);
    const radius = 40;
    const x = 50 + radius * Math.cos(angle);
    const y = 30 + radius * Math.sin(angle) * 0.5; // Flatten the circle to an oval
    return `top-[${y}%] left-[${x}%] -translate-x-1/2 -translate-y-1/2 h-1/4 w-1/6 z-${10 - index} transform rotate-y-${index * 10}`;
  };
  // Render AI assistant panel
  const renderAiAssistant = () => {
    if (!aiAssistantActive || !isMeetingActive) return null;
    return <div className="absolute top-4 left-4 w-64 bg-black/60 backdrop-blur-lg rounded-xl border border-indigo-500/30 overflow-hidden z-20">
        <div className="p-3 bg-indigo-600 flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-4 w-4 text-white mr-2" />
            <span className="text-white text-sm font-medium">AI Assistant</span>
          </div>
          <button onClick={() => setAiAssistantActive(false)} className="text-white hover:text-gray-200">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-3 space-y-3">
          <div className="bg-indigo-900/30 rounded-lg p-2 text-xs text-white">
            <p className="font-medium mb-1">Meeting Summary</p>
            <p>
              The team is discussing the new wildlife conservation project for
              East African ecosystems.
            </p>
          </div>
          <div className="bg-indigo-900/30 rounded-lg p-2 text-xs text-white">
            <p className="font-medium mb-1">Action Items</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Maria to share the research papers</li>
              <li>James to prepare budget proposal</li>
              <li>Emma to contact local partners</li>
            </ul>
          </div>
          <div className="bg-indigo-900/30 rounded-lg p-2 text-xs text-white">
            <p className="font-medium mb-1">Suggestions</p>
            <p>
              Consider discussing timeline constraints before ending the
              meeting.
            </p>
          </div>
        </div>
      </div>;
  };
  // Render the meeting setup screen
  const renderMeetingSetup = () => {
    return <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-black/60 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-2">Chambers</h2>
            <p className="text-gray-300 mb-6">Advanced Virtual Meeting Space</p>
            <div className="mb-6">
              <div className="relative h-60 bg-gray-900 rounded-xl overflow-hidden mb-4">
                {isVideoOn ? <video ref={videoRef} autoPlay muted className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center">
                    <div className="h-24 w-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-4xl font-medium">
                      {currentUser?.name?.charAt(0) || 'U'}
                    </div>
                  </div>}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button onClick={() => setIsVideoOn(!isVideoOn)} className={`p-2 rounded-full ${!isVideoOn ? 'bg-red-600' : 'bg-gray-800'}`}>
                    {isVideoOn ? <Video className="h-5 w-5 text-white" /> : <VideoOff className="h-5 w-5 text-white" />}
                  </button>
                  <button onClick={() => setIsAudioOn(!isAudioOn)} className={`p-2 rounded-full ${!isAudioOn ? 'bg-red-600' : 'bg-gray-800'}`}>
                    {isAudioOn ? <Mic className="h-5 w-5 text-white" /> : <MicOff className="h-5 w-5 text-white" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-white text-sm mr-2">Meeting Mode:</span>
                  <div className="flex space-x-1">
                    <button onClick={() => setMeetingMode('audio')} className={`px-3 py-1 rounded-md text-xs font-medium ${meetingMode === 'audio' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
                      Audio
                    </button>
                    <button onClick={() => setMeetingMode('video')} className={`px-3 py-1 rounded-md text-xs font-medium ${meetingMode === 'video' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
                      Video
                    </button>
                  </div>
                </div>
                <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="text-white hover:text-gray-300">
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <button onClick={() => setIsCreatingMeeting(!isCreatingMeeting)} className={`w-full py-3 rounded-lg font-medium ${isCreatingMeeting ? 'bg-indigo-700 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                {isCreatingMeeting ? 'Cancel' : 'New Meeting'}
              </button>
              {isCreatingMeeting && <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <select className="flex-1 bg-gray-800 text-white rounded-md border border-white/10 py-2 px-3 text-sm">
                      <option>Instant Meeting</option>
                      <option>Scheduled Meeting</option>
                      <option>Recurring Meeting</option>
                    </select>
                    <button onClick={startMeeting} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
                      Start
                    </button>
                  </div>
                </div>}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-black/60 text-gray-400 text-sm">
                    or
                  </span>
                </div>
              </div>
              <button onClick={() => setIsJoiningMeeting(!isJoiningMeeting)} className={`w-full py-3 rounded-lg font-medium ${isJoiningMeeting ? 'bg-indigo-700 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
                {isJoiningMeeting ? 'Cancel' : 'Join Meeting'}
              </button>
              {isJoiningMeeting && <div className="space-y-3">
                  <input type="text" value={meetingCode} onChange={e => setMeetingCode(e.target.value)} placeholder="Enter meeting code" className="w-full bg-gray-800 text-white rounded-md border border-white/10 py-2 px-3 text-sm" />
                  <button onClick={joinMeeting} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                    Join
                  </button>
                </div>}
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-900 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Cpu className="h-5 w-5 text-indigo-500 mr-2" />
                <span className="text-white text-sm">
                  Quantum-secured connection
                </span>
              </div>
              <div className="flex items-center">
                <Gauge className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 text-xs">100 Mbps</span>
              </div>
            </div>
          </div>
        </div>
      </div>;
  };
  return <div ref={containerRef} className={`h-screen w-full bg-gradient-to-br from-gray-900 to-black overflow-hidden relative ${theme === 'dark' ? 'dark-theme' : theme === 'jungle' ? 'jungle-theme' : theme === 'extra-dark' ? 'extra-dark-theme' : 'light-theme'}`}>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      {/* Futuristic UI elements */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-indigo-500/30 rounded-tl-3xl"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-indigo-500/30 rounded-br-3xl"></div>
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
      {isMeetingActive ? <>
          {/* Main meeting area */}
          <div className="h-full w-full relative">
            {/* Video grid */}
            {renderVideoGrid()}
            {/* Side panel */}
            {renderSidePanel()}
            {/* Meeting controls */}
            {renderMeetingControls()}
            {/* AI assistant */}
            {renderAiAssistant()}
            {/* Screen sharing indicator */}
            {isScreenSharing && <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center z-20">
                <ScreenShare className="h-4 w-4 mr-2" />
                You are sharing your screen
              </div>}
            {/* Raised hand indicator */}
            {isRaisingHand && <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center z-20">
                <HandMetal className="h-4 w-4 mr-2" />
                You raised your hand
              </div>}
          </div>
        </> : renderMeetingSetup()}
      {/* Add custom styling for the futuristic UI */}
  <style>{`
        .control-button {
          @apply p-2 rounded-full text-white;
        }
        .bg-grid-pattern {
          background-image:
            linear-gradient(
              to right,
              rgba(99, 102, 241, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(99, 102, 241, 0.1) 1px,
              transparent 1px
            );
          background-size: 20px 20px;
        }
        .transform.rotate-y-10 {
          transform: rotateY(10deg);
        }
        .transform.rotate-y-20 {
          transform: rotateY(20deg);
        }
        .transform.rotate-y-30 {
          transform: rotateY(30deg);
        }
      `}</style>
    </div>;
};
export default ChambersPage;