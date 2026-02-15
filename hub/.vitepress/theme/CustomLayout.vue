<template>
  <Layout>
    <template #layout-bottom>
      <div class="max-w-[1100px] mx-auto mb-8 text-center text-sm text-gray-500">
        © 2010-2025
        <a
          class="text-(--vp-c-brand-1) font-medium"
          href="https://agafonkin.com/"
          target="_blank"
        >
          Volodymyr Agafonkin</a>.
        Maps © <a
          class="text-(--vp-c-brand-1) font-medium"
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
        >
          OpenStreetMap
        </a> contributors.
      </div>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
const {Layout} = DefaultTheme;
</script>
