<template lang="pug">
div.fixed.inset-0.z-0.bg-neutral-800(
  ref="containerRef"
  role="button"
  tabindex="0"
  @click="next"
  @keydown.space.prevent="next"
  @keydown.enter.prevent="next"
)
  template(v-if="slideshow.length")
    div.absolute.inset-0(
      v-for="(slide, i) in slideshow"
      :key="i"
      :class="{ 'opacity-100 z-10': i === currentIndex, 'opacity-0 pointer-events-none': i !== currentIndex }"
    )
      PrismicImage(
        :field="slide.image"
        :loading="i === currentIndex ? 'eager' : 'lazy'"
        :class="objectFit === 'cover' ? 'w-full h-full object-cover' : 'w-full h-full object-contain'"
      )
      p(
        v-if="slide.caption"
        class="absolute bottom-4 left-4 right-4 opacity-60"
      ) {{ slide.caption }}
  div.flex.items-center.justify-center(v-else)
    p No slides
</template>

<script setup lang="ts">
import type { ProjectDocumentDataSlideshowItem } from '~~/prismicio-types'

const props = defineProps<{
  slideshow: ProjectDocumentDataSlideshowItem[]
}>()

const emit = defineEmits<{
  advance: []
}>()

const currentIndex = ref(0)
const objectFit = ref<'cover' | 'contain'>('cover')
const containerRef = ref<HTMLElement | null>(null)

function toggleObjectFit() {
  objectFit.value = objectFit.value === 'cover' ? 'contain' : 'cover'
}

watch(() => props.slideshow, () => {
  currentIndex.value = 0
}, { immediate: true })

function next() {
  if (!props.slideshow.length) return
  currentIndex.value = (currentIndex.value + 1) % props.slideshow.length
  emit('advance')

}
</script>

<style scoped lang="sass" >
  div[role="button"]
    cursor: e-resize
</style>
