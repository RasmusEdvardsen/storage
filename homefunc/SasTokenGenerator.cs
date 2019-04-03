using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage;
using Newtonsoft.Json;

namespace home
{
    public static class SasTokenGenerator
    {
        [FunctionName("SasTokenGenerator")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)]
            HttpRequest req,
            ILogger log
        ) {
            var storageAccount = CloudStorageAccount.Parse(Environment.GetEnvironmentVariable("AzureWebJobsStorage"));

            string queryPermissions = req.Query["p"];

            bool isSuccess = Enum.TryParse(queryPermissions.ToString(), true, out SharedAccessAccountPermissions permissions);

            // Create a new access policy for the account.
            SharedAccessAccountPolicy policy = new SharedAccessAccountPolicy()
            {
                Permissions = permissions,
                Services = SharedAccessAccountServices.Blob,
                ResourceTypes = SharedAccessAccountResourceTypes.Service
                        | SharedAccessAccountResourceTypes.Container
                        | SharedAccessAccountResourceTypes.Object,
                SharedAccessExpiryTime = DateTime.UtcNow.AddHours(24),
                SharedAccessStartTime = DateTime.UtcNow.AddMinutes(-5),
                Protocols = SharedAccessProtocol.HttpsOnly
            };

            if (policy.Permissions.ToString().ToLower() == "none") return new HttpResponseMessage(HttpStatusCode.BadRequest);

            var sasToken = storageAccount.GetSharedAccessSignature(policy);

            var sc = JsonConvert.SerializeObject(new { token = sasToken });

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(sc, Encoding.UTF8, "text/plain")
            };
        }
    }
}
