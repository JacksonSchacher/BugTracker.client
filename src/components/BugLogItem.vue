<template>
  <div @click="goToDetails(bug.id)" class="row card selectable neo-card p-2 my-3">
    <div class="d-flex justify-content-between">
      <div class="">
        {{ bug.title }}
      </div>
      <div class="bg-light priority" :class="bug.priority == 5 ? 'priority-5': '' ">
        {{ bug.priority }}
      </div>
    </div>
    <div class="">
      <img class="user-img" :src="bug.creator.picture" alt="creator picture">
      {{ bug.creator.name }}
    </div>
    <div class="d-flex justify-content-between">
      <div class="d-flex align-self-end ms-2">
        {{ new Date(bug.createdAt).toDateString() }}
      </div>
      <div v-if="bug.closed" class="closed">
        Closed
      </div>
      <div v-else class="open">
        Open
      </div>
    </div>
  </div>
</template>

<script>
import { Bug } from '../models/Bug'
import { router } from '../router'
import { bugsService } from '../services/BugsService'
import Pop from '../utils/Pop'

export default {
  props: {
    bug: { type: Bug, required: true }
  },
  setup() {
    return {
      async goToDetails(bugId) {
        try {
          await bugsService.setCurrentBug(bugId)
          router.push({ name: 'BugDetails', params: { id: bugId } })
        } catch (error) {
          Pop.toast(error.message, 'error')
        }
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.priority-5 {
  background-color: #f29898 !important;
}
div {
  font-family: 'Inconsolata', monospace;
}
.user-img {
  padding: .25rem;
  border-radius: 50%;
  object-fit: cover;
  width: 3rem;
  height: 3rem;
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
.open {
  height: 2rem;
  width: 5rem;
  background: rgb(193, 245, 116);
  border-radius: 30px;
  margin: .5rem;
  text-align: center;
  font-weight: bold;
  font-size: 1.25rem;
 box-shadow:  9px 9px 9px #70adb3,
             -9px -9px 9px #98ebf2;
}
.closed {
  height: 2rem;
  width: 5rem;
  background: rgb(245, 116, 116);
  border-radius: 30px;
  margin: .5rem;
  text-align: center;
  font-weight: bold;
  font-size: 1.25rem;
  box-shadow:  9px 9px 9px #70adb3,
             -9px -9px 9px #98ebf2;
}
</style>
