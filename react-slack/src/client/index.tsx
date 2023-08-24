import { App } from "@slack/bolt";
import SlackRenderer from "../lib/slackRenderer";
import React from "react";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  endpoints: "/api/v1/bender/events",
});

(async () => {
  await app.start(process.env.PORT || 3000);

  console.log("Bolt app is running !!!");
})();

const reactSlack = new SlackRenderer(app);
//server-side
reactSlack.render(
  <command value="/react-slack" ack>
    <modal
      title="This is my modal"
      //https://slack.dev/bolt-js/concepts#view-submissions
      onSubmit={async ({ ack, view, client, body }) => {
        await ack();
        console.log(JSON.stringify(body));
        const {
          values: {
            my_prompt: { my_input: myInput },
          },
        } = view.state;
        await client.chat.postMessage({
          channel: "C04TVQB89CG", //body.user.id,
          text: `I am processing your request... :hourglass:`,
        });

        const definition = await defineWord(myInput.value);

        await client.chat.postMessage({
          channel: "C04TVQB89CG", //body.user.id,
          text: `${myInput.value}: ${definition}`,
        });
      }}
    >
      <img title="Coffee time" url="https://coffee.alexflipnote.dev/random" />
      <section>
        <text markdown>
          A message *with some bold text* and _some italicized text_.
        </text>
      </section>
      <input label="My Label" actionId="my_input" blockId="my_prompt" />
    </modal>
  </command>
);

async function defineWord(word: string) {
  try {
    const response = await global.fetch(
      "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
    );
    const json = await response.json();
    return json[0].meanings[0].definitions[0].definition;
  } catch (error) {
    return "Could not find a definition. Try another word or try again later.";
  }
}
