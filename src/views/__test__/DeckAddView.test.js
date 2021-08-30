import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import axiosMock from '../../__mocks__/axios-mock';

import DeckAddView from "../DeckAddView";
import cardStore from "../../store/card.store";
import { pikachuMock, squirtleMock } from "../../__mocks__/card-builder";
import { storeBuilder } from "../../__mocks__/store-builder";

jest.useFakeTimers();

const setup = () => {
  jest.clearAllMocks();

  const store = storeBuilder();

  const renderResult = render(
    <Provider store={store}>
      <MemoryRouter>
        <Route path={'/'} component={DeckAddView} />
      </MemoryRouter>
    </Provider>);

  return {
    ...renderResult,
    store,
    input: renderResult.getByPlaceholderText('Pesquise...'),
    btnAdd: renderResult.getByText('Salvar Baralho')
  };
}

const mockCardsResponse = (cards = []) => {
  axiosMock.get.mockResolvedValue({
    data: {
      cards
    }
  })
}

describe('DeckAddView', () => {

  beforeEach(mockCardsResponse)

  it('should render with default props', async () => {
    const { container, input, btnAdd, getByAltText } = setup();

    await waitFor(() => {
      expect(getByAltText('Empty Result')).toBeInTheDocument()
    })

    expect(container).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(btnAdd).toBeInTheDocument();
  })

  it('should render loading', async () => {
    const { getByAltText, store } = setup();

    store.dispatch(cardStore.actions.setLoading({ loading: true }))

    expect(getByAltText('Pokeball Loading')).toBeInTheDocument();
  })

  it('should input search', async () => {
    const { input } = setup();

    const query = 'picles';

    fireEvent.change(input, {
      target: {
        value: 'picles'
      }
    });

    jest.runAllTimers();

    expect(axiosMock.get).toHaveBeenCalledTimes(2)
    expect(axiosMock.get).toHaveBeenCalledWith(`/cards?page=1&name=${query}&pageSize=27`)

  })

  it('should render cards', async () => {
    const cards = [pikachuMock, squirtleMock];

    mockCardsResponse(cards);

    const { getByAltText } = setup();

    await waitFor(() => {
      cards.forEach(card => {
        expect(getByAltText(`${card.id}-${card.name}`));
      })
    })
  })
})