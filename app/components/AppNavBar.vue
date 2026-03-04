<template lang="pug">
  div
    //- .fixed.inset-0.z-10(
    //-   v-if="dropdownOpen"
    //-   aria-hidden="true"
    //-   @click="dropdownOpen = false"
    //- )
    nav.fixed.right-0.top-1x2.-translate-y-1x2.z-2000.border-stone-700.border.right-0.w-11x12.opacity-80(
        class="bg-black-40 backdrop-blur-sm"
      )
      .absolute.bottom-full.left-0.w-full
        slot
      .flex.items-center.gap-8
        .flex.items-center.gap-6.flex-shrink-0
          button.hover_opacity-80.px-3(
            type="button"
            @click="emit('toggle-info')"
          ) INFO
        .title-swap.flex-1.md_text-center.w-1x3
          span.title-swap__label ARCHITECTURE & SCENOGRAPHY
          span.title-swap__label.title-swap__label--alt ANDREA BELOSI
        
        .relative.flex-shrink-0(ref="dropdownWrapRef").w-1x2.md_w-1x3.border-l.border-stone-700.px-2.py-2.md_py-0
          button.flex.items-center.hover_opacity-80.text-left(
            type="button"
            :aria-expanded="dropdownOpen"
            aria-haspopup="true"
            @click.stop="dropdownOpen = !dropdownOpen"
          )
            span(:class="{ 'invisible': dropdownOpen }") {{ currentProjectLabel }}
            span(
              :class="dropdownOpen ? 'rotate-180' : ''"
            ) 
          .absolute.-left-px.-right-px.bottom-full(
            v-if="dropdownOpen"
          )
            ul.list-none.backdrop-blur-sm.border.border-stone-700.divide-y.divide-stone-700(
              class="bg-black-80"
            )
              li(
                v-for="project in topProjects"
                :key="project.uid"
              )
                button.w-full.text-left.px-2.py-2.md_py-0(
                  type="button"
                  class="hover_bg-white-10"
                  :class="{ 'bg-white-10': project.uid === selectedUid }"
                  @click="onSelect(project)"
                ) {{ projectLabel(project) }}
          .absolute.-left-px.-right-px.top-full(
            v-if="dropdownOpen"
          )
            ul.list-none.backdrop-blur-sm.border.border-stone-700.divide-y.divide-stone-700(
              class="bg-black-80"
            )
              li(
                v-for="project in bottomProjects"
                :key="project.uid"
              )
                button.w-full.text-left.px-2.py-2.md_py-0(
                  type="button"
                  class="hover_bg-white-10"
                  :class="{ 'bg-white-10': project.uid === selectedUid }"
                  @click="onSelect(project)"
                ) {{ projectLabel(project) }}
</template>

<script setup lang="ts">
import type { ProjectDocument } from '~~/prismicio-types'

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

watch(() => props.closeMenus, () => {
  dropdownOpen.value = false
})

const topProjects = computed(() => {
  const n = props.projects.length
  return props.projects.slice(0, Math.ceil(n / 2))
})

const bottomProjects = computed(() => {
  const n = props.projects.length
  return props.projects.slice(Math.ceil(n / 2))
})

const selectedProject = computed(() =>
  props.projects.find(p => p.uid === props.selectedUid) ?? props.projects[0] ?? null,
)

const currentProjectLabel = computed(() => {
  const p = selectedProject.value
  return p ? projectLabel(p) : 'Select project'
})

function projectLabel(project: ProjectDocument) {
  const d = project.data
  const parts = [d.title ?? 'Untitled']
  if (d.year) parts.push(d.year)
  if (d.location) parts.push(d.location)
  if (d.project_type) parts.push(d.project_type)
  return parts.join(', ')
}

function onSelect(project: ProjectDocument) {
  dropdownOpen.value = false
  emit('select-project', project)
}
</script>

<style scoped>
.title-swap {
  position: relative;
  transform: translatex(9.1vw);
}

.title-swap__label {
  transition: opacity 0.2s ease;
}

.title-swap__label--alt {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
}

.title-swap:hover .title-swap__label:not(.title-swap__label--alt) {
  opacity: 0;
}

.title-swap:hover .title-swap__label--alt {
  opacity: 1;
}
</style>
