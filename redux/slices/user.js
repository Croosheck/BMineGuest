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
		currentUser: null,
		placesList: [],
	},
	reducers: {
		logoutUser: (state) => {
			state.currentUser = null;
		},
		loadPlaces: (state, { payload }) => {
			state.placesList = [...state.placesList, payload];
		},
		clearPlaces: (state) => {
			state.placesList = [];
		},
	},
	extraReducers: {
		[getUser.fulfilled]: (state, { payload }) => {
			state.currentUser = payload;
		},
	},
});

export const { logoutUser, loadPlaces, clearPlaces } = userSlice.actions;

export default userSlice.reducer;
