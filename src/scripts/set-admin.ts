import { db } from "../app/utils/data/database";
import { user, accountRoleType } from "../schemas/auth";
import { eq } from "drizzle-orm";

async function setAdmin() {
  const targetEmail = process.argv[2];
  const adminRole = accountRoleType.enumValues[0];

  try {
    await db
      .update(user)
      .set({ role: adminRole })
      .where(eq(user.email, targetEmail));
    console.log(`✅ ${targetEmail} 유저가 ${adminRole}로 승격되었습니다.`);
  } catch (error) {
    console.error("❌ 오류:", error);
  }
}

setAdmin();