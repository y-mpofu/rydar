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

### 2) Run the Backend (Java)

**Prerequisites**

- Java **17+** (Java 21 recommended)

**Commands**

Mac/Linux:

```bash
cd backend
./gradlew bootRun
```

Windows:

```bash
cd backend
gradlew.bat bootRun
```

- Gradle will download all dependencies automatically.
- The API starts at **[http://localhost:8080](http://localhost:8080)**.

> If Java isn’t installed, download a JDK (for example from [Oracle](https://www.oracle.com/java/technologies/downloads/)) and ensure `java -version` works in your terminal.

### 3) Run the Mobile App (Expo)

**Prerequisites**

- Node.js **18+**
- npm (or yarn)
- Expo CLI (global install, one time):

```bash
npm install -g expo-cli
```

**Commands**

```bash
cd ../mobile-app
npm install
npm start
```

This opens the Expo developer tools. Then:

- Press **a** to open Android emulator
- Press **i** to open iOS simulator (Mac only)
- Or scan the QR code with the **Expo Go** app on your phone
