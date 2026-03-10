<template lang="pug">
  div.relative.min-h-screen.w-full
    AppSlideshow(
      :key="selectedProject?.uid ?? 'none'"
      :slideshow="slideshowItems"
      @advance="onSlideshowAdvance"
    )
    AppNavBar(
      :projects="projects"
      :selected-uid="selectedProject?.uid ?? null"
      :info-open="infoOpen"
      :close-menus="closeMenusTrigger"
      @select-project="onSelectProject"
      @toggle-info="infoOpen = !infoOpen"
    )
      AppInfoPanel(
        v-if="infoOpen"
        :field="about?.data?.information"
        @close="infoOpen = false"
      )
  a.credit.fixed.text-xs.bottom-2.right-2.mix-difference.opacity-30.uppercase(href="http://marijdegenaar.net") site by MD
</template>

<script setup lang="ts">
// import { createClient } from '@prismicio/client'
// import { computed, ref, watch } from 'vue'
// import { useAsyncData, useNuxtApp, useRuntimeConfig } from '#app'
// import type { ProjectDocument, AboutDocument } from '~~/prismicio-types'
// import type { Query } from '@prismicio/client'

const nuxtApp = useNuxtApp()
const config = useRuntimeConfig()
const prismicConfig = config.public?.prismic as { endpoint?: string } | undefined
const endpoint = prismicConfig?.endpoint ?? 'belosi'
const getClient = () => nuxtApp.$prismic?.client ?? createClient(endpoint)

const { data: projectsData } = await useAsyncData(
  'index-projects',
  async (): Promise<Query<ProjectDocument>> => {
    const c = getClient()
    return c.getByType('project')
  },
  { server: true, lazy: false }
)
const { data: aboutData } = await useAsyncData(
  'index-about',
  async (): Promise<AboutDocument | null> => {
    const c = getClient()
    return c.getSingle('about')
  },
  { server: true, lazy: false }
)

const projects = computed<ProjectDocument[]>(() => {
  const all = projectsData.value?.results ?? []
  const order = aboutData.value?.data?.project_order
  if (!order?.length) return all

  const idOrder = order
    .map(item => item.project?.id)
    .filter(Boolean) as string[]

  const ordered: ProjectDocument[] = []
  for (const id of idOrder) {
    const found = all.find(p => p.id === id)
    if (found) ordered.push(found)
  }
  for (const p of all) {
    if (!ordered.includes(p)) ordered.push(p)
  }
  return ordered
})
const about = computed<AboutDocument | null>(() => aboutData.value ?? null)

// useState so selectedUid is serialized and matches on client (avoids hydration mismatch)
const selectedUid = useState<string | null>('index-selected-uid', () => null)
const selectedProject = computed(() => {
  const list = projects.value
  if (selectedUid.value) return list.find(p => p.uid === selectedUid.value) ?? list[0] ?? null
  return list[0] ?? null
})

const infoOpen = ref(false)
const closeMenusTrigger = ref(0)

const featuredId = computed(() => aboutData.value?.data?.featured_project?.id ?? null)

watch(projects, (list) => {
  if (selectedUid.value) return
  const featured = featuredId.value ? list.find(p => p.id === featuredId.value) : null
  selectedUid.value = featured?.uid ?? list[0]?.uid ?? null
}, { immediate: true })

const slideshowItems = computed(() =>
  selectedProject.value?.data?.slideshow ?? [],
)

function onSlideshowAdvance() {
  infoOpen.value = false
  closeMenusTrigger.value++
}

function onSelectProject(project?: ProjectDocument) {
  selectedUid.value = project?.uid ?? null
}
</script>
