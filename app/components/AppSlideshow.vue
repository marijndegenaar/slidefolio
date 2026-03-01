<template lang="pug">
div.fixed.inset-0.z-0.bg-neutral-800(
  ref="containerRef"
  role="button"
  tabindex="0"
  @click="next"
  @keydown.space.prevent="next"
  @keydown.enter.prevent="next"
  @mousemove="onMouseMove"
  @mouseenter="cursorVisible = true"
  @mouseleave="cursorVisible = false"
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
  span.cursor-label(
    :class="{ 'is-visible': cursorVisible }"
    :style="cursorStyle"
  ) →
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

const cursorVisible = ref(false)
const cursorX = ref(0)
const cursorY = ref(0)

const cursorStyle = computed(() => ({
  transform: `translate(${cursorX.value}px, ${cursorY.value}px)`,
}))

function onMouseMove(e: MouseEvent) {
  cursorX.value = e.clientX
  cursorY.value = e.clientY
}

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

<style scoped>
div[role="button"] {
  cursor: none;
}
.cursor-label {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  pointer-events: none;
  font-size: 1rem;
  line-height: 1;
  color: white;
  mix-blend-mode: difference;
  opacity: 0;
  transition: opacity 0.2s ease;
  will-change: transform;
  padding-left: 14px;
  padding-top: 2px;
}
.cursor-label.is-visible {
  opacity: 1;
}
</style>
