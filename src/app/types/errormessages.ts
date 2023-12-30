export const ERROR = {
    TIMEOUT: "위치 정보를 얻고자 하였으나 5초 내 응답을 얻지 못했습니다. 다시 시도하세요.",
    POSITION_UNKNOWN: "위치 정보를 얻고자 하였으나 현재 위치를 찾지 못했습니다. 다시 시도하세요.",
    PERMISSION: "사용자가 위치 권한을 거부하여 현재 위치를 찾을 수 없습니다. 다시 시도하세요.",
    UNSUPPORTED: "서울특별시인 경우, 스마트 서울맵을 이용하세요. 위치 정보는 저장됩니다.",
    UNKNOWN: "알 수 없는 이유로 위치 정보 취득에 실패하였습니다. 다시 시도하세요."
} as const;

type ERROR = typeof ERROR[keyof typeof ERROR];