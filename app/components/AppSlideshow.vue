<template lang="pug">
  div.fixed.inset-0.z-0.bg-neutral-800(
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
          class="w-full h-full object-cover"
        )
        p(
          v-if="slide.caption"
          class="absolute bottom-4 left-4 right-4 text-white text-sm drop-shadow-md"
        ) {{ slide.caption }}
    div.v-else.flex.items-center.justify-center.text-neutral-400
      p No slides
</template>

<script setup lang="ts">
import type { ProjectDocumentDataSlideshowItem } from '~~/prismicio-types'

const props = defineProps<{
  slideshow: ProjectDocumentDataSlideshowItem[]
}>()

const currentIndex = ref(0)

watch(() => props.slideshow, () => {
  currentIndex.value = 0
}, { immediate: true })

function next() {
  if (!props.slideshow.length) return
  currentIndex.value = (currentIndex.value + 1) % props.slideshow.length
}
</script>
