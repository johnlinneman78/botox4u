# Notion Database Automation Guide

## 📋 Overview

This guide covers all the automation tools for managing your National Botox Directory Notion workspace. These scripts keep your databases up-to-date with development progress, marketing activities, financial data, and SEO performance.

## 🗄️ Databases

Your Notion OS includes 5 core databases:

1. **Provider Database** - Track all botox providers and their subscription status
2. **Content Calendar** - Plan and manage SEO content (city pages, blog posts)
3. **SEO Performance Tracker** - Monitor keyword rankings and organic traffic
4. **Revenue Tracker** - Track all revenue streams and subscriptions
5. **Development Tasks** - Manage development sprints and tasks

**Access:** [National Botox Directory - Notion OS Hub](https://www.notion.so/National-Botox-Directory-Notion-OS-Hub-309baf92cb44813cb5b3f160fb4c73b8)

## 🚀 Quick Start

### Initial Setup (Already Done!)
```bash
# Populate databases with initial data
npm run notion:populate
```

### Daily Sync
```bash
# Run this daily to update metrics and SEO rankings
npm run notion:sync
```

### Manual Updates
```bash
# Use this when working on specific aspects
npm run notion:update [command] [args...]
```

## 📊 Daily Sync Script

**File:** `scripts/daily_notion_sync.js`

**What it does:**
- ✅ Counts tasks by status (Done, In Progress, Backlog)
- ✅ Counts content by status (Published, In Progress, Planned)
- ✅ Tracks provider metrics (Total, Claimed, Paid)
- ✅ Updates SEO keyword rankings
- ✅ Creates daily CEO review summary
- ✅ Saves sync log to `.notion-sync-log.json`

**Run it:**
```bash
npm run notion:sync
```

**Automate it (Windows Task Scheduler):**
```powershell
# Create a scheduled task to run daily at 9 AM
$action = New-ScheduledTaskAction -Execute "npm" -Argument "run notion:sync" -WorkingDirectory "C:\Users\uriel\.gemini\antigravity\playground\fiery-cosmos"
$trigger = New-ScheduledTaskTrigger -Daily -At 9am
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "Notion Daily Sync" -Description "Daily sync for National Botox Directory Notion databases"
```

## 🔧 Manual Update Tool

**File:** `scripts/notion_update.js`

Use this CLI tool to quickly add entries to your databases while working.

### Marketing Updates

Add marketing campaigns, content ideas, or social media posts:

```bash
npm run notion:update marketing "Launch Instagram Campaign" "social" "Blog Post" "In Progress" "High"
```

**Arguments:**
1. Campaign/Content Name
2. Type (campaign, social, email, etc.)
3. Content Type (Blog Post, City Page, FAQ, etc.)
4. Status (Planned, In Progress, Published)
5. Priority (High, Medium, Low)

**Examples:**
```bash
# Add a new blog post idea
npm run notion:update marketing "10 Botox Myths Debunked" "blog" "Blog Post" "Planned" "Medium"

# Track social media campaign
npm run notion:update marketing "TikTok Launch Campaign" "social" "Blog Post" "In Progress" "High"

# Plan email newsletter
npm run notion:update marketing "Weekly Newsletter - March" "email" "Blog Post" "Planned" "Low"
```

### Development Tasks

Add development tasks, bugs, or features:

```bash
npm run notion:update dev "Add payment gateway" "Feature" "High" "In Progress" 8
```

**Arguments:**
1. Task Name
2. Type (Feature, Bug Fix, Enhancement, SEO, Content)
3. Priority (Critical, High, Medium, Low)
4. Status (Backlog, In Progress, Testing, Done)
5. Estimated Hours

**Examples:**
```bash
# Add a new feature
npm run notion:update dev "Implement provider dashboard" "Feature" "High" "Backlog" 12

# Log a bug fix
npm run notion:update dev "Fix mobile navigation menu" "Bug Fix" "Critical" "In Progress" 3

# Add SEO task
npm run notion:update dev "Optimize image loading" "SEO" "Medium" "Backlog" 4
```

### Revenue Tracking

Log revenue from subscriptions, leads, or advertising:

```bash
npm run notion:update revenue "First subscriber" "Subscriptions" 49 "Paid" true
```

**Arguments:**
1. Description
2. Source (Subscriptions, Lead Generation, Featured Listings, Advertising)
3. Amount (number)
4. Status (Paid, Pending, Failed)
5. Is Recurring (true/false)

**Examples:**
```bash
# Log monthly subscription
npm run notion:update revenue "Premium subscription - LA Med Spa" "Subscriptions" 99 "Paid" true

# Log one-time lead sale
npm run notion:update revenue "Lead pack - 10 leads" "Lead Generation" 150 "Paid" false

# Log featured listing
npm run notion:update revenue "Featured listing - Beverly Hills" "Featured Listings" 199 "Pending" true
```

### Provider Management

Add new providers to the database:

```bash
npm run notion:update provider "LA Med Spa" "Los Angeles" "California" "Basic ($49/mo)"
```

**Arguments:**
1. Provider Name
2. City
3. State
4. Subscription Tier (Free, Basic ($49/mo), Premium ($99/mo), Elite ($199/mo))

**Examples:**
```bash
# Add free provider
npm run notion:update provider "Miami Aesthetics" "Miami" "Florida" "Free"

# Add premium subscriber
npm run notion:update provider "NYC Dermatology" "New York" "New York" "Premium ($99/mo)"

# Add elite subscriber
npm run notion:update provider "Beverly Hills Med Spa" "Los Angeles" "California" "Elite ($199/mo)"
```

### SEO Tracking

Track keyword rankings and performance:

```bash
npm run notion:update seo "botox los angeles" 15 250
```

**Arguments:**
1. Keyword
2. Current Rank (0 if not ranking)
3. Monthly Traffic

**Examples:**
```bash
# Track new keyword
npm run notion:update seo "botox near me" 0 0

# Update existing keyword
npm run notion:update seo "botox cost" 8 450

# Track local keyword
npm run notion:update seo "botox miami beach" 12 180
```

## 🤖 Automation Workflows

### Daily Workflow (Automated)

Set up a daily task to run at 9 AM:
1. Syncs all database metrics
2. Updates SEO rankings
3. Creates daily CEO review
4. Saves progress log

### When Working on Development

```bash
# Start your dev session
npm run dev

# Log what you're working on
npm run notion:update dev "Implement city page template" "Feature" "High" "In Progress" 6

# When done, update status in Notion manually or run sync
npm run notion:sync
```

### When Working on Marketing

```bash
# Planning content
npm run notion:update marketing "Botox Guide for Miami" "content" "City Page" "Planned" "High"

# Publishing content
# (Update status manually in Notion to "Published")

# Track SEO performance
npm run notion:update seo "botox miami" 0 0
```

### When Onboarding Providers

```bash
# Add new provider
npm run notion:update provider "Coral Gables Med Spa" "Miami" "Florida" "Free"

# If they upgrade
# (Update subscription tier manually in Notion)

# Log revenue
npm run notion:update revenue "New subscriber - Coral Gables Med Spa" "Subscriptions" 99 "Paid" true
```

### Financial Analysis

```bash
# Log all revenue as it comes in
npm run notion:update revenue "Monthly subscription - Provider X" "Subscriptions" 49 "Paid" true

# Run daily sync to see totals
npm run notion:sync

# Check Revenue Tracker database in Notion for analysis
```

## 📁 File Structure

```
scripts/
├── create_databases.js        # Initial database creation (already run)
├── populate_notion_data.js    # Populate with initial data (already run)
├── daily_notion_sync.js       # Daily automation script
└── notion_update.js           # Manual update CLI tool

.notion-sync-log.json          # Sync history and metrics (auto-generated)
```

## 🔐 Environment Variables

The scripts use the Notion API token from your MCP configuration. No additional setup needed!

If you need to set it manually:
```bash
$env:NOTION_API_KEY='your_token_here'
```

## 📈 Metrics Tracked

### Development Metrics
- Total tasks
- Tasks completed
- Tasks in progress
- Tasks in backlog
- Completion percentage

### Content Metrics
- Total content items
- Published pages
- In-progress content
- Planned content
- Publishing velocity

### Provider Metrics
- Total providers
- Claimed profiles
- Paid subscribers
- Free listings
- Conversion rate

### Revenue Metrics
- Total revenue
- Monthly Recurring Revenue (MRR)
- Revenue by source
- Payment status

### SEO Metrics
- Keyword rankings
- Ranking improvements
- Organic traffic
- Click-through rates

## 🎯 Best Practices

1. **Run daily sync every morning** - Get a snapshot of your progress
2. **Log tasks as you work** - Keep the development database current
3. **Update content status** - Mark content as published when live
4. **Track all revenue** - Log every payment for accurate financial tracking
5. **Monitor SEO weekly** - Check keyword performance and adjust strategy

## 🆘 Troubleshooting

### Script fails with authentication error
```bash
# Check if API key is set
echo $env:NOTION_API_KEY

# If not set, add it
$env:NOTION_API_KEY='<your-notion-token>'
```

### Database not found
```bash
# Run the sync script to verify databases exist
npm run notion:sync
```

### Rate limiting
The scripts include 300ms delays between API calls to avoid rate limits. If you still hit limits, increase the delay in the script.

## 🔗 Resources

- [Notion OS Hub](https://www.notion.so/National-Botox-Directory-Notion-OS-Hub-309baf92cb44813cb5b3f160fb4c73b8)
- [Notion API Documentation](https://developers.notion.com/)
- [Implementation Plan](./plans/2026-02-15-implementation-plan.md)
- [Design Document](./plans/2026-02-15-national-botox-directory-design.md)

---

**Last Updated:** February 16, 2026  
**Status:** ✅ Fully Operational
