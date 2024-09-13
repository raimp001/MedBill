document.addEventListener('DOMContentLoaded', function() {
    const billForm = document.getElementById('billForm');
    const billsList = document.getElementById('billsList');

    billForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(billForm);
        const billData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/submit_bill', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(billData),
            });

            if (response.ok) {
                alert('Bill submitted successfully!');
                billForm.reset();
                fetchBills();
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting the bill.');
        }
    });

    async function fetchBills() {
        try {
            const response = await fetch('/api/get_bills');
            const bills = await response.json();
            displayBills(bills);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching bills.');
        }
    }

    function displayBills(bills) {
        billsList.innerHTML = '';
        bills.forEach(bill => {
            const li = document.createElement('li');
            li.textContent = `Patient ID: ${bill.patientId}, Amount: $${bill.amountUsd}, Status: ${bill.paymentStatus}`;
            billsList.appendChild(li);
        });
    }

    fetchBills();
});
