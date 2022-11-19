<template>
  <Listbox
    :options="options"
    :modelValue="modelValueProxy"
    @update:modelValue="option => modelValueProxy = option"
    v-slot="{ bindings, focused, focus, focusFirst, focusLast, selected, select }"
  >
    <ul
      v-bind="bindings"
      class="
        w-full h-96
        flex flex-col gap-3 overflow-scroll
        bg-white rounded shadow-md
      "
    >
      <ListboxOption
        v-for="option in options"
        :key="option"
        :option="option"
        v-slot="{ bindings, isFocused, isSelected, focusPrevious, focusNext }"
      >
        <li
          v-bind="bindings"
          class="
            text-lg
            flex items-center gap-3 p-2
            transition duration-150 focus:border-none focus:outline-none
          "
          :class="{
            'bg-red-200 text-red-900': isFocused(),
          }"
        >
          <span>{{ option }}</span>
          <CheckIcon
            v-show="isSelected()"
            class="h-[1em] w-[1em]"
            :class="{ 'text-red-900': isFocused() }"
          />
        </li>
      </ListboxOption>
    </ul>
  </Listbox>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/solid'
import { Listbox, ListboxOption } from './Listbox'

// This component only makes sense as a controlled component,
// so we need to configure props and emit.
const props = defineProps<{
  options: string[],
  modelValue: string,
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', option: string): void,
}>()

// We can use `computed` with getter and setter to easily control
// the value of the `Listbox` component.
const modelValueProxy = computed({
  get: () => props.modelValue,
  set: option => emit('update:modelValue', option),
})
</script>
