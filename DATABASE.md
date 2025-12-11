# 🗄️ Zero Waste - Database Schema

This document outlines the complete database schema required to make the Zero Waste frontend fully functional.

## 📊 Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    Users    │       │    Zones    │       │   Reports   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ email       │       │ name        │       │ user_id(FK) │
│ password    │◄──────│ description │◄──────│ zone_id(FK) │
│ name        │       │ color       │       │ description │
│ role        │       │ cleanliness │       │ severity    │
│ avatar_url  │       │ created_at  │       │ status      │
│ phone       │       │ updated_at  │       │ image_url   │
│ created_at  │       └─────────────┘       │ location    │
└─────────────┘              │              │ created_at  │
      │                      │              └─────────────┘
      │                      │                    │
      ▼                      ▼                    ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│CitizenStats │       │ZonePolygons │       │ AIAnalysis  │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ user_id(FK) │       │ zone_id(FK) │       │ report_id   │
│ green_points│       │ point_order │       │ description │
│ total_rpts  │       │ latitude    │       │ severity    │
│ approved    │       │ longitude   │       │ volume      │
│ streak      │       └─────────────┘       │ confidence  │
└─────────────┘                             └─────────────┘
```

---

## 📋 Tables

### 1. `users`
Core user table for all roles (Citizens, Cleaners, Admins).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| `name` | VARCHAR(100) | NOT NULL | Display name |
| `role` | ENUM | NOT NULL | 'CITIZEN', 'CLEANER', 'ADMIN' |
| `avatar_url` | VARCHAR(500) | NULL | Profile picture URL |
| `phone` | VARCHAR(20) | NULL | Phone number |
| `is_active` | BOOLEAN | DEFAULT true | Account status |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Registration date |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update |

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('CITIZEN', 'CLEANER', 'ADMIN')),
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 2. `zones`
Geographic zones for waste management areas.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `name` | VARCHAR(100) | NOT NULL | Zone name |
| `description` | TEXT | NULL | Zone description |
| `color` | VARCHAR(7) | DEFAULT '#3b82f6' | Hex color for map |
| `cleanliness_score` | INTEGER | DEFAULT 100 | 0-100 score |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation date |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update |

```sql
CREATE TABLE zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3b82f6',
    cleanliness_score INTEGER DEFAULT 100 CHECK (cleanliness_score >= 0 AND cleanliness_score <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 3. `zone_polygons`
Stores polygon coordinates for zone boundaries (GeoJSON-style).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `zone_id` | UUID | FOREIGN KEY | Reference to zones |
| `point_order` | INTEGER | NOT NULL | Order of point in polygon |
| `latitude` | DECIMAL(10,8) | NOT NULL | Latitude coordinate |
| `longitude` | DECIMAL(11,8) | NOT NULL | Longitude coordinate |

```sql
CREATE TABLE zone_polygons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_id UUID NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
    point_order INTEGER NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    UNIQUE(zone_id, point_order)
);
```

---

### 4. `reports`
Waste reports submitted by citizens.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `user_id` | UUID | FOREIGN KEY | Citizen who reported |
| `zone_id` | UUID | FOREIGN KEY | Zone where waste is located |
| `description` | TEXT | NOT NULL | Report description |
| `image_url` | VARCHAR(500) | NULL | Before photo URL |
| `severity` | ENUM | NOT NULL | LOW, MEDIUM, HIGH, CRITICAL |
| `status` | ENUM | NOT NULL | Report status |
| `latitude` | DECIMAL(10,8) | NULL | Exact location lat |
| `longitude` | DECIMAL(11,8) | NULL | Exact location lng |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Report submission time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last status change |

```sql
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    zone_id UUID NOT NULL REFERENCES zones(id),
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'APPROVED', 'DECLINED', 'IN_PROGRESS', 'COMPLETED')),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 5. `ai_analyses`
AI-generated waste analysis for reports.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `report_id` | UUID | FOREIGN KEY, UNIQUE | One analysis per report |
| `description` | TEXT | NOT NULL | AI description |
| `severity` | ENUM | NOT NULL | AI-detected severity |
| `estimated_volume` | VARCHAR(100) | NULL | e.g., "2-3 bags" |
| `environmental_impact` | ENUM | NULL | LOW, MODERATE, HIGH, SEVERE |
| `health_hazard` | BOOLEAN | DEFAULT false | Is hazardous? |
| `hazard_details` | TEXT | NULL | Hazard description |
| `recommended_action` | TEXT | NULL | Cleanup recommendation |
| `estimated_cleanup_time` | VARCHAR(50) | NULL | e.g., "30-45 minutes" |
| `confidence` | INTEGER | NULL | 0-100 AI confidence |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Analysis timestamp |

```sql
CREATE TABLE ai_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID UNIQUE NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    estimated_volume VARCHAR(100),
    environmental_impact VARCHAR(20) CHECK (environmental_impact IN ('LOW', 'MODERATE', 'HIGH', 'SEVERE')),
    health_hazard BOOLEAN DEFAULT false,
    hazard_details TEXT,
    recommended_action TEXT,
    estimated_cleanup_time VARCHAR(50),
    confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 6. `waste_compositions`
Breakdown of waste types in AI analysis.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `analysis_id` | UUID | FOREIGN KEY | Reference to ai_analyses |
| `waste_type` | VARCHAR(50) | NOT NULL | e.g., "Plastic", "Organic" |
| `percentage` | INTEGER | NOT NULL | 0-100 percentage |
| `recyclable` | BOOLEAN | DEFAULT false | Is recyclable? |

```sql
CREATE TABLE waste_compositions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID NOT NULL REFERENCES ai_analyses(id) ON DELETE CASCADE,
    waste_type VARCHAR(50) NOT NULL,
    percentage INTEGER NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
    recyclable BOOLEAN DEFAULT false
);
```

---

### 7. `special_equipment`
Equipment needed for cleanup (from AI analysis).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `analysis_id` | UUID | FOREIGN KEY | Reference to ai_analyses |
| `equipment_name` | VARCHAR(100) | NOT NULL | e.g., "Gloves", "Hazmat suit" |

```sql
CREATE TABLE special_equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID NOT NULL REFERENCES ai_analyses(id) ON DELETE CASCADE,
    equipment_name VARCHAR(100) NOT NULL
);
```

---

### 8. `tasks`
Cleanup tasks created from approved reports.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `report_id` | UUID | FOREIGN KEY | Source report |
| `zone_id` | UUID | FOREIGN KEY | Task zone |
| `cleaner_id` | UUID | FOREIGN KEY, NULL | Assigned cleaner |
| `description` | TEXT | NOT NULL | Task description |
| `status` | ENUM | NOT NULL | Task status |
| `priority` | ENUM | NOT NULL | LOW, MEDIUM, HIGH, CRITICAL |
| `reward` | DECIMAL(10,2) | NOT NULL | Payment in BDT |
| `due_date` | TIMESTAMP | NOT NULL | Deadline |
| `evidence_image_url` | VARCHAR(500) | NULL | After cleanup photo |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Task creation |
| `taken_at` | TIMESTAMP | NULL | When cleaner claimed |
| `completed_at` | TIMESTAMP | NULL | Completion time |

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(id),
    zone_id UUID NOT NULL REFERENCES zones(id),
    cleaner_id UUID REFERENCES users(id),
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'APPROVED' CHECK (status IN ('APPROVED', 'IN_PROGRESS', 'COMPLETED')),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    reward DECIMAL(10, 2) NOT NULL,
    due_date TIMESTAMP NOT NULL,
    evidence_image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    taken_at TIMESTAMP,
    completed_at TIMESTAMP
);
```

---

### 9. `cleanup_comparisons`
AI comparison of before/after cleanup photos.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `report_id` | UUID | FOREIGN KEY, UNIQUE | One comparison per report |
| `completion_percentage` | INTEGER | NOT NULL | 0-100 cleanup completion |
| `before_summary` | TEXT | NULL | AI summary of before state |
| `after_summary` | TEXT | NULL | AI summary of after state |
| `quality_rating` | ENUM | NULL | POOR, FAIR, GOOD, EXCELLENT |
| `environmental_benefit` | TEXT | NULL | Environmental impact |
| `verification_status` | ENUM | NOT NULL | VERIFIED, NEEDS_REVIEW, INCOMPLETE |
| `feedback` | TEXT | NULL | AI feedback for cleaner |
| `confidence` | INTEGER | NULL | 0-100 AI confidence |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Analysis timestamp |

```sql
CREATE TABLE cleanup_comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID UNIQUE NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    completion_percentage INTEGER NOT NULL CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    before_summary TEXT,
    after_summary TEXT,
    quality_rating VARCHAR(20) CHECK (quality_rating IN ('POOR', 'FAIR', 'GOOD', 'EXCELLENT')),
    environmental_benefit TEXT,
    verification_status VARCHAR(20) NOT NULL CHECK (verification_status IN ('VERIFIED', 'NEEDS_REVIEW', 'INCOMPLETE')),
    feedback TEXT,
    confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 10. `cleanup_reviews`
