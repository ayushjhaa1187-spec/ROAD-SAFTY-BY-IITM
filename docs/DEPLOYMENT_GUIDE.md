# 🚀 Deployment Guide: RoadWatch 360

This guide outlines the steps to deploy the RoadWatch 360 platform, including the Frontend (Next.js), Backend (Express/Node.js), and AI Microservice (FastAPI/Python).

## 🏗️ Architecture Overview

The system consists of three independent services:
1. **Frontend**: Next.js 15 (Vercel)
2. **Main Backend**: Express 5 + MongoDB Atlas (Render)
3. **AI Microservice**: FastAPI + YOLOv8 (Render or Hugging Face)
4. **Auth & Storage**: Supabase (Free Tier)

---

## 🛠️ Step 1: Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free Shared Cluster.
2. Create a database named `roadwatch`.
3. Create a Database User with read/write access and a strong password.
4. In **Network Access**, whitelist `0.0.0.0/0` (or the specific IP of your deployment service).
5. Copy your **Connection String** (SRV):
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/roadwatch?retryWrites=true&w=majority`

---

## 🛠️ Step 2: Main Backend Deployment (Render)

1. Sign in to [Render.com](https://render.com/).
2. Click **New** → **Web Service** → **Build and deploy from a Git repository**.
3. Select this repository and set the **Root Directory** to `server`.
4. Set **Build Command** to `npm install` and **Start Command** to `node src/index.js` (or your chosen production start script).
5. Open the **Environment Variables** section and add:
   - `PORT`: `5000`
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `GOOGLE_GENERATIVE_AI_API_KEY`: Your Gemini API Key.
   - `NODE_ENV`: `production`
   - `CV_SERVICE_URL`: URL of your deployed AI Microservice (see Step 3).
6. Click **Create Web Service** and Render will deploy it.

---

## 🛠️ Step 3: AI Microservice Deployment (Render)

1. In the Render dashboard, click **New** → **Web Service** → **Build and deploy from a Git repository**.
2. Select this repository and set the **Root Directory** to `cv-service`.
3. Set the **Build Command**: `pip install -r requirements.txt`.
4. Set the **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`. (Render automatically injects the `$PORT` variable).
5. Once deployed, copy the **Public URL** (e.g., `https://cv-service-xxxxx.onrender.com`) and update the `CV_SERVICE_URL` in your Main Backend on Render.

*(Note: If Render's cold-start on the free tier is too slow for the image processing, **Hugging Face Spaces** using a Docker template is an excellent completely free alternative for Python/YOLOv8 services.)*

---

## 🛠️ Step 4: Frontend Deployment (Vercel)

1. Sign in to [Vercel](https://vercel.com/).
2. **Import Project** → Select this repository.
3. Set the **Root Directory** to `.` (the project root).
4. Add the following **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
   - `GOOGLE_GENERATIVE_AI_API_KEY`: Your Gemini API Key.
   - `NEXT_PUBLIC_APP_URL`: Your Vercel deployment URL (e.g., `https://roadwatch360.vercel.app`).
5. Click **Deploy**.

---

## 🛠️ Step 5: Supabase Configuration

1. Log in to the [Supabase Dashboard](https://supabase.com/).
2. If you have an `initial_schema.sql`, run it in the **SQL Editor**. 
3. Go to **Storage** and create a bucket named `report-media`. Set it to **Public**.
4. Create an **ACL rule** to allow authenticated users to upload to `report-media`.

---

## 🧪 Step 6: Seeding Demo Data

Once everything is live, you can seed the database with demo reports:
1. Locally, update your `server/.env` with the production `MONGODB_URI`.
2. Run:
   ```bash
   cd server
   node src/scripts/seedDemoData.js
   ```

---

## 🏁 Verification

- **Frontend**: Navigate to your Vercel URL and ensure you can sign in.
- **Reporting**: Create a test report with an image and verify AI analysis works.
- **Admin**: Check the dashboard to see if the new report appears on the map.
