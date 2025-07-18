import { Timestamp } from 'firebase/firestore';
import FirebaseService, { 
  BusinessProfile, 
  Order, 
  Invoice, 
  Transaction, 
  CreditApplication 
} from '@/lib/firebaseService';

// Sample data generators for testing
export const generateSampleBusinessProfile = (): Omit<BusinessProfile, 'id' | 'createdAt' | 'updatedAt'> => ({
  businessName: "PEPE Trading Sdn Bhd",
  email: "admin@pepetrading.com",
  phone: "+60123456789",
  address: "Jalan Bukit Bintang, 55100 Kuala Lumpur, Malaysia",
  industry: "Trading & Distribution",
  registrationNumber: "202001234567",
  taxId: "C12345678901",
  creditScore: 785,
  monthlyRevenue: 45000
});

export const generateSampleOrders = (businessId: string, count = 10): Omit<Order, 'id' | 'createdAt' | 'updatedAt'>[] => {
  const orders = [];
  const statuses: Array<'pending' | 'processing' | 'completed' | 'cancelled'> = ['pending', 'processing', 'completed', 'cancelled'];
  const customers = [
    { name: "Ahmad Trading", email: "ahmad@trading.com" },
    { name: "Lim Corporation", email: "lim@corp.com" },
    { name: "Siti Enterprise", email: "siti@enterprise.com" },
    { name: "Kumar Supplies", email: "kumar@supplies.com" },
    { name: "Wong Industries", email: "wong@industries.com" }
  ];

  for (let i = 0; i < count; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const products = [
      {
        name: `Product ${i + 1}`,
        quantity: Math.floor(Math.random() * 10) + 1,
        price: Math.floor(Math.random() * 500) + 50
      }
    ];
    
    orders.push({
      businessId,
      customerName: customer.name,
      customerEmail: customer.email,
      products,
      totalAmount: products.reduce((sum, p) => sum + (p.quantity * p.price), 0),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      orderDate: Timestamp.fromDate(new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000))
    });
  }

  return orders;
};

export const generateSampleInvoices = (businessId: string, count = 8): Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>[] => {
  const invoices = [];
  const statuses: Array<'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'> = ['draft', 'sent', 'paid', 'overdue'];
  const customers = [
    { name: "Ahmad Trading", email: "ahmad@trading.com" },
    { name: "Lim Corporation", email: "lim@corp.com" },
    { name: "Siti Enterprise", email: "siti@enterprise.com" }
  ];

  for (let i = 0; i < count; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const items = [
      {
        description: `Service ${i + 1}`,
        quantity: 1,
        rate: Math.floor(Math.random() * 1000) + 100,
        amount: Math.floor(Math.random() * 1000) + 100
      }
    ];
    
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.06; // 6% GST
    
    invoices.push({
      businessId,
      invoiceNumber: `INV-${String(i + 1).padStart(4, '0')}`,
      customerName: customer.name,
      customerEmail: customer.email,
      items,
      subtotal,
      tax,
      total: subtotal + tax,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      dueDate: Timestamp.fromDate(new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000))
    });
  }

  return invoices;
};

export const generateSampleTransactions = (businessId: string, count = 20): Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>[] => {
  const transactions = [];
  const incomeCategories = ['Sales', 'Consulting', 'Interest', 'Other Income'];
  const expenseCategories = ['Office Supplies', 'Marketing', 'Travel', 'Utilities', 'Rent'];

  for (let i = 0; i < count; i++) {
    const isIncome = Math.random() > 0.3; // 70% income, 30% expense
    const categories = isIncome ? incomeCategories : expenseCategories;
    
    transactions.push({
      businessId,
      type: isIncome ? 'income' : 'expense',
      category: categories[Math.floor(Math.random() * categories.length)],
      description: `${isIncome ? 'Payment received' : 'Payment made'} for ${categories[Math.floor(Math.random() * categories.length)]}`,
      amount: Math.floor(Math.random() * 5000) + (isIncome ? 500 : 100),
      date: Timestamp.fromDate(new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)),
      reference: `REF-${String(i + 1).padStart(6, '0')}`
    });
  }

  return transactions;
};

export const generateSampleCreditApplications = (businessId: string): Omit<CreditApplication, 'id' | 'createdAt' | 'updatedAt'>[] => {
  return [
    {
      businessId,
      type: 'business_loan',
      requestedAmount: 100000,
      purpose: 'Business expansion and inventory purchase',
      status: 'approved',
      applicationDate: Timestamp.fromDate(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000))
    },
    {
      businessId,
      type: 'credit_line',
      requestedAmount: 50000,
      purpose: 'Working capital and cash flow management',
      status: 'under_review',
      applicationDate: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000))
    }
  ];
};

// Function to populate database with sample data
export const populateSampleData = async (businessId: string) => {
  try {
    console.log('Creating sample business profile...');
    // Create business profile
    await FirebaseService.createBusinessProfile({
      ...generateSampleBusinessProfile()
    });

    console.log('Creating sample orders...');
    // Create sample orders
    const orders = generateSampleOrders(businessId, 5);
    for (const order of orders) {
      await FirebaseService.createOrder(order);
    }

    console.log('Creating sample invoices...');
    // Create sample invoices
    const invoices = generateSampleInvoices(businessId, 4);
    for (const invoice of invoices) {
      await FirebaseService.createInvoice(invoice);
    }

    console.log('Creating sample transactions...');
    // Create sample transactions
    const transactions = generateSampleTransactions(businessId, 15);
    for (const transaction of transactions) {
      await FirebaseService.createTransaction(transaction);
    }

    console.log('Creating sample credit applications...');
    // Create sample credit applications
    const creditApplications = generateSampleCreditApplications(businessId);
    for (const application of creditApplications) {
      await FirebaseService.createCreditApplication(application);
    }

    console.log('Sample data populated successfully!');
    return true;
  } catch (error) {
    console.error('Error populating sample data:', error);
    throw error;
  }
};

export default {
  generateSampleBusinessProfile,
  generateSampleOrders,
  generateSampleInvoices,
  generateSampleTransactions,
  generateSampleCreditApplications,
  populateSampleData
};
