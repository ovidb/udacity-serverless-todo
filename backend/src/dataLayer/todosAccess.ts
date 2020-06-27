import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodoAccess')

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todoTable = process.env.TODOS_TABLE
  ) {}

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Getting all todos')

    const result = await this.docClient
      .query({
        TableName: this.todoTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items

    return items as TodoItem[]
  }
  async getTodo(userId: string, todoId: string): Promise<TodoItem[]> {
    logger.info('Getting todo', todoId)
    const result = await this.docClient
      .query({
        TableName: this.todoTable,
        KeyConditionExpression: 'userId = :userId AND todoId = :todoId',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':todoId': todoId
        }
      })
      .promise()

    const items = result.Items

    return items as TodoItem[]
  }
  async createTodo(todo: TodoItem): Promise<TodoItem> {
    logger.info('Creating todo:', todo)
    await this.docClient
      .put({
        TableName: this.todoTable,
        Item: todo
      })
      .promise()

    return todo
  }
  async updateTodo({
    todoId,
    userId,
    name,
    done,
    dueDate
  }: TodoItem): Promise<TodoItem> {
    try {
      await this.docClient
        .update({
          TableName: this.todoTable,
          Key: {
            todoId,
            userId
          },
          ExpressionAttributeNames: { '#N': 'name' },
          ExpressionAttributeValues: {
            ':name': name,
            ':done': done,
            ':dueDate': dueDate
          },
          UpdateExpression: 'set #N = :name, dueDate = :dueDate, done = :done',
          ReturnValues: 'UPDATED_NEW'
        })
        .promise()

      return updatedTodo
    } catch (e) {
      logger.error('Failed updating todo', todoId)
    }
  }
  async updateTodoUrl({ userId, todoId }: TodoItem): Promise<TodoItem> {
    try {
      await this.docClient
        .update({
          TableName: this.todoTable,
          Key: {
            userId,
            todoId
          },
          ExpressionAttributeNames: { '#A': 'attachmentUrl' },
          ExpressionAttributeValues: {
            ':attachmentUrl': updatedTodo.attachmentUrl
          },
          UpdateExpression: 'set #A = :attachmentUrl',
          ReturnValues: 'UPDATED_NEW'
        })
        .promise()

      return updatedTodo
    } catch (e) {
      logger.error('Failed updating todo url', todoId)
    }
  }
  async removeTodo(userId: string, todoId: string) {
    const params = {
      TableName: this.todoTable,
      Key: {
        todoId,
        userId
      }
    }
    await this.docClient
      .delete(params, function (err, data) {
        if (err) {
          logger.error('Unable to delete item', err)
        } else {
          logger.info('DeleteItem succeeded', data)
        }
      })
      .promise()
  }
}
