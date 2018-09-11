<template>
  <div class="home">
    <interactive-syntax-tree />
  </div>
</template>

<script>
// @ is an alias to /src
import InteractiveSyntaxTree from '@/components/interactive-syntax-tree.vue';
export default {
  name: 'Home',
  components: {
    'InteractiveSyntaxTree': InteractiveSyntaxTree
  }
};
</script>
