'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import type { BaseUIComponentProps } from '../../utils/types';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { useScrollAreaRootContext } from '../root/ScrollAreaRootContext';
import { useForkRef } from '../../utils/useForkRef';
import { mergeProps } from '../../merge-props';
import { useScrollAreaScrollbarContext } from '../scrollbar/ScrollAreaScrollbarContext';
import { ScrollAreaScrollbarCssVars } from '../scrollbar/ScrollAreaScrollbarCssVars';

/**
 * The draggable part of the the scrollbar that indicates the current scroll position.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Scroll Area](https://base-ui.com/react/components/scroll-area)
 */
const ScrollAreaThumb = React.forwardRef(function ScrollAreaThumb(
  props: ScrollAreaThumb.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { render, className, ...otherProps } = props;

  const {
    thumbYRef,
    thumbXRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    setScrollingX,
    setScrollingY,
  } = useScrollAreaRootContext();

  const { orientation } = useScrollAreaScrollbarContext();

  const mergedRef = useForkRef(forwardedRef, orientation === 'vertical' ? thumbYRef : thumbXRef);

  const state: ScrollAreaThumb.State = React.useMemo(() => ({ orientation }), [orientation]);

  const { renderElement } = useComponentRenderer({
    render: render ?? 'div',
    ref: mergedRef,
    className,
    state,
    extraProps: mergeProps<'div'>(
      {
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp(event) {
          if (orientation === 'vertical') {
            setScrollingY(false);
          }
          if (orientation === 'horizontal') {
            setScrollingX(false);
          }
          handlePointerUp(event);
        },
        style: {
          ...(orientation === 'vertical' && {
            height: `var(${ScrollAreaScrollbarCssVars.scrollAreaThumbHeight})`,
          }),
          ...(orientation === 'horizontal' && {
            width: `var(${ScrollAreaScrollbarCssVars.scrollAreaThumbWidth})`,
          }),
        },
      },
      otherProps,
    ),
  });

  return renderElement();
});

namespace ScrollAreaThumb {
  export interface State {
    orientation?: 'horizontal' | 'vertical';
  }

  export interface Props extends BaseUIComponentProps<'div', State> {}
}

ScrollAreaThumb.propTypes /* remove-proptypes */ = {
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
   * Allows you to replace the component’s HTML element
   * with a different tag, or compose it with another component.
   *
   * Accepts a `ReactElement` or a function that returns the element to render.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { ScrollAreaThumb };
