<template>
  <form id="message-input">
    <label for="messagebox" v-if="replyingTo.threadId !== undefined">
      You are replying to {{ replyingTo.displayName }}.
      <button
        type="button"
        tabindex="0"
        class="cancelreplybtn"
        @click.prevent="$emit('cancelReply')"
      >
        Cancel
      </button>
    </label>
    <label class="hide" for="messagebox">Message:</label>
    <input id="messagebox" v-model="messageInput" type="text" />
    <button id="sendbutton" type="submit" @click.prevent="handleClick()">
      Send
    </button>
  </form>
</template>

<script>
export default {
  name: 'MessageInput',
  data() {
    return {
      messageInput: '',
    };
  },
  props: {
    sendFunction: {
      type: Function,
      default: () => () => console.error('Send function not implemented'),
    },
    displayName: {
      type: String,
      default: () => '',
    },
    replyingTo: {
      type: Object,
      default: () => null,
    },
  },
  computed: {
    messageData() {
      if (this.replyingTo.threadId !== undefined) {
        return {
          threadId: this.replyingTo.threadId,
          content: btoa(this.messageInput),
          displayName: this.displayName,
        };
      } else {
        return {
          content: btoa(this.messageInput),
          displayName: this.displayName,
        };
      }
    },
  },
  methods: {
    handleClick() {
      this.sendFunction(this.messageData);
      this.messageInput = '';
      this.$emit('cancelReply');
    },
  },
};
</script>

<style>
#message-input {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 0.25em;
  width: 100%;
  margin: 10px 0 0;
  flex-wrap: wrap;
}
#message-input label {
  width: 100%;
  font-size: 0.75em;
  padding: 0;
}
#message-input label a.cancelreplybtn {
  color: blue;
  text-decoration: underline;
}
#message-input label.hide {
  position: absolute;
  top: -9999px;
  left: -9999px;
  width: 0;
  height: 0;
}
#message-input #messagebox {
  height: 3em;
  width: 75%;
}
</style>
