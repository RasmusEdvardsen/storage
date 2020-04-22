import {
    BlobURL,
    BlockBlobURL,
    Aborter,
    ContainerURL,
    ServiceURL,
} from "@azure/storage-blob";
import getServiceUrl from "@/azure/serviceUrl";

async function toStorage(
    containerName: string,
    fileName: string,
    log: string,
): Promise<number> {
    const serviceURL: ServiceURL = await getServiceUrl();

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
    const date = new Date();
    const dateFormatted = formatDateForLog(date);
    toStorage("log", "info/" + dateFormatted, i);
}

export async function error(err: string): Promise<void> {
    const date = new Date();
    const dateFormatted = formatDateForLog(date);
    toStorage("log", "error/" + dateFormatted, err);
}

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
