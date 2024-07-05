<template>
  <main>
    <div class="home_wrapper">
      <!-- TITLE -->
      <div class="project-group">
        <div class="project-label" @click="this.$router.push('/title')">
          <p>Title</p>
          <n-icon>
            <TextEditStyle20Filled />
          </n-icon>
        </div>
        <div class="project-section-content">
          <h1 class="primary-project-title">{{ this.title.title || "Home" }}</h1>
        </div>
      </div>
      <div class="flex justify-center">
        <div class="flex flex-col w-3/4">
          <!-- DESCRIPTION -->
          <div class="project-group">
            <div class="project-label" @click="this.$router.push('/description')">
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
          <div class="flex">
            <!-- BRANDING -->
            <div class="project-group w-1/2">
              <div class="project-label" @click="this.$router.push('/branding')">
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
              <div class="project-label" @click="this.$router.push('/sitemap')">
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
        <div class="flex flex-col w-1/4">
          <!-- FEATURES -->
          <div class="project-group">
            <div class="project-label" @click="this.$router.push('/features')">
              <p>Features</p>
              <n-icon>
                <TextEditStyle20Filled />
              </n-icon>
            </div>
            <div class="project-section-content feature-section-content">
              <ul class="project-features">
                <n-collapse>
                  <n-collapse-item v-for="feature in features" :title="feature.title" :name="feature.id">
                    <div>{{ feature.description }}</div>
                  </n-collapse-item>
                </n-collapse>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- Tables -->
      <div class="project-group">
        <div class="project-label" @click="this.$router.push('/tables')">
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
import { NIcon, NTabs, NTabPane, NCollapse, NCollapseItem } from "naive-ui";
import { supabase } from "@/lib/supabaseClient";

export default {
  components: {
    NIcon,
    NTabs,
    NTabPane,
    NCollapse,
    NCollapseItem,
    TextEditStyle20Filled,
  },
  data() {
    return {
      title: {},
      description: {},
      features: [],
    };
  },
  methods: {
    naiveuitest() {
      //@ts-ignore
      window.$message.success("naiveuitest");
    },
  },
  async mounted() {
    const { data: titles, error } = await supabase.from("titles").select("*").eq("is_current_title", true);
    if (titles.length > 0) {
      this.title = titles[0];
    }

    const { data: descriptions, error: descriptionError } = await supabase.from("descriptions").select("*");
    if (descriptions.length > 0) {
      this.description = descriptions[0];
    }

    const { data: features, error: featuresError } = await supabase.from("features").select("*");
    if (features.length > 0) {
      this.features = features;
    }
  },
};
</script>

<style lang="scss">
.home_wrapper {
  background-color: var(--light);
  flex: 1;
  height: 100%;
  padding: 2em;
  .project-group {
    margin-bottom: 24px;
    padding: 1em;
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
        color: var(--dark);
        font-size: 4em;
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
        i {
          font-size: 1.25em;
        }
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
</style>
