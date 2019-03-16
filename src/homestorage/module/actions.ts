import { ActionTree } from 'vuex';
import RootState from '../../store/rootState';
import HomeStorageState, { IBlobsByContainer } from './homeStorageState';


import getSasToken from '@/sas/getSasToken';
import getContainers from '@/sas/getContainers';
import getBlobsByContainer from '@/sas/getBlobsByContainer';

export const actions: ActionTree<HomeStorageState, RootState> = {
    async getContainers({commit}): Promise<number> {
        try {
            const token: string | number = await getSasToken();
            if (typeof(token) === 'number') { return token; }

            const containers = await getContainers(token);
            commit('containersLoaded', containers);

            return 200;
        } catch (error) {
            return 500;
        }
    },
    async getBlobsByContainer({commit}, containerName): Promise<number> {
        try {
            const token: string | number = await getSasToken();
            if (typeof(token) === 'number') { return token; }

            const blobs: IBlobsByContainer = {
                containerName,
                blobs: await getBlobsByContainer(token, containerName),
            };
            commit('blobsByContainerLoaded', blobs);

            return 200;
        } catch (error) {
            return 500;
        }
    },
};
