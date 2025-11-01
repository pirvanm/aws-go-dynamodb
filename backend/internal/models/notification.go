package models

type Notification struct {
    ID        int64       `json:"id"  dynamodbav:"id"`
    UserID    int64       `json:"user_id"  dynamodbav:"user_id"`
    Type      string      `json:"type"  dynamodbav:"type"`
    Payload   string      `json:"payload"  dynamodbav:"payload"`
    CreatedAt int64       `json:"created_at"  dynamodbav:"created_at"`
}
