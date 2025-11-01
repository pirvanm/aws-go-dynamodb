package main

import (
	"backend/internal/db"
	"backend/internal/queue"
	"backend/internal/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	// init sqs queue
	queue.Init("#")
	db.Init()

	// start worker ( listen for queue messages and saves them in a dynamodb notifications table )
	startWorker()

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

	r.GET("/notifications", handlers.GetNotifications)

	r.POST("/users", handlers.CreateUsers)
	r.GET("/users", handlers.GetUsers)
	r.DELETE("/users/:id", handlers.DeleteUser)

	r.POST("/:userId/notes", handlers.CreateNote)
    r.GET("/:userId/notes", handlers.GetNotesByUser)

	r.Run()
}
