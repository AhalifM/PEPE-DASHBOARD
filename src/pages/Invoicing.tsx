import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Receipt, Download, Send, Eye, Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const Invoicing = () => {
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock invoice data
  const invoices = [
    {
      id: 'INV-001',
      customer: 'Ahmad Rahman',
      amount: 'RM 3,200.00',
      status: 'paid',
      date: '2024-01-15',
      dueDate: '2024-01-30',
      items: [{ name: '2x Dell Laptops', qty: 2, price: 1600 }]
    },
    {
      id: 'INV-002',
      customer: 'Siti Nurhaliza',
      amount: 'RM 4,899.00',
      status: 'sent',
      date: '2024-01-14',
      dueDate: '2024-01-29',
      items: [{ name: '1x iPhone 15 Pro', qty: 1, price: 4899 }]
    },
    {
      id: 'INV-003',
      customer: 'John Tan',
      amount: 'RM 1,350.00',
      status: 'draft',
      date: '2024-01-13',
      dueDate: '2024-01-28',
      items: [{ name: '3x Office Chairs', qty: 3, price: 450 }]
    },
    {
      id: 'INV-004',
      customer: 'Mary Wong',
      amount: 'RM 2,500.00',
      status: 'overdue',
      date: '2024-01-10',
      dueDate: '2024-01-25',
      items: [{ name: '1x Desktop PC', qty: 1, price: 2500 }]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = invoices.reduce((sum, inv) => {
    const amount = parseFloat(inv.amount.replace('RM ', '').replace(',', ''));
    return sum + amount;
  }, 0);

  const paidAmount = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => {
      const amount = parseFloat(inv.amount.replace('RM ', '').replace(',', ''));
      return sum + amount;
    }, 0);

  return (
    <PageLayout title="Auto e-Invoicing & Receipts">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Invoices</p>
                  <p className="text-2xl font-bold">{invoices.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">RM {totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Paid Amount</p>
                  <p className="text-2xl font-bold">RM {paidAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding</p>
                  <p className="text-2xl font-bold">RM {(totalAmount - paidAmount).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions and Search */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Invoice Management</CardTitle>
              <Dialog open={showCreateInvoice} onOpenChange={setShowCreateInvoice}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customer">Customer Name</Label>
                        <Input id="customer" placeholder="Enter customer name" />
                      </div>
                      <div>
                        <Label htmlFor="email">Customer Email</Label>
                        <Input id="email" type="email" placeholder="customer@email.com" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Invoice Date</Label>
                        <Input id="date" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="due">Due Date</Label>
                        <Input id="due" type="date" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="items">Items</Label>
                      <Textarea 
                        id="items" 
                        placeholder="Item 1 - Quantity: 2 - Price: RM 100&#10;Item 2 - Quantity: 1 - Price: RM 200"
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => setShowCreateInvoice(false)}>Save as Draft</Button>
                      <Button variant="outline" onClick={() => setShowCreateInvoice(false)}>
                        Send Invoice
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Invoice List */}
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Receipt className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{invoice.id}</p>
                      <p className="text-sm text-muted-foreground">{invoice.customer}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{invoice.amount}</p>
                      <p className="text-sm text-muted-foreground">Due: {invoice.dueDate}</p>
                    </div>
                    
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <Receipt className="h-6 w-6" />
                <span>Auto-generate from Chat Order</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <Send className="h-6 w-6" />
                <span>Send Bulk Reminders</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <Download className="h-6 w-6" />
                <span>Export All Invoices</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Invoicing;