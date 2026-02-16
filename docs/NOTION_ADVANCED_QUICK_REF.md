# 🎯 Notion OS Advanced Features - Quick Reference

## 📊 New Databases

| Database | Purpose | Key Features |
|----------|---------|--------------|
| **Keyword Research Hub** | SEO keyword tracking | Batch imports, ranking tracking, intent classification |
| **Programmatic Pages Tracker** | Monitor generated pages | Auto-links to content, SEO metrics, template tracking |
| **KPI Tracker** | Business metrics | Progress tracking, multi-category, status monitoring |
| **Financial Model** | 12-month projections | Revenue/expense tracking, P&L calculations |

---

## ⚡ Quick Commands

### Keyword Management
```bash
# Import keywords from CSV
npm run notion:import-keywords data/keywords.csv

# CSV Format:
# keyword,volume,difficulty,cpc,intent
# botox near me,135000,68,12.50,Commercial
```

### Page Automation
```bash
# Auto-create content entries for programmatic pages
npm run notion:link-pages
```

### Daily Operations
```bash
# Run daily sync (metrics + SEO + summary)
npm run notion:sync

# Manual updates
npm run notion:update dev "Task" "Feature" "High" "Done" 8
npm run notion:update marketing "Campaign" "social" "Blog" "Active" "High"
npm run notion:update revenue "Sub" "Subscriptions" 99 "Paid" true
npm run notion:update provider "Name" "City" "State" "Premium ($99/mo)"
npm run notion:update seo "keyword" 10 500
```

---

## 🔄 Automated Workflows

### 1. Keyword Import Workflow
1. Export keywords from SEO tool (Ahrefs, SEMrush, etc.)
2. Save as CSV with required columns
3. Run: `npm run notion:import-keywords data/your-file.csv`
4. Keywords imported with batch ID and date
5. Review in Keyword Research Hub

### 2. Programmatic Page Workflow
1. Create page entries in Programmatic Pages Tracker
2. Run: `npm run notion:link-pages`
3. Content Calendar entries auto-created
4. Pages linked via Target Page relation
5. Monitor progress in both databases

### 3. Daily Reporting Workflow
1. Schedule: `npm run notion:sync` (daily at 8 AM)
2. Metrics updated automatically
3. SEO rankings checked
4. CEO summary generated
5. Review dashboard in Notion

---

## 📋 CSV Templates

### Keywords CSV
```csv
keyword,volume,difficulty,cpc,intent
botox near me,135000,68,12.50,Commercial
botox cost,89000,45,8.75,Informational
best botox injector,24000,52,11.20,Commercial
```

**Sample:** `data/sample_keywords.csv`

---

## 🎨 Notion Views to Create

### KPI Tracker Views
- **Monthly Dashboard** - Current month, grouped by category
- **Traffic Metrics** - Filter: Category = Traffic
- **Revenue Metrics** - Filter: Category = Revenue
- **At Risk Items** - Filter: Status = At Risk

### Financial Model Views
- **Revenue Forecast** - Filter: Category = Revenue
- **Expense Breakdown** - Filter: Category ≠ Revenue
- **Monthly P&L** - All categories with totals

### Programmatic Pages Views
- **Published Pages** - Filter: Status = Published
- **By Template** - Group by: Template
- **High Priority** - Filter: Priority = High
- **Needs Content** - Filter: Target Page is empty

---

## 📊 Master Dashboard Setup

Create a new page in Notion called "Master Dashboard" with:

```
# 🎯 National Botox Directory - Master Dashboard

## 📊 Key Performance Indicators
[Linked View: KPI Tracker - Monthly Dashboard]

## 💰 Financial Overview
[Linked View: Financial Model - Revenue Forecast]
[Linked View: Financial Model - Expense Breakdown]

## 📄 Content Pipeline
[Linked View: Content Calendar - This Week]
[Linked View: Programmatic Pages - Published]

## 🔍 SEO Performance
[Linked View: Keyword Research Hub - Top Keywords]
[Linked View: SEO Performance Tracker - This Month]

## 👥 Provider Management
[Linked View: Provider Database - Active Providers]

## ✅ Development Tasks
[Linked View: Development Tasks - In Progress]
```

---

## 🚀 First-Time Setup

1. **Create Advanced Databases** (one-time)
   ```bash
   npm run notion:setup-advanced
   node scripts/create_programmatic_pages_db.js
   ```

2. **Import Sample Keywords**
   ```bash
   npm run notion:import-keywords data/sample_keywords.csv
   ```

3. **Test Auto-Linking**
   - Create a test page in Programmatic Pages Tracker
   - Run: `npm run notion:link-pages`
   - Verify content entry was created

4. **Create Master Dashboard**
   - New page in Notion
   - Add linked database views
   - Configure filters and sorts

5. **Schedule Daily Sync**
   - Windows Task Scheduler
   - Action: `npm run notion:sync`
   - Trigger: Daily at 8:00 AM

---

## 🎯 Weekly Checklist

- [ ] Import new keywords from SEO tools
- [ ] Run auto-link for new programmatic pages
- [ ] Review KPI progress
- [ ] Update financial actuals
- [ ] Check "At Risk" items
- [ ] Review CEO summary from daily sync

---

## 📞 Support

**Documentation:**
- Full Guide: `docs/NOTION_ADVANCED_FEATURES.md`
- Automation Guide: `docs/notion-automation-guide.md`
- Quick Ref: `docs/NOTION_QUICK_REF.md`

**Scripts:**
- `scripts/keyword_import.js` - Keyword import automation
- `scripts/auto_link_pages.js` - Page linking automation
- `scripts/daily_notion_sync.js` - Daily sync
- `scripts/notion_update.js` - Manual updates

---

**Version:** 2.0 Advanced  
**Last Updated:** 2026-02-16
