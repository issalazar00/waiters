<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, DialogDescription, TransitionRoot } from '@headlessui/vue'
</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-10" @close="closeModal()">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg min-w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">

                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div class="flex justify-between my-2">
                      <DialogTitle as="h3" class="text-2xl font-bold tracking-tight text-gray-900">Productos
                      </DialogTitle>
                      <button type="button" class="btn btn-secondary" @click="closeModal()">
                        Cerrar
                      </button>
                    </div>
                    <DialogDescription>
                      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 grid-flow-dense">
                        <div class="form-group w-full">
                          <input type="text" class="w-full form-input"
                            placeholder="Código de barras | Nombre de product" aria-label=" with two button addons"
                            aria-describedby="button-addon4" v-model="filters.product" @keyup="listProducts()" />
                        </div>
                        <div class="form-group w-full">
                          <v-select class="w-full form-input p-0" :options="categoryList" label="name"
                            :reduce="(category) => category.id" placeholder="Filtrar por categoría"
                            v-model="filters.category_id" @input="listProducts" />
                        </div>
                        <div class="form-group w-full  md:cdol-start-1 codl-end-3">
                          <button class="btn btn-primary btn-block h-full" type="button" @click="listProducts()">
                            Buscar Producto
                          </button>
                        </div>
                      </div>

                      <div
                        class="row card-group mt-6 grid grid-cols-1 gap-y-5 gap-x-5 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 ">
                        <div class="bg-slate-100 p-2 shadow" v-for="product in ProductList.data"
                          v-bind:key="product.id">
                          <div class="card  mb-5 group relative">
                            <div class="card-header bg-transparent border-success">
                              <h5>
                                <b>{{ product.product }}</b>
                              </h5>
                            </div>
                            <div class="card-body text-dark p-0">
                              <!-- <h5 class="card-title">Success card title</h5> -->
                              <div class="card-text">
                                <ul class="list-group">
                                  <li class="list-group-item">
                                    <b><i>Categoría</i></b>:
                                    {{ product.category.name ? product.category.name : "" }}
                                  </li>

                                  <li class="list-group-item">
                                    <b><i>Precio</i></b>: {{ product.sale_price_tax_inc }}
                                  </li>

                                  <!-- <li class="list-group-item">
                                    <b><i></i></b>:
                                  </li> -->
                                </ul>
                              </div>
                            </div>
                            <div class="
                                card-footer
                                bg-transparent
                                border-success
                                d-flex
                                justify-content-around
                              ">
                              <button class="btn btn-success btn-block add_product"
                                @click="$emit('add-product', product)">
                                <i class="bi bi-plus-circle"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogDescription>

                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 flex sm:flex sm:flex-row sm:px-6 justify-end">
                <button type="button" class="btn btn-secondary" @click="closeModal()">
                  Cerrar
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
export default {
  name: "add-product",
  props: {
    is_order: {
      type: Number,
      default: 0
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // Filter modal
      filters: {
        product: "",
        category_id: "",
      },
      ProductList: {},
      categoryList: [],
    };
  },

  created() {
    this.listProducts();
    this.listCategories();
  },
  methods: {
    listProducts() {
      let me = this;

      let data = {
        product: me.filters.product,
        is_order: this.is_order,
        category_id: this.filters.category_id,
      };

      this.axios
        .post(`api/products/filter-product-list?`, data, this.$root.config)
        .then(function (response) {
          me.ProductList = response;
        })
        .catch(function (error) {
          // $("#no-results").toast("show");

          console.log(error);
        });
    },

    listCategories() {
      let me = this;
      this.axios
        .get("api/categories/category-list?page=1", me.$root.config)
        .then(function (response) {
          me.categoryList = response.data.categories;
        });
    },

    closeModal() {
      this.$parent.openModalProduct = false
    }
  },
};
</script>

<style scoped>
.add_product {
  font-size: 1.5rem;
}

.modal-dialog {
  min-width: 90%;
}
</style>