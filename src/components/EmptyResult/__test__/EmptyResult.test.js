import React from 'react';
import { render } from '@testing-library/react'
import EmptyResult from '../EmptyResult';

describe('EmptyResult', () => {
  it('should render with default props', () => {
    const { container, getByText, getByAltText } = render(<EmptyResult />)

    const defaultMessage = 'Oops... Não encontramos nada.';
    const defaultWidth = 200;

    const imageEl = getByAltText(/empty result/i);

    expect(container).toBeInTheDocument()
    expect(imageEl).toBeInTheDocument()
    expect(imageEl.width).toBe(defaultWidth)
    expect(getByText(defaultMessage)).toBeInTheDocument()

  })

  it('should render with prop message', () => {
    const fakeMessage = 'fake message'
    const { getByText } = render(<EmptyResult message={fakeMessage} />)

    expect(getByText(fakeMessage)).toBeInTheDocument()
  })

  it('should render with prop width', () => {
    const fakeImageWidth = 300
    const { getByAltText } = render(<EmptyResult width={fakeImageWidth} />)

    const imageEl = getByAltText(/empty result/i);

    expect(imageEl.width).toBe(fakeImageWidth)
  })

})