<template lang="pug">
div.fixed.inset-0.z-0.bg-neutral-800(
  ref="containerRef"
  tabindex="0"
  @click="onClick"
  @mousemove="onMouseMove"
  @mouseleave="cursorVisible = false"
  @mouseenter="cursorVisible = true"
  @keydown.right.prevent="next"
  @keydown.left.prevent="prev"
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
        class="absolute bottom-4 left-4 right-4 opacity-60 text-sm"
      ) {{ slide.caption }}
    span.nav-cursor(
      :class="{ 'is-visible': cursorVisible }"
      :style="{ left: cursorX + 'px', top: cursorY + 'px' }"
    ) {{ cursorOnLeft ? '&#8592;' : '&#8594;' }}
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
const cursorX = ref(0)
const cursorY = ref(0)
const cursorOnLeft = ref(false)
const cursorVisible = ref(false)

function toggleObjectFit() {
  objectFit.value = objectFit.value === 'cover' ? 'contain' : 'cover'
}

watch(() => props.slideshow, () => {
  currentIndex.value = 0
}, { immediate: true })

function onMouseMove(e: MouseEvent) {
  cursorX.value = e.clientX
  cursorY.value = e.clientY
  const el = containerRef.value
  if (el) cursorOnLeft.value = e.clientX < el.getBoundingClientRect().width / 2
}

function onClick(e: MouseEvent) {
  const el = containerRef.value
  if (!el || !props.slideshow.length) return
  const midpoint = el.getBoundingClientRect().width / 2
  if (e.clientX < midpoint) prev()
  else next()
}

function next() {
  if (!props.slideshow.length) return
  currentIndex.value = (currentIndex.value + 1) % props.slideshow.length
  emit('advance')
}

function prev() {
  if (!props.slideshow.length) return
  currentIndex.value = (currentIndex.value - 1 + props.slideshow.length) % props.slideshow.length
  emit('advance')
}
</script>

<style scoped lang="sass">
div.fixed
  cursor: none

.nav-cursor
  position: fixed
  z-index: 30
  pointer-events: none
  transform: translate(-50%, -50%)
  font-size: 1.5rem
  color: #e0dee5
  mix-blend-mode: difference
  opacity: 0
  transition: opacity 0.15s ease

.nav-cursor.is-visible
  opacity: 0.5
</style>
