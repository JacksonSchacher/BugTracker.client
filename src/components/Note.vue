<template>
  <div class="mt-3 flex-row">
    <img :src="note.creator.picture" alt="creator image"><span>{{ note.creator.name }}</span>
  </div>
  <div class="d-flex justify-content-between note-body">
    <p>{{ note.body }}</p>
    <div v-if="note.creatorId === account.id" class="d-flex pe-3">
      <i @click="deleteNote(note.id)" class="selectable mdi mdi-delete f-20"></i>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/runtime-core'
import { Note } from '../models/Note'
import { AppState } from '../AppState'
import Pop from '../utils/Pop'
import { notesService } from '../services/NotesService'
export default {
  props: {
    note: { type: Note, required: true }
  },
  setup() {
    return {
      account: computed(() => AppState.account),
      async deleteNote(noteId) {
        try {
          await notesService.deleteNote(noteId)
        } catch (error) {
          Pop.toast(error.message, 'error')
        }
      }
    }
  }

}
</script>

<style lang="scss" scoped>
img {
  border-radius: 50%;
  height: 2rem;
  width: 2rem;
  object-fit: cover;
  margin-right: .5rem;
}
.note-body {
  padding: .25rem;
  text-indent: 1rem;
  border-radius: 25px;
background: #84ccd2;
  box-shadow: inset 9px 9px 9px #70adb3,
            inset -9px -9px 9px #98ebf2;
  margin-bottom: 1rem;
}
</style>
