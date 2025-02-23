import { createSlice } from "@reduxjs/toolkit";
export const testSlice=createSlice({
    name:"test",
    initialState:{
        test_id:"",
        student_id:"",
        proctor_settings:[],
        test_duration:"",
        test_current_time:"",
        noise_score:0,
        face_score:0,
        mobile_score:0,
        tab_score:0,
    },
    reducers:{
        setTestId:(state,action)=>{
            state.test_id=action.payload;
        },
        setStudentId:(state,action)=>{
            state.student_id=action.payload;
        },
        setProctorSettings:(state,action)=>{
            state.proctor_settings=action.payload;
        },
        setTestDuration:(state,action)=>{
            state.test_duration=action.payload;
        },
        IncrementTestCurrentTime:(state)=>{
            if(state.test_duration>state.test_current_time){
                state.test_current_time+=1;
            }
        }
    }
})

export const{setTestId,setStudentId,setProctorSettings,setTestDuration,IncrementTestCurrentTime}=testSlice.actions;
export default testSlice.reducer;