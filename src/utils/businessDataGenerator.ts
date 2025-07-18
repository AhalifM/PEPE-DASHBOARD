import { Timestamp } from 'firebase/firestore';
import FirebaseService, { 
  BusinessProfile, 
  Order, 
  Invoice, 
  Transaction, 
  CreditApplication 
} from '@/lib/firebaseService';

// Types for transaction data
interface TransactionData {
  transaction_id: string;
  business_id: string;
  invoice_date: Date;
  due_date: Date;
  invoice_amount: number;
  customer_email: string;
  customer_type: 'New' | 'Repeat';
  payment_date: Date | null;
  payment_amount: number;
  payment_status: 'Paid' | 'Partial' | 'Unpaid';
  payment_method: string | null;
  product_category: string;
}

interface AIFeatures {
  customer_number: number;
  customer_order: number;
  amount: number;
  days_since_last_transaction: number;
  customer_stickiness: number;
  transaction_count: number;
  completion_rate: number;
  clearance_days: number;
  credit_score: number;
  credit_category: 'poor' | 'at_risk' | 'good' | 'excellent';
}

interface AIExportData {
  business_id: string;
  business_name: string;
  industry: string;
  customer_number: number;
  customer_order: number;
  amount: number;
  days_since_last_transaction: number;
  customer_stickiness: number;
  transaction_count: number;
  completion_rate: number;
  clearance_days: number;
  credit_score: number;
  credit_category: string;
  transactions: TransactionData[];
}

// Faker-like data generation utility
class DataGenerator {
  public businessNames = [
    "TechCorp Solutions Sdn Bhd",
    "Global Trading Enterprise",
    "Digital Innovation Hub",
    "Manufacturing Excellence Ltd",
    "Healthcare Plus Services",
    "Financial Advisory Group",
    "Retail Master Chain",
    "Construction Elite Co",
    "Food & Beverage Central",
    "Logistics Pro Network"
  ];

  public industries = [
    "Technology",
    "Healthcare", 
    "Finance",
    "Retail",
    "Manufacturing",
    "Construction",
    "Hospitality",
    "Wholesale",
    "Food & Beverage",
    "Logistics"
  ];

  public customerNames = [
    "Ahmad Zulkifli", "Siti Nurhaliza", "Raj Patel", "Li Wei Chen", 
    "Sarah Thompson", "Michael Johnson", "Priya Sharma", "David Lee",
    "Maria Santos", "James Wilson", "Fatimah Abdullah", "Kumar Rajan",
    "Nicole Tan", "Robert Kim", "Aisha Mohamed", "Carlos Rodriguez"
  ];

  public productCategories = [
    "Software Licenses", "Hardware Equipment", "Consulting Services", 
    "Marketing Services", "Office Supplies", "Raw Materials",
    "Finished Goods", "Professional Services", "Maintenance Services",
    "Training Programs", "Digital Solutions", "Security Systems"
  ];

  public businessQualities = ['excellent', 'good', 'fair', 'poor'] as const;
  public businessBehaviors = {
    'excellent': { payment_prob: 0.95, avg_delay: 5, transaction_freq: 25, avg_amount: 5000 },
    'good': { payment_prob: 0.85, avg_delay: 12, transaction_freq: 18, avg_amount: 3000 },
    'fair': { payment_prob: 0.70, avg_delay: 20, transaction_freq: 12, avg_amount: 2000 },
    'poor': { payment_prob: 0.45, avg_delay: 35, transaction_freq: 6, avg_amount: 1500 }
  };

