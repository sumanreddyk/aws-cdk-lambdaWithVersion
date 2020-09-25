"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require('aws-sdk');
const S3 = new AWS.S3();
class GetBucketVersion {
    //static versionId =  GetBucketVersion.getLatestVersion("ambda-versioning-bucket", "lambdas.zip");
    static getLatestVersion(bucketName, objectKey) {
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
        }
        catch (error) {
            throw new Error(`Couldn't retrieve versionId for an objectKey: ${error.message}`);
        }
    }
}
exports.GetBucketVersion = GetBucketVersion;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0X2J1Y2tldF92ZXJzaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2V0X2J1Y2tldF92ZXJzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQy9CLE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBRXhCLE1BQWEsZ0JBQWdCO0lBQ3pCLGtHQUFrRztJQUMzRixNQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBa0IsRUFBRSxTQUFpQjtRQUNoRSxJQUFJLFNBQVMsQ0FBQztRQUNkLElBQUk7WUFDQSxJQUFJLE1BQU0sR0FBRztnQkFDVCxNQUFNLEVBQUUsVUFBVTtnQkFDbEIsR0FBRyxFQUFFLFNBQVM7YUFDakIsQ0FBQztZQUNGLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzNDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBRTNCLE9BQU8sU0FBUyxDQUFDO1NBRXBCO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDWixNQUFNLElBQUksS0FBSyxDQUFDLGlEQUFpRCxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTtTQUNwRjtJQUNMLENBQUM7Q0FFSjtBQXBCRCw0Q0FvQkMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBBV1MgPSByZXF1aXJlKCdhd3Mtc2RrJyk7XG5jb25zdCBTMyA9IG5ldyBBV1MuUzMoKTtcblxuZXhwb3J0IGNsYXNzIEdldEJ1Y2tldFZlcnNpb24ge1xuICAgIC8vc3RhdGljIHZlcnNpb25JZCA9ICBHZXRCdWNrZXRWZXJzaW9uLmdldExhdGVzdFZlcnNpb24oXCJhbWJkYS12ZXJzaW9uaW5nLWJ1Y2tldFwiLCBcImxhbWJkYXMuemlwXCIpO1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TGF0ZXN0VmVyc2lvbihidWNrZXROYW1lOiBzdHJpbmcsIG9iamVjdEtleTogc3RyaW5nKTpQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBsZXQgdmVyc2lvbklkO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICBCdWNrZXQ6IGJ1Y2tldE5hbWUsXG4gICAgICAgICAgICAgICAgS2V5OiBvYmplY3RLZXlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgZGF0YSA9IFMzLmdldE9iamVjdChwYXJhbXMpLnByb21pc2UoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdWZXJzaW9uSWQ6ICcsIGRhdGEuVmVyc2lvbklkKTtcbiAgICAgICAgICAgIHZlcnNpb25JZCA9IGRhdGEuVmVyc2lvbklkO1xuXG4gICAgICAgICAgICByZXR1cm4gdmVyc2lvbklkO1xuXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkbid0IHJldHJpZXZlIHZlcnNpb25JZCBmb3IgYW4gb2JqZWN0S2V5OiAke2Vycm9yLm1lc3NhZ2V9YClcbiAgICAgICAgfVxuICAgIH1cblxufSJdfQ==