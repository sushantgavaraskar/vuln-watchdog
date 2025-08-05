#!/bin/bash

# Production deployment script for VulnWatchdog Backend

echo "🚀 Starting VulnWatchdog Backend deployment..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    exit 1
fi

# Check if JWT_SECRET is set
if [ -z "$JWT_SECRET" ]; then
    echo "❌ Error: JWT_SECRET environment variable is not set"
    exit 1
fi

echo "✅ Environment variables validated"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo "✅ Prisma client generated"

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
    echo "❌ Failed to run database migrations"
    exit 1
fi

echo "✅ Database migrations completed"

# Create uploads directory if it doesn't exist
mkdir -p uploads

# Start the application
echo "🚀 Starting VulnWatchdog Backend..."
npm start 