  random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  randomChoice<T>(array: readonly T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  randomEmail(): string {
    const domains = ['gmail.com', 'outlook.com', 'company.com', 'business.my', 'enterprise.com'];
    const name = this.randomChoice(this.customerNames).toLowerCase().replace(/\s+/g, '.');
    return `${name}@${this.randomChoice(domains)}`;
  }

  randomPhone(): string {
    const prefixes = ['+60123', '+60124', '+60125', '+60126', '+60127'];
    return `${this.randomChoice(prefixes)}${this.random(100000, 999999)}`;
  }

  randomDate(startDays: number, endDays: number): Date {
    const now = new Date();
    const start = new Date(now.getTime() - startDays * 24 * 60 * 60 * 1000);
    const end = new Date(now.getTime() - endDays * 24 * 60 * 60 * 1000);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  generateRegistrationNumber(): string {
    return `${this.random(202000000000, 202199999999)}`;
  }

  generateTaxId(): string {
    return `C${this.random(10000000000, 99999999999)}`;
  }
}

const generator = new DataGenerator();

// Enhanced business data structure for AI model compatibility
export interface EnhancedBusinessData {
  // Firebase business profile data
  businessProfile: Omit<BusinessProfile, 'id' | 'createdAt' | 'updatedAt'>;
  
  // Transaction data for AI model features
  transactions: Array<{
    transaction_id: string;
    business_id: string;
    invoice_date: Date;
    due_date: Date;
    invoice_amount: number;
    customer_email: string;
    customer_type: 'New' | 'Repeat';
    payment_date: Date | null;
    payment_amount: number;
    payment_status: 'Paid' | 'Partial' | 'Unpaid';
    payment_method: string | null;
    product_category: string;
  }>;
  
  // AI model features (calculated from transactions)
  aiFeatures: {
    customer_number: number;
    customer_order: number;
    amount: number;
    days_since_last_transaction: number;
    customer_stickiness: number;
    transaction_count: number;
    completion_rate: number;
    clearance_days: number;
    credit_score: number;
    credit_category: 'poor' | 'at_risk' | 'good' | 'excellent';
  };
  
  // Firebase collections data
  orders: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>[];
  invoices: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>[];
  firebaseTransactions: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>[];
  creditApplications: Omit<CreditApplication, 'id' | 'createdAt' | 'updatedAt'>[];
}

// Calculate AI features from transaction data
function calculateAIFeatures(transactions: TransactionData[], businessQuality: string): AIFeatures {
  const currentDate = new Date();
  
  // Feature 1: Customer Number - total number of unique customers
  const uniqueCustomers = new Set(transactions.map(t => t.customer_email));
  const customer_number = uniqueCustomers.size;
  
  // Feature 2: Customer Order - average number of orders per customer
  const customerOrderCounts: { [key: string]: number } = {};
  transactions.forEach(t => {
    customerOrderCounts[t.customer_email] = (customerOrderCounts[t.customer_email] || 0) + 1;
  });
  const customer_order = Object.values(customerOrderCounts).reduce((a, b) => a + b, 0) / Object.keys(customerOrderCounts).length || 0;
  
  // Feature 3: Amount - total amount of all orders combined
  const amount = transactions.reduce((sum, t) => sum + t.invoice_amount, 0);
  
  // Feature 4: Days since last transaction
  const lastTransactionDate = Math.max(...transactions.map(t => new Date(t.invoice_date).getTime()));
  const days_since_last_transaction = Math.floor((currentDate.getTime() - lastTransactionDate) / (1000 * 60 * 60 * 24));
  
  // Feature 5: Customer Stickiness - rate of repeating customers
  const total_transactions = transactions.length;
  const customer_stickiness = total_transactions > 0 ? 1 - (customer_number / total_transactions) : 0;
  
  // Legacy features for hard filtering
  const transaction_count = transactions.length;
  const paidTransactions = transactions.filter(t => t.payment_status === 'Paid');
  const completion_rate = paidTransactions.length / transactions.length;
  
  // Average clearance days
  const paidWithDates = transactions.filter(t => t.payment_date);
  const clearance_days = paidWithDates.length > 0 
    ? paidWithDates.reduce((sum, t) => {
        const invoiceDate = new Date(t.invoice_date);
        const paymentDate = new Date(t.payment_date!);
        return sum + Math.floor((paymentDate.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24));
      }, 0) / paidWithDates.length
    : 30;
  
  // Calculate credit score based on features
  const credit_score = calculateCreditScore(customer_number, customer_order, amount, days_since_last_transaction, customer_stickiness);
  
  // Categorize credit score
  let credit_category: 'poor' | 'at_risk' | 'good' | 'excellent';
  if (credit_score >= 720) credit_category = 'excellent';
  else if (credit_score >= 660) credit_category = 'good';
  else if (credit_score >= 580) credit_category = 'at_risk';
  else credit_category = 'poor';
  
  return {
    customer_number,
    customer_order,
    amount,
    days_since_last_transaction,
    customer_stickiness,
    transaction_count,
    completion_rate,
    clearance_days,
    credit_score,
    credit_category
  };
}

function calculateCreditScore(customer_number: number, customer_order: number, amount: number, days_since_last_transaction: number, customer_stickiness: number): number {
  const base_score = 300;
  
  // Customer Number: More customers = better score (up to +150 points)
  const customer_score = Math.min(Math.sqrt(customer_number) * 20, 150);
  
  // Customer Order: More orders per customer = better score (up to +100 points)
  const order_score = Math.min(customer_order * 10, 100);
  
  // Amount: Higher total amount = better score (logarithmic scale, up to +200 points)
  const amount_score = Math.min(Math.log(Math.max(amount, 1)) * 15, 200);
  
  // Last Transaction: Recent transactions = better score
  let recency_score: number;
  if (days_since_last_transaction <= 30) {
    recency_score = 100;
  } else if (days_since_last_transaction <= 90) {
    recency_score = 100 - (days_since_last_transaction - 30) * 1.5;
  } else {
    recency_score = Math.max(0, 100 - (days_since_last_transaction - 30) * 2);
  }
  
  // Customer Stickiness: Higher repeat rate = better score (up to +100 points)
  const stickiness_score = customer_stickiness * 100;
  
  // Calculate final score
  const final_score = base_score + customer_score + order_score + amount_score + recency_score + stickiness_score;
  
  // Add some noise and clip to realistic range
  const score = final_score + (Math.random() - 0.5) * 40; // ±20 noise
  return Math.max(300, Math.min(900, score));
}

// Generate comprehensive business data
export function generateBusinessData(businessIndex: number): EnhancedBusinessData {
  const businessId = `BIZ${String(businessIndex).padStart(5, '0')}`;
  const businessQuality = generator.randomChoice(generator.businessQualities);
  const behavior = generator.businessBehaviors[businessQuality];
  
  // Generate business profile
  const businessProfile: Omit<BusinessProfile, 'id' | 'createdAt' | 'updatedAt'> = {
    businessName: generator.businessNames[businessIndex % generator.businessNames.length],
    email: `admin@business${businessIndex}.com`,
    phone: generator.randomPhone(),
    address: `${generator.random(1, 999)} Business Street, ${generator.random(10000, 99999)} Kuala Lumpur, Malaysia`,
    industry: generator.randomChoice(generator.industries),
    registrationNumber: generator.generateRegistrationNumber(),
    taxId: generator.generateTaxId(),
    monthlyRevenue: generator.random(20000, 100000)
  };
  
  // Generate transaction data for AI model
  const transactionCount = Math.max(5, Math.floor(Math.random() * 30) + 10); // 5-40 transactions
  const transactions = [];
  const customerEmails: string[] = [];
  
  // Generate some repeat customer emails
  for (let i = 0; i < Math.max(1, Math.floor(transactionCount / 4)); i++) {
    customerEmails.push(generator.randomEmail());
  }
  
  for (let i = 0; i < transactionCount; i++) {
    const isRepeatCustomer = i > 0 && Math.random() < 0.3 && customerEmails.length > 0;
    const customerEmail = isRepeatCustomer 
      ? generator.randomChoice(customerEmails)
      : generator.randomEmail();
    
    if (!isRepeatCustomer) {
      customerEmails.push(customerEmail);
    }
    
    const invoiceDate = generator.randomDate(365, 1); // Last year
    const dueDate = new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days later
    const invoiceAmount = Math.max(100, Math.random() * behavior.avg_amount * 2);
    
    // Payment behavior
    const willPay = Math.random() < behavior.payment_prob;
    let paymentDate: Date | null = null;
    let paymentAmount = 0;
    let paymentStatus: 'Paid' | 'Partial' | 'Unpaid' = 'Unpaid';
    let paymentMethod: string | null = null;
    
    if (willPay) {
      const paymentDelay = Math.max(0, Math.random() * behavior.avg_delay * 2);
      paymentDate = new Date(invoiceDate.getTime() + paymentDelay * 24 * 60 * 60 * 1000);
      
      if (Math.random() < 0.95) {
        paymentAmount = invoiceAmount;
        paymentStatus = 'Paid';
      } else {
        paymentAmount = invoiceAmount * (0.3 + Math.random() * 0.6);
        paymentStatus = 'Partial';
      }
      
      paymentMethod = generator.randomChoice(['Bank Transfer', 'Credit Card', 'Check', 'Digital Wallet']);
    }
    
    transactions.push({
      transaction_id: `TXN${String(i + 1).padStart(8, '0')}`,
      business_id: businessId,
      invoice_date: invoiceDate,
      due_date: dueDate,
      invoice_amount: Math.round(invoiceAmount * 100) / 100,
      customer_email: customerEmail,
      customer_type: isRepeatCustomer ? 'Repeat' as const : 'New' as const,
      payment_date: paymentDate,
      payment_amount: Math.round(paymentAmount * 100) / 100,
      payment_status: paymentStatus,
      payment_method: paymentMethod,
      product_category: generator.randomChoice(generator.productCategories)
    });
  }
  
  // Calculate AI features
  const aiFeatures = calculateAIFeatures(transactions, businessQuality);
  
  // Update business profile with calculated credit score
  businessProfile.creditScore = aiFeatures.credit_score;
  
  // Generate Firebase orders data
  const orders: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>[] = [];
  for (let i = 0; i < generator.random(3, 8); i++) {
    const orderDate = generator.randomDate(180, 1);
    const customerName = generator.randomChoice(generator.customerNames);
    const products = [];
    const productCount = generator.random(1, 4);
    
    for (let j = 0; j < productCount; j++) {
      const price = generator.randomFloat(50, 1000);
      const quantity = generator.random(1, 5);
      products.push({
        name: generator.randomChoice(generator.productCategories),
        quantity,
        price: Math.round(price * 100) / 100
      });
    }
    
    const totalAmount = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    
    orders.push({
      businessId,
      customerName,
      customerEmail: generator.randomEmail(),
      products,
      totalAmount: Math.round(totalAmount * 100) / 100,
      status: generator.randomChoice(['pending', 'processing', 'completed', 'cancelled']),
      orderDate: Timestamp.fromDate(orderDate)
    });
  }
  
  // Generate Firebase invoices data
  const invoices: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>[] = [];
  for (let i = 0; i < generator.random(3, 6); i++) {
    const customerName = generator.randomChoice(generator.customerNames);
    const items = [];
    const itemCount = generator.random(1, 3);
    
    for (let j = 0; j < itemCount; j++) {
      const rate = generator.randomFloat(100, 500);
      const quantity = generator.random(1, 3);
      items.push({
        description: generator.randomChoice(generator.productCategories),
        quantity,
        rate: Math.round(rate * 100) / 100,
        amount: Math.round(rate * quantity * 100) / 100
      });
    }
    
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.06; // 6% tax
    const total = subtotal + tax;
    
    invoices.push({
      businessId,
      orderId: orders[i % orders.length]?.businessId,
      invoiceNumber: `INV-${businessIndex}-${String(i + 1).padStart(3, '0')}`,
      customerName,
      customerEmail: generator.randomEmail(),
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
      status: generator.randomChoice(['draft', 'sent', 'paid', 'overdue']),
      dueDate: Timestamp.fromDate(generator.randomDate(30, -30))
    });
  }
  
  // Generate Firebase transactions data
  const firebaseTransactions: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>[] = [];
  for (let i = 0; i < generator.random(10, 20); i++) {
    const isIncome = Math.random() > 0.3; // 70% income, 30% expense
    const amount = generator.randomFloat(100, 5000);
    
    firebaseTransactions.push({
      businessId,
      type: isIncome ? 'income' : 'expense',
      category: isIncome 
        ? generator.randomChoice(['Sales', 'Services', 'Investment', 'Other Income'])
        : generator.randomChoice(['Office Supplies', 'Marketing', 'Utilities', 'Travel', 'Equipment']),
      description: `${isIncome ? 'Payment from' : 'Payment to'} ${generator.randomChoice(generator.customerNames)}`,
      amount: Math.round(amount * 100) / 100,
      date: Timestamp.fromDate(generator.randomDate(90, 1)),
      reference: `REF-${String(i + 1).padStart(6, '0')}`
    });
  }
  
  // Generate credit applications
  const creditApplications: Omit<CreditApplication, 'id' | 'createdAt' | 'updatedAt'>[] = [];
  const applicationCount = generator.random(1, 3);
  
  for (let i = 0; i < applicationCount; i++) {
    creditApplications.push({
      businessId,
      type: generator.randomChoice(['business_loan', 'credit_line', 'equipment_financing']),
      requestedAmount: generator.random(10000, 100000),
      purpose: generator.randomChoice([
        'Working capital and cash flow management',
        'Equipment purchase and upgrade',
        'Business expansion and growth',
        'Inventory financing',
        'Technology infrastructure improvement'
      ]),
      status: generator.randomChoice(['pending', 'under_review', 'approved', 'rejected']),
      applicationDate: Timestamp.fromDate(generator.randomDate(60, 1))
    });
  }
  
  return {
    businessProfile,
    transactions,
    aiFeatures,
    orders,
    invoices,
    firebaseTransactions,
    creditApplications
  };
}

// Function to populate Firebase with generated data
export async function populateBusinessesToFirebase(businessCount: number = 10): Promise<string[]> {
  const businessIds: string[] = [];
  const startTime = performance.now();
  
  try {
    console.log(`🚀 Starting generation of ${businessCount} businesses...`);
    
    // Generate all business data first (fast)
    const dataGenStart = performance.now();
    const allBusinessData = [];
    for (let i = 0; i < businessCount; i++) {
      const businessData = generateBusinessData(i + 1);
      allBusinessData.push(businessData);
    }
    const dataGenTime = performance.now() - dataGenStart;
    console.log(`📊 Generated all data in ${Math.round(dataGenTime)}ms`);
    
    // Create business profiles first (parallel)
    const profileStart = performance.now();
    const profilePromises = allBusinessData.map(async (businessData, index) => {
      const businessId = await FirebaseService.createBusinessProfile(businessData.businessProfile);
      return { businessId, businessData, index };
    });
    
    const profileResults = await Promise.all(profilePromises);
    const profileTime = performance.now() - profileStart;
    console.log(`📋 Created ${profileResults.length} profiles in ${Math.round(profileTime)}ms`);
    
    // Extract business IDs
    businessIds.push(...profileResults.map(r => r.businessId));
    
    // Create all related data in parallel batches
    const dataStart = performance.now();
    const batchSize = 5; // Process 5 businesses at a time to avoid overwhelming Firebase
    
    for (let i = 0; i < profileResults.length; i += batchSize) {
      const batch = profileResults.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async ({ businessId, businessData }) => {
        const [orders, invoices, transactions, applications] = await Promise.all([
          Promise.all(businessData.orders.map(order => 
            FirebaseService.createOrder({ ...order, businessId })
          )),
          Promise.all(businessData.invoices.map(invoice => 
            FirebaseService.createInvoice({ ...invoice, businessId })
          )),
          Promise.all(businessData.firebaseTransactions.map(transaction => 
            FirebaseService.createTransaction({ ...transaction, businessId })
          )),
          Promise.all(businessData.creditApplications.map(application => 
            FirebaseService.createCreditApplication({ ...application, businessId })
          ))
        ]);
        
        console.log(`✅ Completed: ${businessData.businessProfile.businessName} (${orders.length + invoices.length + transactions.length + applications.length} documents)`);
      });
      
      await Promise.all(batchPromises);
      console.log(`📦 Completed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(profileResults.length / batchSize)}`);
    }
    
    const dataTime = performance.now() - dataStart;
    const totalTime = performance.now() - startTime;
    
    console.log(`🎉 Successfully completed in ${Math.round(totalTime)}ms!`);
    console.log(`📈 Performance Summary:`);
    console.log(`   - Data Generation: ${Math.round(dataGenTime)}ms`);
    console.log(`   - Profile Creation: ${Math.round(profileTime)}ms`);
    console.log(`   - Related Data: ${Math.round(dataTime)}ms`);
    console.log(`   - Total Documents: ~${businessCount * 25}`);
    
    return businessIds;
    
  } catch (error) {
    const totalTime = performance.now() - startTime;
    console.error(`❌ Error after ${Math.round(totalTime)}ms:`, error);
    throw error;
  }
}

// Export the AI-compatible data for machine learning
export async function exportBusinessDataForAI(businessIds?: string[]): Promise<AIExportData[]> {
  const aiData = [];
  
  try {
    // If no specific business IDs, generate sample data
    if (!businessIds || businessIds.length === 0) {
      console.log('Generating AI training data from sample businesses...');
      for (let i = 1; i <= 10; i++) {
        const businessData = generateBusinessData(i);
        aiData.push({
          business_id: `BIZ${String(i).padStart(5, '0')}`,
          business_name: businessData.businessProfile.businessName,
          industry: businessData.businessProfile.industry,
          ...businessData.aiFeatures,
          transactions: businessData.transactions
        });
      }
    }
    
    return aiData;
    
  } catch (error) {
    console.error('Error exporting AI data:', error);
    throw error;
  }
}

export default {
  generateBusinessData,
  populateBusinessesToFirebase,
  exportBusinessDataForAI,
  calculateAIFeatures,
  calculateCreditScore
};
