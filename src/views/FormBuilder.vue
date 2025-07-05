<template>
  <div class="form-builder">
    <h1>Конструктор форм</h1>
    <div class="builder-container">
      <div class="form-preview">
        <h2>Предпросмотр формы</h2>
        <div class="preview-area">
          <form @submit.prevent="handleSubmit">
            <div v-for="(field, index) in formFields" :key="index" class="preview-field">
              <div class="field-header">
                <div class="field-title">
                  <label>{{ field.label }}</label>
                  <span class="field-type">{{ getFieldTypeLabel(field.type) }}</span>
                </div>
                <button class="delete-button" :data-index="index" @click="removeField">×</button>
              </div>
              <div class="field-description">{{ getFieldDescription(field) }}</div>
              <template v-if="field.type === 'select'">
                <select
                  :value="fieldValues[field.id]"
                  @change="(event) => updateFieldValue(field.id, event.target.value)"
                  class="form-control"
                  :required="field.required"
                >
                  <option value="" disabled>Выберите значение</option>
                  <option v-for="(option, idx) in field.options" :key="idx" :value="option">
                    {{ option }}
                  </option>
                </select>
              </template>
              <template v-else-if="field.type === 'textarea'">
                <textarea
                  :value="fieldValues[field.id]"
                  @input="(event) => updateFieldValue(field.id, event.target.value)"
                  :placeholder="field.placeholder"
                  :required="field.required"
                  class="form-control"
                ></textarea>
              </template>
              <template v-else>
                <input
                  :type="getInputType(field.type)"
                  :value="fieldValues[field.id]"
                  @input="(event) => updateFieldValue(field.id, event.target.value)"
                  :placeholder="field.placeholder"
                  :required="field.required"
                  class="form-control"
                />
              </template>
              <div class="field-options" v-if="field.type === 'select'">
                <div class="options-header">
                  <h4>Опции выпадающего списка:</h4>
                  <button class="add-option-btn" @click="addOption(field.id)">+ Добавить опцию</button>
                </div>
                <div class="options-list">
                  <div v-for="(option, idx) in field.options" :key="idx" class="option-item">
                    <input 
                      type="text" 
                      :value="option" 
                      @input="(event) => updateOption(field.id, idx, event.target.value)"
                      class="option-input"
                      placeholder="Введите опцию"
                    />
                    <button class="remove-option-btn" @click="removeOption(field.id, idx)">×</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="form-controls">
        <h2>Добавить элементы формы</h2>
        <div class="control-buttons">
          <button class="control-button" data-type="text" @click="addField">
            <span class="button-icon">📝</span>
            <span class="button-text">Текстовое поле</span>
            <span class="button-description">Для ввода короткого текста</span>
          </button>
          <button class="control-button" data-type="textarea" @click="addField">
            <span class="button-icon">📄</span>
            <span class="button-text">Текстовая область</span>
            <span class="button-description">Для ввода длинного текста</span>
          </button>
          <button class="control-button" data-type="number" @click="addField">
            <span class="button-icon">🔢</span>
            <span class="button-text">Числовое поле</span>
            <span class="button-description">Для ввода чисел</span>
          </button>
          <button class="control-button" data-type="checkbox" @click="addField">
            <span class="button-icon">☑️</span>
            <span class="button-text">Флажок</span>
            <span class="button-description">Для выбора опции</span>
          </button>
          <button class="control-button" data-type="select" @click="addField">
            <span class="button-icon">📋</span>
            <span class="button-text">Выпадающий список</span>
            <span class="button-description">Для выбора из списка</span>
          </button>
        </div>
        <div class="form-actions">
          <button class="action-button save" @click="saveForm">Сохранить форму</button>
          <button class="action-button preview" @click="goToPreview">Предпросмотр</button>
          <button class="action-button cancel" @click="resetForm">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const formFields = computed(() => store.getters.getFields)
const fieldValues = computed(() => store.getters.getValues)

const updateFieldValue = (fieldId, value) => {
  store.commit('updateValue', { id: fieldId, value })
}

watch(fieldValues, (newValues) => {
  localStorage.setItem('formFieldValues', JSON.stringify(newValues))
}, { deep: true })

const getFieldTypeLabel = (type) => {
  const labels = {
    text: 'Текстовое поле',
    textarea: 'Текстовая область',
    number: 'Числовое поле',
    checkbox: 'Флажок',
    select: 'Выпадающий список'
  }
  return labels[type] || 'Поле'
}

const getFieldDescription = (field) => {
  const descriptions = {
    text: 'Введите текст в это поле. Максимальная длина: 255 символов.',
    textarea: 'Введите многострочный текст. Поддерживает форматирование.',
    number: 'Введите числовое значение. Поддерживает десятичные числа.',
    checkbox: 'Отметьте для подтверждения выбора.',
    select: 'Выберите один вариант из списка.'
  }
  return descriptions[field.type] || 'Поле для ввода данных'
}

