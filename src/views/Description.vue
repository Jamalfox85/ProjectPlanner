<template>
  <main>
    <div class="description_wrapper">
      <div class="flex items-center">
        <div class="heading-group mb-4 mr-auto">
          <div class="flex items-center description-header">
            <h1 class="current-title">Description</h1>
          </div>
        </div>
        <n-spin class="mx-2" v-if="recommendationsLoading" />
        <n-button class="mx-2 primary-bg-color text-white rounded-lg" @click="generateRecommendations" :disabled="Object.keys(recommendedDescription).length > 0 || recommendationsLoading">
          <Sparkle20Filled class="w-4 mr-2" />
          Generate AI Recommendations
        </n-button>
      </div>
      <div class="description-main flex">
        <div class="current-description-details grow min-w-1/2 m-4 p-8">
          <h2 class="text-2xl font-bold m-4 text-center mb-8">Current Description</h2>
          <div class="description-group">
            <div class="project-label mb-2"><p>Elevator Pitch</p></div>
            <n-input v-model:value="elevatorPitch" type="textarea" placeholder="Elevator Pitch" />
          </div>
          <div class="description-group">
            <div class="project-label mb-2"><p>Short Summary</p></div>
            <n-input v-model:value="shortSummary" type="textarea" placeholder="Short Summary" />
          </div>
          <div class="description-group">
            <div class="project-label mb-2"><p>Extended Summary</p></div>
            <n-input v-model:value="extendedSummary" type="textarea" placeholder="Extended Summary" />
          </div>
          <n-button class="save-bttn rounded-lg text-lg" @click="saveDescriptions">Save</n-button>
        </div>
        <div class="ai-description-details flex flex-col items-center w-1/2 m-4 p-8" v-if="Object.keys(recommendedDescription).length > 0">
          <h2 class="text-2xl font-bold text-center m-4 mb-8">AI Recommendations</h2>
          <div v-if="Object.keys(recommendedDescription).length > 0">
            <div class="description-group">
              <div class="project-label mb-2">
                <n-icon class="mx-2"><Sparkle20Regular /></n-icon>
                <p>Elevator Pitch</p>
                <n-icon class="mx-2"><Sparkle20Regular /></n-icon>
              </div>
              <div class="ai-recommendation">
                <p>{{ recommendedDescription.elevator_pitch }}</p>
              </div>
              <div class="mt-2">
                <n-button class="save-ai-description-bttn" @click="saveAIDescription('elevatorPitch', recommendedDescription.elevator_pitch)">
                  <AddCircle20Filled class="w-6" />
                </n-button>
              </div>
            </div>
            <div class="description-group">
              <div class="project-label mb-2">
                <n-icon class="mx-2"><Sparkle20Regular /></n-icon>
                <p>Short Summary</p>
                <n-icon class="mx-2"><Sparkle20Regular /></n-icon>
              </div>
              <p>{{ recommendedDescription.short_summary }}</p>
              <div class="mt-2">
                <n-button class="save-ai-description-bttn" @click="saveAIDescription('shortSummary', recommendedDescription.short_summary)">
                  <AddCircle20Filled class="w-6" />
                </n-button>
              </div>
            </div>
            <div class="description-group">
              <div class="project-label mb-2">
                <n-icon class="mx-2"><Sparkle20Regular /></n-icon>
                <p>Extended Summary</p>
                <n-icon class="mx-2"><Sparkle20Regular /></n-icon>
              </div>
              <p>{{ recommendedDescription.extended_summary }}</p>
              <div class="mt-2">
                <n-button class="save-ai-description-bttn" @click="saveAIDescription('extendedSummary', recommendedDescription.extended_summary)">
                  <AddCircle20Filled class="w-6" />
                </n-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { NInput, NIcon, NButton, NSpin } from "naive-ui";
import { Sparkle20Regular, AddCircle20Filled, Sparkle20Filled } from "@vicons/fluent";
import { supabase } from "@/lib/supabaseClient";
import { getDescriptionRecommendations } from "@/services/openai.js";
import { projectStore } from "@/stores/projectStore";

export default {
  components: {
    NInput,
    NIcon,
    NButton,
    NSpin,
    Sparkle20Regular,
    AddCircle20Filled,
    Sparkle20Filled,
  },
  data() {
    return {
      description: {},
      recommendedDescription: {},
      elevatorPitch: "",
      shortSummary: "",
      extendedSummary: "",
      recommendationsLoading: false,
    };
  },
  methods: {
    async saveDescriptions() {
      let projectId = this.store.getCurrentProject.id;
      let updatedDescription = {
        elevator_pitch: this.elevatorPitch,
        short_summary: this.shortSummary,
        extended_summary: this.extendedSummary,
        project_id: projectId,
      };
      const { data, error } = await supabase.from("descriptions").upsert(updatedDescription).eq("project_id", projectId).select("*");
      this.store.setDescriptions(data[0]);
      if (error) {
        //@ts-ignore
        window.$message.error("Error saving descriptions");
        return;
      }
      //@ts-ignore
      window.$message.success("Descriptions Saved!");
    },
    async generateRecommendations() {
      this.recommendationsLoading = true;
      let response = await getDescriptionRecommendations(this.description, ["Plan App Title Ideas", "Project Templates", "Plan App Descriptions"]);
      const jsonResponse = response.replace(/^Recommended Description:\s*/, "");
      const descriptionObject = JSON.parse(jsonResponse);
      this.recommendedDescription = descriptionObject;
      this.recommendationsLoading = false;
    },
    getDescriptions() {
      let description = this.store.getDescriptions;
      if (description.short_summary) {
        this.description = description;
        this.elevatorPitch = description.elevator_pitch;
        this.shortSummary = description.short_summary;
        this.extendedSummary = description.extended_summary;
      } else {
        this.description = {};
        this.elevatorPitch = "";
        this.shortSummary = "";
        this.extendedSummary = "";
      }
    },
    saveAIDescription(target, text) {
      if (target == "elevatorPitch") {
        this.elevatorPitch = text;
      } else if (target == "shortSummary") {
        this.shortSummary = text;
      } else if (target == "extendedSummary") {
        this.extendedSummary = text;
      }
      this.saveDescriptions();
    },
  },

  watch: {
    store: {
      async handler() {
        this.getDescriptions();
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

<style scoped lang="scss">
.description_wrapper {
  padding: 2em;
  height: 100%;
  background-color: var(--light);
  .project-label {
    background-color: var(--dark);
    color: var(--light);
    width: fit-content;
    padding: 4px 12px;
    border-radius: 1em;
    display: flex;
    align-items: center;
  }
  .description-header {
    font-size: 2em;
    font-weight: bold;
  }
  .description-main {
    display: flex;
    .current-description-details,
    .ai-description-details {
      border: solid 1px var(--lightgray);
      border-radius: 1em;
    }
    .description-group {
      margin-bottom: 24px;
    }
    .save-bttn {
      background-color: var(--primary);
      color: var(--light);
      &:hover {
        background-color: var(--tertiary);
      }
    }
    .save-ai-description-bttn {
      background-color: var(--primary);
      color: var(--light);
      border-radius: 8px;
    }
  }
  .generate-description-recommendations-bttn {
    background-color: var(--primary);
    color: var(--light);
    &:hover {
      background-color: var(--primary);
    }
  }
}
</style>
