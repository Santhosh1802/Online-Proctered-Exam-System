import { createSlice } from "@reduxjs/toolkit";

export const testSlice = createSlice({
  name: "test",
  initialState: {
    test_id: "",
    student_id: "",
    proctor_settings: [],
    test_duration: 0, // in seconds
    test_current_time: 0, // in seconds
    lastUpdateTime: null,
    noise_score: 0,
    face_score: 0,
    mobile_score: 0,
    tab_score: 0,
    answers: {}, // Stores answers: { question_id: answer }
    flags: [],   // Stores malpractice flags
    final_score: 0, // Final score after submission
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
      const lastUpdateTime = state.lastUpdateTime ? new Date(state.lastUpdateTime).getTime() : currentTime;

      const timeElapsed = Math.floor((currentTime - lastUpdateTime) / 1000);

      if (state.test_duration > state.test_current_time + timeElapsed) {
        state.test_current_time += timeElapsed;
        state.lastUpdateTime = new Date().toISOString();
      } else {
        state.test_current_time = state.test_duration; // Test time is up
      }
    },
    saveAnswer: (state, action) => {
      const { questionId, answer, isMultiple } = action.payload;
    
      if (isMultiple) {
        if (!Array.isArray(state.answers[questionId])) {
          state.answers[questionId] = []; // Ensure the value starts as an array
        }
    
        const index = state.answers[questionId].indexOf(answer);
        if (index !== -1) {
          // If the answer already exists, remove it (unchecking)
          state.answers[questionId] = state.answers[questionId].filter(ans => ans !== answer);
        } else {
          // If not selected, add the new answer
          state.answers[questionId].push(answer);
        }
      } else {
        // Single-choice: replace with new answer
        state.answers[questionId] = [answer];
      }
    },    
         
    setAnswers: (state, action) => {
      state.answers = action.payload;
    },
    updateProctoring: (state, action) => {
      const { noise_score, face_score, mobile_score, tab_score } = action.payload;
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
    submitTest: (state) => {
      // Logic to submit the test could go here if needed
      // For now, this can reset or prepare data for submission
      console.log("Test submitted:", {
        test_id: state.test_id,
        student_id: state.student_id,
        answers: state.answers,
        final_score: state.final_score,
        proctoring: {
          noise_score: state.noise_score,
          face_score: state.face_score,
          mobile_score: state.mobile_score,
          tab_score: state.tab_score,
          flags: state.flags,
        },
        duration_taken: state.test_current_time,
      });
    },
    resetTest: (state) => {
      // Reset the state after test submission
      state.test_id = "";
      state.student_id = "";
      state.proctor_settings = [];
      state.test_duration = "";
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
  },
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
  submitTest,
  resetTest,
} = testSlice.actions;

export default testSlice.reducer;