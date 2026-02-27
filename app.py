from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
import time
import numpy as np
from sklearn.ensemble import IsolationForest
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class BiasDetector:
    """Complete bias detection for clinical trials"""
    
    def check_age_bias(self, patients):
        """YOUR EXAMPLE: Detect if too many young patients"""
        if not patients:
            return {'passed': True}
        
        total = len(patients)
        young = 0
        
        for p in patients:
            age = p.get('age', 0)
            if 18 <= age <= 40:
                young += 1
        
        if total > 0:
            young_pct = (young / total) * 100
            logger.info(f"Age check: {young_pct:.1f}% young patients")
            
            # YOUR SPECIFIC EXAMPLE: Reject if >80% are 18-40
            if young_pct > 80:
                return {
                    'passed': False,
                    'reason': f'❌ AGE BIAS: {young_pct:.1f}% patients are 18-40'
                }
        
        return {'passed': True}
    
    def check_gender_bias(self, patients):
        """Detect gender imbalance"""
        if not patients:
            return {'passed': True}
        
        male = sum(1 for p in patients if p.get('gender', '').upper() == 'M')
        female = sum(1 for p in patients if p.get('gender', '').upper() == 'F')
        total = male + female
        
        if total == 0:
            return {'passed': True}
        
        male_pct = (male / total) * 100
        female_pct = (female / total) * 100
        
        logger.info(f"Gender check: M:{male_pct:.1f}% F:{female_pct:.1f}%")
        
        if male_pct < 20 or male_pct > 80:
            return {
                'passed': False,
                'reason': f'❌ GENDER BIAS: {male_pct:.1f}% male, {female_pct:.1f}% female'
            }
        
        return {'passed': True}
    
    def check_anomalies(self, patients):
        """Detect statistical outliers using Isolation Forest"""
        if len(patients) < 10:
            return {'passed': True}
        
        ages = [[p.get('age', 0)] for p in patients]
        model = IsolationForest(contamination=0.1, random_state=42)
        predictions = model.fit_predict(ages)
        
        anomalies = sum(1 for p in predictions if p == -1)
        anomaly_pct = (anomalies / len(patients)) * 100
        
        logger.info(f"Anomaly check: {anomaly_pct:.1f}% outliers")
        
        if anomalies > len(patients) * 0.15:
            return {
                'passed': False,
                'reason': f'❌ ANOMALIES DETECTED: {anomalies} unusual patients ({anomaly_pct:.1f}%)'
            }
        
        return {'passed': True}
    
    def generate_token(self, trial_id):
        """Create unique ML approval token"""
        unique = f"{trial_id}_{time.time()}_{np.random.random()}"
        token = hashlib.sha256(unique.encode()).hexdigest()[:16]
        return f"ML_APPROVED_{token}"


detector = BiasDetector()

@app.route('/check-bias', methods=['POST'])
def check_bias():
    """Main endpoint: Receives trial data, returns pass/fail"""
    
    data = request.json
    trial_id = data.get('trialId', 'unknown')
    patients = data.get('patientData', [])
    
    logger.info(f"\n🔍 Checking trial: {trial_id} with {len(patients)} patients")
    
    # Run ALL checks
    age_result = detector.check_age_bias(patients)
    gender_result = detector.check_gender_bias(patients)
    anomaly_result = detector.check_anomalies(patients)
    
    # If ANY check fails → REJECT
    if not age_result['passed']:
        return jsonify({
            'passed': False,
            'reason': age_result['reason'],
            'ml_token': None,
            'biasScore': 90
        })
    
    if not gender_result['passed']:
        return jsonify({
            'passed': False,
            'reason': gender_result['reason'],
            'ml_token': None,
            'biasScore': 75
        })
    
    if not anomaly_result['passed']:
        return jsonify({
            'passed': False,
            'reason': anomaly_result['reason'],
            'ml_token': None,
            'biasScore': 50
        })
    
    # ALL CHECKS PASSED! Generate token
    token = detector.generate_token(trial_id)
    
    logger.info(f"✅ ALL CHECKS PASSED! Token: {token}")
    
    return jsonify({
        'passed': True,
        'ml_token': token,
        'reason': 'All bias checks passed',
        'biasScore': 10
    })

@app.route('/health', methods=['GET'])
def health():
    """Simple health check"""
    return jsonify({'status': 'healthy', 'service': 'ML Bias Detector'})

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 ML BIAS DETECTION SERVICE STARTING...")
    print("📍 URL: http://localhost:5000")
    print("📍 Endpoint: POST /check-bias")
    print("="*50 + "\n")
    app.run(host='0.0.0.0', port=5000, debug=True)