import axios from 'axios';
import { FETCH_DATA_SUCCESS } from '../constants';

export const fetchData = () => async (dispatch) => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
    dispatch({ type: FETCH_DATA_SUCCESS, payload: response.data });
  } catch (error) {
    console.log(error.message)
  }
};
