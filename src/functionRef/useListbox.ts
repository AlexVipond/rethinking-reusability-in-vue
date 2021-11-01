import { ref, watch, computed, onMounted, onBeforeUpdate } from 'vue'

export function useListbox (options: string[]) {
  // ACTIVE
  const activeIndex = ref(0)

  const activate = (index: number) => {
    activeIndex.value = index
  }

  const activatePrevious = (index: number) => {
    if (index === 0) {
      return
    }

    activeIndex.value = index - 1
  }

  const activateNext = (index: number) => {
    if (index === options.length - 1) {
      return
    }

    activeIndex.value = index + 1
  }

  const isActive = (index: number) => {
    return index === activeIndex.value
  }


  // SELECTED
  const selected = ref(options[0])

  const selectedIndex = computed(() => {
    const index = options.indexOf(selected.value)
    return index === -1 ? 0 : index
  })

  const select = (index: number) => {
    selected.value = options[index]
  }

  const isSelected = (index: number) => {
    return index === selectedIndex.value
  }


  // ELEMENTS
  const rootElement = ref<HTMLElement>()
  const rootRef = (element: HTMLElement) => {
    rootElement.value = element
  }

  const optionsElements = ref<HTMLElement[]>([])
  const getOptionsRef = (index: number) => (element: HTMLElement) => {
    optionsElements.value[index] = element
  }
  onBeforeUpdate(() => {
    optionsElements.value = []
  })


  // FOCUS MANAGEMENT
  onMounted(() => {
    watch(
      activeIndex,
      () => optionsElements.value[activeIndex.value].focus(),
      { flush: 'post' }
    )
  })

  return {
    activeIndex, activate, activatePrevious, activateNext, isActive,
    selected, selectedIndex, select, isSelected,
    rootRef,
    getOptionsRef,
  }
}
