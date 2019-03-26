import { MutationTree } from 'vuex';
import HomeStorageState, { IBlobsByContainer } from './homeStorageState';

import { ContainerItem } from '@azure/storage-blob/typings/lib/generated/lib/models';

import { pathStringsToTreeStructure } from '../utils/treeUtils';

export const mutations: MutationTree<HomeStorageState> = {
    containersLoaded(state, containers: ContainerItem[]) {
        state.containers = containers;
    },
    blobsByContainerLoaded(state, blobs: IBlobsByContainer) {
        state.blobsByContainer = blobs;
        console.log(blobs);
        if (blobs.blobs.length < 1) {
            state.blobsByContainerTree = {};
        }
        const strs: string[] = blobs.blobs.map((b: any) => b.name);
        const tree = pathStringsToTreeStructure(strs);
        state.blobsByContainerTree = {
            name: blobs.containerName,
            children: tree
        };
    },
    activeBlobSet(state, name: string) {
        if (state.activeBlob && state.activeBlob.name === name) {
            state.activeBlob = null;
        } else {
            let blob = state.blobsByContainer.blobs.find(blob => blob.name === name)
            if (blob) state.activeBlob = blob;
        }
    }
};
