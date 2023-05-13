#!/bin/bash

# Navigate to the backend directory and install dependencies
cd backend
npm install

# Navigate to the frontend directory and install dependencies
cd ../frontend
npm install

# Build the frontend
npm run build

