<template lang="pug">
div.fixed.inset-0.z-0.bg-neutral-800(
  ref="containerRef"
  tabindex="0"
  @click="onClick"
  @mousemove="onMouseMove"
  @mouseleave="cursorVisible = false"
  @mouseenter="onMouseEnter"
  @touchstart.passive="onTouchStart"
  @touchend.passive="onTouchEnd"
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
        :imgix-params="mobileImgixParams"
        :class="objectFit === 'cover' ? 'w-full h-full object-cover' : 'w-full h-full object-contain'"
      )
      p(
        v-if="slide.caption"
        class="absolute bottom-4 left-4 right-4 opacity-60 text-sm w-2x3"
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
const isRotated = ref(false)
const isMobile = ref(false)
const isTouchLike = ref(false)

const ROTATION_QUERY = '(max-width: 768px) and (orientation: portrait)'
const MOBILE_QUERY = '(max-width: 768px)'
const TOUCH_LIKE_QUERY = '(hover: none), (pointer: coarse)'

// Avoid first-paint with the wrong compression on mobile.
if (typeof window !== 'undefined') {
  const mqMobile = window.matchMedia(MOBILE_QUERY)
  isMobile.value = mqMobile.matches
  mqMobile.addEventListener('change', (e: MediaQueryListEvent) => { isMobile.value = e.matches })

  const mqTouchLike = window.matchMedia(TOUCH_LIKE_QUERY)
  isTouchLike.value = mqTouchLike.matches
  mqTouchLike.addEventListener('change', (e: MediaQueryListEvent) => {
    isTouchLike.value = e.matches
  })
}

onMounted(() => {
  const mq = window.matchMedia(ROTATION_QUERY)
  isRotated.value = mq.matches
  mq.addEventListener('change', (e) => { isRotated.value = e.matches })
})

const mobileImgixParams = computed(() => {
  if (!isMobile.value) return undefined
  // Remove Imgix `compress` while keeping modern formats.
  return { auto: ['format'], q: 90 }
})

function toggleObjectFit() {
  objectFit.value = objectFit.value === 'cover' ? 'contain' : 'cover'
}

watch(() => props.slideshow, () => {
  currentIndex.value = 0
}, { immediate: true })

function onMouseMove(e: MouseEvent) {
  if (isTouchLike.value) return
  cursorX.value = e.clientX
  cursorY.value = e.clientY
  const el = containerRef.value
  if (el) cursorOnLeft.value = e.clientX < el.getBoundingClientRect().width / 2
}

function onMouseEnter() {
  // On touch devices some browsers still synthesize hover/mouse events.
  // Avoid turning the arrow overlay on in that case.
  if (isTouchLike.value) return
  cursorVisible.value = true
}

let touchStartPos = 0
const SWIPE_THRESHOLD = 30

function onTouchStart(e: TouchEvent) {
  const t = e.changedTouches.item(0)
  if (!t) return
  cursorVisible.value = false
  touchStartPos = isRotated.value ? t.clientY : t.clientX
}

function onTouchEnd(e: TouchEvent) {
  const t = e.changedTouches.item(0)
  if (!t) return
  cursorVisible.value = false
  const endPos = isRotated.value ? t.clientY : t.clientX
  const delta = endPos - touchStartPos
  if (Math.abs(delta) < SWIPE_THRESHOLD) return
  if (isRotated.value) {
    if (delta > 0) next()
    else prev()
  } else {
    if (delta < 0) next()
    else prev()
  }
}

function onClick(e: MouseEvent) {
  const el = containerRef.value
  if (!el || !props.slideshow.length) return
  if (isRotated.value) {
    const midpoint = window.innerHeight / 2
    if (e.clientY < midpoint) prev()
    else next()
  } else {
    const midpoint = el.getBoundingClientRect().width / 2
    if (e.clientX < midpoint) prev()
    else next()
  }
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

// On touch/coarse-pointer devices, don't show the custom "arrow cursor".
// Some mobile browsers still synthesize hover/mouse events, which can make
// the cursor appear even without a pointing device.
@media (hover: none), (pointer: coarse), (max-width: 768px)
  .nav-cursor
    display: none !important

  // Be explicit: ensure the native cursor arrow stays hidden on mobile too.
  div.fixed
    cursor: none !important
</style>
