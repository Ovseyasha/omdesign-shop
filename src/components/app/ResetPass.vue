<template>
  <v-app id="inspire">
    <Messager :message="error"></Messager>
    <v-main>
      <v-container class="fill-height" fluid>
        <Loader v-if="loading" />
        <v-row v-else align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12" tile>
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Сброс пароля</v-toolbar-title>
                <v-spacer></v-spacer>
                <template>
                  <v-btn icon large>
                    <router-link to="/">
                      <img :src="require('@/assets/icon.png')" width="40" alt="logo" />
                    </router-link>
                  </v-btn>
                </template>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Email"
                    prepend-icon="mdi-account"
                    hint="Введите email на который мы вышлем сброс пароля"
                    type="text"
                    v-model="email"
                    :error-messages="emailErrors"
                    required
                    @input="$v.email.$touch()"
                    @blur="$v.email.$touch()"
                  ></v-text-field>
                </v-form>
                <h3 class="help mt-5">
                  Нет аккаунта?
                  <router-link to="/registration">Зарегистрируйтесь!</router-link>
                </h3>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" class="font-weight-light" tile @click="reset">Получить письмо</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import messages from '@/utils/messages'

import { required, email } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      loading: false,
      error: '',
      email: ''
    }
  },
  validations: {
    email: {
      required,
      email
    }
  },
  computed: {
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Email введен не верно')
      !this.$v.email.required && errors.push('Введите Email')
      return errors
    },
    msg () {
      return this.error === '' ? this.$route.query.message : this.error
    }
  },
  methods: {
    async reset () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return false
      }
      try {
        this.loading = true
        await this.$store.dispatch('users/reset', this.email)
        this.loading = false
      } catch (error) {
        this.error = messages[error.code]
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less">
.help {
  font-weight: 300 !important;
}
</style>
