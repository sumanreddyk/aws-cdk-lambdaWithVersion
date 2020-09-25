import cdk = require('@aws-cdk/core');
import sqs = require('@aws-cdk/aws-sqs');
import sns = require('@aws-cdk/aws-sns');
import subs = require('@aws-cdk/aws-sns-subscriptions');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import s3n = require('@aws-cdk/aws-s3-notifications');
import lambda = require('@aws-cdk/aws-lambda');
import fs = require('fs');
import { QueuePolicy } from '@aws-cdk/aws-sqs';
import { AnyPrincipal, Effect, PolicyStatement } from '@aws-cdk/aws-iam';

export class SNSSQSStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const UploadQueue = new sqs.Queue(this, 'UploadQueue', {
            queueName: 'uploads-queue'
        });

        // Queue policy
        const policy = new QueuePolicy(this, 'sendWelcomeEmailQueuePolicy', {
            queues: [UploadQueue]
          });
      
          policy.document.addStatements(
            new PolicyStatement({
              principals: [new AnyPrincipal()],
              effect: Effect.ALLOW,
              actions: ['SQS:*']
            })
          );
        /*const QueuePolicy = new sqs.CfnQueuePolicy(this, 'QueuePolicy', {
            policyDocument: new iam.PolicyDocument({
                statements: [
                    new iam.PolicyStatement({
                        effect: iam.Effect.ALLOW,
                        principals: [new iam.AnyPrincipal()],
                        actions: ['sqs:SendMessage'],
                        resources: ['*']
                    })
                ]
            }),
            queues: ['UploadQueue']
        });*/
    }
}