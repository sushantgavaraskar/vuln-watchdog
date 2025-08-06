#!/bin/sh

# Production deployment script for VulnWatchdog Backend

echo "🚀 Starting VulnWatchdog Backend..."

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL is not set"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo "❌ Error: JWT_SECRET is not set"
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

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
    echo "❌ Failed to run database migrations"
    exit 1
fi

# Create uploads directory if it doesn't exist
echo "📁 Creating uploads directory..."
mkdir -p uploads

# Start the application
echo "🚀 Starting application..."
node server.js 