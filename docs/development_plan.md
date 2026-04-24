# Resonance — 開發計畫 (Development Plan)

> 版本：v1.0 · 2026-04-23  
> 技術決策：Next.js 16 (App Router) + CSS Modules + Firebase + Cloudflare R2

---

## 一、Tech Stack 總覽

| 層次 | 技術 | 說明 |
|------|------|------|
| **框架** | Next.js 16 [LTS] (App Router) | ISR / SSG / RSC 完整支援 |
| **語言** | TypeScript | 嚴格型別，配合 DB 抽象層 |
| **CSS** | CSS Modules + CSS Custom Properties | 零依賴，完整保留設計 fidelity |
| **認證** | Firebase Authentication | Email / Google OAuth |
| **資料庫** | Firebase Firestore（封裝層） | 透過 Repository Pattern 抽象化 |
| **圖片儲存** | Cloudflare R2 | S3 相容 API，搭配 Next.js Route Handler 上傳 |
| **國際化** | next-intl | App Router 原生整合，型別安全 |
| **後台管理** | 🔖 待規劃（預留架構） | 可能採用獨立路由 `/admin` 或分開部署 |

---

## 二、資料夾結構

```
resonance/
├── src/
│   │
│   ├── app/                          ← App Router 根目錄
│   │   ├── [locale]/                 ← i18n locale segment（en / zh-TW）
│   │   │   ├── layout.tsx            ← 全域 layout（字體、provider 注入）
│   │   │   ├── page.tsx              ← Landing page（靜態，SSG）
│   │   │   │
│   │   │   ├── explore/
│   │   │   │   └── page.tsx          ← 探索頁（ISR，60s revalidate）
│   │   │   │
│   │   │   ├── featured/
│   │   │   │   └── page.tsx          ← 推薦頁（SSG，build time）
│   │   │   │
│   │   │   ├── story/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      ← 文章頁（ISR，300s revalidate）
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   └── [uid]/
│   │   │   │       └── page.tsx      ← 作者頁（ISR）
│   │   │   │
│   │   │   └── (auth)/               ← 認證相關群組（無 layout header）
│   │   │       ├── login/
│   │   │       └── register/
│   │   │
│   │   ├── admin/                    ← 🔖 後台（待規劃，先預留）
│   │   │   └── layout.tsx
│   │   │
│   │   └── api/                      ← Route Handlers（API endpoints）
│   │       ├── revalidate/           ← On-demand ISR revalidation
│   │       │   └── route.ts
│   │       └── upload/               ← Cloudflare R2 預簽名 URL 生成
│   │           └── route.ts
│   │
│   ├── components/                   ← 所有 UI 元件
│   │   ├── atoms/                    ← 原子元件（最小單位，無業務邏輯）
│   │   │   ├── HandDrawnBorder/
│   │   │   │   └── HandDrawnBorder.tsx     ← 純 SVG，無 CSS Module
│   │   │   ├── OrganicButton/
│   │   │   │   ├── OrganicButton.tsx
│   │   │   │   └── OrganicButton.module.css
│   │   │   ├── TagPill/
│   │   │   │   ├── TagPill.tsx
│   │   │   │   └── TagPill.module.css
│   │   │   ├── GrainOverlay/
│   │   │   │   └── GrainOverlay.tsx        ← 純 SVG inline style
│   │   │   ├── OrganiBlob/
│   │   │   │   └── OrganiBlob.tsx          ← 純 SVG
│   │   │   ├── HandDrawnAvatar/
│   │   │   │   └── HandDrawnAvatar.tsx
│   │   │   └── SectionEdge/
│   │   │       └── SectionEdge.tsx         ← 純 SVG
│   │   │
│   │   ├── molecules/                ← 組合型元件
│   │   │   ├── StoryCard/
│   │   │   │   ├── StoryCard.tsx
│   │   │   │   └── StoryCard.module.css
│   │   │   ├── AuthorRow/
│   │   │   │   ├── AuthorRow.tsx
│   │   │   │   └── AuthorRow.module.css
│   │   │   └── Modal/
│   │   │       ├── Modal.tsx
│   │   │       └── Modal.module.css
│   │   │
│   │   ├── sections/                 ← 頁面 section 元件
│   │   │   ├── SiteHeader/
│   │   │   │   ├── SiteHeader.tsx
│   │   │   │   └── SiteHeader.module.css
│   │   │   ├── HeroSection/
│   │   │   ├── CardFeedSection/
│   │   │   ├── CTASection/
│   │   │   └── SiteFooter/
│   │   │
│   │   └── providers/                ← Client-side Providers
│   │       ├── AuthProvider.tsx      ← Firebase Auth context
│   │       └── ThemeProvider.tsx     ← Tweak / accent color context
│   │
│   ├── lib/
│   │   ├── design/                   ← 設計系統工具函式（pure functions）
│   │   │   ├── wobRect.ts            ← 手繪邊框路徑生成
│   │   │   ├── wavyPath.ts           ← Section 邊界波浪線
│   │   │   └── prng.ts               ← Seeded PRNG
│   │   │
│   │   ├── db/                       ← 🏗️ 資料庫抽象層（核心）
│   │   │   ├── types.ts              ← 共用 Entity 型別定義
│   │   │   ├── interfaces/           ← Repository 介面（合約）
│   │   │   │   ├── IStoryRepository.ts
│   │   │   │   ├── IUserRepository.ts
│   │   │   │   └── ICommentRepository.ts
│   │   │   ├── firestore/            ← Firestore 實作
│   │   │   │   ├── client.ts         ← Firebase App 初始化
│   │   │   │   ├── FirestoreStoryRepository.ts
│   │   │   │   ├── FirestoreUserRepository.ts
│   │   │   │   └── FirestoreCommentRepository.ts
│   │   │   └── index.ts              ← 統一匯出（工廠函式）
│   │   │
│   │   ├── storage/                  ← Cloudflare R2 封裝
│   │   │   └── r2.ts
│   │   │
│   │   ├── auth/                     ← Firebase Auth 工具
│   │   │   └── firebase-auth.ts
│   │   │
│   │   └── mock/                     ← 🧪 Mock Data（Phase 1-2 使用）
│   │       ├── stories.ts
│   │       ├── users.ts
│   │       └── comments.ts
│   │
│   ├── styles/                       ← 全域樣式
│   │   ├── tokens.css                ← :root 設計 token（單一真相來源）
│   │   └── globals.css               ← reset, scrollbar, base styles
│   │
│   ├── i18n/                         ← 國際化設定
│   │   ├── routing.ts                ← next-intl routing 設定
│   │   └── request.ts                ← Server-side locale 解析
│   │
│   └── messages/                     ← 翻譯字串檔
│       ├── en.json
│       └── zh-TW.json
│
├── middleware.ts                      ← next-intl locale redirect 中介層
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 三、資料庫封裝架構（Repository Pattern）

### 設計原則

```
Application Code
      ↓  呼叫介面，不直接呼叫 Firebase
