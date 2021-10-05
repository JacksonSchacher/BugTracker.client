<template>
  <div class="container-fluid">
    <div class="row mt-2 flex-row">
      <div class="d-flex justify-content-around">
        <h1>Bugs</h1>
        <div class="selectable" @click="toggleSort">
          <i v-if="ascending" class="mdi mdi-chevron-up f-24"></i>
          <i v-else class="mdi mdi-chevron-down f-24"></i>
        </div>
        <i @click="highFilter = !highFilter" class="selectable mdi mdi-numeric-5 f-24"></i>
        <input @click="openFilter = !openFilter" type="checkbox" id="switch"><label for="switch"></label>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="d-flex justify-content-center col-10">
        <button data-bs-toggle="modal" data-bs-target="#reportBug-modal" class="neo-card btn">
          Report Bug
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-11 m-auto" v-for="b in bugs" :key="b.id">
        <BugLogItem :bug="b" />
      </div>
    </div>
  </div>
  <Modal id="reportBug-modal">
    <template #vue-modal-title>
      Report Bug
    </template>
    <template #vue-modal-body>
      <BugForm />
    </template>
  </Modal>
</template>

<script>
import { computed, onMounted, ref } from '@vue/runtime-core'
import { AppState } from '../AppState'
import Pop from '../utils/Pop'
import { bugsService } from '../services/BugsService'
import { logger } from '../utils/Logger'
export default {
  name: 'Home',
  setup() {
    const ascending = ref(true)
    const highFilter = ref(false)
    const openFilter = ref(false)
    onMounted(async() => {
      try {
        await bugsService.getBugs()
        logger.log('Got Bugs', AppState.bugs)
      } catch (error) {
        Pop.toast(error.message, 'error')
      }
    })
    function highPriority(b) {
      if (highFilter.value) {
        return b.priority === 5
      }
      return true
    }
    function isOpen(b) {
      if (openFilter.value) {
        return b.closed === false
      }
      return true
    }
    function dateSorter(a, b) {
      if (ascending.value) {
        return b.priority - a.priority
      }
      return a.priority - b.priority
    }
    return {
      ascending,
      highFilter,
      openFilter,
      bugs: computed(() => AppState.bugs.filter(highPriority).filter(isOpen).sort(dateSorter)),
      toggleSort() {
        ascending.value = !ascending.value
      }
    }
  }
}
</script>

<style scoped lang="scss">
input[type=checkbox]{
  height: 0;
  width: 0;
  visibility: hidden;
}

label {
  cursor: pointer;
  text-indent: -9999px;
  width: 5rem;
  height: 2rem;
  background: grey;
  display: block;
  border-radius: 100px;
  position: relative;
}

label:after {
  content: '';
  position: absolute;
  top: .1rem;
  left: 5px;
  width: 1.75rem;
  height: 1.75rem;
  background: rgb(42, 42, 42);
  border-radius: 90px;
  transition: 0.3s;
}

input:checked + label {
  background: #c1f574;
}

input:checked + label:after {
  left: calc(100% - 5px);
  transform: translateX(-100%);
}

label:active:after {
  width: 3rem;
}
</style>
