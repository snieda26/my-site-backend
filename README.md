# ITLead API

Backend API for the ITLead interview preparation platform.

## Stack

- **NestJS** - Node.js framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Zod** - Validation
- **JWT** - Authentication
- **Swagger** - API Documentation

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Yarn or npm

### Installation

1. Clone the repository

2. Install dependencies:
```bash
yarn install
```

3. Copy environment file:
```bash
cp env.example .env
```

4. Update `.env` with your database credentials and secrets

5. Generate Prisma client and push schema:
```bash
yarn db:seed
```

6. Start development server:
```bash
yarn dev
```

The server will start at `http://localhost:4200`

API Documentation available at `http://localhost:4200/api/docs`

## Project Structure

```
src/
├── common/              # Shared utilities
│   ├── decorators/      # Custom decorators
│   ├── dto/             # Shared DTOs
│   ├── filters/         # Exception filters
│   └── helpers/         # Helper functions
├── core/                # Core modules
│   ├── config/          # Configuration
│   ├── database/        # Prisma service
│   └── guards/          # Auth guards
├── modules/             # Feature modules
│   ├── identity/        # Auth & accounts
│   ├── questions/       # Interview questions
│   ├── problems/        # Coding problems
│   └── progress/        # User progress
├── app.module.ts        # Root module
└── main.ts              # Entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify` - Verify email

### Account
- `GET /api/account/profile` - Get profile
- `PATCH /api/account/profile` - Update profile
- `PATCH /api/account/password` - Change password

### Categories
- `GET /api/categories` - List categories
- `GET /api/categories/:slug` - Get category
- `POST /api/categories` - Create category (admin)
- `PATCH /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Questions
- `GET /api/questions` - List questions
- `GET /api/questions/category/:slug` - Questions by category
- `GET /api/questions/:slug` - Get question
- `POST /api/questions` - Create question (admin)
- `PATCH /api/questions/:id` - Update question (admin)
- `DELETE /api/questions/:id` - Delete question (admin)

### Problems
- `GET /api/problems` - List problems
- `GET /api/problems/:slug` - Get problem
- `POST /api/problems` - Create problem (admin)
- `PATCH /api/problems/:id` - Update problem (admin)
- `DELETE /api/problems/:id` - Delete problem (admin)
- `POST /api/problems/:slug/submit` - Submit solution

### Progress
- `GET /api/progress` - Get progress overview
- `GET /api/progress/category/:slug` - Category progress
- `POST /api/progress/update` - Update progress
- `GET /api/progress/completed` - Completed questions

### Bookmarks
- `GET /api/bookmarks` - List bookmarks
- `GET /api/bookmarks/questions` - Question bookmarks
- `GET /api/bookmarks/problems` - Problem bookmarks
- `POST /api/bookmarks` - Create bookmark
- `DELETE /api/bookmarks/:id` - Delete bookmark

## Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start:prod` - Start production server
- `yarn db:seed` - Seed database
- `yarn db:reset` - Reset and reseed database
- `yarn db:studio` - Open Prisma Studio

## License

MIT