IStoryRepository (interface)
      ↓  目前的實作
FirestoreStoryRepository
      
  未來換 MongoDB 時：
      ↓  只需新增實作，Application Code 不變
MongoStoryRepository
```

### 介面定義範例

```typescript
// lib/db/interfaces/IStoryRepository.ts

export interface Story {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  authorId: string;
  tags: string[];
  coverImageUrl: string | null;
  readTimeMinutes: number;
  publishedAt: Date;
  updatedAt: Date;
  locale: 'en' | 'zh-TW';
  featured: boolean;
}

export interface IStoryRepository {
  findById(id: string): Promise<Story | null>;
  findBySlug(slug: string): Promise<Story | null>;
  findMany(opts: {
    limit?: number;
    cursor?: string;
    tag?: string;
    locale?: string;
  }): Promise<{ items: Story[]; nextCursor: string | null }>;
  findFeatured(locale?: string): Promise<Story[]>;
  create(data: Omit<Story, 'id'>): Promise<Story>;
  update(id: string, data: Partial<Story>): Promise<Story>;
  delete(id: string): Promise<void>;
}
```

### Firestore 實作範例

```typescript
// lib/db/firestore/FirestoreStoryRepository.ts
import { IStoryRepository, Story } from '../interfaces/IStoryRepository';

