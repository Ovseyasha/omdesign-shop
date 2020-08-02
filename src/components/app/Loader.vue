<template>
  <v-row justify="center">
    <div class="text-center ma-12">
      <v-progress-circular
        :indeterminate="indeterminate"
        :rotate="rotate"
        :size="size"
        :value="value"
        :width="width"
        color="secondary"
      >{{ value }}</v-progress-circular>
    </div>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    indeterminate: true,
    rotate: 0,
    size: 80,
    value: '',
    width: 2
  })
}
</script>

<style>
</style>
