import React from 'react';
import { render, fireEvent } from '@testing-library/react'
import PokemonCard from '../PokemonCard'
import { cardBuilder } from '../../../__mocks__/card-builder'

const setup = (props = {
  card: cardBuilder({ name: 'Meu Pokemon' })
}) => {
  const { card } = props;
  const onClick = jest.fn();
  const imageAlt = `${card.id}-${card.name}`;
  const renderResult = render(<PokemonCard {...card} onClick={onClick} />)
  const imageEl = renderResult.getByAltText(`${card.id}-${card.name}`)
  return {
    card,
    imageEl,
    imageAlt,
    onClick,
    ...renderResult,
  };
}

describe('PokemonCard', () => {
  it('should be render with default props', () => {
    const { card, imageAlt, imageEl } = setup();

    expect(imageEl).toBeInTheDocument();
    expect(imageEl.src).toBe(card.imageUrl);
    expect(imageEl.alt).toBe(imageAlt);
  })

  it('should emit event onClick', () => {
    const { imageEl, onClick } = setup()
    fireEvent.click(imageEl);
    expect(onClick).toHaveBeenCalledTimes(1);
  })
})
