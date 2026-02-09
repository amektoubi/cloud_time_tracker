#!/bin/bash

# Cloud Time Tracker - Local Development Script
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Cloud Time Tracker - Development Setup"
echo "========================================"

# Function to check dependencies
check_dependencies() {
    echo "🔍 Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    echo "✅ Dependencies check passed"
}

# Function to start services
start_services() {
    echo "🏗️  Starting services with Docker Compose..."
    
    # Pull latest images first
    docker-compose pull postgres pgadmin
    
    # Build and start services
    docker-compose up --build -d
    
    echo "⏳ Waiting for services to be ready..."
    sleep 10
    
    # Check if services are healthy
    if docker-compose ps | grep -q "Up (healthy)"; then
        echo "✅ Services are healthy and running"
    else
        echo "⚠️  Some services may still be starting up. Check status with: docker-compose ps"
    fi
}

# Function to show status
show_status() {
    echo ""
    echo "📊 Service Status:"
    docker-compose ps
    
    echo ""
    echo "🌐 Service URLs:"
    echo "  • Application: http://localhost:8080"
    echo "  • API: http://localhost:8080/persons"
    echo "  • Health Check: http://localhost:8080/health"
    echo "  • pgAdmin: http://localhost:5050"
    echo "    - Email: admin@cloudtimestracker.com"
    echo "    - Password: admin"
}

# Function to stop services
stop_services() {
    echo "🛑 Stopping services..."
    docker-compose down
    echo "✅ Services stopped"
}

# Function to show logs
show_logs() {
    echo "📋 Showing logs (last 50 lines). Press Ctrl+C to exit:"
    echo ""
    docker-compose logs -f --tail=50
}

# Function to clean up
cleanup() {
    echo "🧹 Cleaning up Docker resources..."
    docker-compose down -v
    docker system prune -f
    echo "✅ Cleanup completed"
}

# Main menu
case "${1:-start}" in
    "start")
        check_dependencies
        start_services
        show_status
        ;;
    "stop")
        stop_services
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "cleanup")
        cleanup
        ;;
    "restart")
        stop_services
        start_services
        show_status
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  start     - Start all services (default)"
        echo "  stop      - Stop all services"
        echo "  restart   - Restart all services"
        echo "  status    - Show service status and URLs"
        echo "  logs      - Show service logs (follow mode)"
        echo "  cleanup   - Stop services and clean up Docker resources"
        echo "  help      - Show this help message"
        echo ""
        echo "Quick start:"
        echo "  $0 start    # Start all services"
        echo "  $0 status   # Check if everything is running"
        echo "  $0 logs     # View logs if there are issues"
        echo "  $0 stop     # Stop all services"
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo "Use '$0 help' to see available commands"
        exit 1
        ;;
esac