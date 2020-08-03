<template>
  <v-snackbar
    v-model="text"
    :color="color"
    :multi-line="mode === 'multi-line'"
    :right="'right'"
    :timeout="timeout"
    :top="'top'"
    :vertical="mode === 'vertical'"
  >{{ text }}</v-snackbar>
</template>

<script>
import messages from '@/utils/messages'
export default {
  props: ['message'],
  data () {
    return {
      color: '',
      mode: '',
      timeout: 5000
    }
  },
  computed: {
    text () {
      return messages[this.message]
    }
  }
}
</script>

<style>
</style>
