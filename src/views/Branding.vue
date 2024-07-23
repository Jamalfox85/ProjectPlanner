<template>
  <main>
    <div class="branding_wrapper">
      <div class="branding-header flex">
        <h1 class="mr-auto">Branding</h1>
        <n-spin class="mx-2" v-if="recommendationsLoading" />
        <n-button class="mx-2 primary-bg-color text-white rounded-lg" @click="generateAIPalette" :disabled="this.aiPalette.length > 0 || recommendationsLoading">
          <Sparkle20Filled class="w-4 mr-2" />
          Generate Results
        </n-button>
      </div>
      <div class="branding-main">
        <div class="palette-group">
          <div class="project-label">
            <p>Color Palette</p>
          </div>
          <div class="colors flex m-4">
            <div v-for="(color, index) in colors" class="mr-2 w-20 h-40 rounded-full relative flex flex-col items-center justify-center filled-out-color" :style="{ backgroundColor: color }">
              <div class="w-8 h-8 flex items-center justify-center text-white primary-bg-color hover:bg-blue-600 cursor-pointer rounded-lg edit-color-block mb-4">
                <font-awesome-icon :icon="['fas', 'pen-to-square']" />
                <n-color-picker :modes="['hex']" class="color-picker" @update:value="updatedColor(index)" v-model:value="newColor" />
              </div>
              <div class="primary-bg-color text-white hover:bg-blue-600 relative w-8 h-8 rounded-lg trash-color-block flex cursor-pointer" @click="deleteColor(index)">
                <font-awesome-icon class="m-auto" :icon="['fas', 'trash']" />
              </div>
            </div>
            <div v-if="colors && colors.length < 5" class="color border-2 border-dashed border-gray-500 bg-slate-100 hover:bg-slate-200 cursor-pointer mr-2 w-20 h-20 rounded-full relative flex items-center justify-center empty-color">
              <div class="absolute m-auto w-8 h-8 flex items-center justify-center text-white primary-bg-color hover:bg-blue-600 cursor-pointer rounded-lg add-color-block">
                <font-awesome-icon :icon="['fas', 'square-plus']" />
                <n-color-picker :modes="['hex']" class="color-picker" v-model:value="addNewColor" />
              </div>
            </div>
          </div>
          <div class="colors flex flex-col m-4" v-if="this.aiPalette.length > 0">
            <div class="project-label">
              <p>Recommended Palette</p>
            </div>
            <div class="flex">
              <div v-for="(color, index) in this.aiPalette" class="mr-2 w-20 h-40 rounded-full relative flex flex-col items-center justify-center filled-out-color" :style="{ backgroundColor: color }">
                <div class="primary-bg-color text-white hover:bg-blue-600 relative w-8 h-8 rounded-lg trash-color-block flex cursor-pointer" @click="addRecommendedColor(color)">
                  <font-awesome-icon class="m-auto" :icon="['fas', 'square-plus']" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { projectStore } from "@/stores/projectStore";
import { Sparkle20Filled } from "@vicons/fluent";
import { NColorPicker, NButton, NSpin } from "naive-ui";
import { supabase } from "@/lib/supabaseClient";
import { getColorPalette } from "@/services/openai";

export default {
  components: {
    Sparkle20Filled,
    NColorPicker,
    NButton,
    NSpin,
  },
  data() {
    return {
      colors: [],
      newColor: "",
      addNewColor: "",
      aiPalette: [],
      recommendationsLoading: false,
    };
  },
  methods: {
    setBrandingDetails() {
      let branding = this.store.getBranding;
      this.branding = branding.palette || {};
      this.colors = branding.palette?.colors || [];
    },
    async updatedColor(index) {
      this.colors[index] = this.newColor;
      let projectId = this.store.getcurrentProject?.id;
      const { data, error } = await supabase.from("color_palettes").update({ colors: this.colors }).eq("project_id", projectId).select();
      if (error) {
        window.$message.error("Error updating color palette");
      }
    },
    async addColor() {
      this.colors.push(this.addNewColor);
      let projectId = this.store.getcurrentProject?.id;
      const { data, error } = await supabase.from("color_palettes").update({ colors: this.colors }).eq("project_id", projectId).select();
      if (error) {
        window.$message.error("Error adding color to palette");
      }
    },
    async deleteColor(index) {
      this.colors.splice(index, 1);
      let projectId = this.store.getcurrentProject?.id;
      const { data, error } = await supabase.from("color_palettes").update({ colors: this.colors }).eq("project_id", projectId).select();
      if (error) {
        window.$message.error("Error deleting color from palette");
      }
    },
    async generateAIPalette() {
      this.recommendationsLoading = true;
      let response = await getColorPalette(this.store.getDescriptions.short_summary);
      this.aiPalette = JSON.parse(response);
      this.recommendationsLoading = false;
    },
    async addRecommendedColor(color) {
      this.colors.push(color);
      let projectId = this.store.getcurrentProject?.id;
      const { data, error } = await supabase.from("color_palettes").upsert({ colors: this.colors, project_id: projectId, id: this.branding.id }).select();
      if (error) {
        window.$message.error("Error adding color to palette");
      }
    },
  },

  watch: {
    store: {
      async handler() {
        this.setBrandingDetails();
      },
      deep: true,
      immediate: true,
    },
    addNewColor() {
      this.addColor();
    },
  },
  setup() {
    const store = projectStore();
    return { store };
  },
};
</script>

<style lang="scss">
.branding_wrapper {
  background-color: var(--light);
  flex: 1;
  height: 100%;
  padding: 1em;
  .branding-header {
    font-size: 2em;
    font-weight: bold;
  }
  .branding-main {
    padding: 1em;
    .project-label {
      background-color: var(--primary);
      color: var(--light);
      width: fit-content;
      padding: 4px 12px;
      border-radius: 1em;
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    }
    .filled-out-color {
      .edit-color-block,
      .trash-color-block {
        visibility: hidden;
        position: relative;
        .color-picker {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          height: 40px;
          width: 40px;
          .n-color-picker-trigger__value {
            display: none;
          }
        }
      }
      &:hover {
        .edit-color-block,
        .trash-color-block {
          visibility: visible;
          cursor: pointer;
        }
      }
    }
    .empty-color {
      .color-picker {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        .n-color-picker-trigger__value {
          display: none;
        }
      }
    }
  }
}
</style>
