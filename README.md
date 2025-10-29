# Rydar – Navigation and Discovery for Informal Transport

## Overview

Rydar is redefining how people move through Africa’s informal transport networks. In cities accross Nigeria, millions rely on shared taxis, minibuses, and tricycles—affordable yet offline systems that force riders to guess routes, stops, and timing.

Rydar makes this invisible network visible. Enter a start and destination to see real, multi-leg routes with walk segments, informal rides, and transfers. The app highlights pickup spots, shows active driver corridors, and alerts you when to alight. Drivers can share availability effortlessly, staying true to how they already work.

By digitizing everyday mobility, Rydar turns chaos into clarity—making informal transport reliable, connected, and ready to scale across Africa.

**Project partners:** y-mpofu · siisodaa · uosondu

## Key Features

- **Driver visibility:** signal availability and seats left
- **Rider tools:** multi-leg routing, ETAs, discreet alight alerts
- **Privacy first:** no default photo or video capture, passive stop detection, anonymous reporting
- **Low-friction access:** USSD/SMS fallback for non-smartphone users

## Pilot plan

- Launch in one dense corridor with union and NGO partners and the project team (y-mpofu, siisodaa, uosondu)
- Recruit small cohorts of drivers and riders, offer short incentives, and measure income uplift and trip completion
- Iterate quickly based on field feedback

---

## Setup & Running the Project

Rydar consists of two components:

- **Backend** – Java Spring Boot API
- **Mobile App** – React Native (Expo)

Follow the steps below to install and run both parts locally.

### 1) Clone the Repository

```bash
git clone https://github.com/your-username/rydar.git
cd rydar
```

---

### 2) Run the Backend (Java)

#### **Prerequisites**

- Java **17+** (Java 21 recommended)
- **PostgreSQL** (for database)
- macOS system with **Homebrew** installed
- Open the **backend** folder as a standalone project, not as part of the entire rydar folder, in any IDE (intelliJ / VS Code).
  For example: Enter your IDE, Click open, and click directly on the backend folder in rydar.

Make sure Java is installed:

```bash
java -version
```

If not, install it (for example):

```bash
brew install openjdk@21
echo 'export PATH="/usr/local/opt/openjdk@21/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

#### **Database Setup (PostgreSQL on macOS)**

Rydar uses **PostgreSQL** for local development.
You can use **any username and password** you prefer — just make sure they match in both Postgres and your `.env` file.

##### **1. Install and start PostgreSQL**

```bash
brew install postgresql
brew services start postgresql
```

Verify installation:

```bash
psql --version
```

---

##### **2. Create the database and user**

Open the Postgres shell:

```bash
psql postgres
```

Then run:

```sql
CREATE DATABASE rydar_dev;
CREATE USER rydar_user WITH PASSWORD 'RydarPass123@';
GRANT ALL PRIVILEGES ON DATABASE rydar_dev TO rydar_user;
\q
```

---

##### **3. Add your credentials**

In the `backend` folder, create a file named `.env`:

```bash
cd backend
echo "DB_USERNAME=rydar_user" > .env
echo "DB_PASSWORD=RydarPass123@" >> .env
```

Spring Boot will automatically read these values when you run the app.

---

##### **4. Verify**

Start the backend:

```bash
./gradlew clean build --refresh-dependencies
```

If the build fails, note the error and reach out to the team/ or ask AI.

if the build is successful, run:

```bash
./gradlew bootRun
```

If everything is correct, you’ll see Hibernate create tables and the app will run at:

- **API root:** [http://localhost:8080](http://localhost:8080)
- **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

#### **View Backend API Documentation**

Once the backend is running, you can access the automatically generated OpenAPI documentation via **SpringDoc**:

- **Swagger UI (interactive docs):**
  [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

### 3) Run the Mobile App (Expo)

#### **Prerequisites**

- Node.js **18+**
- npm (or yarn)
- **IMPORTANT:** Open the **mobile-app** folder as a standalone project in any IDE (VS Code)
- Expo CLI (global install, one time):

```bash
npm install -g expo-cli
```

#### **Commands**

```bash
cd ../mobile-app
npm install
npm start
```

This opens the Expo developer tools. Then:

- Press **a** to open Android emulator
- Press **i** to open iOS simulator (Mac only)
- Or scan the QR code with the **Expo Go** app on your phone
