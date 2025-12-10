# Rydar – Navigation and Discovery for Informal Transport

## Overview

Rydar is redefining how people move through Africa’s informal transport networks. In cities accross Nigeria, millions rely on shared taxis, minibuses, and tricycles—affordable yet offline systems that force riders to guess routes, stops, and timing.

Rydar makes this invisible network visible. Enter a start and destination to see real, multi-leg routes with walk segments, informal rides, and transfers. The app highlights pickup spots, shows active driver corridors, and alerts you when to alight. Drivers can share availability effortlessly, staying true to how they already work.

By digitizing everyday mobility, Rydar turns chaos into clarity—making informal transport reliable, connected, and ready to scale across Africa.

**What this app actually is:**  
Rydar is an **early-stage working application** that brings informal transport routing, driver visibility, and stop detection into a functional mobile experience. The backend—covering routing logic, user accounts, driver workflows, and live corridor updates—is now **hosted online**, which means users only need to run the mobile app locally. At this stage, Rydar is a **feature-complete foundation** for the transport ecosystem we’re building: the APIs are live, the routing engine responds to real inputs, and the mobile frontend communicates directly with production-like services. Future milestones will refine accuracy, expand pilot coverage, and prepare the system for deployment in the field.

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

- **Backend** – Hosted online (no local setup required)
- **Mobile App** – React Native (Expo)

Follow the steps below to install and run the mobile app locally.  
The backend is already deployed and the app will automatically connect to it.

### 1) Clone the Repository

```bash
git clone https://github.com/your-username/rydar.git
cd rydar
