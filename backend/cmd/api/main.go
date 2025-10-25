package main

import (
	"backend/internal/db"
	"backend/internal/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	db.Init()

	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	r.POST("/users", handlers.CreateUsers)
	r.GET("/users", handlers.GetUsers)
	r.DELETE("/users/:id", handlers.DeleteUser)

	r.Run()
}
