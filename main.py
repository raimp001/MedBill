from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
import logging

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///medical_billing.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Bill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.String(50), nullable=False)
    date = db.Column(db.Date, nullable=False)
    visit_type = db.Column(db.String(50), nullable=False)
    diagnosis = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_token = db.Column(db.String(10), nullable=False)
    payment_status = db.Column(db.String(20), nullable=False, default='pending')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/submit_bill', methods=['POST'])
def submit_bill():
    try:
        data = request.json
        logger.info(f"Received bill submission: {data}")

        new_bill = Bill(
            patient_id=data['patientId'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            visit_type=data['visitType'],
            diagnosis=data['diagnosis'],
            amount=float(data['amount']),
            payment_token=data['paymentToken']
        )
        db.session.add(new_bill)
        db.session.commit()

        logger.info(f"Bill submitted successfully: {new_bill.id}")
        return jsonify({"message": "Bill submitted successfully", "id": new_bill.id}), 201
    except KeyError as e:
        logger.error(f"Missing required field in bill submission: {str(e)}")
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except ValueError as e:
        logger.error(f"Invalid data in bill submission: {str(e)}")
        return jsonify({"error": f"Invalid data: {str(e)}"}), 400
    except Exception as e:
        logger.error(f"Unexpected error in bill submission: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/get_bills', methods=['GET'])
def get_bills():
    try:
        bills = Bill.query.all()
        logger.info(f"Retrieved {len(bills)} bills")
        return jsonify([
            {
                "id": bill.id,
                "patientId": bill.patient_id,
                "date": bill.date.isoformat(),
                "visitType": bill.visit_type,
                "diagnosis": bill.diagnosis,
                "amount": bill.amount,
                "paymentToken": bill.payment_token,
                "paymentStatus": bill.payment_status
            } for bill in bills
        ])
    except Exception as e:
        logger.error(f"Error retrieving bills: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving bills"}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
