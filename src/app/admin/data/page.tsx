"use client";

import { faUpload, faLink, faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useCallback, useEffect, useMemo } from "react";
import Papa from "papaparse";
import { pharm_boxes } from "@/schemas/data"; // 사용할 테이블
import { extractColumnsFromSchema } from "@/app/utils/data/schemaExtractor";
import { uploadData } from "./actions";

const DB_COLUMNS = extractColumnsFromSchema(pharm_boxes, { exclude: ["id", "region"] });

type StateType = { code: string; name: string, id: number };
type ColumnMapping = Record<string, string | null>;

export default function DataUploadPage() {
  const [stateList, setStates] = useState<StateType[]>([]);
  const [cityList, setCities] = useState<StateType[]>([]);
  const [selectedState, selectState] = useState("");
  const [selectedCity, selectCity] = useState(-1);
  const [fileEncoding, setFileEncoding] = useState("UTF-8");
  const [fileData, setFileData] = useState<any[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});

  const csvColumns = useMemo(() => {
    return fileData.length > 0 ? Object.keys(fileData[0]) : [];
  }, [fileData]);

  const usedDBColumns = useMemo(() => {
    return new Set(Object.values(columnMapping).filter(Boolean));
  }, [columnMapping]);

  const validation = useMemo(() => {
    const mapped = Object.values(columnMapping).filter(Boolean);
    const missingRequired = DB_COLUMNS.filter(
      (col) => col.required && !mapped.includes(col.key)
    );
    return {
      isValid: missingRequired.length === 0,
      missingRequired,
      mappedCount: mapped.length,
    };
  }, [columnMapping]);

  const getStateData = useCallback(async () => {
    const res = await fetch("/api/geo/supported?type=state");
    setStates(await res.json());
  }, []);

  const getCityData = useCallback(async (state: string) => {
    if (!state) return setCities([]);
    const res = await fetch(`/api/geo/supported?type=city&state=${state}`);
    setCities(await res.json());
  }, []);

  useEffect(() => { 
    async function setData() {
      await getStateData();
      if (selectedState) {
        await getCityData(selectedState);
      }
    }
    setData(); 
  }, [getStateData, getCityData, selectedState]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    Papa.parse(file, {
      encoding: fileEncoding,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setFileData(results.data);
        setColumnMapping({});
      },
    });
  };

  const autoMap = () => {
    const newMapping: ColumnMapping = {};
    const used = new Set<string>();

    csvColumns.forEach((csvCol) => {
      const normalized = csvCol.toLowerCase().replace(/[_\s-]/g, "");
      
      const match = DB_COLUMNS.find((db) => {
        if (used.has(db.key)) return false;
        const keyNorm = db.key.toLowerCase().replace(/[_\s-]/g, "");
        const labelNorm = db.label.toLowerCase().replace(/[_\s-]/g, "");
        return normalized === keyNorm || normalized === labelNorm ||
               normalized.includes(keyNorm) || keyNorm.includes(normalized);
      });

      if (match) {
        newMapping[csvCol] = match.key;
        used.add(match.key);
      }
    });

    setColumnMapping(newMapping);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid) return alert("필수 컬럼을 모두 매핑해주세요.");

    const transformedData = fileData.map((row) => {
      const newRow: Record<string, any> = {};
      
      Object.entries(columnMapping).forEach(([csvCol, dbCol]) => {
        if (!dbCol) return;
        
        const colInfo = DB_COLUMNS.find((c) => c.key === dbCol);
        let value = row[csvCol];

        if (colInfo?.type === "number") {
          value = value ? Number(String(value).replace(/,/g, "")) : null;
        } else if (colInfo?.type === "boolean") {
          value = ["true", "1", "yes", "y", "예"].includes(String(value).toLowerCase());
        } else if (colInfo?.type === "date") {
          value = value ? new Date(value) : null;
        }

        newRow[dbCol] = value;
      });

      return newRow;
    });
    console.log("업로드 데이터:", transformedData);

    await uploadData(transformedData, selectedCity)
  };

  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold">데이터 업로드</h3>

      <div className="my-3 p-2 rounded-xl shadow-md flex gap-2 items-center">
        <FontAwesomeIcon icon={faInfoCircle} />
        <span className="font-medium">DB 컬럼</span>
        {DB_COLUMNS.map((col) => (
          <span key={col.key} className={`inline-block px-2 py-0.5 m-0.5 rounded text-xs ${
            col.required ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
          }`}>
            {col.label}{col.required && " *"}
          </span>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <select className="plain-select-form" value={selectedState} onChange={(e) => selectState(e.target.value)}>
            <option value="">시/도</option>
            {stateList.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
          </select>
          
          <select className="plain-select-form" value={selectedCity} onChange={(e) => selectCity(Number(e.target.value))} disabled={!selectedState}>
            <option value="">시/군/구</option>
            {cityList.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          
          <select className="plain-select-form" value={fileEncoding} onChange={(e) => setFileEncoding(e.target.value)}>
            <option value="UTF-8">UTF-8</option>
            <option value="EUC-KR">EUC-KR</option>
          </select>
          
          <input type="file" accept=".csv" className="plain-select-form p-2 flex-1" onChange={handleFileChange} />
          
          <button type="submit" className="plain-btn flex gap-2 items-center disabled:opacity-50" disabled={!validation.isValid || !fileData.length}>
            <FontAwesomeIcon icon={faUpload} /> 업로드
          </button>
        </div>

        {csvColumns.length > 0 && (
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold flex items-center gap-2">
                <FontAwesomeIcon icon={faLink} /> 컬럼 매핑
                <span className="text-sm font-normal text-gray-500">
                  ({validation.mappedCount}/{csvColumns.length})
                </span>
              </h4>
              <div className="flex gap-2">
                {validation.isValid ? (
                  <span className="text-green-600 text-sm"><FontAwesomeIcon icon={faCheck} /> 완료</span>
                ) : (
                  <span className="text-red-600 text-sm">
                    <FontAwesomeIcon icon={faTimes} /> 필수: {validation.missingRequired.map((c) => c.label).join(", ")}
                  </span>
                )}
                <button type="button" onClick={autoMap} className="px-3 py-1 text-sm bg-blue-500 text-white rounded">
                  자동 매핑
                </button>
                <button type="button" onClick={() => setColumnMapping({})} className="px-3 py-1 text-sm bg-gray-500 text-white rounded">
                  초기화
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {csvColumns.map((csvCol) => (
                <div key={csvCol} className={`p-2 rounded border ${columnMapping[csvCol] ? "border-green-400 bg-green-50 dark:bg-green-900/20" : "border-gray-200"}`}>
                  <div className="font-mono text-sm truncate mb-1" title={csvCol}>{csvCol}</div>
                  <select
                    className="w-full p-1.5 text-sm border rounded"
                    value={columnMapping[csvCol] || ""}
                    onChange={(e) => setColumnMapping((prev) => ({ ...prev, [csvCol]: e.target.value || null }))}
                  >
                    <option value="">선택 &gt;</option>
                    {DB_COLUMNS.map((db) => (
                      <option key={db.key} value={db.key} disabled={usedDBColumns.has(db.key) && columnMapping[csvCol] !== db.key}>
                        {db.label}{db.required ? " *" : ""}{usedDBColumns.has(db.key) && columnMapping[csvCol] !== db.key ? " ✓" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {fileData.length > 0 && (
          <div className="overflow-x-auto border rounded">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  {csvColumns.map((col) => (
                    <th key={col} className="px-3 py-2 text-left border-b">
                      {col}
                      {columnMapping[col] && (
                        <div className="text-xs text-green-600 font-normal">
                          → {DB_COLUMNS.find((c) => c.key === columnMapping[col])?.label}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fileData.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    {csvColumns.map((col, j) => (
                      <td key={j} className="px-3 py-2 border-b truncate max-w-[150px]">{row[col]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {fileData.length > 5 && (
              <div className="p-2 text-center text-sm text-gray-500">외 {fileData.length - 5}건</div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
