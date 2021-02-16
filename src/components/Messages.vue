<template>
  <ol id="messages" ref="messages">
    <ol class="thread" v-for="(thread, idx) in threads" :key="idx">
      <li
        v-for="(msg, i) in thread"
        :key="i"
        :class="{
          message: true,
          reply: i > 0,
          question:
            msg.hasOwnProperty('flags') && msg.flags.includes('question'),
        }"
      >
        <span class="name">{{ msg.displayName }}</span>
        <span class="time">{{ getLocalDateTime(msg.msgTimestamp) }}</span>
        <span class="content">{{ decode(msg.content) }}</span>
        <div class="buttons">
          <button
            type="button"
            tabindex="0"
            class="replybtn"
            @click.prevent="$emit('reply', msg)"
          >
            reply
          </button>
        </div>
      </li>
    </ol>
  </ol>
</template>

<script>
import Vue from 'vue/dist/vue.runtime.esm';

export default {
  name: 'Messages',
  props: {
    messages: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    messages() {
      Vue.nextTick(this.scrollToBottom);
    },
  },
  mounted() {
    this.scrollToBottom();
  },
  computed: {
    threads() {
      let messagesToShow;
      const rawQueryParams = window.location.search.toLowerCase();
      const queryParams = new URLSearchParams(rawQueryParams);
      if (!queryParams.has('questions')) messagesToShow = this.messages;
      else
        messagesToShow = this.messages.filter(
          msg => msg.hasOwnProperty('flags') && msg.flags.includes('question')
        );
      // Get all thread IDs then find the unique ones
      const threadIds = messagesToShow.map(msg => msg.threadId);
      const uniqueThreadIds = threadIds.filter(
        (id, index, arr) => arr.indexOf(id) === index
      );

      // Create array of threads
      const threads = uniqueThreadIds.map(id => {
        const messagesInThread = messagesToShow.filter(
          msg => msg.threadId === id
        );
        return messagesInThread.sort((a, b) => a.timestamp - b.timestamp); // sort messages within thread
      });
      return threads.sort((a, b) => a[0].timestamp - b[0].timestamp); //sort threads by timestamp on first message
    },
  },
  methods: {
    getLocalDateTime(utcTimestamp) {
      const msgDate = new Date(0);
      msgDate.setUTCMilliseconds(utcTimestamp);
      const hours = `${msgDate.getHours()}`.padStart(2, '0');
      const mins = `${msgDate.getMinutes()}`.padStart(2, '0');
      const timeString = `${hours}:${mins}`;

      const year = msgDate.getFullYear();
      const month = msgDate.getMonth();
      const day = msgDate.getDate();
      let dateString = `${day}/${month}`;

      const now = new Date();
      if (now.getFullYear() === year && now.getMonth() === month) {
        if (now.getDate() === day) dateString = '';
        else if (now.getDate() - 1 === day) dateString = 'yesterday';
      }
      return `${dateString} ${timeString}`;
    },
    decode(data) {
      return atob(data);
    },
    scrollToBottom() {
      const messageList = this.$refs.messages;
      messageList.scrollTop = messageList.scrollHeight;
    },
  },
};
</script>

<style>
#messages {
  overflow-y: auto;
  overflow-x: hidden;
  max-width: 100%;
  min-height: 0;
  padding: 1em;
  margin: 0 !important;
  margin-bottom: 0.5em;
}

li.message {
  list-style-type: none;
  padding: 0.25em 0;
  margin: 0;
  color: black;
  width: 100%;
  max-width: 100%;
  border-bottom: 0.5px solid lightgrey;
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
}
li.message:first-child {
  padding-top: 0;
}
.message.reply {
  padding-left: 2em;
  background-image: url('indent.svg');
  background-position: 0.5em 0.25em;
  background-size: 1em;
  background-repeat: no-repeat;
}
.message .buttons button {
  display: inline-block;
  padding: 0.25em 0;
  margin: 0;
  text-align: center;
  background: transparent;
  color: inherit;
  border: 0px;
  text-decoration: underline !important;
  cursor: pointer;
}
.message .time {
  text-align: right;
}
.message .name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.message .name,
.message .time,
.message .buttons button {
  font-size: 0.75em;
}
.message .content {
  display: block;
}
</style>
