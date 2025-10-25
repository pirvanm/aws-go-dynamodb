package db

import (
	"context"
	"fmt"
	"log"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

var Client *dynamodb.Client

func Init() {
	// load aws configuration
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	Client = dynamodb.NewFromConfig(cfg)

	// check dynamodb connection
	out, err := Client.ListTables(context.TODO(), &dynamodb.ListTablesInput{})
	if err != nil {
		log.Fatalf("DynamoDB connection failed: %v", err)
	}
	fmt.Println("DynamoDB connected! Tables:", out.TableNames)
}
