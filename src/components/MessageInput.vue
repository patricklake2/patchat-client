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
    <button
      id="sendbutton"
      type="submit"
      @click.prevent="sendBtnClickHandler()"
    >
      Send
    </button>
    <input id="flagAsQuestion" type="checkbox" v-model="flagAsQuestion" />
    <label for="flagAsQuestion">This is a question for the Q&A session</label>
  </form>
</template>

<script>
export default {
  name: 'MessageInput',
  data() {
    return {
      messageInput: '',
      flagAsQuestion: false,
    };
  },
  props: {
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
      return {
        threadId: this.replyingTo.threadId || '',
        content: btoa(this.messageInput),
        displayName: this.displayName,
        flags: this.flagAsQuestion ? ['question'] : [],
      };
    },
  },
  methods: {
    sendBtnClickHandler() {
      this.$emit('send', this.messageData);
      this.messageInput = '';
    },
  },
};
</script>

<style>
#patchat #message-input {
  display: grid;
  grid-template-columns: 80% 1fr;
  grid-gap: 0.5em;
  width: 100%;
}
#message-input label {
  line-height: 2em;
  grid-column: 1 / span 2;
  font-size: 0.7em;
}
#message-input label.hide {
  position: absolute;
  top: -9999px;
  left: -9999px;
}

#message-input label a.cancelreplybtn {
  color: blue;
  text-decoration: underline;
}
</style>
