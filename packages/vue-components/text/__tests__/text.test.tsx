import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import Text from '../src/text.vue';

const AXIOM = 'Rem is the best girl';

describe('Text.vue', () => {
  test('render text & class', () => {
    const wrapper = mount(Text, {
      slots: {
        default: AXIOM,
      },
    });
    expect(wrapper.classes()).toContain('sy-text');
    expect(wrapper.text()).toEqual(AXIOM);
  });

  test('tag', () => {
    const wrapper = mount(Text, {
      props: {
        tag: 'del',
      },
    });
    expect(wrapper.html()).toEqual(`<del class="sy-text"></del>`);
  });
});
