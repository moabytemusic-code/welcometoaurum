async function testOrderEndpoint() {
  const url = 'http://localhost:3000/api/order';
  const payload = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'test.order.user@gmail.com',
    phone: '+15555555555',
    telegram: '@testorder',
    plan: 'vip',
    affiliateCode: '1W145K'
  };

  console.log('Sending mock order request to endpoint:', url);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('Response Status:', response.status);
    const data = await response.json();
    console.log('Response Data:', data);
  } catch (error) {
    console.error('Request failed:', error);
  }
}

testOrderEndpoint();
