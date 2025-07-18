import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Types for our business data
export interface BusinessProfile {
  id?: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  registrationNumber: string;
  taxId: string;
  creditScore?: number;
  monthlyRevenue?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Order {
  id?: string;
  businessId: string;
  customerName: string;
  customerEmail: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  orderDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Invoice {
  id?: string;
  businessId: string;
  orderId?: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Transaction {
  id?: string;
  businessId: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: Timestamp;
  reference?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreditApplication {
  id?: string;
  businessId: string;
  type: 'business_loan' | 'credit_line' | 'equipment_financing';
  requestedAmount: number;
  purpose: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  applicationDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Firebase service class
export class FirebaseService {
  // Business Profile operations
  static async createBusinessProfile(profile: Omit<BusinessProfile, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = Timestamp.now();
    const profileData = {
      ...profile,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, 'businesses'), profileData);
    return docRef.id;
  }

  static async getAllBusinesses() {
    const q = query(collection(db, 'businesses'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BusinessProfile[];
  }

  static async getBusinessProfile(businessId: string) {
    const docRef = doc(db, 'businesses', businessId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as BusinessProfile;
    }
    return null;
  }

  static async updateBusinessProfile(businessId: string, updates: Partial<BusinessProfile>) {
    const docRef = doc(db, 'businesses', businessId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }

  // Orders operations
  static async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = Timestamp.now();
    const orderData = {
      ...order,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, 'orders'), orderData);
    return docRef.id;
  }

  static async getOrders(businessId: string, limitCount = 50) {
    const q = query(
      collection(db, 'orders'),
      where('businessId', '==', businessId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  }

  static async updateOrder(orderId: string, updates: Partial<Order>) {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }

  // Invoices operations
  static async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = Timestamp.now();
    const invoiceData = {
      ...invoice,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, 'invoices'), invoiceData);
    return docRef.id;
  }

  static async getInvoices(businessId: string, limitCount = 50) {
    const q = query(
      collection(db, 'invoices'),
      where('businessId', '==', businessId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Invoice[];
  }

  static async updateInvoice(invoiceId: string, updates: Partial<Invoice>) {
    const docRef = doc(db, 'invoices', invoiceId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }

  // Transactions operations
  static async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = Timestamp.now();
    const transactionData = {
      ...transaction,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, 'transactions'), transactionData);
    return docRef.id;
  }

  static async getTransactions(businessId: string, limitCount = 100) {
    const q = query(
      collection(db, 'transactions'),
      where('businessId', '==', businessId),
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Transaction[];
  }

  static async updateTransaction(transactionId: string, updates: Partial<Transaction>) {
    const docRef = doc(db, 'transactions', transactionId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }

  static async deleteTransaction(transactionId: string) {
    const docRef = doc(db, 'transactions', transactionId);
    await deleteDoc(docRef);
  }

  // Credit applications operations
  static async createCreditApplication(application: Omit<CreditApplication, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = Timestamp.now();
    const applicationData = {
      ...application,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, 'creditApplications'), applicationData);
    return docRef.id;
  }

  static async getCreditApplications(businessId: string) {
    const q = query(
      collection(db, 'creditApplications'),
      where('businessId', '==', businessId),
      orderBy('applicationDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CreditApplication[];
  }

  static async updateCreditApplication(applicationId: string, updates: Partial<CreditApplication>) {
    const docRef = doc(db, 'creditApplications', applicationId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }

  // Analytics and reporting
  static async getBusinessAnalytics(businessId: string) {
    const [orders, invoices, transactions] = await Promise.all([
      this.getOrders(businessId),
      this.getInvoices(businessId),
      this.getTransactions(businessId)
    ]);

    // Calculate analytics
    const totalRevenue = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingInvoices = invoices.filter(i => i.status === 'sent' || i.status === 'overdue');
    const pendingAmount = pendingInvoices.reduce((sum, i) => sum + i.total, 0);

    const recentOrders = orders.filter(o => {
      const orderDate = o.orderDate.toDate();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return orderDate >= thirtyDaysAgo;
    });

    return {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      pendingInvoicesCount: pendingInvoices.length,
      pendingAmount,
      ordersThisMonth: recentOrders.length,
      totalOrders: orders.length,
      totalInvoices: invoices.length,
      totalTransactions: transactions.length
    };
  }
}

export default FirebaseService;
