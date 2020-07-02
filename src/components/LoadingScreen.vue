<template>
  <div id="loading">
    <div><p>{{ statusMessage }}</p></div>
    <button v-if="currentState === states.ERROR" @click.prevent="$emit('retry')">Retry</button>
    <div v-else id="spinner"></div>
  </div>
</template>

<script>
export default {
  name: 'LoadingScreen',
  props: {
    states: {
      type: Object,
      required: true,
    },
    currentState: {
      type: String,
      required: true,
    }
  },
  computed: {
    statusMessage() {
      if(this.currentState === this.states.CONNECTING) return 'Connecting...';
      else if(this.currentState === this.states.RECONNECTING) return 'Connection lost, attempting to reconnect';
      else return 'Could not reconnect. Check your internet connection.';
    }
  }
};
</script>

<style>
#loading {
  height: 100%;
  width: 100%;
  padding: 1em;
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: auto;
  align-items: center;
  align-content: center;
  justify-content: center;
  gap: 1em;
}

#loading p {
  text-align: center;
}

#spinner {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 2s linear infinite;
  -webkit-animation: spin 2s linear infinite;
  margin: auto;
}
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
