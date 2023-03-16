import { App } from "@slack/bolt";
import SlackRenderer from "../lib/slackRenderer";
import React from 'react';

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    endpoints: '/api/v1/bender/events',
});


(async () => {
    await app.start(process.env.PORT || 3000);
    
    console.log('Bolt app is running !!!');
})();

const reactSlack = new SlackRenderer(app);
reactSlack.render(
    <command value='/bender_stg_local' ack>
        <modal title="This is my modal">
            <section><text markdown>A message *with some bold text* and _some italicized text_.</text></section>
        </modal>
    </command>)

