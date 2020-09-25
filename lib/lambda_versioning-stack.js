"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const apigateway = require("@aws-cdk/aws-apigateway");
const lambda = require("@aws-cdk/aws-lambda");
const s3 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const aws_codedeploy_1 = require("@aws-cdk/aws-codedeploy");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const AWS = require('aws-sdk');
const S3 = new AWS.S3();
class LambdaVersioningStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Policy Statement
        const policyStatement = new aws_iam_1.PolicyStatement({
            resources: ['arn:aws:lambda:us-east-1:145674177909:function:lambdaVersion_alias'],
            actions: ['lambda:InvokeFunction', 's3:*', 'cloudwatch:*'],
            effect: aws_iam_1.Effect.ALLOW
        });
        // Managed Policy
        const versionMangPolicy = new aws_iam_1.ManagedPolicy(this, 'versionMangPolicy', {
            managedPolicyName: 'versionMangPolicy',
            statements: [policyStatement],
        });
        // Creating a role
        const versionFuncRole = new aws_iam_1.Role(this, 'versionFuncRole', {
            assumedBy: new aws_iam_1.ServicePrincipal('lambda.amazonaws.com')
        });
        // Attaching ManagedPolicy
        versionFuncRole.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));
        versionFuncRole.addManagedPolicy(versionMangPolicy);
        // S3 lambda bucket
        /*const bucket = new s3.Bucket(this, "WidgetStore", {
          bucketName: 'lambda-versioning-bucket',
          removalPolicy: RemovalPolicy.DESTROY,
          //versioned: true,
          publicReadAccess: false
        });*/
        const bucketFromArn = s3.Bucket.fromBucketArn(this, 'buildArnBucket', 'arn:aws:s3:::lambda-versioning-bucket');
        //const versionId:string =  GetBucketVersion.getLatestVersion("lambda-versioning-bucket", "lambdas.zip");
        //var versionId = GetBucketVersion.getLatestVersion("lambda-versioning-bucket", "lambdas.zip");
        //console.log('version: ', versionId);
        //Version lambda
        const object_version = " ";
        const versionLambda = new lambda.Function(this, "WidgetHandler", {
            functionName: 'lambdaVersion_alias',
            description: 'Tetsing lamabda version and alias',
            runtime: lambda.Runtime.NODEJS_10_X,
            //code: lambda.Code.fromAsset("lambdas"),
            code: lambda.Code.fromBucket(bucketFromArn, 'lambdas.zip'),
            handler: "widgets.main",
            memorySize: 512,
            maxEventAge: core_1.Duration.hours(1),
            currentVersionOptions: {
                description: 'Testing Version and alias',
                //removalPolicy: RemovalPolicy.RETAIN,
                retryAttempts: 1
            },
            environment: {
                BUCKET: bucketFromArn.bucketName
            }
        });
        //Event Source Trigger
        /*bucket.grantReadWrite(versionLambda);
        versionLambda.addEventSource(new S3EventSource(bucket, {
          events: [s3.EventType.OBJECT_CREATED_PUT],
          filters: [{ suffix: '.zip' }]
        }));*/
        // Dev alias
        const dev_alias = new aws_lambda_1.Alias(this, 'dev alias', {
            aliasName: 'dev',
            version: versionLambda.currentVersion
        });
        new aws_codedeploy_1.LambdaDeploymentGroup(this, 'DevDeploymentGroup', {
            alias: dev_alias,
            autoRollback: {
                failedDeployment: true
            }
        });
        bucketFromArn.grantReadWrite(versionLambda); // was: handler.role);
        const api = new apigateway.RestApi(this, "widgets-api", {
            restApiName: "versioningService",
            description: "This service serves widgets.",
            deployOptions: {
                stageName: 'dev',
                tracingEnabled: true
            }
        });
        const getWidgetsIntegration = new apigateway.LambdaIntegration(versionLambda, {
            requestTemplates: { "application/json": '{ "statusCode": "200" }' }
        });
        api.root.addMethod("GET", getWidgetsIntegration); // GET /
        const widget = api.root.addResource("{id}");
        // Add new widget to bucket with: POST /{id}
        const postWidgetIntegration = new apigateway.LambdaIntegration(versionLambda);
        // Get a specific widget from bucket with: GET /{id}
        const getWidgetIntegration = new apigateway.LambdaIntegration(versionLambda);
        // Remove a specific widget from the bucket with: DELETE /{id}
        const deleteWidgetIntegration = new apigateway.LambdaIntegration(versionLambda);
        widget.addMethod("POST", postWidgetIntegration);
        widget.addMethod("GET", getWidgetIntegration);
        widget.addMethod("DELETE", deleteWidgetIntegration);
    }
}
exports.LambdaVersioningStack = LambdaVersioningStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhX3ZlcnNpb25pbmctc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYW1iZGFfdmVyc2lvbmluZy1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFxQztBQUNyQyxzREFBc0Q7QUFDdEQsOENBQThDO0FBQzlDLHNDQUFzQztBQUN0Qyx3Q0FBd0Q7QUFDeEQsb0RBQTRDO0FBQzVDLDREQUFnRTtBQUVoRSw4Q0FBa0c7QUFFbEcsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQy9CLE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBRXhCLE1BQWEscUJBQXNCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDakQsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUNuRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixtQkFBbUI7UUFDbkIsTUFBTSxlQUFlLEdBQUcsSUFBSSx5QkFBZSxDQUFDO1lBQzFDLFNBQVMsRUFBRSxDQUFDLG9FQUFvRSxDQUFDO1lBQ2pGLE9BQU8sRUFBRSxDQUFDLHVCQUF1QixFQUFFLE1BQU0sRUFBRSxjQUFjLENBQUM7WUFDMUQsTUFBTSxFQUFFLGdCQUFNLENBQUMsS0FBSztTQUNyQixDQUFDLENBQUE7UUFFRixpQkFBaUI7UUFDakIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLHVCQUFhLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1lBQ3JFLGlCQUFpQixFQUFFLG1CQUFtQjtZQUN0QyxVQUFVLEVBQUUsQ0FBQyxlQUFlLENBQUM7U0FDOUIsQ0FBQyxDQUFDO1FBRUgsa0JBQWtCO1FBQ2xCLE1BQU0sZUFBZSxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUN4RCxTQUFTLEVBQUUsSUFBSSwwQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FB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QUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVoRixNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDOUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztJQUN0RCxDQUFDO0NBR0Y7QUFoSEQsc0RBZ0hDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gXCJAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheVwiO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gXCJAYXdzLWNkay9hd3MtbGFtYmRhXCI7XG5pbXBvcnQgKiBhcyBzMyBmcm9tIFwiQGF3cy1jZGsvYXdzLXMzXCI7XG5pbXBvcnQgeyBEdXJhdGlvbiwgUmVtb3ZhbFBvbGljeSB9IGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5pbXBvcnQgeyBBbGlhcyB9IGZyb20gXCJAYXdzLWNkay9hd3MtbGFtYmRhXCI7XG5pbXBvcnQgeyBMYW1iZGFEZXBsb3ltZW50R3JvdXAgfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWNvZGVkZXBsb3lcIjtcbmltcG9ydCB7IFMzRXZlbnRTb3VyY2UgfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWxhbWJkYS1ldmVudC1zb3VyY2VzXCI7XG5pbXBvcnQgeyBFZmZlY3QsIE1hbmFnZWRQb2xpY3ksIFBvbGljeVN0YXRlbWVudCwgUm9sZSwgU2VydmljZVByaW5jaXBhbCB9IGZyb20gXCJAYXdzLWNkay9hd3MtaWFtXCI7XG5pbXBvcnQgeyBHZXRCdWNrZXRWZXJzaW9uIH0gZnJvbSBcIi4vZ2V0X2J1Y2tldF92ZXJzaW9uXCI7XG5jb25zdCBBV1MgPSByZXF1aXJlKCdhd3Mtc2RrJyk7XG5jb25zdCBTMyA9IG5ldyBBV1MuUzMoKTtcblxuZXhwb3J0IGNsYXNzIExhbWJkYVZlcnNpb25pbmdTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gUG9saWN5IFN0YXRlbWVudFxuICAgIGNvbnN0IHBvbGljeVN0YXRlbWVudCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbJ2Fybjphd3M6bGFtYmRhOnVzLWVhc3QtMToxNDU2NzQxNzc5MDk6ZnVuY3Rpb246bGFtYmRhVmVyc2lvbl9hbGlhcyddLFxuICAgICAgYWN0aW9uczogWydsYW1iZGE6SW52b2tlRnVuY3Rpb24nLCAnczM6KicsICdjbG91ZHdhdGNoOionXSxcbiAgICAgIGVmZmVjdDogRWZmZWN0LkFMTE9XXG4gICAgfSlcblxuICAgIC8vIE1hbmFnZWQgUG9saWN5XG4gICAgY29uc3QgdmVyc2lvbk1hbmdQb2xpY3kgPSBuZXcgTWFuYWdlZFBvbGljeSh0aGlzLCAndmVyc2lvbk1hbmdQb2xpY3knLCB7XG4gICAgICBtYW5hZ2VkUG9saWN5TmFtZTogJ3ZlcnNpb25NYW5nUG9saWN5JyxcbiAgICAgIHN0YXRlbWVudHM6IFtwb2xpY3lTdGF0ZW1lbnRdLFxuICAgIH0pO1xuXG4gICAgLy8gQ3JlYXRpbmcgYSByb2xlXG4gICAgY29uc3QgdmVyc2lvbkZ1bmNSb2xlID0gbmV3IFJvbGUodGhpcywgJ3ZlcnNpb25GdW5jUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJylcbiAgICB9KTtcblxuICAgIC8vIEF0dGFjaGluZyBNYW5hZ2VkUG9saWN5XG4gICAgdmVyc2lvbkZ1bmNSb2xlLmFkZE1hbmFnZWRQb2xpY3koTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ3NlcnZpY2Utcm9sZS9BV1NMYW1iZGFCYXNpY0V4ZWN1dGlvblJvbGUnKSlcbiAgICB2ZXJzaW9uRnVuY1JvbGUuYWRkTWFuYWdlZFBvbGljeSh2ZXJzaW9uTWFuZ1BvbGljeSlcblxuICAgIC8vIFMzIGxhbWJkYSBidWNrZXRcbiAgICAvKmNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgXCJXaWRnZXRTdG9yZVwiLCB7XG4gICAgICBidWNrZXROYW1lOiAnbGFtYmRhLXZlcnNpb25pbmctYnVja2V0JyxcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIC8vdmVyc2lvbmVkOiB0cnVlLFxuICAgICAgcHVibGljUmVhZEFjY2VzczogZmFsc2VcbiAgICB9KTsqL1xuICAgIGNvbnN0IGJ1Y2tldEZyb21Bcm4gPSBzMy5CdWNrZXQuZnJvbUJ1Y2tldEFybih0aGlzLCAnYnVpbGRBcm5CdWNrZXQnLCAnYXJuOmF3czpzMzo6OmxhbWJkYS12ZXJzaW9uaW5nLWJ1Y2tldCcpOyAgXG4gICAgICBcbiAgICAvL2NvbnN0IHZlcnNpb25JZDpzdHJpbmcgPSAgR2V0QnVja2V0VmVyc2lvbi5nZXRMYXRlc3RWZXJzaW9uKFwibGFtYmRhLXZlcnNpb25pbmctYnVja2V0XCIsIFwibGFtYmRhcy56aXBcIik7XG4gICAgLy92YXIgdmVyc2lvbklkID0gR2V0QnVja2V0VmVyc2lvbi5nZXRMYXRlc3RWZXJzaW9uKFwibGFtYmRhLXZlcnNpb25pbmctYnVja2V0XCIsIFwibGFtYmRhcy56aXBcIik7XG4gICAgXG4gICAgLy9jb25zb2xlLmxvZygndmVyc2lvbjogJywgdmVyc2lvbklkKTtcbiAgICAvL1ZlcnNpb24gbGFtYmRhXG4gICAgY29uc3Qgb2JqZWN0X3ZlcnNpb24gPSBcIiBcIjtcbiAgICBjb25zdCB2ZXJzaW9uTGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCBcIldpZGdldEhhbmRsZXJcIiwge1xuICAgICAgZnVuY3Rpb25OYW1lOiAnbGFtYmRhVmVyc2lvbl9hbGlhcycsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RldHNpbmcgbGFtYWJkYSB2ZXJzaW9uIGFuZCBhbGlhcycsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTBfWCxcbiAgICAgIC8vY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KFwibGFtYmRhc1wiKSxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21CdWNrZXQoYnVja2V0RnJvbUFybiwgJ2xhbWJkYXMuemlwJyksXG4gICAgICBoYW5kbGVyOiBcIndpZGdldHMubWFpblwiLFxuICAgICAgbWVtb3J5U2l6ZTogNTEyLFxuICAgICAgbWF4RXZlbnRBZ2U6IER1cmF0aW9uLmhvdXJzKDEpLFxuICAgICAgY3VycmVudFZlcnNpb25PcHRpb25zOiB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVGVzdGluZyBWZXJzaW9uIGFuZCBhbGlhcycsXG4gICAgICAgIC8vcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5SRVRBSU4sXG4gICAgICAgIHJldHJ5QXR0ZW1wdHM6IDFcbiAgICAgIH0sXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBCVUNLRVQ6IGJ1Y2tldEZyb21Bcm4uYnVja2V0TmFtZVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy9FdmVudCBTb3VyY2UgVHJpZ2dlclxuICAgIC8qYnVja2V0LmdyYW50UmVhZFdyaXRlKHZlcnNpb25MYW1iZGEpO1xuICAgIHZlcnNpb25MYW1iZGEuYWRkRXZlbnRTb3VyY2UobmV3IFMzRXZlbnRTb3VyY2UoYnVja2V0LCB7XG4gICAgICBldmVudHM6IFtzMy5FdmVudFR5cGUuT0JKRUNUX0NSRUFURURfUFVUXSxcbiAgICAgIGZpbHRlcnM6IFt7IHN1ZmZpeDogJy56aXAnIH1dXG4gICAgfSkpOyovXG5cbiAgICAvLyBEZXYgYWxpYXNcbiAgICBjb25zdCBkZXZfYWxpYXMgPSBuZXcgQWxpYXModGhpcywgJ2RldiBhbGlhcycsIHtcbiAgICAgIGFsaWFzTmFtZTogJ2RldicsXG4gICAgICB2ZXJzaW9uOiB2ZXJzaW9uTGFtYmRhLmN1cnJlbnRWZXJzaW9uXG4gICAgfSlcbiAgICBuZXcgTGFtYmRhRGVwbG95bWVudEdyb3VwKHRoaXMsICdEZXZEZXBsb3ltZW50R3JvdXAnLCB7XG4gICAgICBhbGlhczogZGV2X2FsaWFzLFxuICAgICAgYXV0b1JvbGxiYWNrOiB7XG4gICAgICAgIGZhaWxlZERlcGxveW1lbnQ6IHRydWVcbiAgICAgIH1cbiAgICB9KVxuXG5cbiAgICBidWNrZXRGcm9tQXJuLmdyYW50UmVhZFdyaXRlKHZlcnNpb25MYW1iZGEpOyAvLyB3YXM6IGhhbmRsZXIucm9sZSk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaSh0aGlzLCBcIndpZGdldHMtYXBpXCIsIHtcbiAgICAgIHJlc3RBcGlOYW1lOiBcInZlcnNpb25pbmdTZXJ2aWNlXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJUaGlzIHNlcnZpY2Ugc2VydmVzIHdpZGdldHMuXCIsXG4gICAgICBkZXBsb3lPcHRpb25zOiB7XG4gICAgICAgIHN0YWdlTmFtZTogJ2RldicsXG4gICAgICAgIHRyYWNpbmdFbmFibGVkOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBnZXRXaWRnZXRzSW50ZWdyYXRpb24gPSBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbih2ZXJzaW9uTGFtYmRhLCB7XG4gICAgICByZXF1ZXN0VGVtcGxhdGVzOiB7IFwiYXBwbGljYXRpb24vanNvblwiOiAneyBcInN0YXR1c0NvZGVcIjogXCIyMDBcIiB9JyB9XG4gICAgfSk7XG5cbiAgICBhcGkucm9vdC5hZGRNZXRob2QoXCJHRVRcIiwgZ2V0V2lkZ2V0c0ludGVncmF0aW9uKTsgLy8gR0VUIC9cbiAgICBjb25zdCB3aWRnZXQgPSBhcGkucm9vdC5hZGRSZXNvdXJjZShcIntpZH1cIik7XG5cbiAgICAvLyBBZGQgbmV3IHdpZGdldCB0byBidWNrZXQgd2l0aDogUE9TVCAve2lkfVxuICAgIGNvbnN0IHBvc3RXaWRnZXRJbnRlZ3JhdGlvbiA9IG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKHZlcnNpb25MYW1iZGEpO1xuXG4gICAgLy8gR2V0IGEgc3BlY2lmaWMgd2lkZ2V0IGZyb20gYnVja2V0IHdpdGg6IEdFVCAve2lkfVxuICAgIGNvbnN0IGdldFdpZGdldEludGVncmF0aW9uID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24odmVyc2lvbkxhbWJkYSk7XG5cbiAgICAvLyBSZW1vdmUgYSBzcGVjaWZpYyB3aWRnZXQgZnJvbSB0aGUgYnVja2V0IHdpdGg6IERFTEVURSAve2lkfVxuICAgIGNvbnN0IGRlbGV0ZVdpZGdldEludGVncmF0aW9uID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24odmVyc2lvbkxhbWJkYSk7XG5cbiAgICB3aWRnZXQuYWRkTWV0aG9kKFwiUE9TVFwiLCBwb3N0V2lkZ2V0SW50ZWdyYXRpb24pO1xuICAgIHdpZGdldC5hZGRNZXRob2QoXCJHRVRcIiwgZ2V0V2lkZ2V0SW50ZWdyYXRpb24pO1xuICAgIHdpZGdldC5hZGRNZXRob2QoXCJERUxFVEVcIiwgZGVsZXRlV2lkZ2V0SW50ZWdyYXRpb24pO1xuICB9XG5cbiAgXG59XG5cbiJdfQ==