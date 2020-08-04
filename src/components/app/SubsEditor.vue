<template>
  <div class="subs">
    <v-btn class="subs__btn btn" @click="add" color="primary" tile>
      <v-icon left>mdi-plus</v-icon>Добавить
    </v-btn>

    <transition-group
      enter-active-class="animate__animated animate__fadeInRight"
      leave-active-class="animate__animated animate__fadeOutRight"
    >
      <div class="sub" v-for="(sub,index) in newSubs" :key="index">
        <div class="sub__i">{{index + 1 }}</div>
        <!-- <textarea class="sub__text input" v-model="newSubs[index]"></textarea> -->
        <v-textarea class="mx-15" label="Абзац" v-model="newSubs[index]"></v-textarea>
        <v-btn x-large class="sub__delete" @click="remove(index)" icon>
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: ['subs'],
  mounted () {
    this.newSubs = this.subs || ['']
  },
  data () {
    return {
      newSubs: ['']
    }
  },
  methods: {
    add () {
      this.newSubs.push('')
    },
    remove (i) {
      this.newSubs.splice(i, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.subs {
  display: flex;
  flex-direction: column;
  &__btn {
    padding: 10px;
    margin-bottom: 10px;
  }
}
.sub {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  &__i {
    font-weight: bold;
    align-self: center;
  }
  &__text {
    width: 80%;
    height: 50px;
    resize: vertical;
  }
  &__delete {
    align-self: center;
  }
}
</style>
