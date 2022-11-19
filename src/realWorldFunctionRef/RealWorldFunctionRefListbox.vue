<template>
  <ul
    :ref="listbox.root.ref"
    class="
      w-full h-96
      flex flex-col gap-3 overflow-scroll
      bg-white rounded shadow-md
    "
  >
    <li
      v-for="(option, index) in options"
      :key="option"
      :ref="listbox.options.getRef(index)"
      class="
        text-lg
        flex items-center gap-3 p-2
        transition duration-150 focus:border-none focus:outline-none
      "
      :class="{
        'bg-indigo-200 text-indigo-900': listbox.is.focused(index),
      }"
    >
      <span>{{ option }}</span>
      <CheckIcon
        v-show="listbox.is.selected(index)"
        class="h-[1em] w-[1em]"
        :class="{ 'text-indigo-900': listbox.is.focused(index) }"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/solid'
import { useListbox } from '@baleada/vue-features'

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
