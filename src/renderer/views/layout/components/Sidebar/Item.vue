<template>
  <div style="display:flex; flex-direction: column">
    <!-- <svg-icon :icon-class="icon" /> -->
    <span slot="title">{{title}}</span>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
  // functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  }
  // render (h, context) {
  //   const { icon, title } = context.props
  //   const vnodes = []
  //   var vnode = {}

  //   if (icon) {
  //     vnode.data = '<svg-icon icon-class={icon}/>'
  //     vnodes.push(<svg-icon icon-class={icon}/>)
  //   }

  //   if (title) {
  //     vnode.tag = 'span'
  //     // vnode.data = {(title)}
  //     vnode.text = '<span slot="title">{(title)}</span>'
  //     vnodes.push(vnode)
  //   }

  //   return vnodes
  // }
}
</script>
