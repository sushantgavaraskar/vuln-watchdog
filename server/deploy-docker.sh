#!/bin/bash

# Docker Compose deployment script for VulnWatchdog Backend

echo "🚀 Starting VulnWatchdog Backend with Docker Compose..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please create a .env file with the following variables:"
    echo "JWT_SECRET=your-jwt-secret"
    echo "EMAIL_USER=your-email@gmail.com"
    echo "EMAIL_PASS=your-app-password"
    echo "EMAIL_FROM=your-email@gmail.com"
    exit 1
fi

# Check required environment variables
source .env

if [ -z "$JWT_SECRET" ]; then
    echo "❌ Error: JWT_SECRET is not set in .env file"
    exit 1
fi

if [ -z "$EMAIL_USER" ]; then
    echo "❌ Error: EMAIL_USER is not set in .env file"
    exit 1
fi

if [ -z "$EMAIL_PASS" ]; then
    echo "❌ Error: EMAIL_PASS is not set in .env file"
    exit 1
fi

if [ -z "$EMAIL_FROM" ]; then
    echo "❌ Error: EMAIL_FROM is not set in .env file"
    exit 1
fi

echo "✅ Environment variables validated"

# Build and start services
echo "🔧 Building and starting services..."
docker-compose up --build -d

if [ $? -eq 0 ]; then
    echo "✅ Services started successfully!"
    echo "🌐 Backend API: http://localhost:5000"
    echo "📚 API Documentation: http://localhost:5000/api/docs"
    echo "💾 Database: PostgreSQL on localhost:5432"
    echo ""
    echo "📋 Useful commands:"
    echo "  View logs: docker-compose logs -f"
    echo "  Stop services: docker-compose down"
    echo "  Restart services: docker-compose restart"
else
    echo "❌ Failed to start services"
    exit 1
fi 