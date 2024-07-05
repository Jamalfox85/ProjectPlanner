<template>
  <main>
    <div class="description_wrapper">
      <div class="description-header">
        <h1>Description</h1>
      </div>
      <div class="description-main">
        <div class="current-description-details w-1/2 m-4 p-8">
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
        <div class="ai-description-details flex flex-col items-center w-1/2 m-4 p-8">
          <h2 class="text-2xl font-bold text-center m-4 mb-8">AI Recommendations</h2>
          <n-button v-if="Object.keys(recommendedDescription).length < 1" class="generate-description-recommendations-bttn rounded-lg" @click="generateRecommendations">Generate Recommendations</n-button>
          <div v-else>
            <div class="description-group">
              <div class="project-label mb-2">
                <n-icon class="mx-2"><Sparkle20Regular /></n-icon>
                <p>Elevator Pitch</p>
                <n-icon class="mx-2"><Sparkle20Regular /></n-icon>
              </div>
              <div class="ai-recommendation">
                <p>{{ recommendedDescription.elevator_pitch }}</p>
              </div>
            </div>
            <div class="description-group">
              <div class="project-label mb-2">
                <n-icon class="mx-2"><Sparkle20Regular /></n-icon>
                <p>Short Summary</p>
                <n-icon class="mx-2"><Sparkle20Regular /></n-icon>
              </div>
              <p>{{ recommendedDescription.short_summary }}</p>
            </div>
            <div class="description-group">
              <div class="project-label mb-2">
                <n-icon class="mx-2"><Sparkle20Regular /></n-icon>
                <p>Extended Summary</p>
                <n-icon class="mx-2"><Sparkle20Regular /></n-icon>
              </div>
              <p>{{ recommendedDescription.extended_summary }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { NInput, NIcon, NButton } from "naive-ui";
import { Sparkle20Regular } from "@vicons/fluent";
import { supabase } from "@/lib/supabaseClient";
import { getDescriptionRecommendations } from "@/services/openai.js";

export default {
  components: {
    NInput,
    NIcon,
    NButton,
    Sparkle20Regular,
  },
  data() {
    return {
      description: {},
      recommendedDescription: {},
      elevatorPitch: "",
      shortSummary: "",
      extendedSummary: "",
    };
  },
  methods: {
    async saveDescriptions() {
      let updatedDescription = {
        elevator_pitch: this.elevatorPitch,
        short_summary: this.shortSummary,
        extended_summary: this.extendedSummary,
      };
      const { data, error } = await supabase.from("descriptions").update(updatedDescription).eq("id", this.description.id).select("*");
      if (error) {
        //@ts-ignore
        window.$message.error("Error saving descriptions");
        return;
      }
      //@ts-ignore
      window.$message.success("Descriptions Saved!");
    },
    async generateRecommendations() {
      let recommendations = await getDescriptionRecommendations(this.description, ["Plan App Title Ideas", "Project Templates", "Plan App Descriptions"]);
      // this.recommendedDescription = JSON.parse(recommendations)[0];
      console.log("Recommended Description: ", recommendations);
    },
  },
  async mounted() {
    let { data: descriptions, error } = await supabase.from("descriptions").select("*");
    this.description = descriptions[0];
    this.elevatorPitch = descriptions[0].elevator_pitch;
    this.shortSummary = descriptions[0].short_summary;
    this.extendedSummary = descriptions[0].extended_summary;
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
    font-size: 4em;
    font-weight: bold;
  }
  .description-main {
    display: flex;
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
  }
  .generate-description-recommendations-bttn {
    background-color: var(--primary);
    color: var(--light);
    &:hover {
      background-color: var(--tertiary);
    }
  }
}
</style>
