# 🏆 Translator Ranking Feature – Specification

This document defines the **Translator Ranking** feature for the Manga Reader system. The goal is to highlight high-quality translators, encourage healthy contributions, and help readers discover trustworthy translations.

---

## 1. Feature Goals

- Recognize and reward high-quality translators
- Help readers identify reliable translations
- Encourage long-term and consistent contributions
- Prevent spam, view farming, and unhealthy competition

---

## 2. Design Principles

1. **Quality over quantity** – ranking must not rely on raw view counts alone
2. **Fairness** – new translators still have a chance to surface
3. **Anti-abuse by design** – metrics must be resistant to manipulation
4. **Transparency without drama** – show rankings and badges, not raw scores

---

## 3. Ranking Scope

### Ranking Types

- Weekly ranking
- Monthly ranking
- All-time ranking

### Ranking Entities

- Individual translators
- Optional: scanlation / translation groups

---

## 4. Information Displayed in Ranking List (Public)

Each ranked translator item should display:

### 4.1 Basic Profile Info

- Rank position (🥇🥈🥉 or numeric)
- Avatar
- Display name
- Translator group (if any)

---

### 4.2 Core Metrics (Visible)

| Metric             | Description                          | Purpose               |
| ------------------ | ------------------------------------ | --------------------- |
| Total translations | Number of published translations     | Contribution level    |
| Total views        | Aggregated views across translations | Reach                 |
| Total upvotes      | Aggregated upvotes                   | Popularity            |
| Upvote ratio       | Upvotes / views                      | Quality indicator     |
| Total comments     | Discussion engagement                | Community interaction |

> **Note:** Ratios are more important than raw counts.

---

### 4.3 Activity & Consistency Metrics

- Translations published in last 30 days
- Active days in last 30 days
- Last published date

These metrics prevent one-time viral translations from dominating rankings indefinitely.

---

## 5. Ranking Score (Backend Only)

The ranking score is **not exposed publicly** .

### Suggested Score Formula (Example)

```
score =
  w1 * normalized_views_30d
+ w2 * upvotes_30d
+ w3 * upvote_ratio
+ w4 * comments_30d
+ w5 * consistency_factor
```

- All metrics are normalized
- Each translation contributes a capped amount to the total score
- Recent activity is weighted higher than historical data

---

## 6. Badges & Labels

Badges provide recognition without relying solely on rank numbers.

| Badge                | Criteria                              |
| -------------------- | ------------------------------------- |
| 🆕 Rising Translator | New translator with fast growth       |
| 🔥 Trending          | High growth within the current period |
| 🏆 Top Translator    | Top 10 in monthly ranking             |
| 📚 Veteran           | Published more than X translations    |
| 💎 High Quality      | Upvote ratio above Y%                 |

Badges may appear next to the translator name or avatar.

---

## 7. Ranking Page UI Structure

### Tabs

- Weekly
- Monthly
- All-time

### Filters

- Language (EN / VN / JP / etc.)
- Genre (optional)
- Individual / Group

---

## 8. Translator Profile (Ranking-Aware)

When clicking a translator from the ranking:

- Current rank and badges
- Summary stats (views, upvotes, translations)
- Recent translations list
- Mini trend indicator (up/down)

---

## 9. Anti-Abuse & Fairness Rules

To ensure ranking integrity:

- Views are deduplicated by user/session/IP within a time window
- Upvotes from newly created accounts may be weighted lower
- Each translation has a maximum contribution cap
- Sudden spikes trigger anomaly detection and review

---

## 10. Information Explicitly NOT Displayed

The following data must remain internal:

- Raw ranking score
- Detailed abuse or report data
- Moderator actions
- Downvote counts (if any)

---

## 11. Dependencies on Existing Features

| Existing Feature         | Used in Ranking |
| ------------------------ | --------------- |
| Translation view count   | Yes             |
| Translation upvotes      | Yes             |
| Translation comments     | Yes             |
| Latest translations feed | Growth signal   |
| Translator profile       | Display surface |

---

## 12. Future Extensions

- Seasonal or event-based rankings
- Genre-specific translator rankings
- Recommendation system based on ranking signals
- Reward system (titles, cosmetic badges)

---

**End of Translator Ranking Specification**
