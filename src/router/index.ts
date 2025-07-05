import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FormBuilder from '../views/FormBuilder.vue'
import FormPreview from '../views/FormPreview.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/generator/', name: 'Home', component: HomeView },
  { path: '/generator/form-builder', name: 'FormBuilder', component: FormBuilder },
  { path: '/generator/form-preview', name: 'FormPreview', component: FormPreview },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router 