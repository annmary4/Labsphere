async function testBlobPutAndGet() {
  const url = "https://jsonblob.com/api/jsonBlob/019fd57b-3e4a-7996-8d3b-034f027f9209";
  const users = [
    { id: "USR-1001", username: "admin", email: "admin@labsphere.io", passwordHash: "admin123", role: "ADMIN", fullName: "Lab Administrator" },
    { id: "USR-9999", username: "mobileuser", email: "mobile@test.com", passwordHash: "mypass123", role: "STUDENT", fullName: "Mobile User" }
  ];

  console.log("PUT to jsonblob...");
  const putRes = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ updatedAt: new Date().toISOString(), users })
  });
  console.log("PUT Status:", putRes.status);

  console.log("GET from jsonblob...");
  const getRes = await fetch(url, { headers: { "Accept": "application/json" } });
  console.log("GET Status:", getRes.status);
  const data = await getRes.json();
  console.log("Retrieved Data:", JSON.stringify(data, null, 2));
}

testBlobPutAndGet();
