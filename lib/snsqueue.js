"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const sqs = require("@aws-cdk/aws-sqs");
const aws_sqs_1 = require("@aws-cdk/aws-sqs");
const aws_iam_1 = require("@aws-cdk/aws-iam");
class SNSSQSStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const UploadQueue = new sqs.Queue(this, 'UploadQueue', {
            queueName: 'uploads-queue'
        });
        // Queue policy
        const policy = new aws_sqs_1.QueuePolicy(this, 'sendWelcomeEmailQueuePolicy', {
            queues: [UploadQueue]
        });
        policy.document.addStatements(new aws_iam_1.PolicyStatement({
            principals: [new aws_iam_1.AnyPrincipal()],
            effect: aws_iam_1.Effect.ALLOW,
            actions: ['SQS:*']
        }));
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
exports.SNSSQSStack = SNSSQSStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25zcXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzbnNxdWV1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFzQztBQUN0Qyx3Q0FBeUM7QUFRekMsOENBQStDO0FBQy9DLDhDQUF5RTtBQUV6RSxNQUFhLFdBQVksU0FBUSxHQUFHLENBQUMsS0FBSztJQUN0QyxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ25ELFNBQVMsRUFBRSxlQUFlO1NBQzdCLENBQUMsQ0FBQztRQUVILGVBQWU7UUFDZixNQUFNLE1BQU0sR0FBRyxJQUFJLHFCQUFXLENBQUMsSUFBSSxFQUFFLDZCQUE2QixFQUFFO1lBQ2hFLE1BQU0sRUFBRSxDQUFDLFdBQVcsQ0FBQztTQUN0QixDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FDM0IsSUFBSSx5QkFBZSxDQUFDO1lBQ2xCLFVBQVUsRUFBRSxDQUFDLElBQUksc0JBQVksRUFBRSxDQUFDO1lBQ2hDLE1BQU0sRUFBRSxnQkFBTSxDQUFDLEtBQUs7WUFDcEIsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDO1NBQ25CLENBQUMsQ0FDSCxDQUFDO1FBQ0o7Ozs7Ozs7Ozs7OzthQVlLO0lBQ1QsQ0FBQztDQUNKO0FBbENELGtDQWtDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjZGsgPSByZXF1aXJlKCdAYXdzLWNkay9jb3JlJyk7XG5pbXBvcnQgc3FzID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLXNxcycpO1xuaW1wb3J0IHNucyA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1zbnMnKTtcbmltcG9ydCBzdWJzID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLXNucy1zdWJzY3JpcHRpb25zJyk7XG5pbXBvcnQgaWFtID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWlhbScpO1xuaW1wb3J0IHMzID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLXMzJyk7XG5pbXBvcnQgczNuID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLXMzLW5vdGlmaWNhdGlvbnMnKTtcbmltcG9ydCBsYW1iZGEgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtbGFtYmRhJyk7XG5pbXBvcnQgZnMgPSByZXF1aXJlKCdmcycpO1xuaW1wb3J0IHsgUXVldWVQb2xpY3kgfSBmcm9tICdAYXdzLWNkay9hd3Mtc3FzJztcbmltcG9ydCB7IEFueVByaW5jaXBhbCwgRWZmZWN0LCBQb2xpY3lTdGF0ZW1lbnQgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcblxuZXhwb3J0IGNsYXNzIFNOU1NRU1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgICAgICBjb25zdCBVcGxvYWRRdWV1ZSA9IG5ldyBzcXMuUXVldWUodGhpcywgJ1VwbG9hZFF1ZXVlJywge1xuICAgICAgICAgICAgcXVldWVOYW1lOiAndXBsb2Fkcy1xdWV1ZSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUXVldWUgcG9saWN5XG4gICAgICAgIGNvbnN0IHBvbGljeSA9IG5ldyBRdWV1ZVBvbGljeSh0aGlzLCAnc2VuZFdlbGNvbWVFbWFpbFF1ZXVlUG9saWN5Jywge1xuICAgICAgICAgICAgcXVldWVzOiBbVXBsb2FkUXVldWVdXG4gICAgICAgICAgfSk7XG4gICAgICBcbiAgICAgICAgICBwb2xpY3kuZG9jdW1lbnQuYWRkU3RhdGVtZW50cyhcbiAgICAgICAgICAgIG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgICBwcmluY2lwYWxzOiBbbmV3IEFueVByaW5jaXBhbCgpXSxcbiAgICAgICAgICAgICAgZWZmZWN0OiBFZmZlY3QuQUxMT1csXG4gICAgICAgICAgICAgIGFjdGlvbnM6IFsnU1FTOionXVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICApO1xuICAgICAgICAvKmNvbnN0IFF1ZXVlUG9saWN5ID0gbmV3IHNxcy5DZm5RdWV1ZVBvbGljeSh0aGlzLCAnUXVldWVQb2xpY3knLCB7XG4gICAgICAgICAgICBwb2xpY3lEb2N1bWVudDogbmV3IGlhbS5Qb2xpY3lEb2N1bWVudCh7XG4gICAgICAgICAgICAgICAgc3RhdGVtZW50czogW1xuICAgICAgICAgICAgICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5BbnlQcmluY2lwYWwoKV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zOiBbJ3NxczpTZW5kTWVzc2FnZSddLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VzOiBbJyonXVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgcXVldWVzOiBbJ1VwbG9hZFF1ZXVlJ11cbiAgICAgICAgfSk7Ki9cbiAgICB9XG59Il19