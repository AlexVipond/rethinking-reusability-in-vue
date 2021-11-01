<template>
  <main class="h-screen w-screen grid grid-cols-1 md:grid-cols-2 items-center justify-center">
    <section class="flex flex-col gap-8">
      <h2 class="text-sm tracking-widest font-bold uppercase">Compound listbox</h2>
      <CompoundListbox />
    </section>
    <section class="flex flex-col gap-8">
      <h2 class="text-sm tracking-widest font-bold uppercase">Function ref listbox</h2>
      <FunctionRefListbox />
    </section>
  </main>
</template>

<script setup lang="ts">
import CompoundListbox from './compound/CompoundListbox.vue'
import FunctionRefListbox from './functionRef/FunctionRefListbox.vue'
</script>
