import { create } from 'zustand'

import {persist} from "zustand/middleware";

let appStore = (set) => ({
    doopen: true,
    updateOpen:(doopen) => set((state) => ({doopen:doopen})),

})

appStore = persist (appStore, {name: "my_app_store"});
export const useAppStore = create(appStore);