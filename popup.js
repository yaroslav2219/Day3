export const popup = {
  props: {
    title: String,
    fullscreen: Boolean
  },

  data() {
    return {
      active: 0
    }
  },

  watch: {
    active(val) {
      if (val === 1 && !this.fullscreen) {
        this.$nextTick(() => {
          const h = this.$refs.popup.clientHeight / 2
          this.top = `calc(50% - ${h}px)`
        })
      }

      if (this.fullscreen) {
        this.setFullscreen()
      }
    }
  },

  methods: {
    setFullscreen() {
      this.top = 0
      this.left = 0
      this.ml = 0
      this.widthVal = '100%'
      this.height = '100%'
    },

    close() {
      this.active = 0
    }
  },

  template: `
   <template v-if="active === 1">
  <div class="popup-back">
    <div class="popup">
      
      <div class="flex head-popup">
        <div class="w80 ptb20">
          <div class="head-title">{{ title }}</div>
        </div>

        <div class="w20 al ptb20">
          <a href="#" @click.prevent="close">
            <i class="fas fa-window-close"></i>
          </a>
        </div>
      </div>

      <div class="popup-inner">
        <slot></slot>
      </div>

    </div>
  </div>
</template>
  `
}


