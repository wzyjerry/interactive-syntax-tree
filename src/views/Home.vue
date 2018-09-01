<template>
  <div class="home">
    <InteractiveSyntaxTree />
  </div>
</template>

<script>
// @ is an alias to /src
import InteractiveSyntaxTree from "@/components/InteractiveSyntaxTree.vue";

export default {
  name: "home",
  components: {
    InteractiveSyntaxTree
  }
};
</script>
