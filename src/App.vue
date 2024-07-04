<template>
  <div class="app_wrapper" :style="themeColors">
    <TheSidepanel class="header" />
    <RouterView class="main" />
  </div>
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
import TheSidepanel from "./components/TheSidepanel.vue";
export default {
  components: { TheSidepanel },
  computed: {
    themeColors() {
      return {
        "--primary": this.$colors.primary,
        "--secondary": this.$colors.secondary,
        "--tertiary": this.$colors.tertiary,
        "--dark": this.$colors.dark,
        "--light": this.$colors.light,
      };
    },
  },
};
</script>

<style lang="scss">
.app_wrapper {
  min-height: 100vh;
  display: flex;
  .header {
    width: 200px;
    background-color: var(--dark);
  }
  .main {
    flex: 1;
  }
}
</style>
