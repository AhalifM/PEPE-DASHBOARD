import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Phone, User, Clock, CheckCircle, Package } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const ChatOrders = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');

  // Mock chat data
  const chats = [
    {
      id: 1,
      customer: 'Ahmad Rahman',
      phone: '+60123456789',
      lastMessage: 'Hi, I want to order 2 laptops',
      timestamp: '10:30 AM',
      status: 'new',
      unread: 2,
      orders: [
        { id: 'ORD001', item: '2x Dell Laptops', amount: 'RM 3,200', status: 'pending' }
      ]
    },
    {
      id: 2,
      customer: 'Siti Nurhaliza',
      phone: '+60198765432',
      lastMessage: 'Payment completed for my order',
      timestamp: '9:45 AM',
      status: 'paid',
      unread: 0,
      orders: [
        { id: 'ORD002', item: '1x iPhone 15 Pro', amount: 'RM 4,899', status: 'paid' }
      ]
    },
    {
      id: 3,
      customer: 'John Tan',
      phone: '+60167890123',
      lastMessage: 'Can you send me the receipt?',
      timestamp: 'Yesterday',
      status: 'completed',
      unread: 1,
      orders: [
        { id: 'ORD003', item: '3x Office Chairs', amount: 'RM 1,350', status: 'delivered' }
      ]
    }
  ];

  const mockMessages = {
    1: [
      { sender: 'customer', text: 'Hi, I want to order 2 laptops', time: '10:25 AM' },
      { sender: 'business', text: 'Hello! What specifications are you looking for?', time: '10:26 AM' },
      { sender: 'customer', text: 'Intel i7, 16GB RAM, 512GB SSD', time: '10:28 AM' },
      { sender: 'business', text: 'Perfect! I have Dell Inspiron 15 that matches. RM 1,600 each. Total RM 3,200 for 2 units.', time: '10:29 AM' },
      { sender: 'customer', text: 'Sounds good! How do I pay?', time: '10:30 AM' }
    ],
    2: [
      { sender: 'customer', text: 'Hi, I want iPhone 15 Pro', time: '9:40 AM' },
      { sender: 'business', text: 'Available in all colors. RM 4,899. Which color?', time: '9:41 AM' },
      { sender: 'customer', text: 'Natural Titanium please', time: '9:42 AM' },
      { sender: 'business', text: 'Perfect! Please transfer to this account: 1234567890', time: '9:43 AM' },
      { sender: 'customer', text: 'Payment completed for my order', time: '9:45 AM' }
    ]
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      // Here you would normally send the message to your backend
      setMessage('');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageLayout title="Chat-Based Orders">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Chat List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Customer Chats
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedChat?.id === chat.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{chat.customer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {chat.unread > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {chat.unread}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                    {chat.lastMessage}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(chat.status)}>
                      {chat.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{chat.phone}</span>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2">
          {selectedChat ? (
            <>
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {selectedChat.customer}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {selectedChat.phone}
                    </p>
                  </div>
                  <Badge className={getStatusColor(selectedChat.status)}>
                    {selectedChat.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-0 flex flex-col h-[400px]">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {mockMessages[selectedChat.id]?.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.sender === 'business' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                            msg.sender === 'business'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender === 'business' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Order Summary */}
                {selectedChat.orders.length > 0 && (
                  <div className="border-t p-4 bg-muted/30">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Current Orders
                    </h4>
                    {selectedChat.orders.map((order) => (
                      <div key={order.id} className="flex justify-between items-center p-2 bg-background rounded border">
                        <div>
                          <p className="font-medium text-sm">{order.item}</p>
                          <p className="text-xs text-muted-foreground">Order #{order.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{order.amount}</p>
                          <Badge variant="outline" className="text-xs">
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm">
                      Send Invoice
                    </Button>
                    <Button variant="outline" size="sm">
                      Payment Link
                    </Button>
                    <Button variant="outline" size="sm">
                      Order Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Select a chat</h3>
                <p className="text-muted-foreground">Choose a customer chat to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </PageLayout>
  );
};

export default ChatOrders;