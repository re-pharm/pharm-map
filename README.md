# 폐의약품 수거지도

`폐의약품 수거지도`는 공공데이터를 기반으로 [스마트 서울맵](https://map.seoul.go.kr/smgis2/)의 폐의약품 수거함 위치 지도와 유사하게 전국의 폐의약품 수거함 위치와 폐기법을 안내하는 지도입니다. 향후 개발을 통해 다양한 부가 기능을 함께 제공하여 보다 손쉽게 폐의약품을 배출하고 안전하게 폐기할 수 있도록 지원합니다.

## 지원 예정 지역

> 지원 예정 지역의 데이터는 2023.04. 기준으로 데이터 존재 여부를 확인한 것으로, 현재 지원되는 지역 혹은 향후 실제 지원되는 지역과 차이가 있을 수 있습니다.

- 경기도 고양시<sup>우선 지원 예정</sup>
- 경기도 구리시<sup>우선 지원 예정</sup>
- 경상북도 19개 시/군
- 광주광역시 전역
- 인천광역시 전역
- 대전광역시 3개 자치구
- 대구광역시 5개 자치구
- 세종특별자치시 전역
- 전라남도 전역

## 참여하기

### 개발에 참여하기

#### 개발 환경

본 프로젝트는 다음 환경에서 배포할 것을 가정하고 제작되었습니다.

- CloudFlare Pages
- Supabase

패키지 매니저 및 주요 프레임워크, 언어는 다음과 같습니다.

- Next.js (`Create-Next-App`을 활용한 템플릿 사용)
- Yarn 3.6.1 (`PnP` 기능 미사용)
- TypeScript
- Node.js 20

따라서, `git clone`하신 후에는 개발 서버 실행 전 `yarn install` 명령어를 실행해주세요. 만약 `yarn`을 찾을 수 없다고 나온다면, `node.js`가 설치되어 있는지 혹은 `corepack`이 설치되어 있는지 확인해주세요.

개발 서버는 `yarn dev`로 실행하시면 작동합니다. 기본 개발 서버 주소는 `localhost:3000`입니다.

CloudFlare Pages 환경에서는 `PnP` 기능을 현재 지원하지 않으므로, 임의로 `PnP` 기능을 활성화하는 커밋을 작성하지 말아주세요. 테스트 시 CloudFlare Pages 환경을 이용하실 때에는, `Workers 및 Pages - 개요 - (테스트 중인 프로젝트 선택) - 함수 - 호환성 플래그` 란에서 `nodejs_compat`을 활성화하세요. 그렇지 않으면 오류가 발생하여 정상적으로 실행할 수 없습니다.

#### .env 파일 설정

`.env` 파일 혹은 `.env.local` 파일로 특정한 키를 설정해야만 온전히 테스트가 가능합니다.

- `NEXT_PUBLIC_KAKAO_MAP_KEY`: 카카오맵 SDK에서 지도를 불러오기 위한 키입니다. 내 애플리케이션의 *JavaScript 키*를 사용하시면 됩니다.
- `KAKAO_REST_KEY`: 카카오 지도/로컬 API에서 현재 주소를 불러와, 현 위치 주변의 폐의약품 보관함을 불러오는 목적으로 사용합니다.

#### 커밋 및 브랜치 명명 규칙

커밋 메시지는 `(종류)작업한 내용` 형태를 갖춰야 합니다. 종류는 다음과 같습니다.

| 종류 | 설명 |
| --- | --- |
| `init` | 프로젝트를 초기화할 때, 환경 변수를 설정할 때, 라이브러리를 신규 추가할 때 사용해요 |
| `fix` | 버그를 수정하였을 때 사용해요. 이때 작업한 내용에는 **무엇을 고쳤다**, 가 아닌 **무엇이 문제다**를 써주세요. |
| `feat` | 새로운 기능을 추가하였을 때 사용해요. |
| `cont` | 공공데이터, 프로젝트 내부 문서 등 데이터나 문서를 추가하였을 때 사용해요. |

> 기존 구조를 변경하는 커밋은 `feat`를 사용하여 표현해주세요. (예시: JSON 파일을 직접 들여오는 방식에서 API 사용으로 변경)

브랜치는 다음과 같이 나눠집니다.

| 종류 | 설명 |
| --- | --- |
| `main` | 현재 서비스에 적용되는 소스에요. |
| `dev` | 현재 개발 중인 내용에 적용되는 소스에요. |
| `커밋종류/간단 설명` | `init`을 제외하고 특정한 기능을 테스트할 목적으로 사용하는 브랜치에요. 일반적인 경우 개발은 `dev`에서 이뤄지고, 적용되지 않을 가능성이 높거나 버그 가능성으로 연구가 필요한 경우 사용해요. |

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
  - 단, 도입을 보류한 경우에는 차후 논의할 수 있으며, 도입하지 않기로 결정하였더라도 이슈 트래커 등을 사용하여 사전에 충분히 논의하여 현재는 도입이 가능하다고 결론지어진 경우 반영 가능합니다.

#### 버전 결정 규칙

기본 형태는 `major.minor.patch`입니다. `major`, `minor`, `patch`의 정의는 다음과 같습니다.

- `major`: 사용자 시점에서 신규 기능 추가(예시: 폐의약품 수거 예약, 통계 등) 혹은 UI 대규모 개편(기반 UI 라이브러리 변경, 화면 배치 3곳 이상 변경, 다크모드 지원 등)
- `minor`: 기존 기능의 사용성 향상(예시: 검색 결과에 정렬 추가, 아이콘 추가하여 사용성 개선 등)
- `patch`: 버그 수정, 보안 업데이트, 패키지 업데이트, 오타 수정 등의 자잘한 문제를 해결하는 버전입니다.

단, `patch` 뒤에 `tag`가 붙을 수 있습니다. 현재 정식 버전이 아닌 경우에만 사용합니다.

- `feat:기능명`: 특정 기능의 적용 여부를 테스트하기 위한 목적의 특수 목적 태그입니다.
- `beta숫자`: 일반적인 테스트 버전입니다. 이때 숫자의 규격은 1, 2, 3...과 같은 형태로 사용합니다.

### 데이터 기여 및 오류 제보

개발 지식이 없더라도 누락된 혹은 잘못 포함된 데이터, 사용 중 발생한 오류를 제보해주시는 것만으로 큰 도움이 됩니다.

#### 데이터 기여하기

공공 데이터의 갱신 주기 차이 및 다양한 원인으로 인해 데이터와 실제가 불일치할 수 있습니다. 이와 관련하여 아래 양식으로 제보해주시면 확인하여 기존 데이터에서 제외하거나 추가할 수 있도록 하겠습니다.

데이터 제보 전, 반드시 다음 사항을 확인해주세요.

- **폐의약품 수거함이 포화 상태여서 수거가 불가한 경우**: 폐의약품을 받지 않는 경우는 아니므로 *신규 폐의약품 수거함 제보에만 가능해요*
- **폐의약품 수거함 비치 예정인 경우**: 아직 비치되지 않아 사용자의 혼란을 유발할 수 있고, 개발자가 수작업으로 확인하기 어려워 제보가 *불가해요*
- **폐의약품 수거함을 더는 비치하지 않는 경우**: 폐의약품을 앞으로도 받지 않으므로 제보가 *가능해요*

**양식은 Google 설문지로 제공될 예정이에요. 조금만 기다려주세요.**

#### 오류 제보

사용 중 기능이 작동하지 않거나, 잘못된 작동을 하는 경우 개발자에게 수정을 요구할 수 있습니다. 한국어와 영어 모두 사용 가능합니다.

- [GitHub 계정을 보유한 경우](https://github.com/re-pharm/pharm-map/issues/new/choose)
- **GitHub 계정이 없는 경우의 양식은 Google 설문지로 제공될 예정이에요. 조금만 기다려주세요.**

### 제3자 데이터 및 라이브러리 안내

#### 오픈 API

- [경기도 고양시 폐의약품 수거함 현황](https://www.data.go.kr/data/15077990/fileData.do#tab-layer-openapi) : 이용허락범위 제한 없음

공공데이터 포털에 신청한 시점부터 갱신하여 데이터를 추가할 예정입니다.

#### 라이브러리, 프레임워크 및 패키지 매니저

> 더는 사용하지 않는 프레임워크는 사용하였던 버전명을 명시합니다.

- [Next.js](https://nextjs.org): MIT License
- [TailwindCSS](https://tailwindcss.com/): MIT License
- [Yarn](https://yarnpkg.com/): BSD-2-Clause License
- [Kakao Maps SDK for Kaka Open Platform Service](https://apis.map.kakao.com/web/) : [Apache License](https://devtalk.kakao.com/t/api/41598/3)
- [React.js](https://react.dev): MIT License
- [SUITE Variable](https://sunn.us/suite/): SIL Open Font License