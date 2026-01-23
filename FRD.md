# Functional Requirements Document: Structure Overview

## Chapter 1: Introduction

**1.1 Purpose:** Defines the objective of this document, which is to specify the behavioral and data requirements for the "Cloud Time Tracker" system. **1.2 Scope:** Delineates what the system will and will not do. It establishes the boundary between the web/mobile clients and the backend services. **1.3 Definitions and Acronyms:** A glossary of technical terms (e.g., RBAC, JWT, CRUD, Timer, Record) used throughout the document. **1.4 References:** Lists external dependencies, including the original "Simple Time Tracker" codebase (as a functional reference) and UI design systems.

## Chapter 2: Executive Summary

**2.1 Vision:** A high-level description of the product as a cross-platform (Web & Mobile) productivity tool that brings granular time tracking to the cloud. **2.2 Key Business Objectives:**

* Migrate local-only features to a synchronized cloud environment.  
* Enable multi-device usage for a single user.  
* Provide administrative oversight via role management. **2.3 Target Audience:** Productivity enthusiasts, freelancers, and system administrators.

## Chapter 3: System Architecture and Actors

**3.1 High-Level Architecture:** Describes the client-server model.

* **Clients:** Mobile App (iOS/Android), Web App (React/Vue/Angular).  
* **Server:** RESTful/GraphQL API, Relational Database. **3.2 User Roles (Actors):**  
* **Guest:** Unauthenticated user (limited to landing page/login).  
* **Standard User:** Registered user with access to their own private time data.  
* **Administrator:** Elevated user with access to system health, user management, and global configurations. **3.3 Data Isolation:** Defines the requirement that Standard Users cannot access other users' records (Multi-tenancy logic).

## Chapter 4: Module 1 — Identity and Access Management (IAM)

*This chapter details the new requirements not present in the original clone.* **4.1 Registration:** Requirements for sign-up (Email/Password, OAuth providers). **4.2 Authentication:** Login processes, session management (Token/JWT), and "Remember Me" functionality. **4.3 Password Management:** Password reset flows (email links) and change password functionality. **4.4 Role Management (RBAC):** Logic for assigning roles and checking permissions (e.g., Only Admins can view the User List). **4.5 Account Deletion:** GDPR-compliant "Right to be forgotten" functionality.

## Chapter 5: Module 2 — Taxonomy and Configuration

**5.1 Categories:** Requirements for creating, editing, and deleting activity categories (e.g., "Work," "Sleep"). **5.2 Visualization Attributes:** Assigning colors (Hex codes) and icons (Emoji/Vector) to categories. **5.3 Tags:** Requirements for creating sub-labels (Tags) and associating them with categories. **5.4 Goals:** Setting target durations for specific categories (e.g., "Work 8 hours/day"). **5.5 Complex Rules:** Logic for automated categorization or validation rules based on time or context.

## Chapter 6: Module 3 — Time Tracking Core

**6.1 Running Timers:**

* Start/Stop mechanics.  
* Handling multiple simultaneous timers (if supported) or enforcing single active timer constraints.  
* Notification triggers when a timer is running. **6.2 Manual Entry:** Creating past records by selecting start time, end time, and category. **6.3 Record Manipulation:**  
* Editing duration, timestamps, and assigned tags of existing records.  
* Merging two overlapping or adjacent records. **6.4 CSV Export:** Generating downloadable reports of time data.

## Chapter 7: Module 4 — Analytics and Visualization

**7.1 Dashboard:** The landing view summarizing the current day's activity. **7.2 Statistical Charts:**

* **Pie Charts:** Distribution of time per category/tag.  
* **Bar Charts:** Comparison of duration over days/weeks/months. **7.3 Filtering:** Requirements for filtering data by custom date ranges (e.g., "Last 7 days") and specific categories. **7.4 Timeline View:** A linear visualization of the day's records (Chronological list).

## Chapter 8: Module 5 — Application Settings and Synchronization

**8.1 Interface Settings:** Dark/Light mode toggles, Language selection (Localization). **8.2 Notification Settings:** Configuring push notifications for timer reminders or goal achievements. **8.3 Synchronization Logic:** Requirements for conflict resolution when data changes on Mobile and Web simultaneously (e.g., "Last Write Wins").

## Chapter 9: Non-Functional Requirements (NFR)

**9.1 Security:** Data encryption in transit (HTTPS) and at rest, password hashing standards (e.g., Argon2/Bcrypt). **9.2 Performance:** API response time limits (e.g., \<200ms) and app load times. **9.3 Scalability:** Ability to support concurrent users. **9.4 Availability:** Uptime requirements (e.g., 99.9%).

## Chapter 10: Data Requirements

**10.1 Data Retention:** How long data is stored. **10.2 Database Schema Constraints:** Integrity rules (e.g., A Record must belong to a Category). **10.3 API Contracts:** General requirements for JSON structure and error handling codes.

