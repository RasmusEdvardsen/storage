import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import RootState from "./rootState";

import { homeStorage } from "../homestorage/module";

Vue.use(Vuex);
const storeOptions: StoreOptions<RootState> = {
    state: { version: "1.0.0" },
    modules: {
        homeStorage,
    },
};
const store = new Vuex.Store<RootState>(storeOptions);
export default store;
