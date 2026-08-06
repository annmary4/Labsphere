const fs = require('fs');

async function createUsersCloudStore() {
  try {
    let raw = fs.readFileSync("c:/Users/USER/Desktop/ann/labsphere/data/db.json", "utf8");
    raw = raw.replace(/^\uFEFF/, '');
    const db = JSON.parse(raw);

    const payload = {
      name: "LabSphere Master Users Store",
      data: {
        updatedAt: new Date().toISOString(),
        users: db.users || []
      }
    };

    console.log("Creating dedicated Users Cloud Store on restful-api.dev...");
    const res = await fetch("https://api.restful-api.dev/objects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    console.log("Create Status:", res.status);
    const data = await res.json();
    console.log("Created Cloud Store Object ID:", data.id);
    console.log("Users in store:", data.data.users.length);
  } catch (err) {
    console.error("Failed to create users cloud store:", err.message);
  }
}

createUsersCloudStore();
