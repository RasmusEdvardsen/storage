<template>
  <div class="dropdown">
    <div :class="['dropdown-content', t ? 'expanded' : '']">
      <slot name="content"></slot>
    </div>
    <div :class="['overlay', t ? 'expanded' : '']" @click.stop="$emit('input', !t)"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class Dropdown extends Vue {
  @Prop({ type: Boolean, default: false })
  toggle!: boolean;

  t: boolean = false;

  @Watch("toggle")
  onToggleChanged(value: boolean) {
    this.t = value;
  }
}
</script>

<style scoped>
.dropdown {
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 12px 16px;
  z-index: 10;
}

.dropdown .dropdown-content.expanded {
  display: block;
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