export class FirestoreStoryRepository implements IStoryRepository {
  async findBySlug(slug: string): Promise<Story | null> {
    // ... Firestore 查詢邏輯
  }
  // ... 其他方法實作
}
```

### 工廠函式（統一入口）

```typescript
// lib/db/index.ts
import { FirestoreStoryRepository } from './firestore/FirestoreStoryRepository';
import { MockStoryRepository } from './mock/MockStoryRepository'; // Phase 1-2 使用

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export const storyRepo: IStoryRepository = USE_MOCK
  ? new MockStoryRepository()
  : new FirestoreStoryRepository();
```

> **好處：** 只需在 `.env.local` 切換 `NEXT_PUBLIC_USE_MOCK=true/false`，即可在 Mock Data 和 Firestore 之間切換，Application Code 完全不需修改。

---

## 四、渲染策略規劃

| 頁面 | 策略 | Revalidate | 說明 |
|------|------|-----------|------|
| Landing Page (`/`) | **SSG** | — | 行銷頁，Build time 生成，部署後不變 |
| 推薦頁 (`/featured`) | **SSG** | — | 人工審核，可透過 on-demand revalidation 更新 |
| 探索頁 (`/explore`) | **ISR** | 60s | 文章列表，允許輕微延遲 |
| 文章頁 (`/story/[slug]`) | **ISR** | 300s | 個別文章，修改後可 on-demand 更新 |
| 作者頁 (`/profile/[uid]`) | **ISR** | 120s | 個人資料 |
| 登入/認證頁 | **CSR** | — | Client-only，不快取 |
| 寫作 / 編輯頁 | **CSR** | — | 完全互動 |

### ISR 實作方式

```typescript
// app/[locale]/story/[slug]/page.tsx

export const revalidate = 300; // 5 分鐘

export async function generateStaticParams() {
  // Build time 預生成熱門文章的靜態頁面
  const stories = await storyRepo.findMany({ limit: 50 });
  return stories.items.map((s) => ({ slug: s.slug }));
}

export default async function StoryPage({ params }) {
  const story = await storyRepo.findBySlug(params.slug);
  if (!story) notFound();
  return <StoryPageContent story={story} />;
}
```

### On-Demand ISR（後台編輯後立即更新）

```typescript
// app/api/revalidate/route.ts

import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  const { secret, slug } = await req.json();
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  revalidatePath(`/en/story/${slug}`);
  revalidatePath(`/zh-TW/story/${slug}`);
  return Response.json({ revalidated: true });
}
```

---

## 五、國際化（i18n）規劃

### 套件選擇：`next-intl`

| 方案 | 優點 | 缺點 |
|------|------|------|
| **next-intl** ✅ | App Router 深度整合、RSC 支援、型別安全 | — |
| next-i18next | 成熟，Page Router 時代的主流 | 對 App Router 支援較弱 |
| i18next 手動配置 | 彈性最高 | 配置複雜 |

### URL 結構

```
/en/               ← 英文 Landing
/zh-TW/            ← 繁中 Landing
/en/story/[slug]
/zh-TW/story/[slug]
```

### 翻譯字串結構

```json
// messages/zh-TW.json
{
  "nav": {
    "about": "關於我們",
    "explore": "探索",
    "stories": "故事"
  },
  "hero": {
    "tagline": "✦ 真實的人生故事",
    "headline": "讓生命{accent}生命",
    "accent": "影響",
    "description": "一個讓世界各地的人生故事相互連結的空間。"
  },
  "cta": {
    "explore": "探索故事",
    "share": "分享你的故事"
  }
}
```

---

## 六、Cloudflare R2 圖片上傳流程

```
Client
  │
  ├─ 1. POST /api/upload  （附上 filename, contentType）
  │
Server (Route Handler)
  │
  ├─ 2. 向 R2 產生 Presigned PUT URL（有效期 5 分鐘）
  │