Here is **Chapter 1: Introduction** of the Functional Requirements Document.

---

# Chapter 1: Introduction

## 1.1 Purpose

The purpose of this Functional Requirements Document (FRD) is to provide a comprehensive specification for the development of the **Cloud Time Tracker** system. This document details the functional behaviors, system architecture, external interfaces, and non-functional constraints required to build the solution.

This document allows stakeholders to verify that all business requirements have been accounted for and provides the technical team (developers, testers, and architects) with a definitive guide for implementation. It serves as the primary contract regarding the system's capabilities.

## 1.2 Scope

The **Cloud Time Tracker** project aims to develop a centralized, cross-platform productivity application. The system functionality is derived from the "Simple Time Tracker" Android application (acting as the functional baseline) but is re-architected to support a cloud-native environment.

The scope of the software system includes:

1. **Backend API:** A RESTful or GraphQL server responsible for business logic, data persistence, and identity management.  
2. **Web Application:** A responsive browser-based interface for managing time records, viewing analytics, and system administration.  
3. **Mobile Application:** A cross-platform (iOS and Android) mobile client focusing on quick data entry and timer management.  
4. **Database:** A centralized relational database storing user profiles, authentication credentials, and time-tracking data.

**Key Functional Boundaries:**

* The system shall transition from a "local-first" storage model (SQLite) to a "cloud-first" model (PostgreSQL/MySQL) to enable synchronization.  
* The system shall introduce **Role-Based Access Control (RBAC)** to differentiate between Standard Users and System Administrators.  
* The system shall support secure authentication (Login/Registration), which is absent in the reference application.

**Out of Scope:**

* Native Wear OS or WatchOS independent applications (MVP is limited to Phone/Web).  
* Desktop-specific native clients (Windows .exe / MacOS .app); the Web Application serves desktop users.  
* Offline-only mode without internet connectivity requirements for initial setup.

## 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
| :---- | :---- |
| **Record** | A historical unit of time tracking consisting of a start time, end time, duration, and assigned category. |
| **Running Record** | An active timer that has a start time but no end time yet. |
| **Category** | A high-level classification for time records (e.g., "Work", "Sleep"). |
| **Tag** | A sub-label applied to a record for granular filtering (e.g., "Meeting", "Deep Work"). |
| **RBAC** | **Role-Based Access Control**. A method of restricting network access based on the roles of individual users within the enterprise. |
| **JWT** | **JSON Web Token**. Used for securely transmitting information between the client and server as a JSON object, primarily for authentication. |
| **CRUD** | **Create, Read, Update, Delete**. The four basic functions of persistent storage. |
| **MVP** | **Minimum Viable Product**. The version of the product with just enough features to be usable by early customers. |
| **Reference App** | The original "Simple Time Tracker" Android codebase used as the visual and functional design source. |
| **Admin** | System Administrator with elevated privileges. |

## 1.4 References

The following documents and resources serve as references for this FRD:

1. **Reference Implementation:** *Simple Time Tracker* (Android).  
   * Repository: \[GitHub Link provided in context\]  
   * *Usage:* Defines the expected behavior for timers, charts, and categorization logic.  
2. **IEEE Std 830-1998:** IEEE Recommended Practice for Software Requirements Specifications (used as a structural guide).

## 1.5 Overview of Document

The remainder of this document is organized as follows:

* **Chapter 2** summarizes the business vision and objectives.  
* **Chapter 3** defines the system architecture and user actors.  
* **Chapters 4 through 8** detail the specific functional requirements by module (IAM, Taxonomy, Time Tracking, Analytics, Settings).  
* **Chapter 9** specifies non-functional requirements including security and performance.  
* **Chapter 10** outlines data requirements and API constraints.

---

# Chapter 2: Executive Summary

## 2.1 Vision

The **Cloud Time Tracker** system is envisioned as a scalable, cloud-native productivity platform that extends the proven utility of the "Simple Time Tracker" mobile application. While the reference application focuses on single-device, offline utility, this system provides a centralized environment where time tracking data is synchronized across multiple interfaces (Web and Mobile).

The core vision is to provide users with a seamless transition between quick data entry on mobile devices and in-depth analysis or reporting on desktop web interfaces, underpinned by a secure authentication layer and robust user management.

## 2.2 Key Business Objectives

The development of this system is driven by the following strategic objectives:

### 2.2.1 Centralization and Synchronization

* **Objective:** To eliminate data silos by migrating from local SQLite storage to a centralized server-side database.  
* **Benefit:** Users can switch devices (e.g., from Android to iOS, or Mobile to Web) without manual data export/import. Running timers and historical records must reflect the same state on all active sessions.

### 2.2.2 Identity and Security

* **Objective:** To implement a secure Identity and Access Management (IAM) system.  
* **Benefit:** Unlike the reference app, which is open to anyone with physical device access, this system ensures data privacy through user authentication. It allows for the distinction between individual user data and administrative oversight.

