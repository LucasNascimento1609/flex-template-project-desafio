// import React from 'react';
import * as Flex from "@twilio/flex-ui";
import { FlexComponent } from "../../../types/feature-loader";
import ChangeColor from "../custom-components/changeColor";

export const componentName = FlexComponent.TaskListItem;
export const componentHook = function addChangeColor(flex: typeof Flex) {
    flex.TaskListItem.Content.add(<ChangeColor key='change-color-component' />)
};
