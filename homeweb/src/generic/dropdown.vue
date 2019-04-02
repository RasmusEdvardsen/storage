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
  public toggle!: boolean;

  public t: boolean = false;

  @Watch("toggle")
  public onToggleChanged(value: boolean) {
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
  padding: 10px;
  z-index: 10;
  border-radius: 2px;
  border: 1px solid gainsboro;

  -webkit-box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.5);
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.5);
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
  height: 100%;
  width: 100%;
  z-index: 9;
}
</style>
