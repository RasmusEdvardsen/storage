import { ContainerItem, BlobItem } from "@azure/storage-blob/typings/lib/generated/lib/models";

export default interface HomeStorageState {
    containers: ContainerItem[];
    blobsByContainer: IBlobsByContainer;
    blobsByContainerTree: any;
    activeBlob: BlobItem | null;
}

export interface IBlobsByContainer {
    containerName: string;
    blobs: BlobItem[];
}