### 2.2.3 Platform Agnosticism

* **Objective:** To decouple the core feature set from the Android ecosystem.  
* **Benefit:** By offering a Web Client, the system becomes accessible to macOS, Windows, and Linux users, significantly expanding the potential user base beyond the original Android-only audience.

### 2.2.4 Administrative Control

* **Objective:** To provide a comprehensive administration panel.  
* **Benefit:** System administrators gains the ability to manage the platform's health, user base, and role assignments, facilitating potential future use cases such as enterprise deployment or team management.

## 2.3 Target Audience

The system is designed to serve distinct user groups with specific needs:

| User Class | Description | Key Needs |
| :---- | :---- | :---- |
| **Productivity Enthusiasts** | Individuals practicing "Quantified Self" or time-blocking techniques. | Quick timer access, granular categorization, visual statistics (Pie/Bar charts). |
| **Freelancers / Contractors** | Professionals who track time for billing purposes. | Accurate start/stop times, CSV export for invoicing, project-based tagging. |
| **System Administrators** | Technical owners of the application instance. | User lifecycle management (Create/Ban/Delete), system configuration, role delegation. |

## 2.4 Assumptions and Dependencies

* **Connectivity:** The core functionality assumes a stable internet connection is available for data synchronization.  
* **Hosting:** The system requires a cloud hosting environment (e.g., AWS, Azure, DigitalOcean) capable of running the backend API and database.  
* **Reference Parity:** It is assumed that the visual logic (colors, icons, chart behaviors) will strictly follow the "Simple Time Tracker" design patterns unless technical constraints of the web platform dictate otherwise.

---

# Chapter 3: System Architecture and Actors

## 3.1 High-Level System Architecture

The **Cloud Time Tracker** shall be built upon a robust Client-Server architecture. Unlike the reference application which operates as a standalone local installation, this system requires a centralized backend to manage authentication, synchronization, and data persistence.

The system is composed of three primary layers:

### 3.1.1 The Client Layer (Frontend)

This layer presents the user interface and captures user inputs. It communicates with the server via secure HTTP requests.

* **Web Client:** A Single Page Application (SPA) accessible via standard web browsers. It provides the full feature set including time tracking, detailed reporting, and administrative dashboards.  
* **Mobile Client:** A cross-platform application (iOS and Android). It prioritizes "on-the-go" interactions such as starting/stopping timers and quick categorization, while maintaining synchronization with the web view.

### 3.1.2 The Application Server (Backend)

This is the core processing unit of the system.

