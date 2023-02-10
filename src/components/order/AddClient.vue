<script setup>
import { Dialog, DialogPanel, DialogTitle,DialogDescription, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-10" @close="!open">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">Clientes</DialogTitle>
                    <DialogDescription>
                      <div class="input-group">
                        <input type="text" class="form-control" placeholder="Documento | Nombre de cliente"
                          aria-label=" with two button addons" aria-describedby="button-addon4" v-model="filters.client"
                          @keyup="searchClient()" />
                        <div class="input-group-append" id="button-addon4">
                          <button class="btn btn-outline-secondary" type="button" @click="searchClient()">
                            Buscar Cliente
                          </button>
                        </div>
                      </div>
                      <table class="table table-bordered table-sm table-responsive">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombres</th>
                            <th>Documento</th>
                            <th scope="col">Direccion</th>
                            <th>Telefono</th>
                            <th>Correo</th>
                            <th>Contacto</th>
                            <th>Opciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="client in ClientList.data" v-bind:key="client.id">
                            <th scope="row">{{ client.code }}</th>
                            <td>{{ client.name }}</td>
                            <td>{{ client.document }}</td>
                            <td>{{ client.address }}</td>
                            <td>{{ client.mobile }}</td>
                            <td>{{ client.email }}</td>
                            <td>
                              {{ client.contact }}
                            </td>
            
                            <td>
                              <button class="btn btn-outline-secondary" @click="$emit('add-client', client)" data-dismiss="modal">
                                <i class="bi bi-plus-circle"></i>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </DialogDescription>
                    
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
               
                <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" @click="!open,  $parent.openModalClient=false" ref="cancelButtonRef">Cerrar</button>
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
  name: "add-client",
  props: { 
    open: { 
      type: Boolean,
      default: false 
    } 
  },
  data() {
    return {
      ClientList: {},
      filters: {
        client: "",
      },
    };
  },
  created() {
    this.listClients();
  },
  methods: {
    listClients() {
      let me = this;
      this.axios
        .post("api/clients/filter-client-list", null, this.$root.config)
        .then(function (response) {
          me.ClientList = response;
        });
    },
    searchClient() {
      let me = this;
      if (me.filters.client == "") {
        return false;
      }
      var url = "api/clients/filter-client-list?client=" + me.filters.client;
      if (me.filters.client.length >= 3) {
        this.axios
          .post(url, null, me.$root.config)
          .then(function (response) {
            me.ClientList = response;
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
  },
};
</script>