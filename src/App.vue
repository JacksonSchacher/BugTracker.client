<template>
  <header>
    <Navbar />
  </header>
  <main>
    <router-view />
  </main>
  <footer>
    <div class="bg-grey text-light text-center p-4">
      Made with <img src="./assets/img/bug-icon.png" style="width:35px;height:35px;" alt=""> by Jackson
    </div>
  </footer>
</template>

<script>
import { computed } from 'vue'
import { AppState } from './AppState'
export default {
  name: 'App',
  setup() {
    return {
      appState: computed(() => AppState)
    }
  }
}
</script>
<style lang="scss">
@import "./assets/scss/main.scss";
.neo-card {
  border-radius: 50px;
background: #84ccd2;
box-shadow:  9px 9px 9px #70adb3,
             -9px -9px 9px #98ebf2;
}
.card {
  border: none;
}
</style>
