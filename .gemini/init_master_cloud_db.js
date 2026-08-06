const fs = require('fs');

async function initMasterCloudDb() {
  try {
    let raw = fs.readFileSync("c:/Users/USER/Desktop/ann/labsphere/data/db.json", "utf8");
    raw = raw.replace(/^\uFEFF/, '');
    const db = JSON.parse(raw);

    const CLOUD_OBJECT_ID = "ff8081819f7e10ae019fd56d35747eb9";
    const cloudUrl = `https://api.restful-api.dev/objects/${CLOUD_OBJECT_ID}`;

    const payload = {
      name: "LabSphere Enterprise Cloud Master Database",
      data: {
        updatedAt: new Date().toISOString(),
        users: db.users || [],
        components: db.components || [],
        boxes: db.boxes || [],
        racks: db.racks || [],
        requests: db.requests || [],
        transactions: db.transactions || [],
        projects: db.projects || []
      }
    };

    console.log(`Pushing initial master DB to Cloud Object ID ${CLOUD_OBJECT_ID}...`);

    const res = await fetch(cloudUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    console.log("Cloud Push Status:", res.status);
    if (res.ok) {
      const data = await res.json();
      console.log("SUCCESS! Cloud DB initialized:", data.data.users.length, "users,", data.data.components.length, "components.");
    }
  } catch (err) {
    console.error("Failed to init master cloud DB:", err.message);
  }
}

initMasterCloudDb();
