<template>
  <v-snackbar
    v-model="modal"
    multi-line="multi-line"
    right="right"
    :timeout="timeout"
    top="top"
    vertical="vertical"
    class="font-weight-light"
  >{{ message }}</v-snackbar>
</template>

<script>
export default {
  props: ['message'],
  data () {
    return {
      modal: false,
      timeout: 5000
    }
  },
  computed: {

  },
  watch: {
    message () {
      this.modal = true
    }
  }
}
</script>

<style>
</style>
