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
        :class="objectFit === 'cover' ? 'w-full h-full object-cover' : 'w-full h-full object-contain'"
      )
      p(
        v-if="slide.caption"
        class="absolute bottom-4 left-4 right-4"
      ) {{ slide.caption }}
  div.flex.items-center.justify-center(v-else)
    p No slides
  //- button.absolute.bottom-4.right-4.z-20.p-2.rounded.text-xs.uppercase.tracking-wide(
  //-   type="button"
  //-   class="bg-black-60 hover_bg-black-80 backdrop-blur-sm"
  //-   @click.stop="toggleObjectFit"
  //- ) {{ objectFit }}
</template>

<script setup lang="ts">
import type { ProjectDocumentDataSlideshowItem } from '~~/prismicio-types'

const props = defineProps<{
  slideshow: ProjectDocumentDataSlideshowItem[]
}>()

const currentIndex = ref(0)
const objectFit = ref<'cover' | 'contain'>('cover')

function toggleObjectFit() {
  objectFit.value = objectFit.value === 'cover' ? 'contain' : 'cover'
}

watch(() => props.slideshow, () => {
  currentIndex.value = 0
}, { immediate: true })

function next() {
  if (!props.slideshow.length) return
  currentIndex.value = (currentIndex.value + 1) % props.slideshow.length
}
</script>
