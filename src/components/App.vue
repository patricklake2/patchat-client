<template>
  <div id="patchat">
    <name-prompt v-if="displayName === ''" :setNameFunction="setName" />
    <messages v-if="connected && displayName" :messages="messages" @reply="setReplyingTo"/>
    <message-input
      v-if="displayName"
      :sendFunction="sendMessage"
      :displayName="displayName"
      :replyingTo="replyingTo"
      @cancelReply="clearReplyingTo"
    />
  </div>
</template>

<script>
import { createClient } from '../utils/websocket-client';
import MessageInput from './MessageInput.vue';
import Messages from './Messages.vue';
import NamePrompt from './NamePrompt.vue';

export default {
  components: {
    Messages,
    MessageInput,
    NamePrompt,
  },
  data() {
    return {
      client: null,
      messages: [],
      displayName: '',
      connected: false,
      error: false,
      replyingTo: {},
    };
  },
  async created() {
    await this.initialise();
  },
  methods: {
    async initialise() {
      try {
        this.client = await createClient(this.$root.siteId);
        this.connected = true;
        this.messages = [];
        this.requestPreviousMessages();
      } catch (err) {
        this.connected = false;
        this.error = true;
      }
      this.client.onmessage = this.recieveMessage;
      this.client.onerror = () =>
        ([this.error, this.connected] = [true, false]);
    },
    sendData(data) {
      this.client.send(JSON.stringify({ siteId: this.$root.siteId, ...data }));
    },
    requestPreviousMessages() {
      this.sendData({ action: 'getmessages' });
    },
    sendMessage(messageData) {
      this.sendData({
        action: 'sendmessage',
        message: messageData,
      });
    },
    recieveMessage(e) {
      console.log(e);
      try {
        const data = JSON.parse(e.data);
        const { messages } = data;
        this.messages = this.messages.concat(messages);
      } catch (err) {
        console.error(err);
      }
    },
    setName(name) {
      this.displayName = name;
      localStorage.setItem('displayName', this.displayName);
    },
    setReplyingTo(msg) {
      this.replyingTo = msg;
    },
    clearReplyingTo() {
      this.replyingTo = {};
    }
  },
};
</script>

<style>
#patchat{
  overflow: scroll;
  background-color: white;
  color: black;
  padding: 0.75em;
  max-height: 308px;
}
</style>
