<template>
  <ol id="messages">
    <ol class="thread" v-for="(thread, idx) in threads" :key="idx">
      <li
        v-for="(msg, i) in thread"
        :key="i"
        :class="{ message: true, reply: i > 0 }"
      >
        <span class="name">{{ msg.displayName }}</span>
        <span class="time">{{ getLocalTimeString(msg.msgTimestamp) }}</span>
        <span class="content">{{ decode(msg.content) }}</span>
        <a class="replybtn" @click.prevent="$emit('reply', msg);">reply</a>
      </li>
    </ol>
  </ol>
</template>

<script>
export default {
  name: 'Messages',
  props: {
    messages: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    threads() {
      // Get all thread IDs then find the unique ones
      const threadIds = this.messages.map((msg) => msg.threadId);
      const uniqueThreadIds = threadIds.filter(
        (id, index, arr) => arr.indexOf(id) === index
      );

      // Create array of threads
      const threads = uniqueThreadIds.map((id) => {
        const messagesInThread = this.messages.filter(
          (msg) => msg.threadId === id
        );
        return messagesInThread.sort((a, b) => a.timestamp - b.timestamp); // sort messages within thread
      });
      return threads.sort((a, b) => a[0].timestamp - b[0].timestamp); //sort threads by timestamp on first message
    },
  },
  methods: {
    getLocalTimeString(utcTimestamp) {
      const date = new Date(0);
      date.setUTCMilliseconds(utcTimestamp);
      const hours = `${date.getHours()}`.padStart(2, '0');
      const mins = `${date.getMinutes()}`.padStart(2, '0');
      return `${hours}:${mins}`;
    },
    decode(data) {
      return atob(data);
    },
  },
};
</script>

<style>
#messages {
  max-height: 80%;
  overflow: scroll;
  max-width: 100%;
  padding: 0;
  margin: 0 !important;
  margin-bottom: 0.5em;
}
#messages li {
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0;
  margin: 0;
  color: black;
  width: 100%;
  height: auto;
  border-bottom: 0.5px solid lightgrey;
}
.name {
  width: 90%;
  font-size: 0.75em;
}
a.replybtn {
  font-size: 0.9em;
  display: inline-block;
  padding: 0;
  margin: 0;
  text-align: right;
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
.time {
  align-self: center;
  font-size: 0.75em;
}
</style>
