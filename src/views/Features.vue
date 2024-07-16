<template>
  <main>
    <div class="features_wrapper">
      <div class="flex items-center">
        <div class="heading-group mb-4 mr-auto">
          <div class="flex items-center features-header">
            <h1 class="current-title">Features</h1>
            <!-- <n-icon class="text-4xl mx-2 currentTitleIcon"><StarEmphasis24Filled /></n-icon> -->
          </div>
        </div>
        <n-spin class="mx-2" v-if="recommendationsLoading" />
        <n-button class="mx-2 primary-bg-color text-white rounded-lg" @click="generateRecommendations" :disabled="recommendedFeatures.length > 0 || recommendationsLoading">
          <Sparkle20Filled class="w-4 mr-2" />
          Generate Results
        </n-button>
        <n-button class="mx-2 primary-bg-color text-white rounded-lg" @click="showAddFeatureDrawer = true">
          <AddCircle20Filled class="w-4 mr-2" />
          Add Item
        </n-button>
      </div>
      <div class="features-main flex">
        <div class="features-column w-1/3 m-2 grow">
          <h2 class="text-2xl text-center mb-4 font-bold">MVP Features</h2>
          <div class="feature-group" v-for="feature in mvpFeatures">
            <div class="feature-group-header flex justify-between">
              <p class="feature-title">{{ feature.title }}</p>
              <div class="icons flex">
                <n-icon class="mx-2 removeFromMVPFeatures" @click="removeFromMVPFeatures(feature)"><StarEmphasis24Filled /></n-icon>
              </div>
            </div>
            <div class="feature-description">
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
        <div class="features-column w-1/3 m-2 grow">
          <h2 class="text-2xl text-center mb-4 font-bold">Long-Term Features</h2>
          <div class="feature-group" v-for="feature in longTermFeatures">
            <div class="feature-group-header flex justify-between">
              <p class="feature-title">{{ feature.title }}</p>
              <div class="icons flex">
                <n-icon class="mx-2 addToMVPFeatures" @click="addToMVPFeatures(feature)"><Star20Regular /></n-icon>
                <n-icon class="removeFeature" @click="removeFeature(feature)"><Delete16Regular /></n-icon>
              </div>
            </div>
            <div class="feature-description">
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
        <div class="features-column w-1/3 m-2" v-if="recommendedFeatures.length > 0">
          <div class="flex items-center justify-center mb-4">
            <n-icon class="mx-2 text-3xl"><Sparkle20Regular /></n-icon>
            <h2 class="text-2xl text-center font-bold">Recommended Features</h2>
            <n-icon class="mx-2 text-3xl"><Sparkle20Regular /></n-icon>
          </div>
          <div v-if="recommendedFeatures.length > 0" class="feature-group" v-for="feature in recommendedFeatures">
            <div class="feature-group-header flex justify-between">
              <p class="feature-title">{{ feature.title }}</p>
              <div class="icons flex">
                <n-icon class="mx-2 addFeature" @click="addRecommendedFeature(feature)"><AddCircle16Regular /></n-icon>
              </div>
            </div>
            <div class="feature-description">
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <n-drawer v-model:show="showAddFeatureDrawer" :width="502" placement="right">
      <n-drawer-content title="Add Feature">
        <div class="p-4">
          <p class="font-bold mx-2">Feature Title</p>
          <n-input v-model:value="featureTitle" placeholder="Feature Title" size="large" class="mb-4" />
          <p class="font-bold mx-2">Feature Description</p>
          <n-input v-model:value="featureDescription" placeholder="Feature Description" size="large" type="textarea" class="mb-4" />
          <n-button type="primary" size="large" @click="addNewFeature">Add Feature</n-button>
        </div>
      </n-drawer-content>
    </n-drawer>
  </main>
</template>

<script lang="js">
import { NIcon, NDrawer, NDrawerContent, NInput, NButton, NSpin } from "naive-ui";
import { Sparkle20Regular, StarEmphasis24Filled, Star20Regular, AddCircle16Regular, Delete16Regular, Sparkle20Filled, AddCircle20Filled } from "@vicons/fluent";
import { supabase } from "@/lib/supabaseClient";
import { getFeatureRecommendations } from "@/services/openai.js";
import { projectStore } from "@/stores/projectStore";

