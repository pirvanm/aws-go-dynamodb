package models

type Note struct {
    ID        int64  `json:"id" dynamodbav:"id"`
    UserID    int64  `json:"userId" dynamodbav:"user_id"`
    Title     string `json:"title" validate:"required"  dynamodbav:"title"`
    Content   string `json:"content" validate:"required"  dynamodbav:"content"`
    CreatedAt int64  `json:"createdAt"  dynamodbav:"created_at"`
}