* **API Interface:** Exposes RESTful or GraphQL endpoints to serve data to the clients.  
* **Authentication Service:** Validates user credentials, issues security tokens (e.g., JWT), and enforces Role-Based Access Control (RBAC).  
* **Business Logic Controller:** handles the rules for timer calculations, complex categorization logic, and data validation (e.g., preventing a user from modifying another user's data).

### 3.1.3 The Data Layer (Persistence)

* **Relational Database:** A centralized database (e.g., PostgreSQL or MySQL) responsible for storing:  
  * User Accounts and Roles.  
  * Configuration (Categories, Tags, Goals).  
  * Time Records (Start time, End time, Duration).  
* **Data Isolation:** The database architecture must support multi-tenancy logic, ensuring that a query made by User A never returns data belonging to User B.

## 3.2 System Actors (User Roles)

The system employs **Role-Based Access Control (RBAC)** to define permissions. The following actors are identified:

### 3.2.1 Guest

A user who interacts with the system but has not established an identity.

* **Capabilities:**  
  * View Landing Page / Marketing content.  
  * Access "Login" and "Register" interfaces.  
  * Initiate Password Reset workflow.  
* **Constraints:** Cannot view the dashboard, start timers, or access API endpoints requiring authorization.

### 3.2.2 Standard User

The primary consumer of the application, representing a verified individual tracking their time.

* **Capabilities:**  
  * Manage personal Profile (change password, update email).  
  * **Time Tracking:** Start/Stop timers, create manual records, edit/delete own records.  
  * **Taxonomy:** Create and manage personal Categories, Tags, and Goals.  
  * **Analytics:** View charts and export own data to CSV.  
* **Constraints:** Strictly limited to accessing their own data. Cannot modify system-wide configurations or view other users' lists.

### 3.2.3 System Administrator

A privileged user responsible for the operational management of the application.

* **Capabilities:**  
  * **User Management:** View list of all registered users, ban/suspend users, delete users.  
  * **Role Management:** Promote a Standard User to Administrator or demote an Administrator.  
  * **System Configuration:** Manage global settings (e.g., enable/disable registration, system maintenance mode).  
* **Constraints:** While the Administrator manages *accounts*, the system design should ideally prevent Administrators from viewing the private time-tracking content of Standard Users, unless specific auditing features are enabled (privacy by design).

### 3.2.4 System (Internal Actor)

Automated processes running on the server.

* **Capabilities:**  
  * Sending transactional emails (Welcome email, Password Reset).  
  * Performing scheduled database maintenance or backups.

## 3.3 Permissions Matrix (High-Level)

The following table summarizes access rights for key system functions:

| Function | Guest | Standard User | Administrator |
| :---- | :---: | :---: | :---: |
| **Register / Login** | ✅ | ❌ (Already In) | ❌ (Already In) |
| **View Dashboard** | ❌ | ✅ | ✅ |
| **Create/Edit Time Records** | ❌ | ✅ (Own Data) | ✅ (Own Data) |
| **Manage Categories** | ❌ | ✅ (Own Data) | ✅ (Own Data) |
| **View User List** | ❌ | ❌ | ✅ |
| **Ban/Delete Users** | ❌ | ❌ | ✅ |
| **Change Global Settings** | ❌ | ❌ | ✅ |

---

# Chapter 4: Module 1 — Identity and Access Management (IAM)

## 4.1 Overview

This module defines the requirements for user identification, authentication, and authorization. Unlike the reference local-only application, the Cloud Time Tracker requires a secure barrier to entry to protect user data stored on the central server. The system shall utilize **Role-Based Access Control (RBAC)** to govern permissions.

## 4.2 User Registration

**ID:** FR-IAM-01 The system shall allow Guest users to create a new account to become Standard Users.

* **FR-IAM-01.1:** The system shall provide a registration form requiring the following fields:  
  * Email Address (Must be unique within the system).  
  * Password (Must meet complexity requirements: min. 8 characters, at least one number and special character).  
  * Confirm Password.  
* **FR-IAM-01.2:** The system shall validate that the email address follows a valid format (RFC 5322).  
* **FR-IAM-01.3:** Upon successful registration, the system shall create the user account with the default role of **Standard User**.  
* **FR-IAM-01.4:** The system shall hash the user's password using a secure algorithm (e.g., Argon2 or Bcrypt) before storing it in the database. Plain text passwords must never be stored.  
* **FR-IAM-01.5:** The system shall prevent duplicate registrations using the same email address and provide a user-friendly error message indicating the account already exists.

## 4.3 Authentication (Login)

**ID:** FR-IAM-02 The system shall allow registered users and administrators to authenticate their identity to access protected resources.

* **FR-IAM-02.1:** The system shall accept Email and Password as credentials.  
* **FR-IAM-02.2:** Upon successful authentication, the system shall issue a secure access token (e.g., JSON Web Token \- JWT) to the client. This token shall be included in the header of subsequent API requests.  
* **FR-IAM-02.3:** The system shall provide a generic error message ("Invalid email or password") in case of authentication failure to prevent user enumeration attacks.  
* **FR-IAM-02.4:** The system shall support a "Remember Me" function, extending the validity of the session or refresh token (e.g., to 30 days) if selected by the user.  
* **FR-IAM-02.5:** The system shall support a **Logout** function. Upon execution, the client shall discard the access token, and the system shall invalidate the session on the server side (if stateful sessions are used) or blacklist the token (if stateless).

## 4.4 Password Management

**ID:** FR-IAM-03 The system shall provide mechanisms for credential recovery and updates.

* **FR-IAM-03.1 (Forgot Password):** The system shall allow unauthenticated users to request a password reset via email.  
  * The user inputs their email address.  
  * The system generates a time-limited, one-time-use token and sends a link to the user's email.  
  * Clicking the link navigates the user to a "Set New Password" screen.  
* **FR-IAM-03.2 (Change Password):** The system shall allow authenticated users to change their password via the profile settings. This action requires entering the **Current Password** for verification before setting the **New Password**.

## 4.5 Role Management (RBAC)

**ID:** FR-IAM-04 The system shall restrict access to resources based on the user's assigned role.

* **FR-IAM-04.1:** The system shall support at minimum two distinct roles:  
  1. **Standard User:** Access to own data only.  
  2. **Administrator:** Access to user management and system configuration.  
* **FR-IAM-04.2:** By default, all newly registered users are assigned the **Standard User** role.  
* **FR-IAM-04.3:** Only an existing **Administrator** shall have the permission to modify the role of another user (e.g., promoting a Standard User to Admin).  
* **FR-IAM-04.4:** The system shall verify the user's role at the API Endpoint level (Middleware) before processing any request that requires elevated privileges.

## 4.6 Account Management & Deletion

**ID:** FR-IAM-05 The system shall manage the lifecycle of the user account.

* **FR-IAM-05.1:** The system shall allow a **Standard User** to delete their own account via the settings menu.  
  * This action is irreversible.  
  * Upon confirmation, the system must perform a "Hard Delete" of the user's authentication credentials and all associated personal data (Time Records, Categories, Tags) to comply with data privacy standards.  
* **FR-IAM-05.2:** The system shall allow an **Administrator** to ban or delete other users.  
  * **Ban:** The user data remains, but login is disabled.  
  * **Delete:** Identical to the user-initiated hard delete.

## 4.7 Session Management

**ID:** FR-IAM-06 The system shall manage the user's connectivity state securely.

* **FR-IAM-06.1:** Access tokens shall have a short lifespan (e.g., 15-60 minutes).  
* **FR-IAM-06.2:** The system shall implement a "Refresh Token" mechanism to allow the client to silently acquire a new access token without forcing the user to re-enter credentials, provided the session is still valid.  
* **FR-IAM-06.3:** If a user changes their password, all existing sessions/tokens for that user on other devices must be invalidated immediately.

---

# Chapter 5: Module 2 — Taxonomy and Configuration

## 5.1 Overview

This module defines the requirements for how users organize their time data. While the core function is tracking time, the value is derived from how that time is categorized. This module replicates the flexible taxonomy of the reference Android application, adapted for a multi-platform environment.

All data entities described in this chapter are **user-scoped**, meaning User A cannot see or access the Categories or Tags created by User B.

## 5.2 Category Management

**ID:** FR-TAX-01 The system shall allow users to create and manage high-level classifications for their activities.

* **FR-TAX-01.1 (Create):** The system shall allow the user to create a new Category defined by:  
  * **Name:** (Required, e.g., "Work", "Fitness"). Max 50 characters.  
  * **Color:** (Required) A HEX color code selected via a color picker component.  
  * **Icon:** (Optional) An emoji or vector icon selected from a predefined library (e.g., EmojiCompat or Material Icons).  
* **FR-TAX-01.2 (Read):** The system shall display a list of all active categories created by the user.  
* **FR-TAX-01.3 (Update):** The system shall allow the user to modify the Name, Color, or Icon of an existing category. These changes must retroactively apply to the visual representation of historical records but must not alter the historical data integrity.  
* **FR-TAX-01.4 (Delete):** The system shall allow the user to delete a category.  
  * **Constraint:** If the category contains existing Time Records, the system must prompt the user to either: a) Delete all associated records. b) Migrate the records to a different "Uncategorized" or "Archive" category.  
