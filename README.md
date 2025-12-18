# 폐의약품 수거지도

`폐의약품 수거지도`는 공공데이터를 기반으로 [스마트 서울맵](https://map.seoul.go.kr/smgis2/)의 폐의약품 수거함 위치 지도와 유사하게 전국의 폐의약품 수거함 위치와 폐기법을 안내하는 지도입니다. 향후 개발을 통해 다양한 부가 기능을 함께 제공하여 보다 손쉽게 폐의약품을 배출하고 안전하게 폐기할 수 있도록 지원합니다.

## 지역별 지원 현황

### 현재 지원 지역

- 경기도 고양시
- 경기도 구리시
- 경상남도 김해시
- 경상북도 문경시
- 경상북도 포항시
- 충청남도 천안시
- 충청남도 아산시
- 충청남도 보령시
- 충청남도 논산시
- 인천광역시 전역
- 광주광역시 전역
- 세종특별자치시 전역

### 지원 예정 지역

> 지원 예정 지역의 데이터는 2024.02. 기준으로 데이터 존재 여부를 확인한 것으로, 현재 지원되는 지역 혹은 향후 실제 지원되는 지역과 차이가 있을 수 있습니다.

- 경상북도 19개 시/군
- 대구광역시 전역
- 대전광역시 3개 자치구
- 전라남도 전역
- ~~서울특별시 전역~~ <sup>데이터 확인 후 지원 확정</sup>

## 참여하기

프로젝트의 [팀원](https://github.com/re-pharm)이 되어 적극적으로 참여하실 수 있으며, 일반적인 형태의 기여, 문의 또한 가능합니다.

### 개발에 참여하기

#### 개발 환경

본 프로젝트는 다음 환경에서 배포할 것을 가정하고 제작되었습니다.

- Node.js server
- PostgreSQL DB

패키지 매니저 및 주요 프레임워크, 언어는 다음과 같습니다.

- Next.js 16 (`Create-Next-App`을 활용한 템플릿 사용)
- Yarn 4.12.0 (`PnP` 기능 미사용)
- TypeScript
- Node.js 24
- Drizzle ORM with Better-Auth


따라서, `git clone`하신 후에는 개발 서버 실행 전 `yarn install` 명령어를 실행해주세요. 만약 `yarn`을 찾을 수 없다고 나온다면, `node.js`가 설치되어 있는지 혹은 `corepack`이 설치되어 있는지 확인해주세요.

개발 서버는 `yarn dev`로 실행하시면 작동합니다. 기본 개발 서버 주소는 `localhost:3000`입니다.

> [!IMPORTANT]
> 버전 `3.0` 잎싹부터 종전 Supabase 방식에서 PostgreSQL DB + Better Auth로 전환됨에 따라, 데이터베이스 생성 절차가 간소화되었습니다. 이제 로컬 테스트를 위해 Supabase 인스턴스를 생성할 필요 없이 접속 정보, 데이터베이스만 환경 변수에 제대로 기입했다면 `npx drizzle-kit push` 한 번으로 필요한 테이블을 만들 수 있습니다.

#### .env 파일 설정

`.env` 파일 혹은 `.env.local` 파일로 특정한 키를 설정해야만 온전히 테스트가 가능합니다.

| 환경 변수명 | 설명 |
| -- | ---- |
| `NEXT_PUBLIC_KAKAO_MAP_KEY` | 카카오맵 SDK에서 지도를 불러오기 위한 키입니다. 내 애플리케이션의 *JavaScript 키*를 사용하시면 됩니다. |
| `KAKAO_REST_KEY` | 카카오 지도/로컬 API에서 현재 주소를 불러와, 현 위치 주변의 폐의약품 보관함을 불러오는 목적으로 사용합니다. 카카오 로그인 지원에도 사용됩니다. (3.1 이후) |
| `DATA_GO_KR_REST_KEY` | 공공데이터 포털에서 제공받은 데이터를 불러올 때 사용하는 API 키입니다. **인코딩된 값으로 저장**해야 정상 작동합니다. |
| `DATABASE_URL` | PostgreSQL 데이터베이스 연결을 위한 주소입니다. `postgresql://계정명:비밀번호@주소/데이터베이스명` 과 같이 입력합니다. |
| `HASH` | Sqids 관련하여 주소 형식을 일치시키기 위해 사용합니다. |
| `BETTER_AUTH_SECRET` | Better Auth 관련하여 계정 정보 암호화 등에 사용합니다. |
| `GITHUB_CLIENT_ID` | GitHub 로그인 및 제안 기능(3.2 이후) 통합에 사용합니다. 제안 기능을 사용할 경우, 반드시 GitHub Apps로 발급 받아 저장소가 위치한 계정에 설치하세요. |
| `GITHUB_CLIENT_SECRET` | 위 GitHub 로그인 지원에 필요합니다. |
| `KAKAO_CLIENT_SECRET` | 위 카카오 로그인 지원에 필요합니다. |

`.env.local`에는 아래 값을 반드시 넣어주세요.

- `SERVICE_URL`: 현재 주소에서 테스트를 위한 값입니다. 일반적으로 로컬 서버의 경우, `http://localhost:3000` 주소로 입력하시면 됩니다.

> [!CAUTION]
> `HASH`, `BETTER_AUTH_SECRET` 값은 데이터 무결성 및 보안에 중대한 영향을 주므로 다룰 때 각별히 주의하시고, 외부에 유출되지 않도록 하시기 바랍니다.

<details>
  <summary>`3.0`부터 사용 중지되는 환경 변수</summary>
  
  | 환경 변수명 | 설정 |
  | -- | --- |
  | `SUPABASE_ANON_PUBLIC_KEY` | Supabase 접속에 필요한 키를 입력합니다.
  | `SUPABASE_URL` | Supabase 접속 URL입니다. `https://` 부터 시작하여 `/` 없이 끝납니다. |

</details>

#### 작명 규칙

- **CSS** 및 **DOM**에서 사용하는 클래스와 이름에는 camelCase를 사용합니다.
- **CSS**에서 사용하는 변수는 kebab-case를 사용합니다.
- **TypeScript**에서 사용하는 타입은 PascalCase를 사용합니다.
- **Next.js**에서 사용하는 컴포넌트명은 PascalCase를 사용합니다.
- **그 외 변수 및 함수**에는 기본적으로 camelCase를 사용합니다.

#### 커밋 및 브랜치 명명 규칙

커밋 메시지는 `(종류)작업한 내용` 형태를 갖춰야 합니다. 종류는 다음과 같습니다.

| 종류 | 설명 |
| --- | --- |
| `init` | 프로젝트 초기화, 라이브러리 추가/삭제/업데이트에 사용해요 |
| `fix` | 버그를 수정하였을 때 사용해요. 이때 작업한 내용에는 **무엇을 고쳤다**, 가 아닌 **무엇이 문제다**를 써주세요. |
| `feat` | 새로운 기능을 추가하였을 때 사용해요. |
| `cont` | 공공데이터, 프로젝트 내부 문서 등 데이터나 문서를 추가하였을 때 사용해요. |
| `test` | 로컬에서 해결하기 어려운 문제에 대해 테스트할 때 사용해요. |

> [!NOTE]
> 기존 구조를 변경하는 커밋은 `feat`를 사용하여 표현해주세요. (예시: JSON 파일을 직접 들여오는 방식에서 API 사용으로 변경)

브랜치는 다음과 같이 나눠집니다.

| 종류 | 설명 |
| --- | --- |
| `main` | 현재 서비스에 적용되는 소스에요. |
| `dev/코드네임명` | 현재 개발 중인 내용에 적용되는 소스에요. |
| `커밋종류/간단 설명` | `init`을 제외하고 특정한 기능을 테스트할 목적으로 사용하는 브랜치에요. 일반적인 경우 개발은 `dev`에서 이뤄지고, 적용되지 않을 가능성이 높거나 버그 가능성으로 연구가 필요한 경우 사용해요. |

<details>
  <summary>변경 이력</summary>

   - **2025.12.11** `dev` 분기를 세분화했어요. 
</details>

#### PR 작성 및 반영

> PR을 작성하실 때는 되도록 `커밋종류/간단 설명` 형태의 브랜치를 생성하여 작업해주시면 감사하겠습니다.

여러 건의 PR이 열려있을 경우에는, 다음과 같은 우선순위로 처리됩니다.

1. 오류 수정을 목적으로 하는 PR
2. 기능 추가를 목적으로 하는 PR
3. 문서화를 목적으로 하는 PR

사용 중인 라이브러리의 버전이나 종류가 변경되는 경우, PR에 명시해주시면 감사하겠습니다. 명시하지 않으셔도 반영에는 문제가 없지만, 버전 및 종류 변경에 따른 패키지 재설치 등의 작업이 필요할 수 있기 때문입니다.

다음과 같은 PR은 반영되지 않을 수 있습니다.

- 기반 프레임워크를 변경하는 PR (예시: React에서 Svelte로 변경)
- 이슈 트래커 혹은 설문지를 이용해 사전에 논의하지 않고 프로젝트의 상징을 변경하는 PR (아이콘, 글꼴 등)
- 아직 개발을 시작하지 않은 기능에 대한 개발 문서 작성
- `.env` 파일을 임의로 포함하여 제출
- 최종적으로 반영 혹은 도입하지 않기로 결정한 기능에 대한 PR

> 단, 도입을 보류한 경우에는 차후 논의할 수 있으며, 도입하지 않기로 결정하였더라도 이슈 트래커 등을 사용하여 사전에 충분히 논의하여 현재는 도입이 가능하다고 결론지어진 경우 반영 가능합니다.

#### 버전 결정 규칙

기본 형태는 `major.minor.patch`입니다. `major`, `minor`, `patch`의 정의는 다음과 같습니다.

- `major`: 사용자 시점에서 신규 기능 추가(예시: 폐의약품 수거 예약, 통계 등) 혹은 UI 대규모 개편(기반 UI 라이브러리 변경, 화면 배치 3곳 이상 변경, 다크모드 지원 등)
- `minor`: 기존 기능의 사용성 향상(예시: 검색 결과에 정렬 추가, 아이콘 추가하여 사용성 개선 등)
- `patch`: 버그 수정, 보안 업데이트, 패키지 업데이트, 오타 수정 등의 자잘한 문제를 해결하는 버전입니다.

단, `patch` 뒤에 `tag`가 붙을 수 있습니다. 현재 정식 버전이 아닌 경우에만 사용합니다.

- `feat:기능명`: 특정 기능의 적용 여부를 테스트하기 위한 목적의 특수 목적 태그입니다.
- `beta숫자`: 일반적인 테스트 버전입니다. 이때 숫자의 규격은 1, 2, 3...과 같은 형태로 사용합니다.

#### 현행 프로젝트 구조

**API**

API 주소 이름은 명사로 표현하며, 다음과 같은 하위 분류가 있습니다.

| 하위 URL | 설명 |
| --- | --- |
| geo | 위치 변환 및 주소 변환 API |
| service | 이 서비스에서 제공 혹은 사용하는 데이터 |
| user | 사용자가 저장, 이용하는 데이터 |

현재 다음과 같은 API를 사용할 수 있습니다.

| 하위 URL | 설명 |
| --- | --- |
| geo/coords | 주소 문자열이 주어지면 해당 주소의 위치를 반환합니다. |
| geo/region | `lat`, `lng` 값이 주어지면 행정구역을 반환합니다. |
| service/supported_region | 서비스 중인 지역 목록을 반환합니다. |
| service/pharm | 약국 영업시간 정보를 반환합니다. |
| service/data | 수거함 데이터를 반환합니다. |
| service/list | 수거함 목록 데이터를 반환합니다. |

**컴포넌트**

`/src/app/component` 폴더에 모아서 관리합니다. 용도별로 별도 폴더 안에 다음과 같이 정리되어 있습니다.

| 폴더명 | 용도 및 포함된 컴포넌트 |
| --- | --- |
| data | 데이터 목록, 수거함 정보 데이터 표시 컴포넌트가 포함되어 있습니다. 데이터 관련 컴포넌트가 포함됩니다. |
| fallback | 로드 중 임시로 표시하는 용도로 사용하는 컴포넌트가 포함됩니다. |
| kakaomap | 지도 컴포넌트가 포함됩니다. |
| layouts | 헤더, 대화상자 등 레이아웃을 표현하는 용도로 사용하는 컴포넌트가 포함됩니다. |
| locations | 위치 정보를 다루는 컴포넌트가 포함됩니다. |

**함수**

`src/app/functions` 폴더에 모아서 관리합니다. API는 아니지만 내부적으로 사용해야 하는 함수를 분리하여 담았습니다.

**타입 및 데이터**

`src/app/types` 폴더에 모아서 관리합니다. TypeScript에서 사용하는 타입 및 Context API를 사용하는 상수 등의 중복 사용 데이터를 담고 있습니다.

데이터베이스 상의 폐의약품 수거함 데이터 구조는 다음과 같습니다.

| 필드명 | 유형 | 설명 |
| --- | -- | ---- |
| sub | text | 통합 데이터인 경우, 하위 행정구역명 |
| last_updated | timestamptz | 실질적으로 마지막 업데이트된 날짜와 시각 |
| name | text | 폐의약품 수거함 비치 장소명 |
| address | text | 주소(도로명) |
| call | text | 장소의 전화번호 |
| lat | float8 | 위도 |
| lng | float8 | 경도 |
| type | text | 시설의 종류 |
| memo | text | 시설 내 수거함 위치, 배출 가능 정보 등 기타 도움이 되는 데이터 |

이때, type에는 아래 종류가 가능합니다.

- **apt** 아파트 등 공동주택
- **public** 공공기관, 보건소, 보건지소
- **pharm** 약국
- **post** 우체통
- **gym** 체육시설
- **welfare** 복지시설
- **religion** 종교시설
- **others** 그 외 기타 시설

지원 지역을 저장하는 데이터는 다음과 같은 구조로 구성됩니다.

| 필드명 | 유형 | 설명 |
| --- | -- | ---- |
| state | text | 행정구역 중 시/도 |
| city | text | 행정구역 중 시/군/구 |
| state_code | text | 행정구역 중 시/도를 나타내는 영문 코드 |
| city_code | text | 행정구역 중 시/군/구를 나타내는 영문 코드 |
| integrated | bool | 시/도 단위에서 통합 데이터를 제공하여 하위 행정구역별로 DB가 나뉘지 않은 경우 `true` |

이때 시/도 코드는 3글자 이내 2글자 권장이며 공항이 위치한 경우 공항 코드를 최우선으로 합니다. 시/군/구는 되도록 원래 명칭을 반영하되, 시/군/구는 표기하지 않습니다.

기존에 사용 중인 시/도 코드가 있는 경우 시/군/구 데이터 추가 시 이를 따르도록 합니다.

> 예시: `gg`: 경기도, `gb`: 경상북도, `gn`: 경상남도, `goyang`: 고양시

### 데이터 기여 및 오류 제보

개발 지식이 없더라도 누락된 혹은 잘못 포함된 데이터, 사용 중 발생한 오류를 제보해주시는 것만으로 큰 도움이 됩니다.

#### 데이터 기여하기

공공 데이터의 갱신 주기 차이 및 다양한 원인으로 인해 데이터와 실제가 불일치할 수 있습니다. 이와 관련하여 아래 양식으로 제보해주시면 확인하여 기존 데이터에서 제외하거나 추가할 수 있도록 하겠습니다.

데이터 제보 전, 반드시 다음 사항을 확인해주세요.

- **폐의약품 수거함이 포화 상태여서 수거가 불가한 경우**: 폐의약품을 받지 않는 경우는 아니므로 *신규 폐의약품 수거함 제보에만 가능해요*
- **폐의약품 수거함 비치 예정인 경우**: 아직 비치되지 않아 사용자의 혼란을 유발할 수 있고, 개발자가 수작업으로 확인하기 어려워 제보가 *불가해요*
- **폐의약품 수거함을 더는 비치하지 않는 경우**: 폐의약품을 앞으로도 받지 않으므로 제보가 *가능해요*

| [문의하기](https://forms.gle/EST5vaZBFGy8DHGE8) |
| --- |

#### 오류 제보

사용 중 기능이 작동하지 않거나, 잘못된 작동을 하는 경우 개발자에게 수정을 요구할 수 있습니다. 한국어와 영어 모두 사용 가능합니다.

- [GitHub 계정을 보유한 경우](https://github.com/re-pharm/pharm-map/issues/new/choose)
- [GitHub 계정이 없는 경우](https://forms.gle/EST5vaZBFGy8DHGE8)

### 제3자 데이터 및 라이브러리 안내

#### 파일데이터

폐의약품 수거지도에 추가되는 각 지역의 수거함 현황 관련 파일 데이터는 경도와 위도, 경우에 따라 전화번호를 추가하여 DB에 탑재, API 형태로 서비스합니다.

관련 출처는 웹사이트에서 보실 수 있도록 개선 작업을 진행할 예정입니다.

#### API

**공공 데이터**

- [국립중앙의료원 전국 약국 정보 조회 서비스](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15000576): 이용허락범위 제한 없음

**사기업 공개 API**

- [카카오 로컬 주소변환 API](https://developers.kakao.com/docs/latest/ko/local/dev-guide)

#### 라이브러리, 프레임워크 및 패키지 매니저

**현재 사용 중인 오픈소스 프로젝트 목록입니다.**

- [Next.js](https://nextjs.org): MIT License
- [TailwindCSS](https://tailwindcss.com/): MIT License
- [FontAwesome v6 for React](https://www.fontawesome.com)
  - Icons: CC-BY 4.0 License
  - Fonts: SIL OFL 1.1 License
  - Code: MIT License
  - [FontAwesome Free License Notice](https://fontawesome.com/license/free)
- [Yarn](https://yarnpkg.com/): BSD-2-Clause License
- [Kakao Maps SDK for Kakao Open Platform Service](https://apis.map.kakao.com/web/) : [Apache License](https://devtalk.kakao.com/t/api/41598/3)
- [React.js](https://react.dev): MIT License
- [SUITE Variable](https://sunn.us/suite/): SIL Open Font License
- [motion](https://motion.dev): MIT License
- [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm) : Apache 2.0 License
- [Better Auth](https://github.com/better-auth/better-auth): MIT License

**과거 사용하였던 오픈소스 프로젝트 목록입니다.**

- [@material/web](https://github.com/material-components/material-web/tree/main) v1.0.0-pre16 : Apache 2.0 License
- [Supabase SDK](https://github.com/supabase/supabase-js?tab=MIT-1-ov-file#readme) ~ v.2.87.1 : MIT License
