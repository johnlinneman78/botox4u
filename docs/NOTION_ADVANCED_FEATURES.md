# 🚀 Advanced Notion OS Features

This guide covers the advanced automation features for the National Botox Directory Notion OS.

## 📊 New Databases Created

### 1. **Keyword Research Hub**
Track and manage SEO keywords with import automation.

**Properties:**
- Keyword (title)
- Search Volume (number)
- Difficulty (number)
- CPC (dollar)
- Intent (select: Commercial, Informational, Navigational, Transactional)
- Status (select: New, Researching, Targeted, Ranking)
- Current Rank (number)
- Target URL (url)
- Imported On (date)
- Imported Batch (text)
- Notes (text)

### 2. **Programmatic Pages Tracker**
Monitor all programmatically generated pages with auto-linking to content pipeline.

**Properties:**
- Page Title (title)
- URL (url)
- Template (select: City Page, State Page, Treatment Page, Provider Page)
- City (text)
- State (select)
- Status (select: Planned, Generated, Published, Indexed)
- Priority (select: High, Medium, Low)
- Target Keywords (multi-select)
- Word Count (number)
- Impressions, Clicks, CTR, Avg Position (numbers)
- Created Date, Last Updated (dates)
- **Target Page (relation)** - Auto-links to Content Calendar

### 3. **KPI Tracker**
Monitor key performance indicators across all business areas.

**Properties:**
- Metric Name (title)
- Category (select: Traffic, Revenue, Providers, Content, SEO)
- Current Value, Target Value (numbers)
- Unit (select: Number, Dollars, Percent, Pages)
- Progress (percent)
- Status (select: On Track, At Risk, Behind)
- Month (date)
- Notes (text)

### 4. **Financial Model**
12-month financial projections and actuals.

**Properties:**
- Line Item (title)
- Category (select: Revenue, Cost of Goods, Operating Expense, Marketing, Development)
- Month 1-12 (dollar amounts)
- Annual Total (dollar)
- Type (select: Recurring, One-time, Variable)
- Notes (text)

---

## 🔄 Automated Workflows

### Keyword Import Process

**Purpose:** Import keywords from SEO tool exports (Ahrefs, SEMrush, etc.) with batch tracking.

**Setup:**
1. Export keywords from your SEO tool as CSV
2. Ensure CSV has columns: `keyword`, `volume`, `difficulty`, `cpc`, `intent`
3. Run the import script

**Usage:**
```bash
npm run notion:import-keywords data/your-keywords.csv
```