* **FR-TAX-01.5 (Default Data):** Upon account creation, the system shall initialize the user's account with a set of default categories (e.g., "Work" \[Red\], "Rest" \[Blue\]) to facilitate immediate usage.

## 5.3 Tag Management

**ID:** FR-TAX-02 The system shall allow users to create granular labels (Tags) that can be attached to records, independent of or dependent on categories.

* **FR-TAX-02.1:** The system shall allow the creation of Tags defined by a **Name** (Required).  
* **FR-TAX-02.2:** Tags can optionally be linked to specific Categories (Parent-Child relationship), but the system shall also support global Tags usable across any Category.  
* **FR-TAX-02.3:** A single Time Record may support multiple Tags (Many-to-Many relationship).

## 5.4 Goals and Limits

**ID:** FR-TAX-03 The system shall allow users to define targets for their time usage.

* **FR-TAX-03.1:** The system shall allow the user to set a **Duration Goal** for a specific Category or Tag.  
  * *Example:* "Work" \-\> Target: 8 Hours / Day.  
  * *Example:* "Social Media" \-\> Limit: 1 Hour / Day.  
* **FR-TAX-03.2:** Goals shall be definable on a Daily, Weekly, or Monthly basis.  
* **FR-TAX-03.3:** The system must track progress against these goals in real-time and provide visual feedback (e.g., a progress bar filling up).

## 5.5 Complex Rules (Automation)

**ID:** FR-TAX-04 The system shall provide logic to automate categorization based on context or specific triggers.

* **FR-TAX-04.1:** The system shall allow users to define "If-Then" rules.  
  * *Trigger:* Time of day (e.g., 09:00 \- 17:00).  
  * *Trigger:* Day of week (e.g., Monday-Friday).  
  * *Action:* Suggest or auto-fill a specific Category (e.g., "Work") when a new timer is started during this window.  
* **FR-TAX-04.2:** Users shall be able to enable/disable these rules without deleting them.

## 5.6 Data Validation and Constraints

**ID:** FR-TAX-05 The system shall enforce logical constraints on configuration data.

* **FR-TAX-05.1:** Category and Tag names must be unique per user (case-insensitive) to prevent duplicate ambiguity.  
* **FR-TAX-05.2:** A valid Hex color code must always be associated with a Category. If a user does not select one, a random color or a default system color must be assigned.

---

# Chapter 6: Module 3 — Time Tracking Core

## 6.1 Overview

This module details the primary function of the application: the creation and management of time records. The system shall support two distinct methods of data entry: **Real-time Tracking** (via a stopwatch/timer mechanism) and **Manual Entry** (logging historical activity).

