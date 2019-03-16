import { MutationTree } from 'vuex';
import HomeStorageState, { IBlobsByContainer } from './homeStorageState';

import { ContainerItem } from '@azure/storage-blob/typings/lib/generated/lib/models';

export const mutations: MutationTree<HomeStorageState> = {
    containersLoaded(state, containers: ContainerItem[]) {
        state.containers = containers;
    },
    blobsByContainerLoaded(state, blobs: IBlobsByContainer) {
        state.blobsByContainer = blobs;
    },
};
