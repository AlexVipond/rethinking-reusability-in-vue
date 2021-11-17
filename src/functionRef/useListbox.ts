import { ref, watch, computed, onMounted, onBeforeUpdate } from 'vue'
import { bind, on } from '@baleada/vue-features'

let totalIds = 0

export function useListbox () {
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

  bind({
    element: optionsElements,
    values: {
      id: ({ index }) => ids.value[index],
    }
  })

  const rootElement = ref<HTMLElement>()
  const rootRef = (element: HTMLElement) => {
    rootElement.value = element
  }

  bind({
    element: rootElement,
    values: {
      role: 'listbox',
      ariaOrientation: 'vertical'
    }
  })

  bind({
    element: optionsElements,
    values: { role: 'option' }
  })

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

  bind({
    element: rootElement,
    values: { ariaActivedescendant }
  })

  on<any>({
    element: optionsElements,
    effects: {
      'cmd+down': event => {
        event.preventDefault()
        activate(optionsElements.value.length - 1)
      },
      'cmd+up': event => {
        event.preventDefault()
        activate(0)
      },
      mouseenter: {
        createEffect: ({ index }) => () => activate(index),
      },
      down: {
        createEffect: ({ index }) => event => {
          event.preventDefault()
          activateNext(index)
        }
      },
      up: {
        createEffect: ({ index }) => event => {
          event.preventDefault()
          activatePrevious(index)
        }
      },
    }
  })

  const selected = ref(0)

  const select = (index: number) => {
    selected.value = index
  }

  const isSelected = (index: number) => {
    return index === selected.value
  }

  bind({
    element: optionsElements,
    values: {
      ariaSelected: {
        get: ({ index }) => isSelected(index) || undefined,
        watchSources: selected,
      },
    }
  })
  
  on<any>({
    element: optionsElements,
    effects: {
      click: {
        createEffect: ({ index }) => () => select(index),
      },
      space: {
        createEffect: ({ index }) => () => select(index),
      },
      enter: {
        createEffect: ({ index }) => () => select(index),
      },
    }
  })

  onMounted(() => {
    watch(
      active,
      () => optionsElements.value[active.value].focus(),
      { flush: 'post' }
    )
  })

  bind({
    element: rootElement,
    values: { tabindex: -1 },
  })

  bind({
    element: optionsElements,
    values: {
      tabindex: {
        get: ({ index }) => isSelected(index) ? 0 : -1,
        watchSources: selected,
      },
    }
  })

  return {
    active, activate, activatePrevious, activateNext, isActive,
    selected, select, isSelected,
    rootRef,
    getOptionRef,
  }
}