Citizen reviews of completed cleanups (watchdog feature).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `report_id` | UUID | FOREIGN KEY, UNIQUE | One review per report |
| `reviewer_id` | UUID | FOREIGN KEY | Citizen who reviewed |
| `rating` | INTEGER | NOT NULL | 1-5 stars |
| `comment` | TEXT | NULL | Review comment |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Review timestamp |

```sql
CREATE TABLE cleanup_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID UNIQUE NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 11. `citizen_profiles`
Extended profile data for citizens (gamification).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | UUID | PRIMARY KEY, FK | Reference to users |
| `green_points` | INTEGER | DEFAULT 0 | Total points earned |
| `total_reports` | INTEGER | DEFAULT 0 | All reports submitted |
| `approved_reports` | INTEGER | DEFAULT 0 | Approved reports count |
| `current_streak` | INTEGER | DEFAULT 0 | Current daily streak |
| `longest_streak` | INTEGER | DEFAULT 0 | Best streak achieved |

```sql
CREATE TABLE citizen_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    green_points INTEGER DEFAULT 0,
    total_reports INTEGER DEFAULT 0,
    approved_reports INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0
);
```

---

### 12. `cleaner_profiles`
Extended profile data for cleaners.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | UUID | PRIMARY KEY, FK | Reference to users |
| `total_earnings` | DECIMAL(12,2) | DEFAULT 0 | Total BDT earned |
| `pending_earnings` | DECIMAL(12,2) | DEFAULT 0 | Unpaid earnings |
| `completed_tasks` | INTEGER | DEFAULT 0 | Tasks completed |
| `current_tasks` | INTEGER | DEFAULT 0 | Active tasks |
| `rating` | DECIMAL(2,1) | DEFAULT 5.0 | Average rating (1-5) |
| `total_reviews` | INTEGER | DEFAULT 0 | Number of reviews |

```sql
CREATE TABLE cleaner_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_earnings DECIMAL(12, 2) DEFAULT 0,
    pending_earnings DECIMAL(12, 2) DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,
    current_tasks INTEGER DEFAULT 0,
    rating DECIMAL(2, 1) DEFAULT 5.0 CHECK (rating >= 1 AND rating <= 5),
    total_reviews INTEGER DEFAULT 0
);
```

---

### 13. `badges`
Available badges in the system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(50) | PRIMARY KEY | Badge identifier |
| `name` | VARCHAR(100) | NOT NULL | Display name |
| `description` | TEXT | NOT NULL | How to earn |
| `icon` | VARCHAR(10) | NOT NULL | Emoji icon |

```sql
CREATE TABLE badges (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10) NOT NULL
);

