<template lang="">
  <header class="header">
    <div class="sidepanel_wrapper flex flex-col items-center">
      <div class="project-section-content w-full p-4" :class="{ invisible: quickMode }">
        <n-popover trigger="click" class="w-[150px]" placement="bottom">
          <template #trigger class="">
            <div class="project-block flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded-xl">
              <div class="project-logo mr-2">
                <img src="@/assets/images/logo.png" alt="Ceres Logo" class="min-w-8 max-w-8 min-h-8 max-h-8" />
              </div>
              <div>
                <b>{{ currentProject?.title || "Ceres" }}</b>
                <font-awesome-icon class="mx-2" :icon="['fas', 'chevron-down']" />
                <!-- <p class="text-xs">Subtitle</p> -->
              </div>
            </div>
          </template>
          <div>
            <div v-for="project in projects" :key="project.id" :class="{ 'bg-blue-500 text-white pointer-events-none': project.id == currentProject.id }" class="p-2 cursor-pointer hover:bg-slate-200" @click="setProject(project)">
              <p>{{ project.title }}</p>
            </div>
          </div>
        </n-popover>
      </div>
      <nav class="app-navigation p-4 self-center">
        <b class="text-xs">Planning</b>
        <div class="p-4 mb-6">
          <div class="link-group flex items-center" v-for="link in navigationLinks.planningLinks" :class="{ active: link.active }" @click="navigatePage(link.path)">
            <font-awesome-icon :icon="link.icon" class="text-paletteGray mr-2" />
            <RouterLink :to="link.path">{{ link.name }}</RouterLink>
            <n-icon class="mx-2" v-if="quickMode && link.path !== '/'">
              <LockClosed12Filled class="lock-icon" />
            </n-icon>
          </div>
        </div>
        <b class="text-xs">Development</b>
        <div class="p-4 mb-6">
          <div class="link-group" v-for="link in navigationLinks.developmentLinks" :class="{ active: link.active }" @click="navigatePage(link.path)">
            <font-awesome-icon :icon="link.icon" class="text-paletteGray mr-2" />
            <RouterLink :to="link.path">{{ link.name }}</RouterLink>
            <n-icon class="mx-2" v-if="quickMode && link.path !== '/'">
              <LockClosed12Filled class="lock-icon" />
            </n-icon>
          </div>
        </div>
        <b class="text-xs">Design</b>
        <div class="p-4 mb-6">
          <div class="link-group" v-for="link in navigationLinks.designLinks" :class="{ active: link.active }" @click="navigatePage(link.path)">
            <font-awesome-icon :icon="link.icon" class="text-paletteGray mr-2" />
            <RouterLink :to="link.path">{{ link.name }}</RouterLink>
            <n-icon class="mx-2" v-if="quickMode && link.path !== '/'">
              <LockClosed12Filled class="lock-icon" />
            </n-icon>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>
<script>
import { RouterLink } from "vue-router";
import { NSelect, NIcon, NButton, NPopover } from "naive-ui";
import { projectStore } from "@/stores/projectStore";
import { useEventBus } from "@vueuse/core";
import { LockClosed12Filled, Home32Filled } from "@vicons/fluent";
import { supabase } from "@/lib/supabaseClient";

export default {
  components: {
    RouterLink,
    NSelect,
    NIcon,
    NButton,
    NPopover,
    LockClosed12Filled,
    Home32Filled,
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
      let planningLinks = [
        { name: "Home", path: "/", active: path === "/", icon: ["fas", "house"] },
        { name: "Title", path: "/title", active: path === "/title", icon: ["fas", "bullseye"] },
        { name: "Description", path: "/description", active: path === "/description", icon: ["fas", "align-left"] },
        { name: "Features", path: "/features", active: path === "/features", icon: ["fas", "list-check"] },
        { name: "Sitemap", path: "/sitemap", active: path === "/sitemap", icon: ["fas", "sitemap"] },
        { name: "SWOT", path: "/swot", active: path === "/swot", icon: ["fas", "shield-halved"] },
      ];
      let developmentLinks = [{ name: "Tables", path: "/tables", active: path === "/tables", icon: ["fas", "database"] }];
      let designLinks = [{ name: "Branding", path: "/branding", active: path === "/branding", icon: ["fas", "palette"] }];
      return { planningLinks, developmentLinks, designLinks };
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
    setProject(project) {
      this.store.setCurrentProject(project);
    },
  },
  mounted() {},
  watch: {
    store: {
      async handler() {
        let projects = this.store.getUserProjects;
        if (projects.length > 0) {
          this.projects = projects.map((project) => {
            project.value = project.id;
            project.label = project.title;
            return project;
          });
          this.currentProject = this.store.getCurrentProject;
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
  border-right: solid 1px var(--lightgray);
  .app-title {
    color: var(--dark);
    text-align: center;
    padding: 1rem;
  }
  .app-navigation {
    display: flex;
    flex-direction: column;
    margin-top: 2em;
    width: 100%;
    .link-group {
      padding: 6px 12px;
      cursor: pointer;
      border-radius: 4px;
      font-size: 1.1em;
      &.active {
        font-weight: bold;
        color: var(--primary);
        transition: 0.2s ease;
        background-color: #0066ff20;
        font-size: 1.15em;
        a,
        a:visited {
          color: var(--primary);
        }
      }
      a,
      a:visited {
        color: var(--dark);
        text-decoration: none;
      }
      .lock-icon {
        color: var(--dark);
      }
      &:hover {
        background-color: #0066ff20;
      }
    }
  }
}
</style>
