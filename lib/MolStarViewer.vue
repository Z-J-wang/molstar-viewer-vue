<script setup>
import 'molstar/build/viewer/molstar.css'
import { Viewer, setDebugMode, setTimingMode, ExtensionMap } from 'molstar/build/viewer/molstar'
import { computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
  fileData: { type: [String, Array], default: '' }, // 加载文件数据
  fileFormat: { type: String, default: '' }, // 加载文件类型
  fileDataLabel: { type: String, default: '' }, // 加载文件标签

  snapshotId: { type: String, default: '' },
  snapshotUrl: { type: String, default: '' },
  snapshotUrlType: { type: String, default: 'molj' },

  structureUrl: { type: String, default: '' },
  structureUrlFormat: { type: String, default: '' },
  structureUrlIsBinary: { type: Boolean, default: false },

  mvsUrl: { type: String, default: '' },
  mvsFormat: { type: String, default: 'mvsj' },
  mvsData: { type: String, default: '' },

  pdbId: { type: String, default: '' },
  pdbDevId: { type: String, default: '' },
  emdbId: { type: String, default: '' },
  afdbId: { type: String, default: '' },
  modelArchiveId: { type: String, default: '' },

  debugMode: { type: Boolean, default: false },
  timingMode: { type: Boolean, default: false },
  disabledExtensions: { type: Array, default: () => [] },
  hideControls: { type: Boolean, default: false },
  collapseLeftPanel: { type: Boolean, default: false },
  pdbProvider: { type: String, default: 'pdbe' },
  emdbProvider: { type: String, default: 'pdbe' },
  mapProvider: { type: String, default: 'pdbe' },
  pixelScale: { type: Number, default: 1 },
  pickScale: { type: Number, default: 0.25 },
  pickPadding: { type: Number, default: 1 },
  transparency: { type: String, default: undefined },
  preferWebgl1: { type: Boolean, default: false },
  allowMajorPerformanceCaveat: { type: Boolean, default: false },
  powerPreference: { type: String, default: 'high-performance' }
})

let molStarViewer = null

const format = computed(() => {
  let format
  switch (props.fileFormat?.toLowerCase()) {
    case 'cif':
    case 'bcif':
    case 'mmcif':
    case 'mcif':
      format = 'mmcif'
      break
    case 'pdb':
    case 'ent':
      format = 'pdb'
      break
    case 'pdbqt':
      format = 'pdbqt'
      break
    case 'gro':
      format = 'gro'
      break
    case 'xyz':
      format = 'xyz'
      break
    case 'mol':
      format = 'mol'
      break
    case 'sd':
    case 'sdf':
      format = 'sdf'
      break
    case 'mol2':
      format = 'mol2'
      break
    default:
      format = ''
  }

  return format
})

const loadData = async (data, format, dataLabel) => {
  molStarViewer.loadStructureFromData(data, format, { dataLabel })
}

watch(
  () => props.fileData,
  async (data) => {
    loadData(data, format.value, props.fileDataLabel)
  },
  { deep: true }
)