-- Seed data
INSERT INTO badges (id, name, description, icon) VALUES
('FIRST_REPORT', 'First Step', 'Submit your first report', '🌱'),
('ECO_WARRIOR', 'Eco Warrior', 'Get 10+ reports approved', '🌍'),
('ZONE_CHAMPION', 'Zone Champion', 'Report in 5+ different zones', '🗺️'),
('WATCHDOG', 'Watchdog', 'Submit 5+ cleanup reviews', '👁️'),
('COMMUNITY_HERO', 'Community Hero', 'Earn 50+ green points', '🤝'),
('GREEN_LEGEND', 'Green Legend', 'Unlock all other badges', '🏆');
```

---

### 14. `user_badges`
Junction table for user-badge relationships.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `user_id` | UUID | FOREIGN KEY | User who earned badge |
| `badge_id` | VARCHAR(50) | FOREIGN KEY | Badge earned |
| `earned_at` | TIMESTAMP | DEFAULT NOW() | When badge was earned |

```sql
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id VARCHAR(50) NOT NULL REFERENCES badges(id),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);
```

---

### 15. `notifications`
User notifications.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `user_id` | UUID | FOREIGN KEY | Recipient user |
| `title` | VARCHAR(200) | NOT NULL | Notification title |
| `message` | TEXT | NOT NULL | Notification body |
| `type` | ENUM | NOT NULL | info, success, warning, alert |
| `is_read` | BOOLEAN | DEFAULT false | Read status |
| `link` | VARCHAR(500) | NULL | Optional action link |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Notification time |

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'alert')),
    is_read BOOLEAN DEFAULT false,
    link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 16. `user_settings`
User preferences and settings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | UUID | PRIMARY KEY, FK | Reference to users |
| `email_notifications` | BOOLEAN | DEFAULT true | Email alerts |
| `push_notifications` | BOOLEAN | DEFAULT true | Push alerts |
| `dark_mode` | BOOLEAN | DEFAULT false | Theme preference |
| `language` | VARCHAR(5) | DEFAULT 'en' | Language code |

```sql
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    dark_mode BOOLEAN DEFAULT false,
    language VARCHAR(5) DEFAULT 'en'
);
```

---

### 17. `point_transactions`
Audit log for green points (gamification).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `user_id` | UUID | FOREIGN KEY | User who earned points |
| `points` | INTEGER | NOT NULL | Points earned (can be negative) |
| `reason` | VARCHAR(100) | NOT NULL | Why points were awarded |
| `reference_type` | VARCHAR(50) | NULL | 'report', 'review', etc. |
| `reference_id` | UUID | NULL | ID of related entity |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Transaction time |

```sql
CREATE TABLE point_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    reason VARCHAR(100) NOT NULL,
    reference_type VARCHAR(50),
    reference_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 18. `payment_transactions`
