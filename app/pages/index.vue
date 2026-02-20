<template lang="pug">
  div.relative.min-h-screen.w-full
    AppSlideshow(
      :key="selectedProject?.uid ?? 'none'"
      :slideshow="slideshowItems"
    )
    AppNavBar(
      :projects="projects"
      :selected-uid="selectedProject?.uid ?? null"
      :info-open="infoOpen"
      @select-project="onSelectProject"
      @toggle-info="infoOpen = !infoOpen"
    )
    Teleport(to="body")
      AppInfoPanel(
        v-if="infoOpen"
        :field="about?.data?.information"
        @close="infoOpen = false"
      )
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAsyncData, useNuxtApp } from '#app'
import type { ProjectDocument, AboutDocument } from '~~/prismicio-types'
import type { Query } from '@prismicio/client'

const { data: projectsData } = await useAsyncData('index-projects', async (): Promise<Query<ProjectDocument>> => {
  const { $prismic } = useNuxtApp()
  if ($prismic?.client) return $prismic.client.getByType('project')
  return { results: [], page: 1, results_per_page: 100, results_size: 0, total_results_size: 0, total_pages: 0, next_page: null, prev_page: null }
})
const { data: aboutData } = await useAsyncData('index-about', async (): Promise<AboutDocument | null> => {
  const { $prismic } = useNuxtApp()
  if ($prismic?.client) return $prismic.client.getSingle('about')
  return null
})

const projects = computed<ProjectDocument[]>(() => projectsData.value?.results ?? [])
const about = computed<AboutDocument | null>(() => aboutData.value ?? null)

const selectedProject = ref<ProjectDocument | null>(null)
const infoOpen = ref(false)

watch(projects, (list) => {
  const first = list[0]
  if (first && !selectedProject.value) {
    selectedProject.value = first
  }
}, { immediate: true })

const slideshowItems = computed(() =>
  selectedProject.value?.data?.slideshow ?? [],
)

function onSelectProject(project?: ProjectDocument) {
  if (project) {
    selectedProject.value = project
  } else {
    selectedProject.value = null
  }
}
</script>
