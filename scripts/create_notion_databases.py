#!/usr/bin/env python3
"""
Create Notion databases for InjectorIndex.com
"""
import os
import requests
import json

# Get Notion API key from environment
NOTION_API_KEY = os.getenv('NOTION_API_KEY')
if not NOTION_API_KEY:
    print("ERROR: NOTION_API_KEY environment variable not set")
    print("Please set it with: $env:NOTION_API_KEY='your_key_here'")
    exit(1)

NOTION_VERSION = "2022-06-28"
PARENT_PAGE_ID = "309baf92-cb44-813c-b5b3-f160fb4c73b8"

headers = {
    "Authorization": f"Bearer {NOTION_API_KEY}",
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json"
}

def create_database(title, properties):
    """Create a Notion database"""
    url = "https://api.notion.com/v1/databases"
    
    payload = {
        "parent": {
            "type": "page_id",
            "page_id": PARENT_PAGE_ID
        },
        "title": [
            {
                "type": "text",
                "text": {
                    "content": title
                }
            }
        ],
        "properties": properties
    }
    
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code == 200:
        print(f"✅ Created: {title}")
        return response.json()
    else:
        print(f"❌ Failed to create {title}")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        return None

# Database 1: Provider Database
provider_db_properties = {
    "Name": {"title": {}},
    "Business Name": {"rich_text": {}},
    "City": {"select": {"options": []}},
    "State": {"select": {"options": []}},
    "Specialty": {
        "multi_select": {
            "options": [
                {"name": "Botox", "color": "blue"},
                {"name": "Dermal Fillers", "color": "purple"},
                {"name": "Lip Fillers", "color": "pink"},
                {"name": "Dysport", "color": "green"},
                {"name": "Xeomin", "color": "yellow"}
            ]
        }
    },
    "Status": {
        "select": {
            "options": [
                {"name": "Active", "color": "green"},
                {"name": "Pending", "color": "yellow"},
                {"name": "Inactive", "color": "red"}
            ]
        }
    },
    "Subscription Tier": {
        "select": {
            "options": [
                {"name": "Free", "color": "gray"},
                {"name": "Basic ($49/mo)", "color": "blue"},
                {"name": "Premium ($99/mo)", "color": "purple"},
                {"name": "Elite ($199/mo)", "color": "red"}
            ]
        }
    },
    "Monthly Revenue": {"number": {"format": "dollar"}},
    "Lead Count": {"number": {"format": "number"}},
    "Claimed": {"checkbox": {}},
    "Email": {"email": {}},
    "Phone": {"phone_number": {}},
    "Website": {"url": {}},
    "Date Added": {"date": {}}
}

# Database 2: Content Calendar
content_calendar_properties = {
    "Name": {"title": {}},
    "Content Type": {
        "select": {
            "options": [
                {"name": "City Page", "color": "blue"},
                {"name": "State Page", "color": "green"},
                {"name": "Blog Post", "color": "purple"},
                {"name": "FAQ", "color": "yellow"},
                {"name": "Provider Profile", "color": "pink"}
            ]
        }
    },
    "Target City": {"rich_text": {}},
    "Target State": {"select": {"options": []}},
    "Target Keywords": {"multi_select": {"options": []}},
    "Status": {
        "select": {
            "options": [
                {"name": "Planned", "color": "gray"},
                {"name": "In Progress", "color": "yellow"},
                {"name": "Published", "color": "green"},
                {"name": "Needs Update", "color": "orange"}
            ]
        }
    },
    "Priority": {
        "select": {
            "options": [
                {"name": "High", "color": "red"},
                {"name": "Medium", "color": "yellow"},
                {"name": "Low", "color": "gray"}
            ]
        }
    },
    "Publish Date": {"date": {}},
    "URL": {"url": {}},
    "Word Count": {"number": {"format": "number"}}
}

