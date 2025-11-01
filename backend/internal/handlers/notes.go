package handlers

import (
	"backend/internal/db"
	"backend/internal/models"
	"backend/internal/queue"
	"context"
	"fmt"
	"net/http"
	"strconv"
	"time"

    "github.com/aws/aws-sdk-go-v2/aws"
    "github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
    "github.com/aws/aws-sdk-go-v2/service/dynamodb"
    "github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/gin-gonic/gin"
)

var notesTable = "notes"

func CreateNote(c *gin.Context) {
    userIdParam := c.Param("userId")
    userId, err := strconv.Atoi(userIdParam)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid userId"})
        return
    }

    var note models.Note
    if err := c.BindJSON(&note); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
        return
    }

    if err := validate.Struct(note); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    note.ID = time.Now().Unix()
    note.UserID = int64(userId)
    note.CreatedAt = time.Now().Unix()

    item, err := attributevalue.MarshalMap(note)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    _, err = db.Client.PutItem(context.TODO(), &dynamodb.PutItemInput{
        TableName: &notesTable,
        Item:      item,
    })
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

	// Send notification to SQS
	err = queue.SendMessage(map[string]interface{}{
		"type":    "note_created",
		"user_id": note.UserID,
		"note":    note,
		"created_at": note.CreatedAt,
	})
	if err != nil {
		fmt.Println("Failed to send SQS message:", err)
	}

    c.JSON(http.StatusOK, note)
}

func GetNotesByUser(c *gin.Context) {
    userIdParam := c.Param("userId")
    userId, err := strconv.ParseInt(userIdParam, 10, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid userId"})
        return
    }

		out, err := db.Client.Scan(context.TODO(), &dynamodb.ScanInput{
			TableName: &notesTable,
			FilterExpression:     aws.String("user_id = :uid"),
			ExpressionAttributeValues: map[string]types.AttributeValue{
				":uid": &types.AttributeValueMemberN{Value: fmt.Sprint(userId)},
			},
		})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    var notes []models.Note
    if err := attributevalue.UnmarshalListOfMaps(out.Items, &notes); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, notes)
}
