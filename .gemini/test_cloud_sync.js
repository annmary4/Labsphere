async function testRestfulApi() {
  try {
    console.log("Creating object on restful-api.dev...");
    const createRes = await fetch("https://api.restful-api.dev/objects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "LabSphere Master Users",
        data: {
          users: [
            { id: "admin", username: "admin", role: "admin" },
            { id: "student", username: "student", role: "student" }
          ]
        }
      })
    });
    console.log("Create Status:", createRes.status);
    const createdData = await createRes.json();
    console.log("Created Object:", createdData);
    const id = createdData.id;

    console.log("Updating object ID:", id);
    const updateRes = await fetch(`https://api.restful-api.dev/objects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "LabSphere Master Users",
        data: {
          users: [
            { id: "admin", username: "admin", role: "admin" },
            { id: "user_999", username: "alice_smith", role: "student" }
          ]
        }
      })
    });
    console.log("Update Status:", updateRes.status);

    console.log("Reading object back...");
    const getRes = await fetch(`https://api.restful-api.dev/objects/${id}`);
    console.log("Get Status:", getRes.status);
    const retrieved = await getRes.json();
    console.log("Retrieved Data:", JSON.stringify(retrieved, null, 2));
  } catch (err) {
    console.error("Restful-api error:", err.message);
  }
}

testRestfulApi();
