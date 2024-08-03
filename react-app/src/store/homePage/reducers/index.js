import { FETCH_DATA_SUCCESS } from "../constants";

const initialState = {
  data: "eswar",
};

const homePageReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DATA_SUCCESS:
      return { ...state, data: action.payload};
    default:
      return state;
  }
};

export default homePageReducer;
