import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { 
  Avatar, Box, Button, Container, List, ListItem, ListItemAvatar, 
  ListItemText, TextField, Typography, Badge, Chip, CircularProgress 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import styled from '@emotion/styled';

const socket = io(`${import.meta.env.VITE_API_URL}`);

const ChatContainer = styled(Container)({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
  backgroundColor: '#f5f5f5',
});

const MessageList = styled(List)({
  flexGrow: 1,
  overflowY: 'auto',
  marginBottom: '20px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  padding: 0,
});

const MessageItem = styled(ListItem)(({ iscurrentuser }) => ({
  flexDirection: iscurrentuser ? 'row-reverse' : 'row',
  alignItems: 'flex-start',
  padding: '8px 16px',
}));

const MessageBubble = styled(Box)(({ iscurrentuser }) => ({
  backgroundColor: iscurrentuser ? '#1976d2' : '#e0e0e0',
  color: iscurrentuser ? 'white' : 'black',
  borderRadius: '18px',
  padding: '8px 16px',
  maxWidth: '70%',
  wordBreak: 'break-word',
  position: 'relative',
}));

const TimestampText = styled(Typography)(({ iscurrentuser }) => ({
  fontSize: '0.75rem',
  color: iscurrentuser ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
  textAlign: iscurrentuser ? 'right' : 'left',
  marginTop: '4px',
}));

const StatusIcon = styled(DoneAllIcon)(({ status }) => ({
  fontSize: '1rem',
  marginLeft: '4px',
  color: status === 'read' ? '#4fc3f7' : 'rgba(255,255,255,0.7)',
}));

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);
  const [username] = useState(`User${Math.floor(Math.random() * 1000)}`);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Register user and setup socket events
  useEffect(() => {
    socket.emit('register_user', { username, userId });

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/chat/messages`);
        setMessages(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setLoading(false);
      }
    };

    fetchMessages();

    socket.on('receive_message', (data) => {
      setMessages(prev => [...prev, data]);
      // Mark as read if it's our message
      if (data.userId !== userId) {
        socket.emit('mark_as_read', data._id);
      }
    });

    socket.on('message_delivered', (data) => {
      setMessages(prev => prev.map(msg => 
        msg.tempId === data.tempId ? { ...data, status: 'delivered' } : msg
      ));
    });

    socket.on('message_read', ({ messageId, userId: readerId }) => {
      setMessages(prev => prev.map(msg => 
        msg._id === messageId 
          ? { 
              ...msg, 
              readBy: [...(msg.readBy || []), readerId],
              status: msg.userId === userId ? 'read' : msg.status
            } 
          : msg
      ));
    });

    socket.on('user_typing', ({ username, isTyping }) => {
      setTypingUsers(prev => 
        isTyping 
          ? [...prev.filter(u => u !== username), username]
          : prev.filter(u => u !== username)
      );
    });

    socket.on('user_list_updated', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off('receive_message');
      socket.off('message_delivered');
      socket.off('message_read');
      socket.off('user_typing');
      socket.off('user_list_updated');
    };
  }, [userId, username]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle typing indicator
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing', false);
    }, 2000);
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    
    const tempId = Date.now().toString();
    const newMessage = {
      tempId,
      username,
      userId,
      message,
      timestamp: new Date(),
      status: 'sending'
    };

    // Optimistic update
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    socket.emit('send_message', newMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <ChatContainer maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#1976d2', fontWeight: 'bold' }}>
        Chat Room
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Chip 
          label={`Online: ${onlineUsers.length}`} 
          color="success" 
          size="small" 
          variant="outlined" 
        />
        {typingUsers.length > 0 && (
          <Chip
            label={`${typingUsers.join(', ')} ${typingUsers.length > 1 ? 'are' : 'is'} typing...`}
            color="info"
            size="small"
          />
        )}
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <MessageList>
            {messages.map((msg, i) => (
              <MessageItem key={msg._id || msg.tempId} iscurrentuser={msg.userId === userId}>
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    color={onlineUsers.some(u => u.userId === msg.userId) ? 'success' : 'default'}
                  >
                    <Avatar sx={{ bgcolor: msg.userId === userId ? '#1976d2' : '#e0e0e0' }}>
                      {msg.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <MessageBubble iscurrentuser={msg.userId === userId}>
                  <Typography variant="body1">{msg.message}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TimestampText iscurrentuser={msg.userId === userId}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TimestampText>
                    {msg.userId === userId && (
                      <StatusIcon status={msg.status === 'read' ? 'read' : 'delivered'} />
                    )}
                  </Box>
                </MessageBubble>
              </MessageItem>
            ))}
            <div ref={messagesEndRef} />
          </MessageList>
          
          <Box sx={{ display: 'flex', gap: '10px', padding: '10px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <TextField
              fullWidth
              variant="outlined"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              multiline
              maxRows={4}
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={sendMessage}
              disabled={!message.trim() || loading}
              endIcon={<SendIcon />}
              sx={{ height: '40px' }}
            >
              Send
            </Button>
          </Box>
        </>
      )}
    </ChatContainer>
  );
}

export default ChatApp;