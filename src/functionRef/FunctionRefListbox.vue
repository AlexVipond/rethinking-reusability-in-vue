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
      :ref="listbox.getOptionRef(index)"
      class="
        text-lg
        flex items-center gap-3 p-2
        transition duration-150 focus:border-none focus:outline-none
      "
      :class="{
        'bg-emerald-200 text-emerald-900': listbox.isActive(index),
      }"
    >
      <span>{{ option }}</span>
      <CheckIcon
        v-show="listbox.isSelected(index)"
        class="h-[1em] w-[1em]"
        :class="{ 'text-emerald-900': listbox.isActive(index) }"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import { CheckIcon } from '@heroicons/vue/solid'
import { useListbox } from './useListbox'

// Set up all listbox state management and methods
const listbox = useListbox()


// To make this into a controlled component:
// - Configure props and emit
// - Set up watcher to emit selected option
const props = defineProps<{
  options: string[],
  modelValue: string,
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', option: string): void,
}>()

watchEffect(() => emit('update:modelValue', props.options[listbox.selected.value]))
</script>
