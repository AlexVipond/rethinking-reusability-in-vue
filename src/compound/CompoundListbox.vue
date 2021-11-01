<template>
  <Listbox class="
    w-full h-96
    flex flex-col gap-3 overflow-scroll
    bg-white rounded shadow-md
  ">
    <ListboxOption
      v-for="option in options"
      :key="option"
      v-slot="{ isActive, isSelected }"
      class="
        text-lg
        flex items-center gap-3 p-2
        transition duration-150 focus:border-none focus:outline-none
      "
      :class="{
        'bg-primary-200 text-primary-900': isActive,
      }"
    >
      <span>{{ option }}</span>
      <CheckIcon
        v-show="isSelected"
        :class="[isActive ? 'text-emerald-900' : 'text-primary-500'"
      />
    </ListboxOption>
  </Listbox>
</template>

<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/solid'
import { Listbox, ListboxOption } from './Listbox'
import { options } from '../options'
</script>
