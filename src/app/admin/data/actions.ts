"use server"

import { db } from "@/app/utils/data/database";
import { DBColumnInfo, extractColumnsFromSchema } from "@/app/utils/data/schemaExtractor";
import { pharm_boxes } from "@/schemas/data";

export async function uploadData(data: any[], city_id: number) {
  const newData = data.map(item => ({
    ...item,
    region: city_id
  }));

  const req = await db.insert(pharm_boxes).values(newData);

  if (req) {
    return { success: true }
  } else {
    return { success: false }
  }
}