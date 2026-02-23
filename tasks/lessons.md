# Lessons Log

## [2026-02-23]
- **Pattern**: Deployment Delay / Cache Issues.
- **Problem**: Verified a task as complete before ensuring the deployment was successful on the live site.
- **Rule**: Never claim a task is "Done" until a subagent has verified the changes on the *live* domain (e.g., injectorindex.com) with a cache-busting parameter, especially when working on production-ready features.
- **Pattern**: Missing Primary CTAs.
- **Problem**: Primary CTA ('Free Clinic Audit') was implemented but not prominent enough in the navigation for the user's conversion needs.
- **Rule**: Primary lead magnets and CTAs should be promoted to the highest level of the navigation (Header buttons) and repeated in mobile navigation drawers, not just as standard text links.
