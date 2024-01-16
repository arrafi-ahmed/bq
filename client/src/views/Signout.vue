<script setup>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { toast } from "vuetify-sonner";

const store = useStore();
const router = useRouter();
store
  .dispatch("user/signout")
  .then((res) => {
    toast(`Signout successful!`, {
      cardProps: { color: "success" },
      action: {
        label: "Close",
        buttonProps: {
          color: "white",
        },
        onClick() {},
      },
    });
    window.location.href = "/";
  })
  .catch((err) => {});
</script>
