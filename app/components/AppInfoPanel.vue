<template lang="pug">
div.relative.overflow-y-auto.px-2.py-1.w-1x4.md_w-2x12.border.border-stone-700.-translate-x-px(
  ref="panelRef"
  role="dialog"
  aria-label="Info"
  tabindex="-1"
  class="bg-black-80 backdrop-blur-sm"
  @keydown.escape="emit('close')"
)
  button.absolute.right-2.top-1.opacity-80(
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
<style lang="sass" scoped>
:deep(p)
  a:link, a:visited
    opacity: .8
  a:hover, a:focus
    opacity: 1
</style>