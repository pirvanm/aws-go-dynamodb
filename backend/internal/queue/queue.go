package queue

import (
    "context"
    "fmt"
    "encoding/json"

    "github.com/aws/aws-sdk-go-v2/aws"
    "github.com/aws/aws-sdk-go-v2/config"
    "github.com/aws/aws-sdk-go-v2/service/sqs"
)

var Client *sqs.Client
var QueueUrl string

func Init(queueUrl string) error {
    cfg, err := config.LoadDefaultConfig(context.TODO(),
        config.WithRegion("us-east-1"),
    )
    if err != nil {
        return fmt.Errorf("failed to load AWS config: %w", err)
    }

    Client = sqs.NewFromConfig(cfg)
    QueueUrl = queueUrl
    return nil
}

func SendMessage(payload interface{}) error {
    msgBody, err := json.Marshal(payload)
    if err != nil {
        return fmt.Errorf("failed to marshal payload: %w", err)
    }

    _, err = Client.SendMessage(context.TODO(), &sqs.SendMessageInput{
        QueueUrl:    &QueueUrl,
        MessageBody: aws.String(string(msgBody)),
    })

    return err
}

func ReceiveMessages(max int32) ([]string, error) {
    resp, err := Client.ReceiveMessage(context.TODO(), &sqs.ReceiveMessageInput{
        QueueUrl:            &QueueUrl,
        MaxNumberOfMessages: max,
        WaitTimeSeconds:     10,
    })
    if err != nil {
        return nil, fmt.Errorf("receive message failed: %w", err)
    }

    var messages []string
    for _, msg := range resp.Messages {
        messages = append(messages, *msg.Body)

        _, _ = Client.DeleteMessage(context.TODO(), &sqs.DeleteMessageInput{
            QueueUrl:      &QueueUrl,
            ReceiptHandle: msg.ReceiptHandle,
        })
    }

    return messages, nil
}
