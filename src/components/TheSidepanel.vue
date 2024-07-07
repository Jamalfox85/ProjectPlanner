<template lang="">
  <header class="header">
    <div class="sidepanel_wrapper">
      <div class="project-section-content w-full p-4" :class="{ invisible: quickMode }">
        <n-select v-model:value="currentProject" :options="projects" />
      </div>
      <nav class="app-navigation">
        <div class="link-group" v-for="link in navigationLinks" :class="{ active: link.active }" @click="navigatePage(link.path)">
          <RouterLink :to="link.path">{{ link.name }}</RouterLink>
          <n-icon class="mx-2" v-if="quickMode && link.path !== '/'">
            <LockClosed12Filled class="lock-icon" />
          </n-icon>
        </div>
      </nav>
      <n-button @click="logOut" class="log-out-bttn">Log Out</n-button>
    </div>
  </header>
</template>
<script>
import { RouterLink } from "vue-router";
import { NSelect, NIcon, NButton } from "naive-ui";
import { projectStore } from "@/stores/projectStore";
import { useEventBus } from "@vueuse/core";
import { LockClosed12Filled } from "@vicons/fluent";
import { supabase } from "@/lib/supabaseClient";

export default {
  components: {
    RouterLink,
    NSelect,
    NIcon,
    NButton,
    LockClosed12Filled,
  },
  data() {
    return {
      quickMode: false,
      currentProject: null,
      projects: [],
      loginModalBus: useEventBus("loginModalBus"),
    };
  },
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
        { name: "SWOT", path: "/swot", active: path === "/swot" },
        { name: "Tables", path: "/tables", active: path === "/tables" },
      ];
    },
  },
  methods: {
    navigatePage(route) {
      if (this.quickMode) {
        this.loginModalBus.emit(true);
        return;
      }
      this.$router.push(route);
    },
    logOut() {
      console.log("log out");
      supabase.auth.signOut();
      this.loginModalBus.emit(true);
      this.store.clearProjects();
    },
  },
  watch: {
    currentProject: {
      async handler(newProject, oldProject) {
        if (oldProject) {
          let newProjectObject = this.projects.find((project) => project.id === newProject);
          this.store.setCurrentProject(newProjectObject);
        }
      },
      immediate: true,
    },
    store: {
      async handler() {
        let projects = this.store.getUserProjects;
        if (projects.length > 0) {
          this.projects = projects.map((project) => {
            project.value = project.id;
            project.label = project.title;
            return project;
          });
          this.currentProject = this.store.getCurrentProject.id;
        } else {
          this.projects = [];
          this.currentProject = null;
        }
        this.quickMode = this.store.getQuickMode;
      },
      deep: true,
      immediate: true,
    },
  },
  setup() {
    const store = projectStore();
    return { store };
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
      .lock-icon {
        color: var(--light);
      }
    }
  }
  .log-out-bttn {
    margin-top: 1em;
    background-color: var(--light);
    color: var(--dark);
  }
}
</style>
