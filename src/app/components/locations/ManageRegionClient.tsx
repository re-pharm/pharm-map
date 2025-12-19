"use client";
import { useState, useTransition, useEffect } from "react";
import { SyncSGISButton } from "./SyncSGISButton";
import { toggleStateAvailability } from "@/app/admin/regions/actions";
import ManageCityClient from "./ManageCityClient";

type States = {
  name: string;
  code: string;
  avail: boolean;
}

type Props = {
  registered_states: States[];
}

export default function ManageRegionClient(props: Props) {
  const { registered_states } = props;
  const [states, setStates] = useState<States[]>(registered_states);
  const [isPending, startTransition] = useTransition();
  const [pendingCode, setPendingCode] = useState<string | null>(null);
  const [cityManageEnabled, setCityManageEnabled] = useState<string|undefined>(undefined);

  useEffect(() => {
    setStates(registered_states);
  }, [registered_states]);

  function enableCityManage(code: string) {
    setCityManageEnabled(code);
  }

  function handleToggle(code: string, currentAvail: boolean) {
    setPendingCode(code);
    
    setStates((prev) =>
      prev.map((state) =>
        state.code === code ? { ...state, avail: !currentAvail } : state
      )
    );

    startTransition(async () => {
      try {
        await toggleStateAvailability(code, currentAvail);
      } catch (error) {
        setStates((prev) =>
          prev.map((state) =>
            state.code === code ? { ...state, avail: currentAvail } : state
          )
        );
        console.error("Failed to update state availability:", error);
      } finally {
        setPendingCode(null);
      }
    });
  };

  return (
    <section className="flex gap-2">
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl">등록된 시/도 목록</h4>
          {states.length === 0 && <SyncSGISButton />}
        </div>

        {states.length === 0 ? (
          <p className="text-gray-500">
            등록된 시/도가 없습니다.
          </p>
        ) : (
          <ul id="add-states-from-list" className="overflow-y-scroll rounded-xl max-h-[68vh] flex flex-col gap-2 p-2 shrink-0">
            {states.map((state) => (
              <li key={state.code} className="flex p-2 rounded-xl shadow-lg basis-0 w-full text-start justify-between items-center bg-white" onClick={() => enableCityManage(state.code)}>
                <h2 className="text-lg font-bold mb-2">
                  {state.name} ({state.code})
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">서비스</span>
                  <button
                    onClick={() => handleToggle(state.code, state.avail)}
                    disabled={isPending && pendingCode === state.code}
                    className={`
                relative inline-flex h-6 w-11 items-center rounded-full
                transition-colors duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                ${state.avail ? "bg-blue-600" : "bg-gray-300"}
              `}
                    role="switch"
                    aria-checked={state.avail}
                  >
                    <span
                      className={`
                  inline-block h-4 w-4 transform rounded-full bg-white
                  transition-transform duration-200 ease-in-out shadow-sm
                  ${state.avail ? "translate-x-6" : "translate-x-1"}
                `}
                    />
                  </button>
                  <span className={`text-sm font-medium ${state.avail ? "text-blue-600" : "text-gray-500"}`}>
                    {state.avail ? "ON" : "OFF"}
                  </span>
                  {isPending && pendingCode === state.code && (
                    <span className="text-xs text-gray-400 animate-pulse">저장 중...</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {cityManageEnabled && (
        <ManageCityClient code={cityManageEnabled} />
      )}
    </section>
  );
}