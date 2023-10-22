import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useErrorStore = defineStore('ErrorStore', () => {
  const _errors = ref<string[]>([])

  function hasErrors(): boolean {
    return _errors.value.length > 0
  }

  function clear() {
    _errors.value = []
  }

  function addError(error: string) {
    _errors.value.push(error)
  }

  function addErrors(errors: string[]) {
    _errors.value = errors.concat(errors)
  }

  return {
    errors: _errors,
    clear,
    hasErrors,
    addErrors,
    addError
  }
})
