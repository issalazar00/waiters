<template>
  <div class="row px-2" id="create-edit-order">
    <div class="col-12 justify-content-center p-2">
      <div class="sticky-top mb-2 text-uppercase w-md-50 w-100">
        <table class="table table-borderless">
          <tr class="h1 text-white bg-success">
            <td class="text-right">Total</td>
            <td>$ {{ (order.total_tax_inc = total_tax_inc).toFixed(0) }}</td>
          </tr>
        </table>
      </div>
      <div class="grid grid-cols-1 mb-2 ">
        <div class="input-group inline-flex ">
          <v-select :options="tableList" placeholder="Seleccionar mesa" class="w-full form-input p-0 " label="table"
            :reduce="(table) => table.id" v-model="order.table_id" />
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
        <div class="input-group inline-flex ">
          <input type="text" class="form-control w-4/6 " placeholder="Código de barras"
            aria-label=" with two button addons" aria-describedby="button-add-product" v-model="filters.product"
            autofocus @keypress.enter="searchProduct()" />
          <button class="btn btn-outline-success w-2/6" type="button" @click="openModalProduct = true">
            <i class="bi bi-card-checklist"></i>
            Agregar productos
          </button>
        </div>

        <div class="input-group inline-flex  offset-md-6">
          <input type="text" class="form-control w-4/6" :placeholder="order.client" aria-label=" with two button addons"
            aria-describedby="button-addon4" v-model="filters.client" @keypress.enter="searchClient()" />
          <button class="btn btn-outline-success w-2/6" type="button" @click="openModalClient = true">
            Agregar cliente
            <i class="bi bi-person-lines-fill"></i>
          </button>
        </div>

      </div>

      <section class="flex flex-col">
        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div class="overflow-hidden">
              <table class="
              table table-auto table-sm table-responsive-sm table-bordered table-hover
            ">
                <thead class="bg-secondary text-white">
                  <tr>
                    <th></th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody v-if="productsOrderList.length > 0">
                  <tr v-for="(p, index) in productsOrderList" :key="p.id">
                    <td class="text-center">
                      <button class="btn text-danger-700 rounded-full p-1 text-2xl" @click="removeProduct(index, p.id)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>

                    <td>{{ p.product }}</td>
                    <td>
                      <div class="grid grid-cols-2 md:grid-cols-4">
                        <div class="input-group-prepend hidden md:block">
                          <button class="btn w-full h-full btn-danger " type="button" id="button-addon1"
                            @click="p.quantity -= 1" :disabled="p.quantity <= 1">
                            -
                          </button>
                        </div>

                        <input type="number" name="quantity" id="quantity" step="any" placeholder="Cantidad"
                          class="form-control col-span-2 md:col-span-2 " v-model="p.quantity" size="6"
                          pattern="[0-9]+" />
                        <div class="input-group-prepend col-span-1 md:col-span-1 sm:block md:hidden lg:hidden">
                          <button class="btn w-full h-full btn-danger" type="button" id="button-addon1"
                            @click="p.quantity -= 1" :disabled="p.quantity <= 1">
                            -
                          </button>
                        </div>
                        <div class="input-group-prepend col-span-1 md:col-span-1 hidden-sm">
                          <button class="btn w-full h-full btn-success " type="button" id="button-addon1"
                            @click="p.quantity += 1">
                            +
                          </button>
                        </div>
                      </div>

                      <span class="hidden d-none">
                        {{
                        (p.cost_price_tax_inc_total =
  p.cost_price_tax_inc * p.quantity)
                        }}
                      </span>
                    </td>
                    <td>
                      <input type="number" name="price" id="price" step="any" disabled placeholder="Cantidad"
                        v-model="p.price_tax_inc" class="form-control" style="max-width: 100px" />
                    </td>

                    <td>
                      $
                      {{
                      (p.price_tax_inc_total =
  p.quantity * p.price_tax_inc -
  p.quantity *
  p.price_tax_inc *
  (p.discount_percentage / 100))
                      }}
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="8">No se han añadido productos</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="col-12">
      <div class="">
        <section class="card">
          <div>
            <table class="table table-sm table-primary table-auto text-right">
              <tr class="bg-success h5 text-white">
                <th>Total:</th>
                <th>
                  $ {{ (order.total_tax_inc = total_tax_inc).toFixed(0) }}
                </th>
              </tr>

              <tr class="">
                <th>Pagar:</th>
                <th>
                  <input type="number" step="any" v-model="order.payment_methods.others" />
                </th>
              </tr>
              <tr class="">
                <th>Cambio:</th>
                <th>
                  <input type="text" :value="payment_return" readonly disabled />
                </th>
              </tr>
            </table>
          </div>
        </section>
        <div class="">
          <button type="button" :disabled="disabled" class="btn btn-primary btn-block" @click="createOrUpdateOrder(1)">
            <i class="bi bi-clock-fill"></i> Suspender
          </button>
          <router-link to="/orders" type="button" class="btn btn-outline-secondary btn-block" v-if="order_id != 0">
            <i class="bi bi-cart-x"></i> Cancelar
          </router-link>
        </div>
      </div>
    </div>

    <add-product :open="openModalProduct" @add-product="addProduct($event)" />
    <add-client :open="openModalClient" @add-client="addClient($event)" />
    <modal-box  ref="ModalBox"></modal-box>
  </div>
