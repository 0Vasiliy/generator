<template>
  <div class="form-preview">
    <div class="preview-header">
      <h1>Предпросмотр формы</h1>
      <button class="back-button" @click="goToBuilder">← Вернуться к конструктору</button>
    </div>
    <div class="preview-container">
      <div class="form-container">
        <h2>{{ formTitle }}</h2>
        <form @submit.prevent="handleSubmit">
          <div v-for="(field, index) in formFields" :key="index" class="form-field">
            <slot :name="`field-${field.id}`" :field="field" :value="fieldValues[field.id]">
              <label :for="field.id">{{ field.label }}</label>
              <template v-if="field.type === 'select'">
                <select
                  :id="field.id"
                  :value="fieldValues[field.id]"
                  @change="(event) => updateFieldValue(field.id, event.target.value)"
                  class="form-control"
                >
                  <option value="" disabled>Выберите значение</option>
                  <option v-for="(option, idx) in field.options" :key="idx" :value="option">
                    {{ option }}
                  </option>
                </select>
              </template>
              <template v-else-if="field.type === 'checkbox'">
                <input
                  :id="field.id"
                  type="checkbox"
                  :checked="fieldValues[field.id]"
                  @change="(event) => updateFieldValue(field.id, event.target.checked)"
                  class="form-control"
                />
              </template>
              <template v-else-if="field.type === 'textarea'">
                <textarea
                  :id="field.id"
                  :value="fieldValues[field.id]"
                  @input="(event) => updateFieldValue(field.id, event.target.value)"
                  :placeholder="field.placeholder"
                  class="form-control"
                ></textarea>
              </template>
              <template v-else>
                <input
                  :id="field.id"
                  :type="getInputType(field.type)"
                  :value="fieldValues[field.id]"
                  @input="(event) => updateFieldValue(field.id, event.target.value)"
                  :placeholder="field.placeholder"
                  class="form-control"
                />
              </template>
            </slot>
          </div>
          <div class="form-actions">
            <slot name="submit-button">
              <button type="submit" class="submit-button">Отправить форму</button>
            </slot>
            <slot name="cancel-button">
              <button type="button" class="cancel-button" @click="handleCancel">Отмена</button>
            </slot>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, defineProps, defineEmits, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

interface FormField {
  id: number | string
  type: string
  label: string
  required?: boolean
  placeholder?: string
  options?: string[]
}

const props = defineProps<{
  formTitle?: string
  initialFields?: FormField[]
  initialValues?: Record<string | number, any>
}>()

const emit = defineEmits(['submit', 'cancel'])
const store = useStore()
const router = useRouter()

const formFields = computed(() => store.getters.getFields)
const fieldValues = computed(() => store.getters.getValues)

const getInputType = (type) => {
  switch (type) {
    case 'number':
      return 'number'
    case 'checkbox':
      return 'checkbox'
    default:
      return 'text'
  }
}

onMounted(() => {
  console.log('FormPreview: Загружаем данные...')
  
  const storeFields = store.getters.getFields
  const storeValues = store.getters.getValues
  
  console.log('FormPreview: Данные из store:', { fields: storeFields, values: storeValues })
  
  if (storeFields && storeFields.length > 0) {
    console.log('FormPreview: Используем данные из store')
    return
  }
  
  const savedForm = localStorage.getItem('savedForm')
  if (savedForm) {
    try {
      const { fields, values } = JSON.parse(savedForm)
      console.log('FormPreview: Загруженные данные из localStorage:', { fields, values })
      
      if (fields && fields.length > 0) {
        store.commit('setFields', fields)
        store.commit('setValues', values || {})
        
        fields.forEach(field => {
          if (!(field.id in (values || {}))) {
            store.commit('updateValue', { 
              id: field.id, 
              value: field.type === 'checkbox' ? false : '' 
            })
          }
        })
        
        console.log('FormPreview: Данные успешно загружены в store')
      } else {
        console.log('FormPreview: Нет полей для загрузки')
      }
    } catch (error) {
      console.error('FormPreview: Ошибка при загрузке формы:', error)
    }
  } else {
    console.log('FormPreview: Нет сохраненных данных')
  }
})

