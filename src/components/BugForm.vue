<template>
  <form @submit.prevent="createBug">
    <div class="form-group">
      <label for="title"></label>
      <input v-model="editable.title"
             type="title"
             name="title"
             class="form-control border-0 mb-3"
             placeholder="Bug Name"
      >
      <label for="description"></label>
      <textarea v-model="editable.description"
                name="description"
                id="description"
                cols="40"
                rows="8"
                class="mb-3"
                placeholder="Bug Description"
      ></textarea>
    </div>
    <h5 class="mb-3">
      Priority:
    </h5>
    <div class="d-flex btn-group" role="group" aria-label="Basic radio toggle button group">
      <input type="radio"
             class="btn-check"
             name="btnradio"
             id="p-1"
             v-model="editable.priority"
             value="1"
             autocomplete="off"
             checked
      >
      <label class="btn btn-green" for="p-1">1</label>

      <input type="radio"
             class="btn-check"
             name="btnradio"
             id="p-2"
             v-model="editable.priority"
             value="2"
             autocomplete="off"
      >
      <label class="btn btn-green-yellow" for="p-2">2</label>

      <input type="radio"
             class="btn-check"
             name="btnradio"
             id="p-3"
             v-model="editable.priority"
             value="3"
             autocomplete="off"
      >
      <label class="btn btn-yellow" for="p-3">3</label>

      <input type="radio"
             class="btn-check"
             name="btnradio"
             id="p-4"
             v-model="editable.priority"
             value="4"
             autocomplete="off"
      >
      <label class="btn btn-orange" for="p-4">4</label>

      <input type="radio"
             class="btn-check"
             name="btnradio"
             id="p-5"
             v-model="editable.priority"
             value="5"
             autocomplete="off"
      >
      <label class="btn btn-red" for="p-5">5</label>
    </div>
    <div class="d-flexjustify-content-end">
      <button type="submit" data-bs-dismiss="modal" aria-label="Close" class="d-flex mt-3 btn btn-success">
        Report
      </button>
    </div>
  </form>
</template>

<script>
import { ref } from '@vue/reactivity'
import { bugsService } from '../services/BugsService'
import Pop from '../utils/Pop'
import { router } from '../router'
import { AppState } from '../AppState'
export default {
  setup() {
    const editable = ref({})
    return {
      editable,
      async createBug() {
        try {
          await bugsService.createBug(editable.value)
          router.push({ name: 'BugDetails', params: { id: AppState.currentBug.id } })
        } catch (error) {
          Pop.toast(error.message, 'error')
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.btn {
  margin: 0 .5rem;
}
.btn-green {
  background-color: green;
}
.btn-green-yellow {
  background-color: yellowgreen;
}
.btn-yellow {
  background-color: yellow;
}
.btn-orange {
  background-color: orange;
}
.btn-red {
  background-color: red;
}
</style>
