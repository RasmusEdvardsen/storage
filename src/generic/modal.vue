<template>
  <div class="modal">
    <div :class="['modal-content', t ? 'expanded' : '']">
      <slot name="content"></slot>
    </div>
    <!-- should be 2 overlays - one colored, one not -->
    <div :class="['overlay', t ? 'expanded' : '']" @click.stop="overlayClicked()"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class Modal extends Vue {
  @Prop({ type: Boolean, default: false })
  public toggle!: boolean;

  @Prop({ type: Boolean, default: false })
  public blocking!: boolean;

  public t: boolean = false;

  @Watch("toggle")
  public onToggleChanged(value: boolean) {
    this.t = value;
  }

  public overlayClicked() {
    if (!this.blocking) {
      this.$emit("input", !this.t);
    } else {
      return;
    }
  }
}
</script>

<style scoped>
.modal {
  display: inline-block;
}

.modal-content {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #f9f9f9;
  min-width: 160px;
  padding: 10px;
  z-index: 10;
  border-radius: 2px;
  border: 1px solid gainsboro;

  -webkit-box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.5);
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.5);
}

.modal .modal-content.expanded {
  display: block;
  width: 60%;
  height: 40%;
  left: 20%;
  top: 30%;
}

.overlay {
  display: none;
}

.overlay.expanded {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 9;
}
</style>
