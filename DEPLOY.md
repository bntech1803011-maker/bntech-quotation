# 배포 가이드 (GitHub + Vercel)

이 문서를 그대로 따라 하면 견적서 웹앱이 인터넷에 배포된다.

소요 시간: 약 10분

---

## 사전 준비 (한 번만 설치)

### 1) Node.js 설치
- https://nodejs.org 접속 → **LTS 버전** 다운로드 → 설치
- 설치 확인 (PowerShell 실행 후):
  ```powershell
  node -v
  npm -v
  ```
  버전이 출력되면 정상.

### 2) Git 설치
- https://git-scm.com/download/win 접속 → 다운로드 → 설치 (모든 옵션 기본값으로 Next)
- 설치 확인:
  ```powershell
  git --version
  ```

### 3) GitHub 계정 생성
- https://github.com → **Sign up** → 이메일·비밀번호로 가입

### 4) Vercel 계정 생성
- https://vercel.com → **Sign Up** → **Continue with GitHub** 클릭 (GitHub 계정으로 연동)

---

## 1단계 — 로컬에서 빌드 테스트 (선택, 권장)

배포 전에 내 컴퓨터에서 한 번 실행해보면 문제를 미리 잡을 수 있다.

PowerShell에서 프로젝트 폴더로 이동 후:

```powershell
cd "C:\Users\고객지원팀\Desktop\견적서_나래\견적서_나래"
npm install
npm run dev
```

- 브라우저에 `http://localhost:5173` 자동으로 열리면 성공.
- 종료: PowerShell 창에서 `Ctrl + C`

---

## 2단계 — GitHub에 저장소 만들기

1. https://github.com 로그인
2. 우측 상단 **+** 아이콘 → **New repository** 클릭
3. 입력:
   - **Repository name**: `bntech-quotation` (원하는 이름)
   - **Description**: (선택) `㈜비앤테크 견적서 웹앱`
   - **Public** 또는 **Private** 선택
   - **README, .gitignore, license 옵션은 모두 체크하지 않음** (중요)
4. **Create repository** 클릭
5. 다음 화면이 뜨면 **`HTTPS` 주소**를 복사해둠. 예시:
   ```
   https://github.com/내아이디/bntech-quotation.git
   ```

---

## 3단계 — 로컬 코드를 GitHub에 업로드

PowerShell에서 프로젝트 폴더로 이동 후, 아래 명령어를 **한 줄씩** 순서대로 실행한다.

```powershell
cd "C:\Users\고객지원팀\Desktop\견적서_나래\견적서_나래"

# Git 초기 설정 (처음 한 번만)
git config --global user.name "내이름"
git config --global user.email "내이메일@example.com"

# 저장소 초기화
git init
git add .
git commit -m "first commit"
git branch -M main

# 원격 저장소 연결 (2단계에서 복사한 주소 사용)
git remote add origin https://github.com/내아이디/bntech-quotation.git

# 푸시
git push -u origin main
```

> 처음 `git push`를 하면 GitHub 로그인 창이 뜬다. 브라우저로 인증하면 자동으로 진행된다.

푸시 완료 후 GitHub 저장소 페이지를 새로고침하면 파일들이 올라와 있어야 한다.

---

## 4단계 — Vercel에서 배포

1. https://vercel.com 로그인 (GitHub 계정으로)
2. 대시보드에서 **Add New...** → **Project** 클릭
3. **Import Git Repository** 영역에서 방금 만든 저장소(`bntech-quotation`) 옆 **Import** 버튼 클릭
   - 저장소가 안 보이면 **Adjust GitHub App Permissions** → 권한 허용
4. 설정 화면이 나오면 아래 값이 자동으로 채워져 있는지 확인 (수정하지 말 것):
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. **Deploy** 클릭
6. 약 1~2분 대기

배포 완료 화면에서 **Continue to Dashboard** → **Visit** 클릭하면 배포된 사이트가 열린다.

주소 형식: `https://bntech-quotation-xxxxx.vercel.app`

---

## 5단계 — 수정 후 재배포

코드를 수정하면 GitHub에 푸시하기만 하면 Vercel이 자동으로 재배포한다.

```powershell
cd "C:\Users\고객지원팀\Desktop\견적서_나래\견적서_나래"
git add .
git commit -m "수정 내용 요약"
git push
```

푸시 후 약 1분 안에 사이트가 갱신된다.

---

## 자주 발생하는 문제

### "git push" 시 인증 실패
- 최신 Git for Windows를 쓰면 **Git Credential Manager**가 자동으로 GitHub 로그인 창을 띄운다.
- 그래도 안 되면 GitHub에서 **Personal Access Token (Classic)** 발급 후 비밀번호 대신 사용:
  - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → **Generate new token**
  - 권한은 `repo` 체크

### Vercel 빌드 실패
- 보통 `package.json`의 의존성 누락이 원인.
- Vercel 대시보드 → 해당 프로젝트 → **Deployments** → 실패한 배포 클릭 → **Build Logs** 확인.
- 에러 메시지를 그대로 복사해서 문의.

### 폴더 이름에 한글이 있어서 문제 발생
- 일반적으로 문제 없지만, 일부 도구에서 인식이 안 되면 폴더를 영문 경로(예: `C:\dev\bntech-quotation`)로 옮긴 뒤 진행.

### 직인(stamp.png)이 안 보임
- `public/stamp.png` 경로에 파일이 있는지 확인.
- 없다면 본인 직인 이미지를 그 경로에 넣고 다시 푸시.

---

## 명령어 요약 (치트시트)

```powershell
# 최초 1회 — 로컬에서 작동 확인
npm install
npm run dev

# 최초 1회 — GitHub 연결
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/내아이디/저장소명.git
git push -u origin main

# 이후 매번 — 수정 후 재배포
git add .
git commit -m "수정 내용"
git push
```
