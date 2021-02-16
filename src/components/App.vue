<template>
  <div id="patchat">
    <name-prompt v-if="!displayName" @setName="setName" />
    <loading-screen
      v-else-if="currentState !== states.CONNECTED"
      :states="states"
      :currentState="currentState"
      @retry="reset()"
    />
    <template v-else>
      <messages :messages="messages" @reply="setReplyingTo" />
      <message-input
        :sendFunction="sendMessage"
        :displayName="displayName"
        :replyingTo="replyingTo"
        :enabled="inputEnabled"
        @cancelReply="clearReplyingTo"
        @send="sendMessage"
      />
    </template>
  </div>
</template>

<script>
import LoadingScreen from './LoadingScreen.vue';
import MessageInput from './MessageInput.vue';
import Messages from './Messages.vue';
import NamePrompt from './NamePrompt.vue';

export default {
  components: {
    LoadingScreen,
    MessageInput,
    Messages,
    NamePrompt,
  },
  data() {
    const states = {
      CONNECTED: 'connected',
      CONNECTING: 'connecting',
      ERROR: 'error',
      RECONNECTING: 'reconnecting',
    };
    return {
      states,
      endpoint: 'wss://oj46evfbjh.execute-api.eu-west-2.amazonaws.com/prod',
      client: null,
      messages: [],
      displayName: '',
      replyingTo: {},
      currentState: states.CONNECTING,
      timeout: 250,
      maxTimeout: 10000,
      inputEnabled: true,
    };
  },
  mounted() {
    this.initialise();
  },
  methods: {
    initialise() {
      this.timeout *= 2;
      const url = `${this.endpoint}?siteId=${this.$root.siteId}`;
      this.client = new WebSocket(url);
      this.client.onmessage = this.recieveMessage;
      this.client.onopen = () => {
        console.log('open');
        this.currentState = this.states.CONNECTED;
        this.messages = [];
        this.requestPreviousMessages();
      };
      this.client.onclose = this.retry;
      this.client.onerror = () => this.client.close();
    },
    retry() {
      if (this.timeout <= this.maxTimeout) {
        this.currentState = this.states.RECONNECTING;
        setTimeout(this.initialise, this.timeout);
      } else {
        this.currentState = this.states.ERROR;
      }
    },
    reset() {
      this.timeout = 250;
      this.initialise();
    },
    sendData(data) {
      if (this.client.readyState === WebSocket.OPEN) {
        console.log('sending data');
        this.client.send(
          JSON.stringify({ siteId: this.$root.siteId, ...data })
        );
      } else this.retry();
    },
    requestPreviousMessages() {
      console.log('requesting msgs');
      this.sendData({ action: 'getmessages' });
    },
    sendMessage(messageData) {
      this.sendData({
        action: 'sendmessage',
        message: messageData,
      });
      this.clearReplyingTo();
    },
    recieveMessage(e) {
      console.log(e);
      try {
        const data = JSON.parse(e.data);
        const { action, messages } = data;
        if (action === 'send') this.messages = this.messages.concat(messages);
        else if (action === 'delete') {
          const deleteTimestamps = messages.map((msg) => msg.msgTimestamp);
          this.messages = this.messages.filter(
            ({ msgTimestamp }) => !deleteTimestamps.includes(msgTimestamp)
          );
        } else if (action === 'block') {
          alert(
            'You have been blocked from sending messages due to breaking our code of conduct.'
          );
          this.inputEnabled = false;
        } else console.error(`Unknown action: '${action}'`);
      } catch (err) {
        console.error(`Could not parse data: ${err}`);
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
    },
  },
};
</script>

<style>
#patchat {
  /* overflow-y: auto; */
  overflow: hidden;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 1fr auto;
  box-sizing: border-box;
}
#patchat input,
#patchat label {
  font-size: inherit;
  padding: 0 0.5em;
  margin: 0;
  overflow: hidden;
}
#patchat input {
  line-height: 2em;
  width: 100%;
}
#patchat label {
  text-align: center;
}
#patchat button {
  line-height: 1em;
}
#patchat form {
  padding: 1em;
}
</style>
