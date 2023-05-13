#!/bin/bash

# Navigate to the frontend directory and run frontend
cd frontend
npm start &

# Navigate to the backend directory and run backend
cd ../backend
npm run app_dev 
