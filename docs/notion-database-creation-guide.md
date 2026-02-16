# Notion Database Creation Guide
## National Botox Directory - Step-by-Step Instructions

Follow these instructions to create the 5 core databases in your Notion workspace.

---

## Database 1: Provider Database

1. Go to: https://www.notion.so/National-Botox-Directory-Notion-OS-Hub-309baf92cb44813cb5b3f160fb4c73b8
2. Find the "📊 Core Databases" section
3. Click below it and type `/database` → Select "Database - Inline"
4. Name it: **Provider Database**
5. Add these properties (click "+" to add new property):

| Property Name | Type | Options/Format |
|--------------|------|----------------|
| Name | Title | (default) |
| Business Name | Text | - |
| City | Select | (add cities as needed) |
| State | Select | (add states as needed) |
| Specialty | Multi-select | Botox (blue), Dermal Fillers (purple), Lip Fillers (pink), Dysport (green), Xeomin (yellow) |
| Status | Select | Active (green), Pending (yellow), Inactive (red) |
| Subscription Tier | Select | Free (gray), Basic $49/mo (blue), Premium $99/mo (purple), Elite $199/mo (red) |
| Monthly Revenue | Number | Format: Dollar |
| Lead Count | Number | Format: Number |
| Claimed | Checkbox | - |
| Email | Email | - |
| Phone | Phone | - |
| Website | URL | - |
| Date Added | Date | - |

---

## Database 2: Content Calendar

1. Below the Provider Database, type `/database` → Select "Database - Inline"
2. Name it: **Content Calendar**
3. Add these properties:

| Property Name | Type | Options/Format |
|--------------|------|----------------|
| Name | Title | (default) |
| Content Type | Select | City Page (blue), State Page (green), Blog Post (purple), FAQ (yellow), Provider Profile (pink) |
| Target City | Text | - |
| Target State | Select | (add states as needed) |
| Target Keywords | Multi-select | (add keywords as you create content) |
| Status | Select | Planned (gray), In Progress (yellow), Published (green), Needs Update (orange) |
| Priority | Select | High (red), Medium (yellow), Low (gray) |
| Publish Date | Date | - |
| URL | URL | - |
| Word Count | Number | Format: Number |

---

## Database 3: SEO Performance Tracker

1. Below the Content Calendar, type `/database` → Select "Database - Inline"
2. Name it: **SEO Performance Tracker**
3. Add these properties:

| Property Name | Type | Options/Format |
|--------------|------|----------------|
| Name | Title | (default) |
| Target Keyword | Text | - |
| Page URL | URL | - |
| Current Rank | Number | Format: Number |
| Previous Rank | Number | Format: Number |
| Organic Traffic | Number | Format: Number |
| Impressions | Number | Format: Number |
| CTR | Number | Format: Percent |
| Status | Select | Improving (green), Stable (blue), Declining (red) |
| Last Updated | Date | - |

---

## Database 4: Revenue Tracker

1. Below the SEO Performance Tracker, type `/database` → Select "Database - Inline"
2. Name it: **Revenue Tracker**
3. Add these properties:

| Property Name | Type | Options/Format |
|--------------|------|----------------|
| Name | Title | (default) |
| Revenue Source | Select | Subscriptions (blue), Lead Generation (green), Featured Listings (purple), Advertising (yellow) |
| Amount | Number | Format: Dollar |
| Date | Date | - |
| Provider | Relation | → Link to "Provider Database" |
| Status | Select | Paid (green), Pending (yellow), Failed (red) |
| MRR | Checkbox | - |
| Stripe ID | Text | - |

**Note:** For the "Provider" property, after creating it as a Relation type, select "Provider Database" as the database to link to.

---

## Database 5: Development Tasks

1. Below the Revenue Tracker, type `/database` → Select "Database - Inline"
2. Name it: **Development Tasks**
3. Add these properties:

| Property Name | Type | Options/Format |
|--------------|------|----------------|
| Name | Title | (default) |
| Task Type | Select | Feature (blue), Bug Fix (red), Enhancement (purple), SEO (green), Content (yellow) |
| Sprint | Select | Sprint 1 - MVP (blue), Sprint 2 - Scale (purple), Sprint 3 - Monetize (green) |
| Priority | Select | Critical (red), High (orange), Medium (yellow), Low (gray) |
| Status | Select | Backlog (gray), In Progress (yellow), Testing (blue), Done (green) |
| Due Date | Date | - |
| Estimated Hours | Number | Format: Number |

---

## Quick Tips

- **Color coding**: Use the colors specified in parentheses for visual consistency
- **Select options**: You can always add more options later as needed
- **Relations**: The Revenue Tracker → Provider Database relation allows you to link revenue entries to specific providers
- **Views**: After creating each database, you can add different views (Table, Board, Calendar, etc.)

---

## Verification Checklist

After creating all databases, verify:
- ✅ All 5 databases are created under the "Core Databases" section
- ✅ Each database has the correct properties with proper types
- ✅ Select/Multi-select options are configured with colors
- ✅ Revenue Tracker has a working relation to Provider Database
- ✅ Number fields have the correct format (Dollar, Number, Percent)

---

## Next Steps After Creation

1. **Populate Development Tasks** with items from the implementation plan
2. **Add initial cities** to Content Calendar (start with top 10-20 cities)
3. **Set up views** for each database (e.g., Board view for Development Tasks by Status)
4. **Test the relation** by creating a test provider and linking it to a revenue entry
