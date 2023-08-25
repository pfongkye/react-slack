import { App } from "@slack/bolt";
import { defineWord } from "../utils";

//https://slack.dev/bolt-js/tutorial/getting-started#setting-up-events
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  endpoints: "/api/v1/react-slack/events",
});

(async () => {
  await app.start(process.env.PORT || 3000);

  console.log("Vanilla Slack app is running !!!");
})();

const callback_id = "view_1";
app.command("/react-slack", async ({ ack, client, body }) => {
  await ack();

  await client.views.open({
    trigger_id: body.trigger_id,
    view: {
      type: "modal",
      callback_id,
      title: { type: "plain_text", text: "Vanilla Slack Modal" },
      submit: { type: "plain_text", text: "Submit" },
      blocks: [
        {
          type: "image",
          image_url: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f",
          alt_text: "Tea time",
          title: {
            type: "plain_text",
            text: "Tea time",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Type below *the word* you want to _define_.",
          },
        },
        {
          type: "input",
          block_id: "my_prompt",
          label: {
            type: "plain_text",
            text: "Word",
          },
          element: {
            type: "plain_text_input",
            action_id: "my_input",
          },
        },
      ],
    },
  });
});

app.view(callback_id, async ({ ack, view, client, body }) => {
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
});
