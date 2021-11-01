<template>
  <ul
    :ref="listbox.rootRef"
    class="
      w-full h-96
      flex flex-col gap-3 overflow-scroll
      bg-white rounded shadow-md
    "
  >
    <li
      v-for="(option, index) in options"
      :key="option"
      :ref="listbox.getOptionsRef(index)"
      class="
        text-lg
        flex items-center gap-3 p-2
        transition duration-150 focus:border-none focus:outline-none
      "
      :class="{
        'bg-primary-200 text-primary-900': listbox.isActive(index),
      }"
    >
      <span>{{ option }}</span>
      <CheckIcon
        v-show="listbox.isSelected(index)"
        :class="[listbox.isActive(index) ? 'text-emerald-900' : 'text-primary-500'"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/solid'
import { useListbox } from './useListbox'
import { options } from '../options'

// TODO: Controlled

const listbox = useListbox(options)
</script>