**What it does:**
- Imports all keywords from CSV
- Tags each with `Imported On` (today's date)
- Tags each with `Imported Batch` (unique batch ID)
- Sets status to "New"
- Logs progress every 10 keywords

**Example CSV Format:**
```csv
keyword,volume,difficulty,cpc,intent
botox near me,135000,68,12.50,Commercial
botox cost,89000,45,8.75,Informational
```

**Sample file included:** `data/sample_keywords.csv`

---

### Auto-Linking Programmatic Pages

**Purpose:** When a Programmatic Pages Tracker row is created, automatically create a related Content Pipeline entry.

**Setup:**
This is already configured! The databases are linked via the `Target Page` relation.

**Manual Sync:**
If you have existing programmatic pages that need content entries:
```bash
npm run notion:link-pages
```

**What it does:**
- Scans all Programmatic Pages Tracker entries
- For each page without a linked content item:
  - Creates a new Content Calendar entry
  - Copies the page title
  - Sets appropriate status
  - Links via Target Page relation

**Workflow:**
1. Create a new row in Programmatic Pages Tracker
2. Fill in: Page Title, URL, Template, City, State, Status
3. Run `npm run notion:link-pages` (or wait for daily sync)
4. A matching Content Calendar entry is auto-created and linked

---

### Reporting & Dashboards

**Purpose:** Create saved views for KPIs and Financial Model on the Master Dashboard.

**KPI Views to Create:**

1. **Monthly KPI Dashboard**
   - Filter: Current month
   - Group by: Category
   - Sort by: Status (Behind → At Risk → On Track)
   - Properties shown: Metric Name, Current Value, Target Value, Progress, Status

2. **Traffic Metrics**
   - Filter: Category = Traffic
   - Sort by: Priority
   - Chart: Line chart of Current Value over time

3. **Revenue Metrics**
   - Filter: Category = Revenue
   - Sort by: Current Value (descending)
   - Chart: Bar chart

**Financial Model Views to Create:**

1. **Revenue Forecast**
   - Filter: Category = Revenue
   - Properties: Line Item, Month 1-12, Annual Total
   - Sum: Show totals at bottom

2. **Expense Breakdown**
   - Filter: Category ≠ Revenue
   - Group by: Category
   - Chart: Pie chart of Annual Total

3. **Monthly P&L**
   - All categories
   - Properties: Line Item, Category, Month 1, Month 2, Month 3
   - Formula column: Calculate profit/loss

**How to Surface on Master Dashboard:**

1. Create a new page called "Master Dashboard"
2. Add linked database views:
   ```
   ## 📊 Key Metrics
   [Linked View: Monthly KPI Dashboard]
   
   ## 💰 Financial Overview
   [Linked View: Revenue Forecast]
   [Linked View: Expense Breakdown]
   
   ## 📈 Traffic & SEO
   [Linked View: Traffic Metrics]
   
   ## 📄 Content Production
   [Linked View: Content Calendar - This Week]
   ```

---

## 🎯 Complete Workflow Example

### Scenario: Launching SEO Campaign for 50 New Cities

**Step 1: Import Keywords**
```bash
# Export keywords from Ahrefs for all 50 cities
# Save as data/city-keywords-2024-02.csv
npm run notion:import-keywords data/city-keywords-2024-02.csv
```

**Step 2: Create Programmatic Pages**
In Notion, bulk-create 50 rows in Programmatic Pages Tracker:
- Page Title: "Botox in [City], [State]"
- URL: `/botox/[city-slug]`
- Template: City Page
- Status: Planned
- Priority: High

**Step 3: Auto-Link to Content Pipeline**
```bash
npm run notion:link-pages
```

**Step 4: Daily Sync**
```bash
npm run notion:sync
```

This will:
- Update all metrics
- Check SEO rankings for imported keywords
- Generate CEO summary
- Log everything

**Step 5: Monitor Progress**
Open your Master Dashboard in Notion to see:
- KPI progress (pages published, traffic, revenue)
- Financial projections
- Content pipeline status
- Keyword rankings

---

## 📅 Recommended Schedule

**Daily (Automated via Task Scheduler):**
```bash
npm run notion:sync
```

**Weekly:**
```bash
# Import new keywords from SEO tools
npm run notion:import-keywords data/weekly-keywords.csv

# Link any new programmatic pages
npm run notion:link-pages
```

**Monthly:**
- Review KPI Tracker
- Update Financial Model actuals
- Export reports from Notion

---

## 🔧 Advanced Configuration

### Custom Keyword Import

Edit `scripts/keyword_import.js` to customize:
- CSV column mapping
- Default values
- Batch ID format
- Import rate limiting

### Auto-Linking Logic

Edit `scripts/auto_link_pages.js` to customize:
- Which pages get auto-linked
- Content Calendar properties
- Linking conditions

### Dashboard Views

Create custom Notion views with:
- Filters (e.g., "Show only High priority")
- Sorts (e.g., "Sort by deadline")
- Groups (e.g., "Group by status")
- Charts (e.g., "Bar chart of revenue by month")

---

## 📊 Sample Data Included

**Keyword Research Hub:**
- 15 sample keywords imported
- Batch ID: BATCH-[timestamp]
- Imported On: Today

**KPI Tracker:**
- Traffic metrics
- Revenue metrics
- Content metrics
- SEO metrics

**Financial Model:**
- Revenue projections (Months 1-12)
- Operating expenses
- Marketing budget
- Development costs

---

## 🎓 Best Practices

1. **Keyword Imports:**
   - Import weekly from your SEO tool
   - Tag each batch for tracking
   - Review "New" keywords and update status

2. **Programmatic Pages:**
   - Create pages in bulk
   - Run auto-link immediately after
   - Monitor "Planned" → "Published" progress

3. **KPIs:**
   - Update weekly
   - Set realistic targets
   - Flag "At Risk" items early

4. **Financial Model:**
   - Update actuals monthly
   - Compare to projections
   - Adjust forecasts quarterly

---

## 🚨 Troubleshooting

**Keyword import fails:**
- Check CSV format (must have: keyword, volume, difficulty, cpc, intent)
- Ensure NOTION_API_KEY is set
- Verify Keyword Research Hub database exists

**Auto-linking doesn't work:**
- Verify both databases exist
- Check that Target Page relation is configured
- Run manually: `npm run notion:link-pages`

**Dashboard views not showing:**
- Ensure databases are created
- Create linked database views (not inline)
- Check filter conditions

---

## 📞 Quick Commands Reference

```bash
# Import keywords from CSV
npm run notion:import-keywords data/keywords.csv

# Auto-link programmatic pages to content
npm run notion:link-pages

# Daily sync (metrics + SEO + summary)
npm run notion:sync

# Manual update (dev, marketing, revenue, etc.)
npm run notion:update [type] [args...]

# Create advanced databases (one-time setup)
npm run notion:setup-advanced
```

---

## ✅ Setup Checklist

- [x] Keyword Research Hub database created
- [x] Programmatic Pages Tracker created
- [x] KPI Tracker created
- [x] Financial Model created
- [x] Target Page relation configured
- [x] csv-parser installed
- [x] Sample CSV created
- [ ] Master Dashboard page created in Notion
- [ ] KPI views configured
- [ ] Financial Model views configured
- [ ] Daily sync scheduled (Task Scheduler)
- [ ] First keyword import completed
- [ ] First auto-link test completed

---

**Last Updated:** 2026-02-16  
**Version:** 2.0 - Advanced Features
