# Botox-4-U.com Launch & CRM Guide

## 🚀 Project Overview
We have successfully transitioned the branding to **Botox-4-U.com** and implemented a comprehensive CRM and outreach system. This document outlines the workflows, access points, and maintenance procedures.

## 📊 CRM & Admin Dashboard
**Access URL:** `/admin/leads` (requires authentication)
**Dashboard URL:** `/admin/dashboard`

### Features
*   **Lead Tracking:** View all incoming patient inquiries.
*   **Status Management:** Update lead status (New, Contacted, Converted, Closed).
*   **Provider Assignment:** See which provider a lead is assigned to.
*   **Metrics:** View daily leads, total pipeline, and quiet providers.

## 🔄 Workflows

### 1. Inbound Lead Flow (Patient Inquiry)
1.  **Trigger:** Patient submits a form on a Provider Profile or City Page.
2.  **Action:**
    *   Lead is saved to Supabase `leads` table.
    *   **Email Notification:** Sent to the Provider (if email exists) and Admin (`ADMIN_EMAIL`).
    *   **CRM Update:** Lead appears in `/admin/leads` with status `new`.

### 2. Outbound Outreach Flow (Provider Onboarding)
1.  **Trigger:** Scheduled script or manual run.
2.  **Action:**
    *   Identifies providers with `outreach_status` = `not_sent`.
    *   Sends personalized email using `scripts/send_outreach.js`.
    *   Updates `outreach_status` to `sent` and logs `date_sent`.

### 3. Data Sync (Notion)
1.  **Trigger:** `npm run sync:notion`
2.  **Action:**
    *   Syncs key metrics (Tasks, Content, Provider Counts) to Notion.
    *   Updates SEO rankings (simulated).
    *   Creates a Daily CEO Review log in `notion-sync-log.json`.

## 🛠️ Operational Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local development server. |
| `node scripts/send_outreach.js` | Runs the automated provider outreach. |
| `node scripts/daily_notion_sync.js` | Syncs dashboard metrics to Notion. |
| `python scripts/create_notion_databases.py` | (Setup) Creates necessary Notion databases. |

## ⏭️ Immediate Next Steps

1.  **Database Migration:**
    Run the SQL in `supabase/migrations/20240217_add_state_to_leads.sql` to add the `state` column to the leads table.

2.  **Environment Variables:**
    Ensure `.env.local` has:
    *   `RESEND_API_KEY`: For sending emails.
    *   `ADMIN_EMAIL`: Where you receive lead notifications.
    *   `CONTACT_EMAIL`: The 'From' address (e.g., hello@botox-4-u.com).
    *   `NOTION_API_KEY`: For Notion syncing.

3.  **Deploy:**
    Push changes to GitHub and let Vercel redeploy.
    ```bash
    git add .
    git commit -m "feat: launch crm and branding updates"
    git push
    ```

## 📝 Import to Notion
To import this guide into Notion, we have generated a script.
Run: `node scripts/import_readme_to_notion.js`
