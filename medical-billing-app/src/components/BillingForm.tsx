'use client';
import { useState } from 'react';
import axios from 'axios';

export default function BillingForm() {
  const [formData, setFormData] = useState({
    patientId: '',
    date: '',
    visitType: '',
    diagnosis: '',
    amount: '',
    paymentToken: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    console.log('Form submission started:', formData);

    try {
      // Ensure the API endpoint matches your backend route
      const response = await axios.post('/api/submit_bill', formData);
      console.log('API response:', response.data);
      setSuccess('Bill submitted successfully!');
      // Reset form after successful submission
      setFormData({
        patientId: '',
        date: '',
        visitType: '',
        diagnosis: '',
        amount: '',
        paymentToken: '',
      });
    } catch (error) {
      console.error('Error submitting bill:', error);
      setError('Failed to submit bill. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      <div>
        <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">Patient ID</label>
        <input
          type="text"
          id="patientId"
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="visitType" className="block text-sm font-medium text-gray-700">Visit Type</label>
        <select
          id="visitType"
          name="visitType"
          value={formData.visitType}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select visit type</option>
          <option value="consultation">Consultation</option>
          <option value="followUp">Follow-up</option>
          <option value="procedure">Procedure</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>
      <div>
        <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">Diagnosis</label>
        <input
          type="text"
          id="diagnosis"
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="paymentToken" className="block text-sm font-medium text-gray-700">Payment Token</label>
        <select
          id="paymentToken"
          name="paymentToken"
          value={formData.paymentToken}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select payment token</option>
          <option value="USD">USD</option>
          <option value="BTC">Bitcoin (BTC)</option>
          <option value="ETH">Ethereum (ETH)</option>
          <option value="USDC">USD Coin (USDC)</option>
        </select>
      </div>
      <div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit Bill
        </button>
      </div>
    </form>
  );
}
