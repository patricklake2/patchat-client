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
    <input
      id="messagebox"
      v-model="messageInput"
      type="text"
      :disabled="!enabled"
    />
    <button
      id="sendbutton"
      type="submit"
      @click.prevent="sendBtnClickHandler()"
      :disabled="!enabled"
    >
      Send
    </button>
    <div class="checkboxHolder">
      <label for="flagAsQuestion">This is a question for the Q&A session</label>
      <input id="flagAsQuestion" type="checkbox" v-model="flagAsQuestion" />
    </div>
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
    enabled: {
      type: Boolean,
      default: () => true,
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
#message-input .checkboxHolder {
  grid-column: 1 / span 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
}
#message-input .checkboxHolder label,
input {
  margin: 0;
  display: inline-block;
  padding: 0;
}
#message-input .checkboxHolder input {
  width: 20px;
}
</style>
