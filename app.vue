<template>
  <body>
    <div>
      <NuxtPage />
    </div>
  </body>
</template>

<script>
export default {
  mounted() {
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js";
    document.body.appendChild(script);
  },
};
</script>
