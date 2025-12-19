import { getColumns, } from "drizzle-orm";
import type { Table } from "drizzle-orm";

export type DBColumnInfo = {
  key: string;
  label: string;
  type: "string" | "number" | "date" | "boolean";
  required: boolean;
};

function mapColumnType(dataType: string): DBColumnInfo["type"] {
  const typeMap: Record<string, DBColumnInfo["type"]> = {
    string: "string",
    number: "number",
    bigint: "number",
    boolean: "boolean",
    date: "date",
  };
  
  if (dataType.includes("int") || dataType.includes("serial") || dataType.includes("real") || dataType.includes("float") || dataType.includes("decimal")) {
    return "number";
  }
  if (dataType.includes("timestamp") || dataType.includes("date") || dataType.includes("time")) {
    return "date";
  }
  if (dataType.includes("text") || dataType.includes("char") || dataType.includes("uuid")) {
    return "string";
  }
  
  return typeMap[dataType] || "string";
}

type ExtractOptions = {
  exclude?: string[]
}

export function extractColumnsFromSchema(table: Table, options: ExtractOptions = {}): DBColumnInfo[] {
  const { exclude = [] } = options;
  const columns = getColumns(table);
  
  return Object.entries(columns).filter(([key]) => !exclude.includes(key)).map(([key, column]) => {
    const col = column as any;

    return {
      key,
      label: key,
      type: mapColumnType(col.dataType),
      required: col.notNull && !col.hasDefault,
    };
  });
}