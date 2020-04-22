import { ActionTree } from "vuex";
import RootState from "../../store/rootState";
import HomeStorageState, { IBlobsByContainer } from "./homeStorageState";

import getContainers from "@/azure/getContainers";
import getBlobsByContainer from "@/azure/getBlobsByContainer";
import createFolder from "@/azure/createFolder";
import { uploadFileWithCallback } from "@/azure/uploadFile";
import { TransferProgressEvent } from "@azure/ms-rest-js";
import copyBlob from "@/azure/copyBlob";
import deleteBlob from "@/azure/deleteBlob";

export const actions: ActionTree<HomeStorageState, RootState> = {
    async getContainers({ commit }): Promise<number> {
        try {
            const containers = await getContainers();
            commit("containersLoaded", containers);

            return 200;
        } catch (error) {
            return 500;
        }
    },
    async getBlobsByContainer({ commit }, containerName: string): Promise<number> {
        try {
            const blobs: IBlobsByContainer = {
                containerName,
                blobs: await getBlobsByContainer(containerName),
            };
            commit("blobsByContainerLoaded", blobs);

            return 200;
        } catch (error) {
            return 500;
        }
    },
    async createFolder(_, p: { containerName: string, folderName: string }): Promise<number> {
        try {
            await createFolder(p.containerName, p.folderName);

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
            cb: (e: TransferProgressEvent) => void,
        }): Promise<number> {
        try {
            const isUploaded = await uploadFileWithCallback(p.containerName, p.fileName, p.file, p.cb);

            return isUploaded;
        } catch (error) {
            return 500;
        }
    },
    async renameFile(_, p: { containerName: string, oldName: string, newName: string }): Promise<number> {
        try {
            await copyBlob(p.containerName, p.oldName, p.newName);
            await deleteBlob(p.containerName, p.oldName);
            return 200;
        } catch (error) {
            return 500;
        }
    },
    async deleteFile(_, p: { containerName: string, name: string }): Promise<number> {
        try {
            await deleteBlob(p.containerName, p.name);
            return 200;
        } catch (error) {
            return 500;
        }
    },
    setActiveBlob({ commit }, name: string) {
        if (name) { commit("activeBlobSet", name); }
    },
};
