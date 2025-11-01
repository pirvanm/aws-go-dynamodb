package handlers

import (
    "backend/internal/db"
    "backend/internal/models"
    "context"
    "net/http"

    "github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
    "github.com/aws/aws-sdk-go-v2/service/dynamodb"
    "github.com/gin-gonic/gin"
)

var notificationsTable = "Notifications"

func GetNotifications(c *gin.Context) {
    out, err := db.Client.Scan(context.TODO(), &dynamodb.ScanInput{
        TableName: &notificationsTable,
    })
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    var notifications []models.Notification
    if err := attributevalue.UnmarshalListOfMaps(out.Items, &notifications); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse notifications"})
        return
    }

    c.JSON(http.StatusOK, notifications)
}
