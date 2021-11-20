import {
  defineComponent, provide, inject,
  shallowRef, ref, watch, computed
} from 'vue'
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
  setup (props, { slots, emit }) {
    const ids = shallowRef<{ [option: string]: string }>({})

    for (const option of props.options) {
      ids.value[option] = 'compound-listbox-option-' + totalIds++
    }
    
    const active = ref(props.options[0])
    const ariaActivedescendant = computed(() => ids.value[active.value])

    const activate = (option: string) => {
      active.value = option
    }

    const activatePrevious = (option: string) => {
      const index = props.options.indexOf(option)

      if (index === 0) {
        return
      }

      active.value = props.options[index - 1]
    }

    const activateNext = (option: string) => {
      const index = props.options.indexOf(option)

      if (index === props.options.length - 1) {
        return
      }

      active.value = props.options[index + 1]
    }

    const activateFirst = () => {
      active.value = props.options[0]
    }

    const activateLast = () => {
      active.value = props.options[props.options.length - 1]
    }

    const isActive = (option: string) => {
      return option === active.value
    }

    const selected = computed(() => props.modelValue)

    const select = (option: string) => {
      emit('update:modelValue', option)
    }

    const isSelected = (option: string) => {
      return option === selected.value
    }

    provide(ListboxSymbol, {
      options: props.options,
      ids,
      active,
      activate,
      activatePrevious,
      activateNext,
      activateFirst,
      activateLast,
      isActive,
      selected,
      select,
      isSelected,
    })

    const bindings = computed(() => ({
      role: 'listbox',
      'aria-orientation': 'vertical',
      'aria-activedescendant': ariaActivedescendant.value,
      tabindex: -1,
    }))

    return () => slots.default({
      bindings: bindings.value,
      active,
      activate,
      activateFirst,
      activateLast,
      selected,
      select,
    })
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
      ids,
      active,
      activate,
      activatePrevious,
      activateNext,
      activateFirst,
      activateLast,
      isActive,
      selected,
      select,
      isSelected,
    } = inject(ListboxSymbol)

    const getEl = shallowRef<() => HTMLElement>()
    
    const id = ids.value[props.option]

    watch(
      [active, selected],
      () => {
        if (isActive(props.option)) {
          getEl.value().focus()
        }
      },
      { flush: 'post' }
    )

    return () => {
      const rendered = slots.default({
        bindings: {
          role: 'option',
          id,
          'aria-selected': isSelected(props.option),
          tabindex: isSelected(props.option) ? 0 : -1,
          onMouseenter: () => activate(props.option),
          onClick: () => select(props.option),
          onKeydown: event => {
            switch (event.key) {
              case 'ArrowUp':
                event.preventDefault()
                if (event.metaKey) {
                  activateFirst()
                  break
                }
                activatePrevious(props.option)
                break
              case 'ArrowDown':
                event.preventDefault()
                if (event.metaKey) {
                  activateLast()
                  break
                }
                activateNext(props.option)
                break
              case 'Enter':
              case ' ':
                event.preventDefault()
                select(props.option)
                break
            }
          },
        },
        isActive: () => isActive(props.option),
        isSelected: () => isSelected(props.option),
        activatePrevious: () => activatePrevious(props.option),
        activateNext: () => activateNext(props.option),
      })

      getEl.value = () => rendered[0].el as HTMLElement

      return rendered
    }
  }
})
