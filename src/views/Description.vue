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
        <div class="ai-description-details w-1/2 m-4 p-8">
          <h2 class="text-2xl font-bold text-center m-4 mb-8">AI Recommendations</h2>
          <div class="description-group">
            <div class="project-label mb-2">
              <n-icon class="mx-2"><Sparkle20Regular /></n-icon>
              <p>Elevator Pitch</p>
              <n-icon class="mx-2"><Sparkle20Regular /></n-icon>
            </div>
            <div class="ai-recommendation">
              <p>caoreet. In est ante in nibh mauris. Pellentesque nec nam aliquam sem et tortor. Orci porta non pulvinar neque laoreet suspendisse. Feugiat vivamus at augue eget arcu dictum. Venenatis urna cursus eget nunc. Ut porttitor leo a diam sollicitudin tempor id eu</p>
            </div>
          </div>
          <div class="description-group">
            <div class="project-label mb-2">
              <n-icon class="mx-2"><Sparkle20Regular /></n-icon>
              <p>Short Summary</p>
              <n-icon class="mx-2"><Sparkle20Regular /></n-icon>
            </div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tempor orci dapibus ultrices in iaculis nunc sed augue. Massa eget egestas purus viverra accumsan. Eu ultrices vitae auctor eu augue ut lectus arcu. Leo in vitae turpis massa. Viverra nam libero justo laoreet. In est ante in nibh mauris. Pellentesque nec nam aliquam sem et tortor. Orci porta non pulvinar neque laoreet suspendisse. Feugiat vivamus at augue eget arcu dictum. Venenatis urna cursus eget nunc. Ut porttitor leo a diam sollicitudin tempor id eu
            </p>
          </div>
          <div class="description-group">
            <div class="project-label mb-2">
              <n-icon class="mx-2"><Sparkle20Regular /></n-icon>
              <p>Extended Summary</p>
              <n-icon class="mx-2"><Sparkle20Regular /></n-icon>
            </div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tempor orci dapibus ultrices in iaculis nunc sed augue. Massa eget egestas purus viverra accumsan. Eu ultrices vitae auctor eu augue ut lectus arcu. Leo in vitae turpis massa. Viverra nam libero justo laoreet. In est ante in nibh mauris. Pellentesque nec nam aliquam sem et tortor. Orci porta non pulvinar neque laoreet suspendisse. Feugiat vivamus at augue eget arcu dictum. Venenatis urna cursus eget nunc. Ut porttitor leo a diam sollicitudin tempor id eu
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tempor orci dapibus ultrices in iaculis nunc sed augue. Massa eget egestas purus viverra accumsan. Eu ultrices vitae auctor eu augue ut lectus arcu. Leo in vitae turpis massa. Viverra nam libero justo laoreet. In est ante in nibh mauris. Pellentesque nec nam aliquam sem et tortor. Orci porta non pulvinar neque laoreet suspendisse. Feugiat vivamus at augue eget arcu dictum. Venenatis urna cursus eget nunc. Ut porttitor leo a diam sollicitudin tempor id eu
              nisl. Risus quis varius quam quisque id. Egestas purus viverra accumsan in nisl nisi scelerisque eu ultrices. Vulputate dignissim suspendisse in est. Quam lacus suspendisse faucibus interdum posuere lorem ipsum. A iaculis at erat pellentesque adipiscing commodo elit at. Vestibulum mattis ullamcorper velit sed. Ut morbi tincidunt augue interdum velit euismod. Risus nullam eget felis eget nunc lobortis mattis aliquam faucibus.
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { NInput, NIcon, NButton } from "naive-ui";
import { Sparkle20Regular } from "@vicons/fluent";
import { supabase } from "@/lib/supabaseClient";

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
      elevatorPitch: "",
      shortSummary: "",
      extendedSummary: "",
    };
  },
  methods: {
    naiveuitest() {
      //@ts-ignore
      window.$message.success("naiveuitest");
    },
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
    }
  }
}
</style>
