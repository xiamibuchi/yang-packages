import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import Text from '../src/text.vue';

const AXIOM = 'Rem is the best girl';

describe('Text.vue', () => {
  test('render text & class', () => {
    const wrapper = mount(() => (
      <Text
        v-slots={{
          default: () => AXIOM,
        }}
      />
    ));
    const vm = wrapper.vm;

    expect(vm.$el.classList.contains('sy-text')).toEqual(true);
    expect(wrapper.text()).toEqual(AXIOM);
  });

  test('tag', () => {
    const wrapper = mount(() => <Text tag="del" />);
    const vm = wrapper.vm;
    expect(vm.$el.tagName).toEqual('DEL');
  });
});
