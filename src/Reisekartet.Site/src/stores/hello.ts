import { defineStore } from 'pinia'
import {helloWorld} from "@/api/helloQuery";

export const useHelloStore = defineStore('hello', {
    state: () => ({
        hello: "",
    }),
    getters: {
        content: (state) :string => state.hello as string,
    },
    actions: {
       async get() {
            this.hello = await helloWorld();
        }
    },
    persist: {
        enabled: true,
        strategies : [{
            storage: localStorage,
        }]
    }
});
