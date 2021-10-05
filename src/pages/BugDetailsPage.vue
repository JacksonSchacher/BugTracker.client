<template>
  <div class="container-fluid">
    <div class="d-inline-flex mt-2">
      <div class="d-flex justify-content-start">
        <button @click="toggleTracked(bug.id)" v-if="bug.tracked" type="button" class="btn neo-card">
          Untrack Bug
        </button>
        <button v-else @click="toggleTracked(bug.id)" type="button" class="btn neo-card">
          Track Bug
        </button>
      </div>
      <div v-if="account.id === bug.creator.id && bug.closed == false" class="d-flex justify-self-end">
        <i data-bs-toggle="modal" data-bs-target="#editBug-modal" class="slectable edit mdi mdi-playlist-edit f-26"></i>
      </div>
    </div>
    <div class="row my-3 justify-content-center">
      <div class="neo-card py-4 card col-11">
        <div class="d-flex justify-content-between flex-row">
          <div class="">
            <cite>Title</cite>
            <h1>{{ bug.title }}</h1>
          </div>
          <div class="d-flex">
            <cite>Priority: </cite><div class="priority bg-light">
              {{ bug.priority }}
            </div>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-9">
            {{ bug.description }}
          </div>
        </div>
        <span class="d-flex justify-content-end">
          <img :src="bug.creator.picture" alt="">
          {{ bug.creator.name }}
        </span>
        <div class="d-flex flex-row justify-content-around align-items-end">
          <div>
            <cite>Last Updated: </cite><span>{{ new Date(bug.createdAt).toDateString() }}</span>
          </div>
          <div class="">
            <input class="" @change="openClosed(bug.id)" :checked="bug.closed" type="checkbox" id="switch"><label for="switch"></label>
            <p class="" v-if="bug.closed">
              Closed
            </p>
            <p class="" v-else>
              Open
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-3 py-2 card neo-card">
      <div class="m-auto col-9">
        <cite class="text-center">User's Tracking</cite>
        <div v-for="t in tracked" :key="t.id" class="flex-row">
          <img :src="t.tracker.picture" alt="">
          {{ t.tracker.name }}
        </div>
      </div>
    </div>
    <div class="notes">
      <div class="card neo-card mb-3">
        <form @submit.prevent="addNote">
          <div class="form-group">
            <cite class="ms-5">Add Note</cite>
            <textarea v-model="editable.body" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
          </div>
          <div class="d-flex justify-content-end">
            <button type="submit" class="me-5 btn btn-success">
              Add Note
            </button>
          </div>
        </form>
      </div>
      <div class="justify-contents-center card neo-card mb-3">
        <div class="col-10 m-auto" v-for="n in notes" :key="n.id">
          <Note :note="n" />
        </div>
      </div>
    </div>
  </div>
  <Modal id="editBug-modal">
    <template #vue-modal-title>
      Edit Bug
    </template>
    <template #vue-modal-body>
      <EditForm />
    </template>
  </Modal>
</template>

<script>
import { computed, onMounted, ref } from '@vue/runtime-core'
import { AppState } from '../AppState'
import Pop from '../utils/Pop'
import { logger } from '../utils/Logger'
import { bugsService } from '../services/BugsService'
import { notesService } from '../services/NotesService'
import { useRoute } from 'vue-router'
export default {
  setup() {
    const route = useRoute()
    const editable = ref({})
    onMounted(async() => {
      try {
        await bugsService.getBugs()
        await notesService.getNotes()
        logger.log('Got Notes', AppState.notes)
        await bugsService.getTracked(route.params.id)
        logger.log('Got Bug', AppState.currentBug)
      } catch (error) {
        Pop.toast(error.message, 'error')
      }
    })
    return {
      editable,
      bug: computed(() => AppState.bugs.find(b => b.id === route.params.id)),
      tracked: computed(() => AppState.tracked),
      account: computed(() => AppState.account),
      notes: computed(() => AppState.notes.filter(n => n.bugId === AppState.currentBug.id)),
      async openClosed(bugId) {
        try {
          await bugsService.openClosed(bugId)
          logger.log('Set Open/Closed', AppState.currentBug)
        } catch (error) {
          Pop.toast(error.message, 'error')
        }
      },
      async addNote() {
        try {
          editable.value.bugId = AppState.currentBug.id
          await notesService.addNote(editable.value)
          logger.log('Notes', AppState.notes)
        } catch (error) {
          Pop.toast(error.message, 'error')
        }
      },
      async toggleTracked(bugId) {
        try {
          await bugsService.toggleTracked(bugId)
        } catch (error) {
          Pop.toast(error.message, 'error')
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
textarea {
  margin: 1rem auto;
  width: 75vw;
}
.edit {
  color: rgb(53, 53, 53);
  background: #f2f098;
  height: 2rem;
  width: 2rem;
  text-align: center;
  font-weight: bold;
  border-radius: 50%;
  margin: .4rem;
  box-shadow:  9px 9px 9px #70adb3,
             -9px -9px 9px #98ebf2;
}
input[type=checkbox]{
  height: 0;
  width: 0;
  visibility: hidden;
}

label {
  cursor: pointer;
  text-indent: -9999px;
  width: 4rem;
  height: 1.5rem;
  background: #c1f574;
  display: block;
  border-radius: 100px;
  position: relative;
}

label:after {
  content: '';
  position: absolute;
  top: .1rem;
  left: 5px;
  width: 1.25rem;
  height: 1.25rem;
  background: rgb(42, 42, 42);
  border-radius: 90px;
  transition: 0.3s;
}

input:checked + label {
  background: #f57474;
}

input:checked + label:after {
  left: calc(100% - 5px);
  transform: translateX(-100%);
}

label:active:after {
  width: 2rem;
}
cite {
   font-family: 'Inconsolata', monospace;
   font-style: normal;
   font-weight: 600;
   color:#6b6b6b;
}
.priority {
  color: rgb(53, 53, 53);
  height: 2rem;
  width: 2rem;
  text-align: center;
  font-weight: bold;
  font-size: 1.25rem;
  border-radius: 50%;
  margin: .25rem;
  box-shadow:  9px 9px 9px #70adb3,
             -9px -9px 9px #98ebf2;
}
img {
  border-radius: 50%;
  width: 2rem;
  height:2rem;
  object-fit: cover;
}
</style>
