import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import stylistic from "@stylistic/eslint-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([{
  extends: [...nextCoreWebVitals],
  plugins: { "@stylistic": stylistic },
  rules: {
    "@stylistic/indent": ["warn", 2]
  }
}]);