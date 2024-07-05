<template lang="">
  <header class="header">
    <div class="sidepanel_wrapper">
      <h1 class="app-title">Project Planner</h1>
      <nav class="app-navigation">
        <div class="link-group" v-for="link in navigationLinks" :class="{ active: link.active }" @click="this.$router.push(link.path)">
          <RouterLink :to="link.path">{{ link.name }}</RouterLink>
        </div>
      </nav>
    </div>
  </header>
</template>
<script>
import { RouterLink } from "vue-router";

export default {
  computed: {
    navigationLinks() {
      let path = this.$route.path;
      return [
        { name: "Home", path: "/", active: path === "/" },
        { name: "Title", path: "/title", active: path === "/title" },
        { name: "Description", path: "/description", active: path === "/description" },
        { name: "Features", path: "/features", active: path === "/features" },
        { name: "Branding", path: "/branding", active: path === "/branding" },
        { name: "Sitemap", path: "/sitemap", active: path === "/sitemap" },
        { name: "Tables", path: "/tables", active: path === "/tables" },
      ];
    },
  },
};
</script>
<style lang="scss">
.sidepanel_wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .app-title {
    color: var(--light);
    text-align: center;
    padding: 1rem;
  }
  .app-navigation {
    display: flex;
    flex-direction: column;
    margin-top: 2em;
    width: 100%;
    .link-group {
      border-top: solid 2px var(--light);
      border-left: solid 2px var(--light);
      border-bottom: solid 2px var(--light);
      margin: 1rem 0 1rem 1rem;
      padding: 12px;
      border-radius: 12px 0 0 12px;
      font-size: 1.15rem;
      cursor: pointer;
      &.active {
        font-weight: bold;
        background-color: var(--light);
        font-size: 1.25rem;
        transition: 0.2s ease;
        a,
        a:visited {
          color: var(--primary);
        }
      }
      a,
      a:visited {
        color: var(--light);
        text-decoration: none;
      }
    }
  }
}
</style>
