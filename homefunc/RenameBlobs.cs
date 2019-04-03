using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;

namespace home
{
    public static class RenameBlobs
    {
        [FunctionName("RenameBlobs")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)]
            HttpRequest req,
            ILogger log
        ) {
            log.LogInformation("C# HTTP trigger function processed a request.");

            //  todo: get containername from body.

            var name = Environment.GetEnvironmentVariable("StorageAccountName");
            var key = Environment.GetEnvironmentVariable("StorageAccountKey");
            StorageCredentials cred = new StorageCredentials(name, key);
            CloudBlobContainer container = new CloudBlobContainer(new Uri($"https://{name}.blob.core.windows.net/homestorage"), cred);

            string fileName = "rasmus_test/callback/pikachuu.jpg";
            string newFileName = "rasmus_test/callback/pikachuuaaa.jpg";
            try
            {
                //await container.CreateIfNotExistsAsync();
                CloudBlockBlob blobCopy = container.GetBlockBlobReference(newFileName);
                if (!await blobCopy.ExistsAsync())
                {
                    CloudBlockBlob blob = container.GetBlockBlobReference(fileName);

                    if (await blob.ExistsAsync())
                    {
                        await blobCopy.StartCopyAsync(blob);
                        await blob.DeleteIfExistsAsync();
                    }
                }
                return new HttpResponseMessage(HttpStatusCode.Accepted);
            } catch (Exception e)
            {
                log.LogError(e.Message);
                return new HttpResponseMessage(HttpStatusCode.InternalServerError);
            }

        }
    }
}
