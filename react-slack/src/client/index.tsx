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
        <modal title="This is my modal" onSubmit={async ({ack, view, client, body})=>{
                        await ack();
                        console.log(JSON.stringify(view))
                        await client.chat.postMessage({
                            channel: body.user.id,
                            text: 'I am processing your request.'
                        })
                    }}>
            <section><text markdown>A message *with some bold text* and _some italicized text_.</text></section>
            <input label="My Label" />
        </modal>
    </command>)

