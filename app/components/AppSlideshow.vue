<template lang="pug">
  div.fixed.inset-0.z-0.bg-neutral-800.overflow-hidden(
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
      //- Added transition classes for smooth fading
      div.absolute.inset-0.transition-opacity.duration-700.ease-in-out(
        v-for="(slide, i) in slideshow"
        :key="i"
        :class="{ 'opacity-100 z-10': i === currentIndex, 'opacity-0 pointer-events-none': i !== currentIndex }"
      )
        //- Vimeo
        template(v-if="getVideoType(slide) === 'vimeo'")
          div.relative.w-full.h-full.overflow-hidden.bg-black
            iframe.pointer-events-none(
              :class="objectFit === 'cover' ? 'iframe-cover' : 'w-full h-full'"
              :ref="el => setMediaRef(el, i)"
              :src="vimeoEmbedUrl(slide.media.url)"
              frameborder="0"
              allow="autoplay; fullscreen"
            )
  
        //- YouTube
        template(v-else-if="getVideoType(slide) === 'youtube'")
          div.relative.w-full.h-full.overflow-hidden.bg-black
            iframe.pointer-events-none(
              :class="objectFit === 'cover' ? 'iframe-cover' : 'w-full h-full'"
              :ref="el => setMediaRef(el, i)"
              :src="youtubeEmbedUrl(slide.media.url)"
              frameborder="0"
              allow="autoplay; fullscreen"
              allowfullscreen
            )
  
        //- Direct video file
        template(v-else-if="getVideoType(slide) === 'file'")
          video.w-full.h-full(
            :ref="el => setMediaRef(el, i)"
            :src="slide.media.url"
            autoplay
            :muted="isMuted"
            loop
            playsinline
            :class="objectFit === 'cover' ? 'object-cover' : 'object-contain'"
            :key="i === currentIndex ? 'active' : 'inactive'"
          )
  
        //- Fallback: image
        template(v-else)
          PrismicImage(
            :field="slide.image"
            :loading="i === currentIndex ? 'eager' : 'lazy'"
            :imgix-params="mobileImgixParams"
            :class="objectFit === 'cover' ? 'w-full h-full object-cover' : 'w-full h-full object-contain'"
          )
  
        p(
          v-if="slide.caption"
          class="absolute bottom-2 left-2 text-sm w-2x3 mix-blend-difference z-20"
        ) {{ slide.caption }}
  
      span.nav-cursor(
        :class="{ 'is-visible': cursorVisible }"
        :style="{ left: cursorX + 'px', top: cursorY + 'px' }"
      ) {{ cursorOnLeft ? '&#8592;' : '&#8594;' }}

      //- Global Mute/Unmute Button
      button.absolute.bottom-4.right-4.z-50.text-2xl.drop-shadow-md.transition-transform.hover_scale-110(
        v-if="currentIsVideo"
        @click.stop="toggleMute"
      )
        | {{ isMuted ? '🔇' : '🔊' }}
  
    div.flex.items-center.justify-center.h-full(v-else)
      p No slides
  </template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
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

// Audio specific refs
const isMuted = ref(true)
const mediaRefs = ref<Record<number, HTMLIFrameElement | HTMLVideoElement | null>>({})

const ROTATION_QUERY = '(max-width: 768px) and (orientation: portrait)'
const MOBILE_QUERY = '(max-width: 768px)'
const TOUCH_LIKE_QUERY = '(hover: none), (pointer: coarse)'

onMounted(() => {
  const mq = window.matchMedia(ROTATION_QUERY)
  isRotated.value = mq.matches
  mq.addEventListener('change', (e) => { isRotated.value = e.matches })

  const mqMobile = window.matchMedia(MOBILE_QUERY)
  isMobile.value = mqMobile.matches
  mqMobile.addEventListener('change', (e: MediaQueryListEvent) => { isMobile.value = e.matches })

  const mqTouchLike = window.matchMedia(TOUCH_LIKE_QUERY)
  isTouchLike.value = mqTouchLike.matches
  mqTouchLike.addEventListener('change', (e: MediaQueryListEvent) => { isTouchLike.value = e.matches })
})

const mobileImgixParams = computed(() => {
  if (!isMobile.value) return undefined
  return { auto: ['format'], q: 90 }
})

const currentIsVideo = computed(() => {
  if (!props.slideshow.length) return false
  return getVideoType(props.slideshow[currentIndex.value]) !== null
})

function setMediaRef(el: any, index: number) {
  mediaRefs.value[index] = el
}

function toggleObjectFit() {
  objectFit.value = objectFit.value === 'cover' ? 'contain' : 'cover'
}

watch(() => props.slideshow, () => {
  currentIndex.value = 0
}, { immediate: true })

watch(currentIndex, (newIndex) => {
  // Apply current mute state to the newly active video
  nextTick(() => {
    applyMuteState(newIndex)
  })
})

function onMouseMove(e: MouseEvent) {
  if (isTouchLike.value) return
  cursorX.value = e.clientX
  cursorY.value = e.clientY
  const el = containerRef.value
  if (el) cursorOnLeft.value = e.clientX < el.getBoundingClientRect().width / 2
}

function onMouseEnter() {
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

// --- Video helpers ---

type VideoType = 'vimeo' | 'youtube' | 'file' | null

function getVideoType(slide: ProjectDocumentDataSlideshowItem): VideoType {
  const url = slide.media?.url
  if (!url) return null
  if (/vimeo\.com/i.test(url)) return 'vimeo'
  if (/youtu\.be|youtube\.com/i.test(url)) return 'youtube'
  return 'file'
}

function vimeoEmbedUrl(url: string): string {
  const match = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/)
  const id = match?.[1] ?? ''
  return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&controls=0&api=1`
}

function youtubeEmbedUrl(url: string): string {
  const match = url.match(/(?:youtu\.be\/|[?&]v=)([\w-]{11})/)
  const id = match?.[1] ?? ''
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&enablejsapi=1`
}

// --- Audio Controls ---

function toggleMute() {
  isMuted.value = !isMuted.value
  applyMuteState(currentIndex.value)
}

function applyMuteState(index: number) {
  const el = mediaRefs.value[index]
  if (!el) return
  
  const slide = props.slideshow[index]
  const type = getVideoType(slide)

  if (type === 'file' && el instanceof HTMLVideoElement) {
    el.muted = isMuted.value
  } else if (type === 'vimeo' && el instanceof HTMLIFrameElement) {
    el.contentWindow?.postMessage(JSON.stringify({
      method: 'setVolume',
      value: isMuted.value ? 0 : 1
    }), '*')
  } else if (type === 'youtube' && el instanceof HTMLIFrameElement) {
    el.contentWindow?.postMessage(JSON.stringify({
      event: 'command',
      func: isMuted.value ? 'mute' : 'unMute',
      args: []
    }), '*')
  }
}
</script>

<style scoped lang="sass">
div.fixed
  cursor: none

/* CSS trick to make 16:9 iframes act like object-fit: cover */
.iframe-cover
  position: absolute
  top: 50%
  left: 50%
  width: 100vw
  height: 56.25vw  // 100 * 9 / 16 (16:9 aspect ratio)
  min-height: 100vh
  min-width: 177.77vh // 100 * 16 / 9 (16:9 aspect ratio)
  transform: translate(-50%, -50%)

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

@media (hover: none), (pointer: coarse), (max-width: 768px)
  .nav-cursor
    display: none !important

  div.fixed
    cursor: auto !important
</style>