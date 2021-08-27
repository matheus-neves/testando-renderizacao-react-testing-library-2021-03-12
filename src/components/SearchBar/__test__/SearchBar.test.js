import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import SearchBar from '../SearchBar';

jest.useFakeTimers();

const setup = (props = {}) => {

  const defaultProps = {
    placeholder: 'fake-placeholder',
    buttonLabel: 'fake-label',
    inputDelay: 200,
    ...props
  }

  const renderResult = render(<SearchBar {...defaultProps} />)

  return {
    inputEl: renderResult.getByPlaceholderText(defaultProps.placeholder),
    buttonEl: renderResult.getByText(defaultProps.buttonLabel),
    inputDelay: defaultProps.inputDelay,
    ...renderResult
  }

}


describe('SearchBar', () => {

  it('should be render with default props', () => {
    const { buttonEl, inputEl } = setup();

    expect(buttonEl).toBeInTheDocument();
    expect(inputEl).toBeInTheDocument();
  })

  it('input should emit onChange event', () => {

    const onChange = jest.fn();
    const fakeTargetValue = 'Picles';

    const { inputEl, inputDelay } = setup({ onChange });

    fireEvent.change(inputEl, {
      target: {
        value: fakeTargetValue
      }
    })

    jest.advanceTimersByTime(inputDelay);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ target: inputEl });

  })

  it('button should emit onButtonClick', () => {
    const callback = jest.fn();
    const { buttonEl } = setup({ onButtonClick: callback });

    fireEvent.click(buttonEl);

    expect(callback).toHaveBeenCalledTimes(1);

  })

})