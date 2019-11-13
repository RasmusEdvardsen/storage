import { ContainerItem, BlobItem } from "@azure/storage-blob/typings/src/generated/src/models";

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
