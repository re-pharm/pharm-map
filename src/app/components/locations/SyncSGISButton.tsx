"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { syncCitiesFromSgis, syncStatesFromSgis } from "@/app/admin/regions/actions";
import { LoadingIcon } from "@/app/components/ani/LoadingIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";

type Props = {
  isCity?: boolean;
  code?: string;
  onSuccess?: () => void;
}

export function SyncSGISButton({ isCity, code, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSync() {
    setLoading(true);
    setError(null);

    const result = isCity ? await syncCitiesFromSgis(code as string) : await syncStatesFromSgis();
    
    if (result.success) {
      if (onSuccess) {
        onSuccess();
      }
      if (!isCity) {
        router.refresh();
      }
    } else {
      setError(result.error ?? "동기화 실패");
    }

    setLoading(false);
  }

  return (
    <div>
      <button onClick={handleSync} disabled={loading} className="plain-btn flex items-center gap-2">
        <FontAwesomeIcon icon={faSync} spin={loading} />
        {loading ? "데이터 등록 중" : "SGIS에서 정보 가져오기"}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
