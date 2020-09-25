const AWS = require('aws-sdk');
const S3 = new AWS.S3();

export class GetBucketVersion {
    //static versionId =  GetBucketVersion.getLatestVersion("ambda-versioning-bucket", "lambdas.zip");
    public static getLatestVersion(bucketName: string, objectKey: string):Promise<string> {
        let versionId;
        try {
            var params = {
                Bucket: bucketName,
                Key: objectKey
            };
            var data = S3.getObject(params).promise();
            console.log('VersionId: ', data.VersionId);
            versionId = data.VersionId;

            return versionId;

        } catch (error) {
            throw new Error(`Couldn't retrieve versionId for an objectKey: ${error.message}`)
        }
    }

}