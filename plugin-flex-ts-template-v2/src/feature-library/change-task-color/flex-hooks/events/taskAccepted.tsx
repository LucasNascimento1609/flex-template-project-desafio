import * as Flex from '@twilio/flex-ui';
import { FlexEvent } from '../../../../types/feature-loader';

const FOUR_MINUTES = 4 * 60 * 1000;
const EIGHT_MINUTES = 8 * 60 * 1000;

const handleColor = (task: any) => {
    setTimeout(() => {
        task.setAttributes({
            ...task.attributes,
            bgColor: 'yellow',
        });
    }, FOUR_MINUTES);

    setTimeout(() => {
        task.setAttributes({
            ...task.attributes,
            bgColor: 'red',
        });
    }, EIGHT_MINUTES);
};

const handleMessages = (task: any, manager: Flex.Manager) => {
    const { author, conversation: { sid } } = task;
    const { tasks } = manager.store.getState().flex.worker;
    const arrTasks = Array.from(tasks.values());
    const selectedTask = arrTasks.find((task) => task.attributes.conversationSid === sid);

    if (author.includes("whatsapp:")) {
        if (!selectedTask?.attributes.noReply) {
            selectedTask?.setAttributes({
                ...selectedTask.attributes,
                noReply: true,
                lastMessage: new Date().getTime(),
                bgColor: 'green',
            });
            handleColor(selectedTask);
        };
    } else {
        selectedTask?.setAttributes({
            ...selectedTask.attributes,
            noReply: false,
            bgColor: ''
        });
    };
};

const addAttribute = ({ conversationSid }: any) => {
    const tasks = document.querySelectorAll('.Twilio-TaskListBaseItem');
    tasks.forEach((task) => {
        const dataConversationSid = task.getAttribute('conversationSid');
        if (!dataConversationSid) {
            task.setAttribute('conversationSid', conversationSid);
        };
    });
};

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = async function exampleTaskAcceptedHandler(
    flex: typeof Flex,
    manager: Flex.Manager,
    task: Flex.ITask,
) {
    manager.events.addListener('taskAccepted', (task) => {
        const { attributes } = task;

        addAttribute(attributes);

        task.setAttributes({
            ...attributes,
            noReply: true,
            bgColor: 'green',
            lastMessage: new Date().getTime(),
        });

        handleColor(task)
    });

    manager.chatClient.on('messageAdded', (task) => handleMessages(task, manager));
};
