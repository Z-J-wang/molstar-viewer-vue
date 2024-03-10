<script setup>
import { fetchText } from '../utils'
import { onMounted, ref } from 'vue'
import MolStarViewer from '../components/MolStarViewer.vue'

const fileData = ref('')
const fileFormat = ref('')

onMounted(() => {
  fetchText('examples/rcsb_2da0.pdb').then((data) => {
    fileData.value = data
    fileFormat.value = 'pdb'
  })
})
</script>

<template>
  <div>
    <MolStarViewer :fileData="fileData" :fileFormat="fileFormat" />
  </div>
</template>