Payment records for cleaners.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `cleaner_id` | UUID | FOREIGN KEY | Cleaner receiving payment |
| `task_id` | UUID | FOREIGN KEY | Related task |
| `amount` | DECIMAL(10,2) | NOT NULL | Payment amount in BDT |
| `status` | ENUM | NOT NULL | PENDING, COMPLETED, FAILED |
| `payment_method` | VARCHAR(50) | NULL | bKash, Nagad, Bank, etc. |
| `transaction_ref` | VARCHAR(100) | NULL | External transaction ID |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Transaction time |
| `completed_at` | TIMESTAMP | NULL | When payment completed |

```sql
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cleaner_id UUID NOT NULL REFERENCES users(id),
    task_id UUID NOT NULL REFERENCES tasks(id),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
    payment_method VARCHAR(50),
    transaction_ref VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);
```

---

## 🔗 Relationships Summary

| Relationship | Type | Description |
|--------------|------|-------------|
| users → reports | 1:N | One citizen can submit many reports |
| users → tasks | 1:N | One cleaner can have many tasks |
| zones → reports | 1:N | One zone can have many reports |
| zones → zone_polygons | 1:N | One zone has many polygon points |
| reports → ai_analyses | 1:1 | One report has one AI analysis |
| reports → tasks | 1:1 | One report creates one task |
| reports → cleanup_comparisons | 1:1 | One report has one comparison |
| reports → cleanup_reviews | 1:1 | One report has one review |
| ai_analyses → waste_compositions | 1:N | One analysis has many compositions |
| ai_analyses → special_equipment | 1:N | One analysis lists many equipment |
| users → citizen_profiles | 1:1 | One citizen has one profile |
| users → cleaner_profiles | 1:1 | One cleaner has one profile |
| users → user_badges | 1:N | One user can earn many badges |
| badges → user_badges | 1:N | One badge can be earned by many users |
| users → notifications | 1:N | One user receives many notifications |
| users → user_settings | 1:1 | One user has one settings record |
| users → point_transactions | 1:N | One user has many point transactions |
| users → payment_transactions | 1:N | One cleaner has many payments |
| tasks → payment_transactions | 1:1 | One task has one payment |

---

## 📈 Indexes

```sql
-- Performance indexes
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_zone_id ON reports(zone_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

CREATE INDEX idx_tasks_cleaner_id ON tasks(cleaner_id);
CREATE INDEX idx_tasks_zone_id ON tasks(zone_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

CREATE INDEX idx_zone_polygons_zone_id ON zone_polygons(zone_id);

CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);

CREATE INDEX idx_point_transactions_user_id ON point_transactions(user_id);
CREATE INDEX idx_point_transactions_created_at ON point_transactions(created_at DESC);

CREATE INDEX idx_payment_transactions_cleaner_id ON payment_transactions(cleaner_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
```

