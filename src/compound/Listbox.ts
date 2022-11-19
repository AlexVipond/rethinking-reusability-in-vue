import {
  defineComponent, provide, inject,
  ref, watch, computed
} from 'vue'
import type { PropType, InjectionKey, Ref } from 'vue'

const ListboxSymbol: InjectionKey<ListboxProvided> = Symbol('Listbox')

type ListboxProvided = {
  storeId: (option: string, id: string) => void,
  focused: Ref<string>,
  focus: (option: string) => void,
  focusPrevious: (option: string) => void,
  focusNext: (option: string) => void,
  focusFirst: () => void,
  focusLast: () => void,
  isFocused: (option: string) => boolean,
  selected: Ref<string>,
  select: (option: string) => void,
  isSelected: (option: string) => boolean,
}

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
    const ids = ref<{ [option: string]: string }>({})

    const storeId = (option: string, id: string) => {
      ids.value[option] = id
    }
    
    const focused = ref(props.options[0])
    const ariaActivedescendant = computed(() => ids.value[focused.value])

    const focus = (option: string) => {
      focused.value = option
    }

    const focusPrevious = (option: string) => {
      const index = props.options.indexOf(option)

      if (index === 0) {
        return
      }

      focused.value = props.options[index - 1]
    }

    const focusNext = (option: string) => {
      const index = props.options.indexOf(option)

      if (index === props.options.length - 1) {
        return
      }

      focused.value = props.options[index + 1]
    }

    const focusFirst = () => {
      focused.value = props.options[0]
    }

    const focusLast = () => {
      focused.value = props.options[props.options.length - 1]
    }

    const isFocused = (option: string) => {
      return option === focused.value
    }

    const selected = computed(() => props.modelValue)

    const select = (option: string) => {
      emit('update:modelValue', option)
    }

    const isSelected = (option: string) => {
      return option === selected.value
    }

    provide(ListboxSymbol, {
      storeId,
      focused,
      focus,
      focusPrevious,
      focusNext,
      focusFirst,
      focusLast,
      isFocused,
      selected,
      select,
      isSelected,
    })

    return () => slots.default({
      bindings: {
        role: 'listbox',
        'aria-orientation': 'vertical',
        'aria-activedescendant': ariaActivedescendant.value,
        tabindex: -1,
      },
      focused,
      focus,
      focusFirst,
      focusLast,
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
      storeId,
      focused,
      focus,
      focusPrevious,
      focusNext,
      focusFirst,
      focusLast,
      isFocused,
      selected,
      select,
      isSelected,
    } = inject(ListboxSymbol)
    
    const id = 'compound-listbox-option-' + totalIds++
    storeId(props.option, id)
    
    const getEl = ref<() => HTMLElement>()

    watch(
      [focused, selected],
      () => {
        if (isFocused(props.option)) {
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
          tabindex: isSelected(props.option) ? 0 : -1,
          'aria-selected': isSelected(props.option),
          onClick: () => select(props.option),
          onMouseenter: () => focus(props.option),
          onKeydown: event => {
            switch (event.key) {
              case 'ArrowUp':
                event.preventDefault()
                if (event.metaKey) {
                  focusFirst()
                  break
                }
                focusPrevious(props.option)
                break
              case 'ArrowDown':
                event.preventDefault()
                if (event.metaKey) {
                  focusLast()
                  break
                }
                focusNext(props.option)
                break
              case 'Enter':
              case ' ':
                event.preventDefault()
                select(props.option)
                break
            }
          },
        },
        isFocused: () => isFocused(props.option),
        focusPrevious: () => focusPrevious(props.option),
        focusNext: () => focusNext(props.option),
        isSelected: () => isSelected(props.option),
      })

      getEl.value = () => rendered[0].el as HTMLElement

      return rendered
    }
  }
})
