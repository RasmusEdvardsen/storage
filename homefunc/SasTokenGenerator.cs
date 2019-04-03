using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.WindowsAzure.Storage;
using Newtonsoft.Json;

namespace home
{
    public static class SasTokenGenerator
    {
        [FunctionName("SasTokenGenerator")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)]
            HttpRequestMessage req,
            TraceWriter log
        ) {
            var storageAccount = CloudStorageAccount.Parse(Environment.GetEnvironmentVariable("AzureWebJobsStorage"));

            string queryPermissions = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "p", true) == 0)
                .Value;

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
