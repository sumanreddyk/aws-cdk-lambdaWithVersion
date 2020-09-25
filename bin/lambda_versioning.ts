#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LambdaVersioningStack } from '../lib/lambda_versioning-stack';
import { SNSSQSStack } from '../lib/snsqueue';

const app = new cdk.App();
new LambdaVersioningStack(app, 'LambdaVersioningStack');
new SNSSQSStack(app, 'sqsstack');

