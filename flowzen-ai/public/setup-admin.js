// Add admin user for testing
const adminUser = {
  id: "admin-1",
  name: "Admin User",
  email: "admin@flowzen.ai",
  password: "admin123",
  role: "admin",
  createdAt: new Date().toISOString()
}

const users = JSON.parse(localStorage.getItem("flowzen_users") || "[]")
const existingAdmin = users.find((u: any) => u.role === "admin")

if (!existingAdmin) {
  users.push(adminUser)
  localStorage.setItem("flowzen_users", JSON.stringify(users))
  console.log("Admin user created: admin@flowzen.ai / admin123")
}