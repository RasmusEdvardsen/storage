import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import RootState from '../../store/rootState';
import HomeStorageState from './homeStorageState';

const namespaced: boolean = true;

export const state: HomeStorageState = {
  containers: [],
  blobsByContainer: { containerName: '', blobs: [] },
  blobsByContainerTree: {},
  activeBlob: null,
};

export const homeStorage: Module<HomeStorageState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
