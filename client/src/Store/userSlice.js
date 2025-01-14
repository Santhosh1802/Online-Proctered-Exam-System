import { createSlice } from "@reduxjs/toolkit";
export const userSlice=createSlice({
    name:"user",
    initialState:{
        id:"",
        user_type:"",
        email:"",
        loggedIn:false,
    },
    reducers:{
        setId:(state,action)=>{
            state.id=action.payload;
            state.loggedIn=true;
        },
        setUserType:(state,action)=>{
            state.user_type=action.payload;
        },
        setStoreEmail:(state,action)=>{
            state.email=action.payload;
        },
        logout:(state)=>{
            state.id="";
            state.user_type="";
            state.email="";
            state.loggedIn=false;
        }
    }
})

export const {setId,setUserType,setStoreEmail}=userSlice.actions
export default userSlice.reducer