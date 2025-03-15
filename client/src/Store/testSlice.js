import { createSlice } from "@reduxjs/toolkit";

export const testSlice = createSlice({
  name: "test",
  initialState: {
    test_id: "",
    student_id: "",
    proctor_settings: [],
    test_duration: 0,
    test_current_time: 0,
    lastUpdateTime: null,
    noise_score: 0,
    face_score: 0,
    mobile_score: 0,
    tab_score: 0,
    answers: {},
    flags: [],
    final_score: 0,
    permissions: {
      faceDetection: false,
      noiseDetection: false,
      tabSwitching: false,
    },
  },
  reducers: {
    setTestId: (state, action) => {
      state.test_id = action.payload;
    },
    setStudentId: (state, action) => {
      state.student_id = action.payload;
    },
    setProctorSettings: (state, action) => {
      state.proctor_settings = action.payload;
    },
    setTestDuration: (state, action) => {
      state.test_duration = action.payload;
    },
    IncrementTestCurrentTime: (state) => {
      const currentTime = new Date().getTime();
      const lastUpdateTime = state.lastUpdateTime
        ? new Date(state.lastUpdateTime).getTime()
        : currentTime;

      const timeElapsed = Math.floor((currentTime - lastUpdateTime) / 1000);

      if (state.test_duration > state.test_current_time + timeElapsed) {
        state.test_current_time += timeElapsed;
        state.lastUpdateTime = new Date().toISOString();
      } else {
        state.test_current_time = state.test_duration;
      }
    },
    saveAnswer: (state, action) => {
      const { questionId, answer, isMultiple } = action.payload;

      if (isMultiple) {
        state.answers[questionId] = "";
        const currentAnswers = state.answers[questionId]
          ? state.answers[questionId].split(",")
          : [];
        const index = currentAnswers.indexOf(answer);

        if (index !== -1) {
          currentAnswers.splice(index, 1);
        } else {
          currentAnswers.push(answer);
        }

        state.answers[questionId] = currentAnswers.join(",");
      } else {
        state.answers[questionId] = answer;
      }
    },

    setAnswers: (state, action) => {
      state.answers = action.payload;
    },
    updateProctoring: (state, action) => {
      const { noise_score, face_score, mobile_score, tab_score } =
        action.payload;
      state.noise_score += noise_score || 0;
      state.face_score += face_score || 0;
      state.mobile_score += mobile_score || 0;
      state.tab_score += tab_score || 0;
    },
    addFlag: (state, action) => {
      state.flags.push(action.payload);
    },
    setFinalScore: (state, action) => {
      state.final_score = action.payload;
    },
    resetTest: (state) => {
      state.test_id = "";
      state.student_id = "";
      state.proctor_settings = [];
      state.test_duration = 0;
      state.test_current_time = 0;
      state.lastUpdateTime = null;
      state.noise_score = 0;
      state.face_score = 0;
      state.mobile_score = 0;
      state.tab_score = 0;
      state.answers = {};
      state.flags = [];
      state.final_score = 0;
    },
    setPermissions: (state, action) => {
      const permissions = action.payload;
      state.permissions = { ...state.permissions, ...permissions };
    },
  },
});

export const selectProctoring = (state) => ({
  noise_score: state.test.noise_score,
  face_score: state.test.face_score,
  mobile_score: state.test.mobile_score,
  tab_score: state.test.tab_score,
  flags: state.test.flags,
});

export const {
  setTestId,
  setStudentId,
  setProctorSettings,
  setTestDuration,
  IncrementTestCurrentTime,
  saveAnswer,
  setAnswers,
  updateProctoring,
  addFlag,
  setFinalScore,
  resetTest,
  setPermissions,
} = testSlice.actions;

export default testSlice.reducer;
