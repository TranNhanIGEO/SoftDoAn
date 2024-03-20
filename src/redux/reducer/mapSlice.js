const { createSlice } = require("@reduxjs/toolkit");

const initState = {
  currentSchool: null,
  schoolTypes: {},
  schoolLists: [],
  schoolInfos: [],
  schoolDocuments: [],
};

export const mapSlice = createSlice({
  name: "map",
  initialState: initState,
  reducers: {
    setThisSchool: (state, actions) => {
      state.currentSchool = actions.payload;
    },
    setSchoolTypes: (state, actions) => {
      state.schoolTypes = actions.payload;
    },
    setSchoolLists: (state, actions) => {
      state.schoolLists = actions.payload;
    },
    addSchoolInfos: (state, actions) => {
      state.schoolInfos = [...state.schoolInfos, ...actions.payload];
    },
    removeSchoolInfos: (state) => {
      state.schoolInfos = [];
    },
    setSchoolDocuments: (state, actions) => {
      state.schoolDocuments = actions.payload;
    }
  },
});

export const currentSchool = (state) => state.map.currentSchool;
export const schoolTypes = (state) => state.map.schoolTypes;
export const schoolLists = (state) => state.map.schoolLists;
export const schoolInfos = (state) => state.map.schoolInfos;
export const schoolDocuments = (state) => state.map.schoolDocuments;
export const {
  setThisSchool,
  setSchoolTypes,
  setSchoolLists,
  addSchoolInfos,
  removeSchoolInfos,
  setSchoolDocuments,
} = mapSlice.actions;
export default mapSlice.reducer;
