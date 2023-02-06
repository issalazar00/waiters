<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <RouterView />
</template>
<script>
import global from './_services/global.js'
export default {
  name:'App',
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

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
