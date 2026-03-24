<template lang="pug">
.fixed.overflow-y-auto.px-2.py-1.w-full.top-12.text-3xl.text-right(
  ref="panelRef"
  role="dialog"
  aria-label="Info"
  tabindex="-1"
  class=""
  @keydown.escape="emit('close')"
)
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