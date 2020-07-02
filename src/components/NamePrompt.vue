<template>
  <form id="nameprompt">
    <label for="displayname"
      >Welcome to Northernlands 2! Please enter your name below</label
    >
    <input id="displayname" v-model="displayName" type="text" />
    <button type="submit" @click.prevent="$emit('setName', displayName)">
      Enter chat
    </button>
  </form>
</template>

<script>
export default {
  name: 'NamePrompt',
  data() {
    return {
      displayName: '',
    };
  },
  props: {
    setNameFunction: {
      type: Function,
      default: () => () => console.error('Unimplemented set name function'),
    },
  },
  created() {
    this.displayName = localStorage.getItem('displayName') || '';
  },
};
</script>

<style>
#nameprompt {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  gap: 1em;
  flex-wrap: wrap;
}
#nameprompt label,
#nameprompt input {
  padding: 0;
  margin: 0;
  width: 100%;
  overflow: hidden;
}
#nameprompt label {
  text-align: center;
}
#nameprompt input {
  height: 3em;
}
</style>
