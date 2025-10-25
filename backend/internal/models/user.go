package models

type User struct {
	ID    int64  `dynamodbav:"id" json:"id"`
	Name  string `dynamodbav:"name" json:"name" validate:"required,min=2"`
	Email string `dynamodbav:"email" json:"email" validate:"required,email"`
}
