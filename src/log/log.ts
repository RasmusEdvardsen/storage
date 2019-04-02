import {
    BlobURL,
    BlockBlobURL,
    Aborter,
    ContainerURL,
    AnonymousCredential,
    StorageURL,
    ServiceURL,
} from "@azure/storage-blob";
import getSasToken from "@/azure/getSasToken";

async function toStorage(
    token: string,
    containerName: string,
    fileName: string,
    log: string,
): Promise<number> {
    const anonymousCredential = new AnonymousCredential();
    const pipeline = StorageURL.newPipeline(anonymousCredential);
    const serviceURL = new ServiceURL(
        `https://storageanarae.blob.core.windows.net${token}`,
        pipeline,
    );

    const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
    const blobURL = BlobURL.fromContainerURL(containerURL, fileName);
    const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL);
    const uploadBlobResponse = await blockBlobURL.upload(
        Aborter.none,
        log,
        log.length,
        { blobHTTPHeaders: { blobContentType: "text/plain" } },
    );

    return uploadBlobResponse._response.status;
}
export async function info(i: string): Promise<void> {
    const token: string | number = await getSasToken();
    if (typeof (token) === "number") { return; }

    const date = new Date();
    const dateFormatted = formatDateForLog(date);
    toStorage(token, "log", "info/" + dateFormatted, i);
}

export async function error(err: string): Promise<void> {
    const token: string | number = await getSasToken();
    if (typeof (token) === "number") { return; }

    const date = new Date();
    const dateFormatted = formatDateForLog(date);
    toStorage(token, "log", "error/" + dateFormatted, err);
}

// todo put all of this in utils folder
/**
 * Prepends a 0 to n if n is less than 10, and returns that as a string.
 */
function prependZero(n: number): string { return n < 10 ? "0" + n : "" + n; }

function formatDateForLog(date: Date): string {
    const formatted =
        date.getFullYear().toString()
        + "_" + prependZero(date.getMonth())
        + "_" + prependZero(date.getDate())
        + "-" + prependZero(date.getHours())
        + ":" + prependZero(date.getMinutes())
        + ":" + prependZero(date.getSeconds())
        + "m" + prependZero(date.getMilliseconds());
    return formatted;
}
