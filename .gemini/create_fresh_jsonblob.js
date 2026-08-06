async function createFreshBlob() {
  try {
    const defaultUsers = [
      { id: "USR-1001", username: "admin", email: "admin@labsphere.io", passwordHash: "admin123", role: "ADMIN", fullName: "Lab Administrator", status: "ACTIVE", createdAt: "2026-08-01" },
      { id: "USR-1002", username: "engineer", email: "engineer@labsphere.io", passwordHash: "eng123", role: "ENGINEER", fullName: "Lead Lab Engineer", status: "ACTIVE", createdAt: "2026-08-01" },
      { id: "USR-1003", username: "researcher", email: "researcher@labsphere.io", passwordHash: "research123", role: "MANAGEMENT", fullName: "Research Associate", status: "ACTIVE", createdAt: "2026-08-01" },
      { id: "USR-1004", username: "student", email: "student@labsphere.io", passwordHash: "student123", role: "STUDENT", fullName: "Student Intern", status: "ACTIVE", createdAt: "2026-08-01" }
    ];

    const res = await fetch("https://jsonblob.com/api/jsonBlob", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        updatedAt: new Date().toISOString(),
        users: defaultUsers
      })
    });

    console.log("Create Status:", res.status);
    const location = res.headers.get("location");
    console.log("PERMANENT BLOB LOCATION:", location);
  } catch (e) {
    console.error("Create error:", e.message);
  }
}

createFreshBlob();
