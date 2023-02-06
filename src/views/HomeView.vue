


<template>
  <div class="about">
    <nav>
      <!-- <RouterLink to="/">Home</RouterLink> -->
      <RouterLink to="/home/orders">Ordenes</RouterLink>
      <RouterLink to="/home/create-edit-order">Crear Orden</RouterLink>
      <li class="nav-item">
        <a class="nav-link" href="#" @click="this.$root.logout">
          <i class="bi bi-box-arrow-right"></i>
          <span>Cerrar Sesión</span></a>
      </li>
    </nav>
    <h1>This is an about page</h1>
  <RouterView />

  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
