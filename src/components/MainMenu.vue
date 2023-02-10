<template>
    <Disclosure as="nav" class="bg-gray-800" >
      <form class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8"  autocomplete="off" @submit.prevent="login">
        <div class="relative flex h-16 items-center justify-between">
           <div class="flex flex-shrink-0 items-center">
              <img class="block h-8 w-auto lg:hidden" src="@/assets/logo.svg" alt="Your Company" />
              <img class="hidden h-8 w-auto lg:block" src="@/assets/logo.svg" alt="Your Company" />
            </div>
          <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-center">
           
            <div class="hiddexn sm:mlx-6 sm:bloxck">
              <div class="flex space-x-4">
                <!-- <a v-for="item in navigation" :key="item.name" :href="item.href" :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</a> -->
                <RouterLink class="bg-gray-900 text-white px-3 py-2 rounded-md font-medium" :to="{name:'orders'}">Ordenes</RouterLink>
                <RouterLink class="bg-gray-900 text-white px-3 py-2 rounded-md font-medium" :to="{name:'create-edit-order', params:{order_id:0}}">Crear Orden</RouterLink>
              </div>
            </div>
          </div>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button href="#" @click="this.$root.logout" type="button" class="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span class="sr-only">View notifications</span>
              <ArrowRightOnRectangleIcon class="h-6 w-6" aria-hidden="true" /> Salir
            </button>
  
          </div>
        </div>
      </form>
    </Disclosure>
  </template>
  
  <script setup>
  import { Disclosure } from '@headlessui/vue'
  import {  ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'

  </script>