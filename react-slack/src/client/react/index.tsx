import { App } from "@slack/bolt";
import SlackRenderer from "../../lib/slackRenderer";
import React from "react";
import { defineWord } from "../utils";

//https://slack.dev/bolt-js/tutorial/getting-started#setting-up-events
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  endpoints: "/api/v1/react-slack/events",
});

(async () => {
  await app.start(process.env.PORT || 3000);

  console.log("React Slack app is running !!!");
})();

const reactSlack = new SlackRenderer(app);
//server-side
reactSlack.render(
  <command value="/define-word" ack>
    <modal
      title="React Modal"
      //https://slack.dev/bolt-js/concepts#view-submissions
      onSubmit={handleSubmit}
    >
      <img title="Coffee time" url="https://images.unsplash.com/photo-1506619216599-9d16d0903dfd" />
      <section>
        <text markdown>Type below *the word* you want to _define_.</text>
      </section>
      <input label="Word" actionId="my_input" blockId="my_prompt" />
    </modal>
  </command>
);

async function handleSubmit({ ack, view, client, body }) {
  await ack();
  const {
    values: {
      my_prompt: { my_input: myInput },
    },
  } = view.state;
  await client.chat.postMessage({
    channel: body.user.id,
    text: `I am processing your request... :hourglass:`,
  });

  const definition = await defineWord(myInput.value);

  await client.chat.postMessage({
    channel: body.user.id,
    text: `${myInput.value}: ${definition}`,
  });
}
