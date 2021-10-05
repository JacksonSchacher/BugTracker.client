<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <div class="row">
          <div class="col-11 m-auto" v-for="b in trackedBugs" :key="b.id">
            <TrackedBugItem :bug="b" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from '@vue/runtime-core'
import { AppState } from '../AppState'
import Pop from '../utils/Pop'
import { logger } from '../utils/Logger'
import { bugsService } from '../services/BugsService'
export default {
  setup() {
    onMounted(async() => {
      try {
        await bugsService.getTrackedBugs()
        logger.log('Got Tracked Bugs', AppState.trackedBugs)
      } catch (error) {
        Pop.toast(error.message, 'error')
      }
    })
    return {
      trackedBugs: computed(() => AppState.trackedBugs)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