export default {
  components: {
    NIcon,
    NDrawer,
    NDrawerContent,
    NInput,
    NButton, NSpin,
    Sparkle20Regular,
    StarEmphasis24Filled,
    Star20Regular,
    AddCircle16Regular,
    Delete16Regular, Sparkle20Filled, AddCircle20Filled,
  },
  data() {
    return {
      showAddFeatureDrawer: false,
      featureTitle: "",
      featureDescription: "",
      mvpFeatures: [],
      longTermFeatures: [],
      recommendedFeatures: [],
      recommendationsLoading: false,
    };
  },
  methods: {
    async addToMVPFeatures(feature) {
      const { data, error } = await supabase.from("features").update({ is_mvp: true }).eq("id", feature.id).select();
      this.store.setFeatures();
      if (error) {
        //@ts-ignore
        window.$message.error("Error Adding Feature to MVP Features");
        return;
      }
      this.longTermFeatures = this.longTermFeatures.filter((f) => f !== feature);
      //@ts-ignore
      window.$message.success("Feature Added to MVP Features");
    },
    async removeFromMVPFeatures(feature) {
      const { data, error } = await supabase.from("features").update({ is_mvp: false }).eq("id", feature.id).select();
      this.store.setFeatures();
      if (error) {
        //@ts-ignore
        window.$message.error("Error Removing Feature from MVP Features");
        return;
      }
      this.mvpFeatures = this.mvpFeatures.filter((f) => f !== feature);
      //@ts-ignore
      window.$message.warning("Feature Removed from MVP Features");
    },
    async addNewFeature() {
      let newFeature = {
        title: this.featureTitle,
        description: this.featureDescription,
        is_mvp: false,
        project_id: this.store.getCurrentProject.id,
      };
      const { data, error } = await supabase.from("features").insert(newFeature).select();
      this.store.setFeatures();
      if (error) {
        //@ts-ignore
        window.$message.error("Error Adding New Feature");
        return;
      }
      this.featureTitle = "";
      this.featureDescription = "";
      this.showAddFeatureDrawer = false;
      //@ts-ignore
      window.$message.success("Feature Added");
    },
    async addRecommendedFeature(feature) {
      let newFeature = {
        title: feature.title,
        description: feature.description,
        is_mvp: false,
        project_id: this.store.getCurrentProject.id,
      };
      const { data, error } = await supabase.from("features").insert(newFeature).select();
      this.store.setFeatures();
      if (error) {
        //@ts-ignore
        window.$message.error("Error Adding Recommended Feature");
        return;
      }
      this.recommendedFeatures = this.recommendedFeatures.filter((f) => f !== feature);
      //@ts-ignore
      window.$message.success("Feature Added to Recommended Features");
    },
    async removeFeature(feature) {
      const { error } = await supabase.from("features").delete().eq("id", feature.id);
      this.store.setFeatures();
      if (error) {
        //@ts-ignore
        window.$message.error("Error Removing Feature");
        return;
      }
      this.longTermFeatures = this.longTermFeatures.filter((f) => f !== feature);
      //@ts-ignore
      window.$message.warning("Feature Removed");
    },
    async generateRecommendations() {
      this.recommendationsLoading = true;
      let description = this.store.getDescriptions;
      let recommendations = await getFeatureRecommendations([...this.mvpFeatures, ...this.longTermFeatures], description.extended_summary.length > 0 ? description.extended_summary : description.short_summary);
      this.recommendedFeatures = JSON.parse(recommendations);
      this.recommendationsLoading = false;
    },
    getFeatures() {
      let features = this.store.getFeatures;
      if (features.length > 0) {
        this.mvpFeatures = [];
        this.longTermFeatures = [];
        features.forEach((feature) => {
          if (feature.is_mvp) {
            this.mvpFeatures.push(feature);
          } else {
            this.longTermFeatures.push(feature);
          }
        });
      } else {
        this.mvpFeatures = [];
        this.longTermFeatures = [];
      }
    },
  },
  // async mounted() {
  //   const { data: features, error } = await supabase.from("features").select("*");
  //   features.forEach((feature) => {
  //     if (feature.is_mvp) {
  //       this.mvpFeatures.push(feature);
  //     } else {
  //       this.longTermFeatures.push(feature);
  //     }
  //   });
  // },
  watch: {
    store: {
      async handler() {
        this.getFeatures();
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
.features_wrapper {
  height: 100%;
  padding: 2em;
  // background-color: var(--primary);
  // color: var(--light);
  .project-label {
    background-color: var(--dark);
    color: var(--light);
    width: fit-content;
    padding: 4px 12px;
    border-radius: 1em;
    display: flex;
    align-items: center;
  }
  .features-header {
    font-size: 2em;
    font-weight: bold;
    i {
      &:hover {
        color: var(--tertiary);
      }
    }
  }
  .features-main {
    .features-column {
      padding: 1em;
      display: flex;
      flex-direction: column;
      border: solid 1px var(--lightgray);
      border-radius: 8px;
      .generate-feature-recommendations-bttn {
        background-color: var(--primary);
        color: var(--light);
        margin: 0 auto;
      }
      .feature-group {
        background-color: var(--primary);
        color: var(--light);
        padding: 1em;
        border-radius: 0.5em;
        margin-bottom: 1em;

        .feature-group-header {
          border-bottom: solid 2px;
          padding: 4px;
          margin-bottom: 8px;
          .feature-title {
            font-size: 1.25em;
            font-weight: bold;
          }
          .icons {
            i {
              font-size: 2em;
              cursor: pointer;
              &.removeFromMVPFeatures {
                &:hover {
                  color: var(--tertiary);
                }
              }
              &.addToMVPFeatures {
                &:hover {
                  color: var(--tertiary);
                }
              }
              &.addFeature {
                &:hover {
                  color: var(--tertiary);
                }
              }
              &.removeFeature {
                &:hover {
                  color: var(--tertiary);
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
