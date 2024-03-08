export default (state = [], action) => {
    if (action.type === "DATA_FETCH") {
      const data = [action.data];
      return data;
    }
    return state;
  };