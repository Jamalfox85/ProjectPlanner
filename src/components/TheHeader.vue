<template lang="">
  <header class="header_wrapper p-2 flex items-center">
    <!-- LOGO -->
    <div class="logo flex items-center text-xl ml-8">
      <img src="@/assets/images/logo.png" alt="Ceres Logo" class="w-8 h-8" />
      <h1>Ceres</h1>
    </div>

    <!-- NAVIGATION -->
    <div class="flex items-center mr-16 ml-auto">
      <!-- <n-popover trigger="hover" class="">
        <template #trigger class="">
          <div class="hover:underline flex cursor-pointer mr-4">
            <p class="">Projects</p>
            <ChevronCircleDown28Regular class="ml-2 w-4" />
          </div>
        </template>
        <div>
          <div v-for="project in projects" :key="project.id" :class="{ 'primary-bg-color text-white pointer-events-none': project.id == currentProject.id }" class="p-2 cursor-pointer hover:bg-slate-200" @click="setProject(project)">
            <p>{{ project.title }}</p>
          </div>
        </div>
      </n-popover> -->
    </div>

    <!-- PROFILE SIDE -->
    <div class="flex items-center text-2xl">
      <n-icon class="mr-2">
        <Help @click="showHelpModal = true" class="cursor-pointer" />
      </n-icon>
      <n-popover trigger="hover" class="">
        <template #trigger class="">
          <div class="rounded-full cursor-pointer w-10 h-10 flex border-2 primary-bg-color text-white">
            <Person16Regular class="w-6 m-auto" />
          </div>
        </template>
        <div v-if="!quickMode">
          <div class="p-2 cursor-pointer hover:bg-slate-200" @click="logOut(project)">
            <p>Log Out</p>
          </div>
        </div>
      </n-popover>
    </div>

    <!-- HELP MODAL -->
    <n-modal v-model:show="showHelpModal">
      <n-card style="width: 600px" title="Hello There!" :bordered="false" size="huge" role="dialog" aria-modal="true" class="rounded-xl">
        <template #header-extra> <Close @click="showHelpModal = false" class="w-8 cursor-pointer" /> </template>
        <h1 class="mb-2">Thanks for checking out Ceres! 👋</h1>
        <p class="mb-2">The main goal of this app is to help solo devs organize projects. Whether you're using this app to plan your portfolio projects, stress-test your next micro saas idea, or just track your project ideas in something other than a spreadsheet.</p>
        <p class="mb-2">The app is broken down into 7 sections:</p>
        <ul class="list-disc mb-4">
          <li>Title</li>
          <li>Description</li>
          <li>Features</li>
          <li>Branding (Coming Soon)</li>
          <li>Sitemap (Coming Soon)</li>
          <li>SWOT (Coming Soon)</li>
          <li>Tables (Coming Soon)</li>
        </ul>
        <p>With hopefully a few more on the horizon! I hope this helps anyone interested. If you have any suggestions, don't hesitate to let mme know! (Suggestion form also coming soon 😝)</p>
      </n-card>
    </n-modal>
  </header>
</template>
<script>
import { RouterLink } from "vue-router";
import { NSelect, NIcon, NButton, NPopover, NDrawer, NDrawerContent, NInput, NModal, NCard } from "naive-ui";
import { projectStore } from "@/stores/projectStore";
import { useEventBus } from "@vueuse/core";
import { LockClosed12Filled, ChevronCircleDown28Regular, AddCircle20Filled, Person16Regular } from "@vicons/fluent";
import { Close } from "@vicons/carbon";
import { Help } from "@vicons/tabler";
import { supabase } from "@/lib/supabaseClient";

export default {
  components: {
    RouterLink,
    NSelect,
    NIcon,
    NButton,
    NPopover,
    NDrawer,
    NDrawerContent,
    NInput,
    NModal,
    NCard,
    LockClosed12Filled,
    ChevronCircleDown28Regular,
    AddCircle20Filled,
    Person16Regular,
    Close,
    Help,
  },
  data() {
    return {
      quickMode: false,
      currentProject: null,
      loginModalBus: useEventBus("loginModalBus"),
      showHelpModal: false,
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
    projects() {
      console.log(this.store.getUserProjects);
      return this.store.getUserProjects;
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
    logOut() {
      supabase.auth.signOut();
      this.loginModalBus.emit(true);
      this.store.clearProjects();
    },
  },
  watch: {
    store: {
      async handler() {
        this.currentProject = this.store.getCurrentProject;
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
.header_wrapper {
  border-bottom: solid 1px var(--lightgray);
  height: 60px;
}
.primary-bg-color {
  background-color: var(--primary);
}
.primary-text-color {
  color: var(--primary);
}
</style>
