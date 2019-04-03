using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
using Newtonsoft.Json;

namespace home
{
    public static class RenameBlobs
    {
        [FunctionName("RenameBlobs")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
            HttpRequest req,
            ILogger log
        )
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            RenameBlobDTO data = JsonConvert.DeserializeObject<RenameBlobDTO>(requestBody);
            if (data.names.Count < 1) return new HttpResponseMessage(HttpStatusCode.BadRequest);

            var name = Environment.GetEnvironmentVariable("StorageAccountName");
            var key = Environment.GetEnvironmentVariable("StorageAccountKey");
            StorageCredentials cred = new StorageCredentials(name, key);
            CloudBlobContainer container = new CloudBlobContainer(new Uri($"https://{name}.blob.core.windows.net/{data.containerName}"), cred);

            string oldFileName = data.names[0].oldName;
            string newFileName = data.names[0].newName;
            try
            {
                CloudBlockBlob blobCopy = container.GetBlockBlobReference(newFileName);
                if (!await blobCopy.ExistsAsync())
                {
                    CloudBlockBlob blob = container.GetBlockBlobReference(oldFileName);

                    if (await blob.ExistsAsync())
                    {
                        await blobCopy.StartCopyAsync(blob);
                        await blob.DeleteIfExistsAsync();
                    }
                }
                return new HttpResponseMessage(HttpStatusCode.Accepted);
            }
            catch (Exception e)
            {
                log.LogError(e.Message);
                return new HttpResponseMessage(HttpStatusCode.InternalServerError);
            }
        }
    }

    public class RenameBlobDTO
    {
        public List<FileName> names { get; set; }
        public string containerName { get; set; }
    }

    public class FileName
    {
        public string oldName { get; set; }
        public string newName { get; set; }
    }
}
