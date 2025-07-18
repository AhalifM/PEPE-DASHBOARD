"""
Firebase to PepeAI Data Integration Script
==========================================

This script demonstrates how to:
1. Load business data from Firebase 
2. Transform it for PepeAI credit scoring model
3. Run predictions using the existing model
4. Update Firebase with AI predictions

Usage:
    python firebase_ai_integration.py

Requirements:
    pip install pandas numpy scikit-learn xgboost firebase-admin
"""

import pandas as pd
import numpy as np
import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional

# Firebase Admin SDK (install: pip install firebase-admin)
try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    FIREBASE_AVAILABLE = True
except ImportError:
    print("Firebase Admin SDK not available. Install with: pip install firebase-admin")
    FIREBASE_AVAILABLE = False

# ML libraries
try:
    import xgboost as xgb
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import classification_report, confusion_matrix
    ML_AVAILABLE = True
except ImportError:
    print("ML libraries not available. Install with: pip install scikit-learn xgboost")
    ML_AVAILABLE = False

class FirebaseAIIntegration:
    """Integration class for Firebase and PepeAI model"""
    
    def __init__(self, firebase_config_path: Optional[str] = None):
        self.db = None
        self.model = None
        
        if FIREBASE_AVAILABLE and firebase_config_path:
            self.initialize_firebase(firebase_config_path)
    
    def initialize_firebase(self, config_path: str):
        """Initialize Firebase connection"""
        try:
            if not firebase_admin._apps:
                cred = credentials.Certificate(config_path)
                firebase_admin.initialize_app(cred)
            self.db = firestore.client()
            print("✅ Firebase initialized successfully")
        except Exception as e:
            print(f"❌ Firebase initialization failed: {e}")
    
    def load_sample_data_from_json(self, file_path: str) -> pd.DataFrame:
        """Load sample data from exported JSON file"""
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
            
            # Convert to DataFrame
            df = pd.DataFrame(data)
            print(f"✅ Loaded {len(df)} businesses from {file_path}")
            return df
            
        except Exception as e:
            print(f"❌ Error loading JSON data: {e}")
            return pd.DataFrame()
    
    def fetch_businesses_from_firebase(self) -> pd.DataFrame:
        """Fetch business data from Firebase"""
        if not self.db:
            print("❌ Firebase not initialized")
            return pd.DataFrame()
        
        try:
            businesses = []
            business_profiles = self.db.collection('businesses').get()
            
            for profile_doc in business_profiles:
                business_id = profile_doc.id
                profile_data = profile_doc.to_dict()
                
                # Fetch transactions for this business
                transactions = self.fetch_business_transactions(business_id)
                
                if len(transactions) >= 5:  # Minimum transaction requirement
                    # Calculate AI features
                    ai_features = self.calculate_ai_features_from_firebase(transactions)
                    
                    business_data = {
                        'business_id': business_id,
                        'business_name': profile_data.get('businessName', ''),
                        'industry': profile_data.get('industry', ''),
                        'current_credit_score': profile_data.get('creditScore', 0),
                        **ai_features
                    }
                    businesses.append(business_data)
            
            df = pd.DataFrame(businesses)
            print(f"✅ Fetched {len(df)} businesses from Firebase")
            return df
            
        except Exception as e:
            print(f"❌ Error fetching Firebase data: {e}")
            return pd.DataFrame()
    
    def fetch_business_transactions(self, business_id: str) -> List[Dict]:
        """Fetch transactions for a specific business"""
        try:
            transactions = []
            
            # Get all invoices for this business
            invoices = self.db.collection('invoices').where('businessId', '==', business_id).get()
            
            for invoice_doc in invoices:
                invoice_data = invoice_doc.to_dict()
                
                # Convert Firestore timestamp to datetime
                invoice_date = invoice_data.get('createdAt')
                if hasattr(invoice_date, 'to_datetime'):
                    invoice_date = invoice_date.to_datetime()
                else:
                    invoice_date = datetime.now()
                
                transaction = {
                    'business_id': business_id,
                    'invoice_date': invoice_date,
                    'invoice_amount': invoice_data.get('total', 0),
                    'customer_email': invoice_data.get('customerEmail', 'unknown@email.com'),
                    'payment_status': invoice_data.get('status', 'pending'),
                    'due_date': invoice_data.get('dueDate', invoice_date + timedelta(days=30))
                }
                transactions.append(transaction)
            
            return transactions
            
        except Exception as e:
            print(f"❌ Error fetching transactions for {business_id}: {e}")
            return []
    
    def calculate_ai_features_from_firebase(self, transactions: List[Dict]) -> Dict:
        """Calculate AI features from Firebase transaction data"""
        if not transactions:
            return self.get_default_features()
        
        current_date = datetime.now()
        
        # Feature 1: Customer Number - total number of unique customers
        unique_customers = set(t['customer_email'] for t in transactions)
        customer_number = len(unique_customers)
        
        # Feature 2: Customer Order - average number of orders per customer
        customer_counts = {}
        for t in transactions:
            customer_counts[t['customer_email']] = customer_counts.get(t['customer_email'], 0) + 1
        customer_order = np.mean(list(customer_counts.values())) if customer_counts else 0
        
        # Feature 3: Amount - total amount of all orders combined
        amount = sum(t['invoice_amount'] for t in transactions)
        
        # Feature 4: Days since last transaction
        latest_date = max(t['invoice_date'] for t in transactions)
        days_since_last_transaction = (current_date - latest_date).days
        
        # Feature 5: Customer Stickiness - rate of repeating customers
        total_transactions = len(transactions)
        customer_stickiness = 1 - (customer_number / total_transactions) if total_transactions > 0 else 0
        
        # Additional features for hard filtering
        paid_transactions = [t for t in transactions if t['payment_status'] in ['paid', 'Paid']]
        completion_rate = len(paid_transactions) / len(transactions) if transactions else 0
        
        # Calculate clearance days for paid transactions
        clearance_days = 15  # Default assumption
        if paid_transactions:
            delays = []
            for t in paid_transactions:
                if isinstance(t['due_date'], datetime):
                    delay = (t['due_date'] - t['invoice_date']).days
                    delays.append(max(0, delay))
            clearance_days = np.mean(delays) if delays else 15
        
        return {
            'customer_number': customer_number,
            'customer_order': customer_order,
            'amount': amount,
            'days_since_last_transaction': days_since_last_transaction,
            'customer_stickiness': customer_stickiness,
            'transaction_count': len(transactions),
            'completion_rate': completion_rate,
            'clearance_days': clearance_days
        }
    
    def get_default_features(self) -> Dict:
        """Return default features for businesses with insufficient data"""
        return {
            'customer_number': 1,
            'customer_order': 1,
            'amount': 1000,
            'days_since_last_transaction': 365,
            'customer_stickiness': 0,
            'transaction_count': 0,
            'completion_rate': 0,
            'clearance_days': 30
        }
    
    def calculate_credit_score_from_features(self, features: Dict) -> float:
        """Calculate credit score using the same logic as PepeAI model"""
        base_score = 300
        
        # Customer Number: More customers = better score (up to +150 points)
        customer_score = min(np.sqrt(features['customer_number']) * 20, 150)
        
        # Customer Order: More orders per customer = better score (up to +100 points)
        order_score = min(features['customer_order'] * 10, 100)
        
        # Amount: Higher total amount = better score (logarithmic scale, up to +200 points)
        amount_score = min(np.log(max(features['amount'], 1)) * 15, 200)
        
        # Last Transaction: Recent transactions = better score
        days_since = features['days_since_last_transaction']
        if days_since <= 30:
            recency_score = 100
        elif days_since <= 90:
            recency_score = 100 - (days_since - 30) * 1.5
        else:
            recency_score = max(0, 100 - (days_since - 30) * 2)
        
        # Customer Stickiness: Higher repeat rate = better score (up to +100 points)
        stickiness_score = features['customer_stickiness'] * 100
        
        # Calculate final score
        final_score = (
            base_score + 
            customer_score + 
            order_score + 
            amount_score + 
            recency_score + 
            stickiness_score
        )
        
        # Add some noise and clip to realistic range
        score = final_score + np.random.normal(0, 20)
        return np.clip(score, 300, 900)
    
    def categorize_credit_score(self, score: float) -> str:
        """Categorize credit score into risk categories"""
        if score >= 720:
            return 'excellent'
        elif score >= 660:
            return 'good'
        elif score >= 580:
            return 'at_risk'
        else:
            return 'poor'
    
    def apply_hard_filters(self, features: Dict) -> str:
        """Apply hard filtering rules from PepeAI model"""
        if features['transaction_count'] < 5:
            return 'low_trust'
        elif features['customer_stickiness'] > 0.8:
            return 'circular_fake'
        elif features['completion_rate'] < 0.2:
            return 'non_compliant'
        elif features['clearance_days'] > 25:
            return 'slow_settlement'
        return 'pass'
    
    def train_xgboost_model(self, df: pd.DataFrame) -> Optional[object]:
        """Train XGBoost model using the same approach as PepeAI"""
        if not ML_AVAILABLE:
            print("❌ ML libraries not available")
            return None
        
        try:
            # Filter data that passes hard filters
            df['filter_result'] = df.apply(lambda row: self.apply_hard_filters(row.to_dict()), axis=1)
            passed_data = df[df['filter_result'] == 'pass'].copy()
            
            if len(passed_data) < 10:
                print("❌ Insufficient data for training (need at least 10 passing businesses)")
                return None
            
            # Calculate credit scores and categories
            passed_data['predicted_credit_score'] = passed_data.apply(
                lambda row: self.calculate_credit_score_from_features(row.to_dict()), axis=1
            )
            passed_data['credit_category'] = passed_data['predicted_credit_score'].apply(self.categorize_credit_score)
            passed_data['target_numeric'] = passed_data['credit_category'].map({
                'excellent': 3, 'good': 2, 'at_risk': 1, 'poor': 0
            })
            
            # Features for XGBoost
            features = ['customer_number', 'customer_order', 'amount', 'days_since_last_transaction', 'customer_stickiness']
            X = passed_data[features]
            y = passed_data['target_numeric']
            
            # Train-test split
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            # XGBoost parameters
            params = {
                'max_depth': 5,
                'learning_rate': 0.1,
                'objective': 'multi:softprob',
                'eval_metric': 'mlogloss',
                'num_class': 4,
                'subsample': 0.8,
                'colsample_bytree': 0.8,
                'random_state': 42
            }
            
            # Train model
            dtrain = xgb.DMatrix(X_train, label=y_train)
            dtest = xgb.DMatrix(X_test, label=y_test)
            
            model = xgb.train(
                params,
                dtrain,
                num_boost_round=200,
                evals=[(dtrain, 'train'), (dtest, 'eval')],
                early_stopping_rounds=20,
                verbose_eval=False
            )
            
            # Evaluate
            y_pred_proba = model.predict(dtest)
            y_pred = np.argmax(y_pred_proba, axis=1)
            
            print("✅ XGBoost Model Training Complete")
            print("\nClassification Report:")
            print(classification_report(y_test, y_pred, target_names=['poor', 'at_risk', 'good', 'excellent']))
            
            self.model = model
            return model
            
        except Exception as e:
            print(f"❌ Error training model: {e}")
            return None
    
    def predict_credit_scores(self, df: pd.DataFrame) -> pd.DataFrame:
        """Predict credit scores for all businesses"""
        results = df.copy()
        
        # Apply hard filters
        results['filter_result'] = results.apply(lambda row: self.apply_hard_filters(row.to_dict()), axis=1)
        
        # Calculate credit scores for businesses that pass hard filters
        passed_mask = results['filter_result'] == 'pass'
        
        if self.model and ML_AVAILABLE:
            # Use trained XGBoost model
            features = ['customer_number', 'customer_order', 'amount', 'days_since_last_transaction', 'customer_stickiness']
            X = results.loc[passed_mask, features]
            
            if len(X) > 0:
                dmatrix = xgb.DMatrix(X)
                predictions = self.model.predict(dmatrix)
                predicted_categories = np.argmax(predictions, axis=1)
                category_map = {0: 'poor', 1: 'at_risk', 2: 'good', 3: 'excellent'}
                results.loc[passed_mask, 'predicted_category'] = [category_map[p] for p in predicted_categories]
        
        # Calculate credit scores using formula
        for idx, row in results.iterrows():
            if row['filter_result'] == 'pass':
                score = self.calculate_credit_score_from_features(row.to_dict())
                results.at[idx, 'predicted_credit_score'] = score
                if 'predicted_category' not in results.columns or pd.isna(results.at[idx, 'predicted_category']):
                    results.at[idx, 'predicted_category'] = self.categorize_credit_score(score)
            else:
                results.at[idx, 'predicted_credit_score'] = 300  # Minimum score for rejected
                results.at[idx, 'predicted_category'] = 'rejected'
        
        return results
    
    def update_firebase_with_predictions(self, predictions_df: pd.DataFrame):
        """Update Firebase business profiles with AI predictions"""
        if not self.db:
            print("❌ Firebase not initialized")
            return
        
        try:
            updated_count = 0
            for _, row in predictions_df.iterrows():
                business_id = row['business_id']
                
                update_data = {
                    'creditScore': float(row['predicted_credit_score']),
                    'creditCategory': row['predicted_category'],
                    'filterResult': row['filter_result'],
                    'aiUpdatedAt': firestore.SERVER_TIMESTAMP
                }
                
                self.db.collection('businesses').document(business_id).update(update_data)
                updated_count += 1
            
            print(f"✅ Updated {updated_count} business profiles in Firebase")
            
        except Exception as e:
            print(f"❌ Error updating Firebase: {e}")
    
    def generate_report(self, df: pd.DataFrame) -> str:
        """Generate a comprehensive report of the AI analysis"""
        report = []
        report.append("🎯 PEPE AI CREDIT SCORING REPORT")
        report.append("=" * 50)
        report.append(f"Analysis Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"Total Businesses Analyzed: {len(df)}")
        report.append("")
        
        # Hard filter results
        filter_counts = df['filter_result'].value_counts()
        report.append("📊 HARD FILTER RESULTS:")
        for filter_type, count in filter_counts.items():
            percentage = (count / len(df)) * 100
            report.append(f"  {filter_type}: {count} ({percentage:.1f}%)")
        report.append("")
        
        # Credit score distribution
        if 'predicted_category' in df.columns:
            category_counts = df['predicted_category'].value_counts()
            report.append("💳 CREDIT CATEGORY DISTRIBUTION:")
            for category, count in category_counts.items():
                percentage = (count / len(df)) * 100
                report.append(f"  {category}: {count} ({percentage:.1f}%)")
            report.append("")
        
        # Score statistics
        if 'predicted_credit_score' in df.columns:
            scores = df['predicted_credit_score']
            report.append("📈 CREDIT SCORE STATISTICS:")
            report.append(f"  Average Score: {scores.mean():.1f}")
            report.append(f"  Median Score: {scores.median():.1f}")
            report.append(f"  Min Score: {scores.min():.1f}")
            report.append(f"  Max Score: {scores.max():.1f}")
            report.append("")
        
        # Feature importance insights
        if len(df) > 0:
            report.append("🔍 BUSINESS INSIGHTS:")
            high_amount = df[df['amount'] > df['amount'].median()]
            report.append(f"  High-revenue businesses: {len(high_amount)} ({len(high_amount)/len(df)*100:.1f}%)")
            
            recent_activity = df[df['days_since_last_transaction'] <= 30]
            report.append(f"  Recently active: {len(recent_activity)} ({len(recent_activity)/len(df)*100:.1f}%)")
            
            high_customers = df[df['customer_number'] >= 5]
            report.append(f"  Diverse customer base (5+): {len(high_customers)} ({len(high_customers)/len(df)*100:.1f}%)")
        
        return "\n".join(report)

def main():
    """Main execution function"""
    print("🚀 Starting Firebase-PepeAI Integration")
    print("=" * 50)
    
    # Initialize integration
    integration = FirebaseAIIntegration()
    
    # Option 1: Load from exported JSON file (if available)
    json_file = "business_ai_training_data.json"
    if os.path.exists(json_file):
        print(f"📁 Loading data from {json_file}")
        df = integration.load_sample_data_from_json(json_file)
    else:
        print("📁 JSON file not found, using sample data generation")
        # Generate sample data for demonstration
        sample_data = []
        for i in range(20):
            features = {
                'business_id': f'BIZ{i:05d}',
                'business_name': f'Sample Business {i+1}',
                'industry': 'Technology',
                'customer_number': np.random.randint(1, 20),
                'customer_order': np.random.uniform(1, 5),
                'amount': np.random.uniform(1000, 50000),
                'days_since_last_transaction': np.random.randint(1, 365),
                'customer_stickiness': np.random.uniform(0, 0.7),
                'transaction_count': np.random.randint(5, 50),
                'completion_rate': np.random.uniform(0.3, 0.95),
                'clearance_days': np.random.uniform(5, 30)
            }
            sample_data.append(features)
        df = pd.DataFrame(sample_data)
    
    if df.empty:
        print("❌ No data available for processing")
        return
    
    print(f"✅ Loaded {len(df)} businesses for analysis")
    
    # Train XGBoost model
    print("\n🤖 Training XGBoost Model...")
    model = integration.train_xgboost_model(df)
    
    # Generate predictions
    print("\n🎯 Generating Credit Score Predictions...")
    predictions = integration.predict_credit_scores(df)
    
    # Generate report
    print("\n📊 Generating Analysis Report...")
    report = integration.generate_report(predictions)
    print(report)
    
    # Save results
    print("\n💾 Saving Results...")
    predictions.to_csv('ai_credit_predictions.csv', index=False)
    
    with open('ai_analysis_report.txt', 'w') as f:
        f.write(report)
    
    print("✅ Results saved to:")
    print("  - ai_credit_predictions.csv")
    print("  - ai_analysis_report.txt")
    
    # Update Firebase if connected
    if integration.db:
        print("\n🔄 Updating Firebase with predictions...")
        integration.update_firebase_with_predictions(predictions)
    
    print("\n🎉 Integration Complete!")

if __name__ == "__main__":
    main()
