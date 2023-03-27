import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
    state: () => ({
        counter: 0,
    }),
    getters: {
            count: (state) :number => state.counter,
            doubleCount: (state) :number => state.counter * 2,
        },
    actions: {
        increment() {
            this.counter++
        }
    },
    persist: {
        enabled: true,
        strategies : [{
          storage: localStorage,  
        }]
    }
});
