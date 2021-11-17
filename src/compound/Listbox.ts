import { defineComponent, h, provide, inject, ref, watch, computed, onMounted, onBeforeUpdate } from 'vue'
import type { PropType } from 'vue'

const ListboxSymbol = Symbol('Listbox')

let totalIds = 0

export const Listbox = defineComponent({
  name: 'Listbox',
  props: {
    options: {
      type: Array as PropType<string[]>,
    },
    modelValue: {
      type: String,
    },
  },
  setup (props, { slots, emit, expose }) {
    const optionsElements = ref<HTMLElement[]>([])
    
    const storeOptionsElement = (index: number, element: HTMLElement) => {
      optionsElements.value[index] = element
    }

    onBeforeUpdate(() => optionsElements.value = [])

    const ids = ref([])
    onMounted(() => ids.value = optionsElements.value.map(() => `compound-listbox-option-${totalIds++}`))
    
    const active = ref(0)
    const ariaActivedescendant = computed(() => ids.value[active.value])

    const activate = (index: number) => {
      active.value = index
    }

    const activatePrevious = (index: number) => {
      if (index === 0) {
        return
      }

      active.value = index - 1
    }

    const activateNext = (index: number) => {
      if (index === optionsElements.value.length - 1) {
        return
      }

      active.value = index + 1
    }

    const isActive = (index: number) => {
      return index === active.value
    }

    const selected = computed(() => props.options.indexOf(props.modelValue))

    const select = (index: number) => {
      emit('update:modelValue', props.options[index])
    }

    const isSelected = (index: number) => {
      return index === selected.value
    }

    watch(
      [active, selected],
      () => {
        optionsElements.value[active.value].focus()
      },
      { flush: 'post' }
    )

    provide(ListboxSymbol, {
      options: props.options,
      storeOptionsElement,
      ids,
      activate,
      activatePrevious,
      activateNext,
      isActive,
      select,
      isSelected,
    })

    const bindings = computed(() => ({
      role: 'listbox',
      'aria-orientation': 'vertical',
      'aria-activedescendant': ariaActivedescendant.value,
      tabindex: -1,
    }))

    return () => h(
      () => slots.default({
        bindings: bindings.value,
        active,
        activate,
        selected,
        select,
      })
    )
  }
})

export const ListboxOption = defineComponent({
  name: 'ListboxOption',
  props: {
    option: {
      type: String
    },
  },
  setup (props, { slots }) {
    const {
      options,
      storeOptionsElement,
      ids,
      activate,
      activatePrevious,
      activateNext,
      isActive,
      select,
      isSelected,
    } = inject(ListboxSymbol)

    const index = options.indexOf(props.option)
    
    const id = computed(() => ids.value[index])

    return () => h(
      () => slots.default({
        bindings: {
          role: 'option',
          id,
          'aria-selected': isSelected(index),
          tabindex: isSelected(index) ? 0 : -1,
          ref: el => storeOptionsElement(index, el),
          onMouseenter: () => activate(index),
          onClick: () => select(index),
          onKeydown: event => {
            switch (event.key) {
              case 'ArrowUp':
                event.preventDefault()
                if (event.metaKey) {
                  activate(0)
                  break
                }
                activatePrevious(index)
                break
              case 'ArrowDown':
                event.preventDefault()
                if (event.metaKey) {
                  activate(options.length - 1)
                  break
                }
                activateNext(index)
                break
              case 'Enter':
              case ' ':
                event.preventDefault()
                select(index)
                break
            }
          },
        },
        isActive: () => isActive(index),
        isSelected: () => isSelected(index),
        activatePrevious: () => activatePrevious(index),
        activateNext: () => activateNext(index),
      })
    )
  }
})
