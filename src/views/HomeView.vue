<template>
  <div class="home">
    <h1>Добро пожаловать в Генератор форм</h1>
    <p>Это приложение позволяет создавать и просматривать динамические формы.</p>
    <div class="navigation-instructions">
      <h2>Начало работы</h2>
      <p>Используйте навигационное меню выше для:</p>
      <ul>
        <li>Создания новых форм в <strong>Конструкторе форм</strong></li>
        <li>Просмотра ваших форм в <strong>Предпросмотре форм</strong></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.navigation-instructions {
  margin-top: 2rem;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.navigation-instructions h2 {
  color: #42b983;
  margin-bottom: 1rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0.5rem 0;
}
@media(max-width: 470px){
  h1{
    font-size: 24px;
  }
}
</style> 