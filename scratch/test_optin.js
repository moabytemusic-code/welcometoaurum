async function runTest() {
  const payload = {
    email: 'test.aurum.optin@gmail.com',
    first_name: 'Testy',
    landing_variant: 'syllabus-freemium'
  };

  console.log('Sending opt-in request with payload:', payload);

  try {
    const response = await fetch('http://localhost:3000/api/optin', {
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

runTest();
