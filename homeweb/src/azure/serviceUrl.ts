import { ServiceURL, TokenCredential, StorageURL } from '@azure/storage-blob';
import { user } from '@/auth/user';

export default async function getServiceUrl(): Promise<ServiceURL> {
    const tokenCredential = new TokenCredential(await user.accessToken());
    const pipeline = StorageURL.newPipeline(tokenCredential);

    return new ServiceURL(`https://storageanarae.blob.core.windows.net`, pipeline);
}