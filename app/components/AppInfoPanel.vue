<template lang="pug">
div.fixed.inset-0.z-30.flex.items-center.justify-center.p-6(
  role="dialog"
  aria-modal="true"
  aria-label="Info"
  tabindex="-1"
  @keydown.escape="emit('close')"
)
  .fixed.inset-0(
    aria-hidden="true"
    class="bg-black/70"
    @click="emit('close')"
  )
  .relative.z-10.max-h-full.max-w-2xl.overflow-y-auto.rounded-lg.bg-neutral-900.p-8.text-white.shadow-xl(
    ref="panelRef"
    @click.stop
  )
    button.absolute.right-4.top-4.p-2.text-white.opacity-80(
      type="button"
      class="hover_opacity-100"
      aria-label="Close"
      @click="emit('close')"
    ) ×
    div.text-white(v-if="hasContent")
      PrismicRichText(:field="field")
    p.text-neutral-400(v-else) No content
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
