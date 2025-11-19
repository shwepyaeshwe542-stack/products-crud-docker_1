# Products CRUD Application with CI/CD

Full-stack e-commerce product management system with automated CI/CD pipeline using Jenkins and Docker.

## 📹 Demo Video
**Video Link:** [Insert your video link here]

## 🔗 Live Application URLs
- **Frontend:** http://192.168.56.1:3000/products
- **Backend API:** http://192.168.56.1:4000/api/products
- **Jenkins:** http://192.168.56.1:8080

## 🚀 Features
- ✅ Full CRUD operations for products
- ✅ RESTful API with Express.js
- ✅ Next.js 14 frontend with App Router
- ✅ PostgreSQL database with Prisma ORM
- ✅ Docker containerization
- ✅ Automated CI/CD with Jenkins
- ✅ Health checks and monitoring
- ✅ Seed data for testing

## 🏗️ Architecture
```
Frontend (Next.js) → Backend (Express) → Database (PostgreSQL)
      :3000              :4000                :5432
```

## 📋 Project Requirements Met

### **1. Application ✅**
- **Language/Framework:** Node.js with Express.js (Backend), Next.js (Frontend)
- **Backend API:** RESTful endpoints (`/api/products`)
  - `GET /api/products` - List all products
  - `GET /api/products/:id` - Get single product
  - `POST /api/products` - Create product
  - `PUT /api/products/:id` - Update product
  - `DELETE /api/products/:id` - Delete product
- **Frontend:** Next.js page that calls API and displays real data
- **Real Database:** PostgreSQL with `products` table
- **Seed Data:** 5 sample products pre-loaded

### **2. Docker ✅**
- **Dockerfiles:**
  - `backend/Dockerfile` - Node.js 18 Alpine with Prisma
  - `frontend/Dockerfile` - Node.js 20 Alpine with Next.js
- **docker-compose.yml:** Orchestrates 3 services
  - `database` - PostgreSQL 15
  - `backend` - Express API
  - `frontend` - Next.js UI
- **Environment Variables:**
  - `.env` - Real credentials (gitignored)
  - `.env.example` - Template with placeholders (committed to Git)

### **3. Jenkins CI/CD ✅**
- **Jenkinsfile:** Complete pipeline in repository root
- **Pipeline Stages:**
  1. **Checkout** - Pull latest code from GitHub
  2. **Prepare Environment** - Create `.env` from `.env.example`
  3. **Stop Old Containers** - Clean previous deployment
  4. **Build** - Build Docker images with `--no-cache`
  5. **Deploy** - Start containers with `docker compose up -d`
  6. **Wait for Services** - Allow 30 seconds for initialization
  7. **Health Check** - Verify all services are running
  8. **Show Container Status** - Display running containers
- **Auto-trigger:** Poll SCM every 5 minutes (`H/5 * * * *`)
- **Health Checks:** Automated verification for Database, Backend API, and Frontend

## 🛠️ Technologies Used

- **Backend:** Node.js, Express.js, Prisma ORM
- **Frontend:** Next.js 15, React, Tailwind CSS
- **Database:** PostgreSQL 15
- **DevOps:** Docker, Docker Compose, Jenkins
- **Version Control:** Git, GitHub

## 📦 Quick Start

### **Prerequisites**
- Docker & Docker Compose
- Jenkins (for CI/CD)
- Git

### **Setup Instructions**

1. **Clone Repository**
```bash
   git clone https://github.com/shwepyaeshwe542-stack/products-crud-docker_1.git
   cd products-crud-docker_1
```

2. **Configure Environment**
```bash
   cp .env.example .env
   # Edit .env with your database password
```

3. **Run with Docker Compose**
```bash
   docker compose up -d --build
```

4. **Seed Database**
```bash
   docker compose exec backend node prisma/seed.js
```

5. **Access Application**
   - Frontend: http://localhost:3000/products
   - Backend API: http://localhost:4000/api/products

## 🤖 CI/CD Workflow
```
Developer → Git Push → GitHub
                         ↓
          Jenkins (Poll SCM every 5 min)
                         ↓
                  Checkout Code
                         ↓
             Build Docker Images
                         ↓
              Deploy Containers
                         ↓
                Health Checks
                         ↓
            ✅ Live Application
```

### **Automated Deployment**
Every push to the `main` branch triggers:
1. Jenkins detects change via Poll SCM
2. Pulls latest code from GitHub
3. Builds new Docker images
4. Stops old containers
5. Starts new containers
6. Runs health checks
7. Notifies success/failure

## 📊 Database Schema
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DOUBLE PRECISION NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  imageUrl TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Testing

### **Manual Testing**
```bash
# Test Backend API
curl http://localhost:4000/api/products

# Test Health Endpoint
curl http://localhost:4000/health
```

### **CI/CD Testing**
1. Make a code change
2. Commit and push to GitHub
3. Wait 5 minutes for Jenkins to detect
4. Jenkins automatically builds and deploys
5. Verify changes in browser

## 📝 Project Structure
```
products-crud-docker_1/
├── Jenkinsfile              # CI/CD pipeline definition
├── docker-compose.yml       # Docker services orchestration
├── .env                     # Environment variables (gitignored)
├── .env.example             # Environment template
├── health-check.sh          # Health check script
├── README.md                # Project documentation
├── backend/
│   ├── Dockerfile           # Backend container definition
│   ├── package.json         # Backend dependencies
│   ├── server.js            # Express API server
│   └── prisma/
│       ├── schema.prisma    # Database schema
│       ├── seed.js          # Seed data script
│       └── migrations/      # Database migrations
└── frontend/
    ├── Dockerfile           # Frontend container definition
    ├── package.json         # Frontend dependencies
    ├── next.config.js       # Next.js configuration
    ├── app/
    │   ├── layout.js        # Root layout
    │   ├── globals.css      # Global styles
    │   └── products/        # Products pages
    └── components/          # React components
```

## 🔍 Monitoring

### **View Logs**
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs backend -f
docker compose logs frontend -f
docker compose logs database -f
```

### **Container Status**
```bash
docker compose ps
```

## 🧹 Cleanup
```bash
# Stop all containers
docker compose down

# Remove volumes (deletes data)
docker compose down -v

# Remove all images
docker system prune -a
```

## 👨‍💻 Author
**Ko Pyae Phyo (u6703451)**
- GitHub: [@shwepyaeshwe542-stack](https://github.com/shwepyaeshwe542-stack)

## 📄 License
MIT License

## 🙏 Acknowledgments
- Project created for DevOps course final assessment
- Demonstrates CI/CD, Docker, and full-stack development skills