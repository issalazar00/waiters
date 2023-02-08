
<template>
  <header>
    <MainMenu v-if="user && token"/>
    <!-- <nav v-if="user && token">
      <RouterLink :to="{name:'orders'}">Ordenes</RouterLink>
      <RouterLink :to="{name:'create-edit-order', params:{order_id:0}}">Crear Orden</RouterLink>
      <li class="nav-item">
        <a class="nav-link" href="#" @click="this.$root.logout">
          <i class="bi bi-box-arrow-right"></i>
          <span>Cerrar Sesión</span></a>
      </li>
    </nav> -->
  </header>

  <RouterView />
</template>
<script>
import global from './_services/global.js'
import MainMenu from './components/MainMenu.vue';

export default {
  name:'App',
  components:{MainMenu},
  data() {
    return {
      user: Object,
      token: String,
      permissions: [],
      config: Object({
        headers: {
          Authorization: "",
        },
      }),
      box: '',
      listBoxes: []
    }
  },
  watch: {
    $route(to, from) {
      this.assignDataRequired();
    },
    box() {
      localStorage.setItem("box_worker", this.box);
    },
    user: {
      deep: true,
      handler() {
        localStorage.setItem("user", JSON.stringify(this.user));
      }

    }
  },
  // router,
  created() {
    this.assignDataRequired();
    this.selectedBox();
    console.log(this)
  },
  methods: {
    assignDataRequired() {
      this.user = JSON.parse(localStorage.getItem("user"));
      this.token = localStorage.getItem("token");

      if (this.user) {
        this.permissions = this.user.permissions;
      }

      this.config.headers.Authorization = "Bearer " + this.token;
    },
    logout() {
      this.user = {};
      this.token = "";
      this.permissions = [];
      this.config.headers.Authorization = "";
      localStorage.clear();
      this.$router.push('/login');
    },
    validatePermission(permission) {
      return global.validatePermission(this.permissions, permission);
    },
    validateToken() {
      this.axios.get('api/users/' + this.user.sub, this.config)
        .then(response => {
          return true;
        })
        .catch(response => {
          this.logout();
        });
    },
    selectedBox() {
      this.axios.
        get('api/boxes/byUser', this.config)
        .then((response) => {
          this.listBoxes = response.data.boxes;
        })
        .catch((response) => {
          this.listBoxes = [];
        });
    }
  }
}
</script>
