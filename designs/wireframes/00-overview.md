# Wireframes — Overview

依 [共振產品需求書 v0.1](../../docs/共振_產品需求書_v0.1.md) 的 MVP 範圍 (M1, M2, M4, M5, M6, M9) 產出。視覺語彙遵守 [DESIGN.md](../DESIGN.md) — OKLCH 暖色、手繪邊框、有機形狀、70/30 結構 vs 有機。

## 畫面地圖

```
                     ┌─────────────────┐
                     │  01 Landing     │  未登入訪客
                     │  (marketing)    │  (已實作於 app/[locale]/page.tsx)
                     └────────┬────────┘
                              │ Sign up / Log in
                              ▼
                     ┌─────────────────┐
                     │  08 Auth        │  筆名 + 真人驗證 (M9)
                     └────────┬────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
   ┌────────────┐      ┌────────────┐      ┌────────────┐
   │ 02 Home    │      │ 04 Create  │      │ 05 Profile │
   │ Resonance  │◄────►│  Card      │      │ (self)     │
   │  Feed      │      │ + AI       │      │ = 卡片盒   │
   │ (M4)       │      │ (M1, M2)   │      │            │
   └──────┬─────┘      └────────────┘      └────────────┘
          │                                       ▲
          ▼                                       │
   ┌────────────┐      ┌────────────┐      ┌──────┴─────┐
   │ 03 Card    │─────►│ 07 Connect │─────►│ 06 Profile │
   │  Detail    │      │  Invite    │      │ (other)    │
   │ + Resonate │      │ (M6)       │      │            │
   │ (M5)       │      └────────────┘      └────────────┘
   └────────────┘
          
   ┌────────────┐
   │ 09 Settings│  隱私、語言、通知、驗證狀態
   └────────────┘
```

## 全域導航 (Global Shell)

已登入使用者的頂部導航,沿用既有 `SiteHeader` 外觀:

```
┌────────────────────────────────────────────────────────────────────────┐
│  Resonance      共振 Feed   我的卡片盒   寫卡片(+)        [🔔] [頭像] │
└────────────────────────────────────────────────────────────────────────┘
                                                            ▲
                                                            │ 手繪 wave 分隔
```

- 品牌:`Playfair Display 24px 700`
- Nav links:`DM Sans 15px 500`,間距 36px
- 「寫卡片(+)」以 `OrganicButton primary` 的 pill 樣式出現
- 🔔 連結邀請與新共振通知
- Mobile (≤720px):nav 改為 hamburger → modal,主要動作「寫卡片」保留為 floating organic button (右下)

## 檔案索引

| # | 檔案 | 對應模組 |
|---|---|---|
| 01 | [landing.md](01-landing.md) | 訪客首頁 (已實作) |
| 02 | [home-feed.md](02-home-feed.md) | M4 同頻匹配 Feed |
| 03 | [card-detail.md](03-card-detail.md) | M5 共振標記 |
| 04 | [card-create.md](04-card-create.md) | M1 + M2 卡片建立 & AI |
| 05 | [profile-self.md](05-profile-self.md) | 個人卡片盒 |
| 06 | [profile-other.md](06-profile-other.md) | 他人檔案 (連結前 / 後) |
| 07 | [connection-invite.md](07-connection-invite.md) | M6 雙向連結邀請 |
| 08 | [auth.md](08-auth.md) | M9 身份系統 |
| 09 | [settings.md](09-settings.md) | 帳號、隱私、語言 |

## 設計原則在各畫面的體現

| 原則 | 表現 |
|---|---|
| 無 vanity metrics | 不顯示粉絲數、讚數、瀏覽數;「共振數」僅作者自己看得到 |
| 不鼓勵長文 | 編輯器字數計 300–800,超出會提醒但不阻擋 |
| 思維 > 熱度 | Home feed 預設排序是「與你同頻」,無熱門榜 |
| 雙向連結 | 無 Follow,按鈕永遠寫「發起連結」,需附一句話 |
| 筆名 + 真人 | 個人檔案 header 有驗證勾勾,筆名優先 |
| 卡片盒沉澱 | Feed 不是無限滑、每日一批;「我的卡片盒」是靜態整理空間 |
