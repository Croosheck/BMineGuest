import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase";

export const getUser = createAsyncThunk("user/getUser", async () => {
	const docRef = doc(db, "users", auth.currentUser.uid);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		const { email, name, registrationTimestamp, lastTimeLoggedIn } =
			docSnap.data();

		return { email, name };
	}
});

export const userSlice = createSlice({
	name: "user",
	initialState: {
		currentUser: "",
		reservationData: {},
		reservationDate: "",
	},
	reducers: {
		addReservationItem: (state, { payload }) => {
			state.reservationData = { ...state.reservationData, ...payload };
		},
		removeReservationItem: (state, { payload }) => {
			state.reservationData = { ...state.reservationData, ...payload };
		},
		pickDate: (state, { payload }) => {
			state.reservationDate = payload;
		},
		clearDate: (state) => {
			state.reservationDate = "";
		},
		logoutUser: (state) => {
			state.currentUser = "";
		},
	},
	extraReducers: {
		[getUser.fulfilled]: (state, { payload }) => {
			state.currentUser = payload;
		},
	},
});

export const {
	addReservationItem,
	removeReservationItem,
	pickDate,
	clearDate,
	logoutUser,
} = userSlice.actions;

export default userSlice.reducer;
