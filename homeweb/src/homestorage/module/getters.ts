import { GetterTree } from "vuex";
import RootState from "../../store/rootState";
import HomeStorageState, { IBlobsByContainer } from "./homeStorageState";
import { ContainerItem, BlobItem } from "@azure/storage-blob/typings/lib/generated/lib/models";

export const getters: GetterTree<HomeStorageState, RootState> = {
    containers(state): ContainerItem[] {
        return state.containers;
    },
    blobsByContainer(state): IBlobsByContainer {
        return state.blobsByContainer;
    },
    blobsByContainerTree(state): any {
        return state.blobsByContainerTree;
    },
    blobByName: (state) => (blobName: string): BlobItem | undefined => {
        return state.blobsByContainer.blobs.find((b) => b.name === blobName);
    },
    activeBlob(state): BlobItem | null {
        return state.activeBlob;
    },
};
