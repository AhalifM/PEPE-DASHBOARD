import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Send, Eye, Plus } from 'lucide-react';

const Invoicing = () => {
  const invoices = [
    {
      id: "INV-2024-001",
      customer: "Ahmad Rahman",
      amount: "RM 150.50",
      status: "sent",
      date: "2024-01-15",
      dueDate: "2024-01-30",
      items: 3
    },
    {
      id: "INV-2024-002",
      customer: "Sarah Lee",
      amount: "RM 89.20",
      status: "paid",
      date: "2024-01-14",
      dueDate: "2024-01-29",
      items: 2
    },
    {
      id: "INV-2024-003",
      customer: "Kumar Singh",
      amount: "RM 234.80",
      status: "overdue",
      date: "2024-01-10",
      dueDate: "2024-01-25",
      items: 5
    },
    {
      id: "INV-2024-004",
      customer: "Fatimah Ali",
      amount: "RM 67.90",
      status: "draft",
      date: "2024-01-16",
      dueDate: "2024-01-31",
      items: 1
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageLayout title="Auto e-Invoicing & Receipts" description="Generate, send, and manage invoices automatically">
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Create and manage invoices efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>New Invoice</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Auto-Generate from Order</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Send className="h-4 w-4" />
                <span>Send via WhatsApp</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Invoice Generator */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Invoice</CardTitle>
              <CardDescription>Auto-generate invoices from completed orders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ahmad">Ahmad Rahman</SelectItem>
                    <SelectItem value="sarah">Sarah Lee</SelectItem>
                    <SelectItem value="kumar">Kumar Singh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="order">Related Order</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select order (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ord001">ORD-001 - RM 15.50</SelectItem>
                    <SelectItem value="ord002">ORD-002 - RM 12.80</SelectItem>
                    <SelectItem value="ord003">ORD-003 - RM 18.60</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (RM)</Label>
                  <Input id="amount" placeholder="0.00" type="number" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input id="due-date" type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional notes or payment instructions..." />
              </div>

              <Button className="w-full">
                Generate Invoice
              </Button>
            </CardContent>
          </Card>

          {/* Invoice Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Preview</CardTitle>
              <CardDescription>Live preview of generated invoice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-white">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold">PEPE Business Platform</h2>
                  <p className="text-sm text-muted-foreground">Invoice</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p className="font-medium">Bill To:</p>
                    <p>Customer Name</p>
                    <p>Phone Number</p>
                  </div>
                  <div className="text-right">
                    <p><span className="font-medium">Invoice #:</span> INV-2024-XXX</p>
                    <p><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
                    <p><span className="font-medium">Due:</span> --</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-3 gap-4 text-sm font-medium mb-2">
                    <p>Item</p>
                    <p className="text-center">Qty</p>
                    <p className="text-right">Amount</p>
                  </div>
                  <div className="border-b pb-4 mb-4 text-sm text-muted-foreground">
                    <p className="text-center py-8">Items will appear here</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">Total: RM 0.00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoices List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>View and manage all generated invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold">{invoice.id}</h3>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{invoice.customer}</p>
                      <p className="text-xs text-muted-foreground">
                        {invoice.items} items • Due: {invoice.dueDate}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="font-bold text-lg">{invoice.amount}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          PDF
                        </Button>
                        <Button size="sm" variant="outline">
                          <Send className="h-3 w-3 mr-1" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Settings</CardTitle>
            <CardDescription>Configure auto-generation and delivery preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Auto-generate for orders above</Label>
                <Input placeholder="RM 10.00" />
              </div>
              <div className="space-y-2">
                <Label>Default payment terms (days)</Label>
                <Input placeholder="15" type="number" />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp sending preference</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-send</SelectItem>
                    <SelectItem value="manual">Manual approval</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Email backup</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Invoicing;
