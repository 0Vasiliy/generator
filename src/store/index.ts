import { createStore } from 'vuex'

export interface FormField {
  id: number | string
  type: string
  label: string
  required?: boolean
  placeholder?: string
  options?: string[]
}

export interface RootState {
  fields: FormField[]
  values: Record<string | number, any>
}

const store = createStore<RootState>({
  state: {
    fields: [],
    values: {},
  },
  mutations: {
    setFields(state, fields: FormField[]) {
      state.fields = fields
    },
    setValues(state, values: Record<string | number, any>) {
      state.values = values
    },
    updateValue(state, { id, value }: { id: string | number, value: any }) {
      if (value === undefined) {
        delete state.values[id]
      } else {
        state.values[id] = value
      }
    },
    removeField(state, fieldId: string | number) {
      state.fields = state.fields.filter(field => field.id !== fieldId)
      delete state.values[fieldId]
    },
  },
  actions: {
    saveForm({ commit }, { fields, values }) {
      commit('setFields', fields)
      commit('setValues', values)
      localStorage.setItem('savedForm', JSON.stringify({ fields, values }))
      console.log('Store: Форма сохранена в localStorage')
    },
  },
  getters: {
    getFields: (state) => state.fields,
    getValues: (state) => state.values,
  },
})

export default store 