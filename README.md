# Pleny Assessment - Backend

This repository contains the backend infrastructure for the Pleny Assessment. The project is divided into two main components: the core NestJS REST API and standalone Data Scripts.

---

## Part 1: NestJS API

The core application is a modular RESTful API built using [NestJS](https://nestjs.com/) and MongoDB (via Mongoose). 

### Core Features
- **Users & Restaurants Management**: Endpoints to manage user profiles, restaurant documents, and relational data (like users following restaurants).
- **Spatial Querying**: Utilizes MongoDB's geospatial indexing (`$near`, `$geoWithin`) to perform location-based searches and find nearby entities.
- **Recommendation Aggregation**: Employs advanced MongoDB aggregation pipelines to compile, score, and return tailored recommendations for users.

### Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/pleny
   PORT=3000
   ```

3. **Run the API**
   ```bash
   # Watch mode for local development
   npm run start:dev
   ```

---

## Part 2: Data Scripts

The `data-scripts/` directory contains standalone, isolated TypeScript scripts designed for database administration, maintenance, and testing.

### Core Features
- **Dirty Data Transformation**: Scripts that connect directly to the database to process, validate, and normalize "dirty" or unstructured data in-place (e.g., standardizing brand names, repairing founded years, and fixing location counts).
- **Seeding & Boundaries**: Automated seeding scripts powered by Faker.js to quickly populate the database with realistic mock data, generate geospatial boundaries, and stress-test the API's aggregation endpoints.

### Running the Scripts

You can execute the standalone scripts using `ts-node` directly from the backend root:

```bash
# Example: Run the in-place data transformation script
npx ts-node data-scripts/src/transform.ts
```

```bash
# Example: Run the data seeding script
npx ts-node data-scripts/src/seed.ts
```