const handleSubmit = async (event) => {
  event.preventDefault()
  try {
    const formData = {
      fields: formFields.value,
      values: { ...fieldValues.value }
    }
    
    emit('submit', formData)
    console.log('Форма отправлена:', formData)
    alert('Форма успешно отправлена!')
    await clearForm()
  } catch (error) {
    console.error('Ошибка при отправке формы:', error)
  }
}

const handleCancel = async (event) => {
  event.preventDefault()
  try {
    await clearForm()
    emit('cancel')
  } catch (error) {
    console.error('Ошибка при отмене формы:', error)
  }
}

const clearForm = async () => {
  try {
    Object.keys(fieldValues.value).forEach(key => {
      store.commit('updateValue', { id: key, value: '' })
    })
    store.commit('setFields', [])
    localStorage.removeItem('savedForm')
    localStorage.removeItem('formFieldValues')
  } catch (error) {
    console.error('Ошибка при очистке формы:', error)
  }
}

watch(fieldValues, (newValues) => {
  console.log('FormPreview: Значения полей изменены:', newValues)
  localStorage.setItem('formFieldValues', JSON.stringify(newValues))
  
  if (formFields.value.length > 0) {
    localStorage.setItem('savedForm', JSON.stringify({
      fields: formFields.value,
      values: newValues
    }))
  }
}, { deep: true })

watch(formFields, (newFields) => {
  console.log('FormPreview: Поля формы изменены:', newFields)
  if (newFields.length > 0) {
    localStorage.setItem('savedForm', JSON.stringify({
      fields: newFields,
      values: fieldValues.value
    }))
  }
}, { deep: true })

const goToBuilder = () => {
  router.push('/form-builder')
}

const updateFieldValue = (fieldId, value) => {
  store.commit('updateValue', { id: fieldId, value })
  console.log('FormPreview: Значение поля обновлено:', { fieldId, value })
}
</script>

<style lang="scss" scoped>

.form-preview {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;
}

.preview-header h1 {
  margin: 0;
  color: #2c3e50;
}

.back-button {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #5a6268;
}

.form-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 2rem;
  margin-bottom: 2rem;
  h2 {
    color: #42b983;
    margin-bottom: 1.5rem;
  }
  .form-field {
    margin-bottom: 1.5rem;
    label {
      font-weight: bold;
      margin-bottom: 0.5rem;
      display: block;
    }
    input, select, textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      margin-top: 0.3rem;
      &:focus {
        border-color: #42b983;
        outline: none;
      }
    }
  }
  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    .submit-button {
      background: #42b983;
      color: #fff;
      border: none;
      padding: 0.7rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      &:hover {
        background: #369f6e;
      }
    }
    .cancel-button {
      background: #eee;
      color: #333;
      border: none;
      padding: 0.7rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      &:hover {
        background: #ccc;
      }
    }
  }
}
@media(max-width: 768px){
  .preview-header{
    flex-direction: column;
    margin-bottom: 0px;
  }
  .form-container .form-actions{
    margin-top: 0px;
  }
  .form-container{
    display: flex;
    justify-content: center;
  }
}
@media(max-width: 620px){
  .form-actions{
    display: flex;
    flex-direction: column;
  }
}
@media(max-width: 420px){
  .back-button{
   font-size: 0.6rem;
  }
}
@media(max-width: 402px){
  .form-container .form-actions .submit-button{
   font-size: 0.6rem;
  }
  .form-container .form-actions .cancel-button{
    font-size: 0.6rem;
  }
  .preview-header h1{
    font-size: 1.2rem;
    margin-bottom: 10px;
  }
}
@media(max-width: 360px){
  .form-container .form-actions .submit-button{
   font-size: 0.5rem;
  }
  .form-container .form-actions .cancel-button{
    font-size: 0.5rem;
  }
}
</style> 