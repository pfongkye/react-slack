import ReactReconciler from "react-reconciler";
import { App } from "@slack/bolt";

class SlackRenderer {
  private readonly slackApp: App;
  private readonly reactReconciler;
  private rootContainer;
  constructor(slackApp: App) {
    this.slackApp = slackApp;
    this.reactReconciler = ReactReconciler(createHostConfig(slackApp));
    this.rootContainer = this.reactReconciler.createContainer({}, false);
  }
  render(reactElement) {
    this.reactReconciler.updateContainer(reactElement, this.rootContainer);
  }
}

//the host environment configuration (for example DOM, mobile native platforms)
function createHostConfig(slackApp: App) {
  return {
    supportsMutation: true,
    getRootHostContext() {},
    // This is where react-reconciler wants to create an instance of UI element in terms of the target.
    createInstance(type, props) {
      if (type === "command") {
        if (typeof props.children === "string") {
          slackApp.command(props.value, async ({ ack, say, body }) => {
            if (props.ack) {
              await ack();
            }
            await say(props.children);
          });
        }
        return { type, value: props.value, ack: props.ack };
      } else if (type === "modal") {
        //TODO: find a way to better handle submit button (hard-code here)
        //-> either onSubmit on modal or a submit button for better customization (text + action)
        //for now default is onSubmit handler on modal
        return {
          type,
          title: props.title,
          blocks: [],
          submit: { type: "plain_text", text: "hard_coded_submit" },
          onSubmit: props.onSubmit,
        };
      } else if (type === "text") {
        const textElt: any = { text: props.children };
        if (props.markdown) {
          textElt.type = "mrkdwn";
        }
        return textElt;
      } else if (type === "input") {
        return {
          type,
          block_id: props.blockId,
          element: {
            type: "plain_text_input",
            action_id: props.actionId || "sl_input",
          },
          label: {
            type: "plain_text",
            text: props.label,
          },
        };
      } else if (type === "img") {
        return {
          type: "image",
          title: {
            type: "plain_text",
            text: props.title,
          },
          image_url: props.url,
          alt_text: props.alt || props.title,
        };
      }
      return { type };
    },
    createTextInstance() {},
    prepareForCommit() {},
    resetAfterCommit() {},
    getChildHostContext() {},
    shouldSetTextContent() {},
    appendInitialChild(parent, child) {
      if (parent.type === "command") {
        if (child.type === "modal") {
          const callback_id = "view_1";
          slackApp.command(parent.value, async ({ ack, body, client }) => {
            if (parent.ack) {
              await ack();
            }
            await client.views.open({
              trigger_id: body.trigger_id,
              view: {
                ...child,
                type: "modal",
                callback_id,
                title: { type: "plain_text", text: child.title },
              },
            });
          });

          slackApp.view(callback_id, child.onSubmit);
        }
      } else if (parent.type === "modal") {
        parent.blocks.push(child);
      } else if (parent.type === "section") {
        if (child.type === "mrkdwn") {
          parent.text = child;
        }
      }
    },
    finalizeInitialChildren() {},
    clearContainer() {},
    appendChildToContainer() {},
  };
}

export default SlackRenderer;