</template>

<script>
import AddProduct from "./AddProduct.vue";
import AddClient from "./AddClient.vue";
import ModalBox from "./../../views/ModalBox.vue";
import { ref } from 'vue'

export default {
  components: { AddProduct, AddClient, ModalBox },
  props: ["order_id"],
  name: "create-edit-order",

  data() {
    return {
      openModalBox: ref(false),
      openModalProduct: ref(false),
      openModalClient: ref(false),

      // add product or client with keyup
      filters: {
        product: "",
        client: "",
      },
      productsOrderList: [],
      tableList: [],
      disabled: false,
      order: {
        id_client: 1,
        client: "Sin Cliente",
        state: 1,
        total_tax_inc: 0.0,
        total_tax_exc: 0.0,
        total_discount: 0.0,
        total_cost_price_tax_inc: 0.0,
        productsOrder: [],
        payment_date: "",
        // payment_date: new Date().toISOString().slice(0, 10),
        payment_methods: {
          cash: 0.0,
          card: 0.0,
          nequi: 0.0,
          others: 0.0,
          change: 0.0,
        },
      },
    };
  },
  computed: {
    total_tax_exc: function () {
      var total = 0.0;
      this.productsOrderList.forEach(
        (product) =>
          (total += parseFloat(product.price_tax_exc * product.quantity))
      );
      return total;
    },
    total_discount: function () {
      var total = 0.0;
      this.productsOrderList.forEach((product) => {
        total += parseFloat(product.discount_price);
      });
      return total;
    },
    total_cost_price_tax_inc: function () {
      var total = 0.0;
      this.productsOrderList.forEach((product) => {
        total += parseFloat(product.cost_price_tax_inc_total);
      });
      return total;
    },
    total_tax_inc: function () {
      var total = 0.0;
      this.productsOrderList.forEach((product) => {
        total += parseFloat(
          product.quantity * product.price_tax_inc -
          product.quantity *
          product.price_tax_inc *
          (product.discount_percentage / 100)
        );
      });
      return total;
    },
    total_tax_inc_without_discount: function () {
      var total = 0.0;
      this.productsOrderList.forEach((product) => {
        total += parseFloat(product.quantity * product.price_tax_inc);
      });
      return total;
    },
    payment_return: function () {
      var cash = this.order.payment_methods.cash
        ? Number(this.order.payment_methods.cash)
        : 0;
      var card = this.order.payment_methods.card
        ? Number(this.order.payment_methods.card)
        : 0;
      var nequi = this.order.payment_methods.nequi
        ? Number(this.order.payment_methods.nequi)
        : 0;
      var others = this.order.payment_methods.others
        ? Number(this.order.payment_methods.others)
        : 0;

      var value = cash + nequi + card + others - this.total_tax_inc;
      return value;
    },
  },
  methods: {
    showAlert() {
      // Use sweetalert2
      this.$swal('Hello Vue world!!!');
    },
    listItemsOrder() {
      if (this.order_id == 0) {
        return false;
      }

      let me = this;
      this.axios
        .get(`api/orders/${me.order_id}`, this.$root.config)
        .then(function (response) {
          me.order.id_client = response.data.order_information.client_id;
          me.order.client = response.data.order_information.client.name;
          me.productsOrderList = response.data.order_details;
        });
    },
    listTables() {
      let me = this;
      this.axios
        .get("api/tables/table-list?page=1", me.$root.config)
        .then(function (response) {
          me.tableList = response.data.tables;
        });
    },
    searchProduct() {
      let me = this;
      if (me.filters.product == "") {
        return false;
      }
      var url = "api/products/search-product?product=" + me.filters.product;
      this.axios
        .post(url, null, this.$root.config)
        .then(function (response) {
          var new_product = response.data.products;
          if (!new_product) {
            this.$swal('Hello Vue world!!!');
          } else {
            me.addProduct(new_product);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      me.filters.product = "";
    },
    addProduct(new_product) {
      let me = this;
      let result = false;
      // Verifica si el producto existe en la lista
      me.productsOrderList.filter((prod) => {
        if (new_product.barcode == prod.barcode) {
          result = true;
          if (result) {
            // Añade cantidad
            prod.quantity += 1;
            prod.price_tax_inc_total = prod.price_tax_inc * prod.quantity;
            prod.cost_price_tax_inc_total =
              prod.cost_price_tax_inc * prod.quantity;
          }
        }
      });

      if (!result) {
        // Sino, lo añade al array
        me.productsOrderList.push({
          product_id: new_product.id,
          barcode: new_product.barcode,
          discount_percentage: 0,
          discount_price: 0,
          quantity: 1,
          price_tax_inc: new_product.sale_price_tax_inc,
          price_tax_exc: new_product.sale_price_tax_exc,
          product: new_product.product,
          price_tax_inc_total: new_product.sale_price_tax_inc,
          cost_price_tax_inc: new_product.cost_price_tax_inc,
          cost_price_tax_inc_total: new_product.cost_price_tax_inc,
          type: new_product.type,
        });
      }
    },
    removeProduct(index, detail_id = null) {
      this.productsOrderList.splice(index, 1);
      if (detail_id != null || detail_id != 0) {
        this.axios.delete(`api/order-details/${detail_id}`, this.$root.config);
      }
    },
    searchClient() {
      let me = this;
      if (me.filters.client == "") {
        return false;
      }
      var url = "api/clients/search-client?client=" + me.filters.client;
      this.axios
        .post(url, null, me.$root.config)
        .then(function (response) {
          var new_client = response.data;
          if (!new_client) {
            this.$swal('Hello Vue world!!!');
          } else {
            me.addClient(new_client);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    addClient(client) {
      let me = this;
      me.order.id_client = client.id;
      me.order.client = client.name;
      me.filters.client = client.name;
    },

    createOrUpdateOrder(state_order) {
      this.disabled = true;
      this.order.state = state_order;
      this.order.box_id = this.$root.box;
      this.order.total_cost_price_tax_inc = this.total_cost_price_tax_inc;
      this.order.payment_methods.change = this.payment_return;

      if (this.order.id_client == 1 && state_order == 5) {
        alert("Debe seleccionar un cliente válido");
        return false;
      }
      if (this.productsOrderList.length) {
        this.order.productsOrder = this.productsOrderList;
        if (this.order_id != 0 && this.order_id != null) {
          console.log("roder", this.order);
          this.axios
            .put(`api/orders/${this.order_id}`, this.order, this.$root.config)
            .then(() =>
              this.$swal.fire({
                icon: "success",
                title: "Excelente",
                text: "Los datos se han guardado correctamente",
              })
            )
            .catch(function (error) {
              // handle error
              console.log("error", error);
              if (error) {
                this.$swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Hubo un error al guardar los datos",
                });
              }
            })
            .finally(
              setTimeout(() => {
                this.$router.push({
                  name:'create-edit-order',
                  params:{
                    order_id:0
                  }
                }),
                this.$router.go(0), 
                (this.disabled = false)
              }, 3000)
            );
        } else {
          if (this.order.box_id > 0) {
            this.axios
              .post(`api/orders`, this.order, this.$root.config)
              .then(() => {
                this.$swal.fire({
                  icon: "success",
                  title: "Excelente",
                  text: "Los datos se han guardado correctamente",
                });
              })
              .catch(function (error) {
                // handle error
                if (error) {
                  this.$swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Hubo un error al guardar los datos",
                  });
                }
              })
              .finally(
                setTimeout(() => {
                  this.$router.go(0), (this.disabled = false)
                }, 3000)
              );
          } else {
            alert("Selecciona una caja");
          }
        }
      } else {
        this.disabled = false;
        this.$swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Debes añadir productos al carrito",
        });
      }
    },

    printTicket(order_id) {
      this.axios.get(
        `api/print-order/${order_id}/${this.order.payment_methods.cash}/${this.payment_return}`,
        this.$root.config
      );
    },

  },
  mounted() {
    if (this.order_id != null || this.order_id != 0) {
      this.listItemsOrder();
    }
    this.listTables()
    // this.$refs.ModalBox.selectedBox();
  },
};
</script>

<style scoped>
#create-edit-order {
  font-size: 1rem;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>