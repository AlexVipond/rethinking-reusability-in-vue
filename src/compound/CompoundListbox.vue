<template>
  <Listbox
    :options="options"
    :modelValue="modelValueProxy"
    @update:modelValue="option => modelValueProxy = option"
    v-slot="{ bindings, active, activate, selected, select }"
  >
    <ul
      v-bind)="bindings"
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
        v-slot="{ bindings, isActive, isSelected, activatePrevious, activateNext }"
      >
        <li
          v-bind="bindings"
          class="
            text-lg
            flex items-center gap-3 p-2
            transition duration-150 focus:border-none focus:outline-none
          "
          :class="{
            'bg-primary-200 text-primary-900': isActive(),
          }"
        >
          <span>{{ option }}</span>
          <CheckIcon
            v-show="isSelected()"
            class="h-[1em] w-[1em]"
            :class="{ 'text-emerald-900': isActive() }"
          />
        </li>
      </ListboxOption>
    </ul>
  </Listbox>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckIcon } from '@heroicons/vue/solid'
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
