import { useClipboard, useTimeoutFn } from '@vueuse/core'
import { inBrowser } from 'vitepress'
import { ref } from 'vue'

export function useDemoCopy() {
  const copiedIndex = ref<number | null>(null)
  const copyErrorIndex = ref<number | null>(null)

  // SSR-safe: useClipboard uses onUnmounted internally, skip during SSR
  if (!inBrowser) {
    return {
      copiedIndex,
      copyErrorIndex,
      copyCode: async () => {},
    }
  }

  const { copy, isSupported } = useClipboard()

  const { start: clearCopied, stop: stopClearCopied } = useTimeoutFn(
    () => { copiedIndex.value = null },
    2000,
    { immediate: false },
  )

  const { start: clearError, stop: stopClearError } = useTimeoutFn(
    () => { copyErrorIndex.value = null },
    3000,
    { immediate: false },
  )

  async function copyCode(source: string | undefined, index: number) {
    if (!source)
      return

    stopClearCopied()
    stopClearError()

    if (!isSupported.value) {
      copyErrorIndex.value = index
      clearError()
      return
    }

    try {
      await copy(source)
      copiedIndex.value = index
      copyErrorIndex.value = null
      clearCopied()
    }
    catch (err) {
      console.error('[DemoCopy] failed to copy:', err)
      copyErrorIndex.value = index
      copiedIndex.value = null
      clearError()
    }
  }

  return {
    copiedIndex,
    copyErrorIndex,
    copyCode,
  }
}