---

## 🔄 Status Flow

```
Report Status Flow:
┌──────────┐     ┌──────────┐     ┌────────────┐     ┌───────────┐
│ SUBMITTED│────►│ APPROVED │────►│ IN_PROGRESS│────►│ COMPLETED │
└──────────┘     └──────────┘     └────────────┘     └───────────┘
      │
      ▼
┌──────────┐
│ DECLINED │
└──────────┘

Task Status Flow:
┌──────────┐     ┌────────────┐     ┌───────────┐
│ APPROVED │────►│ IN_PROGRESS│────►│ COMPLETED │
└──────────┘     └────────────┘     └───────────┘
(Available)      (Cleaner took)     (Cleanup done)
```

---

## 🎮 Points Configuration

| Action | Points | Trigger |
|--------|--------|---------|
| Report Created | +5 | On report submission |
| Report Approved | +10 | When admin approves |
| Review Submitted | +5 | When citizen reviews cleanup |
| Severity Bonus (LOW) | +0 | Based on report severity |
| Severity Bonus (MEDIUM) | +3 | Based on report severity |
| Severity Bonus (HIGH) | +7 | Based on report severity |
| Severity Bonus (CRITICAL) | +10 | Based on report severity |

---

## 🔐 Row Level Security (RLS) Policies

```sql
-- Citizens can only see their own reports
CREATE POLICY citizen_reports_policy ON reports
    FOR SELECT USING (user_id = auth.uid() OR auth.role() = 'ADMIN');

-- Citizens can only create reports for themselves
CREATE POLICY citizen_create_report ON reports
    FOR INSERT WITH CHECK (user_id = auth.uid() AND auth.role() = 'CITIZEN');

-- Cleaners can only see available tasks or their own tasks
CREATE POLICY cleaner_tasks_policy ON tasks
    FOR SELECT USING (
        cleaner_id IS NULL 
        OR cleaner_id = auth.uid() 
        OR auth.role() = 'ADMIN'
    );

-- Users can only see their own notifications
CREATE POLICY user_notifications_policy ON notifications
    FOR ALL USING (user_id = auth.uid());

-- Users can only update their own settings
CREATE POLICY user_settings_policy ON user_settings
    FOR ALL USING (user_id = auth.uid());
```

---

## 📊 Views

### Leaderboard View (Citizens)
```sql
CREATE VIEW citizen_leaderboard AS
SELECT 
    u.id,
    u.name,
    u.avatar_url,
    cp.green_points,
    cp.approved_reports,
    COUNT(ub.badge_id) as badge_count,
    RANK() OVER (ORDER BY cp.green_points DESC) as rank
FROM users u
JOIN citizen_profiles cp ON u.id = cp.user_id
LEFT JOIN user_badges ub ON u.id = ub.user_id
WHERE u.role = 'CITIZEN'
GROUP BY u.id, u.name, u.avatar_url, cp.green_points, cp.approved_reports
ORDER BY cp.green_points DESC;
```

### Cleaner Leaderboard View
```sql
CREATE VIEW cleaner_leaderboard AS
SELECT 
    u.id,
    u.name,
    u.avatar_url,
    cp.total_earnings,
    cp.completed_tasks,
    cp.rating,
    RANK() OVER (ORDER BY cp.total_earnings DESC) as rank
FROM users u
JOIN cleaner_profiles cp ON u.id = cp.user_id
WHERE u.role = 'CLEANER'
ORDER BY cp.total_earnings DESC;
```

### Zone Statistics View
```sql
CREATE VIEW zone_statistics AS
SELECT 
    z.id,
    z.name,
    z.cleanliness_score,
    COUNT(r.id) as total_reports,
    COUNT(CASE WHEN r.status = 'COMPLETED' THEN 1 END) as completed_reports,
    COUNT(CASE WHEN r.status = 'SUBMITTED' THEN 1 END) as pending_reports
FROM zones z
LEFT JOIN reports r ON z.id = r.zone_id
GROUP BY z.id, z.name, z.cleanliness_score;
```

