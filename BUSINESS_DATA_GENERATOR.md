# Business Data Generator for PepeAI Credit Scoring

This system generates comprehensive business data for AI credit scoring and testing purposes. It creates realistic business profiles, transactions, orders, invoices, and credit applications that are compatible with both Firebase and the PepeAI credit scoring model.

## Features

### 🎯 AI Model Compatibility
- **Customer Number**: Total unique customers (higher = better credit score)
- **Customer Order**: Average orders per customer (more orders = better score)
- **Amount**: Total transaction amount (higher = better score)
- **Days Since Last Transaction**: Recency of activity (recent = better score)
- **Customer Stickiness**: Rate of repeat customers (higher = better score)

### 🏢 Business Data Generated
- **10 Realistic Businesses** with different industries and characteristics
- **5-40 Transactions per Business** with realistic payment behaviors
- **Customer Orders** with product details and pricing
- **Invoices** with proper tax calculations and due dates
- **Financial Transactions** for income/expense tracking
- **Credit Applications** with different loan types and statuses

### 📊 Credit Scoring Categories
- **Excellent** (720+): Low risk, high approval
- **Good** (660-719): Moderate risk, likely approval
- **At Risk** (580-659): Higher risk, conditional approval
- **Poor** (<580): High risk, likely rejection

## Usage

### 1. Web Interface (Recommended)

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/data-generator` in your browser

3. Click "Populate Firebase Database" to generate 10 businesses with complete data

4. Click "Export AI Training Data (JSON)" to download the data for ML use

### 2. Python Integration

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the integration script:
   ```bash
   python firebase_ai_integration.py
   ```

3. This will:
   - Load/generate business data
   - Train an XGBoost model
   - Generate credit score predictions
   - Save results to CSV and analysis report

## Data Structure

### Firebase Collections
```
businessProfiles/
├── businessName: string
├── email: string
├── phone: string
├── industry: string
├── creditScore: number
└── monthlyRevenue: number

orders/
├── businessId: string
├── customerName: string
├── products: array
├── totalAmount: number
└── status: string

invoices/
├── businessId: string
├── invoiceNumber: string
├── items: array
├── total: number
└── status: string

transactions/
├── businessId: string
├── type: "income" | "expense"
├── amount: number
└── category: string

creditApplications/
├── businessId: string
├── type: string
├── requestedAmount: number
└── status: string
```

### AI Model Features
```json
{
  "business_id": "BIZ00001",
  "business_name": "TechCorp Solutions Sdn Bhd",
  "industry": "Technology",
  "customer_number": 15,
  "customer_order": 2.3,
  "amount": 45000.00,
  "days_since_last_transaction": 5,
  "customer_stickiness": 0.35,
  "transaction_count": 23,
  "completion_rate": 0.87,
  "clearance_days": 12.5,
  "credit_score": 742,
  "credit_category": "excellent"
}
```

## Hard Filtering Rules

The system applies the same hard filtering rules as the PepeAI model:

1. **Minimum 5 transactions** required
2. **Customer stickiness ≤ 0.8** (fraud detection)
3. **Completion rate ≥ 20%** minimum
4. **Average clearance time ≤ 25 days** maximum
5. **Transaction frequency limits** for high-volume businesses

## Credit Score Calculation

The credit score is calculated using a weighted formula:

```
Base Score: 300 points

+ Customer Score: √(customer_number) × 20 (max 150 pts)
+ Order Score: customer_order × 10 (max 100 pts)  
+ Amount Score: log(amount) × 15 (max 200 pts)
+ Recency Score: Recent activity bonus (max 100 pts)
+ Stickiness Score: customer_stickiness × 100 (max 100 pts)
+ Random Noise: ±20 points

Final Range: 300-900 points
```

## Files Generated

### Web Interface
- `business_ai_training_data.json` - Complete AI training dataset

### Python Script
- `ai_credit_predictions.csv` - Detailed predictions for all businesses
- `ai_analysis_report.txt` - Comprehensive analysis report

## Integration with Your System

### Using the Data
1. The generated businesses are automatically stored in Firebase
2. Each business has a complete transaction history
3. Credit scores are calculated and stored
4. The data is immediately available for your dashboard

### AI Model Training
1. Export the data using the web interface
2. Use the Python script to train the XGBoost model
3. The model can predict credit scores for new businesses
4. Results can be fed back to Firebase for real-time scoring

## Business Quality Distribution

The generator creates a realistic distribution:
- **15%** Excellent businesses (high payment rates, low delays)
- **35%** Good businesses (reliable payment, moderate delays)
- **35%** Fair businesses (some payment issues, longer delays)
- **15%** Poor businesses (frequent late payments, high risk)

## Getting Started

1. Navigate to `/data-generator` in your application
2. Click "Populate Firebase Database" 
3. Wait for the data generation to complete
4. Your system now has 10 realistic businesses with complete data
5. Each business can be used to test credit scoring, invoicing, and CRM features
6. The AI model can predict credit scores for loan applications

## Support

The data generator creates realistic business scenarios that match the patterns expected by your PepeAI model, ensuring seamless integration between your web application and AI credit scoring system.
