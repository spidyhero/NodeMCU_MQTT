# THAREEA AI — Web App Master Concept Prompt (MCP)

## ROLE

Act as a **world-class Product Architect, Full-Stack Web Architect, UX Strategist, and Ethical AI Platform Designer**.

Design and specify the **THAREEA AI Web Application** for:

- Artist onboarding and model management
- Buyer discovery and licensed image generation
- Marketplace commerce and royalty distribution
- Compliance, ownership transparency, and trust

Your output must be implementation-ready for an engineering team.

---

## PRODUCT CONTEXT

THAREEA AI is a Thailand-first ethical AI platform where artists train models using only their own artwork and monetize licensed usage.

The web app is the primary interface for:

1. **Artists** (upload, train, manage, monetize)
2. **Buyers** (brands/agencies/studios generating licensed assets)
3. **Operations/Admin** (governance, compliance, disputes, payouts)

---

## OBJECTIVES FOR THE WEB APP

1. Build trust through ownership and licensing transparency
2. Make model training and publishing simple for non-technical artists
3. Make licensed generation frictionless for businesses
4. Automate monetization and payout workflows
5. Ensure security, compliance, and auditability at scale

---

## USER ROLES

Define UX, permissions, and flows for:

- Guest
- Artist (verified/unverified)
- Buyer (individual/enterprise)
- Finance operator
- Compliance reviewer
- Admin/platform operator

Include role-based access matrix.

---

## CORE WEB APP MODULES

### 1) Authentication & Identity
- Email/social/SSO login
- MFA
- Artist identity and ownership verification
- Enterprise team and seat management

### 2) Artist Dashboard
- Dataset upload and management
- Rights declaration per dataset
- Training job configuration and status
- Model version management and publishing controls
- Pricing, licensing, and storefront settings
- Revenue analytics and payout status

### 3) Buyer Workspace
- Model discovery and filtering
- License selection and checkout
- Prompt composer and generation controls
- Project folders and team collaboration
- Download center with license receipts

### 4) Marketplace
- Artist storefront pages
- Featured collections and categories
- Subscriptions, credits, and commercial plans
- Ratings, trust badges, and quality signals

### 5) Licensing & Payments
- License policy display and acceptance
- Usage metering and billing
- Invoice and tax support
- Revenue split and payout pipeline

### 6) Trust, Safety, and Compliance
- Ownership provenance views
- Watermark/fingerprint indicators
- Dispute and takedown center
- Audit logs and governance workflow

### 7) Admin Console
- User/model moderation
- Fraud and abuse monitoring
- Settlement and payout controls
- Policy and content rule management

---

## REQUIRED OUTPUT FORMAT

Produce all sections in this exact order:

1. Product Overview (web app scope and value)  
2. Information Architecture (site map + module boundaries)  
3. User Roles and RBAC Matrix  
4. End-to-End UX Flows (Artist, Buyer, Admin)  
5. Screen Inventory (all key pages with purpose)  
6. System Architecture Diagram (Mermaid: frontend, backend, services)  
7. Frontend Architecture (framework, state, routing, i18n, design system)  
8. Backend/API Design (key endpoints, auth model, webhooks, contracts)  
9. Database/Data Model (core entities and relationships)  
10. Billing, Licensing, and Revenue Split Logic  
11. Security, Privacy, and Compliance Controls (PDPA-aware)  
12. Performance and Scalability Strategy (web + inference integration)  
13. Observability and Analytics Plan (product + infra metrics)  
14. QA and Testing Strategy (unit/integration/e2e/security)  
15. Deployment Plan (environments, CI/CD, rollback, release gates)  
16. 90-Day Delivery Roadmap (phased milestones)  
17. Risks and Mitigations  

---

## TECHNICAL EXPECTATIONS

Assume modern web stack and provide rationale:

- Frontend: Next.js/React + TypeScript
- Backend: API gateway + service layer
- Auth: OAuth2/OIDC + JWT + RBAC
- Data: PostgreSQL + cache + object storage
- Async: queue/event bus for long-running jobs
- Integrations: model inference API, payment provider, email/notification

Include suggested folder structure and service boundaries.

---

## UX QUALITY EXPECTATIONS

- Thai-first and English-ready localization
- Mobile-responsive and accessibility-first (WCAG-minded)
- Clear legal/licensing UI language
- Explainability surfaces (why usage is allowed, who owns what)
- Fast time-to-value for first generation and first payout

---

## DESIGN CONSTRAINTS

The web app design must be:

- Artist-centered and trust-centric
- Legally clear for commercial users
- Operationally scalable for national growth
- Extensible for ASEAN/global rollout

---

## OUTPUT STYLE

- Be concrete, implementation-oriented, and structured
- Include diagrams, tables, and examples where useful
- Avoid vague statements; specify decisions and trade-offs
- Optimize for handoff to product, design, and engineering teams

