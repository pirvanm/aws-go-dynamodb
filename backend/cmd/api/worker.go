package main

import (
    "context"
    "encoding/json"
    "fmt"
    "time"

    "backend/internal/db"
    "backend/internal/queue"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

var TableNotifications = "Notifications"

func startWorker() {
    go func() {
        for {
            messages, err := queue.ReceiveMessages(10)
            if err != nil {
                fmt.Println("Error receiving messages:", err)
                time.Sleep(5 * time.Second)
                continue
            }

            for _, msg := range messages {
                var notif map[string]interface{}
                if err := json.Unmarshal([]byte(msg), &notif); err != nil {
                    fmt.Println("Failed to parse SQS message:", err)
                    continue
                }

                // Save to DynamoDB notifications table
                item := map[string]types.AttributeValue{
                    "id":         &types.AttributeValueMemberN{Value: fmt.Sprint(time.Now().UnixNano())},
                    "user_id":    &types.AttributeValueMemberN{Value: fmt.Sprint(int64(notif["user_id"].(float64)))},
                    "type":       &types.AttributeValueMemberS{Value: notif["type"].(string)},
                    "payload":    &types.AttributeValueMemberS{Value: string(msg)},
                    "created_at": &types.AttributeValueMemberN{Value: fmt.Sprint(int64(notif["created_at"].(float64)))},
                }

                _, err := db.Client.PutItem(context.TODO(), &dynamodb.PutItemInput{
                    TableName: &TableNotifications,
                    Item:      item,
                })
                if err != nil {
                    fmt.Println("Failed to save notification:", err)
                } else {
                    fmt.Println("Notification saved for user:", notif["user_id"])
                }
            }

            time.Sleep(1 * time.Second)
        }
    }()
}
