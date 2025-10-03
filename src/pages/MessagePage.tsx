import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Send as SendIcon, Paperclip as PaperclipIcon, Smile as SmileIcon, Search as SearchIcon, MoreVertical as MoreVerticalIcon, Phone as PhoneIcon, Video as VideoIcon, User as UserIcon, MessageSquare as MessageSquareIcon } from 'lucide-react';
// Mock data for users and messages
type User = {
  id: number;
  name: string;
  role: string;
  status: string;
  avatar: null;
  unread: number;
};
type Message = {
  id: number;
  sender: number | 'me';
  text: string;
  time: string;
  date: string;
};
const mockUsers: User[] = [{
  id: 1,
  name: 'Muli Robert',
  role: 'student',
  status: 'online',
  avatar: null,
  unread: 3
}, {
  id: 2,
  name: 'Sarah Johnson',
  role: 'lecturer',
  status: 'offline',
  avatar: null,
  unread: 0
}, {
  id: 3,
  name: 'Michael Brown',
  role: 'admin',
  status: 'online',
  avatar: null,
  unread: 1
}, {
  id: 4,
  name: 'Emma Wilson',
  role: 'student',
  status: 'away',
  avatar: null,
  unread: 0
}, {
  id: 5,
  name: 'David Lee',
  role: 'lecturer',
  status: 'online',
  avatar: null,
  unread: 5
}];
const mockMessages: Record<number, Message[]> = {
  1: [{
    id: 1,
    sender: 1,
    text: 'Hello, I have a question about the assignment',
    time: '10:30 AM',
    date: '2023-06-10'
  }, {
    id: 2,
    sender: 'me',
    text: 'Sure, what do you need help with?',
    time: '10:32 AM',
    date: '2023-06-10'
  }, {
    id: 3,
    sender: 1,
    text: "I'm confused about question #3",
    time: '10:33 AM',
    date: '2023-06-10'
  }, {
    id: 4,
    sender: 'me',
    text: 'Let me explain that one...',
    time: '10:35 AM',
    date: '2023-06-10'
  }, {
    id: 5,
    sender: 1,
    text: 'That makes sense now, thank you!',
    time: '10:40 AM',
    date: '2023-06-10'
  }],
  2: [{
    id: 1,
    sender: 2,
    text: 'Hi there, can we discuss the curriculum?',
    time: '09:15 AM',
    date: '2023-06-09'
  }, {
    id: 2,
    sender: 'me',
    text: "Yes, I'm available now",
    time: '09:20 AM',
    date: '2023-06-09'
  }],
  3: [{
    id: 1,
    sender: 3,
    text: 'Please review the system update notes',
    time: '02:45 PM',
    date: '2023-06-08'
  }, {
    id: 2,
    sender: 'me',
    text: "I'll check them right away",
    time: '03:00 PM',
    date: '2023-06-08'
  }],
  4: [],
  5: [{
    id: 1,
    sender: 5,
    text: 'The course materials have been updated',
    time: '11:20 AM',
    date: '2023-06-07'
  }, {
    id: 2,
    sender: 'me',
    text: "Great, I'll take a look",
    time: '11:25 AM',
    date: '2023-06-07'
  }, {
    id: 3,
    sender: 5,
    text: 'Let me know if you need anything else',
    time: '11:30 AM',
    date: '2023-06-07'
  }, {
    id: 4,
    sender: 5,
    text: "Also, there's a new assessment coming up",
    time: '11:32 AM',
    date: '2023-06-07'
  }, {
    id: 5,
    sender: 5,
    text: 'Please prepare your students',
    time: '11:33 AM',
    date: '2023-06-07'
  }]
};
const MessagePage = () => {
  useAuth(); // currentUser not used
  useTheme(); // theme not used
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.role.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);
  // Load messages when a user is selected
  useEffect(() => {
    if (selectedUser) {
      setMessages(mockMessages[selectedUser.id] || []);
      // Mark messages as read when selected
      if (selectedUser.unread > 0) {
        setUsers(prev => prev.map(user => user.id === selectedUser.id ? {
          ...user,
          unread: 0
        } : user));
      }
    }
  }, [selectedUser]);
  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedUser) return;
  const newMsg: Message = {
      id: messages.length + 1,
      sender: 'me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      date: new Date().toISOString().split('T')[0]
    };
    // Update messages
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    // Update mock data
    mockMessages[selectedUser.id] = updatedMessages;
    // Clear input
    setNewMessage('');
  };
  // Get status indicator color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };
  return <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
          Messages
        </h1>
        <p className="text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
          Communicate with other users on the platform
        </p>
      </div>
      <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <div className="flex h-[calc(100vh-250px)] min-h-[500px]">
          {/* Contacts sidebar */}
          <div className="w-1/3 border-r border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700">
              <div className="relative">
                <input type="text" placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-400 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100" />
                <div className="absolute left-3 top-2.5">
                  <SearchIcon className="h-5 w-5 text-gray-400 dark:text-blue-500 jungle:text-green-500 extra-dark:text-gray-500" />
                </div>
              </div>
            </div>
            <div className="overflow-y-auto h-full pb-16">
              {filteredUsers.map(user => <div key={user.id} className={`p-4 border-b border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 cursor-pointer ${selectedUser?.id === user.id ? 'bg-gray-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-blue-900/50 jungle:hover:bg-green-800/50 extra-dark:hover:bg-gray-800/50'}`} onClick={() => setSelectedUser(user as User)}>
                  <div className="flex items-center">
                    <div className="relative flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-blue-800 jungle:bg-green-700 extra-dark:bg-gray-700 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-indigo-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300" />
                      </div>
                      <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${getStatusColor(user.status)} border-2 border-white dark:border-blue-950 jungle:border-green-900 extra-dark:border-gray-900`}></div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                          {user.name}
                        </p>
                        {user.unread > 0 && <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                            {user.unread}
                          </span>}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
          {/* Chat area */}
          <div className="w-2/3 flex flex-col">
            {selectedUser ? <>
                {/* Chat header */}
                <div className="p-4 border-b border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-blue-800 jungle:bg-green-700 extra-dark:bg-gray-700 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-indigo-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300" />
                      </div>
                      <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${getStatusColor(selectedUser.status)} border-2 border-white dark:border-blue-950 jungle:border-green-900 extra-dark:border-gray-900`}></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                        {selectedUser.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 capitalize">
                        {selectedUser.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-full text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-blue-900 jungle:hover:bg-green-800 extra-dark:hover:bg-gray-800">
                      <PhoneIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-full text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-blue-900 jungle:hover:bg-green-800 extra-dark:hover:bg-gray-800">
                      <VideoIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-full text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-blue-900 jungle:hover:bg-green-800 extra-dark:hover:bg-gray-800">
                      <MoreVerticalIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  {messages.length === 0 ? <div className="flex flex-col items-center justify-center h-full">
                      <MessageSquareIcon className="h-12 w-12 text-gray-300 dark:text-blue-700 jungle:text-green-700 extra-dark:text-gray-700 mb-2" />
                      <p className="text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
                        No messages yet. Start a conversation!
                      </p>
                    </div> : <div className="space-y-4">
                      {messages.map(message => <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === 'me' ? 'bg-indigo-600 dark:bg-blue-600 jungle:bg-green-600 extra-dark:bg-gray-600 text-white' : 'bg-gray-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-gray-800 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100'}`}>
                            <p>{message.text}</p>
                            <p className={`text-xs mt-1 ${message.sender === 'me' ? 'text-indigo-200 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300' : 'text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400'}`}>
                              {message.time}
                            </p>
                          </div>
                        </div>)}
                    </div>}
                </div>
                {/* Message input */}
                <div className="p-4 border-t border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700">
                  <form onSubmit={handleSendMessage} className="flex items-center">
                    <button type="button" className="p-2 rounded-full text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-blue-900 jungle:hover:bg-green-800 extra-dark:hover:bg-gray-800">
                      <PaperclipIcon className="h-5 w-5" />
                    </button>
                    <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 mx-2 p-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100" />
                    <button type="button" className="p-2 rounded-full text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-blue-900 jungle:hover:bg-green-800 extra-dark:hover:bg-gray-800">
                      <SmileIcon className="h-5 w-5" />
                    </button>
                    <button type="submit" className="ml-2 p-2 rounded-full bg-indigo-600 dark:bg-blue-600 jungle:bg-green-600 extra-dark:bg-gray-600 text-white hover:bg-indigo-700 dark:hover:bg-blue-700 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700">
                      <SendIcon className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              </> : <div className="flex flex-col items-center justify-center h-full">
                <MessageSquareIcon className="h-16 w-16 text-gray-300 dark:text-blue-700 jungle:text-green-700 extra-dark:text-gray-700 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-2">
                  Your Messages
                </h3>
                <p className="text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 text-center max-w-xs">
                  Select a contact to start messaging. You can communicate with
                  all users on the platform.
                </p>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default MessagePage;