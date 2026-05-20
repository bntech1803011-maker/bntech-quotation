# ㈜비앤테크 견적서 웹앱

React + Vite + TailwindCSS 기반 견적서 작성/인쇄 웹 애플리케이션입니다.

## 주요 기능

- 제품 드롭다운 선택 (10개 품목 사전 등록)
- 수량 입력 / 단가 자동 입력
- 공급가액 / 부가세 / 총합 자동 계산
- 부가세 포함 단가 / 부가세 별도 단가 선택
- 품목 추가·삭제
- 공급받는 자 정보 입력 (성명/상호 + "귀하" 자동 표시)
- A4 인쇄 / PDF 저장 (브라우저 인쇄)

---

## 1. 로컬 실행

### 사전 준비
- Node.js 18 이상 설치 (https://nodejs.org)

### 명령어
```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

---

## 2. GitHub 업로드 방법

### 2-1. 새 저장소 생성
1. https://github.com 접속 → 우측 상단 **+** → **New repository** 클릭
2. Repository name: 예) `bntech-quotation-app`
3. Public / Private 선택
4. **Create repository** 클릭 (README, .gitignore 추가하지 말 것)

### 2-2. 로컬에서 업로드
프로젝트 폴더에서 터미널을 열고 아래 명령어를 순서대로 실행합니다.

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/사용자명/bntech-quotation-app.git
git push -u origin main
```

> `사용자명`과 저장소 이름은 본인 것으로 변경하세요.

---

## 3. Vercel 배포 방법

### 3-1. Vercel 가입
1. https://vercel.com 접속
2. **Sign Up** → **Continue with GitHub** 선택
3. GitHub 계정으로 로그인

### 3-2. 프로젝트 Import
1. Vercel 대시보드에서 **Add New...** → **Project** 클릭
2. 방금 만든 GitHub 저장소 선택 → **Import**
3. 설정 화면에서 아무것도 변경하지 말고 그대로 둡니다.
   - Framework Preset: **Vite** (자동 감지)
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Deploy** 클릭

### 3-3. 배포 완료
- 1~2분 후 배포가 완료되며 `https://프로젝트명.vercel.app` 주소가 자동 생성됩니다.
- 이후 GitHub `main` 브랜치에 푸시할 때마다 자동으로 재배포됩니다.

---

## 4. 사용 방법

1. 좌측 입력 패널에서 공급받는 자 정보를 입력합니다.
2. 단가 기준(부가세 별도/포함)을 선택합니다.
3. 품목을 선택하고 수량을 입력합니다.
4. 필요 시 **+ 품목 추가** 버튼으로 품목을 늘립니다.
5. 우측 견적서 미리보기를 확인합니다.
6. **PDF 저장 / 인쇄** 버튼을 클릭하여 인쇄 또는 PDF로 저장합니다.
   - 인쇄 대화상자에서 **대상 → PDF로 저장** 선택 시 PDF 파일 생성

---

## 5. 계산 방식

### 부가세 별도
- 공급가액 = 단가 × 수량
- 부가세 = 공급가액 × 10% (반올림)
- 총합 = 공급가액 + 부가세

### 부가세 포함
- 총액 = 단가 × 수량
- 공급가액 = 총액 / 1.1 (반올림)
- 부가세 = 총액 - 공급가액

---

## 6. 등록 제품

| 품명 | 규격 | 단가 |
|---|---|---|
| RC-02 | 규격 없음 | 698,000원 |
| 프라임 | RC-Prime300 | 658,000원 |
| 그래비티 | RC-GT500 | 828,000원 |
| 그래비티(W) | RC-GT500W | 858,000원 |
| 이지 | 규격 없음 | 509,000원 |
| 공용삽 | 규격 없음 | 1,500원 |
| 여과삽 | 규격 없음 | 2,000원 |
| 필터(그래비티/프라임) | RC-GT500, RC-GT500W, RC-Prime300 | 19,800원 |
| 필터(RC-02) | RC-02 | 17,000원 |
| 푸드클리너 | 1kg | 55,000원 |

---

## 7. 공급자 정보

- 상호명: ㈜비앤테크
- 대표자: 박숙이, 방용휘
- 사업자등록번호: 229-87-00918
- 업태: 제조 / 업종: 음식물처리기
- 주소: 경남 김해시 주촌면 골든루트로 66번길 48-5, 4동
- 전화: 055-785-0665 / 팩스: 055-785-0664

---

## 라이선스
사내 사용 전용.
<!-- redeploy -->
