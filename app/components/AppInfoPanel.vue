<template lang="pug">
div.relative.overflow-y-auto.p-3.w-2x12.border.border-stone-700(
  ref="panelRef"
  role="dialog"
  aria-label="Info"
  tabindex="-1"
  class="bg-black-40 backdrop-blur-sm"
  @keydown.escape="emit('close')"
)
  button.absolute.right-4.top-4.p-2.opacity-80(
    type="button"
    class="hover_opacity-100"
    aria-label="Close"
    @click="emit('close')"
  ) ×
  div(v-if="hasContent")
    PrismicRichText(:field="field")
  p(v-else) No content
</template>

<script setup lang="ts">
import { PrismicRichText } from '@prismicio/vue'
import { isFilled } from '@prismicio/client'
import type { RichTextField } from '@prismicio/client'

const props = defineProps<{
  field: RichTextField | null | undefined
}>()

const hasContent = computed(() => isFilled.richText(props.field))

const emit = defineEmits<{
  close: []
}>()

const panelRef = ref<HTMLElement | null>(null)

onMounted(() => {
  panelRef.value?.focus()
})
</script>