# Database 3: SEO Performance Tracker
seo_tracker_properties = {
    "Name": {"title": {}},
    "Target Keyword": {"rich_text": {}},
    "Page URL": {"url": {}},
    "Current Rank": {"number": {"format": "number"}},
    "Previous Rank": {"number": {"format": "number"}},
    "Organic Traffic": {"number": {"format": "number"}},
    "Impressions": {"number": {"format": "number"}},
    "CTR": {"number": {"format": "percent"}},
    "Status": {
        "select": {
            "options": [
                {"name": "Improving", "color": "green"},
                {"name": "Stable", "color": "blue"},
                {"name": "Declining", "color": "red"}
            ]
        }
    },
    "Last Updated": {"date": {}}
}

# Database 4: Revenue Tracker (we'll add the relation after Provider DB is created)
revenue_tracker_properties = {
    "Name": {"title": {}},
    "Revenue Source": {
        "select": {
            "options": [
                {"name": "Subscriptions", "color": "blue"},
                {"name": "Lead Generation", "color": "green"},
                {"name": "Featured Listings", "color": "purple"},
                {"name": "Advertising", "color": "yellow"}
            ]
        }
    },
    "Amount": {"number": {"format": "dollar"}},
    "Date": {"date": {}},
    "Status": {
        "select": {
            "options": [
                {"name": "Paid", "color": "green"},
                {"name": "Pending", "color": "yellow"},
                {"name": "Failed", "color": "red"}
            ]
        }
    },
    "MRR": {"checkbox": {}},
    "Stripe ID": {"rich_text": {}}
}

# Database 5: Development Tasks
dev_tasks_properties = {
    "Name": {"title": {}},
    "Task Type": {
        "select": {
            "options": [
                {"name": "Feature", "color": "blue"},
                {"name": "Bug Fix", "color": "red"},
                {"name": "Enhancement", "color": "purple"},
                {"name": "SEO", "color": "green"},
                {"name": "Content", "color": "yellow"}
            ]
        }
    },
    "Sprint": {
        "select": {
            "options": [
                {"name": "Sprint 1 - MVP", "color": "blue"},
                {"name": "Sprint 2 - Scale", "color": "purple"},
                {"name": "Sprint 3 - Monetize", "color": "green"}
            ]
        }
    },
    "Priority": {
        "select": {
            "options": [
                {"name": "Critical", "color": "red"},
                {"name": "High", "color": "orange"},
                {"name": "Medium", "color": "yellow"},
                {"name": "Low", "color": "gray"}
            ]
        }
    },
    "Status": {
        "select": {
            "options": [
                {"name": "Backlog", "color": "gray"},
                {"name": "In Progress", "color": "yellow"},
                {"name": "Testing", "color": "blue"},
                {"name": "Done", "color": "green"}
            ]
        }
    },
    "Due Date": {"date": {}},
    "Estimated Hours": {"number": {"format": "number"}}
}

# Create all databases
print("\n🚀 Creating Notion Databases for InjectorIndex.com...\n")

provider_db = create_database("Provider Database", provider_db_properties)
content_calendar_db = create_database("Content Calendar", content_calendar_properties)
seo_tracker_db = create_database("SEO Performance Tracker", seo_tracker_properties)
revenue_tracker_db = create_database("Revenue Tracker", revenue_tracker_properties)
dev_tasks_db = create_database("Development Tasks", dev_tasks_properties)

print("\n✨ Database creation complete!\n")

# Save database IDs for reference
if all([provider_db, content_calendar_db, seo_tracker_db, revenue_tracker_db, dev_tasks_db]):
    database_ids = {
        "provider_database": provider_db['id'],
        "content_calendar": content_calendar_db['id'],
        "seo_tracker": seo_tracker_db['id'],
        "revenue_tracker": revenue_tracker_db['id'],
        "dev_tasks": dev_tasks_db['id']
    }
    
    with open('notion_database_ids.json', 'w') as f:
        json.dump(database_ids, f, indent=2)
    
    print("📝 Database IDs saved to notion_database_ids.json")
    print("\nDatabase URLs:")
    for name, db_id in database_ids.items():
        clean_id = db_id.replace('-', '')
        print(f"  {name}: https://www.notion.so/{clean_id}")
