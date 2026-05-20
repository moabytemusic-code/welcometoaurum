async function test() {
  const url = 'http://localhost:3000/api/optin';
  const payload = {
    email: 'kentjigga@gmail.com',
    sponsor_code: '1W145K',
    sponsor_name: 'Aurum Corporate',
    landing_variant: 'neyro_gateway',
    first_name: 'Ken'
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    console.log("Status Code:", res.status);
    const data = await res.json();
    console.log("Response Data:", data);
  } catch (err) {
    console.error("Fetch failed:", err.message);
  }
}

test();
