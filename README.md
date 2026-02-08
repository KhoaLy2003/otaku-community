# Otaku Community

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive full-stack ecosystem for the otaku community. This platform bridges the gap between anime/manga fans, translators, and content creators, providing a high-performance, mobile-first experience.

## Architecture

![Container Diagram](doc/container-diagram.svg)

## ✨ Key Features

### 🏮 Community & Social interaction

- **Dynamic Feed System:** Personalized home feed based on followed topics and users.
- **Rich Post Engine:** Create and share posts with media support, formatted content, and topic categorization.
- **Interactive Engagement:** Layered comment system with reactions and real-time interactions.
- **Social Connectivity:** Follow other community members and stay updated with their activities.
- **Real-time Chat:** Instant messaging between users powered by WebSockets.

### 📖 Manga & Anime Ecosystem

- **Premium Manga Reader:** Smooth, high-performance reading experience with mobile-friendly navigation (Swiper.js).
- **Translation Workflow:** Community-driven manga translations with a dedicated dashboard for translators.
- **Batch Upload System:** Rapid manga chapter uploads with real-time job tracking and progress monitoring.
- **Rich Metadata Database:** Comprehensive anime and manga details integrated with the **Jikan API**.
- **Personal Collections:** Track your favorite titles and manage personal watch/read lists.

### 🛠️ Platform Administration

- **Admin Command Center:** Real-time dashboard featuring system health, user growth analytics, and site statistics.
- **Advanced User Moderation:** Comprehensive tools for managing user accounts, including locking and banning capabilities.
- **Activity Transparency:** Full audit logs for tracking user and administrative actions across the platform.
- **Content Curation:** Management tools for news articles, RSS feeds, and user feedback.

## 🚀 Tech Stack

### Backend (Java/Spring)

- **Framework:** Spring Boot 3.2.1
- **Security:** Spring Security & Auth0 (OAuth2/OIDC)
- **Data:** Spring Data JPA with PostgreSQL
- **Real-time:** WebSockets (SockJS/STOMP)
- **Caching & Rate Limiting:** Redis
- **Content Parsing:** Rome (RSS) & Jsoup (HTML)
- **Migrations:** Liquibase
- **Media:** Cloudinary Integration
- **Documentation:** Springdoc OpenAPI (Swagger)

### Frontend (React/Vite)

- **Runtime:** Vite + React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Lucide React Icons
- **State Management:** Zustand & TanStack Query
- **Architecture:** Feature-based modular structure
- **Real-time:** WebSockets (SockJS/Stomp)

## 📁 Project Structure

```bash
otaku-community/
├── backend/            # Spring Boot application (REST API)
├── frontend/           # Vite + React application (Web Interface)
├── auth0-config/       # Auth0 tenant export/configuration
└── doc/                # Architectural diagrams, db schema, and requirements
```

## 🏁 Getting Started

### Prerequisites

- **Java 17** or higher
- **Node.js 20** or higher
- **PostgreSQL 14+**
- **Redis** (optional, for rate-limiting)

### Quick Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/KhoaLy2003/otaku-community.git
   cd otaku-community
   ```

2. **Backend Configuration:**
   - Navigate to `backend/`
   - Create a `.env` file or update `src/main/resources/application.yml` with your environment variables (Database, Auth0, Cloudinary).
   - Run: `mvn clean install`
   - Start: `mvn spring-boot:run`

3. **Frontend Configuration:**
   - Navigate to `frontend/`
   - Create a `.env` file based on `.env.example`.
   - Install: `npm install`
   - Start: `npm run dev`

## 🔗 Internal Resources

- [Backend Documentation](backend/README.md)
- [Frontend Coding Conventions](frontend/CODING_CONVENTIONS.md)
- [Database Schema](doc/database/schema.md)

## 🤝 Contributing

Contributions are what make the community amazing! Please feel free to open issues or submit pull requests.

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.
