async function test() {
  const url = 'https://www.welcometoaurum.com/api/optin';
  const payload = {
    email: 'productiontest_gateway@example.com',
    sponsor_code: '1W145K',
    sponsor_name: 'Aurum Corporate',
    landing_variant: 'neyro_gateway',
    first_name: 'ProdTester'
  };

  try {
    console.log(`Sending POST to live URL: ${url}`);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    console.log("Status Code:", res.status);
    try {
      const data = await res.json();
      console.log("Response Data:", data);
    } catch (e) {
      const text = await res.text();
      console.log("Response Text (non-JSON):", text.slice(0, 500));
    }
  } catch (err) {
    console.error("Fetch failed:", err.message);
  }
}

test();
