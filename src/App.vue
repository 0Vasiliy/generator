<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

export default defineComponent({
  name: 'App',
})
</script>

<template>
 <center>
   <header>
    <nav>
      <RouterLink to="/generator/">Главная</RouterLink>
      <RouterLink to="/generator/form-builder">Конструктор форм</RouterLink>
      <RouterLink to="/generator/form-preview">Предпросмотр формы</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
 </center>
</template>

<style>
/* Глобальные стили для всего приложения */
:root {
  --app-width: 70%;
  --max-width: 1600px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #2c3e50;
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Основной контейнер приложения */
#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Шапка приложения */
header {
  background-color: #2c3e50;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
}

nav {
  width: var(--app-width);
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 2rem;
}

nav a {
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

nav a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

nav a.router-link-active {
  background-color: #42b983;
}

/* Основной контент */
main {
  flex: 1;
  /* width: var(--app-width);
  max-width: var(--max-width); */
  margin: 2rem auto;
  padding: 0 1rem;
}

/* Медиа-запросы для адаптивности */
@media (max-width: 1200px) {
  :root {
    --app-width: 80%;
  }
}

@media (max-width: 992px) {
  :root {
    --app-width: 90%;
  }
  
  nav {
    gap: 1rem;
  }
  
  nav a {
    font-size: 1rem;
    padding: 0.4rem 0.8rem;
  }
}

@media (max-width: 768px) {
  :root {
    --app-width: 95%;
  }
  
  nav {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  main {
    margin: 1rem auto;
  }
}
</style>
