import {
  ref, watch, computed,
  onMounted, onBeforeUpdate
} from 'vue'
import { bind, on } from '@baleada/vue-features'

let totalIds = 0

export function useListbox () {
  const rootElement = ref<HTMLElement>()
  const rootRef = (element: HTMLElement) => {
    rootElement.value = element
  }

  const optionsElements = ref<HTMLElement[]>([])
  const getOptionRef = (index: number) => (element: HTMLElement) => {
    optionsElements.value[index] = element
  }
  onBeforeUpdate(() => {
    optionsElements.value = []
  })

  const ids = ref([])
  
  onMounted(() => ids.value = optionsElements.value
    .map(() => 'function-ref-listbox-option-' + totalIds++))

  bind(
    optionsElements,
    {
      id: index => ids.value[index],
    }
  )

  bind(
    rootElement,
    {
      role: 'listbox',
      ariaOrientation: 'vertical'
    }
  )

  bind(
    optionsElements,
    { role: 'option' }
  )

  const focused = ref(0)
  const ariaActivedescendant = computed(() => ids.value[focused.value])

  const focus = (index: number) => {
    focused.value = index
  }

  const focusPrevious = (index: number) => {
    if (index === 0) {
      return
    }

    focused.value = index - 1
  }

  const focusNext = (index: number) => {
    if (index === optionsElements.value.length - 1) {
      return
    }

    focused.value = index + 1
  }

  const focusFirst = () => {
    focused.value = 0
  }

  const focusLast = () => {
    focused.value = optionsElements.value.length - 1
  }

  const isFocused = (index: number) => {
    return index === focused.value
  }

  bind(
    rootElement,
    { ariaActivedescendant }
  )

  on(
    optionsElements,
    {
      keydown: {
        createEffect: index => (event, { is }) => {
          if (is('cmd+down')) {
            event.preventDefault()
            focusLast()
          } else if (is('cmd+up')) {
            event.preventDefault()
            focusFirst()
          } else if (is('down')) {
            event.preventDefault()
            focusNext(index)
          } else if (is('up')) {
            event.preventDefault()
            focusPrevious(index)
          }
        }
      },
      mouseenter: {
        createEffect: index => event => focus(index),
      },
    }
  )

  const selected = ref(0)

  const select = (index: number) => {
    selected.value = index
  }

  const isSelected = (index: number) => {
    return index === selected.value
  }

  bind(
    optionsElements,
    {
      ariaSelected: {
        get: index => isSelected(index) || undefined,
        watchSource: selected,
      },
    }
  )
  
  on(
    optionsElements,
    {
      click: {
        createEffect: index => () => select(index),
      },
      keydown: {
        createEffect: index => (event, { is }) => {
          if (is('space') || is('enter')) {
            event.preventDefault()
            select(index)
          }
        }
      }
    }
  )

  onMounted(() => {
    watch(
      focused,
      () => optionsElements.value[focused.value].focus(),
      { flush: 'post' }
    )
  })

  bind(
    rootElement,
    { tabindex: -1 },
  )

  bind(
    optionsElements,
    {
      tabindex: {
        get: index => isSelected(index) ? 0 : -1,
        watchSource: selected,
      },
    }
  )

  return {
    focused, focus, focusPrevious, focusNext, focusFirst, focusLast, isFocused,
    selected, select, isSelected,
    rootRef,
    getOptionRef,
  }
}
