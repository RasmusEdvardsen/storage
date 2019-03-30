import { ActionTree } from 'vuex';
import RootState from '../../store/rootState';
import HomeStorageState, { IBlobsByContainer } from './homeStorageState';

import getSasToken from '@/azure/getSasToken';
import getContainers from '@/azure/getContainers';
import getBlobsByContainer from '@/azure/getBlobsByContainer';
import createFolder from '@/azure/createFolder';
import uploadFile, { uploadFileWithCallback } from '@/azure/uploadFile';
import { TransferProgressEvent } from '@azure/ms-rest-js';

export const actions: ActionTree<HomeStorageState, RootState> = {
    async getContainers({ commit }): Promise<number> {
        try {
            const token: string | number = await getSasToken();
            if (typeof (token) === 'number') { return token; }

            const containers = await getContainers(token);
            commit('containersLoaded', containers);

            return 200;
        } catch (error) {
            return 500;
        }
    },
    async getBlobsByContainer({ commit }, containerName: string): Promise<number> {
        try {
            const token: string | number = await getSasToken();
            if (typeof (token) === 'number') { return token; }

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
    async createFolder(context, p: { containerName: string, folderName: string }): Promise<number> {
        try {
            const token: string | number = await getSasToken();
            if (typeof (token) === 'number') { return token; }

            createFolder(token, p.containerName, p.folderName);

            return 200;
        } catch (error) {
            return 500;
        }
    },
    async uploadFile(
        _,
        p: {
            containerName: string,
            fileName: string,
            file: File,
            cb: (e: TransferProgressEvent) => void
        }): Promise<number> {
        try {
            const token: string | number = await getSasToken();
            if (typeof (token) === 'number') { return token; }

            const isUploaded = await uploadFileWithCallback(token, p.containerName, p.fileName, p.file, p.cb);

            return isUploaded;
        } catch (error) {
            return 500;
        }
    },
    setActiveBlob({ commit }, name: string) {
        if (name) { commit('activeBlobSet', name); }
    },
};