Crucially, because this is a cloud-based system, the state of any "Running Timer" must be synchronized across devices. A timer started on the Mobile App must appear as "Running" on the Web Dashboard.

## 6.2 Real-Time Tracking (Running Timers)

**ID:** FR-CORE-01 The system shall allow users to track activity duration in real-time.

* **FR-CORE-01.1 (Start):** The system shall allow the user to start a new timer by selecting a Category.  
  * The "Start Time" is recorded as the server-synchronized timestamp at the moment of initiation.  
  * The "End Time" is initially NULL.  
* **FR-CORE-01.2 (Visual Feedback):** While a timer is active, the interface (Mobile and Web) shall display an incrementing counter showing the elapsed duration (Format: `HH:MM:SS`).  
* **FR-CORE-01.3 (Concurrency):** The system shall support **Single Active Timer** logic by default.  
  * If User A starts Timer Y while Timer X is already running, the system shall automatically **Stop** Timer X (setting its End Time to Now) and **Start** Timer Y.  
  * *Note:* This setting may be configurable (Allow Parallel Timers), but the default behavior acts to prevent unintentional overlaps.  
* **FR-CORE-01.4 (Stop):** The system shall allow the user to stop a running timer.  
  * Upon stopping, the system records the "End Time."  
  * The Running Timer entity is converted into a completed **Time Record** and stored in the history.  
* **FR-CORE-01.5 (Persistence):** Running timers must persist on the server. If the user closes the browser or the mobile app, the timer continues to run on the backend.

## 6.3 Manual Data Entry

**ID:** FR-CORE-02 The system shall allow users to log activities that occurred in the past.

* **FR-CORE-02.1:** The system shall provide a "Add Record" interface requiring:  
  * **Category:** Selected from the user's taxonomy.  
  * **Start Date & Time.**  
  * **End Date & Time.**  
  * **Tags:** (Optional).  
  * **Description/Note:** (Optional text field).  
* **FR-CORE-02.2 (Validation):** The system must enforce that **End Time \> Start Time**. Negative durations are not permitted.  
* **FR-CORE-02.3:** The system shall calculate the Duration automatically based on the difference between Start and End times.

## 6.4 Record Management (CRUD)

**ID:** FR-CORE-03 The system shall allow users to modify existing historical data.

* **FR-CORE-03.1 (Edit):** The system shall allow the user to update any attribute of an existing record (Category, Start Time, End Time, Tags, Notes).  
  * Changing timestamps must automatically recalculate the Duration.  