Client
  │
  ├─ 3. 直接 PUT 到 Presigned URL（不經過 Next.js server）
  │
  └─ 4. 儲存最終 R2 public URL 到 Firestore
```

---

## 七、開發 Phase 規劃

### Phase 1 — 前端基礎建設（目前進度 / 重點）

> **目標：** 把 fidelity prototype 轉換成可維護的 Next.js 專案

- [ ] 初始化 Next.js 15 + TypeScript 專案
- [ ] 設定 `tokens.css`、`globals.css`（從 Landing Page.html 提取）
- [ ] 將 `atoms.jsx` 轉換成 TypeScript 元件 + CSS Modules
  - `HandDrawnBorder.tsx`、`OrganicButton.tsx`、`TagPill.tsx` 等
- [ ] 將 `sections.jsx` 轉換成 TypeScript 元件 + CSS Modules
- [ ] 設定 next-intl（路由 + `messages/` 初始翻譯）
- [ ] 建立 Mock Data 結構（`lib/mock/`）
- [ ] Landing page 完整上線（SSG，使用 mock data）

### Phase 2 — 核心頁面開發（Mock Data 階段）

> **目標：** 完成主要使用者動線的 UI

- [ ] 探索頁（`/explore`）— 文章列表 + 篩選
- [ ] 文章閱讀頁（`/story/[slug]`）
- [ ] 作者個人頁（`/profile/[uid]`）
- [ ] 推薦頁（`/featured`）— SSG
- [ ] 登入 / 註冊頁（UI 骨架）
- [ ] 寫作 / 編輯頁（UI 骨架）

### Phase 3 — 後端接入

> **目標：** 將 Mock Data 替換成真實後端

- [ ] 設定 Firebase（Auth + Firestore）
- [ ] 實作 `IStoryRepository`、`IUserRepository` 的 Firestore 版本
- [ ] 切換 `NEXT_PUBLIC_USE_MOCK=false`
- [ ] 設定 Cloudflare R2 + 上傳 API Route
- [ ] 完成認證流程（Firebase Auth）

### Phase 4 — 進階功能

- [ ] ISR On-Demand Revalidation（後台觸發）
- [ ] SEO 優化（`metadata`、sitemap、OG tags）
- [ ] 圖片優化（`next/image` + R2 CDN）
- [ ] 效能測試與優化

### Phase 5 — 後台管理（🔖 細節待定）

> **預留架構：** `/admin` 路由群組或獨立部署

- [ ] 確認後台需求與規格
- [ ] 可能方案：獨立 `/admin` 路由 + 角色權限控制
- [ ] 文章審核、用戶管理、on-demand revalidation 觸發

---

## 八、關鍵設計決策說明

### 為什麼 CSS Modules 而非 Tailwind？

你的設計中大量使用 `clamp()`、OKLCH 顏色、動態 SVG mask 等原生 CSS 特性，這些在 CSS Modules 裡是零成本的一對一遷移。詳見前次分析報告。

### 為什麼 Repository Pattern？

Firestore 的 SDK 和 MongoDB 的 SDK 是完全不同的介面。如果 Application Code 直接呼叫 Firebase SDK，未來換資料庫時會需要改動每一個有查詢的地方。透過 Interface 隔離，未來只需新增一個新的實作 class（`MongoStoryRepository`），然後在工廠函式切換即可。

### 為什麼 next-intl？

目前（2026）對 Next.js App Router 支援最完整的 i18n 套件，Server Components 可以直接呼叫 `getTranslations()`，無需額外的 Client Provider，SEO 友好。

---

## 九、待確認事項

> 請針對以下問題確認後，即可開始 Phase 1 實作

- [ ] **後台管理**：是否需要整合在同一個 Next.js 專案（`/admin` 路由），或是未來獨立部署？
- [ ] **文章 slug**：由系統自動生成（基於標題），或由作者自訂？
- [ ] **雙語文章**：同一篇文章是否有中英兩個版本（需要 `locale` 欄位），或作者選一種語言發布？
- [ ] **推薦頁更新頻率**：每次需要人工審核後更新，或是有演算法自動選出推薦？這決定是 SSG + On-Demand ISR 還是 ISR with timer。
