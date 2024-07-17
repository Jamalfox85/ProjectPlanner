<template>
  <main>
    <div class="home_wrapper">
      <div class="flex header-group">
        <!-- TITLE -->
        <div class="project-group mr-auto">
          <div class="project-label" @click="navigatePage('/title')">
            <p>Title</p>
            <n-icon>
              <TextEditStyle20Filled />
            </n-icon>
          </div>
          <div class="project-section-content flex items-center">
            <h1 class="primary-project-title">{{ this.quickMode ? this.quickModeTitle : this.title?.title || "Home" }}</h1>
            <n-icon class="cursor-pointer" v-if="quickMode && this.quickModeTitle" @click="changeQuickModeTitle">
              <Refresh />
            </n-icon>
          </div>
        </div>
        <div class="project-actions ml-auto">
          <n-button class="bg-white" @click="deleteProject">
            <font-awesome-icon :icon="['fas', 'trash']" class="primary-text-color" />
          </n-button>
        </div>
      </div>
      <div class="flex justify-center flex-col lg:flex-row">
        <div class="flex flex-col w-full lg:w-3/4 main-col-1">
          <!-- DESCRIPTION -->
          <div class="project-group description-group">
            <div class="project-label" @click="navigatePage('/description')">
              <p>Description</p>
              <n-icon>
                <TextEditStyle20Filled />
              </n-icon>
            </div>
            <div class="project-section-content bg-blue-50">
              <n-tabs type="line" animated :default-value="'short_summary'">
                <n-tab-pane name="elevator_pitch" tab="Elevator Pitch">
                  <p class="project-description">{{ description.elevator_pitch }}</p>
                </n-tab-pane>
                <n-tab-pane name="short_summary" tab="Short Summary">
                  <p class="project-description">{{ description.short_summary }}</p>
                  <n-spin v-if="quickMode && !description.short_summary" />
                </n-tab-pane>
                <n-tab-pane name="extended_summary" tab="Extended Summary">
                  <p class="project-description">{{ description.extended_summary }}</p>
                </n-tab-pane>
              </n-tabs>
            </div>
          </div>
          <!-- SWOT -->
          <div class="project-group description-group">
            <div class="project-label" @click="navigatePage('/description')">
              <p>SWOT</p>
              <n-icon>
                <TextEditStyle20Filled />
              </n-icon>
            </div>
            <div class="project-section-content">
              <n-tabs type="line" animated :default-value="'strengths'" :placement="'left'">
                <n-tab-pane name="strengths" tab="Strengths">
                  <n-spin v-if="quickMode && !swot.strengths" />
                  <div v-else>
                    <p v-if="swot.strengths && swot.strengths.length > 0" class="m-2" v-for="item in swot.strengths">{{ quickMode ? item : item.text }}</p>
                    <p v-else class="m-2 text-gray-500 text-xs">No Strengths Added</p>
                  </div>
                </n-tab-pane>
                <n-tab-pane name="weaknesses" tab="Weaknesses">
                  <p v-if="swot.weaknesses && swot.weaknesses.length > 0" class="m-2" v-for="item in swot.weaknesses">{{ quickMode ? item : item.text }}</p>
                  <p v-else class="m-2 text-gray-500 text-xs">No Weaknesses Added</p>
                </n-tab-pane>
                <n-tab-pane name="opportunities" tab="Opportunities">
                  <p v-if="swot.opportunities && swot.opportunities.length > 0" class="m-2" v-for="item in swot.opportunities">{{ quickMode ? item : item.text }}</p>
                  <p v-else class="m-2 text-gray-500 text-xs">No Opportunities Added</p>
                </n-tab-pane>
                <n-tab-pane name="threats" tab="Threats">
                  <p v-if="swot.threats && swot.threats.length > 0" class="m-2" v-for="item in swot.threats">{{ quickMode ? item : item.text }}</p>
                  <p v-else class="m-2 text-gray-500 text-xs">No Threats Added</p>
                </n-tab-pane>
              </n-tabs>
            </div>
          </div>
          <div class="flex">
            <!-- BRANDING -->
            <div class="project-group w-1/2">
              <div class="project-label" @click="navigatePage('/branding')">
                <p>Branding</p>
                <n-icon>
                  <TextEditStyle20Filled />
                </n-icon>
              </div>
              <div class="project-section-content">
                <n-spin v-if="quickMode && !branding.palette" />
                <div class="project-colors">
                  <div v-for="color in branding.palette?.colors" class="project-color" :style="{ backgroundColor: color }"></div>
                </div>
              </div>
            </div>
            <!-- Pages -->
            <div class="project-group w-1/2 hidden">
              <div class="project-label" @click="navigatePage('/sitemap')">
                <p>Site Map</p>
                <n-icon>
                  <TextEditStyle20Filled />
                </n-icon>
              </div>
              <div class="project-section-content">
                <!-- Content -->
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col w-full lg:w-1/4 main-col-2">
          <!-- FEATURES -->
          <div class="project-group">
            <div class="project-label" @click="navigatePage('/features')">
              <p>Features</p>
              <n-icon>
                <TextEditStyle20Filled />
              </n-icon>
            </div>
            <div class="project-section-content feature-section-content">
              <ul class="project-features w-full">
                <n-collapse>
                  <n-collapse-item v-for="feature in features" :title="feature.title" :name="feature.id" class="feature-item">
                    <div v-if="feature.description">{{ feature.description }}</div>
                    <div v-else><p class="text-gray-500 text-xs">No Description Added</p></div>
                  </n-collapse-item>
                </n-collapse>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- Tables -->
      <div class="project-group hidden">
        <div class="project-label" @click="navigatePage('/tables')">
          <p>Tables</p>
          <n-icon>
            <TextEditStyle20Filled />
          </n-icon>
        </div>
        <div class="project-section-content">
          <!-- Content -->
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { TextEditStyle20Filled } from "@vicons/fluent";
import { Refresh } from "@vicons/tabler";
import { NIcon, NTabs, NTabPane, NCollapse, NCollapseItem, NSelect, NButton, NSpin } from "naive-ui";
import { supabase } from "@/lib/supabaseClient";
import { projectStore } from "@/stores/projectStore";
import { useEventBus } from "@vueuse/core";

