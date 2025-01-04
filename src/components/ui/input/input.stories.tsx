import type { Meta, StoryObj } from '@storybook/react';
import { SearchIcon } from 'lucide-react';
import { View } from 'react-native';
import { Input, InputField, InputIcon, InputSlot } from './index';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'underlined', 'rounded'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// Basic Input
export const Basic: Story = {
  render: (args) => (
    <Input {...args}>
      <InputField placeholder="Enter text here" />
    </Input>
  ),
  args: {
    variant: 'outline',
    size: 'md',
  },
};

// Input with Icon
export const WithIcon: Story = {
  render: (args) => (
    <Input {...args}>
      <InputIcon>
        <SearchIcon />
      </InputIcon>
      <InputField placeholder="Search..." />
    </Input>
  ),
  args: {
    variant: 'outline',
    size: 'md',
  },
};

// Input Variants
export const Variants: Story = {
  render: () => (
    <View className="flex flex-col gap-4">
      <Input variant="outline">
        <InputField placeholder="Outline variant" />
      </Input>
      <Input variant="underlined">
        <InputField placeholder="Underlined variant" />
      </Input>
      <Input variant="rounded">
        <InputField placeholder="Rounded variant" />
      </Input>
    </View>
  ),
};

// Input Sizes
export const Sizes: Story = {
  render: () => (
    <View className="flex flex-col gap-4">
      <Input size="sm">
        <InputField placeholder="Small size" />
      </Input>
      <Input size="md">
        <InputField placeholder="Medium size" />
      </Input>
      <Input size="lg">
        <InputField placeholder="Large size" />
      </Input>
      <Input size="xl">
        <InputField placeholder="Extra large size" />
      </Input>
    </View>
  ),
};

// Invalid Input
export const Invalid: Story = {
  render: () => (
    <Input data-invalid={true}>
      <InputField placeholder="Invalid input" />
    </Input>
  ),
};

// Disabled Input
export const Disabled: Story = {
  render: () => (
    <Input>
      <InputField placeholder="Disabled input" />
    </Input>
  ),
};

// Input with Icon and Slot
export const WithIconAndSlot: Story = {
  render: () => (
    <Input>
      <InputIcon>
        <SearchIcon />
      </InputIcon>
      <InputField placeholder="Search with button..." />
      <InputSlot>
          Search
      </InputSlot>
    </Input>
  ),
};
