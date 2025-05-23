'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import type { UseInteractionsReturn } from '@floating-ui/react';
import { SelectRootContext, useSelectRootContext } from '../root/SelectRootContext';
import { SelectIndexContext, useSelectIndexContext } from '../root/SelectIndexContext';
import { useCompositeListItem } from '../../composite/list/useCompositeListItem';
import { useForkRef } from '../../utils/useForkRef';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import type { BaseUIComponentProps } from '../../utils/types';
import { useSelectItem } from './useSelectItem';
import { useEnhancedEffect } from '../../utils/useEnhancedEffect';
import { useLatestRef } from '../../utils/useLatestRef';
import { SelectItemContext } from './SelectItemContext';

interface InnerSelectItemProps extends Omit<SelectItem.Props, 'value'> {
  highlighted: boolean;
  selected: boolean;
  getRootItemProps: UseInteractionsReturn['getItemProps'];
  setOpen: SelectRootContext['setOpen'];
  typingRef: React.MutableRefObject<boolean>;
  selectionRef: React.MutableRefObject<{
    allowUnselectedMouseUp: boolean;
    allowSelectedMouseUp: boolean;
    allowSelect: boolean;
  }>;
  open: boolean;
  value: any;
  setValue: SelectRootContext['setValue'];
  selectedIndexRef: React.RefObject<number | null>;
  indexRef: React.RefObject<number>;
  setActiveIndex: SelectIndexContext['setActiveIndex'];
  popupRef: React.RefObject<HTMLDivElement | null>;
  keyboardActiveRef: React.RefObject<boolean>;
}

const InnerSelectItem = React.forwardRef(function InnerSelectItem(
  props: InnerSelectItemProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    disabled = false,
    highlighted,
    selected,
    getRootItemProps,
    render,
    setOpen,
    typingRef,
    selectionRef,
    open,
    value,
    setValue,
    selectedIndexRef,
    indexRef,
    setActiveIndex,
    popupRef,
    keyboardActiveRef,
    ...otherProps
  } = props;

  const state: SelectItem.State = React.useMemo(
    () => ({
      disabled,
      open,
      highlighted,
      selected,
    }),
    [disabled, open, highlighted, selected],
  );

  const { getItemProps, rootRef } = useSelectItem({
    open,
    setOpen,
    disabled,
    highlighted,
    selected,
    ref: forwardedRef,
    typingRef,
    handleSelect: (event) => setValue(value, event),
    selectionRef,
    selectedIndexRef,
    indexRef,
    setActiveIndex,
    popupRef,
    keyboardActiveRef,
  });

  const mergedRef = useForkRef(rootRef, forwardedRef);

  const { renderElement } = useComponentRenderer({
    propGetter(externalProps = {}) {
      const rootProps = getRootItemProps({
        ...externalProps,
        active: highlighted,
        selected,
      });
      // With our custom `focusItemOnHover` implementation, this interferes with the logic and can
      // cause the index state to be stuck when leaving the select popup.
      delete rootProps.onFocus;
      return getItemProps(rootProps);
    },
    render: render ?? 'div',
    ref: mergedRef,
    className,
    state,
    extraProps: otherProps,
  });

  const contextValue = React.useMemo(
    () => ({
      selected,
      indexRef,
    }),
    [selected, indexRef],
  );

  return (
    <SelectItemContext.Provider value={contextValue}>{renderElement()}</SelectItemContext.Provider>
  );
});

