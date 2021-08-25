import React from 'react';
import { render } from "@testing-library/react"
import PokeballLoading from "../PokeballLoading"

describe('PokeballLoading', () => {

  it('should be render with default props', () => {
    const defaultPropSize = 200;
    const { container, getByAltText } = render(<PokeballLoading />)

    const imageEl = getByAltText('Pokeball Loading');

    expect(container).toBeInTheDocument();
    expect(imageEl).toBeInTheDocument();
    expect(imageEl.width).toBe(defaultPropSize);
    expect(imageEl.height).toBe(defaultPropSize);
  })

  it('should be render with prop size', () => {
    const fakeSizeProp = 100;

    const { getByAltText } = render(<PokeballLoading size={fakeSizeProp} />)

    const imageEl = getByAltText('Pokeball Loading');

    expect(imageEl.width).toBe(fakeSizeProp);
    expect(imageEl.height).toBe(fakeSizeProp);

  })

  it('should be render and not render with prop message', () => {
    const fakeMessageProp = 'fake message';
    const { queryByText, rerender } = render(<PokeballLoading />)

    expect(queryByText(fakeMessageProp)).not.toBeInTheDocument()

    rerender(<PokeballLoading message={fakeMessageProp} />)

    expect(queryByText(fakeMessageProp)).toBeInTheDocument()


  })

})