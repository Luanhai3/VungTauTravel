🌴 VungTauTravel

VungTauTravel is a modern travel platform designed to help users explore destinations, accommodations, and travel services in Vũng Tàu.
The project is built with a modern full-stack architecture using Next.js, Prisma, and PostgreSQL, optimized for scalability and performance.

✨ Features

🌍 Explore popular travel destinations in Vũng Tàu

🏨 Browse hotels and accommodation services

📅 Booking system for travel services

🤖 AI travel planner for personalized itineraries

🧑‍💻 Admin dashboard for managing locations and services

☁️ Cloud-ready architecture (AWS compatible)

🧱 Tech Stack
Frontend

Next.js

React

Tailwind CSS

Framer Motion

Backend

Node.js API routes

Prisma

PostgreSQL

Cloud Infrastructure

Vercel

Amazon EC2

Amazon S3

Amazon RDS

Amazon CloudFront

🚀 Getting Started
1. Clone the repository
git clone https://github.com/yourusername/vungtautravel.git
cd vungtautravel
2. Install dependencies
npm install

or

yarn install
3. Setup environment variables

Create a .env file in the root directory.

Example:

DATABASE_URL="postgresql://user:password@localhost:5432/vungtautravel"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
OPENAI_API_KEY="your_api_key"
4. Run development server
npm run dev

Open your browser at:

http://localhost:3000
🗄 Database Setup

This project uses Prisma ORM with PostgreSQL.

Generate Prisma client:

npx prisma generate

Run migrations:

npx prisma migrate dev

Open Prisma Studio:

npx prisma studio
🏗 Project Structure
vungtautravel
│
├── app
│   ├── admin
│   ├── api
│   ├── dia-diem
│   ├── dich-vu
│
├── components
│   ├── layout
│   ├── ui
│
├── prisma
│   └── schema.prisma
│
├── public
│
└── styles
⚙️ Production Deployment

The application can be deployed using a scalable cloud architecture:

Frontend (Next.js)
      ↓
Vercel
      ↓
API Server (EC2)
      ↓
Prisma ORM
      ↓
PostgreSQL (RDS)
      ↓
Images (S3)
      ↓
CDN (CloudFront)

This architecture supports high performance and large traffic scaling.

📦 Build for Production
npm run build
npm start
🔄 CI/CD Pipeline

Continuous deployment can be configured with:

GitHub Actions

Automatic deployment to EC2 on every git push

Pipeline flow:

Developer Push
     ↓
GitHub
     ↓
GitHub Actions
     ↓
Deploy to EC2
     ↓
Build & Restart Server
🤝 Contributing

Contributions are welcome.
Feel free to open issues or submit pull requests.

📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Louis Hoàng

Software Developer
Focused on building scalable web platforms and cloud-native applications.
