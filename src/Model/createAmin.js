import bcrypt from "bcryptjs";
import { User } from "./userModel.js";

export const createAdminIfNotExists = async () => {
  try {
    const adminEmail = "admin@gmail.com";

    // Find admin
    const admin = await User.findOne({ where: { email: adminEmail } });

    if (admin) {
      // Update role if needed
      if (admin.role !== "admin") {
        admin.role = "admin";
        await admin.save();
        console.log("✅ Admin role updated to 'admin'");
      } else {
        console.log("✅ Admin already exists with correct role");
      }
      return;
    }

    // Create admin if not exists
    await User.create({
      fullname: "Admin",
      username: "admin",
      email: adminEmail,
      password: await bcrypt.hash("Admin123%", 10),
      role: "admin",
    });

    console.log("✅ Admin created successfully");
  } catch (err) {
    console.error("❌ Failed to create admin:", err);
  }
};
