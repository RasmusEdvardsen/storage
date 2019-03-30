import Vue from 'vue';

export const EventBus = new Vue();

export enum Event {
    NEWFILES = 'newFiles'
}

export interface IEventNewFiles {
    fileList: FileList,
    folderPath: string
}