const render = async () => {
  const query = route?.query || {}
  if (query['debug-mode'] === '1' || props.debugMode) setDebugMode(true)
  if (query['timing-mode'] === '1' || props.timingMode) setTimingMode(true)
  const hideControls = query['hide-controls']
    ? query['hide-controls'].trim() === '1'
    : props.hideControls
  const collapseLeftPanel = query['collapse-left-panel']
    ? query['collapse-left-panel']?.trim() === '1'
    : props.collapseLeftPanel
  const pdbProvider = query['pdb-provider']?.trim()?.toLowerCase() || props.pdbProvider
  const emdbProvider = query['emdb-provider']?.trim()?.toLowerCase() || props.emdbProvider
  const mapProvider = query['map-provider']?.trim()?.toLowerCase() || props.mapProvider
  const pixelScale = query['pixel-scale']?.trim() || props.pixelScale
  const pickScale = query['pick-scale']?.trim() || props.pickScale
  const pickPadding = query['pick-padding']?.trim() || props.pickPadding
  const transparency = query['transparency']?.trim()?.toLowerCase() || props.transparency
  const preferWebgl1 = query['prefer-webgl1']?.trim() === '1' || props.preferWebgl1
  const allowMajorPerformanceCaveat =
    query['allow-major-performance-caveat']?.trim() === '1' || props.allowMajorPerformanceCaveat
  const powerPreference = query['power-preference']?.trim()?.toLowerCase() || props.powerPreference

  Viewer.create('molStarWrapper', {
    disabledExtensions: props.disabledExtensions, // anything from Object.keys(molstar.ExtensionMap)
    layoutShowControls: !hideControls,
    viewportShowExpand: false,
    collapseLeftPanel: collapseLeftPanel,
    pdbProvider: pdbProvider,
    emdbProvider: emdbProvider,
    volumeStreamingServer:
      mapProvider === 'rcsb' ? 'https://maps.rcsb.org' : 'https://www.ebi.ac.uk/pdbe/densities',
    pixelScale: parseFloat(pixelScale),
    pickScale: parseFloat(pickScale),
    pickPadding: isNaN(parseFloat(pickPadding)) ? 1 : parseFloat(pickPadding),
    transparency: transparency || undefined,
    preferWebgl1: preferWebgl1,
    allowMajorPerformanceCaveat: allowMajorPerformanceCaveat,
    powerPreference: powerPreference
  }).then((viewer) => {
    molStarViewer = viewer

    const snapshotId = query['snapshot-id']?.trim() || props.snapshotId
    if (snapshotId) viewer.setRemoteSnapshot(snapshotId)

    const snapshotUrl = query['snapshot-url']?.trim() || props.snapshotUrl
    const snapshotUrlType =
      query['snapshot-url-type']?.toLowerCase()?.trim() || props.snapshotUrlType
    if (snapshotUrl && snapshotUrlType) viewer.loadSnapshotFromUrl(snapshotUrl, snapshotUrlType)

    const structureUrl = query['structure-url']?.trim() || props.structureUrl
    const structureUrlFormat =
      query['structure-url-format']?.toLowerCase()?.trim() || props.structureUrlFormat
    const structureUrlIsBinary =
      query['structure-url-is-binary']?.trim() === '1' || props.structureUrlIsBinary
    if (structureUrl)
      viewer.loadStructureFromUrl(structureUrl, structureUrlFormat, structureUrlIsBinary)

    const mvsUrl = query['mvs-url']?.trim() || props.mvsUrl
    const mvsData = query['mvs-data']?.trim() || props.mvsFormat
    const mvsFormat = query['mvs-format']?.trim() || props.mvsData
    if (mvsUrl && mvsData)
      console.error(
        'Cannot specify mvs-url and mvs-data URL parameters at the same time. Ignoring both.'
      )
    else if (mvsUrl) viewer.loadMvsFromUrl(mvsUrl, mvsFormat)
    else if (mvsData) viewer.loadMvsData(mvsData, mvsFormat)

    const pdb = query['pdb']?.trim() || props.pdbId
    if (pdb) viewer.loadPdb(pdb)

    const pdbDev = query['pdb-dev']?.trim() || props.pdbDevId
    if (pdbDev) viewer.loadPdbDev(pdbDev)

    const emdb = query['emdb']?.trim() || props.emdbId
    if (emdb) viewer.loadEmdb(emdb)

    const afdb = query['afdb']?.trim()
    if (afdb) viewer.loadAlphaFoldDb(afdb) || props.afdbId

    const modelArchive = query['model-archive']?.trim() || props.modelArchiveId
    if (modelArchive) viewer.loadModelArchive(modelArchive)

    // 加载数据
    if (props.fileData && format.value) loadData(props.fileData, format.value, props.fileDataLabel)
  })
}

// eslint-disable-next-line no-unused-vars
const getExtension = () => Object.keys(ExtensionMap) // 获取所有的molstar扩展

// eslint-disable-next-line no-unused-vars
const getViewer = () => molStarViewer // 获取molstar viewer实例

onMounted(() => {
  render()
})

onBeforeUnmount(() => {
  molStarViewer.dispose()
})
</script>

<template>
  <div id="molStarWrapper"></div>
</template>

<style scoped>
#molStarWrapper {
  position: absolute;
  left: 100px;
  top: 100px;
  width: 800px;
  height: 600px;
}
</style>
