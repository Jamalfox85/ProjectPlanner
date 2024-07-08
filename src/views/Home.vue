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
      </div>
      <div class="flex justify-center">
        <div class="flex flex-col w-3/4 main-col-1">
          <!-- DESCRIPTION -->
          <div class="project-group description-group">
            <div class="project-label" @click="navigatePage('/description')">
              <p>Description</p>
              <n-icon>
                <TextEditStyle20Filled />
              </n-icon>
            </div>
            <div class="project-section-content">
              <n-tabs type="line" animated :default-value="'short_summary'">
                <n-tab-pane name="elevator_pitch" tab="Elevator Pitch">
                  <p class="project-description">{{ description.elevator_pitch }}</p>
                </n-tab-pane>
                <n-tab-pane name="short_summary" tab="Short Summary">
                  <p class="project-description">{{ description.short_summary }}</p>
                </n-tab-pane>
                <n-tab-pane name="extended_summary" tab="Extended Summary">
                  <p class="project-description">{{ description.extended_summary }}</p>
                </n-tab-pane>
              </n-tabs>
            </div>
          </div>
          <div class="flex hidden">
            <!-- BRANDING -->
            <div class="project-group w-1/2">
              <div class="project-label" @click="navigatePage('/branding')">
                <p>Branding</p>
                <n-icon>
                  <TextEditStyle20Filled />
                </n-icon>
              </div>
              <div class="project-section-content">
                <div class="project-colors">
                  <div class="project-color" :style="{ backgroundColor: 'var(--primary)' }"></div>
                  <div class="project-color" :style="{ backgroundColor: 'var(--secondary)' }"></div>
                  <div class="project-color" :style="{ backgroundColor: 'var(--tertiary)' }"></div>
                  <div class="project-color" :style="{ backgroundColor: 'var(--dark)' }"></div>
                  <div class="project-color" :style="{ backgroundColor: 'var(--light)' }"></div>
                </div>
              </div>
            </div>
            <!-- Pages -->
            <div class="project-group w-1/2">
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
        <div class="flex flex-col w-1/4 main-col-2">
          <!-- FEATURES -->
          <div class="project-group">
            <div class="project-label" @click="navigatePage('/features')">
              <p>Features</p>
              <n-icon>
                <TextEditStyle20Filled />
              </n-icon>
            </div>
            <div class="project-section-content feature-section-content">
              <ul class="project-features">
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
import { NIcon, NTabs, NTabPane, NCollapse, NCollapseItem, NSelect } from "naive-ui";
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
    changeQuickModeTitle() {
      this.quickModeTitle = this.quickModeTitles[Math.floor(Math.random() * this.quickModeTitles.length)];
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
        this.currentProject = this.store.getCurrentProject.id;
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
          }
          return;
        }
        this.setNewTitle();
        this.setNewDescription();
        this.setFeatures();
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
</style>