const addField = (event) => {
  const type = event.target.dataset.type
  const field = {
    id: Date.now(),
    type,
    label: getFieldLabel(type),
    required: false,
    placeholder: getPlaceholder(type)
  }

  if (type === 'select') {
    field.options = [
      'Опция A',
      'Опция B', 
      'Опция C',
      'Вариант 1',
      'Вариант 2',
      'Вариант 3',
      'Элемент 1',
      'Элемент 2',
      'Элемент 3'
    ]
  }

  const currentFields = [...formFields.value, field]
  store.commit('setFields', currentFields)
  
  store.commit('updateValue', { 
    id: field.id, 
    value: type === 'checkbox' ? false : '' 
  })
  
  console.log('Поле добавлено:', field)
}

const getFieldLabel = (type) => {
  const labels = {
    text: 'Текстовое поле',
    textarea: 'Текстовая область',
    number: 'Числовое поле',
    checkbox: 'Флажок',
    select: 'Выпадающий список'
  }
  return labels[type] || 'Поле'
}

const getPlaceholder = (type) => {
  const placeholders = {
    text: 'Введите текст...',
    textarea: 'Введите текст...',
    number: 'Введите число...',
    select: 'Выберите вариант...'
  }
  return placeholders[type] || 'Введите значение...'
}

const removeField = (event) => {
  const index = parseInt(event.target.dataset.index)
  const fieldId = formFields.value[index].id
  
  store.commit('removeField', fieldId)
  
  console.log('Поле удалено:', fieldId)
}

const addOption = (fieldId) => {
  const fieldIndex = formFields.value.findIndex(field => field.id === fieldId)
  if (fieldIndex !== -1) {
    const updatedFields = [...formFields.value]
    updatedFields[fieldIndex].options.push('Новая опция')
    store.commit('setFields', updatedFields)
    console.log('Опция добавлена в поле:', fieldId)
  }
}

const updateOption = (fieldId, optionIndex, newValue) => {
  const fieldIndex = formFields.value.findIndex(field => field.id === fieldId)
  if (fieldIndex !== -1) {
    const updatedFields = [...formFields.value]
    updatedFields[fieldIndex].options[optionIndex] = newValue
    store.commit('setFields', updatedFields)
    console.log('Опция обновлена:', { fieldId, optionIndex, newValue })
  }
}

const removeOption = (fieldId, optionIndex) => {
  const fieldIndex = formFields.value.findIndex(field => field.id === fieldId)
  if (fieldIndex !== -1) {
    const updatedFields = [...formFields.value]
    updatedFields[fieldIndex].options.splice(optionIndex, 1)
    store.commit('setFields', updatedFields)
    console.log('Опция удалена:', { fieldId, optionIndex })
  }
}

const getFieldComponent = (type) => {
  switch (type) {
    case 'textarea':
      return 'textarea'
    case 'select':
      return 'select'
    default:
      return 'input'
  }
}

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

const saveForm = () => {
  store.dispatch('saveForm', { fields: formFields.value, values: fieldValues.value })
  
  localStorage.setItem('savedForm', JSON.stringify({
    fields: formFields.value,
    values: fieldValues.value
  }))
  
  console.log('Форма сохранена:', { fields: formFields.value, values: fieldValues.value })
  alert('Форма успешно сохранена!')
}

watch(formFields, (newFields) => {
  console.log('Поля формы изменены:', newFields)
  if (newFields.length > 0) {
    localStorage.setItem('savedForm', JSON.stringify({
      fields: newFields,
      values: fieldValues.value
    }))
  }
}, { deep: true })

watch(fieldValues, (newValues) => {
  console.log('Значения полей изменены:', newValues)
  localStorage.setItem('formFieldValues', JSON.stringify(newValues))
  
  if (formFields.value.length > 0) {
    localStorage.setItem('savedForm', JSON.stringify({
      fields: formFields.value,
      values: newValues
    }))
  }
}, { deep: true })

const resetForm = () => {
  store.commit('setFields', [])
  store.commit('setValues', {})
  
  localStorage.removeItem('savedForm')
  localStorage.removeItem('formFieldValues')
  
  console.log('Форма сброшена')
}

