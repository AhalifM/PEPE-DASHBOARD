import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye, Search, Filter, RefreshCw } from 'lucide-react';

const Transactions = () => {
  const transactions = [
    {
      id: "TXN-001",
      orderId: "ORD-001",
      customer: "Ahmad Rahman",
      amount: "RM 150.50",
      status: "paid",
      paymentMethod: "Online Banking",
      date: "2024-01-15 14:30",
      receiptId: "RCP-001"
    },
    {
      id: "TXN-002",
      orderId: "ORD-002",
      customer: "Sarah Lee",
      amount: "RM 89.20",
      status: "pending",
      paymentMethod: "Credit Card",
      date: "2024-01-15 13:45",
      receiptId: "RCP-002"
    },
    {
      id: "TXN-003",
      orderId: "ORD-003",
      customer: "Kumar Singh",
      amount: "RM 234.80",
      status: "failed",
      paymentMethod: "E-Wallet",
      date: "2024-01-15 12:20",
      receiptId: "RCP-003"
    },
    {
      id: "TXN-004",
      orderId: "ORD-004",
      customer: "Fatimah Ali",
      amount: "RM 67.90",
      status: "paid",
      paymentMethod: "Cash",
      date: "2024-01-15 11:15",
      receiptId: "RCP-004"
    },
    {
      id: "TXN-005",
      orderId: "ORD-005",
      customer: "Wong Wei Ming",
      amount: "RM 123.45",
      status: "processing",
      paymentMethod: "Online Banking",
      date: "2024-01-15 10:30",
      receiptId: "RCP-005"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const summary = {
    totalTransactions: transactions.length,
    totalAmount: transactions.reduce((sum, txn) => sum + parseFloat(txn.amount.replace('RM ', '')), 0),
    paidTransactions: transactions.filter(txn => txn.status === 'paid').length,
    pendingTransactions: transactions.filter(txn => txn.status === 'pending').length,
  };

  return (
    <PageLayout title="Transaction Management" description="Desktop-friendly dashboard to view and manage all transactions">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalTransactions}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">RM {summary.totalAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Revenue generated</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{summary.paidTransactions}</div>
              <p className="text-xs text-muted-foreground">Successfully completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{summary.pendingTransactions}</div>
              <p className="text-xs text-muted-foreground">Awaiting payment</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
            <CardDescription>Find specific transactions quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by customer, transaction ID, or order ID..." className="pl-8" />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="online-banking">Online Banking</SelectItem>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="e-wallet">E-Wallet</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>More Filters</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>Complete transaction history with payment status and receipt management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>
                        <Button variant="link" className="p-0 h-auto">
                          {transaction.orderId}
                        </Button>
                      </TableCell>
                      <TableCell>{transaction.customer}</TableCell>
                      <TableCell className="font-medium">{transaction.amount}</TableCell>
                      <TableCell>{transaction.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{transaction.date}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" title="View Receipt">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" title="Download Receipt">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" title="View Raw JSON">
                            <span className="text-xs">JSON</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Raw JSON Viewer */}
        <Card>
          <CardHeader>
            <CardTitle>Raw Transaction Data</CardTitle>
            <CardDescription>Developer and accounting view of transaction details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <pre>
{`{
  "transaction_id": "TXN-001",
  "order_id": "ORD-001",
  "customer": {
    "name": "Ahmad Rahman",
    "phone": "+60123456789",
    "email": "ahmad@example.com"
  },
  "amount": {
    "currency": "MYR",
    "value": 150.50,
    "formatted": "RM 150.50"
  },
  "payment": {
    "method": "online_banking",
    "gateway": "maybank",
    "status": "completed",
    "reference": "PAY-123456789"
  },
  "timestamp": "2024-01-15T14:30:00Z",
  "receipt": {
    "id": "RCP-001",
    "url": "/receipts/RCP-001.pdf",
    "sent_via": ["whatsapp", "email"]
  }
}`}
              </pre>
            </div>
            <Button variant="outline" className="mt-4">
              <Download className="h-4 w-4 mr-2" />
              Export All as JSON
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Transactions;
