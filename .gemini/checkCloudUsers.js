async function checkCloudUsers() {
  try {
    const res = await fetch("https://api.restful-api.dev/objects/ff8081819f7e10ae019fd56da7af7eba?t=" + Date.now());
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Cloud Object Data:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error checking cloud users:", err.message);
  }
}

checkCloudUsers();
