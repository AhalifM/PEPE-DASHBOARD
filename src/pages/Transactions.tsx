import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Database, Search, Download, Eye, Filter, Code, Receipt } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Mock transaction data
  const transactions = [
    {
      id: 'TXN-001',
      date: '2024-01-15 10:30:00',
      customer: 'Ahmad Rahman',
      amount: 3200.00,
      status: 'paid',
      method: 'Bank Transfer',
      orderId: 'ORD-001',
      description: '2x Dell Laptops',
      rawData: {
        transactionId: 'TXN-001',
        timestamp: '2024-01-15T10:30:00Z',
        amount: 3200.00,
        currency: 'MYR',
        paymentMethod: 'bank_transfer',
        gateway: 'fpx',
        customerData: {
          name: 'Ahmad Rahman',
          phone: '+60123456789',
          email: 'ahmad@email.com'
        }
      }
    },
    {
      id: 'TXN-002',
      date: '2024-01-14 15:45:00',
      customer: 'Siti Nurhaliza',
      amount: 4899.00,
      status: 'paid',
      method: 'E-Wallet',
      orderId: 'ORD-002',
      description: '1x iPhone 15 Pro',
      rawData: {
        transactionId: 'TXN-002',
        timestamp: '2024-01-14T15:45:00Z',
        amount: 4899.00,
        currency: 'MYR',
        paymentMethod: 'ewallet',
        gateway: 'grabpay'
      }
    },
    {
      id: 'TXN-003',
      date: '2024-01-13 09:15:00',
      customer: 'John Tan',
      amount: 1350.00,
      status: 'pending',
      method: 'Credit Card',
      orderId: 'ORD-003',
      description: '3x Office Chairs',
      rawData: {
        transactionId: 'TXN-003',
        timestamp: '2024-01-13T09:15:00Z',
        amount: 1350.00,
        currency: 'MYR',
        paymentMethod: 'credit_card',
        gateway: 'stripe'
      }
    },
    {
      id: 'TXN-004',
      date: '2024-01-12 14:20:00',
      customer: 'Mary Wong',
      amount: 850.00,
      status: 'failed',
      method: 'Bank Transfer',
      orderId: 'ORD-004',
      description: '1x Wireless Speaker',
      rawData: {
        transactionId: 'TXN-004',
        timestamp: '2024-01-12T14:20:00Z',
        amount: 850.00,
        currency: 'MYR',
        paymentMethod: 'bank_transfer',
        gateway: 'fpx',
        error: 'insufficient_funds'
      }
    },
    {
      id: 'TXN-005',
      date: '2024-01-11 11:30:00',
      customer: 'David Lim',
      amount: 2100.00,
      status: 'paid',
      method: 'QR Pay',
      orderId: 'ORD-005',
      description: '1x Gaming Monitor',
      rawData: {
        transactionId: 'TXN-005',
        timestamp: '2024-01-11T11:30:00Z',
        amount: 2100.00,
        currency: 'MYR',
        paymentMethod: 'qr_pay',
        gateway: 'duitnow'
      }
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = transactions
    .filter(t => t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <PageLayout title="Transaction Management">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold">{transactions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">RM {totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">RM {pendingAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">
                    {Math.round((transactions.filter(t => t.status === 'paid').length / transactions.length) * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Transaction Table */}
            <div className="border rounded-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Transaction ID</th>
                      <th className="text-left p-4 font-medium">Date & Time</th>
                      <th className="text-left p-4 font-medium">Customer</th>
                      <th className="text-left p-4 font-medium">Amount</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Method</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-muted/25">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{transaction.id}</p>
                            <p className="text-sm text-muted-foreground">{transaction.orderId}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm">{transaction.date}</p>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{transaction.customer}</p>
                            <p className="text-sm text-muted-foreground">{transaction.description}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-medium">RM {transaction.amount.toLocaleString()}</p>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <p className="text-sm">{transaction.method}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Receipt className="h-4 w-4" />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedTransaction(transaction)}
                                >
                                  <Code className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Raw Transaction Data - {transaction.id}</DialogTitle>
                                </DialogHeader>
                                <div className="bg-muted p-4 rounded-lg">
                                  <pre className="text-sm overflow-auto">
                                    {JSON.stringify(transaction.rawData, null, 2)}
                                  </pre>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download JSON
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Copy to Clipboard
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Developer Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Developer & Accounting Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <Code className="h-6 w-6" />
                <span>API Documentation</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <Download className="h-6 w-6" />
                <span>Export for Accounting</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <Database className="h-6 w-6" />
                <span>Database Backup</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Transactions;