InnerSelectItem.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * @ignore
   */
  children: PropTypes.node,
  /**
   * CSS class applied to the element, or a function that
   * returns a class based on the component’s state.
   */
  className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * Whether the component should ignore user interaction.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * @ignore
   */
  getRootItemProps: PropTypes.func.isRequired,
  /**
   * @ignore
   */
  highlighted: PropTypes.bool.isRequired,
  /**
   * @ignore
   */
  indexRef: PropTypes.shape({
    current: PropTypes.number.isRequired,
  }).isRequired,
  /**
   * @ignore
   */
  keyboardActiveRef: PropTypes.shape({
    current: PropTypes.bool.isRequired,
  }).isRequired,
  /**
   * Overrides the text label to use on the trigger when this item is selected
   * and when the item is matched during keyboard text navigation.
   */
  label: PropTypes.string,
  /**
   * @ignore
   */
  open: PropTypes.bool.isRequired,
  /**
   * @ignore
   */
  popupRef: PropTypes.shape({
    current: PropTypes.object,
  }).isRequired,
  /**
   * Allows you to replace the component’s HTML element
   * with a different tag, or compose it with another component.
   *
   * Accepts a `ReactElement` or a function that returns the element to render.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  /**
   * @ignore
   */
  selected: PropTypes.bool.isRequired,
  /**
   * @ignore
   */
  selectedIndexRef: PropTypes.shape({
    current: PropTypes.number,
  }).isRequired,
  /**
   * @ignore
   */
  selectionRef: PropTypes.shape({
    current: PropTypes.shape({
      allowSelect: PropTypes.bool.isRequired,
      allowSelectedMouseUp: PropTypes.bool.isRequired,
      allowUnselectedMouseUp: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  /**
   * @ignore
   */
  setActiveIndex: PropTypes.func.isRequired,
  /**
   * @ignore
   */
  setOpen: PropTypes.func.isRequired,
  /**
   * @ignore
   */
  setValue: PropTypes.func.isRequired,
  /**
   * @ignore
   */
  typingRef: PropTypes.shape({
    current: PropTypes.bool.isRequired,
  }).isRequired,
  /**
   * @ignore
   */
  value: PropTypes.any.isRequired,
} as any;

const MemoizedInnerSelectItem = React.memo(InnerSelectItem);

/**
 * An individual option in the select menu.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
const SelectItem = React.forwardRef(function SelectItem(
  props: SelectItem.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { value: valueProp = null, label, ...otherProps } = props;

  const listItem = useCompositeListItem({ label });

  const { activeIndex, selectedIndex, setActiveIndex } = useSelectIndexContext();
  const {
    getItemProps,
    setOpen,
    setValue,
    open,
    selectionRef,
    typingRef,
    valuesRef,
    popupRef,
    registerSelectedItem,
    value,
    keyboardActiveRef,
  } = useSelectRootContext();

  const itemRef = React.useRef<HTMLDivElement | null>(null);
  const selectedIndexRef = useLatestRef(selectedIndex);
  const indexRef = useLatestRef(listItem.index);
  const mergedRef = useForkRef(listItem.ref, forwardedRef, itemRef);

  const hasRegistered = listItem.index !== -1;

  useEnhancedEffect(() => {
    if (!hasRegistered) {
      return undefined;
    }

    const values = valuesRef.current;
    values[listItem.index] = valueProp;

    return () => {
      delete values[listItem.index];
    };
  }, [hasRegistered, listItem.index, valueProp, valuesRef]);

  useEnhancedEffect(() => {
    if (hasRegistered && valueProp === value) {
      registerSelectedItem(listItem.index);
    }
  }, [hasRegistered, listItem.index, registerSelectedItem, valueProp, value]);

  const highlighted = activeIndex === listItem.index;
  const selected = selectedIndex === listItem.index;

  return (
    <MemoizedInnerSelectItem
      ref={mergedRef}
      highlighted={highlighted}
      selected={selected}
      getRootItemProps={getItemProps}
      setOpen={setOpen}
      open={open}
      selectionRef={selectionRef}
      typingRef={typingRef}
      value={valueProp}
      setValue={setValue}
      selectedIndexRef={selectedIndexRef}
      indexRef={indexRef}
      setActiveIndex={setActiveIndex}
      popupRef={popupRef}
      keyboardActiveRef={keyboardActiveRef}
      {...otherProps}
    />
  );
});

namespace SelectItem {
  export interface State {
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
    highlighted: boolean;
    selected: boolean;
    /**
     * Whether the select menu is currently open.
     */
    open: boolean;
  }

  export interface Props extends Omit<BaseUIComponentProps<'div', State>, 'id'> {
    children?: React.ReactNode;
    /**
     * A unique value that identifies this select item.
     * @default null
     */
    value?: any;
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * Overrides the text label to use on the trigger when this item is selected
     * and when the item is matched during keyboard text navigation.
     */
    label?: string;
  }
}

SelectItem.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * @ignore
   */
  children: PropTypes.node,
  /**
   * CSS class applied to the element, or a function that
   * returns a class based on the component’s state.
   */
  className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * Whether the component should ignore user interaction.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * Overrides the text label to use on the trigger when this item is selected
   * and when the item is matched during keyboard text navigation.
   */
  label: PropTypes.string,
  /**
   * Allows you to replace the component’s HTML element
   * with a different tag, or compose it with another component.
   *
   * Accepts a `ReactElement` or a function that returns the element to render.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  /**
   * A unique value that identifies this select item.
   * @default null
   */
  value: PropTypes.any,
} as any;

export { SelectItem };
