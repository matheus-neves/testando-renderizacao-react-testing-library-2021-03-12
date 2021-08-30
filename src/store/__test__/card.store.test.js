import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import axiosMock from '../../__mocks__/axios-mock';
import cardStore from '../card.store';
import { cardBuilder } from '../../__mocks__/card-builder';
import { cardStateBuilder } from '../../__mocks__/card-state-builder';
import { orderBy } from 'lodash';

const setup = (state) => {
  jest.clearAllMocks();

  const defaultState = cardStateBuilder();
  const initialState = state || defaultState;

  const store = createStore(
    combineReducers({
      card: cardStore.reducer
    }),
    {
      card: initialState
    },
    applyMiddleware(thunk)
  )

  return {
    initialState,
    store
  }
}

describe('Card Store', () => {
  it('should have correct initialState', () => {
    const { store, initialState } = setup();
    expect(store.getState()).toEqual({ card: initialState })
  })
  it('should dispatch getCards', async () => {
    const card = cardBuilder();
    const { store, initialState } = setup();

    axiosMock.get.mockResolvedValueOnce({
      data: {
        cards: [card]
      }
    })

    await store.dispatch(cardStore.actions.getCards({ query: '' }))

    const currentState = store.getState();

    expect(axiosMock.get).toHaveBeenCalledTimes(1)
    expect(axiosMock.get).toHaveBeenCalledWith('/cards?page=1&name=&pageSize=27')
    expect(currentState.card).toEqual({
      ...initialState,
      cards: { [card.id]: card },
      ids: [card.id],
      query: ''
    })
  })

  it('should dispatch nextCards', async () => {
    const card = cardBuilder({
      name: 'PokePicles'
    });
    const query = 'picles';
    const { store, initialState } = setup();

    store.dispatch(cardStore.actions.setQuery({ query }));

    axiosMock.get.mockResolvedValueOnce({
      data: {
        cards: [card]
      }
    })

    await store.dispatch(cardStore.actions.nextCards())

    const currentState = store.getState();

    expect(axiosMock.get).toHaveBeenCalledTimes(1)
    expect(axiosMock.get).toHaveBeenCalledWith(`/cards?page=2&name=${query}&pageSize=27`)
    expect(currentState.card).toEqual({
      ...initialState,
      page: 2,
      cards: { ...initialState.cards, [card.id]: card },
      ids: [...initialState.ids, card.id],
      query
    })
  })

  it('should dispatch setQuery', () => {
    const query = 'picles';
    const { store } = setup();

    store.dispatch(cardStore.actions.setQuery({ query }));
    const currentState = store.getState();

    expect(currentState.card.query).toBe(query);
  })

  it('should dispatch setPage', () => {

    const page = 2;
    const { store } = setup();

    store.dispatch(cardStore.actions.setPage({ page }));

    const currentState = store.getState();

    expect(currentState.card.page).toBe(page)
  })

  it('should dispatch setLoading', () => {

    const loading = true;

    const { store } = setup();

    store.dispatch(cardStore.actions.setLoading({ loading }));

    const currentState = store.getState();

    expect(currentState.card.loading).toBe(loading)
  })

  it('should select cards', () => {
    const { initialState } = setup()

    const cards = cardStore.selectors.cards({ card: initialState })

    expect(cards).toEqual(
      orderBy(
        Object.values(initialState.cards),
        ['name']
      )
    )
  });

  it('should select loading', () => {
    const { initialState } = setup()

    const loading = cardStore.selectors.loading({ card: initialState })

    expect(loading).toBe(false)
  });
})