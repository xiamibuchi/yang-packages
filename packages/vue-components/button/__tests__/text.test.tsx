import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import Button from '../src/button.vue';

describe('button.vue', () => {
  test('render text & class', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'primary',
      },
    });
    expect(wrapper.classes()).toContain('sy-button');
  });
});
