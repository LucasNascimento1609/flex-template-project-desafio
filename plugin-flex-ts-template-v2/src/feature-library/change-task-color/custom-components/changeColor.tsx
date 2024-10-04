import { withTaskContext } from "@twilio/flex-ui";
import { useEffect } from "react";

const FOUR_MINUTES = 4 * 60 * 1000;
const EIGHT_MINUTES = 8 * 60 * 1000;

const changeColor = (props: any) => {
    const { lastMessage, noReply, bgColor, conversationSid } = props.task.attributes;

    const applyColor = () => {
        const tasks = document.querySelectorAll('.Twilio-TaskListBaseItem');
        tasks.forEach((task: any) => {
            const dataConversationSid = task.getAttribute('data-conversation-sid');
            if (dataConversationSid === conversationSid) {
                task.style.backgroundColor = bgColor || '';
            }
        });
    };

    const checkNewColor = (lastMessage: number) => {
        const timeNow = new Date().getTime();
        const noReplyTime = timeNow - lastMessage;

        if (noReplyTime < FOUR_MINUTES) {
            return 'green';
        } else if (noReplyTime < EIGHT_MINUTES) {
            return 'yellow';
        } else {
            return 'red';
        }
    };

    useEffect(() => {
        if (noReply) {
            const newColor = checkNewColor(lastMessage);
            if (bgColor !== newColor) {
                props.task.setAttributes({
                    ...props.task.attributes,
                    bgColor: newColor,
                });
            }
        } else if (bgColor) {
            props.task.setAttributes({
                ...props.task.attributes,
                bgColor: '',
            });
        }

        // Essa parte do código está gerando um bug no momento em que a página é recarregada. Onde todas as tasks ficam o mesmo conversationSid, o que faz com que todas tenham a mesma cor. Infelizmente não consegui resolver esse bug a tempo
        const tasks = document.querySelectorAll('.Twilio-TaskListBaseItem');
        tasks.forEach((task: any) => {
            const dataConversationSid = task.getAttribute('data-conversation-sid');
            if (!dataConversationSid) {
                task.setAttribute('data-conversation-sid', conversationSid);
            }
        });

        applyColor();
    }, [noReply, lastMessage, conversationSid, bgColor]);

    return null;
};

export default withTaskContext(changeColor);