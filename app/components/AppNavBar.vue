<template lang="pug">
  div
    .fixed.inset-0.z-10(
      v-if="dropdownOpen"
      aria-hidden="true"
      @click="dropdownOpen = false"
    )
    nav.fixed.left-0.right-0.top-1x2.-translate-y-1x2.z-20
      .w-full.px-6(
        class="bg-black/60 backdrop-blur-sm"
      )
        .flex.items-center.gap-8.py-4
          .relative.flex-shrink-0(ref="dropdownWrapRef")
            button.flex.items-center.gap-2.uppercase.text-white.tracking-wide.hover_opacity-80.text-left(
              type="button"
              :aria-expanded="dropdownOpen"
              aria-haspopup="true"
              @click.stop="dropdownOpen = !dropdownOpen"
            )
              span {{ currentProjectLabel }}
              span.text-sm(
                :class="dropdownOpen ? 'rotate-180' : ''"
              ) ▼
            .absolute.left-0.top-full.pt-2(
              v-if="dropdownOpen"
            )
              ul.min-w-72.list-none.backdrop-blur-sm.p-2(
                class="shadow-xl max-h-80 overflow-y-auto bg-black/80"
              )
                li(
                  v-for="project in projects"
                  :key="project.uid"
                )
                  button.w-full.text-left.uppercase.text-white.py-2.px-3.tracking-wide(
                    type="button"
                    class="hover_bg-white/10"
                    :class="{ 'bg-white/10': project.uid === selectedUid }"
                    @click="onSelect(project)"
                  ) {{ projectLabel(project) }}
          .flex-1.text-center.uppercase.text-white.tracking-wide.opacity-90.text-sm
            span ARCHITECTURE & SCENOGRAPHY
          .flex.items-center.gap-6.flex-shrink-0
            button.uppercase.text-white.tracking-wide.hover_opacity-80(
              type="button"
              @click="emit('toggle-info')"
            ) INFO
            span.uppercase.text-white.tracking-wide.opacity-80 CONTACT
</template>

<script setup lang="ts">
import type { ProjectDocument } from '~~/prismicio-types'

const props = defineProps<{
  projects: ProjectDocument[]
  selectedUid: string | null
  infoOpen: boolean
}>()

const emit = defineEmits<{
  'select-project': [project: ProjectDocument]
  'toggle-info': []
}>()

const dropdownOpen = ref(false)
const dropdownWrapRef = ref<HTMLElement | null>(null)

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
