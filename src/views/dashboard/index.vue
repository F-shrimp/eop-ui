<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <div class="dashboard-text">msg: {{ msg }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'Dashboard',
  data() {
    return {
      msg: ''
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getMessage()
  },
  methods: {
    getMessage() {
      const path = 'http://127.0.0.1:5050/'
      axios.get(path)
        .then((res) => {
          this.msg = res.data
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px
  }
  &-text {
    font-size: 30px;
    line-height: 46px
  }
}
</style>