onMounted(() => {
  console.log('FormBuilder: Загружаем сохраненные данные...')
  
  const storeFields = store.getters.getFields
  const storeValues = store.getters.getValues
  
  console.log('FormBuilder: Данные из store:', { fields: storeFields, values: storeValues })
  
  if (storeFields && storeFields.length > 0) {
    console.log('FormBuilder: Используем данные из store')
    return
  }
  
  const savedForm = localStorage.getItem('savedForm')
  if (savedForm) {
    try {
      const { fields, values } = JSON.parse(savedForm)
      console.log('FormBuilder: Загруженные данные из localStorage:', { fields, values })
      
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
        
        console.log('FormBuilder: Данные успешно загружены в store')
      } else {
        console.log('FormBuilder: Нет полей для загрузки')
      }
    } catch (error) {
      console.error('FormBuilder: Ошибка при загрузке сохраненной формы:', error)
    }
  } else {
    console.log('FormBuilder: Нет сохраненных данных')
  }
})

const handleSubmit = async (event) => {
  event.preventDefault()
  try {
    console.log('Form submitted:', fieldValues.value)
  } catch (error) {
    console.error('Ошибка при отправке формы:', error)
  }
}

const goToPreview = () => {
  saveForm()
  router.push('/form-preview')
}
</script>

<style scoped>
.form-builder {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2.5rem;
}

.builder-container {
  display: grid;
  grid-template-columns: 2.5fr 1fr;
  gap: 2rem;
  max-width: calc(var(--max-width) + 200px);
  margin: 0 auto;
}

.form-preview {
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  min-height: 600px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-right: 0;
}

.form-preview h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.preview-area {
  margin-top: 1.5rem;
  min-height: 500px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 2rem;
  background-color: white;
}

.preview-field {
  margin-bottom: 2.5rem;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.preview-field:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.field-title {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.field-title label {
  font-size: 1.4rem;
  font-weight: 500;
  color: #2c3e50;
}

.field-type {
  font-size: 1rem;
  color: #666;
  background-color: #f0f0f0;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  display: inline-block;
}

.field-description {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1.5rem;
  padding-left: 1rem;
  border-left: 3px solid #42b983;
  line-height: 1.6;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #fff;
  color: #495057;
}

.form-control:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.form-control:hover {
  border-color: #42b983;
}

select.form-control {
  cursor: pointer;
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

textarea.form-control {
  min-height: 100px;
  resize: vertical;
}

input[type="checkbox"].form-control {
  width: auto;
  margin-right: 0.5rem;
}

.field-options {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.options-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.options-header h4 {
  margin: 0;
  color: #495057;
  font-size: 1rem;
}

.add-option-btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.add-option-btn:hover {
  background-color: #3aa876;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.option-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
}

.option-input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.1);
}

.remove-option-btn {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.remove-option-btn:hover {
  background-color: rgba(220, 53, 69, 0.1);
}

.delete-button {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0.6rem;
  transition: all 0.3s ease;
  border-radius: 50%;
}

.delete-button:hover {
  background-color: rgba(220, 53, 69, 0.1);
  transform: scale(1.1);
}

.form-controls {
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  position: sticky;
  top: 2rem;
  height: fit-content;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-left: 0;
}

.form-controls h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.control-buttons {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.2rem;
  margin-top: 1.5rem;
}

.control-button {
  padding: 1.2rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.8rem;
}

.button-icon {
  font-size: 1.8rem;
}

.button-text {
  font-weight: 500;
  font-size: 1.2rem;
}

.button-description {
  font-size: 1rem;
  opacity: 0.9;
}

.control-button:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
}

.form-actions {
  margin-top: 2.5rem;
  display: flex;
  gap: 1.2rem;
}

.action-button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  flex: 1;
}

.save {
  background-color: #42b983;
  color: white;
}

.preview {
  background-color: #42b983;
  color: white;
}

.cancel {
  background-color: #dc3545;
  color: white;
}

.action-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

@media (max-width: 1200px) {
  .builder-container {
    grid-template-columns: 2fr 1fr;
    max-width: var(--max-width);
  }
}

@media (max-width: 992px) {
  .builder-container {
    display: flex;
    flex-direction: column;
    max-width: 100%;
  }

  .form-actions{
    display:  flex;
    flex-direction: column;
  }
  .form-controls {
    position: static;
    margin-top: 2rem;
  }

  .form-builder {
    padding: 1.5rem;
  }

  h1 {
    font-size: 2.2rem;
  }
}

@media (max-width: 768px) {
  .form-builder {
    padding: 1rem;
  }

  .preview-field {
    padding: 1.5rem;
  }

  .field-title label {
    font-size: 1.2rem;
  }

  .field-description {
    font-size: 1rem;
  }

  input, textarea, select {
    padding: 1rem;
    font-size: 1rem;
  }
}
@media (max-width: 476px) {
  h1{
    font-size: 28px;
  }
  .form-preview h2{
    font-size: 18px !important;
  }
  .form-controls h2{
    font-size: 18px !important;
  }
  .control-button{
    padding: 0.7rem;
    gap: 0.6rem;
  }
}
</style> 