#!/usr/bin/env python3
import uvicorn
import config

if __name__ == "__main__":
    print(f"Starting server at http://{config.API_HOST}:{config.API_PORT}")
    print("API documentation available at: http://localhost:8000/docs")
    print("Press CTRL+C to stop")
    
    uvicorn.run(
        "main:app",
        host=config.API_HOST,
        port=config.API_PORT,
        reload=config.DEBUG_MODE
    )