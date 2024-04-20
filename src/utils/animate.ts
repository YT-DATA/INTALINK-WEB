// 在你的项目中的一个.js或.ts文件中
import { DirectiveBinding } from 'vue';
import lottie from 'lottie-web';
 
const animate = (el: HTMLElement, binding: DirectiveBinding) => {
  const options = binding.value; // 从v-animate指令中传递的值
  lottie.loadAnimation({
    container: el, // 指定DOM元素
    renderer: 'svg', // 或者 'canvas'， 'html'
    loop: true,
    autoplay: true,
    ...options, // 其他lottie选项
  });
};
 
export const vAnimate = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    animate(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    if (binding.oldValue !== binding.value) {
      animate(el, binding);
    }
  },
};