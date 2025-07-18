// Configuration for showcase business
export const SHOWCASE_CONFIG = {
  // Primary business for showcase
  BUSINESS_ID: "BIZ00009", // Food & Beverage Central
  BUSINESS_NAME: "Food & Beverage Central",
  
  // Demo mode settings
  DEMO_MODE: true,
  USE_GENERATED_DATA: true,
  
  // Feature flags
  FEATURES: {
    CREDIT_SCORING: true,
    AI_PREDICTIONS: true,
    ANALYTICS: true,
    CRM: true,
    INVOICING: true,
    TRANSACTIONS: true
  }
} as const;

// Business profile for Food & Beverage Central (will be loaded from Firebase)
export const SHOWCASE_BUSINESS_PROFILE = {
  businessName: "Food & Beverage Central",
  industry: "Food & Beverage",
  email: "admin@foodbeverage.com",
  phone: "+60123456789",
  address: "123 Culinary Street, 50100 Kuala Lumpur, Malaysia",
  registrationNumber: "202001234567",
  taxId: "C12345678901",
  // These will be populated from Firebase
  creditScore: 0,
  monthlyRevenue: 0
};

export type ShowcaseConfig = typeof SHOWCASE_CONFIG;