export default {
  components: {
    NIcon,
    NTabs,
    NTabPane,
    NCollapse,
    NCollapseItem,
    NSelect,
    NButton,
    NSpin,
    TextEditStyle20Filled,
    Refresh,
  },
  data() {
    return {
      quickMode: false,
      title: {},
      quickModeTitle: "",
      quickModeTitles: [],
      projects: [],
      currentProject: null,
      description: {},
      features: [],
      swot: {},
      branding: {},
      loginModalBus: useEventBus("loginModalBus"),
    };
  },
  methods: {
    navigatePage(route) {
      if (this.quickMode) {
        this.loginModalBus.emit(true);
        return;
      }
      this.$router.push(route);
    },
    async setNewTitle() {
      let titles = await this.store.getTitles;
      if (titles.length > 0) {
        this.title = titles.find((title) => title.is_current_title);
      } else {
        this.title = { title: "Home" };
      }
    },
    async setNewDescription() {
      let descriptions = await this.store.getDescriptions;
      this.description = descriptions;
    },
    async setFeatures() {
      let features = await this.store.getFeatures;
      this.features = features;
    },
    async setSwot() {
      let swotItems = await this.store.getSWOTItems;
      if (swotItems.length > 0) {
        let strengths = swotItems.filter((item) => item.swot_type_id === 1);
        let weaknesses = swotItems.filter((item) => item.swot_type_id === 2);
        let opportunities = swotItems.filter((item) => item.swot_type_id === 3);
        let threats = swotItems.filter((item) => item.swot_type_id === 4);
        this.swot = { strengths, weaknesses, opportunities, threats };
        return;
      }
      this.swot = {};
    },
    async setBranding() {
      let branding = await this.store.getBranding;
      this.branding = branding;
    },
    changeQuickModeTitle() {
      this.quickModeTitle = this.quickModeTitles[Math.floor(Math.random() * this.quickModeTitles.length)];
    },
    async deleteProject() {
      const { error } = await supabase.from("projects").delete().eq("id", this.currentProject);
      if (error) {
        window.$message.error("An error occurred while deleting project");
        return;
      }
      window.$message.success("Project deleted successfully");
    },
  },
  async mounted() {
    const { data: projects, error: projectsError } = await supabase.from("projects").select("*");
    if (projects.length > 0) {
      this.projects = projects.map((project) => {
        project.value = project.id;
        project.label = project.title;
        return project;
      });
      let currentProject = this.store.getCurrentProject;
      if (currentProject && currentProject.id) {
        this.currentProject = this.store.getcurrentProject.id;
      }
    }
  },
  watch: {
    currentProject: {
      async handler(newProject, oldProject) {
        if (oldProject) {
          let newProjectObject = this.projects.find((project) => project?.id === newProject);
          this.store.setCurrentProject(newProjectObject);
        }
      },
    },
    store: {
      async handler() {
        let quickMode = this.store.getQuickMode;
        if (quickMode) {
          this.quickMode = true;
          let quickData = this.store.getQuickModeDetails;
          if (quickData && quickData.titles.length > 0 && quickData.features.length > 0) {
            this.quickModeTitles = quickData.titles;
            this.quickModeTitle = quickData.titles[0];
            this.description = quickData.descriptions;
            this.features = quickData.features;
            this.swot = quickData.swot;
            this.branding = quickData.branding;
          }
          return;
        }
        this.setNewTitle();
        this.setNewDescription();
        this.setFeatures();
        this.setSwot();
        this.setBranding();
        let currentProjectId = this.store.getcurrentProject.id;
        if (this.currentProject !== currentProjectId) {
          this.currentProject = currentProjectId;
        }
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
.home_wrapper {
  background-color: var(--light);
  flex: 1;
  height: 100%;
  padding: 1em;
  .header-group {
    background-color: var(--primary);
    color: var(--light);
    border-radius: 8px;
    padding: 1em;
    margin-bottom: 2em;
    .project-group {
      margin-bottom: 0;
      .project-label {
        background-color: var(--light);
        color: var(--primary);
      }
    }
  }
  .project-group {
    margin-bottom: 2em;
    margin-right: 2em;
    // padding: 1em;
    .project-label {
      background-color: var(--primary);
      color: var(--light);
      width: fit-content;
      padding: 4px 12px;
      border-radius: 1em;
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-bottom: 12px;
      &:hover {
        background-color: var(--secondary);
      }
      p {
        margin-right: 0.5rem;
      }
    }
    .project-section-content {
      display: flex;
      i {
        font-size: 2em;
      }
      .primary-project-title {
        color: var(--light);
        font-size: 2em;
        font-weight: bold;
        margin-right: 12px;
      }
      .project-description {
      }
      .project-colors {
        display: flex;
        .project-color {
          width: 50px;
          height: 50px;
          margin-right: 12px;
          border-radius: 50%;
          border: solid 1px gray;
        }
      }
      .project-features {
        li {
          // list-style-type: none;
          margin-bottom: 0.5rem;
        }
      }
      &.feature-section-content {
        border: solid 1px var(--lightgray);
        padding: 1em;
        width: 100%;
        i {
          font-size: 1.25em;
        }
        .n-collapse-item {
          border: solid 1px var(--lightgray) !important;
          padding: 8px !important;
          border-radius: 8px;
          .n-collapse-item__header {
            padding: 0 !important;
          }
        }
      }
    }
    &.description-group {
      .project-section-content {
        padding: 12px;
        border-radius: 8px;
      }
    }
  }
  .n-tabs-tab {
    &.n-tabs-tab--active {
      .n-tabs-tab__label {
        color: var(--primary);
      }
    }
    .n-tabs-tab__label {
      color: var(--dark);
    }
  }
}

.main-col-1 {
  padding: 1em;
}
.main-col-2 {
  padding: 1em;
  border-left: solid 1px var(--lightgray);
}

.n-tabs-tab--active {
  .n-tabs-tab__label {
    font-weight: bold;
  }
}
</style>