* **FR-CORE-03.2 (Delete):** The system shall allow the user to permanently remove a time record.  
* **FR-CORE-03.3 (Split):** The system shall provide a function to split one record into two.  
  * *Input:* A split timestamp (must be within the record's range).  
  * *Result:* Two distinct records with adjusted start/end times preserving the total duration.  
* **FR-CORE-03.4 (Merge):** The system shall provide a function to merge adjacent records.  
  * *Condition:* Records must be sequential or overlapping.

## 6.5 Data Export (CSV)

**ID:** FR-CORE-04 The system shall allow users to extract their raw data for external use.

* **FR-CORE-04.1:** The system shall generate a CSV (Comma Separated Values) file containing the user's time records.  
* **FR-CORE-04.2:** The user shall be able to filter the export by a specific Date Range (e.g., "Last Month").  
* **FR-CORE-04.3:** The CSV schema shall include columns for: `ID`, `Category`, `Tags`, `Start Time`, `End Time`, `Duration (Seconds)`, `Note`.

## 6.6 Synchronization and Conflict Resolution

**ID:** FR-CORE-05 The system shall ensure data consistency across the Web and Mobile clients.

* **FR-CORE-05.1:** When a timer status changes (Start/Stop) on one client, the change must be pushed to or polled by other active clients to update the UI.  
* **FR-CORE-05.2:** In the event of network latency causing conflicting Stop times from two devices, the server shall accept the **first received valid request** and reject or adjust the subsequent request to maintain data integrity.

---

# Chapter 7: Module 4 — Analytics and Visualization

## 7.1 Overview

This module defines the requirements for transforming raw time records into actionable insights. The system must replicate the rich visualization capabilities of the reference application (Charts, Graphs, Summaries) but leverage the processing power of the web/backend to render them dynamically. All analytics must be strictly scoped to the authenticated user's data.

## 7.2 The Dashboard

**ID:** FR-ANA-01 The system shall provide a landing view (Dashboard) that offers an immediate snapshot of the current day's performance.

* **FR-ANA-01.1 (Today's Summary):** The dashboard shall display the "Total Time Tracked" for the current day.  
* **FR-ANA-01.2 (Active Activity):** If a timer is running, the dashboard must prominently display the active Category, elapsed time, and a "Stop" button.  
* **FR-ANA-01.3 (Recent History):** A list of the 5-10 most recent time records shall be displayed for quick reference or editing.  
* **FR-ANA-01.4 (Quick Stats):** A simplified daily breakdown (e.g., a small Pie Chart) showing the distribution of today's time across top Categories.

## 7.3 Statistical Charts

**ID:** FR-ANA-02 The system shall provide a dedicated "Statistics" or "Reports" view offering detailed visualizations.

* **FR-ANA-02.1 (Pie Chart \- Distribution):**  
  * The system shall generate a Pie or Donut chart showing the percentage of time spent per Category.  
  * *Interaction:* Clicking a slice (Category) should drill down to show the distribution of **Tags** within that Category.  
* **FR-ANA-02.2 (Bar Chart \- Trends):**  
  * The system shall generate a Bar Chart comparing total duration over time.  
  * *X-Axis:* Time Unit (Days, Weeks, Months).  
  * *Y-Axis:* Duration (Hours).  
  * *Grouping:* Bars should be stacked or grouped by Category to show composition.  
* **FR-ANA-02.3 (Line Chart \- Progress):**  
  * The system shall display a Line Chart to visualize trends for specific Categories/Goals (e.g., "Work hours" trending up or down over the month).

## 7.4 Data Filtering

**ID:** FR-ANA-03 The system shall allow users to customize the data scope for all analytics widgets.

* **FR-ANA-03.1 (Time Range Selector):** Users shall be able to filter data by:  
  * Predefined ranges: Today, Yesterday, This Week, Last Week, This Month, Last Month, This Year.  
  * Custom range: User selects specific `Start Date` and `End Date`.  
* **FR-ANA-03.2 (Category Filter):** Users shall be able to include or exclude specific Categories from the analysis (e.g., "Show me everything except 'Sleep'").  
* **FR-ANA-03.3 (Tag Filter):** Users shall be able to filter records containing specific Tags.

## 7.5 Timeline View

**ID:** FR-ANA-04 The system shall provide a chronological visualization of the day.

* **FR-ANA-04.1:** The system shall render a vertical or horizontal timeline representing the 24-hour day.  
* **FR-ANA-04.2:** Time records shall be plotted as colored blocks on this timeline, with the color corresponding to the Category.  
* **FR-ANA-04.3:** "Gaps" (untracked time) shall be visually distinct (e.g., gray or transparent), making it easy for users to identify missing data.

## 7.6 Reporting Logic

**ID:** FR-ANA-05 The system shall perform calculations on the server or client to ensure accuracy.

* **FR-ANA-05.1:** All durations must be calculated in a base unit (e.g., seconds or milliseconds) and formatted for display (e.g., `1h 30m`).  
* **FR-ANA-05.2:** When a record spans across two days (e.g., sleeping from 11:00 PM to 7:00 AM), the analytics engine must strictly split the duration:  
  * 1 hour assigned to Day 1\.  
  * 7 hours assigned to Day 2\.  
  * *Note:* This ensures "Daily Total" stats never exceed 24 hours.

---

# Chapter 8: Module 5 — Application Settings and Synchronization

## 8.1 Overview

This module encompasses the configuration options available to the user to customize their experience, as well as the technical behaviors required to maintain state consistency across the Web and Mobile platforms.

## 8.2 Application Interface Settings

**ID:** FR-SET-01 The system shall allow users to personalize the visual presentation of the application.

* **FR-SET-01.1 (Theme):** The system shall support a **Dark Mode** and **Light Mode**.  
  * *Default:* Match the user's OS/System preference.  
  * *Override:* User can manually select "Dark", "Light", or "System" in settings.  
* **FR-SET-01.2 (Localization):** The system shall support multiple languages (starting with English).  
  * The UI must be capable of rendering translated strings for all labels and messages.  
  * Date and Time formats (e.g., `MM/DD/YYYY` vs `DD/MM/YYYY`, 12h vs 24h clock) must adapt to the selected locale.  
* **FR-SET-01.3 (Start of Week):** The system shall allow users to define which day represents the start of the week (e.g., Monday or Sunday) for the purpose of "Weekly" statistics calculation.

## 8.3 Notification Settings

**ID:** FR-SET-02 The system shall provide configurable alerts to keep the user engaged.

* **FR-SET-02.1 (Timer Reminders):** The user shall be able to enable notifications if a timer has been running for an excessive duration (e.g., "Timer running for \> 4 hours").  
* **FR-SET-02.2 (Goal Alerts):** The system shall trigger a notification when a defined Goal is reached (e.g., "You have reached your 8-hour Work goal").  
* **FR-SET-02.3 (Channel Management):**  
  * **Mobile:** Native Push Notifications.  
  * **Web:** Browser Desktop Notifications (requiring permission).  
  * Users must have the ability to toggle these independently.

## 8.4 Synchronization Logic

**ID:** FR-SET-03 The system shall ensure that data remains consistent across multiple active sessions.

* **FR-SET-03.1 (State Propagation):**  
  * If a user starts a timer on **Mobile**, the **Web** dashboard must reflect this change (show the running timer) within a reasonable latency (e.g., \< 5 seconds) without requiring a full page refresh.  
  * *Implementation Suggestion:* This may be achieved via Polling (periodic API checks) or WebSockets (Push).  
* **FR-SET-03.2 (Conflict Resolution \- Last Write Wins):**  
  * If a user modifies the *same* record on two devices simultaneously while offline, and then both reconnect:  
  * The server shall accept the timestamp of the latest update request and overwrite the previous state.  
* **FR-SET-03.3 (Offline Handling \- Mobile):**  
  * The Mobile App shall allow starting/stopping timers while offline.  
  * These actions must be queued locally.  
  * Upon re-establishing connectivity, the app must automatically sync the queue to the backend.

## 8.5 Data Maintenance

**ID:** FR-SET-04 The system shall provide tools for data hygiene.

* **FR-SET-04.1 (Export All):** A global "Export Data" button in settings to download a comprehensive JSON or CSV dump of the user's entire history (GDPR portability requirement).  
* **FR-SET-04.2 (Reset Account):** A specific danger-zone action to "Delete All Records" while keeping the user account and categories intact.

---

# Chapter 9: Non-Functional Requirements (NFR)

## 9.1 Overview

This chapter defines the quality attributes, performance constraints, and technical standards that the system must adhere to. These requirements ensure the system is usable, secure, and scalable.

## 9.2 Security Requirements

**ID:** NFR-SEC The system must protect user data and maintain the integrity of the application.

* **NFR-SEC-01 (Encryption in Transit):** All communications between Clients (Web/Mobile) and the Server must occur over **HTTPS** using TLS 1.2 or higher. Unencrypted HTTP traffic must be rejected or redirected.  
* **NFR-SEC-02 (Password Storage):** User passwords must never be stored in plain text. They must be salted and hashed using a strong algorithm (e.g., **Argon2id** or **Bcrypt** with an appropriate work factor).  
* **NFR-SEC-03 (Data Isolation):** The database queries must strictly enforce tenancy checks. A query for "Time Records" must always include a `WHERE user_id = X` clause to prevent data leakage between users.  
* **NFR-SEC-04 (Token Security):** Authentication tokens (JWT) should have a short expiration time (e.g., 15 minutes). Refresh tokens should be stored securely (e.g., `HttpOnly` cookies for Web, Encrypted KeyStore for Mobile).  
* **NFR-SEC-05 (Input Validation):** The API must sanitize all inputs to prevent SQL Injection and Cross-Site Scripting (XSS) attacks.

## 9.3 Performance Requirements

**ID:** NFR-PERF The system must provide a responsive user experience.

* **NFR-PERF-01 (API Latency):** 95% of standard API requests (e.g., Start Timer, Fetch Today's Records) should complete in under **200 milliseconds** (excluding network latency).  
* **NFR-PERF-02 (App Load Time):** The Web Application (First Contentful Paint) should load in under **1.5 seconds** on a standard 4G connection.  
* **NFR-PERF-03 (Dashboard Rendering):** The dashboard, including statistical charts, must render within **1 second** of data retrieval, even for users with \>10,000 historical records.

## 9.4 Scalability and Reliability

**ID:** NFR-SCALE The system must be able to grow with the user base.

* **NFR-SCALE-01 (Concurrency):** The backend architecture should support at least **1,000 concurrent active users** (users actively starting/stopping timers simultaneously) in the MVP phase.  
* **NFR-SCALE-02 (Availability):** The system shall aim for **99.9% uptime** during business hours. Planned maintenance should be scheduled during low-traffic windows.  
* **NFR-SCALE-03 (Database Growth):** The database schema must be indexed appropriately to handle millions of rows in the `time_records` table without significant query degradation.

## 9.5 Usability and Accessibility

**ID:** NFR-USE The system must be easy to use and accessible to a broad audience.

* **NFR-USE-01 (Mobile Responsiveness):** The Web Application must be fully responsive and functional on mobile browsers, adapting its layout to smaller screens.  
* **NFR-USE-02 (Accessibility):** The Web Interface should comply with **WCAG 2.1 Level AA** standards (e.g., proper contrast ratios, keyboard navigation support, ARIA labels for screen readers).  
* **NFR-USE-03 (Simplicity):** The critical path ("Start a Timer") must be achievable in **2 clicks/taps** or fewer from the landing screen.

## 9.6 Compliance

**ID:** NFR-COMP The system must adhere to legal standards.

* **NFR-COMP-01 (GDPR):** The system must support the "Right to be Forgotten" (Account Deletion) and "Right to Access" (Data Export) as defined in Chapters 4 and 8\.  
* **NFR-COMP-02 (Cookie Policy):** The Web Application must display a cookie consent banner if tracking or non-essential cookies are utilized.

---
