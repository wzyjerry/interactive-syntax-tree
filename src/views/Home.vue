<template>
  <div class="home">
    <interactive-syntax-tree />
  </div>
</template>

<script>
// @ is an alias to /src
import InteractiveSyntaxTree from '@/components/InteractiveSyntaxTree.vue';
export default {
  name: 'Home',
  components: {
    'InteractiveSyntaxTree': InteractiveSyntaxTree
  }
};
</script>
