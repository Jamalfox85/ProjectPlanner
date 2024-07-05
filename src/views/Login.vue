<template>
  <main>
    <div class="home_wrapper">
      <!-- TITLE -->
      <div class="project-group">
        <div class="project-label">
          <p>Login</p>
          <n-icon>
            <TextEditStyle20Filled />
          </n-icon>
        </div>
        <div class="project-section-content">
          <h1 class="primary-project-title">Home</h1>
        </div>
      </div>
      <div class="flex justify-center">
        <div class="flex flex-col w-3/4">
          <!-- DESCRIPTION -->
          <div class="project-group">
            <div class="project-label">
              <p>Description</p>
              <n-icon>
                <TextEditStyle20Filled />
              </n-icon>
            </div>
            <div class="project-section-content">
              <p class="project-description">Application geared towards helping solo-developers plan projects. From titles, to description, to branding, to features. Application geared towards helping solo-developers plan projects. From titles, to description, to branding, to features. Application geared towards helping solo-developers plan projects. From titles, to description, to branding, to features.</p>
            </div>
          </div>
          <div class="flex">
            <!-- BRANDING -->
            <div class="project-group w-1/2">
              <div class="project-label">
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
              <div class="project-label">
                <p>Site Map</p>
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
          </div>
        </div>
        <div class="flex flex-col w-1/4">
          <!-- FEATURES -->
          <div class="project-group">
            <div class="project-label">
              <p>Features</p>
              <n-icon>
                <TextEditStyle20Filled />
              </n-icon>
            </div>
            <div class="project-section-content">
              <ul class="project-features">
                <li>Task management</li>
                <li>Deadline tracking</li>
                <li>Collaboration tools</li>
                <li>Progress tracking</li>
                <li>File sharing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <h1 class="border-2 border-red-500">Test</h1>
    </div>
  </main>
</template>

<script lang="ts">
import { TextEditStyle20Filled } from "@vicons/fluent";
import { NIcon } from "naive-ui";
export default {
  components: {
    NIcon,
    TextEditStyle20Filled,
  },
  data() {
    return {};
  },
  methods: {
    naiveuitest() {
      //@ts-ignore
      window.$message.success("naiveuitest");
    },
  },
};
</script>

<style scoped lang="scss">
.home_wrapper {
  background-color: var(--light);
  flex: 1;
  height: 100%;
  padding: 1.5em;
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
    }
  }
}
</style>