### Dashboard Statistics View
```sql
CREATE VIEW dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM reports WHERE status = 'SUBMITTED') as pending_reports,
    (SELECT COUNT(*) FROM tasks WHERE status = 'APPROVED') as available_tasks,
    (SELECT COUNT(*) FROM tasks WHERE status = 'IN_PROGRESS') as in_progress_tasks,
    (SELECT COUNT(*) FROM tasks WHERE status = 'COMPLETED') as completed_tasks,
    (SELECT COALESCE(SUM(reward), 0) FROM tasks) as total_rewards,
    (SELECT COALESCE(SUM(reward), 0) FROM tasks WHERE status = 'COMPLETED') as paid_out;
```

---

## 🔧 Triggers

### Auto-update timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_reports_updated_at
    BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_zones_updated_at
    BEFORE UPDATE ON zones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Award points on report approval
```sql
CREATE OR REPLACE FUNCTION award_approval_points()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'APPROVED' AND OLD.status = 'SUBMITTED' THEN
        -- Award base points
        INSERT INTO point_transactions (user_id, points, reason, reference_type, reference_id)
        VALUES (NEW.user_id, 10, 'Report Approved', 'report', NEW.id);
        
        -- Award severity bonus
        INSERT INTO point_transactions (user_id, points, reason, reference_type, reference_id)
        VALUES (
            NEW.user_id,
            CASE NEW.severity
                WHEN 'LOW' THEN 0
                WHEN 'MEDIUM' THEN 3
                WHEN 'HIGH' THEN 7
                WHEN 'CRITICAL' THEN 10
            END,
            'Severity Bonus',
            'report',
            NEW.id
        );
        
        -- Update citizen profile
        UPDATE citizen_profiles
        SET 
            green_points = green_points + 10 + CASE NEW.severity
                WHEN 'LOW' THEN 0
                WHEN 'MEDIUM' THEN 3
                WHEN 'HIGH' THEN 7
                WHEN 'CRITICAL' THEN 10
            END,
            approved_reports = approved_reports + 1
        WHERE user_id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_award_approval_points
    AFTER UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION award_approval_points();
```

### Update cleaner stats on task completion
```sql
CREATE OR REPLACE FUNCTION update_cleaner_on_completion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'COMPLETED' AND OLD.status = 'IN_PROGRESS' THEN
        UPDATE cleaner_profiles
        SET 
            completed_tasks = completed_tasks + 1,
            current_tasks = current_tasks - 1,
            pending_earnings = pending_earnings + NEW.reward
        WHERE user_id = NEW.cleaner_id;
        
        -- Create payment transaction
        INSERT INTO payment_transactions (cleaner_id, task_id, amount, status)
        VALUES (NEW.cleaner_id, NEW.id, NEW.reward, 'PENDING');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_cleaner_on_completion
    AFTER UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_cleaner_on_completion();
```

---

## 📱 API Endpoints Mapping

| Frontend Feature | Endpoint | Tables Used |
|------------------|----------|-------------|
| Login/Register | POST /auth/* | users |
| Report Waste | POST /reports | reports, ai_analyses |
| My Reports | GET /reports?user_id=X | reports, ai_analyses, cleanup_reviews |
| Available Tasks | GET /tasks?status=APPROVED | tasks, zones |
| Take Task | PATCH /tasks/:id | tasks, cleaner_profiles |
| Complete Task | PATCH /tasks/:id | tasks, cleanup_comparisons |
| Submit Review | POST /reviews | cleanup_reviews, point_transactions |
| Leaderboard | GET /leaderboard | citizen_leaderboard view |
| Profile | GET /users/:id/profile | users, citizen_profiles/cleaner_profiles |
| Notifications | GET /notifications | notifications |
| Admin Dashboard | GET /admin/stats | dashboard_stats view |
| Manage Zones | CRUD /zones | zones, zone_polygons |
| Bulk Notify | POST /notifications/bulk | notifications |

---

## 🗃️ Sample Data

See `constants.ts` for mock data that matches this schema structure.

---

## 📝 Notes

1. **UUID vs Serial**: UUIDs are used for all primary keys for better distribution and security.
2. **Soft Deletes**: Consider adding `deleted_at` columns for soft delete functionality.
3. **Audit Trail**: The `point_transactions` and `payment_transactions` tables serve as audit logs.
4. **Geospatial**: For production, consider using PostGIS for better geospatial queries.
5. **File Storage**: Image URLs reference external storage (S3, Cloudinary, etc.).
6. **Authentication**: Password hashing should use bcrypt with appropriate salt rounds.
