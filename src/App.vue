<template>
  <main class="h-screen w-screen grid grid-cols-1 md:grid-cols-2 items-center justify-center p-8 md:p-16">
    <section class="w-full max-w-sm flex flex-col gap-4">
      <h2 class="text-sm tracking-widest font-bold uppercase">Compound listbox</h2>
      <CompoundListbox :options="options" v-model="compoundSelected"/>
    </section>
    <section class="w-full max-w-sm flex flex-col gap-4">
      <h2 class="text-sm tracking-widest font-bold uppercase">Function ref listbox</h2>
      <FunctionRefListbox :options="options" v-model="functionRefSelected" />
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CompoundListbox from './compound/CompoundListbox.vue'
import FunctionRefListbox from './functionRef/FunctionRefListbox.vue'
import { options } from './options'

const compoundSelected = ref(options[0])
const functionRefSelected = ref(options[0])
</script>
