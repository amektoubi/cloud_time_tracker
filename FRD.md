# Functional Requirements Document: Structure Overview

# Table of Contents

*   [Chapter 1: Introduction](#chapter-1-introduction)
    *   [1.1 Purpose](#11-purpose)
    *   [1.2 Scope](#12-scope)
    *   [1.3 Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
    *   [1.4 References](#14-references)
    *   [1.5 Overview of Document](#15-overview-of-document)
*   [Chapter 2: Executive Summary](#chapter-2-executive-summary)
    *   [2.1 Vision](#21-vision)
    *   [2.2 Key Business Objectives](#22-key-business-objectives)
        *   [2.2.1 Operational Continuity (Offline Mode)](#221-operational-continuity-offline-mode)
        *   [2.2.2 Centralization and Synchronization](#222-centralization-and-synchronization)
        *   [2.2.3 Identity and Security](#223-identity-and-security)
        *   [2.2.4 Deployment Flexibility](#224-deployment-flexibility)
        *   [2.2.5 Administrative Control](#225-administrative-control)
    *   [2.3 Target Audience](#23-target-audience)
    *   [2.4 Assumptions and Dependencies](#24-assumptions-and-dependencies)
*   [Chapter 3: System Architecture and Actors](#chapter-3-system-architecture-and-actors)
    *   [3.1 High-Level System Architecture](#31-high-level-system-architecture)
        *   [3.1.1 The Client Layer (Unified Frontend)](#311-the-client-layer-unified-frontend)
        *   [3.1.2 The Application Server (Backend)](#312-the-application-server-backend)
        *   [3.1.3 The Data Layer (Persistence)](#313-the-data-layer-persistence)
    *   [3.2 System Actors (User Roles)](#32-system-actors-user-roles)
        *   [3.2.1 Guest](#321-guest)
        *   [3.2.2 Standard User](#322-standard-user)
        *   [3.2.3 System Administrator (Instance Owner)](#323-system-administrator-instance-owner)
        *   [3.2.4 System (Internal Actor)](#324-system-internal-actor)
    *   [3.3 Permissions Matrix (High-Level)](#33-permissions-matrix-high-level)
*   [Chapter 4: Module 1 — Identity and Access Management (IAM)](#chapter-4-module-1--identity-and-access-management-iam)
    *   [4.1 Overview](#41-overview)
    *   [4.2 User Registration](#42-user-registration)
    *   [4.3 Authentication (Login)](#43-authentication-login)
    *   [4.4 Password Management](#44-password-management)
    *   [4.5 Role Management (RBAC) & Bootstrapping](#45-role-management-rbac--bootstrapping)
    *   [4.6 Account Management & Deletion](#46-account-management--deletion)
    *   [4.7 Security Configuration (Password Policy)](#47-security-configuration-password-policy)
    *   [4.8 Session Management](#48-session-management)
*   [Chapter 5: Module 2 — Taxonomy and Configuration](#chapter-5-module-2--taxonomy-and-configuration)
    *   [5.1 Overview](#51-overview)
    *   [5.2 Category Management](#52-category-management)
    *   [5.3 Tag Management](#53-tag-management)
    *   [5.4 Goals and Limits](#54-goals-and-limits)
    *   [5.5 Automation Rules (Smart Categorization)](#55-automation-rules-smart-categorization)
    *   [5.6 Data Validation and Constraints](#56-data-validation-and-constraints)
*   [Chapter 6: Module 3 — Time Tracking Core](#chapter-6-module-3--time-tracking-core)
    *   [6.1 Overview](#61-overview)
    *   [6.2 Real-Time Tracking (Running Timers)](#62-real-time-tracking-running-timers)
    *   [6.3 Manual Data Entry](#63-manual-data-entry)
    *   [6.4 Record Management (CRUD)](#64-record-management-crud)
    *   [6.5 Data Export (CSV)](#65-data-export-csv)
    *   [6.6 Synchronization and Conflict Resolution](#66-synchronization-and-conflict-resolution)
*   [Chapter 7: Module 4 — Analytics and Visualization](#chapter-7-module-4--analytics-and-visualization)
    *   [7.1 Overview](#71-overview)
    *   [7.2 The Dashboard](#72-the-dashboard)
    *   [7.3 Statistical Charts (Server-Driven)](#73-statistical-charts-server-driven)
    *   [7.4 Data Filtering & Saved Views](#74-data-filtering--saved-views)
    *   [7.5 Timeline View (Local & Offline)](#75-timeline-view-local--offline)
    *   [7.6 Reporting Logic](#76-reporting-logic)
*   [Chapter 8: Module 5 — Application Settings and Synchronization](#chapter-8-module-5--application-settings-and-synchronization)
    *   [8.1 Overview](#81-overview)
    *   [8.2 Application Interface Settings](#82-application-interface-settings)
    *   [8.3 Notification Settings](#83-notification-settings)
    *   [8.4 Synchronization Logic (The Sync Engine)](#84-synchronization-logic-the-sync-engine)
    *   [8.5 Data Maintenance & Privacy](#85-data-maintenance--privacy)
    *   [8.6 Admin / Self-Hosted Configuration (Web Only)](#86-admin--self-hosted-configuration-web-only)
*   [Chapter 9: Non-Functional Requirements (NFR)](#chapter-9-non-functional-requirements-nfr)
    *   [9.1 Overview](#91-overview)
    *   [9.2 Security Requirements](#92-security-requirements)
    *   [9.3 Performance Requirements](#93-performance-requirements)
    *   [9.4 Scalability and Hosting](#94-scalability-and-hosting)
    *   [9.5 Reliability and Availability](#95-reliability-and-availability)
    *   [9.6 Usability and Accessibility](#96-usability-and-accessibility)
    *   [9.7 Compliance](#97-compliance)
    *   [9.8 Operations and Monitoring](#98-operations-and-monitoring)
*   [Chapter 10: Data Requirements](#chapter-10-data-requirements)
    *   [10.1 Overview](#101-overview)
    *   [10.2 Data Entities (Conceptual Schema)](#102-data-entities-conceptual-schema)
        *   [10.2.1 User](#1021-user)
        *   [10.2.2 Category](#1022-category)
        *   [10.2.3 Tag](#1023-tag)
        *   [10.2.4 Time Record](#1024-time-record)
        *   [10.2.5 Sync Queue (Client-Side Only)](#1025-sync-queue-client-side-only)
    *   [10.3 Data Integrity and Synchronization Rules](#103-data-integrity-and-synchronization-rules)
    *   [10.4 Data Retention and Archiving](#104-data-retention-and-archiving)
    *   [10.5 API Interface Standards](#105-api-interface-standards)

---
# Chapter 1: Introduction

## 1.1 Purpose

The purpose of this Functional Requirements Document (FRD) is to provide a comprehensive specification for the development of the  Time Tracker system system. This document details the functional behaviors, system architecture, external interfaces, and non-functional constraints required to build the solution.

This document serves as the primary contract between stakeholders and the technical team. It allows stakeholders to verify that business objectives—specifically the need for data centralization alongside robust offline reliability—have been accounted for, while providing developers with a definitive guide for implementation.

## 1.2 Scope

The  Time Tracker system project aims to develop a centralized, cross-platform productivity application. The system functionality is derived from the "Simple Time Tracker" Android application (acting as the functional baseline) but is re-architected to support a **Local-First, Cloud-Sync** environment.

The scope of the software system includes:

1. **Mobile Application (iOS/Android):** A native or cross-platform client utilizing local persistent storage. It acts as the primary tool for data entry and must remain fully functional (Start/Stop timers, Edit records) without an internet connection, synchronizing data to the cloud when connectivity is restored.  
2. **Web Application:** A responsive browser-based interface for managing time records, viewing deep analytics, and system administration. It must handle temporary network interruptions gracefully.  
3. **Backend API:** A RESTful server responsible for business logic, identity management, and the complex orchestration of data synchronization between devices.  
4. **Central Database:** A server-side relational database storing the "Source of Truth" for user profiles, credentials, and aggregated time-tracking data.

### Key Functional Boundaries

* **Offline Capability:** The system shall utilize a "Store-and-Forward" mechanism. User actions performed while offline are queued locally and executed against the server upon reconnection.  
* **Synchronization:** The system shall ensure data consistency across devices, employing conflict resolution strategies to handle changes made simultaneously on offline devices.  
* **Identity:** The system shall introduce Role-Based Access Control (RBAC) and secure authentication (Login/Registration).

### Out of Scope

* Native Wear OS or WatchOS independent applications (MVP is limited to Phone/Web).  
* Desktop-specific native clients (Windows .exe / MacOS .app); the Web Application serves desktop users.

## 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
| :---- | :---- |
| **Record** | A historical unit of time tracking consisting of a start time, end time, duration, and assigned category. |
| **Running Record** | An active timer that has a start time but no end time yet. |
| **Local-First** | An architectural pattern where the client reads/writes to local storage primarily, treating the cloud as a synchronization point rather than the primary data source during user interaction. |
| **Sync Queue** | A local data structure used to store API requests (Create, Update, Delete) generated while the device is offline, to be processed when online. |
| **Conflict Resolution** | The logic applied when a record has been modified on two different devices before synchronization occurred (e.g., Last-Write-Wins or Manual Merge). |
| **Optimistic UI** | A frontend pattern where the interface updates immediately upon user action, anticipating a successful server response, to ensure a lag-free experience. |
| **RBAC** | Role-Based Access Control. A method of restricting network access based on the roles of individual users. |
| **JWT** | JSON Web Token. Used for securely transmitting information between the client and server. |
| **MVP** | Minimum Viable Product. |

## 1.4 References

The following documents and resources serve as references for this FRD:

1. **Reference Implementation:** Simple Time Tracker (Android).  
   * *Usage:* Defines the expected behavior for timers, charts, and categorization logic.  
2. **IEEE Std 830-1998:** IEEE Recommended Practice for Software Requirements Specifications (used as a structural guide).

## 1.5 Overview of Document

The remainder of this document is organized as follows:

* **Chapter 2** summarizes the business vision and objectives.  
* **Chapter 3** defines the system architecture, specifically addressing the Client-Server sync topology.  
* **Chapters 4 through 8** detail the specific functional requirements by module (IAM, Taxonomy, Time Tracking, Analytics, Settings).  
* **Chapter 9** specifies non-functional requirements, including specific constraints on sync latency and data integrity.  
* **Chapter 10** outlines data requirements and API constraints.

   
---

# Chapter 2: Executive Summary

## 2.1 Vision

The Time Tracker system is envisioned as a flexible, **self-hostable** productivity platform that extends the proven utility of the "Simple Time Tracker" mobile application. While the reference application focuses on single-device utility, this system provides a centralized environment where time tracking data is seamlessly synchronized across multiple interfaces (Web and Mobile), regardless of where the backend is hosted.

The core vision is to provide users with a "best of both worlds" experience: the speed and reliability of a local tool that functions anywhere, combined with the power of a centralized backend—whether that backend runs on a public cloud or a private home server—ensuring complete data sovereignty and accessibility.

## 2.2 Key Business Objectives

The development of this system is driven by the following strategic objectives:

### 2.2.1 Operational Continuity (Offline Mode)

**Objective:** To ensure users can track time, edit records, and manage tasks regardless of network availability. **Benefit:** Eliminates frustration caused by poor connectivity. Users working in remote locations can continue to work without interruption. Data captures locally and synchronizes automatically to the self-hosted instance once connectivity is restored.

### 2.2.2 Centralization and Synchronization

**Objective:** To eliminate data silos by migrating from purely local storage to a centralized server-side architecture. **Benefit:** Users can switch devices (e.g., from Mobile to Web) without manual data export/import. Running timers and historical records must eventually reflect the same state on all sessions once synchronization occurs.

### 2.2.3 Identity and Security

**Objective:** To implement a secure Identity and Access Management (IAM) system. **Benefit:** Unlike the reference app, which is open to anyone with physical device access, this system ensures data privacy through user authentication. It safeguards sensitive productivity data and allows for the distinction between individual user data and administrative oversight.

### 2.2.4 Deployment Flexibility

**Objective:** To decouple the system from proprietary cloud infrastructure. **Benefit:** The system shall be containerized (e.g., Docker) and lightweight, allowing users to self-host the application on any environment—from a low-cost VPS to a local Raspberry Pi or a corporate intranet server.

### 2.2.5 Administrative Control

**Objective:** To provide a comprehensive administration panel. **Benefit:** System administrators (or the self-hoster themselves) gain the ability to manage the platform's health, user base, and role assignments.

## 2.3 Target Audience

The system is designed to serve distinct user groups with specific needs:

| User Class | Description | Key Needs |
| :---- | :---- | :---- |
| **Self-Hosters / Privacy Advocates** | Users who prefer to own their data and run services on their own hardware. | Docker support, low resource usage, no external tracking dependencies, full data ownership. |
| **Productivity Enthusiasts** | Individuals practicing "Quantified Self" or time-blocking techniques. | Instant timer access, zero-latency UI (Optimistic updates), visual statistics. |
| **Freelancers / Contractors** | Professionals who track time for billing purposes. | Reliability (no data loss during network outages), accurate timestamping, CSV export. |
| **System Administrators** | Technical owners of the application instance. | User lifecycle management, system configuration. |

## 2.4 Assumptions and Dependencies

* **Hosting Environment:** The system assumes a standard runtime environment (e.g., Docker, Node.js, or Go) is available. It does **not** rely on platform-specific services (like AWS Lambda or Firebase) to ensure it can run on any server.  
* **Initial Connectivity:** While the app supports offline usage, an active network connection to the host server is assumed to be required for the **initial** account registration and first-time login on a new device.  
* **Synchronization Latency:** It is assumed that data consistency is "Eventual." While local updates are instant, reflection of that data on other devices depends on network availability and sync frequency.  
* **Reference Parity:** It is assumed that the visual logic (colors, icons, chart behaviors) will strictly follow the "Simple Time Tracker" design patterns unless technical constraints of the web platform or synchronization logic dictate otherwise.

   
---

# Chapter 3: System Architecture and Actors

## 3.1 High-Level System Architecture

The Time Tracker system follows a **Local-First, Cloud-Sync Hybrid Architecture**. The system is designed for maximum portability and maintainability, utilizing a unified frontend strategy and a flexible backend storage model.

The system consists of three primary layers:

### 3.1.1 The Client Layer (Unified Frontend)

To reduce development overhead and ensure feature parity, the system shall utilize a **Single Codebase** architecture (e.g., using a cross-platform framework) that compiles to both the Web Application and Native Mobile Applications.

* **Unified Logic:** The UI components, local database management, and synchronization logic are written once and shared across platforms.  
* **Platform Specifics:**  
  * **Web Client:** Deployed as a Responsive Web App.  
  * **Mobile Client:** Deployed as a Native App (iOS/Android) wrapping the shared core.  
* **Behavior:** Both platforms utilize **Optimistic UI** patterns, ensuring the interface updates immediately upon user input without waiting for server confirmation.  
* **Sync Engine:** A shared background process responsible for queueing local changes (Create, Update, Delete) and exchanging them with the server when connectivity is available.

### 3.1.2 The Application Server (Backend)

The Server acts as the central synchronization hub and authentication provider. It is designed to be lightweight and container-ready (e.g., Docker).

* **API Interface:** Exposes standard RESTful endpoints. This interface handles authentication, receives sync payloads, and serves aggregated data to clients.  
* **Business Logic Layer:**  
  * Validates incoming data integrity.  
  * Handles **Conflict Resolution** (managing scenarios where multiple devices modify the same record).  
  * Enforces Role-Based Access Control (RBAC).

### 3.1.3 The Data Layer (Persistence)

The system supports a pluggable database architecture to accommodate different hosting needs:

* **Production / Multi-User:** Supports standard Relational Databases (e.g., **PostgreSQL** or **MySQL**) for robust, high-concurrency environments.  
* **Lightweight / Development:** Supports **SQLite** (file-based) for easy deployment on low-resource hardware, single-user self-hosted instances, or development environments.  
* **Data Isolation:** Regardless of the database engine, the schema must enforce strict multi-tenancy, ensuring queries are always scoped to the authenticated user.

## 3.2 System Actors (User Roles)

The system employs Role-Based Access Control (RBAC) to define permissions.

### 3.2.1 Guest

A user who interacts with the system but has not established an identity.

* **Capabilities:** View Landing Page, Login, Register.  
* **Constraints:** Cannot access the dashboard or track time.

### 3.2.2 Standard User

The primary consumer of the application.

* **Capabilities:**  
  * **Offline Access:** Full ability to create/edit time records and manage categories while disconnected.  
  * **Time Tracking:** Start/Stop timers, create manual records.  
  * **Analytics:** View charts and export own data.  
* **Constraints:** Strictly limited to accessing their own data.

### 3.2.3 System Administrator (Instance Owner)

A privileged user responsible for the operational management of the instance.

* **Capabilities:**  
  * **User Management:** View registered users, ban/suspend users, delete users.  
  * **System Configuration:** Toggle registration (open/closed), manage SMTP settings.  
* **Platform Constraint:** **Administrative features are available exclusively on the Web Client.** The Mobile Client does not include administrative UI components.

### 3.2.4 System (Internal Actor)

Automated processes running on the server.

* **Capabilities:** Sending transactional emails (Welcome, Password Reset) and performing database maintenance (cleanup of soft-deleted records).

## 3.3 Permissions Matrix (High-Level)

| Function | Guest | Standard User | Administrator |
| :---- | :---: | :---: | :---: |
| Register / Login | ✅ | ❌ | ❌ |
| **Offline Data Entry** | ❌ | ✅ | ✅ |
| View Dashboard | ❌ | ✅ | ✅ |
| Create/Edit Time Records | ❌ | ✅ (Own Data) | ✅ (Own Data) |
| Manage Categories | ❌ | ✅ (Own Data) | ✅ (Own Data) |
| **Admin Panel Access** | ❌ | ❌ | ✅ (**Web Only**) |
| View User List | ❌ | ❌ | ✅ (**Web Only**) |
| Ban/Delete Users | ❌ | ❌ | ✅ (**Web Only**) |
| Change Global Settings | ❌ | ❌ | ✅ (**Web Only**) |

   
---

# Chapter 4: Module 1 — Identity and Access Management (IAM)

## 4.1 Overview

This module defines the requirements for user identification, authentication, and authorization. Given the **self-hosted** nature of the system, the IAM module must provide flexible security controls, allowing instance owners to define how strict the access requirements are (e.g., email verification, password complexity). Additionally, the system must support **offline session persistence**, ensuring that a lack of internet connectivity does not lock an authenticated user out of their local data.

## 4.2 User Registration

**ID: FR-IAM-01** The system shall manage the onboarding of new users.

* **FR-IAM-01.1:** The system shall provide a registration form requiring:  
  * Email Address (Must be unique within the instance).  
  * Password (Must meet the complexity requirements defined in FR-IAM-07).  
  * Confirm Password.  
* **FR-IAM-01.2 (Instance Security):** The system shall provide a global configuration (managed by the Administrator) to **Enable or Disable** public registration.  
  * If Disabled: The registration interface is inaccessible to new users.  
* **FR-IAM-01.3 (Email Verification):** The system shall support an "Account Verification" workflow.  
  * **Configuration:** The Administrator can Toggle this feature (Enable/Disable).  
  * **Logic:** If Enabled, a newly registered user is created in a "Pending" state. The system sends a verification link to the provided email. The user cannot log in until the link is clicked.  
  * **Dependency:** Requires valid SMTP settings. If SMTP is not configured, this feature should auto-disable or warn the Admin.  
* **FR-IAM-01.4:** The system shall hash the user's password using a secure, industry-standard cryptographic algorithm before storage. Plain text passwords must never be stored.

## 4.3 Authentication (Login)

**ID: FR-IAM-02** The system shall allow users to authenticate to access protected resources and synchronize data.

* **FR-IAM-02.1:** The system shall accept Email and Password as credentials.  
* **FR-IAM-02.2:** Upon successful authentication, the server shall issue a secure token pair (Access Token \+ Refresh Token) or a long-lived session token to the client.  
* **FR-IAM-02.3 (Offline Access):** The Client Application must verify the presence of a locally stored authentication token upon launch.  
  * If a token exists, the user is granted immediate access to the application’s Dashboard (Offline Mode).  
  * The app shall attempt to validate/refresh the token with the server in the background without blocking the UI.  
* **FR-IAM-02.4:** The system shall support a Logout function. This action must:  
  * Delete the local token from the device storage.  
  * Invalidate the session on the server.

## 4.4 Password Management

**ID: FR-IAM-03** The system shall provide mechanisms for credential updates.

* **FR-IAM-03.1 (Change Password):** The system shall allow authenticated users to change their password via the profile settings.  
* **FR-IAM-03.2 (Reset Password):** The system shall allow unauthenticated users to request a password reset via email (requires SMTP).  
* **FR-IAM-03.3 (Admin Override):** The Administrator shall have the ability to manually reset a user's password via the Admin Panel (useful for self-hosted instances without SMTP configured).

## 4.5 Role Management (RBAC) & Bootstrapping

**ID: FR-IAM-04** The system shall restrict access to resources based on the user's assigned role and handle initial setup.

* **FR-IAM-04.1 (System Bootstrap):** Upon the very first startup of the application instance (if the database is empty):  
  * The system shall automatically create a default **Administrator** account (e.g., `admin@local.host`).  
  * The system shall generate a random, secure temporary password.  
  * This password must be output to the **Server Logs** (stdout) for the host to retrieve.  
* **FR-IAM-04.2 (First Login Enforcement):** When the default Administrator logs in with the generated password, the system must force a **Password Change** before allowing access to the dashboard.  
* **FR-IAM-04.3:** The system shall support two distinct roles:  
  * **Standard User:** Access to own data only.  
  * **Administrator:** Access to system configuration, user management, and global settings.  
* **FR-IAM-04.4:** The Web Client shall dynamically hide/show the "Admin Panel" link based on the logged-in user's role.

## 4.6 Account Management & Deletion

**ID: FR-IAM-05** The system shall manage the lifecycle of the user account.

* **FR-IAM-05.1 (Self-Deletion):** A Standard User shall have the option to delete their own account. This triggers a permanent removal of data from the server.  
* **FR-IAM-05.2 (Admin Management):** An Administrator shall have the ability to Ban (suspend access) or Delete other users via the Web Interface.

## 4.7 Security Configuration (Password Policy)

**ID: FR-IAM-07** The system shall allow the Administrator to define security standards for the instance.

* **FR-IAM-07.1 (Complexity Rules):** The Admin Panel shall provide settings to define the required Password Pattern for all users. Configurable parameters include:  
  * Minimum Length (Default: 8).  
  * Require Uppercase Letters (e.g., Minimum 2).  
  * Require Special Characters (e.g., Minimum 1).  
  * Require Numbers.  
* **FR-IAM-07.2 (Enforcement):** These rules shall be enforced during:  
  * New User Registration.  
  * Password Change actions.  
  * Password Reset actions.

## 4.8 Session Management

**ID: FR-IAM-06** The system shall manage the user's connectivity state securely.

* **FR-IAM-06.1 (Token Strategy):**  
  * **Access Token:** Short lifespan (e.g., 15-60 minutes). Used to authorize API requests.  
  * **Refresh Token:** Long lifespan (e.g., 30 days). Used to acquire new Access Tokens silently.  
*   
* **FR-IAM-06.2 (Secure Storage):** Tokens must be stored using platform-best practices to prevent extraction:  
  * **Web Client:** HttpOnly / Secure Cookies (preferred) or LocalStorage.  
  * **Mobile Client:** Encrypted KeyStore (Android) or Keychain (iOS).  
*   
* **FR-IAM-06.3 (Refresh Mechanism):** The client shall automatically attempt to refresh the session when the Access Token expires. If the Refresh Token is invalid or expired (and the device is online), the user is redirected to the Login screen.  
* **FR-IAM-06.4 (Security Invalidation):** If a user changes their password, the system must invalidate all existing Refresh Tokens associated with that user account. This forces all other active sessions (e.g., on other devices) to re-authenticate upon their next server contact.

---

# Chapter 5: Module 2 — Taxonomy and Configuration

## 5.1 Overview

This module defines the requirements for how users organize their time data. While the core function is tracking time, the value is derived from how that time is categorized. This module replicates the flexible taxonomy of the reference Android application but adapts it for a multi-device environment.

**Key Architectural Constraint:** Taxonomy data (Categories, Tags, Rules) creates the context for time tracking. Therefore, this data must be fully available **offline** on the client device. Changes made to the taxonomy on one device must propagate to others during synchronization to ensure reporting consistency.

## 5.2 Category Management

**ID: FR-TAX-01** The system shall allow users to create and manage high-level classifications for their activities.

* **FR-TAX-01.1 (Create):** The system shall allow the user to create a new Category defined by:  
  * **Name:** (Required, e.g., "Work", "Fitness"). Max 50 characters.  
  * **Color:** (Required) A HEX color code. The Unified Frontend must provide a consistent color picker across Web and Mobile.  
  * **Icon:** (Optional) An icon selected from a standardized vector library (e.g., Material Icons) available within the app bundle.  
* **FR-TAX-01.2 (Offline Creation):** Users shall be able to create categories while offline. The system must assign a temporary or UUID-based identifier to the category immediately to allow time records to be assigned to it before the server acknowledges the creation.  
* **FR-TAX-01.3 (Update):** The system shall allow the user to modify the Name, Color, or Icon of an existing category.  
  * *Visual Consistency:* These changes must retroactively update the visual representation of historical records in the UI (e.g., old "Work" records change from Red to Blue).  
* **FR-TAX-01.4 (Delete strategy):** The system shall allow the user to delete a category.  
  * *Constraint:* If the category contains existing Time Records, the system must force a decision:  
    * **Delete All:** Remove the category and all associated time records.  
    * **Migrate:** Move all associated records to a different existing category.  
* **FR-TAX-01.5 (Default Data):** Upon the creation of a new user account, the system shall bootstrap the user's database with a set of default categories (e.g., "Work", "Sleep", "Transport") to facilitate immediate usage.

## 5.3 Tag Management

**ID: FR-TAX-02** The system shall allow users to create granular labels (Tags) that can be attached to records.

* **FR-TAX-02.1:** The system shall allow the creation of Tags defined by a Name (Required).  
* **FR-TAX-02.2:** Tags shall be **Global** by default (usable across any Category) to allow for cross-functional analysis (e.g., a "Deep Work" tag could apply to both "Job" and "Personal Projects" categories).  
* **FR-TAX-02.3:** A single Time Record may support multiple Tags (Many-to-Many relationship).  
* **FR-TAX-02.4:** Tags must be searchable and selectable via an autocomplete interface in the Unified Frontend.

## 5.4 Goals and Limits

**ID: FR-TAX-03** The system shall allow users to define targets for their time usage.

* **FR-TAX-03.1:** The system shall allow the user to set a **Duration Goal** for a specific Category or Tag.  
  * *Target:* (e.g., "At least 8 Hours")  
  * *Limit:* (e.g., "Max 1 Hour")  
* **FR-TAX-03.2 (Periodicity):** Goals shall be definable on a Daily, Weekly, or Monthly basis.  
* **FR-TAX-03.3 (Visual Feedback):** The Client Application must track progress against these goals in real-time using local data.  
  * *Example:* A progress bar in the dashboard that fills up as the timer runs.  
* **FR-TAX-03.4 (Timezone Awareness):** Daily goals must reset based on the **User's configured Timezone**, not UTC. If the user has not configured a timezone, the client device's local time is used as the default fallback.

## 5.5 Automation Rules (Smart Categorization)

**ID: FR-TAX-04** The system shall provide logic to automate categorization based on context.

* **FR-TAX-04.1:** The system shall allow users to define "If-Then" rules.  
  * *Trigger:* Time of day (e.g., 09:00 \- 17:00).  
  * *Trigger:* Day of week (e.g., Monday-Friday).  
  * *Action:* Suggest or auto-select a specific Category (e.g., "Work") when a new timer is started during this window.  
* **FR-TAX-04.2 (Client-Side Execution):** These rules must be stored in the user's configuration and synced to all devices. The **evaluation** of the rule happens on the Client Device at the moment the user presses "Start."  
  * *Benefit:* Automation works even if the user is offline.  
* **FR-TAX-04.3:** Users shall be able to toggle these rules On/Off without deleting the configuration.

## 5.6 Data Validation and Constraints

**ID: FR-TAX-05** The system shall enforce logical constraints on configuration data to maintain sync integrity.

* **FR-TAX-05.1 (Uniqueness):** Category and Tag names must be unique per user (case-insensitive).  
  * *Sync Conflict:* If a user creates "Gym" on Mobile and "GYM" on Web while offline, the Sync Engine must detect this collision upon reconnection and merge them (or prompt the user).  
* **FR-TAX-05.2 (Sanitization):** All text inputs (Names) must be sanitized to prevent injection attacks (XSS/SQLi) before being stored or synced.  
* **FR-TAX-05.3 (Color Validity):** The system must ensure a valid Hex color is always assigned. If a user does not select one, a random color from a predefined safe palette is assigned.

---

# Chapter 6: Module 3 — Time Tracking Core

## 6.1 Overview

This module details the primary function of the application: the creation and management of time records. The system shall support two distinct methods of data entry: **Real-time Tracking** (stopwatch) and **Manual Entry** (logging history).

**Architectural Constraint:** Time tracking must be resilient. A user starting a timer on a subway train (Offline) must have that action preserved and eventually propagated to their desktop when they regain connectivity. To achieve this, all records are identified by client-generated UUIDs, and timestamps are captured based on the **User's Device Time** (normalized to UTC) at the moment of interaction.

## 6.2 Real-Time Tracking (Running Timers)

**ID: FR-CORE-01** The system shall allow users to track activity duration in real-time.

* **FR-CORE-01.1 (Start):** The system shall allow the user to start a new timer.  
  * **Timestamp:** The "Start Time" is recorded immediately using the local device clock.  
  * **State:** The timer state is saved to the Local Database immediately.  
  * **Optimistic UI:** The UI begins counting up immediately (00:00:01...) without waiting for server confirmation.  
* **FR-CORE-01.2 (Visual Feedback):** While a timer is active, the interface (Mobile and Web) shall display the elapsed duration.  
* **FR-CORE-01.3 (Concurrency & Single Active Timer):** The system supports **Single Active Timer** logic by default.  
  * If User A starts Timer Y while Timer X is running:  
    1. The system automatically Stops Timer X (End Time \= Now).  
    2. The system Starts Timer Y.  
  * *Conflict Note:* If this happens on two offline devices simultaneously, the system will eventually show two records for that period. The user can manually resolve overlap later, but data is never automatically deleted to "fix" overlaps.  
* **FR-CORE-01.4 (Stop):** The user stops the running timer.  
  * The "End Time" is recorded.  
  * The Running Timer entity is converted into a completed Time Record.  
  * The sync engine queues this "Update" event.  
* **FR-CORE-01.5 (Persistence):** Running timers must persist across app restarts. If the mobile battery dies while a timer is running, restarting the app should show the timer still running (calculated from the original Start Time).

## 6.3 Manual Data Entry

**ID: FR-CORE-02** The system shall allow users to log activities that occurred in the past.

* **FR-CORE-02.1:** The system shall provide a "Add Record" interface requiring:  
  * Category (Selected from local taxonomy).  
  * Start Date & Time.  
  * End Date & Time.  
  * Tags (Optional).  
  * Description/Note (Optional).  
* **FR-CORE-02.2 (Validation):** The system must enforce that End Time \> Start Time. Negative durations are not permitted.  
* **FR-CORE-02.3:** The Duration is calculated automatically as `End - Start`.

## 6.4 Record Management (CRUD)

**ID: FR-CORE-03** The system shall allow users to modify historical data.

* **FR-CORE-03.1 (Edit):** The user can update any attribute of an existing record.  
  * *Sync Logic:* An edit operation sends a "Patch" request to the server.  
* **FR-CORE-03.2 (Delete):** The user can permanently remove a record.  
  * *Sync Logic:* This performs a "Soft Delete" locally (marking it as `deleted_at: timestamp`) so the deletion can be synced to the server. Once the server confirms the deletion, the record is removed from local storage.  
* **FR-CORE-03.3 (Split):** The system shall provide a function to split one record into two.  
  * Input: A split timestamp.  
  * Result: The original record is updated (new end time), and a NEW record is created (new start time).  
* **FR-CORE-03.4 (Merge):** The system shall provide a function to merge adjacent records.  
  * Condition: Records must be sequential or overlapping.

## 6.5 Data Export (CSV)

**ID: FR-CORE-04** The system shall allow users to extract their raw data.

* **FR-CORE-04.1:** The system shall generate a CSV file locally on the client device (using the local database data).  
  * *Benefit:* Export works offline.  
* **FR-CORE-04.2:** The user can filter the export by Date Range.  
* **FR-CORE-04.3:** The CSV schema shall include: ID, Category, Tags, Start Time (ISO 8601), End Time, Duration (Seconds), Note.

## 6.6 Synchronization and Conflict Resolution

**ID: FR-CORE-05** The system shall ensure data consistency across devices.

* **FR-CORE-05.1 (Source of Truth):**  
  * The **Server** is the ultimate authority for ID mapping, but the **Client** is the authority for User Actions.  
* **FR-CORE-05.2 (Running Timer Sync):**  
  * When a timer is Started on Device A, this state is pushed to the server.  
  * Device B polls (or receives a push) regarding the active state.  
  * Device B updates its UI to show "Timer Running (Started on Device A)."  
* **FR-CORE-05.3 (Conflict Strategy):**  
  * **Scenario:** Device A edits Record \#1 at 10:00 AM (Offline). Device B edits Record \#1 at 10:05 AM (Online). Device A goes online at 10:10 AM.  
  * **Resolution:** The system applies a **"Last Client Timestamp Wins"** logic. The edit made at 10:05 AM (Device B) is considered the latest user intent, *unless* Device A's local timestamp for the edit was actually 10:06 AM (even if synced later).  
  * *Fallback:* If the logic cannot be determined automatically, both versions are kept, and the user is flagged to resolve the duplicate/conflict.  
* **FR-CORE-05.4 (Identification):** All records created offline are assigned a temporary UUID. Upon sync, the server may assign a permanent ID or confirm the UUID as the permanent ID (depending on DB implementation). The client must update its local mapping if the ID changes.

---

# Chapter 7: Module 4 — Analytics and Visualization

## 7.1 Overview

This module defines the requirements for transforming raw time records into actionable insights. To balance device storage limits with reporting depth, the system employs a **Hybrid Data Strategy**:

* **Server-Side Analytics:** Deep historical analysis, aggregation, and complex charting are performed by the server or fetched from the server on-demand.  
* **Local Cache (Hot Data):** The client device retains full fidelity data for the **most recent 7 days**. This allows for immediate, offline access to the "Timeline View" for the current week, while older data is offloaded to the server to save local storage space.

## 7.2 The Dashboard

**ID: FR-ANA-01** The system shall provide a landing view (Dashboard) that offers an immediate snapshot of current performance.

* **FR-ANA-01.1 (Today's Summary):** The dashboard shall display the "Total Time Tracked" for the current day, calculated from the Local Cache.  
* **FR-ANA-01.2 (Active Activity):** If a timer is running, the dashboard must prominently display the active Category, elapsed time, and a "Stop" button.  
* **FR-ANA-01.3 (Recent History):** The most recent records (from the last 7 days) are displayed from local storage.  
* **FR-ANA-01.4 (Quick Stats):** A simplified daily breakdown for "Today" is generated locally.

## 7.3 Statistical Charts (Server-Driven)

**ID: FR-ANA-02** The system shall provide a dedicated "Statistics" view. Because statistical analysis may span months or years, these visualizations rely on server-side data fetching.

* **FR-ANA-02.1 (Data Fetching):** When the user accesses the "Statistics" tab:  
  * **Online:** The client requests aggregated data (JSON) from the server for the selected range.  
  * **Offline:** The system displays a "Connect to internet to view historical statistics" message, or serves data strictly limited to the cached 7-day window.  
* **FR-ANA-02.2 (Chart Types):**  
  * **Pie Chart:** Distribution of time by Category.  
  * **Bar Chart:** Trends of duration over days/weeks.  
  * **Line Chart:** Progress trends for specific goals.

## 7.4 Data Filtering & Saved Views

**ID: FR-ANA-03** The system shall allow users to customize reporting scopes and save their preferences.

* **FR-ANA-03.1 (Time Range):** Predefined ranges (Today, Week, Month, Year) and Custom Date Pickers.  
* **FR-ANA-03.2 (Attribute Filters):** Users can filter by Category or Tag.  
* **FR-ANA-03.3 (Text Filter):** Users can filter records by **Name/Description** (e.g., "Show all records containing 'Project X'").  
* **FR-ANA-03.4 (Predefined Filters / Saved Views):**  
  * The system shall allow users to **Save** a specific combination of filters (e.g., "Category: Work" \+ "Tag: Deep Work").  
  * The system shall provide a list of these "Saved Filters" for one-click access.  
  * *Default Filters:* The system comes with "Work Only" and "Personal Only" defaults if applicable.

## 7.5 Timeline View (Local & Offline)

**ID: FR-ANA-04** The system shall provide a chronological visualization of the day, optimized for recent history.

* **FR-ANA-04.1 (Caching Policy):** The Client Application shall maintain a **7-Day Rolling Cache** of detailed time records stored locally.  
  * *Constraint:* Accessing the Timeline for a date older than 7 days requires a network request to fetch that day's data.  
* **FR-ANA-04.2 (Offline Availability):** Users must be able to view, scroll, and interact with the Timeline for the **current week** (Today \+ past 6 days) while completely offline.  
* **FR-ANA-04.3 (Visualization):**  
  * Vertical/Horizontal rendering of the 24-hour day.  
  * Visual "Gaps" for untracked time.  
  * Visual indicators for overlapping records.

## 7.6 Reporting Logic

**ID: FR-ANA-05** The system shall handle data aggregation logic.

* **FR-ANA-05.1 (Server Aggregation):** For heavy queries (e.g., "Last Year's Stats"), the server performs the `SUM()` and `GROUP BY` operations and sends lightweight JSON results to the client, rather than sending thousands of raw records.  
* **FR-ANA-05.2 (Visual Splitting):** The visualization layer (both Client timeline and Server charts) must logically split records that span across midnight (e.g., 11 PM to 1 AM counts as 1hr Today, 1hr Tomorrow).  
* **FR-ANA-05.3 (Timezone Normalization):**  
  * **Local Timeline:** Renders based on Device Time.  
  * **Server Charts:** The client must send the User's Current Timezone (e.g., `America/New_York`) in the API request so the server can aggregate "Days" correctly relative to the user.

---

# Chapter 8: Module 5 — Application Settings and Synchronization

## 8.1 Overview

This module encompasses the configuration options available to the user to customize their experience, as well as the technical behaviors required to maintain state consistency across the Web and Mobile platforms.

Crucially, this module defines the **Synchronization Strategy** that bridges the gap between the Offline-Capable Client (with its 7-day cache) and the Central Server (the complete history).

## 8.2 Application Interface Settings

**ID: FR-SET-01** The system shall allow users to personalize the visual presentation of the application.

* **FR-SET-01.1 (Theme):** Support for Dark Mode, Light Mode, and System Default.  
* **FR-SET-01.2 (Localization):**  
  * **Language:** The UI must support multiple languages.  
  * **Time Format:** Users can toggle between 12-hour (AM/PM) and 24-hour clock formats. This setting applies to the Timeline View and Input fields.  
* **FR-SET-01.3 (Start of Week):** Users can define the first day of the week (e.g., Monday vs. Sunday) for statistical aggregation.

## 8.3 Notification Settings

**ID: FR-SET-02** The system shall provide configurable alerts.

* **FR-SET-02.1 (Timer Reminders):** Local notifications triggered if a timer exceeds a specific duration (e.g., "Timer running \> 4 hours").  
* **FR-SET-02.2 (Goal Alerts):** Local notifications when a daily Goal is reached.  
* **FR-SET-02.3 (Sync Alerts):**  
  * **Sync Failure:** If the app has been unable to sync with the server for \> 24 hours (while the device has a network connection), a warning notification should appear.

## 8.4 Synchronization Logic (The Sync Engine)

**ID: FR-SET-03** The system shall ensure data remains consistent between the Local Cache and the Server.

* **FR-SET-03.1 (Sync Frequency):**  
  * **Background Sync:** The app shall attempt to sync every X minutes (e.g., 15 mins) when the app is in the background.  
  * **Foreground Sync:** The app shall trigger an immediate sync upon App Launch and Resume.  
  * **Event-Driven:** Every "Stop Timer" or "Save Record" action triggers an immediate attempt to push changes.  
* **FR-SET-03.2 (Data Retention / Caching Policy):**  
  * **Local Storage Limit:** To keep the mobile app lightweight, the Local Database shall strictly maintain full details for the **last 7 days** (Rolling Window).  
  * **Pruning:** During a successful sync, records older than 7 days are confirmed as "Safe on Server" and then purged from the Local Database.  
  * **Fetch on Demand:** If the user scrolls back to a date \> 7 days ago in the Timeline, the app performs a temporary fetch for that specific day's data.  
* **FR-SET-03.3 (Conflict Resolution \- Last Client Timestamp):**  
  * If a record is modified on two devices, the server compares the `updated_at` timestamp **generated by the client device**.  
  * The latest timestamp wins.  
* **FR-SET-03.4 (Server Connectivity):**  
  * The Settings menu must display a "Sync Status" indicator (e.g., "Last Synced: 2 mins ago" or "Offline").

## 8.5 Data Maintenance & Privacy

**ID: FR-SET-04** The system shall provide tools for data hygiene and portability.

* **FR-SET-04.1 (Export All):** A global "Export Data" button.  
  * *Source:* This request is processed by the **Server**, which generates a full history CSV/JSON file and sends a download link to the user (bypassing the 7-day local limit).  
* **FR-SET-04.2 (Reset Local Cache):** A "Troubleshooting" option to wipe the local database and re-fetch the fresh 7-day window from the server.  
* **FR-SET-04.3 (Delete Account):** As defined in IAM, this permanently removes all data from the Server.

## 8.6 Admin / Self-Hosted Configuration (Web Only)

**ID: FR-SET-05** Configuration specific to the instance owner.

* **FR-SET-05.1 (Registration):** Toggle "Allow Public Registration" On/Off.  
* **FR-SET-05.2 (SMTP Settings):** Configure Host, Port, User, and Password for transactional emails (Password Reset/Verification).  
* **FR-SET-05.3 (System Logs):** View a basic log of system events (User Logins, Sync Errors, Warnings).

---

# Chapter 9: Non-Functional Requirements (NFR)

## 9.1 Overview

This chapter defines the quality attributes, performance constraints, and high-level standards that the system must adhere to. These requirements ensure the system is usable, secure, and scalable, whether hosted on a powerful cloud cluster or limited consumer hardware.

## 9.2 Security Requirements

**ID: NFR-SEC** The system must protect user data and maintain the integrity of the application.

* **NFR-SEC-01 (Encryption):** All data transmitted between the Client and the Server must be protected using secure, encrypted communication channels to prevent interception.  
* **NFR-SEC-02 (Credential Storage):** User passwords must never be stored in plain text. They must be protected using strong, industry-standard irreversible hashing algorithms.  
* **NFR-SEC-03 (Data Isolation):** The system must enforce strict logical separation of data. It must be impossible for an authenticated user to access, view, or modify data belonging to another user through API manipulation.  
* **NFR-SEC-04 (Abuse Prevention):** The API must implement mechanisms to detect and mitigate abusive traffic patterns (e.g., rate limiting) to protect the availability of self-hosted instances.  
* **NFR-SEC-05 (Input Validation):** All user-supplied input must be validated and sanitized to prevent common injection attacks and malicious payload execution.

## 9.3 Performance Requirements

**ID: NFR-PERF** The system must provide a responsive user experience.

* **NFR-PERF-01 (Responsiveness):** Critical user actions (e.g., Starting/Stopping a timer) must provide immediate visual feedback to the user, regardless of network latency or background processing status.  
* **NFR-PERF-02 (Startup Speed):** The Mobile Client must load the Dashboard and become interactive within a minimal timeframe appropriate for a productivity tool (e.g., under 1.5 seconds) using cached data.  
* **NFR-PERF-03 (Sync Latency):** When connectivity is available, data changes made on one device should propagate to other active devices within a reasonable timeframe (e.g., near real-time) to ensure workflow continuity.  
* **NFR-PERF-04 (Efficiency):** The Client Application must minimize battery and data consumption by optimizing background synchronization processes.

## 9.4 Scalability and Hosting

**ID: NFR-HOST** The system must be lightweight and portable to support self-hosting.

* **NFR-HOST-01 (Portability):** The backend system must be packaged in a format that supports standard containerization technologies, allowing deployment on diverse operating systems without complex dependency management.  
* **NFR-HOST-02 (Resource Efficiency):** The application server must be designed to operate efficiently on low-resource hardware (e.g., consumer-grade servers or single-board computers) without excessive memory or CPU consumption.  
* **NFR-HOST-03 (Storage Flexibility):** The system must support abstraction for the data storage layer, allowing the use of different database technologies suited for either single-user lightweight setups or multi-user production environments.

## 9.5 Reliability and Availability

**ID: NFR-REL** The system must remain robust during network instability.

* **NFR-REL-01 (Offline Continuity):** The system must remain fully functional during network outages. Synchronization failures must be handled gracefully with automatic retry mechanisms.  
* **NFR-REL-02 (Conflict Preservation):** In the event of a data synchronization conflict that cannot be resolved automatically by business logic, the system must prioritize data safety, preserving conflicting versions rather than overwriting data without user confirmation.

## 9.6 Usability and Accessibility

**ID: NFR-USE** The system must be easy to use.

* **NFR-USE-01 (Interface Adaptability):** The Web Interface must automatically adapt its layout and functionality to suit the screen size and input method of the device (Mobile, Tablet, or Desktop).  
* **NFR-USE-02 (Accessibility Standards):** The interface should adhere to recognized accessibility standards (e.g., WCAG) to ensure usability for individuals with disabilities, including proper contrast and navigation support.  
* **NFR-USE-03 (Workflow Efficiency):** Critical productivity actions must require minimal user interaction steps to perform.

## 9.7 Compliance

**ID: NFR-COMP**

* **NFR-COMP-01 (Data Sovereignty):** The system must provide mechanisms for users to extract their complete dataset in a standard, machine-readable format.  
* **NFR-COMP-02 (Data Erasure):** The system must support the permanent removal of all personally identifiable information and user-generated content upon account deletion.

## 9.8 Operations and Monitoring

**ID: NFR-OPS** The system must provide observability tools for the instance administrator to ensure health and diagnose issues.

* **NFR-OPS-01 (Backend Log Aggregation):** The Application Server must output structured operational logs (Access Logs, Application Errors, System Events) to standard output streams. This allows container orchestration tools or external agents to capture and aggregate logs without proprietary configuration.  
* **NFR-OPS-02 (Client-Side Error Reporting):** The Web and Mobile clients must include a mechanism to catch unhandled exceptions (crashes).  
  * *Connectivity:* If online, the error stack trace is reported to the server immediately.  
  * *Offline:* The error is queued locally and transmitted to the server upon reconnection.  
* **NFR-OPS-03 (Health Supervision):** The system must expose dedicated "Health Check" endpoints (e.g., Liveness and Readiness probes) to allow monitoring tools to verify that the API and Database connections are active and responsive.  
* **NFR-OPS-04 (Log Privacy):** The logging system must automatically redact sensitive information (e.g., Passwords, Auth Tokens, PII) before writing to the logs to ensure that administrative review of logs does not compromise user security.

   
---

# Chapter 10: Data Requirements

## 10.1 Overview

This chapter specifies the logical data model, persistence rules, and the standard formats required for data exchange.

**Architectural Context:** The system operates on a **Master-Replica** model.

* **The Server Database:** Acts as the "Master" and "Source of Truth," storing the complete history of all data indefinitely (unless deleted). It must be agnostic to the underlying engine (supporting SQLite, PostgreSQL, or MySQL via abstraction).  
* **The Client Database:** Acts as a partial "Replica," storing a **7-Day Rolling Window** of data for performance and offline access, plus any unsynced changes.

## 10.2 Data Entities (Conceptual Schema)

**ID: DATA-MODEL** The system shall maintain the following core entities. All entities must use **UUIDs (Universally Unique Identifiers)** as Primary Keys to enable offline generation without collision.

### 10.2.1 User

Represents an identity within the system.

* **Attributes:** `User_UUID` (PK), `Email`, `Password_Hash`, `Role` (Standard/Admin), `Timezone` (e.g., "America/New\_York"), `Is_Verified` (Boolean), `Created_At`.  
* **Purpose:** Stores authentication data and preferences. The `Timezone` is critical for accurate server-side daily aggregation.

### 10.2.2 Category

A classification bucket for time records.

* **Attributes:** `Category_UUID` (PK), `User_UUID` (FK), `Name`, `Hex_Color`, `Icon_ID`, `Is_Deleted` (Boolean), `Last_Modified_At`.  
* **Constraint:** `User_UUID` \+ `Name` must be unique among active (non-deleted) categories.

### 10.2.3 Tag

A granular label.

* **Attributes:** `Tag_UUID` (PK), `User_UUID` (FK), `Name`, `Is_Deleted` (Boolean).

### 10.2.4 Time Record

A completed or active block of tracked time.

* **Attributes:** `Record_UUID` (PK), `User_UUID` (FK), `Category_UUID` (FK), `Start_Timestamp` (UTC), `End_Timestamp` (UTC, Nullable), `Duration` (Computed), `Note` (Text), `Is_Deleted` (Boolean), `Last_Modified_At` (UTC).  
* **Sync Logic:** `End_Timestamp` being NULL indicates a **Running Timer**.

### 10.2.5 Sync Queue (Client-Side Only)

A local structure used to track changes made while offline.

* **Attributes:** `Operation_Type` (CREATE, UPDATE, DELETE), `Entity_Type` (Record, Category), `Entity_UUID`, `Payload` (JSON), `Timestamp`.

## 10.3 Data Integrity and Synchronization Rules

**ID: DATA-INT** The database must enforce strict rules to maintain data quality across distributed devices.

* **DATA-INT-01 (UUID Strategy):** Clients shall generate UUIDs (v4) locally when creating new Records, Categories, or Tags. The Server accepts these UUIDs. This prevents the need for a server round-trip just to get an ID.  
* **DATA-INT-02 (Soft Deletes):** To ensure deletions propagate to other devices, records must not be physically removed from the Server immediately.  
  * **Action:** Setting `Is_Deleted = True` and updating `Last_Modified_At`.  
  * **Sync:** When other clients pull updates, they receive this "Tombstone" and remove the item from their local UI/Storage.  
* **DATA-INT-03 (Timezone Normalization):**  
  * **Storage:** All timestamps (Start/End) must be stored in **UTC**.  
  * **Display:** The Client converts UTC to the user's Local Device Time.  
  * **Aggregation:** Server-side reports convert UTC to the `User.Timezone` before grouping by "Day."  
* **DATA-INT-04 (Referential Integrity):** The database schema must enforce Foreign Keys (e.g., A Record cannot exist without a User).

## 10.4 Data Retention and Archiving

**ID: DATA-RET**

* **DATA-RET-01 (Server Retention):** The Server retains user data indefinitely to serve as the backup and history provider.  
* **DATA-RET-02 (Client Pruning):** The Client Application shall enforce a **7-Day Retention Policy** for "Time Record" entities to minimize local storage usage.  
  * *Logic:* On successful sync, records with `End_Timestamp < (Now - 7 Days)` are purged from local storage, provided they are confirmed saved on the Server.  
  * *Exception:* Metadata (Categories, Tags) are always kept locally to ensure the user can categorize new inputs.  
* **DATA-RET-03 (Hard Delete):** Upon "Account Deletion," the Server must perform a physical `DELETE` of all rows associated with the `User_UUID`.

## 10.5 API Interface Standards

**ID: DATA-API** The Client-Server communication shall adhere to strict formatting standards.

* **DATA-API-01 (Protocol):** The API shall be **RESTful**, utilizing standard HTTP verbs (GET, POST, PUT, PATCH, DELETE).  
* **DATA-API-02 (Format):** All request bodies and response payloads shall be strictly formatted as **JSON**.  
* **DATA-API-03 (Date Standard):** All timestamps transmitted via API must follow the **ISO 8601** standard (e.g., `2023-10-27T14:30:00Z`).  
* **DATA-API-04 (Pagination):** Endpoints returning lists (e.g., `GET /api/v1/records`) must support pagination (Limit/Offset or Cursor-based) to prevent memory overload on the self-hosted server when fetching large histories.  
* **DATA-API-05 (Error Responses):** Errors must return a structured JSON object containing:  
  * `error_code`: Machine-readable string (e.g., `AUTH_INVALID_TOKEN`).  
  * `message`: Human-readable description.  
  * `details`: Optional field for validation errors.