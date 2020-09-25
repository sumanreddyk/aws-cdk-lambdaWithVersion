import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";
import { Duration, RemovalPolicy } from "@aws-cdk/core";
import { Alias } from "@aws-cdk/aws-lambda";
import { LambdaDeploymentGroup } from "@aws-cdk/aws-codedeploy";
import { S3EventSource } from "@aws-cdk/aws-lambda-event-sources";
import { Effect, ManagedPolicy, PolicyStatement, Role, ServicePrincipal } from "@aws-cdk/aws-iam";
import { GetBucketVersion } from "./get_bucket_version";
const AWS = require('aws-sdk');
const S3 = new AWS.S3();

export class LambdaVersioningStack extends cdk.Stack {
   constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Policy Statement
    const policyStatement = new PolicyStatement({
      resources: ['arn:aws:lambda:us-east-1:145674177909:function:lambdaVersion_alias'],
      actions: ['lambda:InvokeFunction', 's3:*', 'cloudwatch:*'],
      effect: Effect.ALLOW
    })

    // Managed Policy
    const versionMangPolicy = new ManagedPolicy(this, 'versionMangPolicy', {
      managedPolicyName: 'versionMangPolicy',
      statements: [policyStatement],
    });

    // Creating a role
    const versionFuncRole = new Role(this, 'versionFuncRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com')
    });

    // Attaching ManagedPolicy
    versionFuncRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'))
    versionFuncRole.addManagedPolicy(versionMangPolicy)

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
      maxEventAge: Duration.hours(1),
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
    const dev_alias = new Alias(this, 'dev alias', {
      aliasName: 'dev',
      version: versionLambda.currentVersion
    })
    new LambdaDeploymentGroup(this, 'DevDeploymentGroup', {
      alias: dev_alias,
      autoRollback: {
        failedDeployment: true
      }
    })


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

