
<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-gray-50">
    <body class="h-full">
    ```
  -->
  <div class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <img class="w-12 mx-auto h-12 w-auto" src="@/assets/logo.svg" alt="Your Company" />

        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Bienvenido</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ingresa a tu cuenta
        </p>
      </div>
      <form id="form_login" class="mt-8 space-y-6" autocomplete="off" method="POST" @submit.prevent="login">
        <input type="hidden" name="remember" value="true" />
        <div class="-space-y-px rounded-md shadow-sm">
          <div>
            <label for="email-address" class="sr-only">Usuario o email</label>
            <input id="email-address" name="username" type="text" autocomplete="username" required
              class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Usuario o email" aria-describedby="usernameHelp" v-model="formValues.username" />
            <small id="usernameHelp" class="form-text text-danger">{{
              formErrors.username
            }}</small>
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required="" aria-describedby="passwordHelp"
              class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Ingresar contraseña" v-model="formValues.password" />
              <small id="passwordHelp" class="form-text text-danger">{{
                formErrors.password
              }}</small>
          </div>
        </div>

        <div>
          <button type="submit"
            class="group relative flex w-full justify-center btn btn-indigo">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            </span>
            Ingresar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
//Services

export default {
  name: "app-login",
  data() {
    return {
      data: "Login",
      api: this.axios.defaults.baseURL + 'api',
      formValues: {
        username: "",
        password: "",
      },
      formErrors: {
        username: "",
        password: "",
      },
    };
  },
  created() {
    if (this.$root.user && this.$root.token) {
      this.$router.push("/home");
    }
  },
  methods: {
    login() {
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      this.formErrors.username = "";
      this.formErrors.password = "";

      const formLogin = document.getElementById("form_login");
      this.axios
        .post("api/login", new FormData(formLogin), config)
        .then((response) => {
          response = response.data;
          if (
            response.status == "success" &&
            typeof response.user === "object"
          ) {
            localStorage.setItem("token", response.user.api_token);
            localStorage.setItem("user", JSON.stringify(response.user));
            this.$router.push({ name: 'main', params: { order_id: '0' } });
          }
        })
        .catch((error) => {
          var errors = error.response.data.errors;

          if (typeof errors != "undefined") {
            if (typeof errors.username != "undefined") {
              this.formValues.username = "";
              this.formValues.password = "";

              this.formErrors.username = errors.username[0];
            }

            this.formValues.password = "";
          } else {
            this.formValues.password = "";
            this.formErrors.password = error.response.data.message;
          }

          console.log(error.response);
        });
    },
  },
};
</script>