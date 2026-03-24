<template lang="pug">
  .header.fixed.flex.items-start.justify-between.w-full.mix-blend-difference.p-2
      img.w-1x12.logo(src="@/assets/img/question.png" alt="Info")
      button(
        type="button"
        @click="emit('toggle-info')"

        :aria-pressed="infoOpen"
      ) INFO
  
  nav.fixed.inset-0.z-2000.flex.items-center.pointer-events-none.mix-blend-difference(
    ref="navRef"
  )
    .absolute.bottom-full.left-0.w-full
      slot
  
    ul.list-none.w-full.px-2(
      ref="dropdownWrapRef"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    )
      li(
        v-for="project in projects"
        :key="project.uid"
      )
        button.w-full.text-left.text-2xl.py-1.md_py-0(
          type="button"
          :class="getItemClasses(project)"
          @click.stop="onItemClick(project)"
        )
          strong {{ project.data.title ?? 'Untitled' }}
          template(v-if="projectMeta(project)") , {{ projectMeta(project) }}
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    projects: ProjectDocument[]
    selectedUid: string | null
    infoOpen: boolean
    closeMenus: number
  }>()
  
  const emit = defineEmits<{
    'select-project': [project: ProjectDocument]
    'toggle-info': []
  }>()
  
  const dropdownOpen = ref(false)
  const dropdownWrapRef = ref<HTMLElement | null>(null)
  const navRef = ref<HTMLElement | null>(null)
  const isTouchLike = ref(false)
  
  onMounted(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)')
    isTouchLike.value = mq.matches
    mq.addEventListener('change', (e) => { isTouchLike.value = e.matches })
  })
  
  watch(() => props.closeMenus, () => {
    dropdownOpen.value = false
  })
  
  const selectedProject = computed(() =>
    props.projects.find(p => p.uid === props.selectedUid) ?? props.projects[0] ?? null,
  )
  
  function getItemClasses(project: ProjectDocument) {
    const isActive = project.uid === selectedProject.value?.uid
    return {
      'opacity-100 pointer-events-auto': isActive || dropdownOpen.value,
      'opacity-0 pointer-events-none': !isActive && !dropdownOpen.value,
    }
  }
  
  function projectMeta(project: ProjectDocument | null) {
    if (!project) return ''
    const d = project.data
    const parts: string[] = []
    if (d.year) parts.push(d.year)
    if (d.location) parts.push(d.location)
    if (d.project_type) parts.push(d.project_type)
    return parts.join(', ')
  }
  
  function onMouseEnter() {
    if (isTouchLike.value) return
    dropdownOpen.value = true
  }
  
  function onMouseLeave() {
    if (isTouchLike.value) return
    dropdownOpen.value = false
  }
  
  function onItemClick(project: ProjectDocument) {
    if (isTouchLike.value) {
      if (!dropdownOpen.value) {
        dropdownOpen.value = true
      } else {
        dropdownOpen.value = false
        emit('select-project', project)
      }
    } else {
      emit('select-project', project)
    }
  }
  
  function onClickOutside(e: MouseEvent) {
    if (!dropdownOpen.value || !isTouchLike.value) return
    if (dropdownWrapRef.value && !dropdownWrapRef.value.contains(e.target as Node)) {
      dropdownOpen.value = false
    }
  }
  
  onMounted(() => document.addEventListener('click', onClickOutside))
  onUnmounted(() => document.removeEventListener('click', onClickOutside))
  </script>
  
  <style scoped lang="sass">
  button
    transition: opacity 0.3s ease, font-variation-settings 0.5s ease
  
  button:hover, button:focus
    font-variation-settings: "wght" 10
  </style>