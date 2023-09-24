# Slack React

Implementing a custom react renderer (react-reconciler) to render Slack components, similar to what we have with react-dom (host is DOM) and react-native (hosts are native mobile platforms)

## Prerequisites

- Install [ngrok](https://ngrok.com/)
- Create a [Slack App](https://api.slack.com/start/quickstart)

## How-to 

Create a `.env` file  (see `.env.template`) and get the environment variables from Slack App

```env
SLACK_SIGNING_SECRET=
SLACK_BOT_TOKEN=
```

Run
> ngrok http 3000

Copy forwarding link to Slack App [manifest](https://api.slack.com/reference/manifests)

```yaml
display_information:
  name: React Slack Demo
features:
  bot_user:
    display_name: React-Slack-Demo
    always_online: false
  slash_commands:
    - command: /define-word
      url: {ngrok_forwarding_link}/api/v1/react-slack/events
      description: An application to define words in english
      usage_hint: Get definition of a word
      should_escape: true
oauth_config:
  scopes:
    bot:
      - chat:write
      - chat:write.public
      - commands
settings:
  interactivity:
    is_enabled: true
    request_url: {ngrok_forwarding_link}/api/v1/react-slack/events
  org_deploy_enabled: false
  socket_mode_enabled: false
  token_rotation_enabled: false

```

`Launch Program` through VSCode debugger

## Additional Resources

- Building with [Bolt for JavaScript](https://api.slack.com/start/building/bolt-js)
- Implementing a [custom react renderer](https://agent-hunt.medium.com/hello-world-custom-react-renderer-9a95b7cd04bc)
- [react-reconciler](https://www.npmjs.com/package/react-reconciler) package
- Slack [events API](https://api.slack.com/apis/connections/events-api)
- Sophie Alpert's [article](https://www.infoq.com/news/2020/01/react-conf-2019-custom-renderer/) on infoQ and the related [video](https://www.youtube.com/watch?v=CGpMlWVcHok) on how to build a custom renderer